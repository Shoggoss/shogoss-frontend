"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forward_history = exports.parse_cursored = void 0;
const shogoss_parser_1 = require("shogoss-parser");
function parse_cursored(s) {
    const ans = { main: [], unevaluated: [] };
    while (true) {
        s = s.trimStart();
        if (s.startsWith("{|")) {
            s = s.slice(2);
            while (true) {
                s = s.trimStart();
                if (s.startsWith("}"))
                    return ans;
                const { move, rest } = (0, shogoss_parser_1.munch_one)(s);
                s = rest;
                ans.unevaluated.push(move);
            }
        }
        else if (s.trimStart() === "") {
            return ans;
        }
        const { move, rest } = (0, shogoss_parser_1.munch_one)(s);
        s = rest;
        ans.main.push(move);
    }
}
exports.parse_cursored = parse_cursored;
function forward_history(original_s) {
    let s = original_s;
    // n 手分をパース
    while (true) {
        s = s.trimStart();
        // {| に遭遇したら、
        const till_nth = original_s.slice(0, original_s.length - s.length);
        if (s.startsWith("{|")) {
            // {| を読み飛ばし、
            s = s.slice(2);
            // スペースを保全して
            const start_of_space = original_s.length - s.length;
            s = s.trimStart();
            //  1 手分をパース。1 手も残ってないなら、それはそれ以上 forward できないので null を返す
            if (s.startsWith("}")) {
                return null;
            }
            const { move: _, rest } = (0, shogoss_parser_1.munch_one)(s);
            s = rest;
            const end_of_space_and_move = original_s.length - s.length;
            s = s.trimStart();
            const end_of_space_and_move_and_space = original_s.length - s.length;
            return till_nth + original_s.slice(start_of_space, end_of_space_and_move) + original_s.slice(end_of_space_and_move, end_of_space_and_move_and_space) + "{|" + original_s.slice(end_of_space_and_move_and_space);
        }
        else if (s.trimStart() === "") {
            return null; // それ以上 forward できないので null を返す
        }
        const { move: _, rest } = (0, shogoss_parser_1.munch_one)(s);
        s = rest;
    }
}
exports.forward_history = forward_history;
