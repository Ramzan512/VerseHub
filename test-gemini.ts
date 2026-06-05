import 'dotenv/config';

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Raw Fetch Test. Key length:", apiKey?.length);
  
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Hello" }] }]
    })
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text.substring(0, 300));
}
run();
