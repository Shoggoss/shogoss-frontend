import { Entity, GameEnd, get_initial_state, main, Move, ResolvedGameState, Situation } from "shogoss-core";
import { backward_history, forward_history, parse_cursored } from "./gametree";

window.addEventListener("load", () => {
    render(get_initial_state("黒"));
    document.getElementById("load_history")!.addEventListener("click", load_history);
    document.getElementById("forward")!.addEventListener("click", forward);
    document.getElementById("backward")!.addEventListener("click", backward);
});

function forward() {
    const text = (document.getElementById("history")! as HTMLTextAreaElement).value;

    const new_history = forward_history(text);
    if (new_history) {
        (document.getElementById("history")! as HTMLTextAreaElement).value = new_history;
        load_history();
    }
}

function backward() {
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
    selected: null | { type: "piece_on_board", row: number, col: number }
}

const GUI_state: GUI_State = {
    situation: get_initial_state("黒"),
    selected: null,
}

function select_piece_on_board(row: number, col: number) {
    GUI_state.selected = { type: "piece_on_board", row, col };
    alert(`row: ${row}, col: ${col}`);
}

function render(situation: Situation, previous_situation?: Situation) {
    const board_dom = document.getElementById("board")!;
    board_dom.innerHTML = "";
    const ans: Node[] = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const entity = situation.board[row]![col];
            if (entity == null) {
                if (previous_situation?.board[row]![col]) {
                    const newly_vacated = document.createElement("div");
                    newly_vacated.classList.add("newly_vacated");
                    newly_vacated.style.cssText = `top:${50 + row * 50}px; left:${100 + col * 50}px;`
                    ans.push(newly_vacated);
                }
                continue;
            }

            const newly = previous_situation ? !same_entity(entity, previous_situation.board[row]![col]) : false;
            const piece_or_stone = document.createElement("div");
            piece_or_stone.classList.add(entity.side === "白" ? "white" : "black");
            if (newly) {
                piece_or_stone.classList.add("newly");
            }
            piece_or_stone.style.cssText = `top:${50 + row * 50}px; left:${100 + col * 50}px;`;
            piece_or_stone.innerHTML = getContentHTMLFromEntity(entity);
            const row_ = row;
            const col_ = col;
            piece_or_stone.addEventListener("click", () => select_piece_on_board(row_, col_))
            ans.push(piece_or_stone);
        }
    }

    situation.hand_of_white.forEach((prof, index) => {
        const piece_in_hand = document.createElement("div");
        piece_in_hand.classList.add("white");
        piece_in_hand.style.cssText = `top:${50 + index * 50}px; left: 40px;`;
        piece_in_hand.innerHTML = prof;
        ans.push(piece_in_hand);
    });

    situation.hand_of_black.forEach((prof, index) => {
        const piece_in_hand = document.createElement("div");
        piece_in_hand.classList.add("black");
        piece_in_hand.style.cssText = `top:${450 - index * 50}px; left: 586px;`;
        piece_in_hand.innerHTML = prof;
        ans.push(piece_in_hand);
    });

    board_dom.append(...ans);
}
