import { Entity, get_initial_state, main, Situation } from "shogoss-core";
import { parse } from "shogoss-parser";

window.addEventListener("load", () => {
    render(get_initial_state("黒"));
    document.getElementById("load_history")!.addEventListener("click", load_history);
});
function load_history() {
    const text = (document.getElementById("history")! as HTMLTextAreaElement).value;
    const moves = parse(text);
    try {
        const state = main(moves);
        if (state.phase === "game_end") {
            alert(`勝者: ${state.victor}、理由: ${state.reason}`);
            render(state.final_situation);
        } else {
            render(state);
        }
    } catch (e) {
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

function render(situation: Situation) {
    let ans = "";
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const entity = situation.board[i][j];
            if (entity === null) {
                continue;
            }
            const str = getContentHTMLFromEntity(entity);
            ans += `<div class="${entity.side === "白" ? "white" : "black"}" style="top:${50 + i * 50}px; left:${100 + j * 50}px;">${str}</div>`
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
