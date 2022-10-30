import { can_move, ChessEntity, Coordinate, Entity, entry_is_forbidden, get_initial_state, KingEntity, main, Move, ShogiColumnName, ShogiEntity, ShogiRowName, Side, Situation, throws_if_uncastlable, throws_if_unkumalable, UnpromotedShogiProfession } from "shogoss-core";
import { backward_history, forward_history, parse_cursored, take_until_first_cursor } from "./gametree";

window.addEventListener("load", () => {
    render(get_initial_state("黒"));
    document.getElementById("load_history")!.addEventListener("click", load_history);
    document.getElementById("forward")!.addEventListener("click", forward);
    document.getElementById("backward")!.addEventListener("click", backward);
    document.getElementById("hanzi_black_white")!.addEventListener("click", load_history);
});

function forward() {
    GUI_state.selected = null;
    const text = (document.getElementById("history")! as HTMLTextAreaElement).value;

    const new_history = forward_history(text);
    if (new_history) {
        (document.getElementById("history")! as HTMLTextAreaElement).value = new_history;
        load_history();
    }
}

function backward() {
    GUI_state.selected = null;
    const text = (document.getElementById("history")! as HTMLTextAreaElement).value;

    const new_history = backward_history(text);
    if (new_history) {
        (document.getElementById("history")! as HTMLTextAreaElement).value = new_history;
        load_history();
    }
}

