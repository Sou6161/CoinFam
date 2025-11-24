import React, { useState, useEffect, useRef } from "react";
import OnlyHeaderComp from "../Header Folder/OnlyHeaderComp";
import MainPageMarquee from "../MarqueeComponent/MainPageMarquee";
import { IoIosArrowDown } from "react-icons/io";
import { MdCheck } from "react-icons/md";
import Footer from "../../Footer/Footer";

// Sample exchange rates against USD (you would typically get these from an API)
const exchangeRates = {
  "TRON (TRX)": 0.1607,
  "Bitcoin (BTC)": 43000,
  "Ethereum (ETH)": 2200,
  "Tether (USDT)": 1,
  "USD Coin (USDC)": 1,
  "Binance Coin (BNB)": 300,
  "Cardano (ADA)": 0.5,
  "Ripple (XRP)": 0.55,
  "Solana (SOL)": 100,
  "Dogecoin (DOGE)": 0.08,
  "Polkadot (DOT)": 7.5,
  "Shiba Inu (SHIB)": 0.00001,
  "Cosmos (ATOM)": 8,
  "Chainlink (LINK)": 15,
  "Stellar (XLM)": 0.11,
  "Monero (XMR)": 160,
  "Litecoin (LTC)": 70,
  "Bitcoin Cash (BCH)": 240,
  EOS: 0.7,
  "Neo (NEO)": 10,
  "VeChain (VET)": 0.03,
  "Qtum (QTUM)": 3,
  "Bitcoin SV (BSV)": 45,
  "Crypto.com Coin (CRO)": 0.08,
  "Binance USD (BUSD)": 1,
  "TrueUSD (TUSD)": 1,
  "Pax Dollar (USDP)": 1,
  "Gemini Dollar (GUSD)": 1,
  "Huobi Token (HT)": 2.5,
  "OKB (OKB)": 45,
};

// Sample fiat rates against USD
const getFiatRate = (code) => {
  const rates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    AED: 3.67,
    ARS: 823,
    AUD: 1.52,
    BDT: 109.5,
    BHD: 0.376,
    BMD: 1,
    BRL: 4.97,
    CAD: 1.35,
    CHF: 0.88,
    CLP: 960,
    CNY: 7.2,
    CZK: 23.1,
    DKK: 6.85,
    HKD: 7.82,
    HUF: 355,
    IDR: 15600,
    ILS: 3.67,
    INR: 83.5,
    JPY: 148.5,
    KRW: 1330,
    KWD: 0.31,
    LKR: 310,
    MMK: 2100,
    MXN: 17.1,
    MYR: 4.73,
    NGN: 1420,
    NOK: 10.5,
    NZD: 1.64,
    PHP: 55.8,
    PKR: 279,
    PLN: 4.01,
    RUB: 91.5,
    SAR: 3.75,
    SEK: 10.4,
    SGD: 1.34,
    THB: 35.7,
    TRY: 30.8,
    TWD: 31.2,
    UAH: 38.4,
    VEF: 36.1,
    VND: 24500,
    ZAR: 18.9,
    XDR: 0.75,
    XAG: 0.042,
    XAU: 0.0005,
    BITS: 0.000021,
    SATS: 0.000000021,
  };
  return rates[code] || 1;
};

