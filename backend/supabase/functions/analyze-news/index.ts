// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

import OpenAi from './openai.ts'

// Constants
const BROWSERLESS_API_KEY = '525d520c-d678-4f75-a35b-28e13354d702';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';
const openai = new OpenAi(OPENAI_API_KEY);

const errorResponse = (error: any) => {
  return new Response(JSON.stringify({ error }), {
    headers: { 'Content-Type': 'application/json' },
    status: 500,
  });
};

console.log("Analyze news function started!")

serve(async (req) => {
  // init supabase client
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
  
  // fetch raw news article that are marked as not analyzed
  const { data: rawNewsArticles, error: rawNewsArticlesError } = await supabaseClient
    .from('raw_news')
    .select('*')
    .eq('analyzed', false)
    .order('datetime', { ascending: true })
    .limit(5);

  // if error, throw and log error in supabase
  if (rawNewsArticlesError) {
    console.error('rawNewsArticlesError', rawNewsArticlesError);
    return errorResponse(rawNewsArticlesError);
  }

  // scrape news article
  const extractedArticles = [];

  const browser = await puppeteer.connect({
    browserWSEndpoint: `wss://chrome.browserless.io?token=${BROWSERLESS_API_KEY}`,
  });
  const page = await browser.newPage();
  
  await rawNewsArticles.reduce(async (previousPromise, rawArticle) => {
    await previousPromise;

    const url = rawArticle.url;
    await page.goto(url);
    const extractedText = await page.$eval('*', (el) => el.innerText);
    extractedArticles.push({ ...rawArticle, extractedText });

    console.log("Extracted text from", url)

    return Promise.resolve();
  }, Promise.resolve());

  await browser.close();


  // analyze news articles
  const analyzedArticles = [];

  await Promise.all(extractedArticles.map(async (extractedArticle) => {
    // generate ai response to prompt and extracted text
    const completion = await openai.request(`
      News Article:
      ${extractedArticle.extractedText}
      JSON Output:
    `);

    console.log(completion.choices[0].message.content)

    // parse ai response
    // remove any non JSON content


    const parsed_analyses = JSON.parse(completion.choices[0].message.content);
    parsed_analyses.forEach((item: any) => {
      if (item.ticker && item.ticker.length > 0) {
        analyzedArticles.push({
          ticker: item.ticker,
          company_name: item.company_name,
          pros: item.pros,
          cons: item.cons,
          score: item.score,
          url: extractedArticle.url,
          headline: extractedArticle.headline,
          datetime: extractedArticle.datetime,
        });
      }
    });

    return Promise.resolve();
  }));

  console.log("inserting", analyzedArticles.length, "analyzed articles", analyzedArticles)

  // insert analyzed news articles into supabase
  const { data: analyzedNews, error: analyzedNewsError } = await supabaseClient
    .from('analyzed_news')
    .insert(analyzedArticles);

  // if error, throw and log error in supabase
  if (analyzedNewsError) {
    console.error('analyzedNewsError', analyzedNewsError);
    return errorResponse(analyzedNewsError);
  }

  // update raw news articles to be marked as analyzed
  const { data: updatedRawNewsArticles, error: updatedRawNewsArticlesError } = await supabaseClient
    .from('raw_news')
    .update({ analyzed: true })
    .in('url', rawNewsArticles.map((rawNewsArticle) => rawNewsArticle.url));

  // if error, throw and log error in supabase
  if (updatedRawNewsArticlesError) {
    console.error('updatedRawNewsArticlesError', updatedRawNewsArticlesError);
    return errorResponse(updatedRawNewsArticlesError);
  }

  return new Response(
    JSON.stringify({ analyzedNews, analyzedNewsError }),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
