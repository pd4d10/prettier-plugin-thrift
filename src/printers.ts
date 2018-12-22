import prettier, { FastPath, Doc, Options } from "prettier";
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
  CommentLine,
  FunctionType,
  ThriftDocument
} from "@creditkarma/thrift-parser";
const { concat, join, hardline, line, indent, group } = prettier.doc.builders;
const space = " ";

type Print = (path: FastPath) => Doc;

function printDocument(
  node: ThriftDocument,
  path: FastPath,
  print: Print
): Doc {
  // return concat(
  //   path.map(subPath => {
  //     const node = subPath.getValue();
  //     if (node.type === SyntaxType.NamespaceDefinition) {
  //       return node;
  //     } else {
  //       return concat([hardline, node]);
  //     }
  //   }, "body")
  // );

  // let arr: Doc[] = [];
  // path.each(subPath => {
  //   const node = subPath.getValue();
  //   if (node.type === SyntaxType.NamespaceDefinition) {
  //     arr.push(node);
  //   } else {
  //     arr.push(concat([hardline, node]));
  //   }
  // }, "body");

  // return join(hardline, arr);
  return join(
    hardline,
    path.map((subPath, i) => {
      const node = subPath.getValue();
      if (node.type === SyntaxType.NamespaceDefinition) {
        return print(subPath);
      } else {
        return print(subPath);
      }
    }, "body")
    // path.map(node => print(node), "body")
  );
}

function printNamespace(
  node: NamespaceDefinition,
  path: FastPath,
  print: Print
) {
  return concat([
    ...path.map(print, "comments"),
    "namespace",
    space,
    node.scope.value,
    space,
    node.name.value
  ]);
}

function printInclude(node: IncludeDefinition, path: FastPath, print: Print) {
  return join(hardline, [
    ...path.map(print, "comments"),
    join(space, ["include", concat(['"', node.path.value, '"'])])
  ]);
}

function printEnum(node: EnumDefinition, path: FastPath, print: Print) {
  return concat([
    ...path.map(print, "comments"),
    hardline,
    join(space, ["enum", node.name.value, "{"]),
    ...path.map(print, "members"),
    hardline,
    "}",
    hardline
  ]);
}

function printEnumMember(node: EnumMember) {
  let result: Doc = node.name.value;
  if (node.initializer) {
    result = join(space, [result, "=", node.initializer.value.value]);
  }
  return concat([indent(hardline), result]);
}

function printTypedef(node: TypedefDefinition, path: FastPath, print: Print) {
  let result: Doc = join(space, [
    "typedef",
    getTextByFieldType(node.definitionType),
    node.name.value
  ]);
  if (node.annotations) {
    result = join(space, [
      result,
      concat([
        "(",
        join(", ", path.map(print, "annotations", "annotations")),
        ")"
      ])
    ]);
  }
  return result;
}

// https://thrift.apache.org/docs/idl#types
// TODO: Annotations
function getTextByFieldType(node: FunctionType): Doc {
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
      return concat([
        "map<",
        getTextByFieldType(node.keyType),
        ", ",
        getTextByFieldType(node.valueType),
        ">"
      ]);
    case SyntaxType.ListType:
      return concat(["list<", getTextByFieldType(node.valueType), ">"]);
    case SyntaxType.SetType:
      return concat(["set<", getTextByFieldType(node.valueType), ">"]);
    case SyntaxType.Identifier:
      return node.value;
    case SyntaxType.VoidKeyword:
      return "void";
    default:
      console.error(node);
      throw new Error("invalid type");
  }
}

function getTextByConstType(node: ConstValue): Doc {
  switch (node.type) {
    case SyntaxType.StringLiteral:
      return concat(['"', node.value, '"']);
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

function printStruct(node: StructDefinition, path: FastPath, print: Print) {
  let end: Doc = "}";
  if (node.annotations) {
    end = join(space, [
      end,
      concat([
        "(",
        join(", ", path.map(print, "annotations", "annotations")),
        ")"
      ])
    ]);
  }

  const keyword = {
    [SyntaxType.StructDefinition]: "struct",
    [SyntaxType.UnionDefinition]: "union",
    [SyntaxType.ExceptionDefinition]: "exception"
  }[node.type];

  const fields = path.map(print, "fields");

  return concat([
    join(space, [keyword, node.name.value, "{"]),
    ...fields,
    hardline,
    end,
    hardline
  ]);
}

function printField(node: FieldDefinition, path: FastPath, print: Print) {
  let result: Doc = node.fieldID.value + ":";
  const parentNode = path.getParentNode();

  // union no requiredness
  if (node.requiredness && parentNode.type !== SyntaxType.UnionDefinition) {
    result = join(space, [result, node.requiredness]);
  }
  return concat([
    indent(hardline),
    join(space, [result, getTextByFieldType(node.fieldType), node.name.value])
  ]);
}

function printAnnotation(node: Annotation) {
  let result: Doc = node.name.value;
  if (node.value) {
    result = join(space, [result, "=", getTextByConstType(node.value)]);
  }
  return result;
}

function printService(node: ServiceDefinition, path: FastPath, print: Print) {
  return concat([
    join(space, ["service", node.name.value, "{"]),
    ...path.map(print, "functions"),
    hardline,
    "}",
    hardline
  ]);
}

function printFunction(node: FunctionDefinition, path: FastPath, print: Print) {
  return concat([
    indent(hardline),
    ...path.map(print, "comments"),
    indent(hardline),
    getTextByFieldType(node.returnType),
    space,
    node.name.value,
    "(",
    join(space, path.map(print, "fields")),
    ")"
  ]);
}

function printCommentBlock(node: CommentBlock) {
  return node.rawValue;
}

function printCommentLine(node: CommentLine) {
  return join(space, ["//", node.value]);
}

function printEntry(path: FastPath, options: Options, print: Print) {
  // console.log(path);
  const node = path.getValue();
  // console.log(node);

  switch (node.type) {
    case SyntaxType.ThriftDocument:
      return printDocument(node, path, print);
    case SyntaxType.NamespaceDefinition:
      return printNamespace(node, path, print);
    case SyntaxType.IncludeDefinition:
      return printInclude(node, path, print);
    case SyntaxType.EnumDefinition:
      return printEnum(node, path, print);
    case SyntaxType.EnumMember:
      return printEnumMember(node);
    case SyntaxType.TypedefDefinition:
      return printTypedef(node, path, print);
    case SyntaxType.ConstDefinition:
      return printConst(node);

    // TODO: exception at last
    case SyntaxType.StructDefinition:
    case SyntaxType.UnionDefinition:
    case SyntaxType.ExceptionDefinition:
      return printStruct(node, path, print);
    case SyntaxType.FieldDefinition:
      return printField(node, path, print);

    case SyntaxType.Annotation:
      return printAnnotation(node);

    case SyntaxType.ServiceDefinition:
      return printService(node, path, print);
    case SyntaxType.FunctionDefinition:
      return printFunction(node, path, print);

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
    print: printEntry,
    embed,
    insertPragma
  }
};
