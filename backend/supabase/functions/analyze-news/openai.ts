export default class OpenAi {
  API_KEY: string;
  URL = 'https://api.openai.com/v1/chat/completions';

  ANALYSIS_PROMPT = "Imagine you are a Wall Street analyst looking to do sentiment analysis on financial news headlines. " +
    "You have to assign a score from 0-100, with 50 being neutral, for how this news will affect the stock. " + 
    "Output your analysis in the format of JSON, with the stock ticker, your score, along with a list of pros and cons from the article. " +
    "The JSON should output an array of JSON objects, with the keys being \"ticker\", \"company_name\", \"pros\", \"cons\", and \"score\". " + 
    "Remember that there can be news of many companies in one article, so make sure to mention any important companies. " +
    "If there are no stocks or companies, just return the empty JSON array []. Do not write anything but the JSON output. " +
    "You will lose points every time you print something else, even if it is just comments. You will also lose points for writing JSON objects without valid ticker symbols. " +
    "Keep in mind that some articles may not be complete as they are hidden behind a paywall. You will lose points for trying to analyze these articles, and you should just instead return the empty JSON array []. ";

  constructor(auth: string) {
    this.API_KEY = auth;
  }

  async request(prompt: string) {
    const rawResponse = await fetch(this.URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [{ "role": "system", "content": this.ANALYSIS_PROMPT }, { "role": "user", "content": prompt }],
      })
    });
    return rawResponse.json();
  };
};