

namespace java thrift.test

struct Integer {
  1: i32 val
}

struct String {
  1: string val
}

struct Boolean {
  1: bool val
}

struct Double {
  1: double val
}

struct Long {
  1: i64 val
}

struct Byte {
  1: byte val
}

struct Float {
  1: double val
}

struct List {
  1: list<string> vals
}

struct ArrayList {
  1: list<string> vals
}

struct SortedMap {
  1: map<string, string> vals
}

struct TreeMap {
  1: map<string, string> vals
}

struct HashMap {
  1: map<string, String> vals
}

struct Map {
  1: map<double, Double> vals
}

struct Object {
  1: Integer integer,
  2: String str,
  3: Boolean boolean_field,
  4: Double dbl,
  5: Byte bite,
  6: map<i32, Integer> intmap,
  7: Map somemap,
}

exception Exception {
  1: string msg
}

service AsyncNonblockingService {
  Object mymethod(
    1: Integer integer,
    2: String str,
    3: Boolean boolean_field,
    4: Double dbl,
    5: Byte bite,
    6: map<i32, Integer> intmap,
    7: Map somemap,
  ) throws (1:Exception ex);
}

struct SafeBytes {
  1: binary bytes;
}

