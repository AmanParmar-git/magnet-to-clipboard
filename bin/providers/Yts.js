const axios = require("axios");
const Movie = require("../tools/MovieModel.js");
const inq = require("../tools/inq");
const clipbordy = require("clipboardy");
const chalk = require("chalk");

async function ytsquery(query = "", limit = 10, page = 1) {
  const res = await axios.get(
    `https://yts.mx/api/v2/list_movies.json?query_term=${query}&limit=${limit}&page=${page}`
  );

  const movies = res.data.data.movies;
  const result = [];
  if (!movies) return [];
  for (let i = 0; i < movies.length; i++) {
    let { title_long, torrents } = movies[i];
    result.push(new Movie(title_long, torrents));
  }
  return result;
}

function trackify(hash) {
  return `magnet:?xt=urn:btih:${hash}&dn=Url+Encoded+Movie+Name&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://p4p.arenabg.com:1337&tr=udp://tracker.leechers-paradise.org:6969`;
}

function mapTorrent(Torrents) {
  const result = [];
  for (let i = 0; i < Torrents.length; i++) {
    let { quality, size, seeds, type, url, hash } = Torrents[i];
    result.push([
      `quality : ${quality}  ,  Size: ${size}  ,  Seeds: ${seeds}  ,  type : ${type} `,
      url,
      hash,
    ]);
  }
  return result;
}

async function Yts(query) {
  const movies = await ytsquery(query);

  if (movies.length === 0) {
    console.log(
      chalk.yellowBright("Cannot find anything with your query : " + query)
    );
    process.exit(0);
  }
  const names = movies.map((m) => m.Name);
  const { movie } = await inq("Select Movie...", "rawlist", "movie", names);
  const torrents = mapTorrent(movies[names.indexOf(movie)].Torrents);
  const torNames = torrents.map((t) => t[0]);
  const { torName } = await inq(
    "select quality...",
    "rawlist",
    "torName",
    torNames
  );

  const { type } = await inq("choose method to copy link...", "list", "type", [
    "URL",
    "Magnet",
  ]);

  const result =
    type === "URL"
      ? torrents[torNames.indexOf(torName)][1]
      : trackify(torrents[torNames.indexOf(torName)][2]);

  clipbordy.writeSync(result);
  console.log(
    chalk.italic.redBright(type + " Copied To Clipboard!!! Have fun.")
  );
}

module.exports = Yts;
