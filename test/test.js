const fs = require("fs");
const path = require("path");
const prettier = require("prettier");

function format(code) {
  return prettier.format(code, {
    parser: "thrift-parser",
    plugins: [path.resolve(__dirname, "../lib")]
  });
}

const files = fs.readdirSync(path.resolve(__dirname, "fixtures"));

files.forEach(file => {
  test(file, async () => {
    const code = await fs.promises.readFile(
      path.resolve(__dirname, "fixtures", file),
      "utf8"
    );
    expect(format(code)).toBe(1);
  });
});
