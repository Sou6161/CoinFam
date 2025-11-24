import React, { useEffect, useState } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { Link } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import Footer from "../../Footer/Footer";

const ExchangeDerivatives = () => {
  const [DerivativesList, setDerivativesList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(100);
  const [btcPrice, setBtcPrice] = useState(null);

  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr"
        );
        const data = await response.json();
        setBtcPrice(data.bitcoin.inr);
      } catch (error) {
        console.error("Error fetching BTC price:", error);
      }
    };
    fetchBtcPrice();
  }, []);

  useEffect(() => {
    const DerivativesList = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/derivatives/exchanges?order=open_interest_btc_desc&per_page=100&page=1&days=1"
        );
        const DervativesListData = await response.json();
        setDerivativesList(DervativesListData);
      } catch (error) {
        console.error("Error fetching derivatives list:", error);
      }
    };
    DerivativesList();
  }, []);

  const generateTimeSeriesData = (baseValue, type) => {
    const length = 50;
    let volatility = type === "volume" ? 0.4 : 0.25;
    const trendStrength = type === "volume" ? 0.3 : 0.2;

    return Array.from({ length }, (_, i) => {
      const primaryTrend = Math.sin(i / 8) * trendStrength;
      const secondaryTrend = Math.sin(i / 4) * (trendStrength * 0.5);
      const noise = (Math.random() - 0.5) * volatility;
      const value = baseValue * (1 + primaryTrend + secondaryTrend + noise);
      return {
        time: i,
        value: Math.max(value, baseValue * 0.7),
      };
    });
  };

  return (
    <>
      <div className="bg-black">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="bg-gradient-to-r from-[#3f4c6b] to-[#606c88] min-h-screen">
        <h1 className="ml-3 relative top-10 text-[6vw] xsmall:text-[4.5vw] small:text-[4vw] medium:text-[3vw] large:text-[2.5vw] xlarge:text-[2vw] text-yellow-400 font-semibold">
          Top Derivative Exchanges Ranked by Open Interest & Trade Volume
        </h1>
        <p className="text-sky-500 ml-3 relative top-10 mt-2 text-[4vw] xsmall:text-[3vw] small:text-[2.5vw] medium:text-[2vw] large:text-[1.5vw] xlarge:text-[1.2vw]">
          The total derivatives volume is $1.57 Trillion, a 32.65% change in the
          last 24 hours. We track 107 crypto derivative exchanges with Binance
          (Futures), OrangeX Futures, and Bybit (Futures) in the top 3 rankings.
        </p>

        <div className="bg-gradient-to-r from-[#3f4c6b] to-[#606c88] mt-[14vh] px-2">
          <div className="overflow-x-auto w-full 2xlarge:w-[90vw]  2xlarge:mx-auto border-2 border-yellow-400 rounded-lg">
            <table className="min-w-full bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg">
              <thead className="bg-gradient-to-r from-purple-900 to-indigo-900">
                <tr>
                  <th className="sticky left-0 z-10 bg-gradient-to-br from-purple-300 to-indigo-400 px-2 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                    #
                  </th>
                  <th className="sticky left-7 z-10 bg-gradient-to-br from-purple-300 to-indigo-400 px-3 py-2 text-left text-xs font-medium text-white uppercase tracking-wider max-w-[120px]">
                    Exchange
                  </th>
                  <th className="px-3 py-2 max-w-[50vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    24h Open Interest
                  </th>
                  <th className="px-4 py-2 max-w-[25vw] whitespace-nowrap bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    24h Volume
                  </th>
                  <th className="px-4 py-2 max-w-[25vw] whitespace-nowrap bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Futures
                  </th>
                  <th className="px-4 py-2 max-w-[25vw] whitespace-nowrap bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Open Interest (7d)
                  </th>
                  <th className="px-4 py-2 max-w-[25vw] whitespace-nowrap bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Volume (7d)
                  </th>
                  <th className="px-4 py-2 max-w-[25vw] whitespace-nowrap bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Launched
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gradient-to-l from-[#2c3e50] to-[#bdc3c7] divide-y divide-gray-200">
                {DerivativesList &&
                  DerivativesList.map((coin, index) => {
                    const openInterestData = generateTimeSeriesData(
                      coin.open_interest_btc * btcPrice,
                      "interest"
                    );
                    const volumeData = generateTimeSeriesData(
                      coin.trade_volume_24h_btc * btcPrice,
                      "volume"
                    );

                    return (
                      <tr key={coin.id} className="hover:bg-gray-50">
                        <td className="sticky left-0 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 whitespace-nowrap text-xs text-gray-500">
                          {(currentPage - 1) * coinsPerPage + index + 1}
                        </td>
                        <td className="sticky left-7 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 min-w-[150px]">
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
                        <td className="px-2 py-2 text-black font-bold whitespace-nowrap text-xs">
                          <span className="rounded-lg p-1">
                            ₹
                            {parseFloat(
                              coin?.open_interest_btc * btcPrice
                            ).toLocaleString("en-IN", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-bold text-black">
                          ₹{" "}
                          {parseFloat(
                            coin?.trade_volume_24h_btc * btcPrice
                          ).toLocaleString("en-IN", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className="px-5 py-2 whitespace-nowrap text-xs font-bold text-black">
                          <h1 className="inline-block px-1 rounded-xl font-bold">
                            {coin?.number_of_futures_pairs}
                          </h1>
                        </td>
                        <td className="px-2">
                          <div className="h-16 w-32">
                            {" "}
                            {/* Adjusted height and width */}
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={openInterestData}>
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#22c55e"
                                  strokeWidth={1}
                                  dot={false}
                                  isAnimationActive={false}
                                  connectNulls={true}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="h-16 w-32">
                            {" "}
                            {/* Adjusted height and width */}
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={volumeData}>
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#22c55e"
                                  strokeWidth={1}
                                  dot={false}
                                  isAnimationActive={false}
                                  connectNulls={true}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </td>
                        <td className="px-5 py-2 whitespace-nowrap text-xs font-semibold text-gray-500">
                          <h1 className="inline-block px-1 rounded-xl font-bold">
                            {coin?.year_established}
                          </h1>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ExchangeDerivatives;
