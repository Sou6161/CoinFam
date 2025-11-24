import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ArticlesData from "../../JsonArticlesData/ArticlesData.json";
import { addArticlesData } from "../../ReduxSlice/LatestAllArticlesSlice";
import { MdArticle } from "react-icons/md";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import Footer from "../../Footer/Footer";

const AllCryptoArticles = () => {
  const dispatch = useDispatch();
  const articles = useSelector((state) => state?.AllArticles?.ArticlesData);

  useEffect(() => {
    if (!articles || articles.length === 0) {
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
    }
  }, [dispatch, articles]);

  return (
    <><div className="min-h-screen bg-gradient-to-r from-[#3f4c6b] to-[#606c88]">
      <div className="top-0 z-50 bg-gray-900 shadow-xl">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>

      <main className="container mx-auto px-4 py-20">
        <div className="flex justify-center mb-8">
          <button className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-300 ease-out hover:scale-105">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
            <MdArticle className="w-6 h-6 mr-2 relative z-10" />
            <span className="relative z-10">Latest Crypto Articles</span>
          </button>
        </div>

        <div className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-3 2xlarge:grid-cols-4 gap-6 auto-rows-fr">
          {articles?.map((article, index) => (
            <article
              key={index}
              className="flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-102 hover:shadow-purple-500/20 border border-gray-700"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                  src={article.image}
                  alt={article.title}
                  onError={(e) => {
                    e.target.src =
                      "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg";
                  } } />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
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
      </main>
    </div><Footer /></>
  );
};

export default AllCryptoArticles;
