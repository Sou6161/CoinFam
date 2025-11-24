import React, { useEffect, useState } from "react";
import { FaRegNewspaper } from "react-icons/fa6";
import {  FiExternalLink, FiClock, FiUser } from "react-icons/fi";

const CoinNewsInDetails = () => {
  const [cryptoNews, setCryptoNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        
        // Check if data.Data exists and is an array
        if (data && data.Data && Array.isArray(data.Data)) {
          setCryptoNews(data.Data.slice(0, 10));
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching crypto news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCryptoNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 my-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2 text-red-700">
          <strong className="font-medium">Error:</strong>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col items-center space-y-4">
          <button className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
            <span className="flex items-center space-x-2">
              <FaRegNewspaper className="w-5 h-5" />
              <span className="text-lg">Latest Crypto News</span>
            </span>
          </button>
          <div className="w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-2 large:grid-cols-3 gap-6 auto-rows-fr">
          {cryptoNews.map((article, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 bg-white/5 backdrop-blur-lg border border-purple-500/20"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  src={article.imageurl}
                  alt={article.title}
                  onError={(e) => {
                    e.target.src = "https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled.png";
                  }}
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold line-clamp-2 text-white">
                    {article.title}
                  </h2>
                  <p className="text-amber-400/90 line-clamp-3 text-sm">
                    {article.body}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-purple-500/20 space-y-2">
                  <div className="flex flex-col space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <FiUser className="text-green-400" />
                      <span className="text-green-400 font-medium">
                        {article?.source_info?.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiClock className="text-green-400/80" />
                      <span className="text-green-400/80">
                        {formatPublishDate(article?.published_on)}
                      </span>
                    </div>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors duration-200 mt-2"
                  >
                    <span>Read More</span>
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const formatPublishDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (minutes < 1440) {
    return `${Math.floor(minutes / 60)} hours ago`;
  } else {
    return `${Math.floor(minutes / 1440)} days ago`;
  }
};

export default CoinNewsInDetails;