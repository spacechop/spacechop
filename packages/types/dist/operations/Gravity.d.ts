import * as t from 'runtypes';
declare const Gravity: t.Union10<t.Literal<"center">, t.Literal<"face">, t.Literal<"north">, t.Literal<"northeast">, t.Literal<"east">, t.Literal<"southeast">, t.Literal<"south">, t.Literal<"southwest">, t.Literal<"west">, t.Literal<"northwest">>;
export declare const allGravities: ("center" | "face" | "north" | "northeast" | "east" | "southeast" | "south" | "southwest" | "west" | "northwest")[];
export declare type Gravity = t.Static<typeof Gravity>;
export default Gravity;
