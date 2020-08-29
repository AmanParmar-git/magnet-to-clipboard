const p = require("puppeteer");
const cheerio = require("cheerio");
const Movie = require("../tools/MovieModel.js");
const inq = require("../tools/inq");
const clipborady = require("clipboardy");
const chalk = require("chalk");

async function pirateQuery(query) {
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
}

function mapTorrent(movies) {
  const results = [];
  for (let i = 0; i < movies.length; i++) {
    let { Name, Seeds, Size } = movies[i];
    results.push(`Name : ${Name} , Seeds : ${Seeds} , Size : ${Size}`);
  }
  return results;
}

async function ThePirateBay(query) {
  const movies = await pirateQuery(query);
  const torrents = mapTorrent(movies);

  const { torrent } = await inq(
    "Choose movie...",
    "rawlist",
    "torrent",
    torrents
  );

  clipborady.writeSync(movies[torrents.indexOf(torrent)].Torrents);
  console.log(
    chalk.italic.redBright("Magnet Copied To Clipboard!!! Have fun.")
  );
}

module.exports = ThePirateBay;
