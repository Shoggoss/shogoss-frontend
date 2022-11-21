import { Coordinate, Entity, get_initial_state, main, Move, ShogiColumnName, ShogiRowName } from "shogoss-core";
export function main_(moves: Move[]) {
    try {
        return main(moves);
    } catch (e: unknown) {
        if (e instanceof Error && e.message === "棋譜が空です") {
            // どっちかにしておけばいい
            return get_initial_state("黒");
        } else {
            throw e;
        }
    }
}

export function toShogiRowName(n: number): ShogiRowName {
    return "一二三四五六七八九"[n] as ShogiRowName;
}

export function toShogiColumnName(n: number): ShogiColumnName {
    return "９８７６５４３２１"[n] as ShogiColumnName;
}

export function get_entity_from_coord<T>(board: Readonly<(T | null)[][]>, coord: Coordinate): T | null {
    const [column, row] = coord;
    const row_index = "一二三四五六七八九".indexOf(row);
    const column_index = "９８７６５４３２１".indexOf(column);
    if (row_index === -1 || column_index === -1) {
        throw new Error(`不正な座標です`)
    }
    return (board[row_index]?.[column_index]) ?? null;
}

export function same_entity(e1: Entity, e2: Entity | undefined | null): boolean {
    if (!e2) return false;
    if (e1.side !== e2.side) return false;
    if (e1.type === "碁") {
        return e1.type === e2.type;
    }

    if (e2.type === "碁") {
        return false;
    }

    return e1.prof === e2.prof;
}

export const initial_history: string = `{|▲７五ポ７四 
△３四ナ１四 
▲６五ポ２五 
△１一キ１五 
▲４五ポ５六 
△４二ナ１六 
▲９五ポ２四 
△２二銀２六 
▲１六ポ３六 
△３一金３四 
▲１五ポ４四 
△４四ポ３五 
▲４四ポ４五 
△４四ポ左３三 
▲６七ビ４六 
△６五ビ４一 
▲７八銀６六 
△７四ポ２六 
▲７四ポ１六 
△７四ナ４八
▲８五ポ８七 
△５五ポ７七 
▲７七桂 
△６四ポ７九 
▲６五桂５三 
△６五ポ７七 
▲２六ポ５四 
△６六ポ６五 
▲６六ポ６二 
△６六ナ９七 
▲６八ク４三 
△７八ナ８六 
▲７八ビ８九 
△５四ナ７六 
▲７六ナ４二 
△７五ナ６六 
▲４八銀７四 
△９四ポ２七 
▲９四ポ９三 
△９四ナ６七 
▲６七ビ５四
△７五ナ８八 
▲８八ル６三 
△５六ポ７九 
▲５六ビ右 
△６七ナ７八 
▲６七ビ７六 
△８七銀９八 
▲５八ク７三 
△９五ル７五 
▲８四ポ８二 
△９二香５五 
▲８三ポ成８二 
△８三ビ６四 
▲７八金９四 
△９六銀７六 
▲７七金８四 
△７四ビ９一 
▲８六金８七 
△９四香７七 
▲７六ビ８八 
△８五ル８九
▲９六金９二 
△９六香８六 
▲３二銀７二}`;