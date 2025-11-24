import { ExternalLink } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaRegNewspaper } from "react-icons/fa6";
import { FiExternalLink, FiAlertCircle } from "react-icons/fi";

const CryptoNews = () => {
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
          setCryptoNews(data.Data.slice(0, 12));
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
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2 text-red-700">
          <FiAlertCircle className="w-6 h-6" />
          <span className="font-medium">Error loading news: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-8">
        <button className="group relative inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-cyan-600 to-blue-500 px-6 py-3 text-lg font-medium text-white hover:from-cyan-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105">
          <FaRegNewspaper className="w-5 h-5 mr-2" />
          Latest Crypto News
          <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-500 opacity-0 blur transition duration-200 group-hover:opacity-20"></div>
        </button>
      </div>

      <div className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-3 xlarge:grid-cols-4 gap-6">
        {cryptoNews.map((article, index) => (
          <div
            key={index}
            className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                className="w-full h-48 object-cover"
                src={article.imageurl}
                alt={article.title}
                onError={(e) => {
                  e.target.src =
                    "https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled.png";
                }}
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {article.title}
              </h2>
              <p className="text-amber-400 mb-4 line-clamp-3">
                {article.body.split(" ").slice(0, 20).join(" ")}...
              </p>
              <div className="space-y-1 mb-4">
                <p className="text-green-400 font-medium text-sm">
                  {article?.source_info?.name}
                </p>
                <p className="text-green-400 font-medium text-sm">
                  {formatPublishDate(article?.published_on)}
                </p>
              </div>
              <a
                href={article.url}
                className="inline-flex items-center justify-center w-full text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <span className="text-black font-semibold">Read More</span>
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-white" />
              </a>
            </div>
          </div>
        ))}
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

export default CryptoNews;