function main_(moves: Move[]) {
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

function load_history() {
    GUI_state.selected = null;
    const text = (document.getElementById("history")! as HTMLTextAreaElement).value;
    (document.getElementById("forward")! as HTMLButtonElement).disabled = forward_history(text) === null;
    (document.getElementById("backward")! as HTMLButtonElement).disabled = backward_history(text) === null;
    const moves = parse_cursored(text);
    try {
        const state = main_(moves.main);
        const previous_state = main_(moves.main.slice(0, -1));
        if (previous_state.phase === "game_end") {
            throw new Error("should not happen");
        }
        if (state.phase === "game_end") {
            alert(`勝者: ${state.victor}、理由: ${state.reason}`);
            render(state.final_situation, previous_state);
        } else {
            render(state, previous_state);
        }
    } catch (e: unknown) {
        alert(e);
    }
}

function getContentHTMLFromEntity(entity: Entity): string {
    if (entity.type === "碁") return "";
    if (entity.type === "ス" && entity.prof !== "と" && entity.prof !== "ポ") {
        return `<span style="font-size: 200%">${{ キ: "♔", ク: "♕", ル: "♖", ビ: "♗", ナ: "♘" }[entity.prof]
            }</span>`;
    }
    return entity.prof
}

function same_entity(e1: Entity, e2: Entity | undefined | null): boolean {
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

type GUI_State = {
    situation: Situation,
    selected: null | { type: "piece_on_board", coord: Coordinate } | { type: "piece_in_hand", index: number, side: Side }
}

const GUI_state: GUI_State = {
    situation: get_initial_state("黒"),
    selected: null,
}

function select_piece_on_board(coord: Coordinate) {
    GUI_state.selected = { type: "piece_on_board", coord };
    render(GUI_state.situation);
}

function select_piece_in_hand(index: number, side: Side) {
    GUI_state.selected = { type: "piece_in_hand", index, side };
    render(GUI_state.situation);
}

// previous_situation との差分には newly や newly_vacated といった CSS クラスをつけて描写
// ただし、GUI_state.selected がある場合には、差分ではなくて選んだ駒について知りたいはずなので、newly の描写を抑制する
function render(situation: Situation, previous_situation?: Situation) {
    if ((document.getElementById("hanzi_black_white") as HTMLInputElement).checked) {
        (document.getElementById("history")! as HTMLTextAreaElement).value =
            (document.getElementById("history")! as HTMLTextAreaElement).value.replace(/[黒▲☗]/g, "黒").replace(/[白△☖]/g, "白");
    } else {
        (document.getElementById("history")! as HTMLTextAreaElement).value =
            (document.getElementById("history")! as HTMLTextAreaElement).value.replace(/[黒▲☗]/g, "▲").replace(/[白△☖]/g, "△");
    }

    GUI_state.situation = situation;
    const board_dom = document.getElementById("board")!;
    board_dom.innerHTML = "";
    const ans: Node[] = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const entity = situation.board[row]![col];
            if (entity == null) {
                if (previous_situation?.board[row]![col] && !GUI_state.selected) {
                    const newly_vacated = document.createElement("div");
                    newly_vacated.classList.add("newly_vacated");
                    newly_vacated.style.cssText = `top:${50 + row * 50}px; left:${100 + col * 50}px;`
                    ans.push(newly_vacated);
                }
                continue;
            }

            const row_ = toShogiRowName(row);
            const col_ = toShogiColumnName(col);
            const is_newly_updated = previous_situation && !GUI_state.selected ? !same_entity(entity, previous_situation.board[row]![col]) : false;
            const is_selected = GUI_state.selected?.type === "piece_on_board" ? GUI_state.selected.coord[1] === row_ && GUI_state.selected.coord[0] === col_ : false;
            const piece_or_stone = document.createElement("div");
            piece_or_stone.classList.add(entity.side === "白" ? "white" : "black");
            if (is_newly_updated) {
                piece_or_stone.classList.add("newly");
            }
            if (is_selected) {
                piece_or_stone.classList.add("selected");
            }
            piece_or_stone.style.cssText = `top:${50 + row * 50}px; left:${100 + col * 50}px;`;
            piece_or_stone.innerHTML = getContentHTMLFromEntity(entity);

            if (entity.type !== "碁") {
                piece_or_stone.addEventListener("click", () => select_piece_on_board([col_, row_]))
            }

            ans.push(piece_or_stone);
        }
    }

    if (GUI_state.selected?.type === "piece_on_board") {
        const entity_that_moves = get_entity_from_coord(situation.board, GUI_state.selected.coord)!;
        if (entity_that_moves.type === "碁") {
            throw new Error("碁石が動くはずがない");
        }
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const row_ = toShogiRowName(row);
                const col_ = toShogiColumnName(col);
                const to: Coordinate = [col_, row_];
                const o: { to: Coordinate, from: Coordinate } = { to, from: GUI_state.selected.coord };
                const is_castlable = (() => {
                    try {
                        throws_if_uncastlable(situation.board, o);
                        return true;
                    } catch (e) {
                        return false;
                    }
                })();

                const is_kumalable = (() => {
                    try {
                        throws_if_unkumalable(situation.board, o);
                        return true;
                    } catch (e) {
                        return false;
                    }
                })();

                if (can_move(situation.board, o) || is_castlable || is_kumalable) {
                    const possible_destination = document.createElement("div");
                    possible_destination.classList.add("possible_destination");
                    possible_destination.style.cssText = `top:${50 + row * 50}px; left:${100 + col * 50}px;`;
                    possible_destination.addEventListener("click", () => { move_piece(to, entity_that_moves) })
                    ans.push(possible_destination);
                }
            }
        }
    } else if (GUI_state.selected?.type === "piece_in_hand") {
        const hand = GUI_state.selected.side === "白" ? situation.hand_of_white : situation.hand_of_black;
        const selected_profession = hand[GUI_state.selected.index]!;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const row_ = toShogiRowName(row);
                const col_ = toShogiColumnName(col);
                const to: Coordinate = [col_, row_];

                if (get_entity_from_coord(situation.board, to)) {
                    continue; // 駒がある場所には打てない
                }

                if (entry_is_forbidden(selected_profession, GUI_state.selected.side, to)) {
                    continue; // 桂馬と香車は打てる場所が限られる
                }
                const side = GUI_state.selected.side;
                const possible_destination = document.createElement("div");
                possible_destination.classList.add("possible_destination");
                possible_destination.style.cssText = `top:${50 + row * 50}px; left:${100 + col * 50}px;`;
                possible_destination.addEventListener("click", () => parachute(to, selected_profession, side))
                ans.push(possible_destination);
            }
        }
    }

    situation.hand_of_white.forEach((prof, index) => {
        const piece_in_hand = document.createElement("div");
        piece_in_hand.classList.add("white");
        piece_in_hand.style.cssText = `top:${50 + index * 50}px; left: 40px;`;
        piece_in_hand.innerHTML = prof;
        piece_in_hand.addEventListener("click", () => select_piece_in_hand(index, "白"));
        const is_selected = GUI_state.selected?.type === "piece_in_hand" && GUI_state.selected.side === "白" ? GUI_state.selected.index === index : false;
        if (is_selected) {
            piece_in_hand.classList.add("selected");
        }
        ans.push(piece_in_hand);
    });

    situation.hand_of_black.forEach((prof, index) => {
        const piece_in_hand = document.createElement("div");
        piece_in_hand.classList.add("black");
        piece_in_hand.style.cssText = `top:${450 - index * 50}px; left: 586px;`;
        piece_in_hand.innerHTML = prof;
        piece_in_hand.addEventListener("click", () => select_piece_in_hand(index, "黒"));
        const is_selected = GUI_state.selected?.type === "piece_in_hand" && GUI_state.selected.side === "白" ? GUI_state.selected.index === index : false;
        if (is_selected) {
            piece_in_hand.classList.add("selected");
        }
        ans.push(piece_in_hand);
    });

    board_dom.append(...ans);
}

function get_entity_from_coord<T>(board: Readonly<(T | null)[][]>, coord: Coordinate): T | null {
    const [column, row] = coord;
    const row_index = "一二三四五六七八九".indexOf(row);
    const column_index = "９８７６５４３２１".indexOf(column);
    if (row_index === -1 || column_index === -1) {
        throw new Error(`不正な座標です`)
    }
    return (board[row_index]?.[column_index]) ?? null;
}

