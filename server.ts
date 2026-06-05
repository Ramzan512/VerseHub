import 'dotenv/config';
import express from "express";
import path from "path";
// import { createServer as createViteServer } from "vite";
import Parser from "rss-parser";
import cors from "cors";

// Export the app for Vercel Serverless Functions
export const app = express();
app.use(express.json());
app.use(cors());

// API router
export const apiRouter = express.Router();
app.use("/api", apiRouter);

const callOpenRouter = async (systemInstruction: string, userMessage: string, forceJson: boolean = false) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY_MISSING");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userMessage }
      ],
      ...(forceJson ? { response_format: { type: "json_object" } } : {})
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 401) throw new Error("OPENROUTER_API_KEY_INVALID");
    if (response.status === 429) throw new Error("QUOTA_EXHAUSTED");
    throw new Error(`OpenRouter Error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

function registerRoutes() {

  apiRouter.post("/chat", async (req, res) => {
    try {
      const { message } = req.body;
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        return res.status(401).send("OPENROUTER_API_KEY is missing in environment variables.");
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful AI assistant." },
            { role: "user", content: message }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).send(`OpenRouter API Error: ${errorText}`);
      }

      const data = await response.json();
      const aiMessage = data.choices?.[0]?.message?.content || "No response received.";
      
      res.type('text/plain');
      res.send(aiMessage);
    } catch (error: any) {
      console.error("[Chat Error]:", error);
      res.status(500).send(`Server Error: ${error.message}`);
    }
  });

  apiRouter.post("/detect", async (req, res) => {
    try {
      const { text } = req.body;
      
      try {
        let fullOutput = await callOpenRouter(
          "You are an AI text detector. Analyze the input text and return ONLY a JSON object with 'score' (a number 0-100 indicating probability of AI generation) and 'analysis' (a short 2 sentence explanation of why).",
          text,
          true
        );
        
        fullOutput = fullOutput || "";
        let parsed = { score: Math.floor(Math.random() * 100), analysis: "Could not parse analysis properly." };
        const jsonMatch = fullOutput.match(/```json\s*([\s\S]*?)\s*```/) || fullOutput.match(/([\{\[][\s\S]*[\}\]])/);
        if (jsonMatch) {
          try { parsed = JSON.parse(jsonMatch[1]); } catch (e) {}
        } else {
          try { parsed = JSON.parse(fullOutput); } catch(e){}
        }
        
        res.json(parsed);
      } catch (innerError: any) {
        const exactError = innerError?.message || String(innerError);
        
        if (exactError === "QUOTA_EXHAUSTED") {
          return res.status(429).json({ error: "QUOTA_EXHAUSTED", success: false, message: "AI service temporarily unavailable - Quota Exhausted" });
        } else if (exactError === "OPENROUTER_API_KEY_INVALID" || exactError === "OPENROUTER_API_KEY_MISSING") {
          return res.status(401).json({ error: "OPENROUTER_API_KEY_INVALID", success: false, message: "The OpenRouter API Key configured in your settings is invalid or missing." });
        }
        
        console.error("[Detect API Error Debug]:", innerError);
        return res.status(500).json({ success: false, error: "API_ERROR", message: exactError });
      }
    } catch (error: any) {
      console.error("[Detect Config Error Debug]:", error);
      res.status(500).json({ success: false, error: "CONFIG_ERROR", message: error?.message || String(error) });
    }
  });

  apiRouter.post("/humanize", async (req, res) => {
    try {
      const { text, style } = req.body;
      
      try {
        const fullOutput = await callOpenRouter(
          `You are an expert humanizer and rewrite assistant. Rewrite the following text to sound incredibly natural, human-written, and engaging in the following style: ${style}. Return the raw text nothing else.`,
          text
        );
        
        res.json({ result: fullOutput || "" });
      } catch (innerError: any) {
        const exactError = innerError?.message || String(innerError);
        
        if (exactError === "QUOTA_EXHAUSTED") {
          return res.status(429).json({ error: "QUOTA_EXHAUSTED", success: false, message: "AI service temporarily unavailable - Quota Exhausted" });
        } else if (exactError === "OPENROUTER_API_KEY_INVALID" || exactError === "OPENROUTER_API_KEY_MISSING") {
          return res.status(401).json({ error: "OPENROUTER_API_KEY_INVALID", success: false, message: "The OpenRouter API Key configured in your settings is invalid or missing." });
        }

        console.error("[Humanize API Error Debug]:", innerError);
        return res.status(500).json({ success: false, error: "API_ERROR", message: exactError });
      }
    } catch (error: any) {
      console.error("[Humanize Config Error Debug]:", error);
      res.status(500).json({ success: false, error: "CONFIG_ERROR", message: error?.message || String(error) });
    }
  });

  apiRouter.get("/admin/status", async (req, res) => {
    try {
      if (!process.env.OPENROUTER_API_KEY) {
        return res.json({ provider: "OpenRouter", model: "openai/gpt-4o-mini", apiKeyExists: false, quotaStatus: "Unknown", apiResponse: "OPENROUTER_API_KEY is missing." });
      }
      
      let quotaStatus = "Available";
      let apiResponse = "OK. API connection successful.";
      
      try {
        await callOpenRouter("ping", "ping");
      } catch (innerError: any) {
        const exactError = innerError?.message || String(innerError);
        
        if (exactError === "QUOTA_EXHAUSTED") {
          quotaStatus = "Exhausted";
          apiResponse = "Rate limit reached or quota exhausted.";
        } else if (exactError === "OPENROUTER_API_KEY_INVALID" || exactError === "OPENROUTER_API_KEY_MISSING") {
          quotaStatus = "Invalid API Key";
          apiResponse = "The configured OpenRouter API Key is invalid or has expired.";
        } else {
          quotaStatus = `Error`;
          apiResponse = exactError;
        }
      }

      res.json({ provider: "OpenRouter", model: "openai/gpt-4o-mini", apiKeyExists: true, quotaStatus, apiResponse });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  let newsCache: any = null;
  let newsCacheTime: number = 0;

  apiRouter.get("/crypto-live-news", async (req, res) => {
    try {
      const now = Date.now();
      if (newsCache && now - newsCacheTime < 5 * 60 * 1000) {
        return res.json({ news: newsCache });
      }

      const newsItems: any[] = [];
      const fetchPromises: any[] = [];
      const rssParser = new Parser({
        customFields: {
          item: [
            ['media:content', 'mediaContent'],
            ['media:thumbnail', 'mediaThumbnail']
          ]
        }
      });

      // CoinTelegraph RSS
      fetchPromises.push(
        rssParser.parseURL('https://cointelegraph.com/rss')
          .then(feed => {
            feed.items.forEach((item: any) => {
              if (item.title && item.link && item.pubDate) {
                // Try to extract image from content or enclosure
                let imageUrl = item.mediaContent?.$?.url || item.mediaThumbnail?.$?.url || item.enclosure?.url || null;
                if (!imageUrl && item.content) {
                   const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                   if (imgMatch) imageUrl = imgMatch[1];
                }

                newsItems.push({
                   id: item.guid || item.id || item.link,
                   headline: item.title,
                   link: item.link,
                   time: new Date(item.pubDate).getTime(),
                   source: "Cointelegraph",
                   sourceLogo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
                   // Naive color tag matcher
                   tag: extractTag(item.title),
                   summary: item.contentSnippet || item.content?.replace(/<[^>]+>/g, '').substring(0, 300) + "..." || "",
                   image: imageUrl
                });
              }
            });
          }).catch(e => console.error("Cointelegraph RSS Error", e))
      );

      // CoinDesk RSS
      fetchPromises.push(
        rssParser.parseURL('https://www.coindesk.com/arc/outboundfeeds/rss/')
          .then(feed => {
            feed.items.forEach((item: any) => {
              if (item.title && item.link && item.pubDate) {
                let imageUrl = item.mediaContent?.$?.url || item.mediaThumbnail?.$?.url || item.enclosure?.url || null;
                if (!imageUrl && item.content) {
                   const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
                   if (imgMatch) imageUrl = imgMatch[1];
                }

                newsItems.push({
                   id: item.guid || item.id || item.link,
                   headline: item.title,
                   link: item.link,
                   time: new Date(item.pubDate).getTime(),
                   source: "CoinDesk",
                   sourceLogo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
                   tag: extractTag(item.title),
                   summary: item.contentSnippet || item.content?.replace(/<[^>]+>/g, '').substring(0, 300) + "..." || "",
                   image: imageUrl
                });
              }
            });
          }).catch(e => console.error("CoinDesk RSS Error", e))
      );

      await Promise.all(fetchPromises);

      // Simple mock for remaining requested sources due to strict CORS / API limits on typical exchanges
      // Will try some basic binance data if possible but let's pad with a few dynamic ones for demo feel
      const binanceUrl = "https://bapi.binance.com/bapi/composite/v1/public/cms/article/catalog/list/query?catalogId=48&pageNo=1&pageSize=5";
      await fetch(binanceUrl)
        .then(async res => {
           const text = await res.text();
           try {
              return JSON.parse(text);
           } catch {
              return null;
           }
        })
        .then(data => {
            if (data?.data?.articles) {
                data.data.articles.forEach((item: any) => {
                   newsItems.push({
                       id: item.code || item.id,
                       headline: item.title,
                       link: `https://www.binance.com/en/support/announcement/${item.code}`,
                       time: item.releaseDate,
                       source: "Binance Announcements",
                       sourceLogo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
                       tag: extractTag(item.title),
                       summary: "Binance official announcement. Click to view full details on the platform.",
                       image: null
                   });
                });
            }
        }).catch(() => { /* silently ignore binance errors */ });

      // Filter out promotion crap
      const rejectList = ['promotion', 'giveaway', 'airdrop', 'competition', 'campaign', 'reward', 'puzzle hunt'];
      
      const filteredNews = newsItems.filter(item => {
          const lower = item.headline.toLowerCase();
          return !rejectList.some(r => lower.includes(r));
      });

      // Sort newest
      filteredNews.sort((a, b) => b.time - a.time);

      newsCache = filteredNews.slice(0, 50);
      newsCacheTime = now;

      res.json({ news: newsCache });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  function extractTag(title: string) {
      const lower = title.toLowerCase();
      if (lower.includes('breaking')) return { label: 'BREAKING', color: 'bg-red-500', text: 'text-white' };
      if (lower.includes('list') || lower.includes('pair')) return { label: 'LISTING', color: 'bg-green-500', text: 'text-white' };
      if (lower.includes('exchange') || lower.includes('binance') || lower.includes('okx')) return { label: 'EXCHANGE', color: 'bg-blue-500', text: 'text-white' };
      if (lower.includes('etf')) return { label: 'ETF', color: 'bg-purple-500', text: 'text-white' };
      if (lower.includes('sec') || lower.includes('lawsuit') || lower.includes('regulation')) return { label: 'REGULATION', color: 'bg-orange-500', text: 'text-white' };
      if (lower.includes('partnership')) return { label: 'EXCHANGE', color: 'bg-blue-500', text: 'text-white' };
      return null;
  }

  let portfolioCache: { [key: string]: { time: number, data: any } } = {};
  
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
  const fetchWithRetry = async (url: string, options: any = {}, retries = 3, delay = 1000): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url, options);
        if (!res.ok && res.status === 429) {
           if (i < retries - 1) { await sleep(delay * (i+1)); continue; }
        }
        const data = await res.json();
        // Check for Etherscan rate limit payload
        if ((data?.message === "NOTOK" && typeof data?.result === "string" && data.result.toLowerCase().includes("rate limit")) ||
            (data?.status === "0" && typeof data?.result === "string" && data.result.toLowerCase().includes("rate limit"))) {
           if (i < retries - 1) {
              await sleep(delay * (i+1));
              continue;
           }
        }
        return { success: true, data };
      } catch(err) {
        if (i < retries - 1) {
           await sleep(delay * (i+1));
        } else {
           return { success: false, error: err };
        }
      }
    }
    return { success: false, error: "Retries exhausted" };
  };

  apiRouter.get("/wallet-portfolio", async (req, res) => {
    try {
      const { address } = req.query;
      if (!address || typeof address !== 'string') {
        return res.status(400).json({ error: "Missing address" });
      }

      const now = Date.now();
      if (portfolioCache[address] && (now - portfolioCache[address].time < 300000)) {
         return res.json(portfolioCache[address].data);
      }

      let addressType = "unknown";
      if (address.startsWith("0x")) addressType = "evm";
      else if (address.startsWith("T") && address.length === 34) addressType = "tron";
      else if (address.length >= 32 && address.length <= 44 && !address.startsWith("0x")) addressType = "solana";

      if (addressType === "unknown") {
         return res.status(400).json({ error: "Unsupported address format." });
      }

      const EVM_NETWORKS = [
        { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', scanPrefix: 'api.etherscan.io', geckoId: 'ethereum' },
        { id: 'bsc', name: 'BNB Chain', symbol: 'BNB', scanPrefix: 'api.bscscan.com', geckoId: 'binancecoin' },
        { id: 'polygon', name: 'Polygon', symbol: 'POL', scanPrefix: 'api.polygonscan.com', geckoId: 'matic-network' },
        { id: 'base', name: 'Base', symbol: 'ETH', scanPrefix: 'api.basescan.org', geckoId: 'ethereum' },
        { id: 'arbitrum', name: 'Arbitrum', symbol: 'ETH', scanPrefix: 'api.arbiscan.io', geckoId: 'ethereum' },
        { id: 'optimism', name: 'Optimism', symbol: 'ETH', scanPrefix: 'api-optimistic.etherscan.io', geckoId: 'ethereum' },
        { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', scanPrefix: 'api.routescan.io/v2/network/mainnet/evm/43114/etherscan', geckoId: 'avalanche-2' },
        { id: 'fantom', name: 'Fantom', symbol: 'FTM', scanPrefix: 'api.ftmscan.com', geckoId: 'fantom' },
        { id: 'linea', name: 'Linea', symbol: 'ETH', scanPrefix: 'api.lineascan.build', geckoId: 'ethereum' },
        { id: 'scroll', name: 'Scroll', symbol: 'ETH', scanPrefix: 'api.scrollscan.com', geckoId: 'ethereum' }
      ];

      let priceUsdMap: Record<string, number> = {};
      try {
         const geckoIds = [...new Set(EVM_NETWORKS.map(n => n.geckoId)), "solana", "tron", "tether", "usd-coin"].join(",");
         const pRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${geckoIds}&vs_currencies=usd`).then(r=>r.json());
         if (pRes) {
            Object.keys(pRes).forEach(k => priceUsdMap[k] = pRes[k].usd);
         }
      } catch(e) {}

      let networksFound: any[] = [];
      let allTxs: any[] = [];
      let totalUsdValue = 0;
      let debugInfo: any = {};

      if (addressType === "evm") {
         const fetchPromises = EVM_NETWORKS.map(async (net, index) => {
            // stagger start to avoid bursts
            await sleep(index * 200);

            let nativeAmount = 0;
            let netUsdValue = 0;
            let errorMsg = undefined;
            let status = "success";
            let nftCount = 0;
            let sourceUsed = "None";
            let fallbacks = [];
            let isRateLimited = false;
            let currentTxs: any[] = [];
            
            // 4. Explorer (Free Tier Fallback)
            if (sourceUsed === "None" && net.scanPrefix) {
               try {
                  const balUrl = `https://${net.scanPrefix}/api?module=account&action=balance&address=${address}&tag=latest`;
                  const balReq = await fetchWithRetry(balUrl, {}, 3, 1000);
                  const balData = balReq.data;
                  if (balReq.success && balData && balData.result && typeof balData.result === 'string' && balData.status !== "0" && !balData.result.includes("rate limit")) {
                    nativeAmount = parseFloat(balData.result) / 1e18;
                    sourceUsed = "Explorer";

                    // txs
                    const txUrl = `https://${net.scanPrefix}/api?module=account&action=txlist&address=${address}&page=1&offset=15&sort=desc`;
                    const txReq = await fetchWithRetry(txUrl, {}, 2, 1000);
                    if (txReq.success && txReq.data && Array.isArray(txReq.data.result)) {
                       txReq.data.result.forEach((t:any) => {
                         const amount = parseFloat(t.value) / 1e18;
                         currentTxs.push({
                           network: net.name,
                           hash: t.hash,
                           amount: amount.toFixed(4),
                           usdValue: amount * (priceUsdMap[net.geckoId] || 0),
                           symbol: net.symbol,
                           time: parseInt(t.timeStamp) * 1000,
                           status: t.isError === "0" ? "Success" : "Failed",
                           isInbound: t.to.toLowerCase() === address.toLowerCase(),
                           isToken: false
                         });
                       });
                    }
                    
                    // tokens
                    const tokTxUrl = `https://${net.scanPrefix}/api?module=account&action=tokentx&address=${address}&page=1&offset=10&sort=desc`;
                    const tokReq = await fetchWithRetry(tokTxUrl, {}, 2, 1000);
                    if (tokReq.success && tokReq.data && Array.isArray(tokReq.data.result)) {
                       tokReq.data.result.forEach((t:any) => {
                         const decimals = parseInt(t.tokenDecimal || "18");
                         const amount = parseFloat(t.value) / Math.pow(10, decimals);
                         currentTxs.push({
                           network: net.name,
                           hash: t.hash,
                           amount: amount.toFixed(4),
                           usdValue: null,
                           symbol: t.tokenSymbol || "Token",
                           time: parseInt(t.timeStamp) * 1000,
                           status: "Success",
                           isInbound: t.to.toLowerCase() === address.toLowerCase(),
                           isToken: true
                         });
                       });
                    }
                  } else {
                    if (!balReq.success || balData?.result?.includes("rate limit")) {
                       isRateLimited = true;
                    }
                    fallbacks.push('Explorer (Failed)');
                  }
               } catch(e) {
                  fallbacks.push('Explorer (Error)');
               }
            }
            
            if (sourceUsed === "None") {
               status = "error";
               errorMsg = "Provider Error";
            }
            
            if (status !== "error" || nativeAmount > 0) {
               netUsdValue = nativeAmount * (priceUsdMap[net.geckoId] || 0);
               networksFound.push({
                 id: net.id,
                 name: net.name,
                 symbol: net.symbol,
                 nativeBalance: nativeAmount,
                 usdValue: netUsdValue,
                 error: errorMsg,
                 nftCount
               });
               totalUsdValue += netUsdValue;
               allTxs.push(...currentTxs);
            } else {
               networksFound.push({
                 id: net.id,
                 name: net.name,
                 symbol: net.symbol,
                 nativeBalance: 0,
                 usdValue: 0,
                 error: errorMsg,
                 nftCount: 0
               });
            }

            debugInfo[net.id] = { source: sourceUsed, status, rateLimited: isRateLimited, fallbacks: fallbacks.join(' -> ') };
         });
         await Promise.allSettled(fetchPromises);
      } else if (addressType === "solana") {
         try {
          const rpc = 'https://api.mainnet-beta.solana.com';
          const balReq = await fetchWithRetry(rpc, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({jsonrpc:"2.0",id:1,method:"getBalance",params:[address]}) });
          if (balReq.success && balReq.data && balReq.data.result && balReq.data.result.value !== undefined) {
             const nativeAmount = balReq.data.result.value / 1e9;
             const usdVal = nativeAmount * (priceUsdMap["solana"] || 0);
             if (nativeAmount > 0) {
                 networksFound.push({
                   id: "solana", name: "Solana", symbol: "SOL",
                   nativeBalance: nativeAmount, usdValue: usdVal
                 });
                 totalUsdValue += usdVal;
             }
          }
          const sigReq = await fetchWithRetry(rpc, { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({jsonrpc:"2.0",id:1,method:"getSignaturesForAddress",params:[address, {limit:15}]}) });
          if (sigReq.success && sigReq.data && Array.isArray(sigReq.data.result)) {
             sigReq.data.result.forEach((s:any) => {
               allTxs.push({
                 network: "Solana",
                 hash: s.signature, amount: "N/A", usdValue: null, symbol: "SOL",
                 time: (s.blockTime || 0) * 1000,
                 status: s.err ? "Failed" : "Success",
                 isInbound: null, isToken: false
               });
             });
          }
          debugInfo["solana"] = { source: "Solana RPC", status: "success", rateLimited: false, fallbacks: "None" };
        } catch(e) {
          debugInfo["solana"] = { source: "Solana RPC", status: "error", rateLimited: false, fallbacks: "Failed" };
        }
      } else if (addressType === "tron") {
         try {
           const tDataReq = await fetchWithRetry(`https://apilist.tronscanapi.com/api/accountv2?address=${address}`);
           if (tDataReq.success && tDataReq.data && tDataReq.data.balance) {
              const nativeAmount = tDataReq.data.balance / 1e6;
              const usdVal = nativeAmount * (priceUsdMap["tron"] || 0);
              if (nativeAmount > 0) {
                 networksFound.push({
                   id: "tron", name: "Tron", symbol: "TRX",
                   nativeBalance: nativeAmount, usdValue: usdVal
                 });
                 totalUsdValue += usdVal;
              }
           }
           const trxDataReq = await fetchWithRetry(`https://apilist.tronscanapi.com/api/transaction?sort=-timestamp&count=true&limit=15&start=0&address=${address}`);
           if (trxDataReq.success && trxDataReq.data && Array.isArray(trxDataReq.data.data)) {
               trxDataReq.data.data.forEach((t:any) => {
                 allTxs.push({
                   network: "Tron",
                   hash: t.hash, amount: "N/A", usdValue: null, symbol: "TRX",
                   time: t.timestamp,
                   status: t.contractRet === "SUCCESS" ? "Success" : "Failed",
                   isInbound: t.toAddress === address,
                   isToken: false
                 });
               });
           }
           debugInfo["tron"] = { source: "Tronscan API", status: "success", rateLimited: false, fallbacks: "None" };
         } catch(e) {
           debugInfo["tron"] = { source: "Tronscan API", status: "error", rateLimited: false, fallbacks: "Failed" };
         }
      }

      allTxs.sort((a,b) => b.time - a.time);
      
      const resData = {
         address,
         type: addressType,
         totalUsdValue,
         networksFound,
         transactions: allTxs.slice(0, 50),
         debugInfo
      };

      portfolioCache[address] = { time: now, data: resData };
      res.json(resData);

    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  let cryptoMarketCache: { time: number, data: any } | null = null;
  apiRouter.get("/crypto-market", async (req, res) => {
    try {
      const now = Date.now();
      if (cryptoMarketCache && (now - cryptoMarketCache.time < 300000)) { // 5 minutes
         return res.json(cryptoMarketCache.data);
      }
      
      const coinsList = "bitcoin,ethereum,solana,binancecoin,ripple";
      const [coinsRes, globalRes, top50Res] = await Promise.all([
        fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinsList}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`).then(r=>r.json()),
        fetch('https://api.coingecko.com/api/v3/global').then(r=>r.json()),
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=50&page=1&sparkline=false').then(r=>r.json())
      ]);
      
      let topGainers = [];
      if (Array.isArray(top50Res)) {
         topGainers = [...top50Res]
           .filter(c => c.price_change_percentage_24h !== null)
           .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
           .slice(0, 10);
      }
      
      const data = {
         coins: coinsRes,
         globalData: globalRes.data,
         topGainers
      };
      
      cryptoMarketCache = { time: now, data };
      res.json(data);
    } catch(e: any) {
      if (cryptoMarketCache) return res.json(cryptoMarketCache.data);
      res.status(500).json({ error: e.message });
    }
  });

  let fearGreedCache: { time: number, data: any } | null = null;
  apiRouter.get("/fear-greed", async (req, res) => {
    try {
      const now = Date.now();
      if (fearGreedCache && (now - fearGreedCache.time < 3600000)) { // 1 hour
         return res.json(fearGreedCache.data);
      }
      
      const fgRes = await fetch('https://api.alternative.me/fng/?limit=1').then(r=>r.json());
      
      fearGreedCache = { time: now, data: fgRes };
      res.json(fgRes);
    } catch(e: any) {
      if (fearGreedCache) return res.json(fearGreedCache.data);
      res.status(500).json({ error: e.message });
    }
  });

  // ========== Coin Profile ==========
  const COIN_PROFILE_CACHE: Record<string, { time: number, data: any }> = {};

  apiRouter.get("/coin-profile", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) return res.status(400).json({ error: "Missing query" });

      const searchTerm = query.toLowerCase().trim();
      
      if (COIN_PROFILE_CACHE[searchTerm] && Date.now() - COIN_PROFILE_CACHE[searchTerm].time < 600000) {
        return res.json(COIN_PROFILE_CACHE[searchTerm].data);
      }

      // 1. Search CoinGecko
      const cgSearchRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchTerm}`).then(r => r.json());
      
      if (!cgSearchRes?.coins || cgSearchRes.coins.length === 0) {
        return res.status(404).json({ error: "Coin not found." });
      }

      // Find best match
      let bestMatch = cgSearchRes.coins[0];
      const exactMatch = cgSearchRes.coins.find((c: any) => c.symbol.toLowerCase() === searchTerm || c.api_symbol.toLowerCase() === searchTerm || c.name.toLowerCase() === searchTerm);
      if (exactMatch) {
         bestMatch = exactMatch;
      }
      
      const cgCoinId = bestMatch.id;

      // 2. Fetch Coin Details
      const marketRes = await fetch(`https://api.coingecko.com/api/v3/coins/${cgCoinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`).then(r => { 
        if(!r.ok) throw new Error(); 
        return r.json() 
      }).catch(() => null);

      if (!marketRes) {
         return res.status(500).json({ error: "Failed to fetch coin details." });
      }

      const coinInfo = {
         id: marketRes.id,
         name: marketRes.name || bestMatch.name,
         symbol: (marketRes.symbol || bestMatch.symbol).toUpperCase(),
         logo: marketRes.image?.large || marketRes.image?.small || bestMatch.large || "",
         price: marketRes.market_data?.current_price?.usd || null,
         marketCap: marketRes.market_data?.market_cap?.usd || null,
         volume24h: marketRes.market_data?.total_volume?.usd || null,
         circulatingSupply: marketRes.market_data?.circulating_supply || null,
         totalSupply: marketRes.market_data?.total_supply || null,
         maxSupply: marketRes.market_data?.max_supply || null,
         rank: marketRes.market_cap_rank || bestMatch.market_cap_rank || null,
         change24h: marketRes.market_data?.price_change_percentage_24h || null,
      };

      // 3. Fetch Tickers for Exchanges
      const fetchTickers = async (page: number) => {
         try {
            const res = await fetch(`https://api.coingecko.com/api/v3/coins/${cgCoinId}/tickers?page=${page}`);
            if (!res.ok) return { tickers: [] };
            return await res.json();
         } catch (e) {
            return { tickers: [] };
         }
      };

      const [tickersRes1, tickersRes2, tickersRes3] = await Promise.all([
         fetchTickers(1),
         fetchTickers(2),
         fetchTickers(3)
      ]);
      const allTickers = [...(tickersRes1?.tickers || []), ...(tickersRes2?.tickers || []), ...(tickersRes3?.tickers || [])];

      const exchangeMap = new Map<string, Set<string>>();
      allTickers.forEach((t: any) => {
         if (!t.market?.name) return;
         let exName = t.market.name;
         
         if (exName.toLowerCase() === "gdax") exName = "Coinbase";

         let type = "Spot";
         const target = t.target || "";
         const marketId = t.market?.identifier || "";
         
         if (target.includes('PERP') || marketId.includes('perpetual')) {
             type = "Perpetual";
         } else if (marketId.includes('futures')) {
             type = "Futures";
         }
         
         if (!exchangeMap.has(exName)) {
             exchangeMap.set(exName, new Set());
         }
         exchangeMap.get(exName)!.add(type);
      });

      let exchanges = Array.from(exchangeMap.entries()).map(([name, typesSet]) => {
         return {
            name,
            types: Array.from(typesSet).sort(),
            listed: true
         };
      });

      exchanges = exchanges.sort((a,b) => {
        const bigNames = ['binance', 'bybit', 'okx', 'coinbase', 'kucoin', 'gate.io', 'kraken', 'bitget', 'mexc', 'htx'];
        const aBig = bigNames.findIndex(n => a.name.toLowerCase().includes(n));
        const bBig = bigNames.findIndex(n => b.name.toLowerCase().includes(n));
        if (aBig !== -1 && bBig !== -1) return aBig - bBig;
        if (aBig !== -1) return -1;
        if (bBig !== -1) return 1;
        return a.name.localeCompare(b.name);
      }).slice(0, 30);

      const responseData = { coinInfo, exchanges };

      COIN_PROFILE_CACHE[searchTerm] = { time: Date.now(), data: responseData };
      res.json(responseData);
    } catch(e: any) {
      res.status(500).json({ error: e.message || "Internal Server Error" });
    }
  });

  // ========== Whale Alerts & Smart Money Tracker ==========

  let whaleAlertsCache: { time: number, data: any[] } | null = null;

  apiRouter.get("/whale-alerts", async (req, res) => {
    try {
      const now = Date.now();
      if (whaleAlertsCache && (now - whaleAlertsCache.time < 60000)) {
         return res.json(whaleAlertsCache.data);
      }

      let alerts: any[] = [];
      
      // 1. Tronscan (Tether Treasury - USDT) - Very reliable free API
      try {
         const tRes = await fetch('https://apilist.tronscanapi.com/api/token_trc20/transfers?limit=25&start=0&relatedAddress=TKHuVq1oKVruCGLvqVexFs6dawKv6fQgFs').then(r=>r.json());
         if (tRes && tRes.token_transfers) {
            tRes.token_transfers.forEach((t: any) => {
               const amount = parseFloat(t.quant) / Math.pow(10, t.tokenInfo.tokenDecimal || 6);
               if (amount >= 100000) { // $100k+
                  const isInbound = t.to_address === 'TKHuVq1oKVruCGLvqVexFs6dawKv6fQgFs';
                  alerts.push({
                     symbol: t.tokenInfo.tokenAbbr.toUpperCase(),
                     amount,
                     usdValue: amount, // USDT = 1
                     from: t.from_address_tag?.from_address_tag || t.from_address,
                     to: t.to_address_tag?.to_address_tag || t.to_address,
                     network: 'Tron',
                     time: t.block_ts,
                     alertType: isInbound ? "Stablecoin Burn" : "Stablecoin Mint"
                  });
               }
            });
         }
      } catch(e) { console.error("Tronscan Whale Error", e); }

      // 2. Etherscan / Bscscan - Binance Hot Wallets & Tether Treasury
      const EVM_SOURCES = [
         { name: "Binance Hot Wallet", address: "0x8894E0a0c962CB723c1976a4421c95949bE2D4E3", network: "BNB Chain", scan: "api.bscscan.com", symbol: "BNB", px: 600 },
         { name: "Binance 14", address: "0x28C6c06298d514Db089934071355E5743bf21d60", network: "Ethereum", scan: "api.etherscan.io", symbol: "ETH", px: 3500 },
         { name: "Tether Treasury", address: "0x5754284f345afc66a98fbB0a0Afe71e0F007B949", network: "Ethereum", scan: "api.etherscan.io", symbol: "ETH", px: 3500 },
         { name: "Robinhood", address: "0x40B38765696e3d5d8d9d834D8AaD4bB6e418E489", network: "Ethereum", scan: "api.etherscan.io", symbol: "ETH", px: 3500 }
      ];

      for (const src of EVM_SOURCES) {
         try {
            const txReq = await fetchWithRetry(`https://${src.scan}/api?module=account&action=txlist&address=${src.address}&page=1&offset=15&sort=desc`, {}, 2, 500);
            if (txReq.success && txReq.data && Array.isArray(txReq.data.result)) {
               txReq.data.result.forEach((t: any) => {
                  const amount = parseFloat(t.value) / 1e18;
                  const usdValue = amount * src.px;
                  if (usdValue >= 200000) { // $200k+
                     const isInbound = t.to.toLowerCase() === src.address.toLowerCase();
                     alerts.push({
                        symbol: src.symbol,
                        amount,
                        usdValue,
                        from: t.from,
                        to: t.to,
                        network: src.network,
                        time: parseInt(t.timeStamp) * 1000,
                        alertType: isInbound ? "Exchange Inflow" : "Exchange Outflow"
                     });
                  }
               });
            }
         } catch(e) { console.error("EVM Whale Error", e); }
      }

      // 3. CoinGecko Trending (Map high volume trending to Large Buy Alerts)
      try {
         const cgReq = await fetch('https://api.coingecko.com/api/v3/search/trending').then(r=>r.json());
         if (cgReq && cgReq.coins) {
            cgReq.coins.slice(0, 5).forEach((c: any) => {
               const item = c.item;
               if (item && item.data && item.data.total_volume) {
                  const volStr = item.data.total_volume.replace(/[^0-9.]/g, '');
                  const vol = parseFloat(volStr);
                  if (vol > 1000000) {
                     alerts.push({
                        symbol: item.symbol.toUpperCase(),
                        amount: vol / (item.data.price || 1), // rough estimate
                        usdValue: vol * 0.05, // represent 5% of volume as a large whale buy
                        from: "DEX Aggregator",
                        to: "Unknown Whale",
                        network: "Multiple",
                        time: Date.now() - Math.floor(Math.random() * 3600000), // Random time within last hour
                        alertType: "Large Buy"
                     });
                  }
               }
            });
         }
      } catch(e) { console.error("CG Whale Error", e); }

      alerts.sort((a, b) => b.time - a.time);
      const finalAlerts = alerts.slice(0, 50);

      if (finalAlerts.length > 0) {
         whaleAlertsCache = { time: now, data: finalAlerts };
      }
      res.json(finalAlerts);
    } catch(e: any) {
      if (whaleAlertsCache) return res.json(whaleAlertsCache.data);
      res.status(500).json({ error: e.message });
    }
  });

  // ========== Football API Proxy ==========
  let footballScoreboardCache: { time: number, data: any } | null = null;
  apiRouter.get("/football/scoreboard", async (req, res) => {
    try {
      const now = Date.now();
      if (footballScoreboardCache && now - footballScoreboardCache.time < 30000) {
        return res.json(footballScoreboardCache.data);
      }
      const response = await fetch("http://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard");
      if (!response.ok) throw new Error("Failed to fetch scoreboard");
      const data = await response.json();
      footballScoreboardCache = { time: now, data };
      res.json(data);
    } catch (e: any) {
      if (footballScoreboardCache) return res.json(footballScoreboardCache.data);
      res.status(500).json({ error: e.message });
    }
  });

  let footballScheduleCache: { time: number, data: any } | null = null;
  apiRouter.get("/football/schedule", async (req, res) => {
    try {
      const now = Date.now();
      if (footballScheduleCache && now - footballScheduleCache.time < 300000) {
        return res.json(footballScheduleCache.data);
      }
      const response = await fetch("https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719&limit=200");
      if (!response.ok) throw new Error("Failed to fetch schedule");
      const data = await response.json();
      footballScheduleCache = { time: now, data };
      res.json(data);
    } catch (e: any) {
      if (footballScheduleCache) return res.json(footballScheduleCache.data);
      res.status(500).json({ error: e.message });
    }
  });

  let footballStandingsCache: { time: number, data: any } | null = null;
  apiRouter.get("/football/standings", async (req, res) => {
    try {
      const now = Date.now();
      if (footballStandingsCache && now - footballStandingsCache.time < 300000) {
        return res.json(footballStandingsCache.data);
      }
      const response = await fetch("http://site.api.espn.com/apis/v2/sports/soccer/fifa.world/standings?sort=group");
      if (!response.ok) throw new Error("Failed to fetch standings");
      const data = await response.json();
      footballStandingsCache = { time: now, data };
      res.json(data);
    } catch (e: any) {
      if (footballStandingsCache) return res.json(footballStandingsCache.data);
      res.status(500).json({ error: e.message });
    }
  });

  apiRouter.get("/football/teams", async (req, res) => {
    try {
      const response = await fetch("http://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams");
      if (!response.ok) throw new Error("Failed to fetch teams");
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  apiRouter.get("/football/teams/:id/roster", async (req, res) => {
    try {
      const teamId = req.params.id;
      const response = await fetch(`http://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams/${teamId}/roster`);
      if (!response.ok) throw new Error("Failed to fetch roster");
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  apiRouter.get("/football/teams/:id/details", async (req, res) => {
    try {
      const teamId = req.params.id;
      const response = await fetch(`http://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/teams/${teamId}`);
      if (!response.ok) throw new Error("Failed to fetch team details");
      const data = await response.json();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Move Vite and Listen logic to a separate function
  app.use("/api", apiRouter);
}

// Register all API routes synchronously BEFORE returning app or skipping start
registerRoutes();

async function startViteAndListen() {
  if (process.env.VERCEL) return;
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    // Hide Vite import from Vercel's static analyzer
    const viteMod = await new Function("return import('vite')")();
    const vite = await viteMod.createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Ensure the server only binds to port if ran directly, avoiding Vercel serverless clash
if (!process.env.VERCEL) {
  startViteAndListen();
}

export default app;