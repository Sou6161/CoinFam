import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import App from "../App.jsx";
// import LatestAllArticlesData from "../LatestArticles/LatestAllArticlesData.jsx";
import CoinFullDetails from "../components/CoinDetails/CoinFullDetails.jsx";
import CryptoCategoriesByMC from "../components/CategoriesList/CryptoCategoriesByMC.jsx";
import CryptoHighlightsData from "../components/CryptoHighlights/CryptoHighlightsData.jsx";
import AllCoins from "../components/CryptoTools/AllCoins.jsx";
import CompareCoins from "../components/CryptoTools/CompareCoins.jsx";
import CoinConverter from "../components/CryptoTools/CoinConverter.jsx";
import NewCryptocurrenciesPage from "../components/NewCryptos/NewCryptocurrenciesPage.jsx";
import AllCategoriesCoins from "../components/CategoriesList/AllCategoriesCoins.jsx";
import NewCryptocurrencies from "../components/CryptoCurrencies/NewCryptocurrencies.jsx";
import TopGainerAndLosers from "../components/GainersandLosers/TopGainerAndLosers.jsx";
import CryptoExchanges from "../components/Exchanges/CryptoExchanges.jsx";
import ExchangesTickers from "../components/Exchanges/ExchangesTickers.jsx";
import ExchangeDerivatives from "../components/Derivatives/ExchangeDerivatives.jsx";
import NftFloorPriceLIst from "../components/NftSection/NftFloorPriceLIst.jsx";
import NFTsFullData from "../components/NftSection/NFTsFullData.jsx";
import NFTsRelatedCoins from "../components/NftSection/NFTsRelatedCoins.jsx";
import AllCryptoArticles from "../components/Learn/AllCryptoArticles.jsx";
import AllResearchArticles from "../components/Learn/AllResearchArticles.jsx";
import AllCryptoNews from "../components/Learn/AllCryptoNews.jsx";
import MyWatchListCoins from "../components/MyPortfolio/MyWatchListCoins.jsx";
import MyWatchListNfts from "../components/MyPortfolio/MyWatchListNfts.jsx";
import CryptoLoader from "../components/Loader/CryptoLoader.jsx";

const RoutesConfig = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader for 2 seconds on initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <CryptoLoader />;
  }

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/learn/crypto-articles" element={<AllCryptoArticles />} />
      <Route path="/en/coins/:id" element={<CoinFullDetails />} />
      <Route path="/en/categories" element={<CryptoCategoriesByMC />} />
      <Route path="/en/categories/:id" element={<AllCategoriesCoins />} />
      <Route path="/en/highlights" element={<CryptoHighlightsData />} />
      <Route path="/en/all-cryptocurrencies" element={<AllCoins />} />
      <Route path="/en/compare-cryptocurrencies" element={<CompareCoins />} />
      <Route path="/en/coin-converter" element={<CoinConverter />} />
      <Route
        path="/en/new-cryptocurrencies"
        element={<NewCryptocurrenciesPage />}
      />  
      <Route
        path="/en/crypto-Top-gainers-losers"
        element={<TopGainerAndLosers />}
      />
      <Route path="/en/newcryptocurrencies" element={<NewCryptocurrencies />} />
      <Route path="/en/exchanges" element={<CryptoExchanges />} />
      <Route path="/en/exchanges/:id" element={<ExchangesTickers />} />
      <Route
        path="/en/exchanges/derivatives"
        element={<ExchangeDerivatives />}
      />
      <Route path="/en/nft" element={<NftFloorPriceLIst />} />
      <Route path="/en/nft/:id" element={<NFTsFullData />} />
      <Route path="/en/nftcoins" element={<NFTsRelatedCoins />} />
      <Route path="/learn/crypto-articles" element={<AllCryptoArticles />} />
      <Route path="/learn/research" element={<AllResearchArticles />} />
      <Route path="/en/news" element={<AllCryptoNews />} />
      <Route path="/en/coins-portfolio" element={<MyWatchListCoins/>}/>
      <Route path="/en/nft-portfolio" element={<MyWatchListNfts/>}/>
    </Routes>
  );
};

export default RoutesConfig;
