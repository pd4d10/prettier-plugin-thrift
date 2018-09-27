

namespace cpp test.stress
namespace d thrift.test.stress
namespace go stress

service Service {

  void echoVoid(),
  i8 echoByte(1: i8 arg),
  i32 echoI32(1: i32 arg),
  i64 echoI64(1: i64 arg),
  string echoString(1: string arg),
  list<i8>  echoList(1: list<i8> arg),
  set<i8>  echoSet(1: set<i8> arg),
  map<i8, i8>  echoMap(1: map<i8, i8> arg),
}