const coins = [
  {
    name: "TRON (TRX)",
    image: "https://cryptologos.cc/logos/tron-trx-logo.png",
  },
  {
    name: "Bitcoin (BTC)",
    image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  },
  {
    name: "Ethereum (ETH)",
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    name: "Tether (USDT)",
    image: "https://cryptologos.cc/logos/tether-usdt-logo.png",
  },
  {
    name: "USD Coin (USDC)",
    image: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
  },
  {
    name: "Binance Coin (BNB)",
    image: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
  },
  {
    name: "Cardano (ADA)",
    image: "https://cryptologos.cc/logos/cardano-ada-logo.png",
  },
  {
    name: "Ripple (XRP)",
    image: "https://cryptologos.cc/logos/ripple-xrp-logo.png",
  },
  {
    name: "Solana (SOL)",
    image: "https://cryptologos.cc/logos/solana-sol-logo.png",
  },
  {
    name: "Dogecoin (DOGE)",
    image: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
  },
  {
    name: "Polkadot (DOT)",
    image: "https://cryptologos.cc/logos/polkadot-dot-logo.png",
  },
  {
    name: "Shiba Inu (SHIB)",
    image: "https://cryptologos.cc/logos/shiba-inu-shib-logo.png",
  },
  {
    name: "Cosmos (ATOM)",
    image: "https://cryptologos.cc/logos/cosmos-atom-logo.png",
  },
  {
    name: "Chainlink (LINK)",
    image: "https://cryptologos.cc/logos/chainlink-link-logo.png",
  },
  {
    name: "Stellar (XLM)",
    image: "https://cryptologos.cc/logos/stellar-xlm-logo.png",
  },
  {
    name: "Monero (XMR)",
    image: "https://cryptologos.cc/logos/monero-xmr-logo.png",
  },
  {
    name: "Litecoin (LTC)",
    image: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
  },
  {
    name: "Bitcoin Cash (BCH)",
    image: "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png",
  },
  { name: "EOS", image: "https://cryptologos.cc/logos/eos-eos-logo.png" },
  { name: "Neo (NEO)", image: "https://cryptologos.cc/logos/neo-neo-logo.png" },
  {
    name: "VeChain (VET)",
    image: "https://cryptologos.cc/logos/vechain-vet-logo.png",
  },
  {
    name: "Qtum (QTUM)",
    image: "https://cryptologos.cc/logos/qtum-qtum-logo.png",
  },
  {
    name: "Bitcoin SV (BSV)",
    image: "https://cryptologos.cc/logos/bitcoin-sv-bsv-logo.png",
  },
  {
    name: "Crypto.com Coin (CRO)",
    image: "https://cryptologos.cc/logos/crypto-com-coin-cro-logo.png",
  },
  {
    name: "Binance USD (BUSD)",
    image: "https://cryptologos.cc/logos/binance-usd-busd-logo.png",
  },
  {
    name: "TrueUSD (TUSD)",
    image: "https://cryptologos.cc/logos/trueusd-tusd-logo.png",
  },
  {
    name: "Pax Dollar (USDP)",
    image: "https://cryptologos.cc/logos/pax-dollar-usdp-logo.png",
  },
  {
    name: "Gemini Dollar (GUSD)",
    image: "https://cryptologos.cc/logos/gemini-dollar-gusd-logo.png",
  },
  {
    name: "Huobi Token (HT)",
    image: "https://cryptologos.cc/logos/huobi-token-ht-logo.png",
  },
  { name: "OKB (OKB)", image: "https://cryptologos.cc/logos/okb-okb-logo.png" },
];

