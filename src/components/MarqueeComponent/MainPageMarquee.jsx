import React, { useEffect, useState } from "react";
import { CoinGeckoApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import { LiveCoinWatchApi } from "../../api/CoinGeckoApi/LiveCoinWatchApi";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addMarqueeData, addMarqueeData2 } from "../../ReduxSlice/Marqueeslice";

const MainPageMarquee = () => {
  const [marqueeData, setMarqueeData] = useState(null);
  const [marqueeData2, setMarqueeData2] = useState(null);
  const dispatch = useDispatch();

  // Existing useEffect hooks remain the same...
  useEffect(() => {
    const getMarketData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/global",
          CoinGeckoApi
        );
        const data = await response.json();
        setMarqueeData(data);
        dispatch(addMarqueeData(data));
      } catch (error) {
        console.error("Failed to fetch CoinGecko data:", error);
      }
    };
    getMarketData();

    const interval = setInterval(getMarketData, 300000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getMarketData2 = async () => {
      try {
        const response = await fetch(
          "https://api.livecoinwatch.com/overview",
          LiveCoinWatchApi
        );
        const data2 = await response.json();
        setMarqueeData2(data2);
        dispatch(addMarqueeData2(data2));
      } catch (error) {
        console.error("Failed to fetch LiveCoinWatch data:", error);
      }
    };
    getMarketData2();

    const interval = setInterval(getMarketData2, 300000);
    return () => clearInterval(interval);
  }, []);

  const MarqueeContent = () => (
    <div className="flex items-center space-x-8">
      {/* Coins */}
      <div className="flex items-center bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-white/20">
        <div className="text-white/70 text-sm mr-2">Coins</div>
        <div className="text-lg font-bold text-white">
          {marqueeData?.data?.active_cryptocurrencies?.toLocaleString()}
        </div>
      </div>

      {/* Market Cap */}
      <div className="flex items-center bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-white/20">
        <div className="text-white/70 text-nowrap text-sm mr-2">Market Cap</div>
        <div className="text-lg font-bold text-white">
          {marqueeData2?.cap ? (
            <div className="flex items-center">
              <span>${(marqueeData2.cap / 1e12).toFixed(3)}T</span>
              <span
                className={`ml-2 flex items-center ${
                  marqueeData?.data?.market_cap_change_percentage_24h_usd >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {marqueeData?.data?.market_cap_change_percentage_24h_usd >= 0 ? (
                  <FaCaretUp className="mr-1" />
                ) : (
                  <FaCaretDown className="mr-1" />
                )}
                {marqueeData?.data?.market_cap_change_percentage_24h_usd?.toFixed(1)}%
              </span>
            </div>
          ) : (
            "Loading..."
          )}
        </div>
      </div>

      {/* 24h Volume */}
      <div className="flex items-center bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-white/20">
        <div className="text-white/70 text-nowrap text-sm mr-2">24h Vol</div>
        <div className="text-lg font-bold text-white">
          ${marqueeData2?.volume ? (marqueeData2.volume / 1e9).toFixed(3) : ""}B
        </div>
      </div>

      {/* Dominance */}
      <div className="flex items-center bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-white/20">
        <div className="text-white/70 text-sm mr-2">Dominance</div>
        <div className="flex space-x-4">
          <div className="flex items-center">
            <span className="text-yellow-400 font-bold mr-1">BTC</span>
            <span className="text-lg font-bold text-white">
              {marqueeData2?.btcDominance ? (marqueeData2.btcDominance * 100).toFixed(2) : ""}%
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-blue-400 font-bold mr-1">ETH</span>
            <span className="text-lg font-bold text-white">
              {marqueeData?.data?.market_cap_percentage?.eth
                ? marqueeData.data.market_cap_percentage.eth.toFixed(2)
                : ""}%
            </span>
          </div>
        </div>
      </div>

      {/* Liquidity */}
      <div className="flex items-center bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 shadow-lg border border-white/20">
        <div className="text-white/70 text-sm mr-2">Liquidity</div>
        <div className="text-lg font-bold text-white">
          ${marqueeData2?.liquidity ? (marqueeData2.liquidity / 1e9).toFixed(2) : ""}B
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden bg-indigo-950 border-y border-indigo-800">
      {/* Marquee wrapper */}
      <div className="relative marquee-wrapper">
        <div className="track">
          <div className="content">
            <MarqueeContent />
          </div>
          <div className="content">
            <MarqueeContent />
          </div>
          <div className="content">
            <MarqueeContent />
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .marquee-wrapper {
          overflow: hidden;
          padding: 0.4rem 0;
        }

        .track {
          display: flex;
          animation: marquee 40s linear infinite;
          width: fit-content;
        }

        .content {
          display: flex;
          padding: 0 2rem;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .track:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .track {
            animation-duration: 30s;
          }
        }
      `}</style>
    </div>
  );
};

export default MainPageMarquee;