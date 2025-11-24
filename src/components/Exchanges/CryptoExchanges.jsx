import React, { useEffect, useState } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { CoingeckoSanakApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Footer from "../../Footer/Footer";

const CryptoExchanges = () => {
  const [CryptoExchangesList, setCryptoExchangesList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(100);
  const [isLoading, setIsLoading] = useState(false);

  const LoadingSpinner = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
        <p className="text-white text-lg font-semibold animate-pulse">Loading Exchanges...</p>
      </div>
    );
  };

  useEffect(() => {
    const FetchExchanges = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/exchanges?per_page=${coinsPerPage}&page=${currentPage}`,
          CoingeckoSanakApi
        );
        const ExchangesList = await response.json();
        setCryptoExchangesList(ExchangesList);
      } catch (error) {
        console.error("Error fetching exchanges:", error);
      } finally {
        setIsLoading(false);
      }
    };
    FetchExchanges();
  }, [currentPage, coinsPerPage]);

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="bg-black">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="bg-gradient-to-r from-[#3f4c6b] to-[#606c88]">
        <h1 className="ml-5 relative top-10 text-[6vw] xsmall:text-[4.5vw] small:text-[4vw] medium:text-[3vw] large:text-[2.5vw] xlarge:text-[2vw] text-yellow-400 font-semibold">
          Top Crypto Exchanges Ranked by Trust Score
        </h1>
        <p className="text-sky-500 ml-5 relative top-10 mt-2 text-[4vw] xsmall:text-[3vw] small:text-[2.5vw] medium:text-[2vw] large:text-[1.5vw] xlarge:text-[1.2vw]">
          As of today, we track 216 crypto exchanges with a total 24h trading
          volume of $418 Billion, a 35.63% change in the last 24 hours.
          Currently, the 3 largest cryptocurrency exchanges are Binance, Bybit,
          and OKX. Total tracked crypto exchange reserves currently stands at
          $244 Billion.
        </p>
        <div className="bg-gradient-to-r from-[#3f4c6b] to-[#606c88] mt-[14vh] px-2">
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="overflow-x-auto w-full 2xlarge:w-[90vw]  2xlarge:mx-auto border-2 border-yellow-400 rounded-lg">
                <table className="min-w-full bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg">
                  {/* Rest of the table code remains the same */}
                  <thead className="bg-gradient-to-r from-purple-900 to-indigo-900">
                    <tr>
                      <th className="sticky left-0 z-10 bg-gradient-to-br from-purple-300 to-indigo-400 px-2 py-2 xsmall:px-3 xsmall:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        #
                      </th>
                      <th className="sticky left-7 xsmall:left-10 z-10 bg-gradient-to-br from-purple-300 to-indigo-400 px-3 py-2 xsmall:px-6 xsmall:py-3 text-left text-xs font-medium text-white uppercase tracking-wider max-w-[120px] xsmall:max-w-[200px]">
                        Exchange
                      </th>
                      <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[10vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Trust Score
                      </th>
                      <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[10vw]  bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-wrap text-white uppercase tracking-wider">
                        24h Volume(Normalized)
                      </th>
                      <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[30vw] whitespace-nowrap xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                        24h Volume
                      </th>
                      <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Launched
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gradient-to-l from-[#2c3e50] to-[#bdc3c7] divide-y divide-gray-200">
                    {CryptoExchangesList &&
                      CryptoExchangesList.map((coin, index) => (
                        <tr key={coin.id} className="hover:bg-gray-50">
                          <td className="sticky left-0 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-gray-500">
                            {(currentPage - 1) * coinsPerPage + index + 1}
                          </td>
                          <td className="sticky left-7 xsmall:left-9 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:px-3 xsmall:py-4 min-w-[150px] xsmall:max-w-[200px]">
                            <div className="flex items-center">
                              <Link to={`/en/exchanges/${coin.id}`}>
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
                          <td className="px-5 py-2 xsmall:px-6 xsmall:py-4 text-black font-bold whitespace-nowrap text-xs xsmall:text-sm">
                            <span className="bg-green-300 rounded-lg p-1">
                              {coin?.trust_score}/10
                            </span>
                          </td>
                          <td className="px-8 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-bold">
                            ₹{" "}
                            {coin?.trade_volume_24h_btc_normalized?.toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </td>
                          <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-bold text-black">
                            <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                              ₹{" "}
                              {coin?.trade_volume_24h_btc?.toLocaleString(
                                "en-IN",
                                {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }
                              )}
                            </h1>
                          </td>
                          <td className="px-5 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-bold text-black ">
                            <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                              {coin?.year_established}
                            </h1>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-center gap-4 py-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg text-white font-semibold ${
                    currentPage === 1
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  Previous
                </button>
                <span className="flex items-center text-white font-semibold">
                  Page {currentPage}
                </span>
                <button
                  onClick={handleNextPage}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default CryptoExchanges;