import React, { useEffect, useState } from "react";
import { CoinGeckoSanderApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import { Link, useParams } from "react-router-dom";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import Footer from "../../Footer/Footer";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { useDispatch, useSelector } from "react-redux";

import { Plus, Star, Check, X } from "lucide-react";
import CryptoHighlightsData from "../CryptoHighlights/CryptoHighlightsData";
import {
  addToWatchlistCoins,
  removeFromWatchlistcoins,
} from "../../ReduxSlice/WatchlistCoinsSlice";

const AllCategoriesCoins = () => {
  const [CategoryCoinsList, setCategoryCoinsList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [coinsPerPage] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [portfolios] = useState(["Add to My Portfolio"]);
  const [watchlistCoins, setWatchlistCoins] = useState(new Set());
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedCoinToRemove, setSelectedCoinToRemove] = useState(null);
  const watchlistCoinsredux = useSelector((state) => state.watchlist.coins);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isWatchlisted, setisWatchlisted] = useState(false)

  const { id } = useParams();
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

  // Add this dialog component at the top of your file, just after the RemoveDialog component
  const AuthCheckDialog = ({ isOpen, onClose, onSignUp }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Sign in Required
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

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onSignUp}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium"
            >
              Sign In / Sign Up
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

  // Add this useEffect to check login status
  useEffect(() => {
    const storedLoginStatus = window.localStorage.getItem("isUserLoggedIn");
    if (storedLoginStatus === "true") {
      setIsUserLoggedIn(true);
    }
  }, []);

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
              if (!isUserLoggedIn && !isWatchlisted) {
                setShowAuthDialog(true);
                return;
              }
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

  const renderPercentageChange = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-500">N/A</span>;
    }
    const formattedValue = value.toFixed(2);
    const colorClass =
      value >= 0 ? "text-green-600 blink-green" : "text-red-600 blink-red";
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
    const FetchCategoryCoins = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=${id}&order=market_cap_desc&per_page=${coinsPerPage}&page=${currentPage}&sparkline=true&price_change_percentage=1h%2C24h%2C7d`,
        CoinGeckoSanderApi
      );
      const data = await response.json();
      // console.log(data);
      setCategoryCoinsList(data);
    };
    FetchCategoryCoins();
  }, [currentPage]);

  useEffect(() => {
    CategoryCoinsList &&
      console.log(CategoryCoinsList, "Category Coins List 50 Coins");
  }, [CategoryCoinsList]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleStarClick = (index, event) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  // Modify your handlePortfolioSelect function
  const handlePortfolioSelect = (coinId, portfolio, event) => {
    event.stopPropagation();
    if (!isUserLoggedIn) {
      setShowAuthDialog(true);
      setActiveDropdown(null);
      return;
    }
    dispatch(addToWatchlistCoins(coinId)); // Dispatch action to add coin to watchlist
    setWatchlistCoins((prev) => new Set([...prev, coinId]));
    setActiveDropdown(null);

    // Update localStorage
    const currentWatchlist = JSON.parse(
      localStorage.getItem("watchlistState") || '{"coins":[]}'
    );
    if (!currentWatchlist.coins.includes(coinId)) {
      currentWatchlist.coins.push(coinId);
      localStorage.setItem("watchlistState", JSON.stringify(currentWatchlist));
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <div className="">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>

      <div className="bg-black text-white">
        <h1 className=" ml-5 relative top-10 text-[4vw]">
          Top {id} Coins by Market Cap
        </h1>
        <p className=" text-gray-500 ml-5 relative top-10 mt-2 text-[4vw]">
          The {id} market cap today is $1.92 Trillion, a -0.4% change in the
          last 24 hours.
        </p>

        <div className=" bg-black mt-[10vh] px-2 ">
          <div className="overflow-x-auto   w-full border-2 border-purple-500 rounded-lg">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="sticky left-0 z-10 bg-gray-400 px-2 py-2 xsmall:px-3 xsmall:py-3 text-left text-xs font-medium text-black uppercase tracking-wider w-8">
                    ★
                  </th>
                  <th className="sticky left-0 z-10 bg-gray-400 px-2 py-2 xsmall:px-3 xsmall:py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                    #
                  </th>
                  <th className="sticky left-7 xsmall:left-10 z-10 bg-gray-400 px-3 py-2 xsmall:px-6 xsmall:py-3 text-left text-xs font-medium text-black  uppercase tracking-wider max-w-[120px] xsmall:max-w-[200px]">
                    Coin
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    1h
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    24h
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    7d
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Total volume
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Market Cap
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-black uppercase tracking-wider">
                    Last 7 Days
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {CategoryCoinsList &&
                  CategoryCoinsList.map((coin, index) => (
                    <tr key={coin.id} className="hover:bg-gray-50">
                      {renderWatchlistCell(coin, index)}
                      <td className="sticky left-0 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500">
                        {(currentPage - 1) * coinsPerPage + index + 1}
                      </td>
                      <td className="sticky left-7 xsmall:left-9 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:px-3 xsmall:py-4 max-w-[150px] xsmall:max-w-[200px]">
                        <div className="flex items-center">
                          <Link to={`/en/coins/${coin.id}`}>
                            <div className="flex items-center space-x-2">
                              <img
                                className="w-6 h-6 rounded-full object-cover"
                                src={coin?.image}
                                alt={coin.name}
                              />
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {coin.name}
                              </span>
                            </div>
                          </Link>
                        </div>
                      </td>
                      <td className="px-3 py-2 xsmall:px-6 xsmall:py-4 text-black font-bold  whitespace-nowrap text-xs xsmall:text-sm">
                        ${coin?.current_price.toLocaleString()}
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold">
                        {renderPercentageChange(
                          coin.price_change_percentage_1h_in_currency
                        )}
                      </td>
                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold">
                        {renderPercentageChange(
                          coin.price_change_percentage_24h_in_currency
                        )}
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold">
                        {renderPercentageChange(
                          coin.price_change_percentage_7d_in_currency
                        )}
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-gray-500">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          $
                          {coin.total_volume
                            ? coin.total_volume.toLocaleString()
                            : "N/A"}
                        </h1>
                      </td>

                      <td className="px-3 py-2 font-bold xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500">
                        $
                        {coin.market_cap
                          ? Number(coin.market_cap)
                              .toFixed(0)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : "N/A"}
                      </td>

                      <td
                        className="px-3 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500"
                        style={{ minWidth: "150px" }}
                      >
                        {coin?.sparkline_in_7d &&
                        coin?.sparkline_in_7d.price ? (
                          <CoinSparkline
                            coinData={coin.sparkline_in_7d.price}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between bg-black items-center mt-5  px-3 xsmall:px-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 xsmall:py-2 xsmall:px-4 rounded text-sm xsmall:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-cyan-600 ml-2 xsmall:ml-3 font-semibold text-lg xsmall:text-sm">
            Page {currentPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={
              CategoryCoinsList && CategoryCoinsList.length < coinsPerPage
            }
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 xsmall:py-2 xsmall:px-4 rounded text-sm xsmall:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

      </div>
      <Footer />
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

export default AllCategoriesCoins;
