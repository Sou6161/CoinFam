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
        <button className="group inline-flex items-center justify-center px-6 py-3 font-bold rounded-lg text-white bg-teal-600 hover:bg-teal-500 shadow-lg transition-all duration-300 ease-out hover:scale-105">
          <MdArticle className="w-6 h-6 mr-2" />
          <span>Latest Crypto Articles</span>
        </button>
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-3 gap-6 auto-rows-fr">
          {articles?.map((article, index) => (
            <article
              key={index}
              className="flex flex-col bg-slate-900/50 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-102 hover:shadow-teal-500/20 border border-slate-700/60 hover:border-teal-500/60"
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
                <div className="absolute inset-0 bg-slate-950/30"></div>
              </div>

              <div className="flex-1 p-6">
                <h2 className="text-xl font-bold mb-3 text-white line-clamp-2 hover:text-teal-400 transition-colors">
                  {article.title}
                </h2>

                <div className="space-y-2 mt-4">
                  <p className="text-gray-300 text-sm flex items-center">
                    <span className="font-medium text-teal-400">By</span>
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
                  <span className="text-white font-semibold">Read Article</span>
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
            <button className="group inline-flex items-center justify-center px-8 py-4 font-bold rounded-lg text-white bg-teal-600 hover:bg-teal-500 shadow-lg transition-all duration-300 ease-out hover:scale-105">
              <span>See More Articles</span>
              <div className="w-8 h-8 ml-2 flex items-center justify-center">
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
