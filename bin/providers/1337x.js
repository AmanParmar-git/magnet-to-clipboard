const axios = require("axios");
const cheerio = require("cheerio");
const sleep = require("../tools/sleep");
const Movie = require("../tools/MovieModel");
const chalk = require("chalk");

async function x1337xQuery(query) {
  let res = "";
  async function get() {
    try {
      res = await axios.get(
        `https://1337x.to/sort-search/${query}/seeders/desc/1/`
      );
    } catch (e) {
      await sleep(2000);
      await get();
    }
  }
  await get();
  return res.data;
}

async function cheerioTable(table) {
  const res = [];
  for (let i = 0; i < table.length; i++) {
    let curr = table.get(`${i}`);
    let name = curr.children[1].children[1].children[0].data;
    let torrent = curr.children[1].children[1].attribs.href;
    let seeds = curr.children[3].children[0].data;
    let size = curr.children[9].children[0].data;
    res.push(new Movie(name, torrent, seeds, size));
  }
  return res;
}

function somethingWentWrong(data, query) {
  if (!data) {
    console.log(
      chalk.yellowBright(
        "Cannot find anything with your query : " +
          query +
          " or something gone wrong , try again after sometime"
      )
    );
    process.exit(0);
  }
}

async function x1337xGetMagnet(link) {
  link = "https://1337x.to" + link;
  let magnet = "";
  async function get() {
    try {
      let { data } = await axios.get(link);
      somethingWentWrong(data);
      const $ = cheerio.load(data);
      const element = $(
        "body > main > div > div > div > div.l73f5d40c85fc09cf4e9fdbc7f9a7c114d2e28c4b.no-top-radius > div.lbdda4d6f00f746d2315acbfa4ac42ce39ede8cca.clearfix > ul.ld7fc9b1e24ffedf2bbab85e0abdd99ea608c48fd.lf5c427cb5e015b08057beb3068ebf9cca0dacb08 > li:nth-child(1) > a"
      ).get(`${0}`).attribs.href;
      magnet = element;
    } catch (e) {
      console.log(
        chalk.greenBright(
          "server not responding , please wait i'm retrying, you can wait or try again later!!"
        )
      );
      await sleep(5000);
      await get();
    }
  }
  await get();
  return magnet;
}

async function x1337x(query, limit) {
  const data = await x1337xQuery(query);
  somethingWentWrong(data, query);
  const $ = cheerio.load(data);
  const table = $(
    "body > main > div > div > div > div.box-info-detail.inner-table > div.table-list-wrap > table > tbody"
  ).children();
  somethingWentWrong(table.length, query);
  const movies = cheerioTable(table);
  return movies;
}

module.exports = { x1337x, x1337xGetMagnet };
