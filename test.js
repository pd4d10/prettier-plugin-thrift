const prettier = require("prettier");

const code = `namespace js test
`;

const formatted = prettier.format(code, {
  parser: "thrift-parser",
  plugins: ["./lib"]
});

console.log(formatted);
