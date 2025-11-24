import React, { useEffect, useState } from "react";
import CryptoAreaChartForTable from "../Charts/MarketCap/MarketCapChartForTable";
import { useDispatch, useSelector } from "react-redux";
import {
  addCGCoinGraphData,
  addCGCoinId,
  addCGCoinSymbol,
} from "../ReduxSlice/CGCoinTableGraphSlice";
import {
  addToWatchlistCoins,
  clearWatchlist,
  removeFromWatchlistcoins,
} from "../ReduxSlice/WatchlistCoinsSlice";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { Link } from "react-router-dom";
import { Plus, Star, Check, X } from "lucide-react";

// Custom Dialog Component
const RemoveDialog = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Remove coin from portfolio
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Do you really want to remove this coin? This cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

// Auth Dialog Component
const AuthCheckDialog = ({ isOpen, onClose, onSignUp }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Authentication Required
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          Please sign in or create an account to add coins to your watchlist.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={onSignUp}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

const CoinSparkline = ({ coinData }) => {
  const trend =
    coinData[coinData.length - 1] > coinData[0] ? "#00FF00" : "#FF0000";
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBlink((prevBlink) => !prevBlink);
    }, 1000); // blink every 500ms
    return () => clearInterval(intervalId);
  }, []);

  const getBlinkColor = () => {
    if (trend === "#00FF00") {
      return blink ? "#2E865F" : "#64f86e"; // blink between dark green and light green
    } else {
      return blink ? "#fc6060" : "#ff001e"; // blink between light red and dark red
    }
  };

  return (
    <Sparklines data={coinData} width={300} height={70}>
      <SparklinesLine
        color={getBlinkColor()} // blink between different shades
        style={{ strokeWidth: 2 }}
      />
    </Sparklines>
  );
};

