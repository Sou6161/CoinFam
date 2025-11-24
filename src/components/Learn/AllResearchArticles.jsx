import React from "react";
import { Calendar, Clock, User, ExternalLink } from "lucide-react";
import { MdArticle } from "react-icons/md";
import articleData from "../../JsonArticlesData/ResearchArticlesData.json";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import Footer from "../../Footer/Footer";

const AllResearchArticles = () => {
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    if (weeks < 4) return `${weeks} weeks ago`;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const articles = articleData.feed.entry.map((entry) => ({
    id: entry.id,
    title: entry.title,
    url: entry.url,
    published: entry.published,
    updated: entry.updated,
    author: entry.author,
    summary:
      entry.summary || stripHtml(entry.content?.__text).substring(0, 300),
  }));

  return (
    <>
    <div className="min-h-screen bg-gradient-to-r from-[#3f4c6b] to-[#606c88]">
      <div className="top-0 z-50 bg-gray-900 shadow-xl">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <button className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition-all duration-300 ease-out hover:scale-105">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
            <MdArticle className="w-6 h-6 mr-2 relative z-10" />
            <span className="relative z-10">Latest Research Articles</span>
          </button>
        </div>

        <div className="gap-6 grid grid-cols-1 small:grid-cols-2 large:grid-cols-3 2xlarge:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-102 hover:shadow-purple-500/20 border border-gray-700"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-white hover:text-purple-400 transition-colors">
                  <a href={article.url} className="hover:underline">
                    {article.title}
                  </a>
                </h2>

                <div className="grid grid-cols-1 small:grid-cols-2 large:grid-cols-3 2xlarge:grid-cols-4 gap-4 mb-4 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>Published {formatRelativeDate(article.updated)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span>Updated {formatRelativeDate(article.published)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" />
                    <span>By {article.author.name}</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 line-clamp-3">
                  {article.summary}
                </p>

                <div className="mt-auto ">
                  <a
                    href={article.url}
                    className="inline-flex  items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-black font-semibold">
                      Read Article
                    </span>
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-white" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
    <Footer />
    </>
  );
};

export default AllResearchArticles;
