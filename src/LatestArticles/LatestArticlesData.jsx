import React, { useState, useEffect } from "react";
import ArticlesData from "../JsonArticlesData/ArticlesData.json";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addArticlesData } from "../ReduxSlice/LatestAllArticlesSlice";
import { ExternalLink } from "lucide-react";
import { MdArticle } from "react-icons/md";

const LatestArticlesData = () => {
  const [articles, setArticles] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const entries = ArticlesData.feed.entry;
    const articleData = entries.map((entry) => ({
      title: entry.title,
      image: entry.content.__text.match(/src="([^"]+)"/)
        ? entry.content.__text.match(/src="([^"]+)"/)[1]
        : null,
      author: entry.author.name,
      publishedDate: new Date(entry.published).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      link: entry.link._href,
    }));

    dispatch(addArticlesData(articleData));
    setArticles(articleData.slice(0, 10));
  }, [dispatch]);

  return (
    <div className="py-8 px-4">
      <div className="flex justify-center mb-8">
        <button className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold rounded-lg text-white bg-gradient-to-r from-blue-500 to-teal-600 shadow-lg transition-all duration-300 ease-out hover:scale-105">
          <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
          <MdArticle className="w-6 h-6 mr-2 relative z-10" />
          <span className="relative z-10">Latest Crypto Articles</span>
        </button>
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-3 gap-6 auto-rows-fr">
          {articles?.map((article, index) => (
            <article
              key={index}
              className="flex flex-col bg-gray-800 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-102 hover:shadow-purple-500/20 border border-gray-700"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                  src={article.image}
                  alt={article.title}
                  onError={(e) => {
                    e.target.src =
                      "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 via-transparent to-transparent opacity-60"></div>
              </div>

              <div className="flex-1 p-6">
                <h2 className="text-xl font-bold mb-3 text-white line-clamp-2 hover:text-purple-400 transition-colors">
                  {article.title}
                </h2>

                <div className="space-y-2 mt-4">
                  <p className="text-gray-300 text-sm flex items-center">
                    <span className="font-medium text-purple-400">By</span>
                    <span className="ml-2">{article.author}</span>
                  </p>
                  <p className="text-gray-400 text-sm">
                    {article.publishedDate}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 mt-auto">
                <Link
                  to={article.link}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 group w-full justify-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-black font-semibold">Read Article</span>
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-white" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link
            to="/learn/crypto-articles"
            onClick={() => {
              // This will force a full page refresh when navigating
              window.location.href = "/learn/crypto-articles";
            }}
          >
            <button className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-bold rounded-lg text-white bg-gradient-to-r from-teal-600 to-blue-500 shadow-lg transition-all duration-300 ease-out hover:scale-105">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-teal-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
              <span className="relative z-10">See More Articles</span>
              <div className="relative z-10 w-8 h-8 ml-2 flex items-center justify-center">
                <div className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-teal-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></div>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LatestArticlesData;
