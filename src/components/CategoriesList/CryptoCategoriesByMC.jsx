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
    const CACHE_KEY = "categoriesByMC";
    const FetchCategoriesList = async () => {
      // Serve cached data instantly on repeat visits, then refresh in background.
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        setCategoriesList(JSON.parse(cached));
        setIsLoading(false);
      } else {
        setIsLoading(true);
      }
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/categories?order=market_cap_desc",
          CoinGeckoChaloApi
        );
        const CategoriesListData = await response.json();
        if (Array.isArray(CategoriesListData)) {
          setCategoriesList(CategoriesListData);
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(CategoriesListData));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    FetchCategoriesList();
  }, []);

  // Paginate data
  const paginatedData = () => {
    const startIndex = (currentPage - 1) * coinsPerPage;
    const endIndex = startIndex + coinsPerPage;
    return CategoriesList && CategoriesList.slice(startIndex, endIndex);
  };

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

      <div className="bg-[#0f172a] text-white min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
        <h1 className="text-yellow-400 text-2xl small:text-3xl large:text-4xl font-bold">
          Top Crypto Categories By Market Cap
        </h1>
        <p className="text-sky-300 text-sm small:text-base leading-relaxed mt-4 max-w-5xl">
          View the largest cryptocurrency categories based on market
          capitalization. The top categories are Layer 1 (L1), Proof of Work
          (PoW), and Smart Contract Platform. Compared to the previous day, the
          market cap of Layer 1 (L1) has increased by 0.8% while Proof of Work
          (PoW) has increased by 0.8%.
        </p>
        <p className="text-sky-300 text-sm small:text-base leading-relaxed mt-3 max-w-5xl">
          Click on a cryptocurrency category to view cryptocurrencies listed
          within the category and their price performance.
        </p>
        <div className="mt-8">
          <div className="overflow-x-auto w-full xsmall:w-[95vw]  xsmall:mx-auto border border-slate-700/60 shadow-lg rounded-lg">
            <table className="min-w-full bg-slate-900/40 rounded-xl">
              <thead className="bg-teal-900">
                <tr>
                  <th className="sticky left-0 z-10 bg-teal-800 px-2 py-2 xsmall:px-3 xsmall:py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    #
                  </th>
                  <th className="sticky left-8 xsmall:left-9 z-10 bg-teal-800 px-3 py-2 xsmall:px-6 xsmall:py-4 text-left text-xs font-medium text-white uppercase tracking-wider max-w-[120px] xsmall:max-w-[200px]">
                    Category
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-4 max-w-[20vw] xsmall:max-w-[30vw] bg-teal-900 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Market Cap
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-4 max-w-[20vw] xsmall:max-w-[30vw] bg-teal-900 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    24h
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-4 max-w-[20vw] xsmall:max-w-[30vw] bg-teal-900 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    24h Volume
                  </th>
                  <th className="px-3 py-2 xsmall:px-6 xsmall:py-4 max-w-[25vw] whitespace-nowrap xsmall:max-w-[30vw] large:w-[12vw] xlarge:w-[12vw] 2xlarge:w-[13vw] bg-teal-900 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Top 3 Coins
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-900/40 divide-y divide-slate-700/50">
                {paginatedData() &&
                  paginatedData().map((coin, index) => (
                    <tr key={coin.id} className="hover:bg-slate-800/40">
                      <td className="sticky left-0 z-10 bg-slate-900/90 backdrop-blur-sm px-2 py-2 xsmall:py-5 whitespace-nowrap text-xs xsmall:text-sm text-slate-100">
                        {(currentPage - 1) * coinsPerPage + index + 1}
                      </td>
                      <td className="sticky left-8 xsmall:left-9 z-10 bg-slate-900/90 backdrop-blur-sm px-2 py-2 xsmall:px-3 xsmall:py-5 max-w-[150px] xsmall:max-w-[200px]">
                        <div className="flex items-center">
                          <Link to={`/en/categories/${coin.id}`}>
                            <span className="text-[3.5vw] xsmall:text-sm 2xlarge:text-[1vw] font-semibold w-[20vw] h-[6vh]  whitespace-normal  xsmall:w-[33vw] text-slate-100 truncate ">
                              {coin.name}
                            </span>
                          </Link>
                        </div>
                      </td>
                      <td className="px-3 py-2 font-bold xsmall:px-6 xsmall:py-5 whitespace-nowrap text-xs xsmall:text-sm text-slate-100">
                        $
                        {coin.market_cap
                          ? Number(coin.market_cap)
                              .toFixed(0)
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : "N/A"}
                      </td>

                      <td className="px-3 py-2 xsmall:px-6 xsmall:py-5  whitespace-nowrap text-xs xsmall:text-sm">
                        {renderPercentageChange(coin.market_cap_change_24h)}
                      </td>

                      <td className="px-2 py-2 xsmall:px-6 xsmall:py-5 whitespace-nowrap text-xs xsmall:text-sm font-semibold text-slate-100">
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
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-2 xsmall:py-2 xsmall:px-4 rounded text-sm xsmall:text-sm disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-cyan-300 ml-2 xsmall:ml-3 font-semibold text-lg xsmall:text-md  small:text-xl medium:text-xl">
            Page {currentPage}
          </span>
          <button
            onClick={handleNextPage}
            disabled={
              currentPage >=
              Math.ceil(CategoriesList && CategoriesList.length / coinsPerPage)
            }
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-3 xsmall:py-2 xsmall:px-4 rounded text-sm xsmall:text-sm disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CryptoCategoriesByMC;
