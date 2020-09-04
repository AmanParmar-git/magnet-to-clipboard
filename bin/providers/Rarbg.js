const axios = require("axios");
const Movie = require("../tools/MovieModel");

// async function RarbgToken() {
//   const { data } = await axios.get(
//     "https://torrentapi.org/pubapi_v2.php?get_token=get_token&app_id=magnet-to-torrent"
//   );
//   console.log(data.token);
// }

function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

async function Rarbgquery(query, limit) {
  if (!limit) {
    limit = 20;
  }
  const { data } = await axios.get(
    `https://torrentapi.org/pubapi_v2.php?app_id=magnettoclipboard&mode=search&search_string=${query}&category=1;4;14;15;16;17;21;22;42;18;19;41;27;28;29;30;31;32;40;23;24;25;26;33;34;43;44;45;46;47;48;49;50;51;52&format=json_extended&sort=seeders&limit=${limit}&token=i6mwzfur7j`
  );
  return data;
}

function tableRar(table) {
  const result = [];

  for (let i = 0; i < table.length; i++) {
    let { title, download, seeders, size } = table[i];
    size = bytesToSize(size);
    result.push(new Movie(title, download, seeders, size));
  }
  return result;
}

async function Rarbg(query, limit) {
  const { torrent_results: data } = await Rarbgquery(query, limit);
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
  const movies = tableRar(data);
  return movies;
}

module.exports = Rarbg;
