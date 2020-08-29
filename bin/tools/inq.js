const inq = require("inquirer");

module.exports = function (msg, type, result, choices) {
  return inq.prompt([
    {
      type: type,
      message: msg,
      name: result,
      choices: choices,
      loop: false,
      pageSize: 10,
    },
  ]);
};