function parachute(to: Coordinate, prof: UnpromotedShogiProfession, side: Side) {
    let text = (document.getElementById("history")! as HTMLTextAreaElement).value;
    const moves = parse_cursored(text);
    if (moves.unevaluated.length > 0) {
        if (!confirm("以降の局面が破棄されます。よろしいですか？（将来的には、局面を破棄せず分岐する機能を足したいと思っています）")) {
            GUI_state.selected = null;
            render(GUI_state.situation);
            return null;
        }
        text = take_until_first_cursor(text);
    }

    const from_txt = "打";
    const full_notation = `${side === "黒" ? "▲" : "△"}${to[0]}${to[1]}${prof}${from_txt}`;

    // 無理な手を指した時に落とす
    try {
        main_(parse_cursored(text + full_notation).main);
    } catch (e) {
        alert(e);
        GUI_state.selected = null;
        render(GUI_state.situation);
        return;
    }

    const loose_notation = `${side === "黒" ? "▲" : "△"}${to[0]}${to[1]}${prof}`;

    function append_and_load(notation: string) {
        text = text.trimEnd();
        text += (text ? "　" : "") + notation;
        (document.getElementById("history")! as HTMLTextAreaElement).value = text;
        load_history();
        return;
    }

    // 曖昧性が出ないときには from を書かずに通す
    try {
        main_(parse_cursored(text + loose_notation).main);
    } catch (e) {
        // 曖昧性が出た
        append_and_load(full_notation);
        return;
    }

    // 曖昧性が無いので from を書かずに通す
    append_and_load(loose_notation);
    return;
}


function move_piece(to: Coordinate, entity_that_moves: ShogiEntity | ChessEntity | KingEntity) {
    if (GUI_state.selected?.type !== "piece_on_board") {
        throw new Error("should not happen");
    }

    let text = (document.getElementById("history")! as HTMLTextAreaElement).value;
    const moves = parse_cursored(text);
    if (moves.unevaluated.length > 0) {
        if (!confirm("以降の局面が破棄されます。よろしいですか？（将来的には、局面を破棄せず分岐する機能を足したいと思っています）")) {
            GUI_state.selected = null;
            render(GUI_state.situation);
            return null;
        }
        text = take_until_first_cursor(text);
    }
    const from: Coordinate = GUI_state.selected.coord;

    const from_txt = `${from[0]}${from[1]}`;
    const full_notation = `${entity_that_moves.side === "黒" ? "▲" : "△"}${to[0]}${to[1]}${entity_that_moves.prof}(${from_txt})`;

    // 無理な手を指した時に落とす
    try {
        main_(parse_cursored(text + full_notation).main);
    } catch (e) {
        alert(e);
        GUI_state.selected = null;
        render(GUI_state.situation);
        return;
    }

    const loose_notation = `${entity_that_moves.side === "黒" ? "▲" : "△"}${to[0]}${to[1]}${entity_that_moves.prof}`;

    function append_and_load(notation: string) {
        text = text.trimEnd();
        text += (text ? "　" : "") + notation;
        (document.getElementById("history")! as HTMLTextAreaElement).value = text;
        load_history();
        return;
    }

    // 曖昧性が出ないときには from を書かずに通す
    try {
        main_(parse_cursored(text + loose_notation).main);
    } catch (e) {
        // 曖昧性が出た
        append_and_load(full_notation);
        return;
    }

    // 曖昧性が無いので from を書かずに通す
    // ただし、ここで「二ポの可能性は無視して曖昧性を考える」という仕様が牙をむく
    if (entity_that_moves.prof !== "ポ") {
        append_and_load(loose_notation);
        return;
    } else {
        const loose = main_(parse_cursored(text + loose_notation).main);
        const full = main_(parse_cursored(text + full_notation).main);
        // loose で解釈すると二ポが回避できるが、full で解釈すると二ポであってゲームが終了するとき
        // これは「二ポです」を知らせるために始点明記が必要
        if (loose.phase === "resolved" && full.phase === "game_end") {
            append_and_load(full_notation);
            return;
        } else if (loose.phase === "resolved" && full.phase === "resolved") {
            // 移動したポーンが即座に碁で取られて二ポが解消するパターンの場合には、「直進」との競合が発生することはない
            // したがって、この場合は直進を採用して問題ないはず
            append_and_load(loose_notation);
            return;
        } else {
            // もうよくわかんないから full notation で書いておきます
            append_and_load(full_notation);
        }



    }

}

function toShogiRowName(n: number): ShogiRowName {
    return "一二三四五六七八九"[n] as ShogiRowName;
}

function toShogiColumnName(n: number): ShogiColumnName {
    return "９８７６５４３２１"[n] as ShogiColumnName;
}