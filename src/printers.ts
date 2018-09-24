import prettier, { FastPath, Doc } from "prettier";
import { NamespaceDefinition } from "@creditkarma/thrift-parser";
const { concat, join, hardline } = prettier.doc.builders;

type Print = (path: FastPath) => Doc;

function printDocument(path: FastPath, p: Print) {
  return concat(path.map(p, "body"));
}

function printNamespace(node: NamespaceDefinition) {
  return `namespace ${node.scope.value} ${node.name.value}`;
}

function print(path: FastPath, options: any, p: Print) {
  // console.log(path);
  const value = path.getValue();
  console.log(value);

  switch (value.type) {
    case "ThriftDocument":
      return printDocument(path, p);
    case "NamespaceDefinition":
      return printNamespace(value);
  }
}

function embed() {
  return null;
}

function insertPragma(text: string) {
  console.log(arguments);
}

export const printers = {
  "thrift-ast": {
    print,
    embed,
    insertPragma
  }
};
