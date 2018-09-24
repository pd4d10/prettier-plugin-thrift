const fs = require("fs");
const prettier = require("prettier");

const code = fs.readFileSync("./test.thrift", "utf8");

const formatted = prettier.format(code, {
  parser: "thrift-parser",
  plugins: ["./lib"]
});

console.log(formatted);
