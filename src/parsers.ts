import { parse as thriftParse, SyntaxNode } from "@creditkarma/thrift-parser";

function parse(text: string, parsers: any, options: any) {
  return thriftParse(text);
}

// function hasPragma(text) {}

function locStart(node: SyntaxNode) {
  return node.loc.start.index;
}

function locEnd(node: SyntaxNode) {
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
