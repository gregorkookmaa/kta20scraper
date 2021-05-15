const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://xkcd.com/').then((response)=> {
    const $ = cheerio.load(response.data);
    console.log ($('#comic img').attr('src'));
});