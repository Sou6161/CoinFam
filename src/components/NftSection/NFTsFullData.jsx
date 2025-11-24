import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { CoingeckoStardasApi } from "../../api/CoinGeckoApi/CoinGeckoApi";
import { ArrowUpRight, ExternalLink, Loader2, ChevronDown } from "lucide-react";
import Footer from "../../Footer/Footer";

const StatisticRow = ({
  label,
  value,
  isLink = false,
  isExplorer = false,
  explorers = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const defaultExplorer = explorers[0];
  const additionalExplorers = explorers.slice(1);

  if (isExplorer) {
    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-800 relative">
        <span className="text-lg font-medium">{label}</span>
        <div className="flex items-center gap-4">
          {/* Default Explorer */}
          <a
            href={defaultExplorer.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span className="font-semibold">{defaultExplorer.name}</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Additional Explorers Dropdown */}
          {additionalExplorers.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span>More</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
                  {additionalExplorers.map((explorer, index) => (
                    <a
                      key={index}
                      href={explorer.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 hover:bg-gray-700 transition-colors"
                    >
                      <span>{explorer.name}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-800">
      <span className="text-lg font-medium">{label}</span>
      <div className="text-right">
        {isLink && value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span className="font-semibold">Visit</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <span className="font-semibold">{value}</span>
        )}
      </div>
    </div>
  );
};

const NFTsFullData = () => {
  const [NFTsData, setNFTsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [coinsPerPage] = useState(100);

  const { id } = useParams();

  const parseDescription = (htmlString) => {
    if (!htmlString) return [];

    try {
      const tempDiv = document.createElement("div");
      // Check if htmlString is already plain text without HTML tags
      if (!htmlString.includes("<")) {
        return [
          {
            title: "",
            content: [htmlString],
          },
        ];
      }

      tempDiv.innerHTML = htmlString;

      // If the div is empty or only contains whitespace
      if (!tempDiv.textContent.trim()) {
        return [];
      }

      // If content is just text without any tags
      if (tempDiv.children.length === 0 && tempDiv.textContent.trim()) {
        return [
          {
            title: "",
            content: [tempDiv.textContent],
          },
        ];
      }

      // Check if there are any h3 tags
      const hasH3Tags = Array.from(tempDiv.children).some(
        (element) => element.tagName.toLowerCase() === "h3"
      );

      // If no h3 tags, return all content
      if (!hasH3Tags) {
        // If there are p tags
        const pTags = Array.from(tempDiv.children).filter(
          (element) => element.tagName.toLowerCase() === "p"
        );

        if (pTags.length > 0) {
          return [
            {
              title: "",
              content: pTags.map((element) => element.innerHTML),
            },
          ];
        }

        // If no p tags but has content, return the whole content
        return [
          {
            title: "",
            content: [tempDiv.innerHTML],
          },
        ];
      }

      // If h3 tags exist, proceed with the original parsing
      const parsedContent = [];
      let currentTitle = null;
      let currentContent = [];

      Array.from(tempDiv.children).forEach((element) => {
        if (element.tagName.toLowerCase() === "h3") {
          if (currentTitle) {
            parsedContent.push({
              title: currentTitle,
              content: currentContent,
            });
          }
          currentTitle = element.textContent;
          currentContent = [];
        } else if (element.tagName.toLowerCase() === "p") {
          currentContent.push(element.innerHTML);
        } else {
          // Handle other tags by including their HTML
          currentContent.push(element.outerHTML);
        }
      });

      if (currentTitle) {
        parsedContent.push({
          title: currentTitle,
          content: currentContent,
        });
      }

      return parsedContent;
    } catch (error) {
      console.error("Error parsing NFT description:", error);
      // Return the raw content if parsing fails
      return [
        {
          title: "",
          content: [htmlString],
        },
      ];
    }
  };

  // Add console logs for debugging
  // console.log("Raw description:", NFTsData?.description);
  const content = parseDescription(NFTsData?.description);
  // console.log("Parsed content:", content);

  // Sample explorers data
  const explorers = [
    {
      name: "Etherscan",
      link: "https://etherscan.io/token/0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
    },
    {
      name: "Ethplorer",
      link: "https://ethplorer.io/address/0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB",
    },
  ];

  useEffect(() => {
    const fetchNFTsData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.coingecko.com/api/v3/nfts/${id}`,
          CoingeckoStardasApi
        );
        if (!response.ok) {
          throw new Error("Failed to fetch NFT data");
        }
        const data = await response.json();
        setNFTsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNFTsData();
  }, [id]);

  useEffect(() => {
    NFTsData && console.log(NFTsData);
  }, [NFTsData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error loading NFT data</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <><div className="min-h-screen bg-black">
      <OnlyHeaderComp />
      <MainPageMarquee />

      <main className="max-w-4xl mx-auto px-4 py-8 text-white">
        {/* Header Section */}
        <div className="relative">
          {NFTsData?.banner_image && (
            <img
              src={NFTsData?.banner_image}
              alt="Banner"
              className="w-full h-48 object-cover rounded-xl" />
          )}

          <div className="mt-4 flex items-center">
            <img
              src={NFTsData?.image?.small}
              alt={NFTsData?.name}
              className="w-16 h-16 rounded-full border-4 border-black" />
            <h1 className="ml-4 text-3xl font-bold">{NFTsData?.name}</h1>
          </div>

          <div className="mt-6 bg-gray-900 rounded-xl p-6">
            <div className="text-2xl font-bold flex">
              {NFTsData?.floor_price?.native_currency} ETH
              <h1 className="ml-6 text-green-400 font-semibold">
                {NFTsData?.floor_price_14d_percentage_change?.native_currency.toFixed(
                  1
                )}
                %
              </h1>
            </div>
            <div className="text-xl text-gray-400 flex">
              ${NFTsData?.floor_price?.usd}
              <h1 className="text-green-400 ml-5 font-semibold">
                {NFTsData?.floor_price_in_usd_24h_percentage_change.toFixed(1)}%
              </h1>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Collection Statistics</h2>
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <StatisticRow
              label="Market Cap"
              value={`${NFTsData?.market_cap?.native_currency?.toLocaleString()} ETH`} />
            <StatisticRow
              label="24h Volume"
              value={`${NFTsData?.volume_24h?.native_currency?.toLocaleString()} ETH`} />
            <StatisticRow label="24h Sales" value={NFTsData?.one_day_sales} />
            <StatisticRow
              label="24h Average Price"
              value={`${NFTsData?.one_day_average_sale_price?.toFixed(2)} ETH`} />
            <StatisticRow
              label="Unique Owners"
              value={NFTsData?.number_of_unique_addresses?.toLocaleString()} />
            <StatisticRow
              label="Total Supply"
              value={NFTsData?.total_supply?.toLocaleString()} />
            <StatisticRow
              label="All-Time High"
              value={`${NFTsData?.ath?.native_currency?.toLocaleString()} ETH`} />
          </div>
        </section>

        {/* Info Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Info</h2>
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            {NFTsData?.links?.homepage && (
              <StatisticRow
                label="Website"
                value={NFTsData.links.homepage}
                isLink={true} />
            )}
            {NFTsData?.links?.discord && (
              <StatisticRow
                label="Discord"
                value={NFTsData.links.discord}
                isLink={true} />
            )}
            {NFTsData?.links?.twitter && (
              <StatisticRow
                label="Twitter"
                value={NFTsData.links.twitter}
                isLink={true} />
            )}
            <StatisticRow
              label="Explorer"
              isExplorer={true}
              explorers={explorers} />
            {NFTsData?.asset_platform_id && (
              <StatisticRow
                label="Platform"
                value={NFTsData.asset_platform_id.toUpperCase()} />
            )}
            {NFTsData?.contract_address && (
              <StatisticRow
                label="Contract Address"
                value={`${NFTsData.contract_address.slice(
                  0,
                  6
                )}...${NFTsData.contract_address.slice(-4)}`} />
            )}
            {NFTsData?.id && (
              <StatisticRow label="API ID" value={NFTsData.id} />
            )}
            {NFTsData?.links?.opensea && (
              <StatisticRow
                label="OpenSea"
                value={NFTsData.links.opensea}
                isLink={true} />
            )}
          </div>
        </section>

        <div className="mt-[10vh] ml-2">
          <h1 className="text-[6vw] font-semibold text-amber-400">
            What is {NFTsData?.name}
          </h1>
          <p className=" mt-2">
            {NFTsData?.name} ({NFTsData?.symbol}) is an NFT collection.{" "}
            {NFTsData?.name} ({NFTsData?.symbol}) price floor today is $
            {NFTsData?.floor_price?.usd.toLocaleString()} with a 24 hour sales
            volume of {NFTsData?.volume_24h?.native_currency.toLocaleString()}{" "}
            ETH. As of today, there is a total of{" "}
            {NFTsData?.total_supply.toLocaleString()} NFTs minted, held by{" "}
            {NFTsData?.number_of_unique_addresses.toLocaleString()} unique
            owners, and has a total market cap of $
            {NFTsData?.market_cap?.usd.toLocaleString()}.
          </p>
          <div className="max-w-4xl mx-auto space-y-8">
            {!content.length ? (
              <div className="text-gray-500">No description available</div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-8">
                {content.map((item, index) => (
                  <div key={index} className="mt-10">
                    {item.title && (
                      <h1 className="text-xl font-semibold text-amber-400">
                        {item.title}
                      </h1>
                    )}
                    {item.content.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="text-gray-300 leading-relaxed mt-5"
                        dangerouslySetInnerHTML={{ __html: paragraph }} />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-[6vh]">
          <h1 className="text-[5vw] text-amber-400">
            Where to buy {NFTsData?.name} NFT?
          </h1>
          <h1 className=" mt-2 leading-relaxed ">
            You can buy and sell {NFTsData?.name} ({NFTsData?.symbol}) on{" "}
            <Link to={NFTsData?.links.homepage}>{NFTsData?.name}</Link>.
          </h1>
          <h1 className="text-[5vw] text-amber-400 mt-5">
            How many {NFTsData?.name} NFTs are there?
          </h1>
          <h1 className=" mt-2 leading-relaxed">
            There is a total of 9,994 unique NFTs in the {NFTsData?.name}{" "}
            collection.
          </h1>
          <h1 className="text-[5vw] text-amber-400 mt-5">
            How many holders are collecting the {NFTsData?.name} NFT?
          </h1>
          <h1 className=" mt-2 leading-relaxed">
            There is a total 3,799 unique addresses that are holding the{" "}
            {NFTsData?.symbol}
            NFT.
          </h1>
        </div>
      </main>
    </div><Footer /></>
  );
};

export default NFTsFullData;
