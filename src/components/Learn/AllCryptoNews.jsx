import React, { useEffect, useState } from "react";
import {
  Newspaper,
  ExternalLink,
  Loader2,
  Calendar,
  Globe,
} from "lucide-react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import Footer from "../../Footer/Footer";

const AllCryptoNews = () => {
  const [allCryptoNews, setAllCryptoNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPublishDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  useEffect(() => {
    const fetchCryptoNews = async () => {
      try {
        const response = await fetch(
          "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=695cd6c649b0429497ecd26612fcea73328264e00c7eaac6580269c9f3bdc667"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch news");
        }
        const data = await response.json();
        setAllCryptoNews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCryptoNews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
        <p className="mt-4 text-lg text-gray-300">
          Loading latest crypto news...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-red-900/20 border border-red-500 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-400 mb-2">
            Error Loading News
          </h3>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-900">
      <div className="bg-black">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <button className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-lg shadow-2xl bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 transition-all duration-300 ease-out hover:scale-105">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
            <Newspaper className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10">Latest Crypto News</span>
          </button>
        </div>

        {/* Grid with your custom breakpoints */}
        <div className="grid auto-rows-fr gap-6 grid-cols-1 xsmall:grid-cols-1 small:grid-cols-2 medium:grid-cols-2 large:grid-cols-3 xlarge:grid-cols-4 2xlarge:grid-cols-5">
          {allCryptoNews.Data.map((article, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  src={article.imageurl}
                  alt={article.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-2 flex items-center space-x-2 text-xs text-white bg-black/50 rounded-full px-3 py-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatPublishDate(article?.published_on)}</span>
                </div>
              </div>

              <div className="flex flex-col flex-grow p-4">
                <h2 className="text-lg font-bold text-white mb-3 line-clamp-2 hover:text-purple-400 transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                  {article.body.split(" ").slice(0, 20).join(" ")}...
                </p>

                <div className="mt-auto space-y-3">
                  <div className="flex items-center space-x-2 text-xs text-purple-400">
                    <Globe className="w-4 h-4 text-lime-400" />
                    <span className="font-medium text-lime-400">
                      {article?.source_info?.name}
                    </span>
                  </div>

                  <a
                    href={article.url}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200 group hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    <span className="text-black font-semibold">Read More</span>
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-white" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default AllCryptoNews;
