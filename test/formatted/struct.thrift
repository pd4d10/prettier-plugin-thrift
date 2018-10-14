struct VersioningTestV1 {
  1: i32 begin_in_both
  3: string old_string
  12: i32 end_in_both
}

struct VersioningTestV2 {
  1: i32 begin_in_both
  2: i32 newint
  3: i8 newbyte
  4: i16 newshort
  5: i64 newlong
  6: double newdouble
  7: Bonk newstruct
  8: list<i32> newlist
  9: set<i32> newset
  10: map<i32, i32> newmap
  11: string newstring
  12: i32 end_in_both
}

struct ListTypeVersioningV1 {
  1: list<i32> myints
  2: string hello
}

struct ListTypeVersioningV2 {
  1: list<string> strings
  2: string hello
}

struct GuessProtocolStruct {
  7: map<string, string> map_field
}

struct LargeDeltas {
  1: Bools b1
  10: Bools b10
  100: Bools b100
  500: bool check_true
  1000: Bools b1000
  1500: bool check_false
  2000: VersioningTestV2 vertwo2000
  2500: set<string> a_set2500
  3000: VersioningTestV2 vertwo3000
  4000: list<i32> big_numbers
}

struct NestedListsI32x2 {
  1: list<list<i32>> integerlist
}

struct NestedListsI32x3 {
  1: list<list<list<i32>>> integerlist
}

struct NestedMixedx2 {
  1: list<set<i32>> int_set_list
  2: map<i32, set<string>> map_int_strset
  3: list<map<i32, set<string>>> map_int_strset_list
}

struct ListBonks {
  1: list<Bonk> bonk
}

struct NestedListsBonk {
  1: list<list<list<Bonk>>> bonk
}

struct BoolTest {
  1: optional bool b
  2: optional string s
}

struct StructA {
  1: required string s
}

struct StructB {
  1: optional StructA aa
  2: required StructA ab
}
