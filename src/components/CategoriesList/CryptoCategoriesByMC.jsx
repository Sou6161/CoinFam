import { useEffect, useState } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { CoinGeckoChaloApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import { Link } from "react-router-dom";
import Footer from "../../Footer/Footer";

const CryptoCategoriesByMC = () => {
  const [CategoriesList, setCategoriesList] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [coinsPerPage] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

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
    setIsLoading(true);
    const FetchCategoriesList = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/categories?order=market_cap_desc",
        CoinGeckoChaloApi
      );
      const CategoriesListData = await response.json();
      setCategoriesList(CategoriesListData);
    };
    FetchCategoriesList();
    setIsLoading(false);
  }, []);

  // Paginate data
  const paginatedData = () => {
    const startIndex = (currentPage - 1) * coinsPerPage;
    const endIndex = startIndex + coinsPerPage;
    return CategoriesList && CategoriesList.slice(startIndex, endIndex);
  };

  useEffect(() => {
    CategoriesList && console.log(CategoriesList);
  }, [CategoriesList]);

  // Next page handler
  const handleNextPage = () => {
    if (
      Math.ceil(CategoriesList && CategoriesList.length / coinsPerPage) >
      currentPage
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  // Previous page handler
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-wave">
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
      </div>
    );
  }

  return (
    <>
      <div>
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>

      <div className="bg-gradient-to-r from-[#3f4c6b] to-[#606c88] text-white ">
        <h1 className=" ml-5 relative top-10 text-[5.5vw] xsmall:text-[5vw] small:text-[4vw] medium:text-[3.5vw] large:text-[2.9vw] xlarge:text-[2.5vw] 2xlarge:text-[2vw]  text-yellow-400">
          Top Crypto Categories By Market Cap
        </h1>
        <p className=" text-sky-500  ml-5 relative top-10 mt-2 text-[4vw] xsmall:text-[3.3vw] small:text-[2.8vw] medium:text-[2.3vw]  large:text-[1.8vw] xlarge:text-[1.5vw] 2xlarge:text-[1.2vw]">
          View the largest cryptocurrency categories based on market
          capitalization. The top categories are Layer 1 (L1), Proof of Work
          (PoW), and Smart Contract Platform. Compared to the previous day, the
          market cap of Layer 1 (L1) has increased by 0.8% while Proof of Work
          (PoW) has increased by 0.8%.
        </p>
        <p className="text-sky-500 ml-5 relative top-10 mt-2 text-[4vw] xsmall:text-[3.3vw] small:text-[2.8vw] medium:text-[2.3vw] large:text-[1.8vw] xlarge:text-[1.5vw] 2xlarge:text-[1.2vw]">
          Click on a cryptocurrency category to view cryptocurrencies listed
          within the category and their price performance.
        </p>
        <div className=" bg-blac mt-[10vh] px-2 ">
          <div className="overflow-x-auto w-full xsmall:w-[95vw]  xsmall:mx-auto border-2 border-yellow-400 shadow-lg rounded-lg">
            <table className="min-w-full bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg">
              <thead className="bg-gradient-to-r from-purple-900 to-indigo-900">
                <tr>
                  <th className="sticky left-0 z-10 bg-gradient-to-br from-purple-300 to-indigo-400 px-2 py-2 xsmall:px-3 xsmall:py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    #
                  </th>
                  <th className="sticky left-8 xsmall:left-9 z-10 bg-gradient-to-br from-purple-300 to-indigo-400 px-3 py-2 xsmall:px-6 xsmall:py-3 text-left text-xs font-medium text-white uppercase tracking-wider max-w-[120px] xsmall:max-w-[200px]">
                    Category
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Market Cap
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    24h
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[20vw] xsmall:max-w-[30vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    24h Volume
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-3 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] large:w-[12vw] xlarge:w-[12vw] 2xlarge:w-[13vw] bg-gradient-to-br from-purple-300/50 to-indigo-400/50 backdrop-blur-md text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Top 3 Coins
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gradient-to-l from-[#2c3e50] to-[#bdc3c7] divide-y divide-gray-200">
                {paginatedData() &&
                  paginatedData().map((coin, index) => (
                    <tr key={coin.id} className="hover:bg-gray-50">
                      <td className="sticky left-0 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-black">
                        {(currentPage - 1) * coinsPerPage + index + 1}
                      </td>
                      <td className="sticky left-8 xsmall:left-9 z-10 bg-zinc-300/50 backdrop-blur-sm px-2 py-2 xsmall:px-3 xsmall:py-4 max-w-[150px] xsmall:max-w-[200px]">
                        <div className="flex items-center">
                          <Link to={`/en/categories/${coin.id}`}>
                            <span className="text-[3.5vw] xsmall:text-sm 2xlarge:text-[1vw] font-semibold w-[20vw] h-[6vh]  whitespace-normal  xsmall:w-[33vw] text-black truncate ">
                              {coin.name}
                            </span>
                          </Link>
                        </div>
                      </td>
                      <td className="px-3 py-2 font-bold xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm text-black">
                        $
                        {coin.market_cap
                          ? Number(coin.market_cap)
                              .toFixed(0)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : "N/A"}
                      </td>

                      <td className="px-3 py-2 xsmall:px-6 xsmall:py-4  whitespace-nowrap text-xs xsmall:text-sm">
                        {renderPercentageChange(coin.market_cap_change_24h)}
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-4 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-black">
                        <h1 className="inline-block px-1 xsmall:px-2 rounded-xl font-bold">
                          $
                          {coin.volume_24h
                            ? coin.volume_24h.toLocaleString()
                            : "N/A"}
                        </h1>
                      </td>
                      <td className="flex space-x-2 ">
                        {coin.top_3_coins.map((image, index) => (
                          <img
                            className="w-6 h-6 xsmall:w-6 xsmall:h-6 small:w-8 small:h-8 medium:w-8 medium:h-8 large:w-9 large:h-9 xlarge:w-10 xlarge:h-10 2xlarge:w-10 2xlarge:h-10  mt-2 object-contain border-[1px]  p-0.5 2xlarge:p-1 rounded-full"
                            key={index}
                            src={image}
                            alt={`Coin ${index + 1}`}
                          />
                        ))}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 px-3 xsmall:px-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-2 xsmall:py-2 xsmall:px-4 rounded text-sm xsmall:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-cyan-600 ml-2 xsmall:ml-3 font-semibold text-lg xsmall:text-md  small:text-xl medium:text-xl">
            Page {currentPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={
              currentPage >=
              Math.ceil(CategoriesList && CategoriesList.length / coinsPerPage)
            }
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-3 xsmall:py-2 xsmall:px-4 rounded text-sm xsmall:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CryptoCategoriesByMC;
