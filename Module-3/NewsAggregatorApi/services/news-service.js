const axios = require('axios');

// Fetch news articles from external API
async function fetchNewsArticlesByCategory(categories) {
    try {
        let articles = [];
        if(categories.length >0) { 
            const requests = categories.map(category => {
                const req = axios.get(`${process.env.baseURL}/v2/top-headlines`, {
                    params: { 
                        apiKey: process.env.API_KEY,
                        category: category
                    }});
                return req;
            });
            const responses = await Promise.all(requests);
            articles = responses.map(res => res.data.articles).flat();
            return articles;
        }
    } catch (err) {
        console.log('[Error] news-service->fetchNewsArticlesByCategory, Something went wrong while fetching news. Error: ', err);
        throw err;
    }
}

module.exports = { fetchNewsArticlesByCategory };