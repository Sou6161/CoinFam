// Global fetch interceptor for CoinGecko requests.
//
// Why: every CoinGecko call in the app either sent the demo key as the custom
// header `x-cg-demo-api-key` (which forces a CORS preflight) or sent no key at
// all (unauthenticated → tiny rate limit). Under frequent requests CoinGecko
// returns 429, and 429 responses carry no `Access-Control-Allow-Origin` header,
// so the browser reports it as a "CORS policy" error.
//
// This interceptor fixes both problems for EVERY call site at once:
//   1. Appends the demo key as a query param (`x_cg_demo_api_key`) — this
//      authenticates the request AND keeps it a "simple" request (no preflight).
//   2. Strips the custom `x-cg-demo-api-key` header so no preflight is triggered.
//   3. Rotates across the available demo keys to spread the per-key rate limit.
//   4. Retries once on 429 (after a short backoff) with the next key.

const CG_DEMO_KEYS = [
  "CG-2Z7JgtGQLakF9xMzXy5iZVBW",
  "CG-B2wvefqXSU5JnP1hXSLvsjJG",
  "CG-uEjwN42HqyNMERt6PSkdUKmt",
  "CG-DqWbYSVCpeXqW2u5FVrX8dxb",
  "CG-P5J6trgDvd5J9xovbMoUBucp",
  "CG-GugEYap1Gu6N1HhBo5e3j4mg",
  "CG-iGgYApBixUvhb2mF9cwDtjjt",
];

let keyIndex = 0;
const nextKey = () => CG_DEMO_KEYS[keyIndex++ % CG_DEMO_KEYS.length];

const withKey = (url, key) => {
  if (url.includes("x_cg_demo_api_key=")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}x_cg_demo_api_key=${key}`;
};

// Strip the preflight-triggering header; keep everything else.
const cleanInit = (init) => {
  if (!init) return init;
  const { headers, ...rest } = init;
  if (!headers) return { ...rest };
  const cleaned = { ...headers };
  delete cleaned["x-cg-demo-api-key"];
  delete cleaned["X-Cg-Demo-Api-Key"];
  return { ...rest, headers: cleaned };
};

export function installCoinGeckoFetch() {
  if (typeof window === "undefined" || window.__cgFetchInstalled) return;
  window.__cgFetchInstalled = true;

  const originalFetch = window.fetch.bind(window);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input?.url;
    // Only intercept CoinGecko calls; everything else passes through untouched.
    if (!url || !url.includes("api.coingecko.com")) {
      return originalFetch(input, init);
    }

    const cleaned = cleanInit(init);
    let response = await originalFetch(withKey(url, nextKey()), cleaned);

    // One retry on rate limit, with a different key and small backoff.
    if (response.status === 429) {
      await sleep(1200);
      response = await originalFetch(withKey(url, nextKey()), cleaned);
    }
    return response;
  };
}
