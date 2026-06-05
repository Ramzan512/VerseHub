import http from 'http';
import https from 'https';

const checkApi = async (url) => {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      resolve({ status: res.statusCode });
    }).on('error', (e) => {
      resolve({ error: e.message });
    });
  });
};

(async () => {
  console.log('CoinGecko Global:', await checkApi('https://api.coingecko.com/api/v3/global'));
  console.log('Alternative.Me Fear Greed:', await checkApi('https://api.alternative.me/fng/?limit=1'));
  console.log('CoinTelegraph RSS:', await checkApi('https://cointelegraph.com/rss'));
  console.log('ESPN Football:', await checkApi('http://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard'));
})();
