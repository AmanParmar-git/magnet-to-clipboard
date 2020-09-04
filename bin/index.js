#!/usr/bin/env node
const Yts = require("./providers/Yts.js");
const ThePirateBay = require("./providers/ThePirateBay.js");
const inq = require("./tools/inq");
const chalk = require("chalk");
const Eztv = require("./providers/Eztv");
const Rarbg = require("./providers/Rarbg");
const { x1337x, x1337xGetMagnet } = require("./providers/1337x");
const clipboardy = require("clipboardy");

var args = process.argv.slice(2);
if (args.length > 0) {
  var query = args.reduce((i, j) => {
    return i + " " + j;
  });
} else {
  console.log(
    chalk.greenBright("enter something to search dude! eg. 'magnet avengers'")
  );
  process.exit(0);
}

function getPromptData(data) {
  let result = [];
  for (let i = 0; i < data.length; i++) {
    let { Name, Seeds, Size } = data[i];
    result.push(`Name : ${Name} , Seeds : ${Seeds} , Size : ${Size}`);
  }
  return result;
}

inq("Select Provider...", "list", "provider", [
  "Yts",
  "ThePirateBay",
  "Eztv",
  "Rarbg",
  "1337x",
]).then(async ({ provider }) => {
  if (provider === "Yts") {
    Yts(query);
  } else {
    let movies = [];
    switch (provider) {
      case "ThePirateBay": {
        movies = await ThePirateBay(query);
        break;
      }
      case "Eztv": {
        movies = await Eztv(query);
        break;
      }
      case "Rarbg": {
        movies = await Rarbg(query);
        break;
      }
      case "1337x": {
        movies = await x1337x(query);
      }
    }
    const data = getPromptData(movies);

    const { torrent } = await inq(
      "Choose movie...",
      "rawlist",
      "torrent",
      data
    );
    let magnetToCopy = movies[data.indexOf(torrent)].Torrents;
    if (provider === "1337x") {
      magnetToCopy = await x1337xGetMagnet(magnetToCopy);
    }
    clipboardy.writeSync(magnetToCopy);

    console.log(
      chalk.italic.redBright("magnet copied to clipboard , enjoy watching!")
    );
  }
});
