import React, { useEffect, useState } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { Link } from "react-router-dom";
import { CoingeckoStardasApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import Footer from "../../Footer/Footer";

const NftFloorPriceList = () => {
  const [nfts, setNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 100;

  const fetchNFTs = async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/nfts/list?order=market_cap_usd_desc&per_page=${itemsPerPage}&page=${page}`,
        CoingeckoStardasApi
      );
      const data = await response.json();
      setNFTs(data);
      setTotalCount(data.length + (page - 1) * itemsPerPage);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching NFT list:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Function to truncate address
  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 32)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <><div className="flex flex-col min-h-screen bg-gradient-to-r from-[#3f4c6b] to-[#606c88]">
      {/* Header Section */}
      <div className="bg-black w-full">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>

      {/* Main Content */}
      <main className="flex-grow px-4 small:px-6 large:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="mb-8">
            <h1 className="text-[7vw] xsmall:text-[6vw] small:text-[5vw] medium:text-[4vw] large:text-[3.4vw] xlarge:text-[2.8vw] 2xlarge:text-[2.5vw] large:text-6xl font-bold text-white mb-4">
              Top NFT Collections
            </h1>
            <div className="flex flex-col small:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-gray-400 text-lg">
                Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
                {totalCount} collections
              </p>
              <div className="flex items-center bg-gray-800 rounded-lg px-4 py-2">
                <span className="text-gray-400 mr-2">24h Change:</span>
                <span className="text-green-400 font-medium">+10.6%</span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : (
            <>
              {/* NFT Grid */}
              <div className="grid grid-cols-1 medium:grid-cols-2 large:grid-cols-3 gap-6">
                {nfts.map((nft) => (
                  <Link
                    key={nft.id}
                    to={`/en/nft/${nft.id}`}
                    className="group block"
                  >
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 w-full backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:bg-gray-700/50 hover:transform hover:-translate-y-1 hover:shadow-xl border border-gray-700/50">
                      <div className="flex items-start justify-between mb-4">
                        <h2 className="text-xl text-wrap font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 truncate max-w-[80%]">
                          {nft.name}
                        </h2>
                        <span className="inline-flex  truncate items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400">
                          {nft.symbol}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-400">
                          <span className="text-gray-500">Platform:</span>
                          <span className="ml-2 capitalize">
                            {nft.asset_platform_id}
                          </span>
                        </div>
                        <div className="flex flex-col text-gray-400">
                          <span className="text-gray-500">Contract:</span>
                          <span
                            className="text-sm mt-1 font-mono"
                            title={nft.contract_address}
                          >
                            {truncateAddress(nft.contract_address)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center space-x-4 mt-12">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${currentPage === 1
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"}`}
                >
                  Previous
                </button>
                <div className="px-4 py-2 rounded-lg bg-gray-800 text-white font-medium">
                  Page {currentPage}
                </div>
                <button
                  onClick={handleNextPage}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-300 hover:shadow-lg"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div><Footer /></>
  );
};

export default NftFloorPriceList;
