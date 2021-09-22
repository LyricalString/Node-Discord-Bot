const add_cero_day = require("../utils/add_cero_day.js");

module.exports = function parserTimeStamp(date) {
  date = new Date(date);
  return (
    add_cero_day(date.getDate()) +
    "-" +
    add_cero_day(date.getMonth() + 1) +
    "-" +
    add_cero_day(date.getFullYear()) +
    "  " +
    add_cero_day(date.getHours()) +
    ":" +
    add_cero_day(date.getMinutes()) +
    ":" +
    add_cero_day(date.getSeconds())
  );
};
