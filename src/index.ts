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

function render(situation: Situation, previous_situation?: Situation) {
    let ans = "";
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const entity = situation.board[i]![j];
            if (entity == null) {
                continue;
            }

            const newly = previous_situation ? !same_entity(entity, previous_situation.board[i]![j]) : false;
            const str = getContentHTMLFromEntity(entity);
            ans += `<div class="${entity.side === "白" ? "white" : "black"} ${newly ? "newly" : ""}" style="top:${50 + i * 50}px; left:${100 + j * 50}px;">${str}</div>`
        }
    }

    situation.hand_of_white.forEach((prof, index) => {
        ans += `<div class="white" style="top:${50 + index * 50}px; left: 40px;">${prof}</div>`
    });

    situation.hand_of_black.forEach((prof, index) => {
        ans += `<div class="black" style="top:${450 - index * 50}px; left: 586px;">${prof}</div>`
    });

    document.getElementById("board")!.innerHTML = ans;
}
