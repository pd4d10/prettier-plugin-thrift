

namespace java thrift.test.enumcontainers

enum GreekGodGoddess {
    ARES,
    APHRODITE,
    ZEUS,
    POSEIDON,
    HERA,
}

typedef GreekGodGoddess GreekGodGoddessType
typedef i32 Power

struct GodBean {
    1: optional map<GreekGodGoddessType, Power> power,
    2: optional set<GreekGodGoddessType> goddess,
    3: optional map<string, GreekGodGoddess> byAlias,
    4: optional set<string> images,
}

const map<GreekGodGoddessType, string> ATTRIBUTES =
{
    GreekGodGoddess.ZEUS: "lightning bolt",
    GreekGodGoddess.POSEIDON: "trident",
}

const set<GreekGodGoddessType> BEAUTY = [ GreekGodGoddess.APHRODITE, GreekGodGoddess.HERA ]
