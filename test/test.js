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
// const files = ["struct.thrift"];

files.forEach(async file => {
  test(file, async () => {
    const code = await fs.promises.readFile(
      path.resolve(__dirname, "fixtures", file),
      "utf8"
    );
    const formatted = await fs.promises.readFile(
      path.resolve(__dirname, "formatted", file),
      "utf8"
    );
    // console.log(format(code));

    expect(format(code)).toBe(formatted);
  });
});
