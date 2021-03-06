const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch").default;

const url =
  "https://api.github.com/repos/apache/thrift/git/trees/592943ed4cd59b6f5a4052c2af87929176cbcb8f";
const prefix = "https://raw.githubusercontent.com/apache/thrift/master/test/";

async function main() {
  const res = await fetch(url, {
    // add token if API rate limit exceeded
    headers: {
      // Authorization: "token "
    }
  });
  const { tree } = await res.json();

  tree
    .map(item => item.path)
    .filter(p => p.endsWith(".thrift"))
    .forEach(async file => {
      const res = await fetch(prefix + file);
      let text = await res.text();
      text = text.replace(/\/\*[\w\W]*?\*\//, "");
      await fs.promises.writeFile(
        path.resolve(__dirname, "../test/fixtures", file),
        text
      );
      console.log("download complete", file);
    });
}

main();
