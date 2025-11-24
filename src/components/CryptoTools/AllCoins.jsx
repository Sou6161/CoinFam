import React, { useEffect, useState } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { CoingeckoSanakApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import { Link } from "react-router-dom";
import Footer from "../../Footer/Footer";

const AllCoins = () => {
  const [AllCryptoCoinsList, setAllCryptoCoinsList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(100);

  const formatNumber = (num) => {
    if (num >= 1e12) {
      return `${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
      return `${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e5) {
      return `${(num / 1e5).toFixed(2)}L`;
    } else if (num >= 1e3) {
      return `${(num / 1e3).toFixed(2)}K`;
    } else {
      return num.toLocaleString("en-IN");
    }
  };

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

  const handleShowMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleShowLess = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const FetchAllCryptoCoins = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${coinsPerPage}&page=${currentPage}&price_change_percentage=1h%2C24h%2C7d%2C30d`,
        CoingeckoSanakApi
      );
      const AllCryptoCoins = await response.json();
      setAllCryptoCoinsList(AllCryptoCoins);
    };
    FetchAllCryptoCoins();
  }, [currentPage]);

  useEffect(() => {
    AllCryptoCoinsList && console.log(AllCryptoCoinsList);
  }, [AllCryptoCoinsList]);

  return (
    <>
      <div className="  ">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="bg-gradient-to-r from-[#3f4c6b] to-[#606c88]">
        <h1 className=" text-[6vw] xsmall:text-[5vw] small:text-[4.3vw] medium:text-[3.5vw] large:text-[2.8vw] xlarge:text-[2.4vw] 2xlarge:text-[2vw] text-center  ml-5 pt-10 pb-2 text-yellow-400 font-semibold">
          All Cryptocurrencies
        </h1>
        <p className="text-sky-500 mt-5 text-[4vw] xsmall:text-[3.5vw] small:text-[2.8vw] medium:text-[2.2vw] large:text-[1.7vw] xlarge:text-[1.5vw] text-center  ml-5 large:mt-3 mb-8]">
          View a full list of active cryptocurrencies
        </p>
        <div className=" bg-gradient-to-r from-[#3f4c6b] to-[#606c88] min-h-screen text-yellow-400 mt-[14vh] px-2 ">
          <div className="overflow-x-auto w-full border-2 border-yellow-400 rounded-lg">
            <table className="min-w-full bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg">
              <thead className="bg-gradient-to-r from-purple-900 to-indigo-900">
                <tr>
                  <th className="sticky left-0 z-10 bg-gradient-to-br from-purple-300 to-indigo-400 px-2 py-2 xsmall:px-3 xsmall:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    #
                  </th>
                  <th className="sticky left-7 xsmall:left-8 z-10 bg-gradient-to-br from-purple-300 to-indigo-400 px-3 py-2 xsmall:px-6 xsmall:py-3 text-left text-xs font-medium text-white  uppercase tracking-wider max-w-[120px] xsmall:max-w-[200px]">
                    Coin
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Price
                  </th>

                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    1h
                  </th>

                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    24h
                  </th>

                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    7d
                  </th>

                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    30d
                  </th>

                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Total Vol
                  </th>

                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Circulating Supply
                  </th>

                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Total Supply
                  </th>

                  <th className="px-4 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] bg-purple-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Market Cap
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gradient-to-l from-[#2c3e50] to-[#bdc3c7] divide-y divide-gray-200">
                {AllCryptoCoinsList &&
                  AllCryptoCoinsList.map((coin, index) => (
                    <tr key={coin.id} className="hover:bg-gray-50">
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

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold">
                        {renderPercentageChange(
                          coin.price_change_percentage_30d_in_currency
                        )}
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-black">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          ₹ {coin?.total_volume.toLocaleString("en-IN")}
                        </h1>
                      </td>
                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-black">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          {coin.circulating_supply
                            ? coin.circulating_supply.toLocaleString()
                            : "N/A"}
                        </h1>
                      </td>
                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-black">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          ${formatNumber(coin?.total_supply)}
                        </h1>
                      </td>
                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-black  ">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          ₹ {coin.market_cap.toLocaleString("en-IN")}
                        </h1>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {AllCryptoCoinsList && (
            <div className="overflow-x-clip flex justify-center py-4">
              <button
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mr-4"
                onClick={handleShowLess}
              >
                Show Less
              </button>
              <button
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleShowMore}
              >
                Show More
              </button>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AllCoins;
