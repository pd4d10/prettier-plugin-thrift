import prettier, { FastPath, Doc } from "prettier";
import {
  NamespaceDefinition,
  ConstDefinition,
  FieldType,
  ConstValue,
  SyntaxType,
  IncludeDefinition,
  StructDefinition,
  FieldDefinition,
  ServiceDefinition,
  FunctionDefinition,
  EnumDefinition,
  EnumMember,
  TypedefDefinition,
  Annotation,
  UnionDefinition,
  CommentBlock,
  CommentLine
} from "@creditkarma/thrift-parser";
const { concat, join, hardline, fill, indent } = prettier.doc.builders;
const space = " ";
const empty = "";

type Print = (path: FastPath) => Doc;

function printDocument(path: FastPath, p: Print) {
  return join(hardline, path.map(p, "body"));
}

function printNamespace(node: NamespaceDefinition, path: FastPath, p: Print) {
  return join(hardline, [
    ...path.map(p, "comments"),
    join(space, ["namespace", node.scope.value, node.name.value])
  ]);
}

function printInclude(node: IncludeDefinition, path: FastPath, p: Print) {
  return join(hardline, [
    ...path.map(p, "comments"),
    join(space, ["include", node.path.value])
  ]);
}

function printEnum(node: EnumDefinition, path: FastPath, p: Print) {
  return join(hardline, [
    ...path.map(p, "comments"),
    join(space, ["enum", node.name.value, "{"]),
    ...path.map(p, "members"),
    "}"
  ]);
}

function printEnumMember(node: EnumMember) {
  let result: Doc = node.name.value;
  if (node.initializer) {
    result = join(space, [result, "=", node.initializer.value.value]);
  }
  return indent(result);
}

function printTypedef(node: TypedefDefinition) {
  return join(space, [
    "typedef",
    getTextByFieldType(node.definitionType),
    node.name.value
  ]);
}

// https://thrift.apache.org/docs/idl#types
// TODO: Annotations
function getTextByFieldType(node: FieldType): Doc {
  switch (node.type) {
    case SyntaxType.BoolKeyword:
      return "bool";
    case SyntaxType.ByteKeyword:
      return "byte";
    case SyntaxType.I8Keyword:
      return "i8";
    case SyntaxType.I16Keyword:
      return "i16";
    case SyntaxType.I32Keyword:
      return "i32";
    case SyntaxType.I64Keyword:
      return "i64";
    case SyntaxType.DoubleKeyword:
      return "double";
    case SyntaxType.StringKeyword:
      return "string";
    case SyntaxType.BinaryKeyword:
      return "binary";
    case SyntaxType.MapType:
      return join(empty, [
        "map<",
        getTextByFieldType(node.keyType),
        ", ",
        getTextByFieldType(node.valueType),
        ">"
      ]);
    case SyntaxType.ListType:
      return join(empty, ["list<", getTextByFieldType(node.valueType), ">"]);
    case SyntaxType.SetType:
      return join(empty, ["set<", getTextByFieldType(node.valueType), ">"]);
    case SyntaxType.Identifier:
      return node.value;
    default:
      console.error(node);
      throw new Error("invalid type");
  }
}

function getTextByConstType(node: ConstValue): Doc {
  switch (node.type) {
    case SyntaxType.StringLiteral:
      return join(empty, ['"', node.value, '"']);
    case SyntaxType.IntConstant:
    case SyntaxType.DoubleConstant:
      return node.value.value;
    case SyntaxType.BooleanLiteral:
      return node.value.toString();
    case SyntaxType.Identifier:
      return node.value;
    default:
      throw new Error("invalid type: " + node.type);
  }
}

function printConst(node: ConstDefinition) {
  const type = getTextByFieldType(node.fieldType);
  const initialValue = getTextByConstType(node.initializer);
  return join(space, ["const", type, node.name.value, "=", initialValue]);
}

function printStruct(node: StructDefinition, path: FastPath, p: Print) {
  let end: Doc = "}";
  if (node.annotations) {
    end = join(space, [
      end,
      join(empty, [
        "(",
        join(", ", path.map(p, "annotations", "annotations")),
        ")"
      ])
    ]);
  }

  const keyword = {
    [SyntaxType.StructDefinition]: "struct",
    [SyntaxType.UnionDefinition]: "union",
    [SyntaxType.ExceptionDefinition]: "exception"
  }[node.type];

  const fields = path.map(p, "fields");
  const seperator = fields.length ? hardline : empty; // Empty struct

  return join(seperator, [
    join(space, [keyword, node.name.value, "{"]),
    ...fields,
    end
  ]);
}

function printStructField(node: FieldDefinition) {
  let result: Doc = node.fieldID.value + ":";
  if (node.requiredness) {
    // TODO: union
    result = join(space, [result, node.requiredness]);
  }
  result = join(space, [
    result,
    getTextByFieldType(node.fieldType),
    node.name.value
  ]);
  return indent(result);
}

function printAnnotation(node: Annotation) {
  let result: Doc = node.name.value;
  if (node.value) {
    result = join(space, [result, "=", getTextByConstType(node.value)]);
  }
  return result;
}

function printService(node: ServiceDefinition, path: FastPath, p: Print) {
  return join(hardline, [
    join(space, ["service", node.name.value, "{"]),
    ...path.map(p, "functions"),
    "}"
  ]);
}

function printFunction(node: FunctionDefinition) {}

function printCommentBlock(node: CommentBlock) {
  return join(hardline, ["/*", " * ", join("\n *", node.value), " */"]);
}

function printCommentLine(node: CommentLine) {
  return join(space, ["//", node.value]);
}

function print(path: FastPath, options: any, p: Print) {
  // console.log(path);
  const node = path.getValue();
  // console.log(node);

  switch (node.type) {
    case SyntaxType.ThriftDocument:
      return printDocument(path, p);
    case SyntaxType.NamespaceDefinition:
      return printNamespace(node, path, p);
    case SyntaxType.IncludeDefinition:
      return printInclude(node, path, p);
    case SyntaxType.EnumDefinition:
      return printEnum(node, path, p);
    case SyntaxType.EnumMember:
      return printEnumMember(node);
    case SyntaxType.TypedefDefinition:
      return printTypedef(node);
    case SyntaxType.ConstDefinition:
      return printConst(node);

    // TODO: exception at last
    case SyntaxType.StructDefinition:
    case SyntaxType.UnionDefinition:
    case SyntaxType.ExceptionDefinition:
      return printStruct(node, path, p);
    case SyntaxType.FieldDefinition:
      return printStructField(node);

    case SyntaxType.Annotation:
      return printAnnotation(node);

    case SyntaxType.ServiceDefinition:
      return printService(node, path, p);
    case SyntaxType.FunctionDefinition:
      return printFunction(node);

    case SyntaxType.CommentBlock:
      return printCommentBlock(node);
    case SyntaxType.CommentLine:
      return printCommentLine(node);

    default:
      throw new Error("invalid type: " + node.type);
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
