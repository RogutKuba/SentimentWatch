export default class OpenAi {
  API_KEY: string;
  URL = 'https://api.openai.com/v1/completions';

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
        "model": "text-curie-001",
        "prompt": prompt,
        "max_tokens": 128,
        "temperature": 0.75,
      })
    });
    return rawResponse.json();
  };
};