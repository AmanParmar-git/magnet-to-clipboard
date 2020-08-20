#!/usr/bin/env node
const { Yts, trackify } = require("./providers/Yts.js");
const ThePirateBay = require("./providers/ThePirateBay.js");
const inq = require("inquirer");

const clipbordy = require("clipboardy");
const chalk = require("chalk");

var args = process.argv.slice(2);
if (args.length > 0) {
  var query = args.reduce((i, j) => {
    return i + " " + j;
  });
}

inq
  .prompt([
    {
      type: "list",
      message: "Choose Provider...",
      name: "Provider",
      choices: ["Yts", "ThePirateBay"],
    },
  ])
  .then(async ({ Provider }) => {
    if (Provider === "Yts") {
      const res = await Yts(query);
      if (res.length === 0) {
        console.log(
          chalk.yellowBright("Cannot find anything with your query : " + query)
        );
        process.exit(0);
      }
      const names = res.map((e) => e.Name);
      inq
        .prompt([
          {
            type: "rawlist",
            message: "Choose Movie...",
            name: "index",
            choices: [...names],
          },
        ])
        .then(({ index }) => {
          const { Torrents } = res[names.indexOf(index)];
          const choices = [];
          for (let i = 0; i < Torrents.length; i++) {
            let { quality, size, seeds, type } = Torrents[i];
            choices.push(
              `quality : ${quality}  ,  Size: ${size}  ,  Seeds: ${seeds}  ,  type : ${type}`
            );
          }
          inq
            .prompt([
              {
                type: "rawlist",
                message: "select quality...",
                name: "index",
                choices: choices,
              },
            ])
            .then(({ index }) => {
              let { hash, url } = Torrents[choices.indexOf(index)];

              inq
                .prompt([
                  {
                    type: "list",
                    message: "choose method to copy link...",
                    name: "type",
                    choices: ["Magnet", "URL"],
                  },
                ])
                .then(({ type }) => {
                  if (type === "Magnet") {
                    clipbordy.writeSync(trackify(hash));
                  } else {
                    clipbordy.writeSync(url);
                  }
                  console.log(
                    chalk.italic.redBright(
                      type + " Copied To Clipboard!!! Have fun."
                    )
                  );
                });
            });
        });
    } else if (Provider === "ThePirateBay") {
      const res = await ThePirateBay(query);
      const choices = [];
      for (let i = 0; i < res.length; i++) {
        let { Name, Seeds, Size } = res[i];
        choices.push(`Name : ${Name} , Seeds : ${Seeds} , Size : ${Size}`);
      }
      inq
        .prompt([
          {
            message: "choose movie...",
            type: "rawlist",
            name: "index",
            choices: choices,
          },
        ])
        .then(({ index }) => {
          clipbordy.writeSync(res[choices.indexOf(index)].Torrents);
          console.log(
            chalk.italic.redBright("Magnet Copied To Clipboard!!! Have fun.")
          );
        });
    }
  });
