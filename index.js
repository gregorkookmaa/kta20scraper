const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { exit } = require('process');
// axios.get('https://xkcd.com/').then((response)=> {
//     const $ = cheerio.load(response.data);
//     console.log('callback', $('#comic img').attr('src'));
// }).catch((error) => {

// });
async function download(url, filename){
    const writer = fs.createWriteStream(path.resolve(__dirname, filename));
    const response = await axios.get(url, {responseType: 'stream'});
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

async function getOrCache(url){

    let md5 = crypto.createHash('md5');
    md5.update(url);
    let cacheName = `cache/${md5.digest('hex')}`;

    try {
        if (fs.existsSync(cacheName)) {
            console.log('cached request');
          return JSON.parse(fs.readFileSync(cacheName, {encoding:'utf8', flag:'r'}));
        } else {
            let response = await axios.get(url, { 
                headers: {
                    'accept': 'application/json'
                }
            });
            fs.writeFileSync(cacheName, JSON.stringify(response.data));
            console.log('live request');
            return response.data;
        }
      } catch(err) {
        console.error(err)
      }
}

(async ()=> {

    let prev = 'https://www.prismamarket.ee/products/16929/page/1?main_view=1';
    for(let i = 0; i<1; i++){
        try {
            let data = await getOrCache(prev);
            console.log(data);
            // const $ = cheerio.load(data);
            // let src = baseURL + $('.box-content img').attr('src');
            // if(!$('.prev').length){
            //     return;
            // }
            // prev = baseURL + $('.prev').attr('href');
            // console.log(src);
            // let parts = src.split('/');
            //await download(src, 'images/'+parts[parts.length-1]);
        } catch (err) {
            console.log(err);
        }
    }
})();