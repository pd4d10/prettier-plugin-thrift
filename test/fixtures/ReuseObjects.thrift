

// The java codegenerator has option to reuse objects for deserialization

namespace java thrift.test

include "ThriftTest.thrift"

struct Reuse {
  1: i32 val1;
  2: set<string> val2;
}

