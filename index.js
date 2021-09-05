const fs = require('fs');
const downloader = require('image-downloader');
const config  = require('./config.json');
const puppeteer =require('puppeteer');
const cookies = require('./cookies.json');


const dirSave = `${config.dirSave}`;
const urlFacebook = 'https://www.facebook.com/login.php'
const urlDownload = `${config.uriDownload}`;


function createResultFolder() {
    if(fs.existsSync(dirSave) == false) {
        fs.mkdirSync(dirSave);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

async function main () {
        
    
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:/Users/Drom/Downloads/chrome-win/chrome-win/chrome.exe'});
    

    //login facebook with username, password
    const loginFB = await browser.newPage();
    

    if(Object.keys(cookies).length){
        await loginFB.setCookie(...cookies);
        await loginFB.goto("https://www.facebook.com/", {waitUntil:'networkidle2'});

    }
    else {
        await loginFB.goto(urlFacebook, {waitUntil:'networkidle0'})
        await loginFB.type('#email',config.username, {delay:'10'})
        await loginFB.type('#pass',config.password, {delay:'10'})

        await loginFB.click("#loginbutton");
        await loginFB.waitForNavigation({waitUntil: 'networkidle0'})
    }

    // login instagram by login facebook
    const loginInstagram = await browser.newPage();
    await loginInstagram.goto("https://www.instagram.com/", {waitUntil:'networkidle0'})
    await loginInstagram.click('button[type="button"]')



    await loginInstagram.waitForNavigation({waitUntil: 'networkidle0'})
    // goto the page downloader
    const page = await browser.newPage();
    await page.goto(urlDownload, {waitUntil:'networkidle0'});

    // scroll to bottom of page 
    let intervalScroll = 10 // number scroll interval
    while(intervalScroll > 0){
        await page.evaluate(() =>{
            window.scrollTo(0,document.body.scrollHeight);
        },500)
    
        await sleep(3000) // time delay scroll
        intervalScroll = intervalScroll - 1;
    }

    createResultFolder();
    // get images 
    const imageSrcSets= await page.evaluate(() =>{
        const imgs = Array.from(document.querySelectorAll('article img'));
        const srcSetAttribute = imgs.map(i => i.getAttribute('srcset'));
        console.log(srcSetAttribute)
        return srcSetAttribute;
    })

    await browser.close();

    let counterImageDownloads = 0;
    for(let i = 0; i< imageSrcSets.length; i++){
        const sr = imageSrcSets[i];
        const s = sr.split(',');
        const rs = s[s.length - 1].split(' ')[0];
        options = {
            url: rs,
            dest: dirSave
          }
        // console.log(rs);
        downloader.image(options).
        then(({ filename }) => {
            counterImageDownloads += 1
            console.log(`Saved to ${filename}  ---  ${counterImageDownloads}`)  // saved to /path/to/dest/photo
        }).catch((err) => console.error(err))
    }
    // console.log(`${counterImageDownloads} PHOTOS HAVE BEEN DOWNLOADED`)
}


main();