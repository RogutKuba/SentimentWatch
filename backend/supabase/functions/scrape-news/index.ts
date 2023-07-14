// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import newsResponse from './test.ts'

import OpenAi from './openai.ts'

// Constants
const FINNHUB_API_KEY = 'ci388spr01qmam6c3rbgci388spr01qmam6c3rc0';
const FINNHUB_API_URL = 'https://finnhub.io/api/v1/news?category=general&token=';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';
const openai = new OpenAi(OPENAI_API_KEY);

const FILTER_PROMPT = `Imagine you are a Wall Street analyst looking to do sentiment analysis on financial news headlines. You are given a list of news headlines and the corresponding URLs. Filter out any headlines that are not about stocks, and return it in the same JSON format. Do not write anything but the JSON output.`;

console.log("Function scrape-news started!")

serve(async (req) => {
  // init supabase client
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  // fetch news articles from finnhubb
  const rawResponse = await fetch(FINNHUB_API_URL + FINNHUB_API_KEY);
  const response = await rawResponse.json();

  const restrictedPublishers = new Set("MarketWatch", "Bloomberg")

  const articleHeadlines = response
    .filter((item: any) => !restrictedPublishers.has(item.source)
    .map((item: any) => {
    return { url: item.url, headline: item.headline, datetime: item.datetime }; 
    });

  // split article headlines into chunks where total token count is less than 850
  // 850 tokens is ~4000 characters
  const chunkedArticleHeadlines = [];
  let chunk = [];
  let chunkTokenCount = 0;
  articleHeadlines.forEach((item: any) => {
    const headlineTokenCount = Math.floor(item.url.length / 2) + Math.floor(item.headline.length / 4) + Math.floor(item.datetime.toString().length / 3);
    if (chunkTokenCount + headlineTokenCount < 850) {
      chunk.push(item);
      chunkTokenCount += headlineTokenCount;
    } else {
      chunkedArticleHeadlines.push(chunk);
      chunk = [item];
      chunkTokenCount = headlineTokenCount;
    }
  });
  chunkedArticleHeadlines.push(chunk);

  // // log out token count of each chunk
  // chunkedArticleHeadlines.forEach((chunk: any, index) => {
  //   let totalTokenCount = 0;
  //   chunk.forEach((item: any) => {
  //     totalTokenCount += Math.floor(item.url.length / 2) + Math.floor(item.headline.length / 4);
  //   });
  //   console.log('chunk', index, totalTokenCount);
  // });

  // for each chunk, filter out the headlines that are not about stocks
  const filteredChunkedArticleHeadlines = await Promise.all(chunkedArticleHeadlines.map(async (chunk: any, index) => {
    const completion = await openai.request(`
      ${FILTER_PROMPT}\n
      List of news article headlines:\n
      ${JSON.stringify(chunk)}\n
      JSON Output:\n
    `);
    // console.log('chunk res', index, completion)
    // console.log(`
    //   ${FILTER_PROMPT}\n
    //   List of news article headlines:\n
    //   ${JSON.stringify(chunk)}\n
    //   JSON Output:\n
    // `)
    // return completion
    const filteredHeadlines = completion.choices[0].text;
    return JSON.parse(filteredHeadlines);
  }));

  // merge all sub arrays into one array
  const filteredArticleHeadlines = filteredChunkedArticleHeadlines.flat();

  // insert filtered headlines into supabase
  const { data, error } = await supabaseClient
    .from('raw_news')
    .upsert(articleHeadlines);

  // scrape text from news article
  // const extractedArticleTexts = [];

  // const browser = await puppeteer.connect({
  //   browserWSEndpoint: `wss://chrome.browserless.io?token=${BROWSERLESS_API_KEY}`,
  // })
  // const page = await browser.newPage();

  // await urls.reduce(async (previousPromise, url) => {
  //   await previousPromise;
  //   console.log('fetching', url.substring(0, 15))
  //   await page.goto(url);
  //   const extractedText = await page.$eval('*', (el) => el.innerText);
  //   extractedArticleTexts.push(extractedText);
  //   console.log(url.substring(0, 15), extractedText.substring(0, 15))

  //   return Promise.resolve();
  // }, Promise.resolve());

  // await browser.close();

  // // generate ai response to prompt and extracted text
  // const completion = await openai.request(`
  //   ${ANALYSIS_PROMPT}\n
  //   News Article:\n
  //   ${extractedText}\n
  //   JSON Output:\n
  // `);

  // console.log(completion.choices[0].message.content)
  // const parsed_analyses = JSON.parse(completion.choices[0].message.content);
  // console.log(parsed_analyses)

  // const analyses = parsed_analyses.map((item: any) => {
  //   return {
  //     ticker: item.ticker,
  //     company_name: item.company_name,
  //     pros: item.pros,
  //     cons: item.cons,
  //     score: item.score,
  //     url: url,
  //   }
  // });

  // // insert response into supabase
  // const { data, error } = await supabaseClient
  //   .from('analyzed_news')
  //   .insert(analyses);

  // console.log(data, error)

  return new Response(
    JSON.stringify({ data, error }),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
