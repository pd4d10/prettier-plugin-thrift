

namespace cpp thrift.test

typedef i32 MyInt32
typedef string MyString;

struct TypedefTestStruct {
  1: MyInt32 field_MyInt32;
  2: MyString field_MyString;
  3: i32 field_Int32;
  4: string field_String;
}

typedef TypedefTestStruct MyStruct,