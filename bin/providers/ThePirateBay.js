const p = require("puppeteer");
const cheerio = require("cheerio");
const Movie = require("./MovieModel.js");

module.exports = async function (query) {
  const browser = await p.launch();
  const newPage = await browser.newPage();
  await newPage.goto(
    `https://tpbtpb.tel/search.php?q=${query}&video=on&search=Pirate+Search&page=0&orderby=`
  );
  const html = await newPage.content();
  browser.close();
  const $ = cheerio.load(html);
  const table = $("#torrents").children();
  const result = [];
  for (let i = 1; i < table.length; i++) {
    let entry = table.get(`${i}`);
    let name = entry.children[2].children[0].children[0].data;
    let torrents = entry.children[4].children[0].attribs.href;
    let size = entry.children[5].children[0].data;
    let seeds = entry.children[6].children[0].data;
    result.push(new Movie(name, torrents, seeds, size));
  }
  return result;
};
