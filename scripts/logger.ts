const chalk = require("chalk");

const Logger = {
  info(message: string) {
    console.log(chalk.blue("[INFO] " + message));
  },
  error(message: string) {
    console.error(chalk.red("[ERROR] " + message));
  },
};

module.exports = Logger;
export default Logger;
