import React, { useEffect, useState } from "react";
import { CoingeckoSanakApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import { Link, useParams } from "react-router-dom";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import ExchangeVolumeChart from "./ExchangeVolumeChart";
import Footer from "../../Footer/Footer"

const ExchangesTickers = () => {
  const [exchangesTickers, setExchangesTickers] = useState(null);
  const [ExchangeTickersFullList, setExchangeTickersFullList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(100);
  const { id } = useParams();
  const exchangeRate = 84.38;

  useEffect(() => {
    const fetchExchangesTickers = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/exchanges/${id}`,
          CoingeckoSanakApi
        );
        const exchangesTickersData = await response.json();
        setExchangesTickers(exchangesTickersData);
      } catch (error) {
        console.error("Error fetching exchange tickers:", error);
      }
    };
    fetchExchangesTickers();
  }, [id]);

  useEffect(() => {
    const FetchFullTickers = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/exchanges/${id}/tickers?include_exchange_logo=true&page=1&depth=true`,
          CoingeckoSanakApi
        );
        const TickersList = await response.json();
        setExchangeTickersFullList(TickersList);
      } catch (error) {
        console.error("Error fetching full tickers:", error);
      }
    };
    FetchFullTickers();
  }, [id]);

  const TableHeader = ({ children, sticky, additional }) => (
    <th
      className={`
      px-2 py-2 xsmall:px-4 small:px-6 xsmall:py-3 
      text-left text-xs font-medium text-black uppercase tracking-wider
      ${
        sticky
          ? "sticky left-0 z-10 bg-gray-400"
          : "bg-purple-400/50 backdrop-blur-md"
      }
      ${additional || ""}
    `}
    >
      {children}
    </th>
  );

  const formatLastUpdated = (timestamp) => {
    const lastFetch = new Date(timestamp);
    const now = Date.now();
    return new Date(lastFetch) > new Date(now - 86400000)
      ? "Recently"
      : `${Math.floor((now - lastFetch) / 86400000)} days ago`;
  };

  const TrustScoreIndicator = ({ score }) => {
    if (score === "green") {
      return (
        <div className="inline-block px-2 rounded-xl">
          <svg className="w-3 h-3 text-green-500" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="12" fill="green" />
          </svg>
        </div>
      );
    }
    return <span className="px-2 rounded-xl font-bold">{score}</span>;
  };

  const SocialLinks = ({ exchangeData }) => (
    <div className="flex flex-col space-y-4 small:space-y-6">
      <div className="flex gap-4">
        {exchangeData?.twitter_handle && (
          <Link
            to={`https://twitter.com/${exchangeData.twitter_handle}`}
            className="text-blue-400 hover:text-blue-600 transition-colors"
          >
            Twitter
          </Link>
        )}
        {exchangeData?.reddit_url && (
          <Link
            to={exchangeData.reddit_url}
            className="text-orange-500 hover:text-orange-600 transition-colors"
          >
            Reddit
          </Link>
        )}
      </div>
      <div className="flex gap-4">
        {exchangeData?.other_url_1 && (
          <Link
            to={exchangeData.other_url_1}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Medium
          </Link>
        )}
        {exchangeData?.other_url_2 && (
          <Link
            to={exchangeData.other_url_2}
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            Steemit
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <><div className="min-h-screen bg-black">
      <OnlyHeaderComp />
      <MainPageMarquee />

      {/* Exchange Header */}
      <div className="p-4 small:p-6 medium:p-8">
        <div className="flex items-center space-x-4">
          <img
            className="w-12 h-12 xsmall:w-16 xsmall:h-16 small:w-20 small:h-20 rounded-lg border-2"
            src={exchangesTickers?.image}
            alt={exchangesTickers?.name} />
          <h1 className="text-2xl xsmall:text-3xl small:text-4xl medium:text-5xl large:text-6xl font-semibold text-white">
            {exchangesTickers?.name}
          </h1>
        </div>

        {/* Spot Markets Section */}
        <h2 className="text-2xl xsmall:text-3xl small:text-4xl font-bold text-white mt-8 mb-6">
          Spot Markets
        </h2>

        {/* Table Section */}
        <div className="overflow-x-auto border-2 border-purple-500 rounded-lg bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <TableHeader sticky>#</TableHeader>
                <TableHeader sticky additional="left-8">
                  Coin
                </TableHeader>
                <TableHeader>Pair</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Spread</TableHeader>
                <TableHeader>+2% Depth</TableHeader>
                <TableHeader>-2% Depth</TableHeader>
                <TableHeader>24h Volume</TableHeader>
                <TableHeader>Last Updated</TableHeader>
                <TableHeader>Trust Score</TableHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ExchangeTickersFullList?.tickers.map((coin, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="sticky left-0 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:py-4 text-xs xsmall:text-sm text-gray-500">
                    {(currentPage - 1) * coinsPerPage + index + 1}
                  </td>
                  <td className="sticky left-8   z-10 bg-zinc-300/50 backdrop-blur-sm p-2 xsmall:p-4">
                    <div className="flex items-center space-x-2">
                      <img
                        className="w-6 h-6 rounded-full"
                        src={`https://cryptologos.cc/logos/${coin.coin_id.toLowerCase()}-${coin.base.toLowerCase()}-logo.png`}
                        onError={(e) => {
                          e.target.src =
                            "https://ih1.redbubble.net/image.1861329500.2941/ur,pin_large_front,square,1000x1000.webp";
                        } }
                        alt={coin.coin_id} />
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {coin.coin_id}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 xsmall:p-4 text-sm font-medium">
                    {coin.base}/{coin.target}
                  </td>
                  <td className="p-2 xsmall:p-4 text-sm">
                    ₹
                    {(coin.converted_last.usd * exchangeRate).toLocaleString(
                      "en-IN",
                      { maximumFractionDigits: 2 }
                    )}
                  </td>
                  <td className="p-2 xsmall:p-4 text-sm">
                    {coin.bid_ask_spread_percentage?.toFixed(2)}%
                  </td>
                  <td className="p-2 xsmall:p-4 text-sm">
                    ${coin.cost_to_move_up_usd?.toFixed(0)}
                  </td>
                  <td className="p-2 xsmall:p-4 text-sm">
                    ${coin.cost_to_move_down_usd?.toFixed(0)}
                  </td>
                  <td className="p-2 xsmall:p-4 text-sm">
                    ₹
                    {(coin.converted_volume.usd * exchangeRate).toLocaleString(
                      "en-IN",
                      { maximumFractionDigits: 0 }
                    )}
                  </td>
                  <td className="p-2 xsmall:p-4 text-sm">
                    {formatLastUpdated(coin.last_fetch_at)}
                  </td>
                  <td className="p-2 xsmall:p-4 text-sm">
                    <TrustScoreIndicator score={coin.trust_score} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Exchange Info Section */}
        <div className="mt-12 text-white space-y-8 medium:space-y-12">
          <div>
            <h2 className="text-2xl xsmall:text-3xl small:text-4xl medium:text-5xl text-red-500 font-semibold mb-4">
              What is {exchangesTickers?.name}?
            </h2>
            <p className="text-lg xsmall:text-xl small:text-2xl medium:text-3xl">
              {exchangesTickers?.description}
            </p>
          </div>

          <div className="grid grid-cols-1 small:grid-cols-2 gap-6 medium:gap-8">
            {/* Website */}
            <div className="space-y-2">
              <h3 className="text-xl xsmall:text-2xl small:text-3xl">
                Website
              </h3>
              {exchangesTickers?.url && (
                <Link
                  to={exchangesTickers.url}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {new URL(exchangesTickers.url).hostname.replace("www.", "")}
                </Link>
              )}
            </div>

            {/* Community */}
            <div className="space-y-2">
              <h3 className="text-xl xsmall:text-2xl small:text-3xl">
                Community
              </h3>
              <SocialLinks exchangeData={exchangesTickers} />
            </div>

            {/* Exchange Details */}
            <div className="space-y-4 col-span-1 small:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg xsmall:text-xl small:text-2xl">
                    Year Established
                  </h3>
                  <p className="text-xl small:text-2xl">
                    {exchangesTickers?.year_established}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg xsmall:text-xl small:text-2xl">
                    Country
                  </h3>
                  <p className="text-xl small:text-2xl">
                    {exchangesTickers?.country}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg xsmall:text-xl small:text-2xl">
                    Trust Score
                  </h3>
                  <p className="text-xl small:text-2xl text-green-500">
                    {exchangesTickers?.trust_score}
                    <span className="text-red-500">/10</span>
                  </p>
                </div>
                <div>
                  <h3 className="text-lg xsmall:text-xl small:text-2xl">
                    Trust Rank
                  </h3>
                  <p className="text-xl small:text-2xl">
                    {exchangesTickers?.trust_score_rank}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Volume Chart */}
        <div className="mt-12">
          <ExchangeVolumeChart ExchangeID={id} />
        </div>
      </div>
    </div><Footer /></>
  );
};

export default ExchangesTickers;
