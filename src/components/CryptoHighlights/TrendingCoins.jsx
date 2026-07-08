import React, { useEffect, useState } from "react";
import { FaFire } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

const TrendingCoins = ({ TrendingCoinsHL }) => {
  const [FinalTrendingCoins, setFinalTrendingCoins] = useState(null);

  useEffect(() => {
    if (TrendingCoinsHL && TrendingCoinsHL?.coins) {
      setFinalTrendingCoins(TrendingCoinsHL?.coins);
    } else {
      // console.log("TrendingCoinsHL or TrendingCoinsHL.coins is null/undefined");
    }
  }, [TrendingCoinsHL]);

  useEffect(() => {
    if (FinalTrendingCoins) {
      console.log(FinalTrendingCoins, "Trending Coins");
    } else {
      // console.log("FinalTrendingCoins is null/undefined");
    }
  }, [FinalTrendingCoins]);

  return (
    <div className=" max-w-[95vw] mx-auto bg-slate-900/50 border border-slate-700/60 backdrop-blur-md rounded-xl shadow-lg p-4 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <FaFire className="text-orange-500 text-xl" />
          <h2 className="text-lg font-semibold text-slate-100">Trending Coins</h2>
        </div>
        <button className="flex items-center text-slate-400 hover:text-white">
          more
          <MdKeyboardArrowRight className="text-xl mt-1" />
        </button>
      </div>

      {/* Column Headers */}
      <div className="flex justify-between text-sm font-semibold text-slate-300 pb-3 px-3">
        <span>Coin</span>
        <div className="flex gap-8">
          <span>Price</span>
          <span className="w-16 text-right">24h</span>
        </div>
      </div>
      <div className=" border-t-slate-700 border-[1px]"></div>


      {/* Coin List */}
      <div className="flex flex-col">
        {FinalTrendingCoins ? (
          FinalTrendingCoins.slice(0,8).map((coin) => (
            <div
              key={coin?.item?.id}
              className="flex items-center justify-between py-3.5 hover:bg-slate-800/50 rounded-lg px-3 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <img
                  src={coin?.item?.small}
                  alt={coin?.item?.name}
                  className="w-6 h-6 rounded-full border-[1px] border-slate-600"
                />
                <span className="font-medium text-slate-100">
                  {coin?.item?.name}
                </span>
              </div>

              <div className="flex gap-8 items-center text-slate-100 font-semibold">
                <span className="text-sm">
                  ₹
                  {coin?.item?.data?.price?.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <div
                  className={`w-16 flex items-center justify-end text-sm gap-1
                    ${
                      coin?.item?.data?.price_change_percentage_24h?.usd >= 0
                        ? "text-green-500 blink-green"
                        : "text-red-500 blink-red"
                    }`}
                >
                  {coin?.item?.data?.price_change_percentage_24h?.usd >= 0 ? (
                    <FaCaretUp />
                  ) : (
                    <FaCaretDown />
                  )}
                  {Math.abs(
                    coin?.item?.data?.price_change_percentage_24h?.usd?.toFixed(
                      1
                    )
                  )}
                  %
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No trending coins available
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingCoins;