const fiatCurrencies = [
  {
    name: "Bitcoin",
    code: "BTC",
    flag: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  },
  {
    name: "Ether",
    code: "ETH",
    flag: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  },
  {
    name: "Litecoin",
    code: "LTC",
    flag: "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
  },
  {
    name: "Bitcoin Cash",
    code: "BCH",
    flag: "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png",
  },
  {
    name: "Binance Coin",
    code: "BNB",
    flag: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png",
  },
  {
    name: "EOS",
    code: "EOS",
    flag: "https://cryptologos.cc/logos/eos-eos-logo.png",
  },
  {
    name: "XRP",
    code: "XRP",
    flag: "https://cryptologos.cc/logos/ripple-xrp-logo.png",
  },
  {
    name: "Lumens",
    code: "XLM",
    flag: "https://cryptologos.cc/logos/stellar-xlm-logo.png",
  },
  {
    name: "Chainlink",
    code: "LINK",
    flag: "https://cryptologos.cc/logos/chainlink-link-logo.png",
  },
  {
    name: "Polkadot",
    code: "DOT",
    flag: "https://cryptologos.cc/logos/polkadot-dot-logo.png",
  },
  {
    name: "Yearn.finance",
    code: "YFI",
    flag: "https://cryptologos.cc/logos/yearn-finance-yfi-logo.png",
  },
  { name: "US Dollar", code: "USD", flag: "https://flagcdn.com/w20/us.png" },
  {
    name: "United Arab Emirates Dirham",
    code: "AED",
    flag: "https://flagcdn.com/w20/ae.png",
  },
  {
    name: "Argentine Peso",
    code: "ARS",
    flag: "https://flagcdn.com/w20/ar.png",
  },
  {
    name: "Australian Dollar",
    code: "AUD",
    flag: "https://flagcdn.com/w20/au.png",
  },
  {
    name: "Bangladeshi Taka",
    code: "BDT",
    flag: "https://flagcdn.com/w20/bd.png",
  },
  {
    name: "Bahraini Dinar",
    code: "BHD",
    flag: "https://flagcdn.com/w20/bh.png",
  },
  {
    name: "Bermudian Dollar",
    code: "BMD",
    flag: "https://flagcdn.com/w20/bm.png",
  },
  { name: "Brazil Real", code: "BRL", flag: "https://flagcdn.com/w20/br.png" },
  {
    name: "Canadian Dollar",
    code: "CAD",
    flag: "https://flagcdn.com/w20/ca.png",
  },
  { name: "Swiss Franc", code: "CHF", flag: "https://flagcdn.com/w20/ch.png" },
  { name: "Chilean Peso", code: "CLP", flag: "https://flagcdn.com/w20/cl.png" },
  { name: "Chinese Yuan", code: "CNY", flag: "https://flagcdn.com/w20/cn.png" },
  { name: "Czech Koruna", code: "CZK", flag: "https://flagcdn.com/w20/cz.png" },
  { name: "Danish Krone", code: "DKK", flag: "https://flagcdn.com/w20/dk.png" },
  { name: "Euro", code: "EUR", flag: "https://flagcdn.com/w20/eu.png" },
  {
    name: "British Pound Sterling",
    code: "GBP",
    flag: "https://flagcdn.com/w20/gb.png",
  },
  {
    name: "Georgian Lari",
    code: "GEL",
    flag: "https://flagcdn.com/w20/ge.png",
  },
  {
    name: "Hong Kong Dollar",
    code: "HKD",
    flag: "https://flagcdn.com/w20/hk.png",
  },
  {
    name: "Hungarian Forint",
    code: "HUF",
    flag: "https://flagcdn.com/w20/hu.png",
  },
  {
    name: "Indonesian Rupiah",
    code: "IDR",
    flag: "https://flagcdn.com/w20/id.png",
  },
  {
    name: "Israeli New Shekel",
    code: "ILS",
    flag: "https://flagcdn.com/w20/il.png",
  },
  { name: "Indian Rupee", code: "INR", flag: "https://flagcdn.com/w20/in.png" },
  { name: "Japanese Yen", code: "JPY", flag: "https://flagcdn.com/w20/jp.png" },
  {
    name: "South Korean Won",
    code: "KRW",
    flag: "https://flagcdn.com/w20/kr.png",
  },
  {
    name: "Kuwaiti Dinar",
    code: "KWD",
    flag: "https://flagcdn.com/w20/kw.png",
  },
  {
    name: "Sri Lankan Rupee",
    code: "LKR",
    flag: "https://flagcdn.com/w20/lk.png",
  },
  { name: "Burmese Kyat", code: "MMK", flag: "https://flagcdn.com/w20/mm.png" },
  { name: "Mexican Peso", code: "MXN", flag: "https://flagcdn.com/w20/mx.png" },
  {
    name: "Malaysian Ringgit",
    code: "MYR",
    flag: "https://flagcdn.com/w20/my.png",
  },
  {
    name: "Nigerian Naira",
    code: "NGN",
    flag: "https://flagcdn.com/w20/ng.png",
  },
  {
    name: "Norwegian Krone",
    code: "NOK",
    flag: "https://flagcdn.com/w20/no.png",
  },
  {
    name: "New Zealand Dollar",
    code: "NZD",
    flag: "https://flagcdn.com/w20/nz.png",
  },
  {
    name: "Philippine Peso",
    code: "PHP",
    flag: "https://flagcdn.com/w20/ph.png",
  },
  {
    name: "Pakistani Rupee",
    code: "PKR",
    flag: "https://flagcdn.com/w20/pk.png",
  },
  { name: "Polish Zloty", code: "PLN", flag: "https://flagcdn.com/w20/pl.png" },
  {
    name: "Russian Ruble",
    code: "RUB",
    flag: "https://flagcdn.com/w20/ru.png",
  },
  { name: "Saudi Riyal", code: "SAR", flag: "https://flagcdn.com/w20/sa.png" },
  {
    name: "Swedish Krona",
    code: "SEK",
    flag: "https://flagcdn.com/w20/se.png",
  },
  {
    name: "Singapore Dollar",
    code: "SGD",
    flag: "https://flagcdn.com/w20/sg.png",
  },
  { name: "Thai Baht", code: "THB", flag: "https://flagcdn.com/w20/th.png" },
  { name: "Turkish Lira", code: "TRY", flag: "https://flagcdn.com/w20/tr.png" },
  {
    name: "New Taiwan Dollar",
    code: "TWD",
    flag: "https://flagcdn.com/w20/tw.png",
  },
  {
    name: "Ukrainian hryvnia",
    code: "UAH",
    flag: "https://flagcdn.com/w20/ua.png",
  },
  {
    name: "Venezuelan bolívar fuerte",
    code: "VEF",
    flag: "https://flagcdn.com/w20/ve.png",
  },
  {
    name: "Vietnamese đồng",
    code: "VND",
    flag: "https://flagcdn.com/w20/vn.png",
  },
  {
    name: "South African Rand",
    code: "ZAR",
    flag: "https://flagcdn.com/w20/za.png",
  },
  {
    name: "IMF Special Drawing Rights",
    code: "XDR",
    flag: "https://flagcdn.com/w20/imf.png",
  },
  {
    name: "Silver - Troy Ounce",
    code: "XAG",
    flag: "https://flagcdn.com/w20/silver.png",
  },
  {
    name: "Gold - Troy Ounce",
    code: "XAU",
    flag: "https://flagcdn.com/w20/gold.png",
  },
  { name: "Bits", code: "BITS", flag: "https://flagcdn.com/w20/bits.png" },
  {
    name: "Satoshi",
    code: "SATS",
    flag: "https://flagcdn.com/w20/satoshi.png",
  },
];

