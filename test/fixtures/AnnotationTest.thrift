

typedef list<i32> ( cpp.template = "std::list" ) int_linked_list

struct foo {
  1: i32 bar ( presence = "required" );
  2: i32 baz ( presence = "manual", cpp.use_pointer = "", );
  3: i32 qux;
  4: i32 bop;
} (
  cpp.type = "DenseFoo",
  python.type = "DenseFoo",
  java.final = "",
  annotation.without.value,
)

exception foo_error {
  1: i32 error_code ( foo="bar" )
  2: string error_msg
} (foo = "bar")

typedef string ( unicode.encoding = "UTF-16" ) non_latin_string (foo="bar")
typedef list< double ( cpp.fixed_point = "16" ) > tiny_float_list

enum weekdays {
  SUNDAY ( weekend = "yes" ),
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY ( weekend = "yes" )
} (foo.bar="baz")

/* Note that annotations on senum values are not supported. */
senum seasons {
  "Spring",
  "Summer",
  "Fall",
  "Winter"
} ( foo = "bar" )

struct ostr_default {
  1: i32 bar;
}

struct ostr_custom {
  1: i32 bar;
} (cpp.customostream)


service foo_service {
  void foo() ( foo = "bar" )
} (a.b="c")

