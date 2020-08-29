#!/usr/bin/env node
const Yts = require("./providers/Yts.js");
const ThePirateBay = require("./providers/ThePirateBay.js");
const inq = require("./tools/inq");

var args = process.argv.slice(2);
if (args.length > 0) {
  var query = args.reduce((i, j) => {
    return i + " " + j;
  });
}

inq("Select Provider...", "list", "provider", ["Yts", "ThePirateBay"]).then(
  ({ provider }) => {
    switch (provider) {
      case "Yts": {
        Yts(query);
        break;
      }
      case "ThePirateBay": {
        ThePirateBay(query);
        break;
      }
    }
  }
);
