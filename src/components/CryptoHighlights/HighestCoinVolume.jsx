import React, { useEffect, useState } from 'react'
import { FcFilledFilter } from "react-icons/fc";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";


const HighestCoinVolume = ({CoinsByTradingVol}) => {

    const [FinalHighestVolume, setFinalHighestVolume] = useState(null)

    useEffect(() => {
        if (CoinsByTradingVol) {
            setFinalHighestVolume(CoinsByTradingVol);
        } else {
        //   console.log("TrendingCoinsHL or TrendingCoinsHL.coins is null/undefined");
        }
      }, [CoinsByTradingVol]);
    
      useEffect(() => {
        if (FinalHighestVolume) {
          console.log(FinalHighestVolume, "Highest Coins Volume ");
        } else {
        //   console.log("FinalTrendingCoins is null/undefined");
        }
      }, [FinalHighestVolume]);

  return (
    <div className=" max-w-[95vw] mx-auto bg-slate-900/50 border border-slate-700/60 backdrop-blur-md rounded-xl shadow-lg p-4 ">
    {/* Header */}
    <div className="flex items-center justify-between mb-4 px-1">
      <div className="flex items-center gap-2">
        <FcFilledFilter className="text-orange-500 text-xl" />
        <h2 className="text-lg font-semibold text-slate-100"> Highest Volume </h2>
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
      {FinalHighestVolume ? (
        FinalHighestVolume.slice(0, 6).map((coin) => (
          <div
            key={coin?.id}
            className="flex items-center justify-between py-3.5 hover:bg-slate-800/50 rounded-lg px-3 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <img
                src={coin?.image}
                alt={coin?.name}
                className="w-6 h-6 rounded-full border-[1px] border-slate-600"
              />
              <span className="font-medium text-slate-100">{coin?.name}</span>
            </div>

            <div className="flex gap-8 items-center text-slate-100 font-semibold">
              <span className="text-sm">
                ₹
                {coin?.current_price?.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <div
                className={`w-16 flex items-center justify-end text-sm gap-1
                ${
                  coin?.price_change_percentage_24h >= 0
                    ? "text-green-500 blink-green"
                    : "text-red-500 blink-red"
                }`}
              >
                {coin?.price_change_percentage_24h >= 0 ? (
                  <FaCaretUp />
                ) : (
                  <FaCaretDown />
                )}
                {Math.abs(coin?.price_change_percentage_24h?.toFixed(1))}%
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
  )
}

export default HighestCoinVolume