import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import OnlyHeaderComp from '../Header Folder/OnlyHeaderComp';
import MainPageMarquee from '../MarqueeComponent/MainPageMarquee';
import { setWatchlist } from '../../ReduxSlice/WatchlistCoinsSlice';

const MyWatchListCoins = () => {
  const [watchlistData, setWatchlistData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const watchlistIds = useSelector((state) => state.watchlist.coins);
  const dispatch = useDispatch();

  // Check authentication state
  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = window.localStorage.getItem('isUserLoggedIn') === 'true';
      setIsUserLoggedIn(loggedIn);

      if (loggedIn) {
        const userId = window.localStorage.getItem('userId');
        const savedWatchlist = localStorage.getItem(`watchlistState_${userId}`);
        if (savedWatchlist) {
          const parsedWatchlist = JSON.parse(savedWatchlist);
          dispatch(setWatchlist(parsedWatchlist.coins));
        }
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  const fetchWatchlistData = async () => {
    setIsLoading(true);
    try {
      if (!watchlistIds.length) {
        setWatchlistData([]);
        setIsLoading(false);
        return;
      }

      // Batch requests to avoid rate limiting
      const batchSize = 10;
      const batches = [];
      for (let i = 0; i < watchlistIds.length; i += batchSize) {
        const batchIds = watchlistIds.slice(i, i + batchSize).join(',');
        batches.push(
          fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${batchIds}&order=market_cap_desc&sparkline=true&price_change_percentage=1h%2C24h%2C7d`)
            .then(res => {
              if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
              }
              return res.json();
            })
        );
      }

      const results = await Promise.all(batches);
      const coins = results.flat().filter(Boolean);
      setWatchlistData(coins);
    } catch (error) {
      console.error('Error fetching watchlist data:', error);
      // Handle rate limiting
      if (error.message.includes('429')) {
        // Wait and retry after 1 minute
        setTimeout(() => fetchWatchlistData(), 60000);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isUserLoggedIn && watchlistIds.length > 0) {
      fetchWatchlistData();
    } else {
      setWatchlistData([]);
      setIsLoading(false);
    }
  }, [watchlistIds, isUserLoggedIn]);

  const renderPercentageChange = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-500">N/A</span>;
    }
    const formattedValue = value.toFixed(2);
    const colorClass = value >= 0 ? "text-green-600" : "text-red-600";
    return <span className={`font-semibold ${colorClass}`}>{formattedValue}%</span>;
  };

  if (isLoading) {
    return (
      <div className="loading-wave">
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
      </div>
    );
  }

  if (!isUserLoggedIn) {
    return (
      <>
        <OnlyHeaderComp />
        <MainPageMarquee />
        <div className="p-4">
          <div className="text-center py-8">
            <p className="text-gray-500">Please sign in to view your watchlist.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Watchlist</h1>
        {watchlistData.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No coins in your watchlist yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full border-2 border-purple-500 rounded-lg">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1h</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">7d</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-700/50">
                {watchlistData.map((coin) => (
                  <tr key={coin.id} className="hover:bg-slate-800/40">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{coin.name}</div>
                          <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${coin.current_price?.toFixed(2) || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderPercentageChange(coin.price_change_percentage_1h_in_currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderPercentageChange(coin.price_change_percentage_24h)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderPercentageChange(coin.price_change_percentage_7d_in_currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${coin.market_cap?.toLocaleString() || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default MyWatchListCoins;