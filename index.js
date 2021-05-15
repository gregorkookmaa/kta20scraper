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
    for(let i = 220; i<230; i++){
        let response = await axios.get(`https://extrafabulouscomics.com/comic/${i}/`);
        const $ = cheerio.load(response.data);
        let src = 'https:' + $('#comic img').attr('src');
        console.log(src);
        let parts = src.split('/');
        //await download(src, 'images/'+parts[parts.length-1]);
    }
})();
//`https://extrafabulouscomics.com/comic/${i}/`

// axios.get('https://extrafabulouscomics.com/comic/225/').then((response)=> {
//     const $ = cheerio.load(response.data);
//     console.log ($('#comic img').attr('src'));
// });


// THIS WORKS!
// (async ()=> {
//     for(let i = 220; i<230; i++){
//         let response = await axios.get(`https://extrafabulouscomics.com/comic/${i}/`);
//         const $ = cheerio.load(response.data);
//         console.log($('#comic img').attr('src'));
//     }
// })();