const CoinConverter = () => {
  const [amount, setAmount] = useState(1);
  const [selectedCoin, setSelectedCoin] = useState("Bitcoin (BTC)");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiatCurrency, setSelectedFiatCurrency] =
    useState("US Dollar (USD)");
  const [isOpenFiatCurrency, setIsOpenFiatCurrency] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState(0);

  // Refs for click outside handling
  const coinDropdownRef = useRef(null);
  const fiatDropdownRef = useRef(null);

  useEffect(() => {
    // Handle clicks outside dropdowns
    const handleClickOutside = (event) => {
      if (
        coinDropdownRef.current &&
        !coinDropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
      if (
        fiatDropdownRef.current &&
        !fiatDropdownRef.current.contains(event.target)
      ) {
        setIsOpenFiatCurrency(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    convertCurrency();
  }, [amount, selectedCoin, selectedFiatCurrency]);

  const convertCurrency = () => {
    const cryptoRate = exchangeRates[selectedCoin] || 0;
    const fiatCode = selectedFiatCurrency.match(/\(([^)]+)\)/)[1];
    const fiatRate = getFiatRate(fiatCode);
    const converted = amount * cryptoRate * fiatRate;
    setConvertedAmount(converted);
  };

  const formatCurrency = (value) => {
    if (value >= 1) {
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      });
    }
  };

  return (
    <><>
      <div className="bg-black">
        <OnlyHeaderComp />
        <MainPageMarquee />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-5 2xlarge:-mt-20  ">
        <div className="w-full max-w-2xl bg-gray-800 rounded-xl p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">
            Cryptocurrency Converter Calculator
          </h1>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Enter Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white"
              placeholder="1.00"
              min="0" />
          </div>

          <div className="mb-6 relative" ref={coinDropdownRef}>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Select Coin
            </label>
            <div
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 cursor-pointer flex items-center justify-between hover:bg-gray-600 transition-colors"
              onClick={() => {
                setIsOpen(!isOpen);
                setIsOpenFiatCurrency(false); // Close other dropdown
              } }
            >
              <div className="flex items-center">
                <img
                  src={coins.find((coin) => coin.name === selectedCoin)?.image}
                  alt={selectedCoin}
                  className="w-6 h-6 mr-2" />
                {selectedCoin}
              </div>
              <IoIosArrowDown
                className={`text-gray-400 transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </div>
            {isOpen && (
              <div className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg max-h-60 overflow-y-auto shadow-lg">
                {Object.keys(exchangeRates).map((coinName) => (
                  <div
                    key={coinName}
                    className={`flex items-center p-3 hover:bg-gray-600 cursor-pointer transition-colors ${selectedCoin === coinName ? "bg-gray-600" : ""}`}
                    onClick={() => {
                      setSelectedCoin(coinName);
                      setIsOpen(false);
                    } }
                  >
                    <img
                      src={coins.find((coin) => coin.name === coinName)?.image}
                      alt={coinName}
                      className="w-6 h-6 mr-2" />
                    {coinName}
                    {selectedCoin === coinName && (
                      <MdCheck className="ml-auto text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6 relative" ref={fiatDropdownRef}>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              Select Currency
            </label>
            <div
              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 cursor-pointer flex items-center justify-between hover:bg-gray-600 transition-colors"
              onClick={() => {
                setIsOpenFiatCurrency(!isOpenFiatCurrency);
                setIsOpen(false); // Close other dropdown
              } }
            >
              <div className="flex items-center">
                <img
                  src={fiatCurrencies.find(
                    (currency) => `${currency.name} (${currency.code})` ===
                      selectedFiatCurrency
                  )?.flag}
                  alt={selectedFiatCurrency}
                  className="w-6 h-6 mr-2" />
                {selectedFiatCurrency}
              </div>
              <IoIosArrowDown
                className={`text-gray-400 transform transition-transform duration-200 ${isOpenFiatCurrency ? "rotate-180" : ""}`} />
            </div>
            {isOpenFiatCurrency && (
              <div className="absolute z-50 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg max-h-60 overflow-y-auto shadow-lg">
                {fiatCurrencies.map((currency) => {
                  const currencyName = `${currency.name} (${currency.code})`;
                  return (
                    <div
                      key={currency.code}
                      className={`flex items-center p-3 hover:bg-gray-600 cursor-pointer transition-colors ${selectedFiatCurrency === currencyName
                          ? "bg-gray-600"
                          : ""}`}
                      onClick={() => {
                        setSelectedFiatCurrency(currencyName);
                        setIsOpenFiatCurrency(false);
                      } }
                    >
                      <img
                        src={currency.flag}
                        alt={currencyName}
                        className="w-6 h-6 mr-2" />
                      {currencyName}
                      {selectedFiatCurrency === currencyName && (
                        <MdCheck className="ml-auto text-green-500" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="text-xl font-bold mb-2">
              {amount} {selectedCoin} =
            </div>
            <div className="text-3xl font-bold text-green-500">
              {formatCurrency(convertedAmount)}{" "}
              {selectedFiatCurrency.split(" ").pop().replace(/[()]/g, "")}
            </div>
            <p className="text-gray-400 text-sm mt-4">
              Last updated at {new Date().toLocaleTimeString()} UTC
            </p>
          </div>
        </div>
      </div>
    </><Footer /></>
  );
};

export default CoinConverter;
