"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shogoss_core_1 = require("shogoss-core");
const gametree_1 = require("./gametree");
window.addEventListener("load", () => {
    render((0, shogoss_core_1.get_initial_state)("黒"));
    document.getElementById("load_history").addEventListener("click", load_history);
    document.getElementById("forward").addEventListener("click", forward);
    document.getElementById("backward").addEventListener("click", backward);
});
function forward() {
    const text = document.getElementById("history").value;
    const new_history = (0, gametree_1.forward_history)(text);
    if (new_history) {
        document.getElementById("history").value = new_history;
        load_history();
    }
}
function backward() {
    throw new Error("not yet implemented");
}
function load_history() {
    const text = document.getElementById("history").value;
    document.getElementById("forward").disabled = (0, gametree_1.forward_history)(text) === null;
    const moves = (0, gametree_1.parse_cursored)(text);
    try {
        const state = (0, shogoss_core_1.main)(moves.main);
        if (state.phase === "game_end") {
            alert(`勝者: ${state.victor}、理由: ${state.reason}`);
            render(state.final_situation);
        }
        else {
            render(state);
        }
    }
    catch (e) {
        if (e === "棋譜が空です") {
            // どっちかにしておけばいい
            const state = (0, shogoss_core_1.get_initial_state)("黒");
            render(state);
        }
        else {
            alert(e);
        }
    }
}
function getContentHTMLFromEntity(entity) {
    if (entity.type === "碁")
        return "";
    if (entity.type === "ス" && entity.prof !== "と" && entity.prof !== "ポ") {
        return `<span style="font-size: 200%">${{ キ: "♔", ク: "♕", ル: "♖", ビ: "♗", ナ: "♘" }[entity.prof]}</span>`;
    }
    return entity.prof;
}
function render(situation) {
    let ans = "";
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const entity = situation.board[i][j];
            if (entity === null) {
                continue;
            }
            const str = getContentHTMLFromEntity(entity);
            ans += `<div class="${entity.side === "白" ? "white" : "black"}" style="top:${50 + i * 50}px; left:${100 + j * 50}px;">${str}</div>`;
        }
    }
    situation.hand_of_white.forEach((prof, index) => {
        ans += `<div class="white" style="top:${50 + index * 50}px; left: 40px;">${prof}</div>`;
    });
    situation.hand_of_black.forEach((prof, index) => {
        ans += `<div class="black" style="top:${450 - index * 50}px; left: 586px;">${prof}</div>`;
    });
    document.getElementById("board").innerHTML = ans;
}
