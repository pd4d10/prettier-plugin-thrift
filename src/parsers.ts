import * as thriftParser from "@creditkarma/thrift-parser";

function parse(text: string, parsers, options) {
  return thriftParser.parse(text);
}

// function hasPragma(text) {}

function locStart(node) {
  return node.loc.start.index;
}

function locEnd(node) {
  return node.loc.end.index;
}

// function preprocess(text, options) {}

export const parsers = {
  "thrift-parser": {
    parse,
    astFormat: "thrift-ast",
    // hasPragma,
    locStart,
    locEnd
    // preprocess
  }
};
