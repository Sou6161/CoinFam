import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import logo from "../../Images Folder/HeaderLogo.png";
import { Search } from "lucide-react";
import { PiRankingFill } from "react-icons/pi";
import { BiSolidCategory } from "react-icons/bi";
import { FaRectangleList } from "react-icons/fa6";
import { PiSparkleFill } from "react-icons/pi";
import { GiTrophy } from "react-icons/gi";
import { BsBank } from "react-icons/bs";
import { IoCubeSharp } from "react-icons/io5";
import { RiArticleLine, RiNftLine } from "react-icons/ri";
import { FaCoins, FaLightbulb } from "react-icons/fa";
import { TiStarburst, TiStarFullOutline } from "react-icons/ti";
import { FaBookOpen } from "react-icons/fa";
import { ImNewspaper } from "react-icons/im";
import { BiSolidUserAccount } from "react-icons/bi";
import { PiSuitcaseFill } from "react-icons/pi";
import SignUpDialog from "../../Auth/SignUpDialog";
import { signOut, isAuthenticated } from "../../lib/auth";
import SearchBarForMobile from "../SearchBarFeature/SearchBarForMobile";
import { MdAccountBalance } from "react-icons/md";
import SearchBarForLargeScreen from "../SearchBarFeature/SearchBarForLargeScreen";
import CosmicSearchInput from "../SearchBarFeature/CosmicSearchInput";
import { TrendingUp, Shield } from "lucide-react";
import MainContainer from "../../HomePage/HomePageData"

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState("Cryptocurrencies");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isExchangesOpen, setIsExchangesOpen] = useState(false);
  const toggleSearch = () => setIsSearchExpanded(!isSearchExpanded);
  const toggleExchangesDropdown = () => setIsExchangesOpen(!isExchangesOpen);
  const searchRef = useRef(null);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isCryptocurrenciesOpen, setIsCryptocurrenciesOpen] = useState(false);
  const [isNFTDropdownOpen, setIsNFTDropdownOpen] = useState(false);
  const [isLearnDropdownOpen, setIsLearnDropdownOpen] = useState(false);
  const [isMyPortfolio, setisMyPortfolio] = useState(false);
  const [isMyAccountOpen, setisMyAccountOpen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [shouldShowMoreDropdown, setShouldShowMoreDropdown] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isTrendingCoins, setIsTrendingCoins] = useState(true);
  const [isTrendingNFTs, setIsTrendingNFTs] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdownMenu = () => setIsDropdownOpen(!isDropdownOpen);

  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const isLoggedIn =
        window.localStorage.getItem("isUserLoggedIn") === "true";
      setIsSignedUp(isLoggedIn);
    };

    // Check initial auth status
    checkAuthStatus();

    // Listen for storage changes
    window.addEventListener("storage", checkAuthStatus);

    return () => {
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsSignedUp(false);
  };

  const handleSignUp = async (email, password, name) => {
    try {
      await signUp(email, password, name);
      setIsSignedUp(true); // Update the isSignedUp state
      setIsUserLoggedIn(true);
      window.localStorage.setItem("isUserLoggedIn", "true");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedLoginStatus = window.localStorage.getItem("isUserLoggedIn");
    if (storedLoginStatus === "true") {
      setIsUserLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      // Show More dropdown for all screens >= 768px (medium and above)
      setShouldShowMoreDropdown(
        window.innerWidth >= 768 && window.innerWidth <= 1536
      );
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const closeAllDropdowns = () => {
    setIsMoreDropdownOpen(false);
    setIsNFTDropdownOpen(false);
    setIsLearnDropdownOpen(false);
    setisMyPortfolio(false);
    setisMyAccountOpen(false);
  };

  const MenuItems = () => (
    <div className="flex flex-col 2xlarge:flex-row items-stretch 2xlarge:items-center relative w-full 2xlarge:w-auto">
      <Link
        to="/en/nft"
        className="flex items-center text-slate-300 hover:text-white hover:bg-slate-800 2xlarge:hover:bg-transparent px-3 py-2 rounded-md text-sm font-medium w-full 2xlarge:w-auto transition-colors"
      >
        <span>NFT</span>
      </Link>

      <div className="relative w-full  2xlarge:w-auto">
        <button
          type="button"
          onClick={toggleLearnDropdown}
          className="flex items-center justify-between 2xlarge:justify-center text-slate-300 hover:text-white hover:bg-slate-800 2xlarge:hover:bg-transparent px-3 py-2 rounded-md text-sm font-medium w-full 2xlarge:w-auto transition-colors"
        >
          Learn
          <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isLearnDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-[#111827] border border-slate-700 z-50">
            <div className="p-2 space-y-0.5">
              <Link
                to="/learn/crypto-articles"
                className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
              >
                <RiArticleLine className="mr-2" />
                Crypto Articles
              </Link>
              <Link
                to="/learn/research"
                className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
              >
                <FaLightbulb className="mr-2" />
                Research Insights
              </Link>
              <Link
                to="/en/news"
                className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
              >
                <ImNewspaper className="mr-2" />
                Crypto News
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const toggleMyAccountDropdown = () => {
    setisMyAccountOpen(!isMyAccountOpen);
  };

  const toggleMyPortfolioDropdown = () => {
    setisMyPortfolio(!isMyPortfolio);
  };

  const toggleNFTDropdown = () => {
    setIsNFTDropdownOpen(!isNFTDropdownOpen);
  };

  const toggleLearnDropdown = () => {
    setIsLearnDropdownOpen(!isLearnDropdownOpen);
  };

  const toggleCryptocurrenciesDropdown = () => {
    setIsCryptocurrenciesOpen(!isCryptocurrenciesOpen);
  };

  const toggleSignUp = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdownmenu = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    if (item === "Exchanges") {
      setIsDropdownOpen(!isDropdownOpen);
    } else {
      setIsDropdownOpen(false);
    }
  };

  return (
    <>
      <>
        <nav className="bg-[#0b1120] border-b border-slate-800 relative z-50">
          <div className="max-w-7xl mx-auto px-4 small:px-6 large:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo Section */}
              <div className="flex-shrink-0">
                <a
                  href="/"
                  className="flex items-center space-x-3 rtl:space-x-reverse"
                >
                  <img
                    src={logo}
                    className="h-8 relative top-1 2xlarge:h-10"
                    alt="Logo"
                  />
                  <span className="self-center text-[5vw] 2xlarge:text-xl font-semibold whitespace-nowrap dark:text-white"></span>
                </a>
              </div>

              {/* Mobile menu button */}
              <div className="flex medium:hidden">
                <button
                  onClick={toggleDropdownMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className={`${isDropdownOpen ? "hidden" : "block"} h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  <svg
                    className={`${isDropdownOpen ? "block" : "hidden"} h-6 w-6`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Desktop menu */}
              <div className="hidden medium:flex medium:items-center medium:space-x-4 large:mr-[35vw] xlarge:mr-[40vw] 2xlarge:mr-[28vw] ">
                {/* Cryptocurrencies Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleCryptocurrenciesDropdown}
                    className="flex items-center text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                  >
                    <FaCoins className="mr-2" />
                    Cryptocurrencies
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isCryptocurrenciesOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-[#111827] border border-slate-700">
                      <div className="p-2 space-y-0.5">
                        <Link
                          to="/"
                          className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                        >
                          <PiRankingFill className="mr-2" />
                          By Market Cap
                        </Link>
                        {/* Add more mobile menu items */}
                        <Link
                          to="/en/categories"
                          className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                        >
                          <BiSolidCategory className=" mr-2" />
                          Categories
                        </Link>
                        <Link
                          to="/en/highlights"
                          className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                        >
                          <FaRectangleList className=" mr-2" />
                          Highlights
                        </Link>
                        <Link
                          to="/en/newcryptocurrencies"
                          className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                        >
                          <PiSparkleFill className=" mr-2" />
                          New Cryptocurrencies
                        </Link>
                        <Link
                          to="/en/crypto-Top-gainers-losers"
                          className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                        >
                          <GiTrophy className=" mr-2" />
                          Gainers & Losers
                        </Link>
                        <Link
                          to="/en/all-cryptocurrencies"
                          className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                        >
                          All Coins
                        </Link>
                        <Link
                          to="/en/coin-converter"
                          className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                        >
                          Converter
                        </Link>
                        {/* Add more dropdown items */}
                      </div>
                    </div>
                  )}
                </div>

                {/* Exchanges Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleExchangesDropdown}
                    className="flex items-center text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                  >
                    <MdAccountBalance className="mr-2" />
                    Exchanges
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {isExchangesOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-[#111827] border border-slate-700">
                      <div className="p-2 space-y-0.5">
                        <Link
                          to="/en/exchanges"
                          className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <BsBank className="mr-2" />
                          Crypto Exchanges
                        </Link>
                        <Link
                          to="/en/exchanges/derivatives"
                          className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                          <IoCubeSharp className="mr-2" />
                          Derivatives
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {shouldShowMoreDropdown ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
                      className="flex items-center text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                    >
                      More
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {isMoreDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl bg-[#111827] border border-slate-700">
                        <div className="p-2 space-y-0.5">
                          <MenuItems />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <MenuItems />
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className={`${isDropdownOpen ? "block" : "hidden"} medium:hidden`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 ">
              {/* Cryptocurrencies Section */}
              <button
                type="button"
                onClick={toggleCryptocurrenciesDropdown}
                className="w-full text-left flex items-center text-gray-300 hover:text-white px-3 py-2 text-base font-medium"
              >
                <FaCoins className="mr-2" />
                Cryptocurrencies
                <svg
                  className="w-4 h-4 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isCryptocurrenciesOpen && (
                <div className="pl-6 space-y-1">
                  <Link
                    to="/"
                    className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    <PiRankingFill className="mr-2" />
                    By Market Cap
                  </Link>
                  {/* Add more mobile menu items */}
                  <Link
                    to="/en/categories"
                    className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    <BiSolidCategory className=" mr-2" />
                    Categories
                  </Link>
                  <Link
                    to="/en/highlights"
                    className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    <FaRectangleList className=" mr-2" />
                    Highlights
                  </Link>
                  <Link
                    to="/en/newcryptocurrencies"
                    className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    <PiSparkleFill className=" mr-2" />
                    New Cryptocurrencies
                  </Link>
                  <Link
                    to="/en/crypto-Top-gainers-losers"
                    className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    <GiTrophy className=" mr-2" />
                    Gainers & Losers
                  </Link>
                  <Link
                    to="/en/all-cryptocurrencies"
                    className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    All Coins
                  </Link>
                  <Link
                    to="/en/coin-converter"
                    className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    Converter
                  </Link>
                </div>
              )}

              {/* Exchanges Section */}
              <button
                type="button"
                onClick={toggleExchangesDropdown}
                className="w-full text-left flex items-center text-gray-300 hover:text-white px-3 py-2 text-base font-medium"
              >
                <MdAccountBalance className="mr-2" />
                Exchanges
                <svg
                  className="w-4 h-4 ml-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {isExchangesOpen && (
                <div className="pl-6 space-y-1">
                  <Link
                    to="/en/exchanges"
                    className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    <BsBank className="mr-2" />
                    Crypto Exchanges
                  </Link>
                  {/* Add more mobile menu items */}
                  <Link
                    to="/en/exchanges/derivatives"
                    className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm transition-colors"
                  >
                    <IoCubeSharp className=" mr-2" />
                    Derivatives
                  </Link>
                </div>
              )}

              {/* Regular Menu Items */}
              <MenuItems />
            </div>
          </div>
          <div className="">
            <SearchBarForLargeScreen />
          </div>
        </nav>

        <div className="hidden 2xlarge:block w-full max-w-[100vw] 2xlarge:max-w-[100vw] mx-auto 2xlarge:w-full relative overflow-hidden z-0">
          <video
            className="w-full h-auto 2xlarge:h-[60vh] mx-auto object-cover"
            autoPlay
            playsInline
            muted
            loop
            src="https://cdn.pixabay.com/video/2023/10/14/184941-874460311_large.mp4"
          >
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="hidden 2xlarge:block  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[50vh] backdrop-filter backdrop-blur-md bg-zinc-500 bg-opacity-15 rounded-lg">
            <div className="card">
              <div className="w-full h-full flex flex-col justify-center items-center text-white p-8">
                {/* Main Heading */}
                <h1 className="text-4xl font-bold mb-4 text-center">
                  Where Crypto Meets
                  <span className="text-cyan-400">
                    {" "}
                    Digital Art & Innovation
                  </span>
                </h1>

                <p
                  className="text-lg text-center leading-relaxed text-gray-300 
  px-2 py-6 backdrop-blur-sm bg-white/5 rounded-2xl shadow-lg 
  border border-white/10 relative overflow-hidde hover:bg-white/10 
  transition-all duration-300 transform"
                >
                  <span className="relative z-10">
                    Dive into the world of cryptocurrencies and NFTs with
                    <span className="text-cyan-400 font-semibold mx-1 animate-pulse">
                      confidence
                    </span>
                    . From real-time market analytics to discovering the
                    <span className="text-purple-400 font-semibold mx-1">
                      next big NFT collection
                    </span>
                    , we're your trusted companion in the
                    <span className="text-blue-400 font-semibold mx-1">
                      digital asset universe
                    </span>
                    .
                  </span>
                </p>

                {/* Feature Cards */}
                <div className="grid grid-cols-3 gap-6 w-full mt-5 max-w-3xl">
                  <div className="flex flex-col items-center text-center space-y-2 bg-white/5 p-6 rounded-lg backdrop-blur-sm">
                    <Search className="w-8 h-8 text-blue-400 mb-2" />
                    <h3 className="font-semibold">Smart Search</h3>
                    <p className="text-sm text-gray-300">
                      Find any crypto asset instantly with advanced filtering
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-2 bg-white/5 p-6 rounded-lg backdrop-blur-sm">
                    <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
                    <h3 className="font-semibold">Market Analysis</h3>
                    <p className="text-sm text-gray-300">
                      Deep insights and Detailed Info
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center space-y-2 bg-white/5 p-6 rounded-lg backdrop-blur-sm">
                    <Shield className="w-8 h-8 text-purple-400 mb-2" />
                    <h3 className="font-semibold">Reliable Data</h3>
                    <p className="text-sm text-gray-300">
                      Accurate and real-time market information
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" ">
          <SearchBarForMobile />
        </div>

        <div className="2xlarge:hidden mt-0 w-[100vw] border-b-[3px] border-yellow-400"></div>
      </>
      <MainPageMarquee />
      <div className="bg-[#0f172a]">
        <MainContainer />
      </div>
    </>
  );
};

export default Header;
