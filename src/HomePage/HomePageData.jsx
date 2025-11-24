import React, { useEffect, useState } from "react";
import AnimatedGridBackground from "../components/AllBackgrounds/AnimatedGridPatternTestBg";
import { useDispatch, useSelector } from "react-redux";
import { FaBitcoin, FaCaretDown, FaCaretUp, FaEthereum } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { CoinGeckoApi } from "../api/CoinGeckoApi/CoinGeckoApi";
import { TokenInsightApi } from "../api/CoinGeckoApi/TokenInsightApi";
import { VscTriangleDown, VscTriangleUp } from "react-icons/vsc";
import CryptoPricesTable from "../CryptoMarketTable.jsx/CryptoPricesTable";
import CryptoNews from "../CoinGeckoCryptoNews/CryptoNews";
import LatestArticlesData from "../LatestArticles/LatestArticlesData";
import Footer from "../Footer/Footer";
import { addHomePageMarketCapChart } from "../ReduxSlice/HomePageMCapChart";
import { SiBinance } from "react-icons/si";

const MainContainer = () => {
  const MarqueeData = useSelector((state) => state.Marquee?.MarqueeData);
  const MarqueeData2 = useSelector((state) => state.Marquee2?.MarqueeData2);
  const [GetTrendingCoins, setGetTrendingCoins] = useState(null);
  const [AllGainers, setAllGainers] = useState(null);
  const [AllLosers, setAllLosers] = useState(null);
  const [TopGainers, setTopGainers] = useState(null);
  const [TopLosers, setTopLosers] = useState(null);
  const [MarketCapChart, setMarketCapChart] = useState(null);
  const [MarketCapBNB, setMarketCapBNB] = useState(null);
  const dispatch = useDispatch();

  // Utility functions (assuming these are defined elsewhere)
  const formatPrice = (price) => price.toFixed(2);
  const formatPercentage = (percentage) => `${percentage.toFixed(2)}%`;

  useEffect(() => {
    const GetTrendingCoins = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/search/trending",
        CoinGeckoApi
      );
      const data = await response.json();
      // console.log(data, "Get trending coins");
      setGetTrendingCoins(data);
    };
    GetTrendingCoins();
  }, []);

  useEffect(() => {
    // GetTrendingCoins && console.log(GetTrendingCoins);
  }, [GetTrendingCoins]);

  useEffect(() => {
    const GetGainersLosers = async () => {
      const response = await fetch(
        "https://api.tokeninsight.com/api/v1/coins/top-gainers?range=-1",
        {
          ...TokenInsightApi,
          credentials: "same-origin",
        }
      );
      const data = await response.json();
      setAllGainers(data?.data);
    };
    GetGainersLosers();
  }, []);
  useEffect(() => {
    // AllGainers && console.log(AllGainers, "Get All Gainers");
  }, [AllGainers]);

  useEffect(() => {
    const GetAllLosers = async () => {
      const response = await fetch(
        "https://api.tokeninsight.com/api/v1/coins/top-losers?range=-1",
        {
          ...TokenInsightApi,
          credentials: "same-origin",
        }
      );
      const data = await response.json();
      setAllLosers(data?.data);
    };
    GetAllLosers();
  }, []);
  useEffect(() => {
    // AllLosers && console.log(AllLosers, "Get All Gainers");
  }, [AllLosers]);

  // function formatPrice(num) {
  //   return num?.toFixed(5);
  // }

  // function formatPercentage(num) {
  //   const formatted = num / 100;
  //   if (Math.abs(formatted) >= 10000) {
  //     return `${(formatted / 100000).toFixed(2)}%`;
  //   } else if (Math.abs(formatted) >= 1000) {
  //     return `${(formatted / 1000).toFixed(2)}%`;
  //   } else {
  //     return `${formatted.toFixed(2)}%`;
  //   }
  // }

  useEffect(() => {
    const MarketCapChartData = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum",
        CoinGeckoApi
      );
      const MCData = await response.json();
      // console.log(MCData);
      setMarketCapChart(MCData);
      // dispatch(addHomePageMarketCapChart(MCData?.data));
    };
    MarketCapChartData();
  }, []);

  useEffect(() => {
    if (MarketCapChart && MarketCapChart.length > 0) {
      // console.log(MarketCapChart);
    }
  }, [MarketCapChart]);

  useEffect(() => {
    const MarketCapChartDataBNB = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=binancecoin",
        CoinGeckoApi
      );
      const MarketDataBnb = await response.json();
      // console.log(MarketDataBnb);
      setMarketCapBNB(MarketDataBnb);
    };
    MarketCapChartDataBNB();
  }, []);

  useEffect(() => {
    if (MarketCapBNB && MarketCapBNB.length > 0) {
      // console.log(MarketCapBNB);
    }
  }, [MarketCapBNB]);

  {
    // MarqueeData2 && console.log(MarqueeData2, "Marquee Data 2 ");
  }
  {
    // MarqueeData && console.log(MarqueeData, "Marquee Data");
  }
  return (
    <>
    <div className="w-full mx-auto px-4 bg-black bg-gradient-to-r from-[#3f4c6b] to-[#606c88] overflow-x-hidden">
      {/* Global Market Overview */}
      <div className="bg-gradien-to-r from-[#F29492] to-[#114357] 2xlarge:mt-10 borde-2 border-teal-600 shadow-lg rounded-lg p-2 mb-6"
      >
        <h1 className=" relative top-10 left-0  2xlarge:-left-0 mb-10 2xlarge:mb-[10vh] z-5 text-[#fbbf24] text-[5vw] xsmall:text-[3.5vw] small:text-[3vw] medium:text-[2.5vw] large:text-[2vw] xlarge:text-[2vw] 2xlarge:text-[1.5vw] 2xlarge:left-[5vw] font-semibold">
          Cryptocurrency Prices by Market Cap
          <p className="large:relative large:z-99 text-sky-400 text-[3.5vw] xsmall:text-[2.5vw] small:text-[2.2vw] medium:text-[2vw] xlarge:text-[1.5vw] 2xlarge:text-[1vw] mt-2">
            The global cryptocurrency market cap today is{" "}
            {MarqueeData?.length > 0 && MarqueeData2?.length > 0 && (
              <span>
                {MarqueeData2[0].cap ? (
                  <span className="text-white">
                    {(MarqueeData2[0].cap / 1e12).toFixed(3)} Trillions, a{" "}
                    <span
                      className={`text-[3.5vw] xsmall:text-[2.5vw] small:text-[2.2vw] medium:text-[2vw]  xlarge:text-[1.5vw] relative top-1 small:top-1 xsmall:top-2 2xlarge:text-[1vw] inline-flex items-center ${
                        MarqueeData[0].data
                          .market_cap_change_percentage_24h_usd < 0
                          ? "text-red-500"
                          : "text-[#4BCC00]"
                      }`}
                    >
                      {MarqueeData[0].data
                        .market_cap_change_percentage_24h_usd >= 0 ? (
                        <FaCaretUp className="text-[4vw] small:text-[3vw] medium:text-[2.5vw] xlarge:text-[1.5vw] 2xlarge:text-[1vw]" />
                      ) : (
                        <FaCaretDown className="text-[4vw] small:text-[3vw] medium:text-[2.5vw] xlarge:text-[1.5vw] 2xlarge:text-[1vw]" />
                      )}
                      {MarqueeData[0].data.market_cap_change_percentage_24h_usd?.toFixed(
                        1
                      )}
                      %
                    </span>
                  </span>
                ) : (
                  ""
                )}
              </span>
            )}{" "}
            change in the last 24 hours.{" "}
            {/* <span className="text-purple-500 hover:text-orange-400 text-[3.5vw] xsmall:text-[2.5vw] medium:text-[2vw] 2xlarge:text-[1vw] hover:cursor-pointer hover:underline">
              Read more
            </span> */}
            <p className="mt-5">
              Total cryptocurrency trading volume in the last day is at{" "}
              <span className="text-lime-400">
                $
                {MarqueeData[0]?.data?.total_volume?.usd >= 1e12
                  ? (MarqueeData[0]?.data?.total_volume?.usd / 1e12).toFixed(
                      0
                    ) + " Trillion"
                  : MarqueeData[0]?.data?.total_volume?.usd >= 1e9
                  ? (MarqueeData[0]?.data?.total_volume?.usd / 1e9).toFixed(0) +
                    " Billion"
                  : MarqueeData[0]?.data?.total_volume?.usd >= 1e6
                  ? (MarqueeData[0]?.data?.total_volume?.usd / 1e6).toFixed(0) +
                    " Million"
                  : MarqueeData[0]?.data?.total_volume?.usd >= 1e3
                  ? (MarqueeData[0]?.data?.total_volume?.usd / 1e3).toFixed(0) +
                    "K"
                  : MarqueeData[0]?.data?.total_volume?.usd.toFixed(2)}{" "}
              </span>
              .Bitcoin dominance is at{" "}
              <span className="text-lime-400">
                {(MarqueeData2[0]?.btcDominance * 100).toFixed(2)}%
              </span>
              . CoinFam is now tracking{" "}
              <span className="text-lime-400">
                {MarqueeData[0]?.data?.active_cryptocurrencies.toLocaleString()}
              </span>{" "}
              cryptocurrencies.
            </p>
          </p>
        </h1>
      </div>

      {/* Market Cap Cards Row */}
      <div className="grid grid-cols-1 medium:grid-cols-2 large:grid-cols-3 gap-5 mb-6">
        {/* Top Cryptocurrencies Summary */}
        <div className="bg-gradient-to-r from-[#F29492] to-[#114357] border-2 border-teal-600 shadow-lg rounded-lg p-5">
          <div className="flex items-center mb-3">
            <FaBitcoin className="text-yellow-400 mr-2" size={24} />
            <h3 className="text-gray-800 font-semibold text-base">Bitcoin Market Cap</h3>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-xl font-bold text-black">
              ${MarqueeData2?.[0]?.cap?.toLocaleString("en-US")}
            </span>
            <span
              className={`flex items-center text-base font-semibold ${
                MarqueeData[0]?.data?.market_cap_change_percentage_24h_usd >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {MarqueeData[0]?.data?.market_cap_change_percentage_24h_usd >=
              0 ? (
                <FaCaretUp className="mr-1" />
              ) : (
                <FaCaretDown className="mr-1" />
              )}
              {MarqueeData[0]?.data?.market_cap_change_percentage_24h_usd?.toFixed(
                1
              )}
              %
            </span>
          </div>
        </div>

        {/* Ethereum Summary */}
        <div className="bg-gradient-to-r from-[#F29492] to-[#114357] border-2 border-teal-600 shadow-lg rounded-lg p-5">
          <div className="flex items-center mb-3">
            <FaEthereum className="text-blue-700 mr-2" size={24} />
            <h3 className="text-gray-800 font-semibold text-base">Ethereum Market Cap</h3>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-xl font-bold text-black">
              ${MarketCapChart?.[0]?.market_cap?.toLocaleString("en-US")}
            </span>
            <span
              className={`flex items-center text-base font-semibold ${
                MarketCapChart?.[0]?.market_cap_change_percentage_24h >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {MarketCapChart?.[0]?.market_cap_change_percentage_24h >= 0 ? (
                <FaCaretUp className="mr-1" />
              ) : (
                <FaCaretDown className="mr-1" />
              )}
              {MarketCapChart?.[0]?.market_cap_change_percentage_24h?.toFixed(
                1
              )}
              %
            </span>
          </div>
        </div>

        {/* Trading Volumes */}
        <div className="bg-gradient-to-r from-[#F29492] to-[#114357] border-2 border-teal-600 shadow-lg rounded-lg p-5">
          <div className="flex items-center mb-3">
            <SiBinance className="text-yellow-400 mr-2" size={24} />
            <h3 className="text-gray-800 font-semibold text-base">Binance 24h Volume</h3>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-xl font-bold text-black">
              ${MarketCapBNB?.[0]?.total_volume?.toLocaleString("en-US")}
            </span>
          </div>
        </div>
      </div>

      {/* Trending/Gainers/Losers Row */}
      <div className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-3 gap-5 mb-6">
        {/* Trending Coins */}
        <div className="bg-gradient-to-r from-[#F29492] to-[#114357] border-2 border-teal-600 shadow-lg rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold text-blue-600">🔥 Trending</h1>
            <span className="text-red-600 text-xs font-semibold hover:text-green-400 flex items-center cursor-pointer transition-colors">
              View more <FaAngleRight className="ml-1" />
            </span>
          </div>
          <ul className="space-y-3">
            {GetTrendingCoins?.coins.slice(0, 3).map((coin, index) => (
              <li key={index} className="flex items-center">
                <img
                  className="rounded-full w-9 h-9 object-cover mr-3"
                  src={coin?.item?.small}
                  alt={coin?.item?.name}
                />
                <div className="flex-grow">
                  <div className="font-semibold text-gray-800 text-sm">{coin?.item?.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-700 text-xs font-medium">${coin?.item?.data?.price?.toFixed(5)}</span>
                    <div className="flex items-center">
                      {coin?.item?.data?.price_change_percentage_24h?.usd >= 0 ? (
                        <VscTriangleUp className="text-[#20AC62] text-xs" />
                      ) : (
                        <VscTriangleDown className="text-[#EF4565] text-xs" />
                      )}
                      <span
                        className={`font-semibold text-xs ml-1 ${
                          coin?.item?.data?.price_change_percentage_24h?.usd >= 0
                            ? "text-[#20AC62]"
                            : "text-[#EF4565]"
                        }`}
                      >
                        {formatPercentage(
                          coin?.item?.data?.price_change_percentage_24h?.usd * 100
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Gainers */}
        <div className="bg-gradient-to-r from-[#F29492] to-[#114357] border-2 border-teal-600 shadow-lg rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold text-blue-600">
              🚀 Top Gainers
            </h1>
            <span className="text-red-600 text-xs font-semibold hover:text-green-400 flex items-center cursor-pointer transition-colors">
              View more <FaAngleRight className="ml-1" />
            </span>
          </div>
          <ul className="space-y-3">
            {AllGainers?.slice(0, 3).map((coin, index) => (
              <li key={index} className="flex items-center">
                <img
                  className="rounded-full w-9 h-9 object-cover mr-3"
                  src={coin?.logo}
                  alt={coin?.name}
                />
                <div className="flex-grow">
                  <div className="font-semibold text-gray-800 text-sm">{coin?.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-700 text-xs font-medium">${formatPrice(coin?.price)}</span>
                    <div className="flex items-center">
                      {coin?.price_change_24h >= 0 ? (
                        <VscTriangleUp className="text-[#20AC62] text-xs" />
                      ) : (
                        <VscTriangleDown className="text-[#EF4565] text-xs" />
                      )}
                      <span
                        className={`font-semibold text-xs ml-1 ${
                          coin?.price_change_24h >= 0
                            ? "text-[#20AC62]"
                            : "text-[#EF4565]"
                        }`}
                      >
                        {formatPercentage(coin?.price_change_24h * 100)}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Losers */}
        <div className="bg-gradient-to-r from-[#F29492] to-[#114357] border-2 border-teal-600 shadow-lg rounded-lg p-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold text-blue-600">
              📉 Top Losers
            </h1>
            <span className="text-red-600 text-xs font-semibold hover:text-green-400 flex items-center cursor-pointer transition-colors">
              View more <FaAngleRight className="ml-1" />
            </span>
          </div>
          <ul className="space-y-3">
            {AllLosers?.slice(0, 3).map((coin, index) => (
              <li key={index} className="flex items-center">
                <img
                  className="rounded-full w-9 h-9 object-cover mr-3"
                  src={coin?.logo}
                  alt={coin?.name}
                />
                <div className="flex-grow">
                  <div className="font-semibold text-gray-800 text-sm">{coin?.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-gray-700 text-xs font-medium">${formatPrice(coin?.price)}</span>
                    <div className="flex items-center">
                      {coin?.price_change_24h >= 0 ? (
                        <VscTriangleUp className="text-[#20AC62] text-xs" />
                      ) : (
                        <VscTriangleDown className="text-[#EF4565] text-xs" />
                      )}
                      <span
                        className={`font-semibold text-xs ml-1 ${
                          coin?.price_change_24h >= 0
                            ? "text-[#20AC62]"
                            : "text-[#EF4565]"
                        }`}
                      >
                        {formatPercentage(coin?.price_change_24h * 100)}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Additional Components */}
      <div>
        <CryptoPricesTable />
        <CryptoNews />
        <LatestArticlesData />
      </div>
    </div>
    <Footer />
    </>
  );
};

export default MainContainer;
