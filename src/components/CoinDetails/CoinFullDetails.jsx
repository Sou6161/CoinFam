import React, { useEffect, useState, useMemo, useCallback } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { Link, useParams } from "react-router-dom";
import {
  FaCaretDown,
  FaCaretUp,
  FaStar,
  FaBitcoin,
  FaChartLine,
} from "react-icons/fa";
import { ChevronDown, ChevronUp, Search, Copy, Star } from "lucide-react";
import { ExternalLink } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  CoinGeckoApi,
  CoinGeckoRixerApi,
  CoinGeckoSanderApi,
  CoinGeckoYogeshApi,
} from "../../api/CoinGeckoApi/CoinGeckoApi";
import {
  MdSwapVert,
  MdTrendingUp,
  MdTrendingDown,
  MdInfoOutline,
  MdAccessTime,
} from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import CoinNewsInDetails from "../../CoinGeckoCryptoNews/CoinNewsInDetails";
import Footer from "../../Footer/Footer";
import { FiChevronDown, FiChevronUp, FiStar } from "react-icons/fi";

const formatXAxis = (unixTimestamp) => {
  const date = new Date(unixTimestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

// const formatPrice = (price) => {
//   if (price >= 100) {
//     return price.toFixed(2);
//   } else if (price >= 1) {
//     return price.toFixed(4);
//   } else {
//     return price.toFixed(6);
//   }
// };

const timeFrameOptions = [
  { value: "24h", label: "24H" },
  { value: "7d", label: "7D" },
  { value: "1m", label: "1M" },
  { value: "3m", label: "3M" },
  { value: "1y", label: "1Y" },
];

// Price Change Component
const PriceChange = ({ percentage, className = "" }) => {
  const isPositive = percentage >= 0;
  return (
    <span
      className={`flex items-center ${
        isPositive ? "text-green-400" : "text-red-400"
      } ${className}`}
    >
      {isPositive ? <FaCaretUp /> : <FaCaretDown />}
      {Math.abs(percentage).toFixed(2)}%
    </span>
  );
};

// Utility functions
const formatPrice = (price) => {
  if (!price) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: price >= 100 ? 2 : 8,
    maximumFractionDigits: price >= 100 ? 2 : 8,
  }).format(price);
};

const formatBtcPrice = (btcPrice) => {
  if (!btcPrice) return "0";
  return btcPrice.toFixed(8);
};

const formatLargeNumber = (num) => {
  if (!num) return "0";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toFixed(2);
};

// Module-level cache so chart data for a given coin/timeframe is fetched once
// and reused instantly when switching timeframes or chart type.
const chartCache = new Map();

const daysForTimeFrame = (timeFrame) =>
  ({ "24h": 1, "7d": 7, "1m": 30, "3m": 90, "1y": 365 }[timeFrame] ?? 7);

