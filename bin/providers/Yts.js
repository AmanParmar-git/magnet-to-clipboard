const axios = require("axios");
const Movie = require("./MovieModel.js");

async function Yts(query = "", limit = 10, page = 1) {
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

module.exports = { Yts, trackify };
