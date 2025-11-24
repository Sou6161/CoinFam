import { useEffect, useState } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { CoinGeckoChaloApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import { Link } from "react-router-dom";
import Footer from "../../Footer/Footer";
import LatestArticlesData from "../../LatestArticles/LatestArticlesData";
import { Plus, Star, Check, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWatchlistCoins,
  removeFromWatchlistcoins,
} from "../../ReduxSlice/WatchlistCoinsSlice";

const TopGainerAndLosers = () => {
  const [TopCryptoGainers, setTopCryptoGainers] = useState(null);
  const [TopCryptoLosers, setTopCryptoLosers] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(50);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [portfolios] = useState(["Add to My Portfolio"]);
  const [watchlistCoins, setWatchlistCoins] = useState(new Set());
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedCoinToRemove, setSelectedCoinToRemove] = useState(null);
  const watchlistCoinsredux = useSelector((state) => state.watchlist.coins);

  const dispatch = useDispatch();

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

  const handleRemoveConfirm = () => {
    if (selectedCoinToRemove) {
      dispatch(removeFromWatchlistcoins(selectedCoinToRemove));
      setWatchlistCoins((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedCoinToRemove);
        return newSet;
      });
    }
    setShowRemoveDialog(false);
    setSelectedCoinToRemove(null);
  };

  // Add this useEffect hook
  useEffect(() => {
    localStorage.setItem(
      "watchlistState",
      JSON.stringify({ coins: Array.from(watchlistCoins) })
    );
  }, [watchlistCoins]);

  const handleRemoveCancel = () => {
    setShowRemoveDialog(false);
    setSelectedCoinToRemove(null);
  };

  const renderWatchlistCell = (coin, index) => {
    return (
      <td className="sticky left-0 z-20 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (watchlistCoinsredux.includes(coin.id)) {
                setSelectedCoinToRemove(coin.id);
                setShowRemoveDialog(true);
              } else {
                handleStarClick(index, e);
              }
            }}
            className="hover:text-yellow-500 focus:outline-none"
          >
            {watchlistCoinsredux.includes(coin.id) ? (
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
          {activeDropdown === index &&
            !watchlistCoinsredux.includes(coin.id) && (
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

  const handleStarClick = (index, event) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handlePortfolioSelect = (coinId, portfolio, event) => {
    event.stopPropagation();
    dispatch(addToWatchlistCoins(coinId)); // Dispatch action to add coin to watchlist
    setWatchlistCoins((prev) => new Set([...prev, coinId]));
    setActiveDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const renderPercentageChange = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-500">N/A</span>;
    }
    const formattedValue = value.toFixed(2);
    const colorClass =
      value >= 0 ? "text-green-500 blink-green" : "text-red-500 blink-red";
    return (
      <span className={`font-semibold ${colorClass}`}>
        <span style={{ color: value < 0 ? "red" : "" }}>
          {value < 0 ? "" : "+"}
          {formattedValue}%
        </span>
      </span>
    );
  };

  useEffect(() => {
    const FetchTopGainersLosersHL = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=100&page=1",
        CoinGeckoChaloApi
      )
        .then((response) => response.json())
        .then((data) => {
          // Sort coins by 24-hour price change percentage
          const sortedCoins = data.sort(
            (a, b) =>
              b.price_change_percentage_24h - a.price_change_percentage_24h
          );

          // Get top 10 gainers
          const gainers = sortedCoins.slice(0, 30);
          setTopCryptoGainers(gainers);

          // Get top 10 losers
          const losers = sortedCoins.slice(-30).reverse();
          setTopCryptoLosers(losers);
        })
        .catch((error) => console.error(error));
    };
    FetchTopGainersLosersHL();
  }, []);

  useEffect(() => {
    TopCryptoGainers && console.log(TopCryptoGainers, " Top Crypto Gainers");
    TopCryptoLosers && console.log(TopCryptoLosers, "Top Crypto Losers ");
  }, [TopCryptoGainers, TopCryptoLosers]);

  return (
    <>
      <div className=" ">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className=" bg-gradient-to-r from-[#3f4c6b] to-[#606c88] ">
        <h1 className="text-[6vw] xsmall:text-[5vw] small:text-[4.3vw] medium:text-[2.8vw] large:text-[2.8vw] xlarge:text-[2vw] 2xlarge:text-[1.7vw] text-cente text-yellow-400 ml-5 pt-10 pb-2 font-semibold">
          Top Crypto Gainers and Losers
        </h1>
        <p className="text-sky-500  ml-5 relative top-3 mt-2 text-[4vw] xsmall:text-[3.5vw] small:text-[3vw] medium:text-[2vw] large:text-[2vw] xlarge:text-[1.7vw] 2xlarge:text-[1.3vw]">
          Discover the largest gainers and losers across all major
          cryptocurrencies listed on CoinGecko, based on price movements in the
          last 24 hours.
        </p>

        <h1 className=" relative top-[10vh] ml-5 font-semibold text-[6vw] xsmall:text-[5vw] small:text-[4vw] medium:text-[3vw] large:text-[2.5vw] xlarge:text-[2vw] 2xlarge:text-[1.5vw] text-center text-yellow-400">
          🚀 Top Gainers
        </h1>
        <div className=" bg-gradient-to-r from-[#3f4c6b] to-[#606c88] mt-[14vh] px-2 ">
          <div className="overflow-x-auto w-[92vw] medium:w-[70vw] large:w-[65vw] xlarge:w-[70vw] 2xlarge:w-[80vw]  mx-auto border-2 border-yellow-400 rounded-lg">
            <table className="min-w-full bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg">
              <thead className="bg-gradient-to-r from-purple-900 to-indigo-900">
                <tr>
                  {/* <th className="sticky left-0 z-10 bg-gray-400 px-2 py-2 xsmall:px-3 xsmall:py-3 text-left text-xs font-medium text-black uppercase tracking-wider w-8">
                    ★
                  </th> */}
                  <th className="sticky left-0 z-10 bg-gradient-to-br from-purple-300 to-indigo-400 px-2 py-2 xsmall:px-3 xsmall:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    #
                  </th>
                  <th className="sticky left-7 xsmall:left-8 z-10 bg-gradient-to-br from-purple-300 to-indigo-400 px-3 py-2 xsmall:px-6 xsmall:py-3 text-center text-xs font-medium text-white  uppercase tracking-wider max-w-[120px] xsmall:max-w-[200px]">
                    Coin
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    24h
                  </th>
                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Total Vol
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gradient-to-l from-[#2c3e50] to-[#bdc3c7] divide-y divide-gray-200">
                {TopCryptoGainers &&
                  TopCryptoGainers.map((coin, index) => (
                    <tr key={coin.id} className="hover:bg-gray-50">
                      {/* {renderWatchlistCell(coin, index)} */}
                      <td className="sticky left-0 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500">
                        {(currentPage - 1) * coinsPerPage + index + 1}
                      </td>
                      <td className="sticky left-7 xsmall:left-8 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:px-3 xsmall:py-4 min-w-[150px] xsmall:max-w-[200px]">
                        <div className="flex items-center ">
                          <Link to={`/en/coins/${coin.id}`}>
                            <div className="flex items-center space-x-2 ">
                              <img
                                className="w-6 h-6 rounded-full object-cover"
                                src={coin?.image}
                                alt={coin.name}
                              />
                              <span className="text-sm font-medium text-wrap  text-gray-900">
                                {coin.name}
                              </span>
                            </div>
                          </Link>
                        </div>
                      </td>
                      <td className="px-3 py-2 xsmall:px-6 xsmall:py-4 text-black font-bold  whitespace-nowrap text-xs xsmall:text-sm">
                        ₹{" "}
                        {coin?.current_price?.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold">
                        {renderPercentageChange(
                          coin.price_change_percentage_24h
                        )}
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-black">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          $
                          {coin.total_volume
                            ? coin.total_volume.toLocaleString()
                            : "N/A"}
                        </h1>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <h1 className=" relative top-[10vh] ml-5 font-semibold text-[6vw] xsmall:text-[5vw] small:text-[4vw] medium:text-[3vw] large:text-[2.5vw] xlarge:text-[2vw] 2xlarge:text-[1.5vw] text-center text-yellow-400">
          📉 Top Losers
        </h1>
        <div className=" bg-gradient-to-r from-[#3f4c6b] to-[#606c88] mt-[14vh] px-2 ">
          <div className="overflow-x-auto mx-auto w-[92vw] medium:w-[70vw] large:w-[65vw] xlarge:w-[70vw] 2xlarge:w-[80vw] border-2 border-purple-500 rounded-lg">
            <table className="min-w-full bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg">
              <thead className="bg-gradient-to-r from-purple-900 to-indigo-900">
                <tr>
                  {/* <th className="sticky left-0 z-10 bg-gray-400 px-2 py-2 xsmall:px-3 xsmall:py-3 text-left text-xs font-medium text-black uppercase tracking-wider w-8">
                    ★
                  </th> */}
                  <th className="sticky left-0 z-10 bg-gradient-to-br from-purple-300 to-indigo-400 px-2 py-2 xsmall:px-3 xsmall:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    #
                  </th>
                  <th className="sticky left-7 xsmall:left-8 z-10 bg-gradient-to-br from-purple-300 to-indigo-400 px-3 py-2 xsmall:px-6 xsmall:py-3 text-center text-xs font-medium text-white  uppercase tracking-wider max-w-[120px] xsmall:max-w-[200px]">
                    Coin
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Price
                  </th>

                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    24h
                  </th>

                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Total Vol
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gradient-to-l from-[#2c3e50] to-[#bdc3c7] divide-y divide-gray-200">
                {TopCryptoLosers &&
                  TopCryptoLosers.map((coin, index) => (
                    <tr key={coin.id} className="hover:bg-gray-50">
                      {/* {renderWatchlistCell(coin, index)} */}
                      <td className="sticky left-0 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500">
                        {(currentPage - 1) * coinsPerPage + index + 1}
                      </td>
                      <td className="sticky left-7 xsmall:left-8 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:px-3 xsmall:py-4 min-w-[150px] xsmall:max-w-[200px]">
                        <div className="flex items-center">
                          <Link to={`/en/coins/${coin.id}`}>
                            <div className="flex items-center space-x-2">
                              <img
                                className="w-6 h-6 rounded-full object-cover"
                                src={coin?.image}
                                alt={coin.name}
                              />
                              <span className="text-sm font-medium text-wrap text-gray-900">
                                {coin.name}
                              </span>
                            </div>
                          </Link>
                        </div>
                      </td>
                      <td className="px-3 py-2 xsmall:px-6 xsmall:py-4 text-black font-bold  whitespace-nowrap text-xs xsmall:text-sm">
                        ₹{" "}
                        {coin?.current_price?.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold">
                        {renderPercentageChange(
                          coin.price_change_percentage_24h
                        )}
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-black">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          $
                          {coin.total_volume
                            ? coin.total_volume.toLocaleString()
                            : "N/A"}
                        </h1>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="  medium:ml-12 xlarge:ml-20">
          <LatestArticlesData />
        </div>
      </div>
      <Footer />
      <RemoveDialog
        isOpen={showRemoveDialog}
        onClose={handleRemoveCancel}
        onConfirm={handleRemoveConfirm}
      />
    </>
  );
};

export default TopGainerAndLosers;
