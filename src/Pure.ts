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