const CryptoPricesTable = () => {
  const [allCoinsList, setAllCoinsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [CGCoinId, setCGCoinId] = useState([]);
  const [CGcoinSymbol, setCGcoinSymbol] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [portfolios] = useState(["Add to My Portfolio"]);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedCoinToRemove, setSelectedCoinToRemove] = useState(null);
  const watchlistCoinsredux = useSelector((state) => state.watchlist.coins);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [watchlistCoins, setWatchlistCoins] = useState([]);
  const dispatch = useDispatch();

  const coinsPerPage = 100;

  // Add this useEffect to check login status
  useEffect(() => {
    const storedLoginStatus = window.localStorage.getItem("isUserLoggedIn");
    if (storedLoginStatus === "true") {
      setIsUserLoggedIn(true);
    }
  }, []);

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const isLoggedIn = window.localStorage.getItem("isUserLoggedIn") === "true";
    const userId = window.localStorage.getItem("userId");

    if (isLoggedIn && userId) {
      const savedWatchlist = localStorage.getItem(`watchlistState_${userId}`);
      if (savedWatchlist) {
        const parsedWatchlist = JSON.parse(savedWatchlist);
        parsedWatchlist.coins.forEach((coinId) => {
          if (!watchlistCoinsredux.includes(coinId)) {
            dispatch(addToWatchlistCoins(coinId));
          }
        });
      }
    } else {
      // Clear watchlist if not logged in
      dispatch(clearWatchlist());
    }
  }, [isUserLoggedIn]); // Add isUserLoggedIn to dependencies

  const handleRemoveConfirm = () => {
    if (selectedCoinToRemove) {
      dispatch(removeFromWatchlistcoins(selectedCoinToRemove));
    }
    setShowRemoveDialog(false);
    setSelectedCoinToRemove(null);
  };

  const handleRemoveCancel = () => {
    setShowRemoveDialog(false);
    setSelectedCoinToRemove(null);
  };

  const renderWatchlistCell = (coin, index) => {
    const isWatchlisted = watchlistCoinsredux.includes(coin.id);

    return (
      <td className="sticky left-0 z-20 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isUserLoggedIn && !isWatchlisted) {
                setShowAuthDialog(true);
                return;
              }
              if (isWatchlisted) {
                setSelectedCoinToRemove(coin.id);
                setShowRemoveDialog(true);
              } else {
                handleStarClick(index, e);
              }
            }}
            className="hover:text-yellow-500 focus:outline-none"
          >
            {isWatchlisted ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Star
                size={16}
                className={`transition-colors ${
                  activeDropdown === index
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-400"
                }`}
              />
            )}
          </button>
          {activeDropdown === index && !isWatchlisted && (
            <div
              className="absolute ml-7 mb-2 -mt-5 left-0 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30"
              style={{ transform: "translateY(-8px)" }}
            >
              <div className="py-1">
                {portfolios.map((portfolio) => (
                  <button
                    key={portfolio}
                    className="block w-full flex text-left px-4 py-1 font-semibold text-sm text-gray-700 hover:bg-gray-100"
                    onClick={(e) =>
                      handlePortfolioSelect(coin.id, portfolio, e)
                    }
                  >
                    {portfolio} <Plus className="relative left-3" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </td>
    );
  };

  const renderPercentageChange = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-500">N/A</span>;
    }
    const formattedValue = value.toFixed(2);
    const colorClass =
      value >= 0 ? "text-green-500 blink-green" : "text-red-500 blink-red ";
    return (
      <span className={`font-semibold ${colorClass}`}>{formattedValue}%</span>
    );
  };

  const fetchCoins = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&page=${page}&sparkline=true&price_change_percentage=1h%2C24h%2C7d%2C14d%2C30d%2C200d%2C1y`
      );
      if (response.ok) {
        const coins = await response.json();
        if (Array.isArray(coins) && coins.length > 0) {
          // console.log(coins, "All CG Coins List per page 100");
          setAllCoinsList(coins);
          // console.log(coins)
          setHasNextPage(coins.length === coinsPerPage);

          // Map over coins and store IDs and symbols in state
          const coinIds = coins.map((coin) => coin.id);
          const coinSymbols = coins.map((coin) => coin.symbol);
          setCGCoinId(coinIds);
          setCGcoinSymbol(coinSymbols);

          // Dispatch to Redux store
          dispatch(addCGCoinId(coinIds));
          dispatch(addCGCoinSymbol(coinSymbols));
        } else {
          setHasNextPage(false);
        }
      } else if (response.status === 429) {
        console.error(
          "Rate limit exceeded. Waiting for 1 minute before retrying."
        );
        setTimeout(() => fetchCoins(page), 60000); // retry after 1 minute
      } else {
        console.error("Error fetching coin data:", response.status);
        setHasNextPage(false);
      }
    } catch (error) {
      console.error("Error fetching coin data:", error);
      setHasNextPage(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCoins(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleStarClick = (index, event) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Modify handlePortfolioSelect function
  const handlePortfolioSelect = (coinId, portfolio, event) => {
    event.stopPropagation();
    if (!isUserLoggedIn) {
      setShowAuthDialog(true);
      setActiveDropdown(null);
      return;
    }

    const userId = window.localStorage.getItem("userId");
    dispatch(addToWatchlistCoins(coinId));

    // Update localStorage with user-specific key
    const currentWatchlist = JSON.parse(
      localStorage.getItem(`watchlistState_${userId}`) || '{"coins":[]}'
    );
    if (!currentWatchlist.coins.includes(coinId)) {
      currentWatchlist.coins.push(coinId);
      localStorage.setItem(
        `watchlistState_${userId}`,
        JSON.stringify(currentWatchlist)
      );
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

  return (
    <>
      <div className="w-full">
      <div className="overflow-x-auto w-full border-2 border-yellow-400 rounded-lg">
          <table className="min-w-full bg-gradient-to-br from-cyan-100 to-teal-100 rounded-lg">
            <thead className="bg-gradient-to-r from-cyan-900 to-teal-900">
              <tr>
                <th className="sticky left-0 z-10 bg-gradient-to-br from-cyan-600 to-teal-600 px-2 py-2 xsmall:px-3 xsmall:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  #
                </th>
                <th className="sticky left-8 xsmall:left-9 z-10 bg-gradient-to-br from-cyan-600 to-teal-600 px-3 py-2 xsmall:px-6 xsmall:py-3 text-left text-xs font-medium text-white uppercase tracking-wider max-w-[120px] xsmall:max-w-[200px]">
                  Coin
                </th>
                <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-cyan-600/50 to-teal-600/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Price
                </th>
                <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-cyan-600/50 to-teal-600/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                  1h
                </th>
                <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-cyan-600/50 to-teal-600/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                  24h
                </th>
                <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-cyan-600/50 to-teal-600/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                  7d
                </th>
                <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-cyan-600/50 to-teal-600/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Total Volume
                </th>
                <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-cyan-600/50 to-teal-600/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Market Cap
                </th>
                <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-cyan-600/50 to-teal-600/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                  Last 7 Days
                </th>
              </tr>
            </thead>    
            <tbody className="bg-gradient-to-l from-[#2c3e50] to-[#bdc3c7] divide-y divide-gray-200">
              {allCoinsList.map((coin, index) => (
                <tr key={coin.id} className="hover:bg-gray-50">
                  {/* {renderWatchlistCell(coin, index)} */}
                  <td className="sticky left-0 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-black">
                    {(currentPage - 1) * coinsPerPage + index + 1}
                  </td>
                  <td className="sticky left-8 xsmall:left-9 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:px-3 xsmall:py-4 max-w-[150px] xsmall:max-w-[200px]">
                    <div className="flex items-center">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-4 h-4 xsmall:w-6 xsmall:h-6 mr-1 xsmall:mr-2"
                      />
                      <Link to={`/en/coins/${coin.id}`}>
                        <span className="text-[4vw] xsmall:text-sm 2xlarge:text-[1vw] font-medium w-[20vw] h-[6vh]  whitespace-normal xsmall:w-[33vw] text-gray-900 truncate ">
                          {coin.name}
                          <h1 className="flex flex-col text-gray-600 text-[3vw] xsmall:text-[2vw] large:text-[1.2vw] xlarge:text-[1vw] 2xlarge:text-[0.8vw]">
                            {coin?.symbol?.toUpperCase()}
                          </h1>
                        </span>
                      </Link>
                    </div>
                  </td>
                  <td className="px-3 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-black font-semibold">
                    $
                    {coin.current_price ? coin.current_price.toFixed(2) : "N/A"}
                  </td>
                  <td className="px-2 py-2 xsmall:px-4 xsmall:py-4 whitespace-nowrap font-semibold text-xs xsmall:text-sm">
                    {renderPercentageChange(
                      coin.price_change_percentage_1h_in_currency
                    )}
                  </td>
                  <td className="px-2 py-2 xsmall:px-4 xsmall:py-4 whitespace-nowrap font-semibold text-xs xsmall:text-sm ">
                    {renderPercentageChange(coin.price_change_percentage_24h)}
                  </td>
                  <td className="px-3 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm">
                    {renderPercentageChange(
                      coin.price_change_percentage_7d_in_currency
                    )}
                  </td>
                  <td className="px-3 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-black font-semibold">
                    <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                      $
                      {coin.total_volume
                        ? coin.total_volume.toLocaleString()
                        : "N/A"}
                    </h1>
                  </td>
                  <td className="px-3 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-black font-semibold  ">
                    $
                    {coin.market_cap ? coin.market_cap.toLocaleString() : "N/A"}
                  </td>
                  <td
                    className="px-3 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500"
                    style={{ minWidth: "150px" }}
                  >
                    {coin.sparkline_in_7d && coin.sparkline_in_7d.price ? (
                      <CoinSparkline coinData={coin.sparkline_in_7d.price} />
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4 px-3 xsmall:px-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold py-2 px-2 xsmall:py-2 xsmall:px-4 rounded text-sm xsmall:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-cyan-600 ml-2 xsmall:ml-3 font-semibold text-lg xsmall:text-sm">
            Page {currentPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold py-2 px-3 xsmall:py-2 xsmall:px-4 rounded text-sm xsmall:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
      <RemoveDialog
        isOpen={showRemoveDialog}
        onClose={handleRemoveCancel}
        onConfirm={handleRemoveConfirm}
      />
      <AuthCheckDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSignUp={() => {
          setShowAuthDialog(false);
          setIsSignUpOpen(true);
        }}
      />
    </>
  );
};

export default CryptoPricesTable;
