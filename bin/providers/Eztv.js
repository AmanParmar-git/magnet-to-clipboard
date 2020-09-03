const axios = require("axios");
const cheerio = require("cheerio");
const sleep = require("../tools/sleep");
const Movie = require("../tools/MovieModel");
const chalk = require("chalk");

async function eztvquery(query) {
  let res = "";
  async function get() {
    try {
      res = await axios.get(`https://eztv.io/search/${query}`);
    } catch (e) {
      await sleep(1000);
      await get();
    }
  }
  await get();
  return res.data;
}

function tableCheerio(table, limit, query) {
  if (table.length <= 3) {
    console.log(
      chalk.yellowBright("Cannot find anything with your query : " + query)
    );
    process.exit(0);
  }
  if (table.length < limit) {
    limit = table.length;
  }
  const data = [];
  for (let i = 0; i < limit; i++) {
    let j = i + 2;
    let curr = table.get(`${j}`).children;
    let name = curr[3].children[1].attribs.title;
    let torrents = curr[5].children[1].attribs.href;
    let size = curr[7].children[0].data;
    let seeds = "not found";
    try {
      seeds = curr[11].children[0].children[0].data || "not found";
    } catch (e) {}
    data.push(new Movie(name, torrents, seeds, size));
  }
  return data;
}

async function Eztv(query, limit = 40) {
  const data = await eztvquery(query);
  const $ = cheerio.load(data);
  const table = $(
    "table.forum_header_border:nth-child(15) > tbody:nth-child(1)"
  ).children();
  const movies = tableCheerio(table, limit, query);
  return movies;
}

module.exports = Eztv;