const CoinFullDetails = ({ contractAddress, marketsData }) => {
  const { id } = useParams();
  const [showDropdown, setShowDropdown] = useState(false);
  const [CoinDetails, setCoinDetails] = useState(null);
  const [CoinChartDetails, setCoinChartDetails] = useState(null);
  const [CoinMcapDetails, setCoinMcapDetails] = useState(null);
  const [timeFrame, setTimeFrame] = useState("24h");
  const [chartType, setChartType] = useState("price");
  const [lowestMarketCap, setLowestMarketCap] = useState(0);
  const [highestMarketCap, setHighestMarketCap] = useState(0);
  const [xAxisDomain, setXAxisDomain] = useState([0, 0]);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  const priceUSD = CoinDetails?.market_data?.current_price.usd;
  const priceBTC = CoinDetails?.market_data?.current_price.btc;
  const priceChange24h = CoinDetails?.market_data?.price_change_percentage_24h;
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [amount, setAmount] = useState("1");
  const [currencies, setCurrencies] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [hyperlinks, setHyperlinks] = useState({});
  const truncatedAddress = `${
    CoinDetails &&
    CoinDetails?.detail_platforms?.ethereum?.contract_address.slice(
      screenSize >= 1024 && screenSize <= 1280 ? 0 : 0,
      screenSize >= 1024 && screenSize <= 1280 ? 10 : 6
    )
  }...${
    CoinDetails &&
    CoinDetails?.detail_platforms?.ethereum?.contract_address.slice(
      screenSize >= 1024 && screenSize <= 1280 ? -10 : -5
    )
  }`;
  const [MarketsData, setMarketsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [disableNext, setDisableNext] = useState(false);
  const [disablePrevious, setDisablePrevious] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [usdToInrRate, setUsdToInrRate] = useState(0);
  const [currency, setCurrency] = useState("INR");

  const [CoinLatestNews, setCoinLatestNews] = useState(null);
  const [renderedNews, setRenderedNews] = useState([]);
  const [TrendingCoins, setTrendingCoins] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const explorers =
    CoinDetails?.links?.blockchain_site?.filter((site) => Boolean(site)) || [];
  const homepage = CoinDetails?.links?.homepage?.[0] || "";
  const announcementUrl = CoinDetails?.links?.announcement_url?.[0] || "";
  const twitterHandle = CoinDetails?.links?.twitter_screen_name;
  const redditUrl = CoinDetails?.links?.subreddit_url;
  const githubUrl = CoinDetails?.links?.repos_url?.github?.[0];
  const categories = CoinDetails?.categories || [];

  const InfoCard = ({ title, children, className = "" }) => (
    <div
      className={`bg-gray-800 rounded-lg p-4 xsmall:p-6 w-full ${className}`}
    >
      <div className="flex flex-col small:flex-row small:items-center justify-between gap-4">
        <h2 className="text-lg xsmall:text-xl text-white">{title}</h2>
        {children}
      </div>
    </div>
  );

  const getHostname = (url) => {
    try {
      return url ? new URL(url).hostname : "";
    } catch (e) {
      return url;
    }
  };

  const ecosystemCategory = categories.find((category) =>
    category?.includes("Ecosystem")
  );
  const nonEcosystemCategory = categories.find(
    (category) => !category?.includes("Ecosystem")
  );

  // Scroll to top when component mounts or coin id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleDropdownChains = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // const ecosystemCategory = CoinDetails?.categories?.find((category) =>
  //   category.includes("Ecosystem")
  // );
  let targetCount = 11;

  useEffect(() => {
    if (!CoinLatestNews) return;

    const loadImages = async () => {
      let validNews = [];
      let index = 0;

      while (validNews.length < targetCount && index < CoinLatestNews.length) {
        const item = CoinLatestNews[index];
        if (item.urlToImage) {
          try {
            await new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = resolve;
              img.onerror = reject;
              img.src = item.urlToImage;
            });
            validNews.push(item);
          } catch (error) {
            // Image failed to load, skip this item
          }
        }
        index++;

        if (index >= CoinLatestNews.length && validNews.length < targetCount) {
          index = 0; // Start over if we haven't found enough valid news items
        }
      }

      setRenderedNews(validNews);
    };

    loadImages();
  }, [CoinLatestNews, targetCount]);

  const itemsPerPage = 100;

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((response) => response.json())
      .then((data) => setUsdToInrRate(data.rates.INR))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const text = CoinDetails && CoinDetails?.description?.en;
    if (!text) return;

    const regex = /<a.*?href="(.*?)".*?>(.*?)<\/a>/g;
    let match;

    let newText = text;
    while ((match = regex.exec(text)) !== null) {
      const url = match && match[1];
      const linkText = match && match[2];
      newText = newText.replace(
        match[0],
        `<a href="${url}" style="color: blue; text-decoration: underline">${linkText}</a>`
      );
    }

    setDescription(newText);
  }, [CoinDetails]);

  // const explorers =
  //   CoinDetails &&
  //   CoinDetails?.links?.blockchain_site.filter((site) => site !== "");

  console.log(id, "iouhouhgghuoggoo");

  useEffect(() => {
    if (
      CoinDetails &&
      CoinDetails.market_data &&
      CoinDetails.market_data.current_price
    ) {
      setCurrencies(Object.keys(CoinDetails.market_data.current_price));
    }
  }, [CoinDetails]);

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow empty string or valid numbers (including decimals)
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const convertedAmount =
    CoinDetails?.market_data?.current_price[selectedCurrency] *
    parseFloat(amount);

  const timeframes = [
    { label: "1h", dataKey: "price_change_percentage_1h_in_currency" },
    { label: "24h", dataKey: "price_change_percentage_24h_in_currency" },
    { label: "7d", dataKey: "price_change_percentage_7d_in_currency" },
    { label: "14d", dataKey: "price_change_percentage_14d_in_currency" },
    { label: "30d", dataKey: "price_change_percentage_30d_in_currency" },
    { label: "1y", dataKey: "price_change_percentage_1y_in_currency" },
  ];

  const formatPercentage = (value) => {
    if (value === undefined) return "N/A";
    const formattedValue = value.toFixed(2);
    const color = value >= 0 ? "text-green-500" : "text-red-500";
    const arrow = value >= 0 ? "▲" : "▼";
    return (
      <span className={`${color} flex items-center justify-center font-semibold`}>
        <span className="mr-1">{arrow}</span>
        <span>{Math.abs(formattedValue)}%</span>
      </span>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedDate =
        timeFrame === "7d"
          ? `${date.toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
            })} ${date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : timeFrame === "1y"
          ? `${date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })} ${date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const formattedPrice = payload[0].value / 1000;
      return (
        <div className="bg-slate-800 border border-slate-700 text-white p-2 rounded shadow-lg">
          <p className="text-sm">{formattedDate}</p>
          <p className="text-sm font-bold">{`Price: ${formattedPrice.toFixed(
            1
          )}K`}</p>
        </div>
      );
    }
    return null;
  };

  // Transform CoinChartDetails into the format expected by recharts
  const chartData2 =
    CoinChartDetails &&
    CoinChartDetails.map((detail) => ({
      time: detail[0],
      price: detail[4], // Using the closing price (index 4)
    }));

  const chartData = useMemo(() => {
    return (
      CoinChartDetails &&
      CoinChartDetails.map((detail) => ({
        timestamp: detail[0],
        price: detail[4], // Using the closing price
      }))
    );
  }, [CoinChartDetails]);

  // Safely determine the domain for XAxis
  const xDomain =
    chartData?.length > 0
      ? [chartData[0].time, chartData[chartData?.length - 1].time]
      : [0, 1]; // Fallback domain if chartData is empty

  const lowPrice = CoinDetails?.market_data?.low_24h?.usd ?? 0;
  const highPrice = CoinDetails?.market_data?.high_24h?.usd ?? 0;

  const tickGap = (highPrice - lowPrice) / 8; // 8 ticks, including min and max

  const tickValues = Array(9)
    .fill(0)
    .map((_, i) => lowPrice + i * tickGap);

  const lowestPrice =
    CoinChartDetails && CoinChartDetails.length > 0
      ? Math.min(...CoinChartDetails.map((data) => data[4]))
      : 0;
  const highestPrice =
    CoinChartDetails && CoinChartDetails.length > 0
      ? Math.max(...CoinChartDetails.map((data) => data[4]))
      : 0;
  const tickValuesLowPrices =
    CoinChartDetails && CoinChartDetails.length > 0
      ? Array(10)
          .fill(0)
          .map((_, i) => {
            const step = (highestPrice - lowestPrice) / 9;
            return Math.round((lowestPrice + step * i) / 1000) * 1000;
          })
      : [];

  useEffect(() => {
    const FetchCoinDetails = async () => {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=true&sparkline=true`,
        CoinGeckoYogeshApi
      );
      const CoinData = await response.json();
      console.log(CoinData);
      setCoinDetails(CoinData);
    };
    FetchCoinDetails();
  }, []);

  useEffect(() => {
    CoinDetails && console.log(CoinDetails);
  }, [CoinDetails]);

  useEffect(() => {
    const FetchCoinChart = async () => {
      const days = daysForTimeFrame(timeFrame);
      let precision;
      const price = CoinDetails?.market_data?.current_price?.usd;
      if (price < 0.0001) {
        precision = 10;
      } else if (price < 0.01) {
        precision = 8;
      } else if (price < 1) {
        precision = 6;
      } else {
        precision = 2;
      }
      precision = precision || 2;
      const cacheKey = `ohlc-${id}-${days}-${precision}`;
      if (chartCache.has(cacheKey)) {
        setCoinChartDetails(chartCache.get(cacheKey));
        return;
      }
      const chartResponse = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=${days}&precision=${precision}`,
        CoinGeckoYogeshApi
      );
      const chartdata = await chartResponse.json();
      if (Array.isArray(chartdata)) chartCache.set(cacheKey, chartdata);
      setCoinChartDetails(chartdata);
    };
    FetchCoinChart();
  }, [timeFrame, id, CoinDetails]);

  useEffect(() => {
    CoinChartDetails && console.log(CoinChartDetails, `${CoinDetails?.name}`);
  }, [CoinChartDetails]);

  useEffect(() => {
    const applyMcap = (marketCaps) => {
      setCoinMcapDetails(marketCaps);
      setLowestMarketCap(Math.min(...marketCaps.map((item) => item[1])));
      setHighestMarketCap(Math.max(...marketCaps.map((item) => item[1])));
      setXAxisDomain([
        Math.min(...marketCaps.map((item) => item[0])),
        Math.max(...marketCaps.map((item) => item[0])),
      ]);
    };
    const FetchCoinMCap = async () => {
      const days = daysForTimeFrame(timeFrame);
      const cacheKey = `mcap-${id}-${days}`;
      if (chartCache.has(cacheKey)) {
        applyMcap(chartCache.get(cacheKey));
        return;
      }
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=${
          days === 1 ? "" : "daily"
        }&precision=${getPrecision(lowestMarketCap)}`,
        CoinGeckoYogeshApi
      );
      const CoinMCapData = await response.json();
      if (CoinMCapData && CoinMCapData?.market_caps) {
        chartCache.set(cacheKey, CoinMCapData.market_caps);
        applyMcap(CoinMCapData.market_caps);
      }
    };
    FetchCoinMCap();
  }, [timeFrame, id]);


  const getPrecision = (value) => {
    if (value < 0.0000000001) {
      return "10";
    } else if (value < 0.00000001) {
      return "9";
    } else if (value < 0.0000001) {
      return "8";
    } else if (value < 0.000001) {
      return "7";
    } else if (value < 0.00001) {
      return "6";
    } else if (value < 0.0001) {
      return "5";
    } else if (value < 0.001) {
      return "4";
    } else if (value < 0.01) {
      return "3";
    } else if (value < 0.1) {
      return "2";
    } else {
      return "0";
    }
  };
  useEffect(() => {
    CoinMcapDetails &&
      console.log(
        CoinMcapDetails,
        `Market cap detailssssss ${CoinDetails?.name}`
      );
  }, [CoinMcapDetails]);

  const fetchMarketsData = useCallback(async (page) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/tickers?include_exchange_logo=true&page=${page}&order=trust_score_desc&depth=true`,
        CoinGeckoRixerApi
      );
      const marketData = await response.json();
      setMarketsData(marketData?.tickers || []);
      setDisableNext(marketData?.tickers?.length < itemsPerPage);
    } catch (error) {
      console.error("Error fetching market data:", error);
      setMarketsData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketsData(currentPage);
  }, [currentPage, fetchMarketsData]);
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    setDisablePrevious(page === 1);
  }, []);

  const handleNextPage = useCallback(() => {
    if (!disableNext) {
      handlePageChange(currentPage + 1);
    }
  }, [disableNext, currentPage, handlePageChange]);

  const handlePreviousPage = useCallback(() => {
    if (!disablePrevious) {
      handlePageChange(currentPage - 1);
    }
  }, [disablePrevious, currentPage, handlePageChange]);

  useEffect(() => {
    MarketsData && console.log(MarketsData, " Tickers  Markets Data for coins");
  }, [MarketsData]);

  useEffect(() => {
    const FetchTrendingCoins = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/search/trending",
        CoinGeckoRixerApi
      );
      const trendingcoins = await response.json();
      // console.log(trendingcoins);
      setTrendingCoins(trendingcoins?.coins);
    };
    FetchTrendingCoins();
  }, []);

  useEffect(() => {
    TrendingCoins && console.log(TrendingCoins, "Trending Coins");
  }, [TrendingCoins]);

  if (!CoinDetails) {
    return (
      <>
        <div>
          <OnlyHeaderComp />
          <MainPageMarquee />
        </div>
        <div className="w-full min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 border-4 border-slate-700 border-t-teal-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium animate-pulse">
            Loading coin data...
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div>
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="w-full overflow-x-hidden  xsmall:overflow-x-hidden min-h-screen bg-slate-900 text-white">
        {/* Glass-morphism card container */}
        <div className="max-w-6xl mx-auto mt-6 p-5 medium:p-8 rounded-2xl backdrop-blur-lg bg-white/5 border border-white/10 shadow-2xl">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                className="w-12 h-12 rounded-full ring-2 ring-blue-500/50 p-0.5
                xsmall:w-14 xsmall:h-14
                medium:w-16 medium:h-16"
                src={CoinDetails?.image?.large}
                alt={CoinDetails?.name}
              />
              <div>
                <h1
                  className="text-2xl font-bold text-cyan-400
                xsmall:text-3xl
                medium:text-4xl"
                >
                  {CoinDetails?.name}
                </h1>
                <p className="text-gray-400 text-sm xsmall:text-base">
                  {CoinDetails?.symbol?.toUpperCase()} • Rank #
                  {CoinDetails?.market_cap_rank}
                </p>
              </div>
            </div>

            {/* Favorite Button */}
            <div className="relative">
              {/* <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="group p-2 rounded-full bg-slate-800/40 hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-300"
              >
                <FaStar className="w-5 h-5 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
              </button> */}

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-gray-800/90 backdrop-blur-lg border border-white/10 shadow-2xl p-4 z-10">
                  <button className="w-full px-4 py-2 rounded-lg bg-teal-600 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-white font-medium">
                    Add to Portfolio
                  </button>
                  <p className="mt-2 text-sm text-gray-400 text-center">
                    {CoinDetails?.watchlist_portfolio_users?.toLocaleString()}{" "}
                    users tracking
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Price Section */}
          <div
            className="mt-8 grid grid-cols-1 gap-6 
          medium:grid-cols-2 
          large:grid-cols-3"
          >
            {/* USD Price Card */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-white/10">
              <h2 className="text-gray-400 font-medium mb-2">Price USD</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  ${formatPrice(CoinDetails?.market_data?.current_price?.usd)}
                </span>
                <PriceChange
                  percentage={
                    CoinDetails?.market_data?.price_change_percentage_24h
                  }
                  className="text-lg"
                />
              </div>
            </div>

            {/* BTC Price Card */}
            <div className="p-4 rounded-xl bg-slate-800/40 border border-white/10">
              <h2 className="text-gray-400 font-medium mb-2">Price BTC</h2>
              <div className="flex items-baseline gap-2">
                <FaBitcoin className="text-[#F7931A] text-2xl" />
                <span className="text-3xl font-bold">
                  {formatBtcPrice(CoinDetails?.market_data?.current_price?.btc)}
                </span>
                <PriceChange
                  percentage={
                    CoinDetails?.market_data
                      ?.price_change_percentage_24h_in_currency?.btc
                  }
                  className="text-lg"
                />
              </div>
            </div>

            {/* Market Stats Card */}
            <div className="p-5 rounded-xl bg-slate-800/40 border border-white/10">
              <h2 className="text-gray-400 font-medium mb-4">
                24h Market Stats
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Volume</span>
                  <span className="font-medium">
                    $
                    {formatLargeNumber(
                      CoinDetails?.market_data?.total_volume?.usd
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Cap</span>
                  <span className="font-medium">
                    $
                    {formatLargeNumber(
                      CoinDetails?.market_data?.market_cap?.usd
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Price Chart Preview */}
          {/* <div className="mt-8 p-6 rounded-xl bg-slate-800/40 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Price Chart</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  24H
                </button>
                <button className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  7D
                </button>
                <button className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  1M
                </button>
              </div>
            </div>
            <div className="h-[200px] flex items-center justify-center text-gray-400">
              <FaChartLine className="w-12 h-12 opacity-50" />
            </div>
          </div> */}
        </div>

        {/* <svg
          viewBox="0 0 300 50"
          className="w-full  xsmall:w-[80vw]  xsmall:mx-auto medium:w-[70vw] large:w-[60vw] large:ml-[20vw] xlarge:ml-[5vw] xlarge:w-[35vw]  2xlarge:w-[35vw] h-auto"
        >
          <defs>
            <linearGradient
              id="priceGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" style={{ stopColor: "red", stopOpacity: 1 }} />
              <stop
                offset="100%"
                style={{ stopColor: "green", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          <rect
            x="10"
            y="10"
            width="280"
            height={
              window.innerWidth === 1536
                ? 1
                : window.innerWidth < 480
                ? 7
                : window.innerWidth > 1536
                ? 3
                : 3
            }
            fill="url(#priceGradient)"
            rx={window.innerWidth === 1536 ? 2 : 5}
            ry={window.innerWidth === 1536 ? 2 : 5}
          />
          <text
            x="10"
            y={
              window.innerWidth >= 640 && window.innerWidth <= 768
                ? 27
                : window.innerWidth >= 1289 && window.innerWidth <= 1536
                ? 30
                : window.innerWidth > 1536
                ? 27
                : 27
            }
            fontFamily="Arial"
            className="text-[3vw] xsmall:text-[2vw]  small:text-[1.5vw] medium:text-[1vw] large:text-[0.8vw] xlarge:text-[0.6vw] 2xlarge:text-[0.5vw]"
            fill="red"
          >
            $
            {CoinDetails?.market_data?.low_24h?.usd?.toFixed(
              CoinDetails?.market_data?.low_24h?.usd?.toString().split(".")[0]
                .length > 2
                ? 2
                : CoinDetails?.market_data?.low_24h?.usd
                    ?.toString()
                    .split(".")[0] === "0"
                ? 8
                : 4
            )}
          </text>
          <text
            x={
              window.innerWidth >= 640 && window.innerWidth <= 768
                ? 240
                : window.innerWidth >= 1289 && window.innerWidth <= 1536
                ? 245
                : window.innerWidth > 1536
                ? 245
                : 250
            }
            y={
              window.innerWidth >= 640 && window.innerWidth <= 768
                ? 27
                : window.innerWidth >= 1289 && window.innerWidth <= 1536
                ? 30
                : window.innerWidth > 1536
                ? 27
                : 27
            }
            fontFamily="Arial"
            className="text-[3vw] xsmall:text-[2vw] small:text-[1.5vw] medium:text-[1vw] large:text-[0.8vw] xlarge:text-[0.7vw] 2xlarge:text-[0.5vw]"
            fill="green"
          >
            $
            {CoinDetails?.market_data?.high_24h?.usd?.toFixed(
              CoinDetails?.market_data?.high_24h?.usd?.toString().split(".")[0]
                .length > 2
                ? 2
                : CoinDetails?.market_data?.high_24h?.usd
                    ?.toString()
                    .split(".")[0] === "0"
                ? 8
                : 4
            )}
          </text>
        </svg>
        <span className=" text-white relative -top-[6vh] xsmall:-top-[7vh] small:-top-[9vh] left-[40vw] text-[3vw] xsmall:text-[2.5vw] medium:text-[2vw] medium:left-[44vw]  medium:-top-[8vh] large:text-[1.5vw] large:-top-[11vh] xlarge:text-[1vw] xlarge:-top-[8vh] xlarge:left-[18vw] 2xlarge:text-[0.8vw]">
          24 Hour Range
        </span> */}

        <div className="mt-10 flex flex-col w-full max-w-6xl mx-auto px-4">
          {/* Header Section */}
          <div className="flex flex-col gap-6 mb-8">
            <h1 className="text-2xl font-bold md:text-3xl">
              {CoinDetails?.name} Price Chart{" "}
              <span className="text-gray-500">
                ({CoinDetails?.symbol?.toUpperCase()})
              </span>
            </h1>

            {/* Controls Container */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
              {/* Time Frame Controls */}
              <div className="flex gap-2 flex-wrap">
                {timeFrameOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimeFrame(option.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all
                  ${
                    timeFrame === option.value
                      ? "bg-teal-600 text-white shadow-lg"
                      : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                  }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Chart Type Controls */}
              <div className="flex gap-2">
                {["price", "marketCap"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-all
                  ${
                    chartType === type
                      ? "bg-teal-600 text-white shadow-lg"
                      : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                  }`}
                  >
                    {type === "marketCap" ? "Market Cap" : "Price"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart Container */}
          <div className="w-full bg-slate-800/40 border border-white/10 rounded-xl shadow-lg p-4 h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "price" ? (
                <LineChart data={chartData2}>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="1 1"
                    stroke="#334155"
                  />
                  <XAxis
                    dataKey="time"
                    tickFormatter={formatXAxis}
                    minTickGap={30}
                    tick={{ fontSize: 12 }}
                    domain={xDomain}
                    stroke="#6b7280"
                  />
                  <YAxis
                    tickCount={9}
                    tickValues={tickValuesLowPrices}
                    tickFormatter={(value) => {
                      const inrValue = value * usdToInrRate;
                      if (inrValue < 0.01) return `₹${inrValue.toFixed(4)}`;
                      if (inrValue < 1) return `₹${inrValue.toFixed(3)}`;
                      if (inrValue < 1000000)
                        return `₹${(inrValue / 1).toFixed(2)}`;
                      return `₹${(inrValue / 1000000).toFixed(2)}M`;
                    }}
                    domain={[lowestPrice, highestPrice]}
                    stroke="#6b7280"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={priceChange24h >= 0 ? "#10B981" : "#EF4444"}
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              ) : (
                <LineChart data={CoinMcapDetails}>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#334155"
                  />
                  <XAxis
                    dataKey="0"
                    tickFormatter={(unixTimestamp) => {
                      const date = new Date(unixTimestamp);
                      if (timeFrame === "1m" || timeFrame === "7d") {
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                        });
                      } else if (timeFrame === "3m") {
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        });
                      } else if (timeFrame === "1y") {
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          year: "2-digit",
                        });
                      } else {
                        return date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                      }
                    }}
                    ticks={CoinMcapDetails.map((item, index) => {
                      if (timeFrame === "1m")
                        return index % 6 === 0 ? item[0] : null;
                      if (timeFrame === "7d")
                        return index % 2 === 0 ? item[0] : null;
                      if (timeFrame === "3m")
                        return index % 20 === 0 ? item[0] : null;
                      if (timeFrame === "1y")
                        return index % 50 === 0 ? item[0] : null;
                      return item[0];
                    })}
                    tick={{ fontSize: 12 }}
                    domain={xAxisDomain}
                    stroke="#6b7280"
                  />
                  <YAxis
                    tickCount={9}
                    tickFormatter={(value) => {
                      const inrValue = value * usdToInrRate;
                      if (inrValue >= 1e12)
                        return `₹${(inrValue / 1e12).toFixed(2)}T`;
                      if (inrValue >= 1e9)
                        return `₹${(inrValue / 1e9).toFixed(2)}B`;
                      if (inrValue >= 1e6)
                        return `₹${(inrValue / 1e6).toFixed(2)}M`;
                      if (inrValue >= 1e3)
                        return `₹${(inrValue / 1e3).toFixed(2)}K`;
                      if (inrValue < 1 && inrValue >= 0.001)
                        return `₹${inrValue.toFixed(6)}`;
                      if (inrValue < 0.001) return `₹${inrValue.toFixed(10)}`;
                      return `₹${inrValue.toFixed(2)}`;
                    }}
                    domain={[lowestMarketCap, highestMarketCap]}
                    stroke="#6b7280"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="1"
                    stroke="#8B5CF6"
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
        <div className="w-full max-w-6xl mx-auto mt-10 px-4">
          {/* Main Container with Grid Layout for larger screens */}
          <div className="grid grid-cols-1 xlarge:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="flex flex-col gap-6">
              {/* Price Change Timeframes */}
              <div className="w-full bg-slate-800/40 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-4">
                <h2 className="text-sm font-semibold text-slate-400 mb-4">
                  Price Change
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {timeframes.map((timeframe) => (
                    <div
                      key={timeframe.label}
                      className="flex flex-col items-center gap-1.5 rounded-lg bg-slate-900/50 border border-white/10 p-3"
                    >
                      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        {timeframe.label}
                      </span>
                      <span className="font-mono text-sm">
                        {formatPercentage(
                          CoinDetails?.market_data?.[timeframe.dataKey]?.usd
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Currency Converter */}
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold xlarge:text-2xl">
                  {CoinDetails?.name} Converter
                </h2>
                <div className="bg-slate-800/40 border border-white/10 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-slate-100">
                      {CoinDetails?.symbol?.toUpperCase()}
                    </span>
                    <div className="relative">
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 border border-slate-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
                      >
                        <span className="font-medium">
                          {selectedCurrency.toUpperCase()}
                        </span>
                        <ChevronDown size={18} />
                      </button>
                      {isOpen && (
                        <div className="absolute right-0 mt-2 w-32 max-h-60 overflow-y-auto bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50">
                          {currencies.map((currency) => (
                            <button
                              key={currency}
                              className="w-full px-4 py-2 text-left hover:bg-slate-700 text-slate-200"
                              onClick={() => handleCurrencyChange(currency)}
                            >
                              {currency.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={handleAmountChange}
                    className="w-full px-4 py-3 bg-slate-900/60 text-white font-semibold text-lg border border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-slate-500 mb-4"
                    placeholder="Enter amount"
                  />
                  <div className="text-2xl font-bold text-teal-400">
                    {!isNaN(convertedAmount)
                      ? convertedAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "0.00"}{" "}
                    {selectedCurrency.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Market Figures */}
            <div className="flex flex-col gap-4 xlarge:mt-0 mt-6 2xlarge:-mt-7">
              <h2 className="text-xl font-bold xlarge:text-2xl">
                {CoinDetails?.name} Figures
              </h2>
              <div className="bg-slate-800/40 border border-white/10 rounded-xl shadow-lg p-6">
                <div className="grid gap-4">
                  {[
                    {
                      label: "Market Cap",
                      value: `$${CoinDetails?.market_data?.market_cap?.usd.toLocaleString()}`,
                    },
                    {
                      label: "Market Cap/FDV",
                      value: CoinDetails?.market_data?.market_cap_fdv_ratio,
                    },
                    {
                      label: "Fully Diluted Valuation",
                      value: `$${CoinDetails?.market_data?.fully_diluted_valuation?.usd.toLocaleString()}`,
                    },
                    {
                      label: "Circulating Supply",
                      value:
                        CoinDetails?.market_data?.circulating_supply.toFixed(0),
                    },
                    {
                      label: "Total Supply",
                      value: CoinDetails?.market_data?.total_supply.toFixed(0),
                    },
                    {
                      label: "Max Supply",
                      value: CoinDetails?.market_data?.total_supply.toFixed(0),
                    },
                    {
                      label: "Total Volume",
                      value: `$${CoinDetails?.market_data?.total_volume?.usd.toLocaleString()}`,
                    },
                  ].map((item, index) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between py-3 border-b border-slate-700/60 last:border-0"
                    >
                      <span className="text-slate-400 font-medium">
                        {item.label}
                      </span>
                      <span className="text-slate-100 font-semibold">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full bg-slate-900">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 medium:grid-cols-2 gap-4">
              <h1 className="text-3xl font-bold text-white mb-2 medium:col-span-2">Info</h1>

              {/* Contract Section */}
              {CoinDetails?.detail_platforms?.ethereum?.contract_address && (
                <div className="bg-slate-800/40 border border-white/10 rounded-lg p-6 space-y-4">
                  <div className="flex flex-col medium:flex-row medium:items-center justify-between">
                    <span className="text-xl text-white mb-4 medium:mb-0">
                      Contract
                    </span>
                    <div className="flex items-center space-x-2 bg-gray-700 rounded-full px-4 py-2">
                      <img
                        src="https://w7.pngwing.com/pngs/268/1013/png-transparent-ethereum-eth-hd-logo-thumbnail.png"
                        alt="Ethereum"
                        className="w-4 h-4 rounded-full"
                      />
                      <span className="text-sm font-medium text-white">
                        {truncatedAddress}
                      </span>
                      <Copy
                        className="w-4 h-4 text-gray-300 cursor-pointer hover:text-white"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            CoinDetails?.detail_platforms?.ethereum
                              ?.contract_address || ""
                          );
                        }}
                      />
                      <ExternalLink className="w-4 h-4 text-gray-300 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                </div>
              )}

              {/* Website Section */}
              {(homepage || announcementUrl) && (
                <div className="bg-slate-800/40 border border-white/10 rounded-lg p-6 space-y-4">
                  <div className="flex flex-col medium:flex-row medium:items-center justify-between">
                    <h2 className="text-xl text-white mb-4 medium:mb-0">
                      Website
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {homepage && (
                        <Link to={homepage}>
                          <span className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium text-white">
                            {getHostname(homepage)}
                          </span>
                        </Link>
                      )}
                      {announcementUrl && (
                        <Link to={announcementUrl}>
                          <span className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium text-white">
                            {getHostname(announcementUrl)}
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Explorers Section */}
              {explorers.length > 0 && (
                <div className="bg-slate-800/40 border border-white/10 rounded-lg p-6 space-y-4">
                  <div className="flex flex-col medium:flex-row medium:items-center justify-between">
                    <h2 className="text-xl text-white mb-4 medium:mb-0">
                      Explorers
                    </h2>
                    <div className="relative">
                      <button
                        onClick={toggleDropdown}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center space-x-2"
                      >
                        <span>{getHostname(explorers[0]) || "Mempool"}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      {isOpen && explorers.length > 1 && (
                        <div className="absolute mt-2 w-48 rounded-lg shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5">
                          <div className="py-1" role="menu">
                            {explorers.slice(1).map((site, index) => (
                              <Link
                                key={index}
                                to={site}
                                className="block px-4 py-2 text-sm text-white hover:bg-gray-600"
                              >
                                {getHostname(site)}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Community Section */}
              <div className="bg-slate-800/40 border border-white/10 rounded-lg p-6 space-y-4">
                <div className="flex flex-col medium:flex-row medium:items-center justify-between">
                  <h2 className="text-xl text-white mb-4 medium:mb-0">
                    Community
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {twitterHandle && (
                      <Link to={`https://x.com/${twitterHandle}`}>
                        <span className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center space-x-2">
                          <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzPDlXeNQE8FwF2AhD7WUcVhfn2NlrqfJdmZJUOp1Tk0T4yYeuF50V3aVtd4H7YzdZOjc&usqp=CAU"
                            alt="Twitter"
                            className="w-5 h-5 rounded-full"
                          />
                          <span>Twitter</span>
                        </span>
                      </Link>
                    )}
                    {redditUrl && (
                      <Link to={redditUrl}>
                        <span className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center space-x-2">
                          <img
                            src="https://pbs.twimg.com/profile_images/1729909787029078016/dBjB3Fnr_400x400.jpg"
                            alt="Reddit"
                            className="w-5 h-5 rounded-full"
                          />
                          <span>Reddit</span>
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Section */}
              <div className="bg-slate-800/40 border border-white/10 rounded-lg p-6 space-y-4">
                <div className="flex flex-col medium:flex-row medium:items-center justify-between">
                  <h2 className="text-xl text-white mb-4 medium:mb-0">
                    Search on
                  </h2>
                  <Link to="https://x.com/?lang=en">
                    <span className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center space-x-2">
                      <Search className="w-4 h-4" />
                      <span>Twitter</span>
                    </span>
                  </Link>
                </div>
              </div>

              {/* Source Code Section */}
              {githubUrl && (
                <div className="bg-slate-800/40 border border-white/10 rounded-lg p-6 space-y-4">
                  <div className="flex flex-col medium:flex-row medium:items-center justify-between">
                    <h2 className="text-xl text-white mb-4 medium:mb-0">
                      Source Code
                    </h2>
                    <Link to={githubUrl}>
                      <span className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center space-x-2">
                        <img
                          src="https://play-lh.googleusercontent.com/PCpXdqvUWfCW1mXhH1Y_98yBpgsWxuTSTofy3NGMo9yBTATDyzVkqU580bfSln50bFU"
                          alt="Github"
                          className="w-5 h-5 rounded-full"
                        />
                        <span>Github</span>
                      </span>
                    </Link>
                  </div>
                </div>
              )}

              {/* API ID Section */}
              {CoinDetails?.id && (
                <div className="bg-slate-800/40 border border-white/10 rounded-lg p-6 space-y-4">
                  <div className="flex flex-col medium:flex-row medium:items-center justify-between">
                    <h2 className="text-xl text-white mb-4 medium:mb-0">
                      API ID
                    </h2>
                    <div className="flex items-center space-x-2">
                      <span className="bg-gray-700 px-4 py-2 rounded-lg text-sm font-medium text-white">
                        {CoinDetails.id}
                      </span>
                      <Copy
                        className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white"
                        onClick={() =>
                          navigator.clipboard.writeText(CoinDetails.id)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Chains Section */}
              {ecosystemCategory && (
                <div className="bg-slate-800/40 border border-white/10 rounded-lg p-6 space-y-4">
                  <div className="flex flex-col medium:flex-row medium:items-center justify-between">
                    <h2 className="text-xl text-white mb-4 medium:mb-0">
                      Chains
                    </h2>
                    <div className="relative">
                      <button
                        onClick={toggleDropdownChains}
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center space-x-2"
                      >
                        <span>{ecosystemCategory}</span>
                        {categories.filter((category) =>
                          category.includes("Ecosystem")
                        ).length > 1 && <ChevronDown className="w-4 h-4" />}
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute mt-2 w-full rounded-lg bg-gray-700 shadow-lg z-50">
                          {categories
                            .filter(
                              (category) =>
                                category.includes("Ecosystem") &&
                                category !== ecosystemCategory
                            )
                            .map((category, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
                              >
                                {category}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Categories Section */}
              {nonEcosystemCategory && (
                <div className="bg-slate-800/40 border border-white/10 rounded-lg p-6 space-y-4">
                  <div className="flex flex-col medium:flex-row medium:items-center justify-between">
                    <h2 className="text-xl text-white mb-4 medium:mb-0">
                      Categories
                    </h2>
                    <div className="relative">
                      <button
                        onClick={() =>
                          document
                            .getElementById("categories-dropdown")
                            .classList.toggle("hidden")
                        }
                        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center space-x-2"
                      >
                        <span>{nonEcosystemCategory}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <div
                        id="categories-dropdown"
                        className="absolute hidden mt-2 w-full rounded-lg bg-gray-700 shadow-lg z-50"
                      >
                        {categories
                          .filter(
                            (category) =>
                              !category?.includes("Ecosystem") &&
                              category !== nonEcosystemCategory
                          )
                          .map((category, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 text-sm font-medium text-white hover:bg-gray-600"
                            >
                              {category}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 text-white space-y-8">
          
          {/* About Section */}
          {description && (
            <div className="bg-slate-800/40 border border-white/10 rounded-xl p-6">
              <div>
                <h2 className="text-2xl font-bold mb-6">
                  About
                </h2>
                <div
                  className="leading-8 mt-2 text-slate-300"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            </div>
          )}
          {/* Markets Section */}
          <div className="bg-slate-800/40 border border-white/10 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col small:flex-row justify-between items-start small:items-center mb-6">
              <h2 className="text-2xl font-bold mb-4 small:mb-0">
                <span className="flex items-center gap-2">
                  <FaExchangeAlt />
                  {CoinDetails?.name} Markets
                </span>
              </h2>
              <button
                onClick={() => setCurrency(currency === "INR" ? "USD" : "INR")}
                className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                {currency}
                <MdSwapVert />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="p-2 text-left text-sm font-semibold text-white">
                      #
                    </th>
                    <th className="p-2 text-left text-sm font-semibold text-white">
                      Exchange
                    </th>
                    <th className="p-2 text-left text-sm font-semibold text-white">
                      Pair
                    </th>
                    <th className="p-2 text-left text-sm font-semibold text-white">
                      Price
                    </th>
                    <th className="p-2 text-left text-sm font-semibold text-white">
                      Spread
                    </th>
                    <th className="p-2 text-left text-sm font-semibold text-white hidden large:table-cell">
                      +2% Depth
                    </th>
                    <th className="p-2 text-left text-sm font-semibold text-white hidden large:table-cell">
                      -2% Depth
                    </th>
                    <th className="p-2 text-left text-sm font-semibold text-white">
                      24h Volume
                    </th>
                    <th className="p-2 text-left text-sm font-semibold text-white hidden medium:table-cell">
                      Last Updated
                    </th>
                    <th className="p-2 text-left text-sm font-semibold text-white">
                      Trust Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MarketsData?.map((market, index) => {
                    if (
                      market?.base?.startsWith("0X") &&
                      market?.target?.startsWith("0X")
                    ) {
                      return null;
                    }
                    return (
                      <tr
                        key={index}
                        className="border-b border-gray-700 hover:bg-gray-700/50"
                      >
                        <td className="p-2 whitespace-nowrap">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <img
                              src={market?.market?.logo}
                              alt={market?.market?.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="truncate max-w-[150px]">
                              {market?.market?.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {`${market?.base}/${market?.target}`}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {currency === "INR"
                            ? `₹${(
                                market?.converted_last?.usd * usdToInrRate
                              ).toFixed(2)}`
                            : `$${market?.converted_last?.usd.toFixed(2)}`}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {`${(market?.bid_ask_spread_percentage * 100).toFixed(
                            2
                          )}%`}
                        </td>
                        <td className="p-2 whitespace-nowrap hidden large:table-cell">
                          {`$${market?.cost_to_move_up_usd.toLocaleString()}`}
                        </td>
                        <td className="p-2 whitespace-nowrap hidden large:table-cell">
                          {`$${market?.cost_to_move_down_usd.toLocaleString()}`}
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          {`$${market?.converted_volume?.usd.toLocaleString()}`}
                        </td>
                        <td className="p-2 whitespace-nowrap hidden medium:table-cell">
                          <div className="flex items-center gap-2">
                            <MdAccessTime className="text-gray-400" />
                            {new Date().getTime() -
                              new Date(market?.last_fetch_at).getTime() <
                            60000 ? (
                              "Recently"
                            ) : (
                              <>
                                {new Date(
                                  market?.last_fetch_at
                                ).toLocaleDateString("en-GB")}
                                <br />
                                {new Date(
                                  market?.last_fetch_at
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded text-white text-xs ${
                              market.trust_score === "green"
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          >
                            {market?.trust_score}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <button
              className="Paginationbutton"
              onClick={handlePreviousPage}
              disabled={disablePrevious}
            >
              <span className="shadow"></span>
              <span className="edge"></span>
              <span className="front text">Previous</span>
            </button>
            <span>Page {currentPage}</span>
            <button
              className={`Paginationbutton `}
              onClick={handleNextPage}
              disabled={disableNext}
            >
              <span className="shadow"></span>
              <span className="edge"></span>
              <span className="front text">Next</span>
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4">
          <div className="mt-10">
            <CoinNewsInDetails />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-10">
          {/* Header */}
          <h1 className="text-2xl font-bold mb-4">
            Trending Coins
          </h1>

          {/* Main Container */}
          <div className="py-6">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-2 xlarge:grid-cols-4 gap-4">
              {/* Coin Cards */}
              {TrendingCoins?.map((coin, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 rounded-xl p-4 
                border border-slate-700 hover:border-teal-500 
                transform transition-all duration-300 hover:scale-[1.02]
                shadow-lg hover:shadow-purple-500/20"
                >
                  {/* Main Content */}
                  <div className="flex items-center justify-between">
                    {/* Left: Coin Info */}
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {/* Coin Image */}
                      <div className="relative">
                        <img
                          src={coin.item.thumb}
                          alt={coin.item.name}
                          className="w-10 h-10 rounded-full ring-2 ring-purple-500/30"
                        />
                      </div>

                      {/* Coin Details */}
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white truncate">
                            {coin.item.symbol}
                          </span>
                          <span className="text-xs text-zinc-400 truncate">
                            {coin.item.name}
                          </span>
                        </div>
                        <span className="text-sm text-zinc-300">
                          ₹
                          {Number(coin.item.data.price).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 6,
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Right: Price Changes */}
                    <div className="flex flex-col items-end justify-center">
                      <div
                        className={`flex items-center px-2 py-1 rounded-lg ${
                          coin.item.data.price_change_percentage_24h.usd > 0
                            ? "bg-green-500/10 text-green-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {coin.item.data.price_change_percentage_24h.usd > 0 ? (
                          <FiChevronUp className="w-4 h-4" />
                        ) : (
                          <FiChevronDown className="w-4 h-4" />
                        )}
                        <span className="ml-1 text-sm font-medium">
                          {Math.abs(
                            coin.item.data.price_change_percentage_24h.usd
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <span className="text-xs text-zinc-500 mt-1">24h</span>
                    </div>
                  </div>

                  {/* Stats Section */}
                  <div className="mt-4 pt-3 border-t border-zinc-700/50 grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-400">
                        Market Cap Rank
                      </span>
                      <span className="text-sm text-white">
                        #{coin.item.market_cap_rank}
                      </span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-xs text-zinc-400">Score</span>
                      <span className="text-sm text-white">
                        {coin.item.score}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-10 mb-24">
          <h1 className="text-xl medium:text-2xl text-sky-400 font-semibold">
            {CoinDetails?.name} ({CoinDetails?.symbol.toUpperCase()}) price has
            increased today.
          </h1>
          <p className="max-w-4xl leading-8 mt-4 text-slate-400">
            The price of {CoinDetails?.name} (
            {CoinDetails?.symbol.toUpperCase()}) is{" "}
            <span className="text-amber-200">
              {" "}
              {(
                CoinDetails?.market_data?.current_price?.usd * usdToInrRate
              ).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}{" "}
            </span>
            today with a total volume of{" "}
            <span className="text-amber-200">
              {" "}
              {(
                CoinDetails?.market_data?.total_volume?.usd * usdToInrRate
              ).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}{" "}
            </span>
            .This represents a{" "}
            <span className="text-amber-200">
              {" "}
              {CoinDetails?.market_data?.price_change_percentage_24h.toFixed(2)}
              %{" "}
            </span>
            price increase in the last 24 hours and a{" "}
            <span className="text-amber-200">
              {" "}
              {CoinDetails?.market_data?.price_change_percentage_7d.toFixed(
                2
              )}%{" "}
            </span>
            price increase in the past 7 days. With a circulating supply of{" "}
            <span className="text-amber-200">
              {CoinDetails?.market_data?.circulating_supply >= 1e12
                ? (CoinDetails?.market_data?.circulating_supply / 1e12).toFixed(
                    2
                  ) + "T"
                : CoinDetails?.market_data?.circulating_supply >= 1e9
                ? (CoinDetails?.market_data?.circulating_supply / 1e9).toFixed(
                    2
                  ) + "B"
                : CoinDetails?.market_data?.circulating_supply >= 1e6
                ? (CoinDetails?.market_data?.circulating_supply / 1e6).toFixed(
                    2
                  ) + "M"
                : CoinDetails?.market_data?.circulating_supply.toLocaleString()}
            </span>
            , <span className="text-amber-200">{CoinDetails?.name}</span> is
            valued at a market cap of{" "}
            <span className="text-amber-200">
              {" "}
              {(
                CoinDetails?.market_data?.market_cap?.usd * usdToInrRate
              ).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            </span>
            .
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoinFullDetails;
