/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/shogoss-core/dist/after_stone_phase.js":
/*!*************************************************************!*\
  !*** ./node_modules/shogoss-core/dist/after_stone_phase.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.resolve_after_stone_phase = void 0;
const board_1 = __webpack_require__(/*! ./board */ "./node_modules/shogoss-core/dist/board.js");
const side_1 = __webpack_require__(/*! ./side */ "./node_modules/shogoss-core/dist/side.js");
const surround_1 = __webpack_require__(/*! ./surround */ "./node_modules/shogoss-core/dist/surround.js");
const type_1 = __webpack_require__(/*! ./type */ "./node_modules/shogoss-core/dist/type.js");
/** 石フェイズが終了した後、勝敗判定と囲碁検査をする。 / To be called after a stone is placed: checks the victory condition and the game-of-go condition.
 * また、相手のポ兵にアンパッサンフラグがついていたら、それを取り除く（自分が手を指したことによって、アンパッサンの権利が失われたので）
 * Also, if the opponent's pawn has an en passant flag, delete it (since, by playing a piece unrelated to en passant, you have lost the right to capture by en passant)
 *
 * 1. 自分の駒と石によって囲まれている相手の駒と石をすべて取り除く
 * 2. 相手の駒と石によって囲まれている自分の駒と石をすべて取り除く
 * 3. 二ポが発生しているか・キング王が盤面から除かれているかを判定。
 *   3-1. 両キング王が除かれていたら、カラテジャンケンボクシング
 *   3-2. 自分の王だけ除かれていたら、それは「王の自殺による敗北」
 *   3-3. 相手の王だけ除かれている場合、
 *       3-3-1. 二ポが発生していなければ、それは「王の排除による勝利」
 *             3-3-1-1. 相手の王を取り除いたのがステップ 1. であり、
 *                      しかも「ごっそり」（@re_hako_moon曰く、2個か3個）
 *                      に該当するときには「ショゴス！」の発声
 *       3-3-2. 二ポが発生しているなら、カラテジャンケンボクシング
 *   3-4. どちらの王も除かれていない場合、
 *       3-4-1. 二ポが発生していなければ、ゲーム続行
 *       3-4-2. 二ポが発生しているなら、それは「二ポによる敗北」
 *
 * 1 → 2 の順番である根拠：コンビネーションアタックの存在
 * 2 → 3 の順番である根拠：公式ルール追記
 * 「石フェイズを着手した結果として自分のポーン兵が盤上から消え二ポが解決される場合も、反則をとらず進行できる。」
 *
 * 1. Remove all the opponent's pieces and stones surrounded by your pieces and stones
 * 2. Remove all your pieces and stones surrounded by the opponent's pieces and stones
 * 3. Checks whether two pawns occupy the same column, and checks whether a king is removed from the board.
 *   3-1. If both kings are removed, that is a draw, and therefore a Karate Rock-Paper-Scissors Boxing.
 *   3-2. If your king is removed but the opponent's remains, then it's a loss by king's suicide.
 *   3-3. If the opponent's king is removed but yours remains,
 *        3-3-1. If no two pawns occupy the same column, then it's a victory
 *             3-3-1-1. If the step that removed the opponent's king was step 1,
 *                      and when a large number (>= 2 or 3, according to @re_hako_moon)
 *                      of pieces/stones are removed, then "ShoGoSs!" should be shouted
 *
 * The ordering 1 → 2 is needed to support the combination attack.
 * The ordering 2 → 3 is explicitly mentioned by the addendum to the official rule:
 *         「石フェイズを着手した結果として自分のポーン兵が盤上から消え二ポが解決される場合も、反則をとらず進行できる。」
 **/
function resolve_after_stone_phase(played) {
    remove_surrounded_enitities_from_board_and_add_to_hand_if_necessary(played, (0, side_1.opponentOf)(played.by_whom));
    remove_surrounded_enitities_from_board_and_add_to_hand_if_necessary(played, played.by_whom);
    renounce_en_passant(played.board, played.by_whom);
    const doubled_pawns_exist = does_doubled_pawns_exist(played.board, played.by_whom);
    const is_your_king_alive = king_is_alive(played.board, played.by_whom);
    const is_opponents_king_alive = king_is_alive(played.board, (0, side_1.opponentOf)(played.by_whom));
    const situation = {
        board: played.board,
        hand_of_black: played.hand_of_black,
        hand_of_white: played.hand_of_white,
    };
    if (!is_your_king_alive) {
        if (!is_opponents_king_alive) {
            return { phase: "game_end", reason: "both_king_dead", victor: "KarateJankenBoxing", final_situation: situation };
        }
        else {
            return { phase: "game_end", reason: "king_suicide", victor: (0, side_1.opponentOf)(played.by_whom), final_situation: situation };
        }
    }
    else {
        if (!is_opponents_king_alive) {
            if (!doubled_pawns_exist) {
                return { phase: "game_end", reason: "king_capture", victor: played.by_whom, final_situation: situation };
            }
            else {
                return { phase: "game_end", reason: "king_capture_and_doubled_pawns", victor: "KarateJankenBoxing", final_situation: situation };
            }
        }
        else {
            if (!doubled_pawns_exist) {
                return {
                    phase: "resolved",
                    board: played.board,
                    hand_of_black: played.hand_of_black,
                    hand_of_white: played.hand_of_white,
                    who_goes_next: (0, side_1.opponentOf)(played.by_whom)
                };
            }
            else {
                return { phase: "game_end", reason: "doubled_pawns", victor: (0, side_1.opponentOf)(played.by_whom), final_situation: situation };
            }
        }
    }
}
exports.resolve_after_stone_phase = resolve_after_stone_phase;
function renounce_en_passant(board, by_whom) {
    const opponent_pawn_coords = (0, board_1.lookup_coords_from_side_and_prof)(board, (0, side_1.opponentOf)(by_whom), "ポ");
    for (const coord of opponent_pawn_coords) {
        (0, board_1.delete_en_passant_flag)(board, coord);
    }
}
function has_duplicates(array) {
    return new Set(array).size !== array.length;
}
function does_doubled_pawns_exist(board, side) {
    const coords = (0, board_1.lookup_coords_from_side_and_prof)(board, side, "ポ");
    const columns = coords.map(([col, _row]) => col);
    return has_duplicates(columns);
}
function king_is_alive(board, side) {
    return (0, board_1.lookup_coords_from_side_and_prof)(board, side, "キ").length + (0, board_1.lookup_coords_from_side_and_prof)(board, side, "超").length > 0;
}
function remove_surrounded_enitities_from_board_and_add_to_hand_if_necessary(old, side) {
    const black_and_white = old.board.map(row => row.map(sq => sq === null ? null : sq.side));
    const has_survived = (0, surround_1.remove_surrounded)(side, black_and_white);
    old.board.forEach((row, i) => row.forEach((sq, j) => {
        if (!has_survived[i]?.[j]) {
            const captured_entity = sq;
            row[j] = null;
            send_captured_entity_to_opponent(old, captured_entity);
        }
    }));
}
function send_captured_entity_to_opponent(old, captured_entity) {
    if (!captured_entity)
        return;
    const opponent = (0, side_1.opponentOf)(captured_entity.side);
    if (captured_entity.type === "しょ") {
        (opponent === "白" ? old.hand_of_white : old.hand_of_black).push((0, type_1.unpromote)(captured_entity.prof));
    }
}


/***/ }),

/***/ "./node_modules/shogoss-core/dist/board.js":
/*!*************************************************!*\
  !*** ./node_modules/shogoss-core/dist/board.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lookup_coords_from_side = exports.lookup_coords_from_side_and_prof = exports.put_entity_at_coord_and_also_adjust_flags = exports.delete_en_passant_flag = exports.get_entity_from_coord = void 0;
const coordinate_1 = __webpack_require__(/*! ./coordinate */ "./node_modules/shogoss-core/dist/coordinate.js");
function get_entity_from_coord(board, coord) {
    const [column, row] = coord;
    const row_index = "一二三四五六七八九".indexOf(row);
    const column_index = "９８７６５４３２１".indexOf(column);
    if (row_index === -1 || column_index === -1) {
        throw new Error(`座標「${(0, coordinate_1.displayCoord)(coord)}」は不正です`);
    }
    return (board[row_index]?.[column_index]) ?? null;
}
exports.get_entity_from_coord = get_entity_from_coord;
function delete_en_passant_flag(board, coord) {
    const [column, row] = coord;
    const row_index = "一二三四五六七八九".indexOf(row);
    const column_index = "９８７６５４３２１".indexOf(column);
    if (row_index === -1 || column_index === -1) {
        throw new Error(`座標「${(0, coordinate_1.displayCoord)(coord)}」は不正です`);
    }
    const pawn = board[row_index][column_index];
    if (pawn?.type !== "ス" || pawn.prof !== "ポ") {
        throw new Error(`ポーンのない座標「${(0, coordinate_1.displayCoord)(coord)}」に対して \`delete_en_passant_flag()\` が呼ばれました`);
    }
    delete pawn.subject_to_en_passant;
}
exports.delete_en_passant_flag = delete_en_passant_flag;
/**
 * 駒・碁石・null を盤上の特定の位置に配置する。can_castle フラグと can_kumal フラグを適宜調整する。
 * @param board
 * @param coord
 * @param maybe_entity
 * @returns
 */
function put_entity_at_coord_and_also_adjust_flags(board, coord, maybe_entity) {
    const [column, row] = coord;
    const row_index = "一二三四五六七八九".indexOf(row);
    const column_index = "９８７６５４３２１".indexOf(column);
    if (row_index === -1 || column_index === -1) {
        throw new Error(`座標「${(0, coordinate_1.displayCoord)(coord)}」は不正です`);
    }
    if (maybe_entity?.type === "王") {
        if (maybe_entity.never_moved) {
            maybe_entity.never_moved = false;
            maybe_entity.has_moved_only_once = true;
        }
        else if (maybe_entity.has_moved_only_once) {
            maybe_entity.never_moved = false;
            maybe_entity.has_moved_only_once = false;
        }
    }
    else if (maybe_entity?.type === "しょ" && maybe_entity.prof === "香") {
        maybe_entity.can_kumal = false;
    }
    else if (maybe_entity?.type === "ス") {
        maybe_entity.never_moved = false;
    }
    return board[row_index][column_index] = maybe_entity;
}
exports.put_entity_at_coord_and_also_adjust_flags = put_entity_at_coord_and_also_adjust_flags;
function lookup_coords_from_side_and_prof(board, side, prof) {
    const ans = [];
    const rows = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
    const cols = ["１", "２", "３", "４", "５", "６", "７", "８", "９"];
    for (const row of rows) {
        for (const col of cols) {
            const coord = [col, row];
            const entity = get_entity_from_coord(board, coord);
            if (entity === null || entity.type === "碁") {
                continue;
            }
            else if (entity.prof === prof && entity.side === side) {
                ans.push(coord);
            }
            else {
                continue;
            }
        }
    }
    return ans;
}
exports.lookup_coords_from_side_and_prof = lookup_coords_from_side_and_prof;
function lookup_coords_from_side(board, side) {
    const ans = [];
    const rows = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
    const cols = ["１", "２", "３", "４", "５", "６", "７", "８", "９"];
    for (const row of rows) {
        for (const col of cols) {
            const coord = [col, row];
            const entity = get_entity_from_coord(board, coord);
            if (entity === null || entity.type === "碁") {
                continue;
            }
            else if (entity.side === side) {
                ans.push(coord);
            }
            else {
                continue;
            }
        }
    }
    return ans;
}
exports.lookup_coords_from_side = lookup_coords_from_side;


/***/ }),

/***/ "./node_modules/shogoss-core/dist/can_see.js":
/*!***************************************************!*\
  !*** ./node_modules/shogoss-core/dist/can_see.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.do_any_of_my_pieces_see = exports.can_see = void 0;
const board_1 = __webpack_require__(/*! ./board */ "./node_modules/shogoss-core/dist/board.js");
const side_1 = __webpack_require__(/*! ./side */ "./node_modules/shogoss-core/dist/side.js");
function deltaEq(d, delta) {
    return d.v === delta.v && d.h === delta.h;
}
/**
 * `o.from` に駒があってその駒が `o.to` へと利いているかどうかを返す。ポーンの斜め利きは常に can_see と見なす。ポーンの2マス移動は、駒を取ることができないので「利き」ではない。
 *  Checks whether there is a piece at `o.from` which looks at `o.to`. The diagonal move of pawn is always considered. A pawn never sees two squares in the front; it can only move to there.
 * @param board
 * @param o
 * @returns
 */
function can_see(board, o) {
    const p = (0, board_1.get_entity_from_coord)(board, o.from);
    if (!p) {
        return false;
    }
    if (p.type === "碁") {
        return false;
    }
    const delta = (0, side_1.coordDiffSeenFrom)(p.side, o);
    if (p.prof === "成桂" || p.prof === "成銀" || p.prof === "成香" || p.prof === "金") {
        return [
            { v: 1, h: -1 }, { v: 1, h: 0 }, { v: 1, h: 1 },
            { v: 0, h: -1 }, /************/ { v: 0, h: 1 },
            /**************/ { v: -1, h: 0 } /**************/
        ].some(d => deltaEq(d, delta));
    }
    else if (p.prof === "銀") {
        return [
            { v: 1, h: -1 }, { v: 1, h: 0 }, { v: 1, h: 1 },
            /**********************************************/
            { v: -1, h: -1 }, /************/ { v: 1, h: 1 },
        ].some(d => deltaEq(d, delta));
    }
    else if (p.prof === "桂") {
        return [
            { v: 2, h: -1 }, { v: 2, h: 1 }
        ].some(d => deltaEq(d, delta));
    }
    else if (p.prof === "ナ") {
        return [
            { v: 2, h: -1 }, { v: 2, h: 1 },
            { v: -2, h: -1 }, { v: -2, h: 1 },
            { v: -1, h: 2 }, { v: 1, h: 2 },
            { v: -1, h: -2 }, { v: 1, h: -2 }
        ].some(d => deltaEq(d, delta));
    }
    else if (p.prof === "キ") {
        return [
            { v: 1, h: -1 }, { v: 1, h: 0 }, { v: 1, h: 1 },
            { v: 0, h: -1 }, /*************/ { v: 0, h: 1 },
            { v: -1, h: -1 }, { v: -1, h: 0 }, { v: -1, h: 1 },
        ].some(d => deltaEq(d, delta));
    }
    else if (p.prof === "と" || p.prof === "ク") {
        return long_range([
            { v: 1, h: -1 }, { v: 1, h: 0 }, { v: 1, h: 1 },
            { v: 0, h: -1 }, /*************/ { v: 0, h: 1 },
            { v: -1, h: -1 }, { v: -1, h: 0 }, { v: -1, h: 1 },
        ], board, o, p.side);
    }
    else if (p.prof === "ビ") {
        return long_range([
            { v: 1, h: -1 }, { v: 1, h: 1 }, { v: -1, h: -1 }, { v: -1, h: 1 },
        ], board, o, p.side);
    }
    else if (p.prof === "ル") {
        return long_range([
            { v: 1, h: 0 }, { v: 0, h: -1 }, { v: 0, h: 1 }, { v: -1, h: 0 },
        ], board, o, p.side);
    }
    else if (p.prof === "香") {
        return long_range([{ v: 1, h: 0 }], board, o, p.side);
    }
    else if (p.prof === "超") {
        return true;
    }
    else if (p.prof === "ポ") {
        if ([{ v: 1, h: -1 }, { v: 1, h: 0 }, { v: 1, h: 1 }].some(d => deltaEq(d, delta))) {
            return true;
        }
        else {
            // a pawn can never see two squares in front; it can only move to there
            return false;
        }
    }
    else {
        const _ = p.prof;
        throw new Error("Should not reach here");
    }
}
exports.can_see = can_see;
function long_range(directions, board, o, side) {
    const delta = (0, side_1.coordDiffSeenFrom)(side, o);
    const matching_directions = directions.filter(direction => delta.v * direction.v + delta.h * direction.h > 0 /* inner product is positive */
        && delta.v * direction.h - direction.v * delta.h === 0 /* cross product is zero */);
    if (matching_directions.length === 0) {
        return false;
    }
    const direction = matching_directions[0];
    for (let i = { v: direction.v, h: direction.h }; !deltaEq(i, delta); i.v += direction.v, i.h += direction.h) {
        const coord = (0, side_1.applyDeltaSeenFrom)(side, o.from, i);
        if ((0, board_1.get_entity_from_coord)(board, coord)) {
            // blocked by something; cannot see
            return false;
        }
    }
    return true;
}
function do_any_of_my_pieces_see(board, coord, side) {
    const opponent_piece_coords = (0, board_1.lookup_coords_from_side)(board, side);
    return opponent_piece_coords.some(from => can_see(board, { from, to: coord }));
}
exports.do_any_of_my_pieces_see = do_any_of_my_pieces_see;


/***/ }),

/***/ "./node_modules/shogoss-core/dist/coordinate.js":
/*!******************************************************!*\
  !*** ./node_modules/shogoss-core/dist/coordinate.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LeftmostWhenSeenFromBlack = exports.RightmostWhenSeenFromBlack = exports.coordDiff = exports.columnsBetween = exports.coordEq = exports.displayCoord = void 0;
function displayCoord(coord) {
    return `${coord[0]}${coord[1]}`;
}
exports.displayCoord = displayCoord;
function coordEq([col1, row1], [col2, row2]) {
    return col1 === col2 && row1 === row2;
}
exports.coordEq = coordEq;
function columnsBetween(a, b) {
    const a_index = "９８７６５４３２１".indexOf(a);
    const b_index = "９８７６５４３２１".indexOf(b);
    if (a_index >= b_index)
        return columnsBetween(b, a);
    const ans = [];
    for (let i = a_index + 1; i < b_index; i++) {
        ans.push("９８７６５４３２１"[i]);
    }
    return ans;
}
exports.columnsBetween = columnsBetween;
function coordDiff(o) {
    const [from_column, from_row] = o.from;
    const from_row_index = "一二三四五六七八九".indexOf(from_row);
    const from_column_index = "９８７６５４３２１".indexOf(from_column);
    const [to_column, to_row] = o.to;
    const to_row_index = "一二三四五六七八九".indexOf(to_row);
    const to_column_index = "９８７６５４３２１".indexOf(to_column);
    return {
        h: to_column_index - from_column_index,
        v: to_row_index - from_row_index
    };
}
exports.coordDiff = coordDiff;
function RightmostWhenSeenFromBlack(coords) {
    if (coords.length === 0) {
        throw new Error("tried to take the maximum of an empty array");
    }
    // Since "１" to "９" are consecutive in Unicode, we can just sort it as UTF-16 string
    const columns = coords.map(([col, _row]) => col);
    columns.sort();
    const rightmost_column = columns[0];
    return coords.filter(([col, _row]) => col === rightmost_column);
}
exports.RightmostWhenSeenFromBlack = RightmostWhenSeenFromBlack;
function LeftmostWhenSeenFromBlack(coords) {
    if (coords.length === 0) {
        throw new Error("tried to take the maximum of an empty array");
    }
    // Since "１" to "９" are consecutive in Unicode, we can just sort it as UTF-16 string
    const columns = coords.map(([col, _row]) => col);
    columns.sort();
    const leftmost_column = columns[columns.length - 1];
    return coords.filter(([col, _row]) => col === leftmost_column);
}
exports.LeftmostWhenSeenFromBlack = LeftmostWhenSeenFromBlack;


/***/ }),

/***/ "./node_modules/shogoss-core/dist/index.js":
/*!*************************************************!*\
  !*** ./node_modules/shogoss-core/dist/index.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.from_custom_state = exports.main = exports.get_initial_state = exports.coordEq = exports.displayCoord = exports.can_move = exports.can_see = exports.opponentOf = void 0;
const board_1 = __webpack_require__(/*! ./board */ "./node_modules/shogoss-core/dist/board.js");
const piece_phase_1 = __webpack_require__(/*! ./piece_phase */ "./node_modules/shogoss-core/dist/piece_phase.js");
const coordinate_1 = __webpack_require__(/*! ./coordinate */ "./node_modules/shogoss-core/dist/coordinate.js");
const after_stone_phase_1 = __webpack_require__(/*! ./after_stone_phase */ "./node_modules/shogoss-core/dist/after_stone_phase.js");
const side_1 = __webpack_require__(/*! ./side */ "./node_modules/shogoss-core/dist/side.js");
const surround_1 = __webpack_require__(/*! ./surround */ "./node_modules/shogoss-core/dist/surround.js");
var side_2 = __webpack_require__(/*! ./side */ "./node_modules/shogoss-core/dist/side.js");
Object.defineProperty(exports, "opponentOf", ({ enumerable: true, get: function () { return side_2.opponentOf; } }));
__exportStar(__webpack_require__(/*! ./type */ "./node_modules/shogoss-core/dist/type.js"), exports);
var can_see_1 = __webpack_require__(/*! ./can_see */ "./node_modules/shogoss-core/dist/can_see.js");
Object.defineProperty(exports, "can_see", ({ enumerable: true, get: function () { return can_see_1.can_see; } }));
var piece_phase_2 = __webpack_require__(/*! ./piece_phase */ "./node_modules/shogoss-core/dist/piece_phase.js");
Object.defineProperty(exports, "can_move", ({ enumerable: true, get: function () { return piece_phase_2.can_move; } }));
var coordinate_2 = __webpack_require__(/*! ./coordinate */ "./node_modules/shogoss-core/dist/coordinate.js");
Object.defineProperty(exports, "displayCoord", ({ enumerable: true, get: function () { return coordinate_2.displayCoord; } }));
Object.defineProperty(exports, "coordEq", ({ enumerable: true, get: function () { return coordinate_2.coordEq; } }));
const get_initial_state = (who_goes_first) => {
    return {
        phase: "resolved",
        hand_of_black: [],
        hand_of_white: [],
        who_goes_next: who_goes_first,
        board: [
            [
                { type: "しょ", side: "白", prof: "香", can_kumal: true },
                { type: "しょ", side: "白", prof: "桂", can_kumal: false },
                { type: "しょ", side: "白", prof: "銀", can_kumal: false },
                { type: "しょ", side: "白", prof: "金", can_kumal: false },
                { type: "王", side: "白", prof: "キ", never_moved: true, has_moved_only_once: false },
                { type: "しょ", side: "白", prof: "金", can_kumal: false },
                { type: "しょ", side: "白", prof: "銀", can_kumal: false },
                { type: "しょ", side: "白", prof: "桂", can_kumal: false },
                { type: "しょ", side: "白", prof: "香", can_kumal: true },
            ],
            [
                { type: "ス", side: "白", prof: "ル", never_moved: true },
                { type: "ス", side: "白", prof: "ナ", never_moved: true },
                { type: "ス", side: "白", prof: "ビ", never_moved: true },
                null,
                { type: "ス", side: "白", prof: "ク", never_moved: true },
                null,
                { type: "ス", side: "白", prof: "ビ", never_moved: true },
                { type: "ス", side: "白", prof: "ナ", never_moved: true },
                { type: "ス", side: "白", prof: "ル", never_moved: true },
            ],
            [
                { type: "ス", side: "白", prof: "ポ", never_moved: true },
                { type: "ス", side: "白", prof: "ポ", never_moved: true },
                { type: "ス", side: "白", prof: "ポ", never_moved: true },
                { type: "ス", side: "白", prof: "ポ", never_moved: true },
                { type: "ス", side: "白", prof: "ポ", never_moved: true },
                { type: "ス", side: "白", prof: "ポ", never_moved: true },
                { type: "ス", side: "白", prof: "ポ", never_moved: true },
                { type: "ス", side: "白", prof: "ポ", never_moved: true },
                { type: "ス", side: "白", prof: "ポ", never_moved: true },
            ],
            [null, null, null, null, null, null, null, null, null,],
            [null, null, null, null, null, null, null, null, null,],
            [null, null, null, null, null, null, null, null, null,],
            [
                { type: "ス", side: "黒", prof: "ポ", never_moved: true },
                { type: "ス", side: "黒", prof: "ポ", never_moved: true },
                { type: "ス", side: "黒", prof: "ポ", never_moved: true },
                { type: "ス", side: "黒", prof: "ポ", never_moved: true },
                { type: "ス", side: "黒", prof: "ポ", never_moved: true },
                { type: "ス", side: "黒", prof: "ポ", never_moved: true },
                { type: "ス", side: "黒", prof: "ポ", never_moved: true },
                { type: "ス", side: "黒", prof: "ポ", never_moved: true },
                { type: "ス", side: "黒", prof: "ポ", never_moved: true },
            ],
            [
                { type: "ス", side: "黒", prof: "ル", never_moved: true },
                { type: "ス", side: "黒", prof: "ナ", never_moved: true },
                { type: "ス", side: "黒", prof: "ビ", never_moved: true },
                null,
                { type: "ス", side: "黒", prof: "ク", never_moved: true },
                null,
                { type: "ス", side: "黒", prof: "ビ", never_moved: true },
                { type: "ス", side: "黒", prof: "ナ", never_moved: true },
                { type: "ス", side: "黒", prof: "ル", never_moved: true },
            ],
            [
                { type: "しょ", side: "黒", prof: "香", can_kumal: true },
                { type: "しょ", side: "黒", prof: "桂", can_kumal: false },
                { type: "しょ", side: "黒", prof: "銀", can_kumal: false },
                { type: "しょ", side: "黒", prof: "金", can_kumal: false },
                { type: "王", side: "黒", prof: "キ", never_moved: true, has_moved_only_once: false },
                { type: "しょ", side: "黒", prof: "金", can_kumal: false },
                { type: "しょ", side: "黒", prof: "銀", can_kumal: false },
                { type: "しょ", side: "黒", prof: "桂", can_kumal: false },
                { type: "しょ", side: "黒", prof: "香", can_kumal: true },
            ],
        ]
    };
};
exports.get_initial_state = get_initial_state;
/** 碁石を置く。自殺手になるような碁石の置き方はできない（公式ルール「打った瞬間に取られてしまうマスには石は打てない」）
 *
 * @param old
 * @param side
 * @param stone_to
 * @returns
 */
function place_stone(old, side, stone_to) {
    if ((0, board_1.get_entity_from_coord)(old.board, stone_to)) { // if the square is already occupied
        throw new Error(`${side}が${(0, coordinate_1.displayCoord)(stone_to)}に碁石を置こうとしていますが、${(0, coordinate_1.displayCoord)(stone_to)}のマスは既に埋まっています`);
    }
    // まず置く
    (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, stone_to, { type: "碁", side });
    // 置いた後で、着手禁止かどうかを判断するために、
    //『囲まれている相手の駒/石を取る』→『囲まれている自分の駒/石を取る』をシミュレーションして、置いた位置の石が死んでいたら
    const black_and_white = old.board.map(row => row.map(sq => sq === null ? null : sq.side));
    const opponent_removed = (0, surround_1.remove_surrounded)((0, side_1.opponentOf)(side), black_and_white);
    const result = (0, surround_1.remove_surrounded)(side, opponent_removed);
    if ((0, board_1.get_entity_from_coord)(result, stone_to)) {
        return {
            phase: "stone_phase_played",
            board: old.board,
            hand_of_black: old.hand_of_black,
            hand_of_white: old.hand_of_white,
            by_whom: old.by_whom,
        };
    }
    else {
        throw new Error(`${side}が${(0, coordinate_1.displayCoord)(stone_to)}に碁石を置こうとしていますが、打った瞬間に取られてしまうのでここは着手禁止点です`);
    }
}
function one_turn(old, move) {
    const after_piece_phase = (0, piece_phase_1.play_piece_phase)(old, move.piece_phase);
    const after_stone_phase = move.stone_to ? place_stone(after_piece_phase, move.piece_phase.side, move.stone_to) : {
        phase: "stone_phase_played",
        board: after_piece_phase.board,
        hand_of_black: after_piece_phase.hand_of_black,
        hand_of_white: after_piece_phase.hand_of_white,
        by_whom: after_piece_phase.by_whom,
    };
    return (0, after_stone_phase_1.resolve_after_stone_phase)(after_stone_phase);
}
function main(moves) {
    if (moves.length === 0) {
        throw new Error("棋譜が空です");
    }
    return from_custom_state(moves, (0, exports.get_initial_state)(moves[0].piece_phase.side));
}
exports.main = main;
function from_custom_state(moves, initial_state) {
    let state = initial_state;
    for (const move of moves) {
        const next = one_turn(state, move);
        if (next.phase === "game_end") {
            return next;
        }
        state = next;
    }
    return state;
}
exports.from_custom_state = from_custom_state;


/***/ }),

/***/ "./node_modules/shogoss-core/dist/piece_phase.js":
/*!*******************************************************!*\
  !*** ./node_modules/shogoss-core/dist/piece_phase.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.can_move = exports.play_piece_phase = void 0;
const board_1 = __webpack_require__(/*! ./board */ "./node_modules/shogoss-core/dist/board.js");
const type_1 = __webpack_require__(/*! ./type */ "./node_modules/shogoss-core/dist/type.js");
const coordinate_1 = __webpack_require__(/*! ./coordinate */ "./node_modules/shogoss-core/dist/coordinate.js");
const side_1 = __webpack_require__(/*! ./side */ "./node_modules/shogoss-core/dist/side.js");
const can_see_1 = __webpack_require__(/*! ./can_see */ "./node_modules/shogoss-core/dist/can_see.js");
/** 駒を打つ。手駒から将棋駒を盤上に移動させる。行きどころの無い位置に桂馬と香車を打ったらエラー。
 *
 */
function parachute(old, o) {
    if ((0, board_1.get_entity_from_coord)(old.board, o.to)) {
        throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.to)}${o.prof}打とのことですが、${(0, coordinate_1.displayCoord)(o.to)}マスは既に埋まっています`);
    }
    if (o.prof === "桂") {
        if ((0, side_1.is_within_nth_furthest_rows)(2, o.side, o.to)) {
            throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.to)}${o.prof}打とのことですが、行きどころのない桂馬は打てません`);
        }
    }
    else if (o.prof === "香") {
        if ((0, side_1.is_within_nth_furthest_rows)(1, o.side, o.to)) {
            throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.to)}${o.prof}打とのことですが、行きどころのない香車は打てません`);
        }
    }
    const hand = old[o.side === "白" ? "hand_of_white" : "hand_of_black"];
    (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, o.to, { type: "しょ", side: o.side, prof: o.prof, can_kumal: false });
    const index = hand.findIndex(prof => prof === o.prof);
    hand.splice(index, 1);
    return {
        phase: "piece_phase_played",
        hand_of_black: old.hand_of_black,
        hand_of_white: old.hand_of_white,
        by_whom: old.who_goes_next,
        board: old.board
    };
}
function kumaling2(old, from, to) {
    const king = (0, board_1.get_entity_from_coord)(old.board, from);
    if (king?.type === "王") {
        if (king.never_moved) {
            const lance = (0, board_1.get_entity_from_coord)(old.board, to);
            if (!lance) {
                throw new Error(`キング王が${(0, coordinate_1.displayCoord)(from)}から${(0, coordinate_1.displayCoord)(to)}へ動くくまりんぐを${king.side}が試みていますが、${(0, coordinate_1.displayCoord)(to)}には駒がありません`);
            }
            else if (lance.type === "碁") {
                throw new Error(`キング王が${(0, coordinate_1.displayCoord)(from)}から${(0, coordinate_1.displayCoord)(to)}へ動くくまりんぐを${king.side}が試みていますが、${(0, coordinate_1.displayCoord)(to)}にあるのは香車ではなく碁石です`);
            }
            else if (lance.type !== "しょ" || lance.prof !== "香") {
                throw new Error(`キング王が${(0, coordinate_1.displayCoord)(from)}から${(0, coordinate_1.displayCoord)(to)}へ動くくまりんぐを${king.side}が試みていますが、${(0, coordinate_1.displayCoord)(from)}には香車ではない駒があります`);
            }
            if (lance.can_kumal) {
                (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, to, king);
                (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, from, lance);
                return {
                    phase: "piece_phase_played",
                    board: old.board,
                    hand_of_black: old.hand_of_black,
                    hand_of_white: old.hand_of_white,
                    by_whom: old.who_goes_next
                };
            }
            else {
                throw new Error(`キング王が${(0, coordinate_1.displayCoord)(from)}から${(0, coordinate_1.displayCoord)(to)}へ動くくまりんぐを${king.side}が試みていますが、この香車は打たれた香車なのでくまりんぐの対象外です`);
            }
        }
        else if (king.has_moved_only_once) {
            const diff = (0, side_1.coordDiffSeenFrom)(king.side, { to: to, from });
            if (diff.v === 0 && (diff.h === 2 || diff.h === -2) &&
                ((king.side === "黒" && from[1] === "八") || (king.side === "白" && from[1] === "二"))) {
                return castling(old, { from, to: to, side: king.side });
            }
            else {
                throw new Error(`${king.side}が${(0, coordinate_1.displayCoord)(to)}キとのことですが、そのような移動ができる${king.side}の${(0, type_1.professionFullName)("キ")}は盤上にありません`);
            }
        }
        else {
            throw new Error(`${king.side}が${(0, coordinate_1.displayCoord)(to)}キとのことですが、そのような移動ができる${king.side}の${(0, type_1.professionFullName)("キ")}は盤上にありません`);
        }
    }
    else {
        throw new Error(`function \`kumaling2()\` called on a non-king piece`);
    }
}
/**
 * Resolved な状態に駒フェイズを適用。省略された情報を復元しながら適用しなきゃいけないので、かなりしんどい。
 * @param old 呼び出し後に破壊されている可能性があるので、後で使いたいならディープコピーしておくこと。
 * @param o
 */
function play_piece_phase(old, o) {
    // The thing is that we have to infer which piece has moved, since the usual notation does not signify
    // where the piece comes from.
    // 面倒なのは、具体的にどの駒が動いたのかを、棋譜の情報から復元してやらないといけないという点である（普通始点は書かないので）。
    // first, use the `side` field and the `prof` field to list up the possible points of origin 
    // (note that "in hand" is a possibility).
    const possible_points_of_origin = (0, board_1.lookup_coords_from_side_and_prof)(old.board, o.side, o.prof);
    const hand = old[o.side === "白" ? "hand_of_white" : "hand_of_black"];
    const exists_in_hand = hand.some(prof => prof === o.prof);
    if (typeof o.from === "string") {
        if (o.from === "打") {
            if (exists_in_hand) {
                if ((0, type_1.isUnpromotedShogiProfession)(o.prof)) {
                    return parachute(old, { side: o.side, prof: o.prof, to: o.to });
                }
                else {
                    // UnpromotedShogiProfession 以外は手駒に入っているはずがないので、
                    // exists_in_hand が満たされている時点で UnpromotedShogiProfession であることは既に確定している
                    throw new Error("should not reach here");
                }
            }
            else {
                throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.to)}${o.prof}打とのことですが、${o.side}の手駒に${(0, type_1.professionFullName)(o.prof)}はありません`);
            }
        }
        else if (o.from === "右") {
            const pruned = possible_points_of_origin.filter(from => can_move(old.board, { from, to: o.to }));
            if (pruned.length === 0) {
                throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.to)}${o.prof}右とのことですが、そのような移動ができる${o.side}の${(0, type_1.professionFullName)(o.prof)}は盤上にありません`);
            }
            const rightmost = (0, side_1.RightmostWhenSeenFrom)(o.side, pruned);
            if (rightmost.length === 1) {
                return move_piece(old, { from: rightmost[0], to: o.to, side: o.side, promote: o.promotes ?? null });
            }
            else {
                throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.to)}${o.prof}とのことですが、そのような移動ができる${o.side}の${(0, type_1.professionFullName)(o.prof)}が盤上に複数あります`);
            }
        }
        else if (o.from === "左") {
            const pruned = possible_points_of_origin.filter(from => can_move(old.board, { from, to: o.to }));
            if (pruned.length === 0) {
                throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.to)}${o.prof}左とのことですが、そのような移動ができる${o.side}の${(0, type_1.professionFullName)(o.prof)}は盤上にありません`);
            }
            const leftmost = (0, side_1.LeftmostWhenSeenFrom)(o.side, pruned);
            if (leftmost.length === 1) {
                return move_piece(old, { from: leftmost[0], to: o.to, side: o.side, promote: o.promotes ?? null });
            }
            else {
                throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.to)}${o.prof}とのことですが、そのような移動ができる${o.side}の${(0, type_1.professionFullName)(o.prof)}が盤上に複数あります`);
            }
        }
        else {
            throw new Error("「打」「右」「左」「成」「不成」以外の接尾辞は未実装です。７六金（７五）などと書いて下さい。");
        }
    }
    else if (typeof o.from === "undefined") {
        // 駒がどこから来たかが分からない。
        // このようなときには、
        // ・打つしかないなら打つ
        // ・そうでなくて、目的地に行ける駒が盤上に 1 種類しかないなら、それをする
        // という解決をすることになる。
        //
        // しかし、このゲームにおいて、二ポは「着手できない手」ではなくて、「着手した後に、石フェイズ解消後にもそれが残ってしまっていたら、反則負け」となるものである。
        // この前提のもとで、ポが横並びしているときに、片方のポの前にある駒を取ろうとしている状況を考えてほしい。
        // すると、常識的にはそんなあからさまな二ポは指さないので、1マス前進して取るのが当たり前であり、
        // それを棋譜に起こすときにわざわざ「直」を付けるなどバカバカしい。
        // よって、出発点推論においては、最初は二ポは排除して推論することとする。
        // We have no info on where the piece came from.
        // In such cases, the rational way of inference is
        // * Parachute a piece if you have to.
        // * Otherwise, if there is only one piece on board that can go to the specified destination, take that move.
        // 
        // However, in this game, doubled pawns are not an impossible move, but rather a move that cause you to lose if it remained even after the removal-by-go.
        // Under such an assumption, consider the situation where there are two pawns next to each other and there is an enemy piece right in front of one of it.
        // In such a case, it is very easy to see that taking the piece diagonally results in doubled pawns.
        // Hence, when writing that move down, you don't want to explicitly annotate such a case with 直.
        // Therefore, when inferring the point of origin, I first ignore the doubled pawns.
        const pruned = possible_points_of_origin.filter(from => can_move_and_not_cause_doubled_pawns(old.board, { from, to: o.to }));
        if (pruned.length === 0) {
            if (o.prof === "キ") {
                // キャスリングおよびくまりんぐはキング王の動きとして書く。
                // 常にキングが通常動けない範囲への移動となる。
                return kumaling2(old, possible_points_of_origin[0], o.to);
            }
            else if (exists_in_hand) {
                if ((0, type_1.isUnpromotedShogiProfession)(o.prof)) {
                    return parachute(old, { side: o.side, prof: o.prof, to: o.to });
                }
                else {
                    // UnpromotedShogiProfession 以外は手駒に入っているはずがないので、
                    // exists_in_hand が満たされている時点で UnpromotedShogiProfession であることは既に確定している
                    throw new Error("should not reach here");
                }
            }
            else {
                const pruned_allowing_doubled_pawns = possible_points_of_origin.filter(from => can_move(old.board, { from, to: o.to }));
                if (pruned_allowing_doubled_pawns.length === 0) {
                    throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.to)}${o.prof}とのことですが、そのような移動ができる${o.side}の${(0, type_1.professionFullName)(o.prof)}は盤上にありません`);
                }
                else if (pruned_allowing_doubled_pawns.length === 1) {
                    const from = pruned_allowing_doubled_pawns[0];
                    return move_piece(old, { from, to: o.to, side: o.side, promote: o.promotes ?? null });
                }
                else {
                    throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.to)}${o.prof}とのことですが、そのような移動ができる${o.side}の${(0, type_1.professionFullName)(o.prof)}が盤上に複数あり、しかもどれを指しても二ポです`);
                }
            }
        }
        else if (pruned.length === 1) {
            const from = pruned[0];
            return move_piece(old, { from, to: o.to, side: o.side, promote: o.promotes ?? null });
        }
        else {
            throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.to)}${o.prof}とのことですが、そのような移動ができる${o.side}の${(0, type_1.professionFullName)(o.prof)}が盤上に複数あり、どれを採用するべきか分かりません`);
        }
    }
    else {
        const from = o.from;
        if (!possible_points_of_origin.some(c => (0, coordinate_1.coordEq)(c, from))) {
            throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(from)}から${(0, coordinate_1.displayCoord)(o.to)}へと${(0, type_1.professionFullName)(o.prof)}を動かそうとしていますが、${(0, coordinate_1.displayCoord)(from)}には${o.side}の${(0, type_1.professionFullName)(o.prof)}はありません`);
        }
        if (can_move(old.board, { from, to: o.to })) {
            return move_piece(old, { from, to: o.to, side: o.side, promote: o.promotes ?? null });
        }
        else if (o.prof === "キ") {
            // キャスリングおよびくまりんぐはキング王の動きとして書く。
            // 常にキングが通常動けない範囲への移動となる。
            return kumaling2(old, from, o.to);
        }
        else {
            throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(from)}から${(0, coordinate_1.displayCoord)(o.to)}へと${(0, type_1.professionFullName)(o.prof)}を動かそうとしていますが、${(0, type_1.professionFullName)(o.prof)}は${(0, coordinate_1.displayCoord)(from)}から${(0, coordinate_1.displayCoord)(o.to)}へ動ける駒ではありません`);
        }
    }
}
exports.play_piece_phase = play_piece_phase;
/** `o.side` が駒を `o.from` から `o.to` に動かす。その駒が `o.from` から `o.to` へと can_move であることを要求する。キャスリング・くまりんぐは扱わないが、アンパッサンは扱う。
 */
function move_piece(old, o) {
    const piece_that_moves = (0, board_1.get_entity_from_coord)(old.board, o.from);
    if (!piece_that_moves) {
        throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}への移動を試みていますが、${(0, coordinate_1.displayCoord)(o.from)}には駒がありません`);
    }
    else if (piece_that_moves.type === "碁") {
        throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}への移動を試みていますが、${(0, coordinate_1.displayCoord)(o.from)}にあるのは碁石であり、駒ではありません`);
    }
    else if (piece_that_moves.side !== o.side) {
        throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}への移動を試みていますが、${(0, coordinate_1.displayCoord)(o.from)}にあるのは${(0, side_1.opponentOf)(o.side)}の駒です`);
    }
    const res = can_move(old.board, { from: o.from, to: o.to });
    if (res === "en passant") {
        /**
         *          from[0] to[0]
         *         |  ..  |  ..  |
         * to[1]   |  ..  |  to  |
         * from[1] | from | pawn |
         */
        const coord_horizontally_adjacent = [o.to[0], o.from[1]];
        (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, o.to, piece_that_moves);
        (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, o.from, null);
        (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, coord_horizontally_adjacent, null);
        return {
            phase: "piece_phase_played",
            board: old.board,
            hand_of_black: old.hand_of_black,
            hand_of_white: old.hand_of_white,
            by_whom: old.who_goes_next
        };
    }
    else if (!res) {
        throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}への移動を試みていますが、駒の動き上そのような移動はできません`);
    }
    if ((0, type_1.is_promotable)(piece_that_moves.prof)
        && ((0, side_1.is_within_nth_furthest_rows)(3, o.side, o.from) || (0, side_1.is_within_nth_furthest_rows)(3, o.side, o.to))) {
        if (o.promote) {
            if (piece_that_moves.prof === "桂") {
                piece_that_moves.prof = "成桂";
            }
            else if (piece_that_moves.prof === "銀") {
                piece_that_moves.prof = "成銀";
            }
            else if (piece_that_moves.prof === "香") {
                piece_that_moves.prof = "成香";
            }
            else if (piece_that_moves.prof === "キ") {
                piece_that_moves.prof = "超";
            }
            else if (piece_that_moves.prof === "ポ") {
                piece_that_moves.prof = "と";
            }
        }
        else {
            if ((piece_that_moves.prof === "桂" && (0, side_1.is_within_nth_furthest_rows)(2, o.side, o.to))
                || (piece_that_moves.prof === "香" && (0, side_1.is_within_nth_furthest_rows)(1, o.side, o.to))) {
                throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.to)}${piece_that_moves.prof}不成とのことですが、${(0, type_1.professionFullName)(piece_that_moves.prof)}を不成で行きどころのないところに行かせることはできません`);
            }
        }
    }
    else {
        if (o.promote !== null) {
            throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.to)}${piece_that_moves.prof}${o.promote ? "成" : "不成"}とのことですが、この移動は成りを発生させないので「${o.promote ? "成" : "不成"}」表記はできません`);
        }
    }
    const occupier = (0, board_1.get_entity_from_coord)(old.board, o.to);
    if (!occupier) {
        if (piece_that_moves.prof === "ポ" && piece_that_moves.never_moved && o.to[1] === "五") {
            piece_that_moves.subject_to_en_passant = true;
        }
        (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, o.to, piece_that_moves);
        (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, o.from, null);
        return {
            phase: "piece_phase_played",
            board: old.board,
            hand_of_black: old.hand_of_black,
            hand_of_white: old.hand_of_white,
            by_whom: old.who_goes_next
        };
    }
    else if (occupier.type === "碁") {
        if (occupier.side === o.side) {
            throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}への移動を試みていますが、${(0, coordinate_1.displayCoord)(o.to)}に自分の碁石があるので、移動できません`);
        }
        else {
            (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, o.to, piece_that_moves);
            (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, o.from, null);
            return {
                phase: "piece_phase_played",
                board: old.board,
                hand_of_black: old.hand_of_black,
                hand_of_white: old.hand_of_white,
                by_whom: old.who_goes_next
            };
        }
    }
    else {
        if (occupier.side === o.side) {
            throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}への移動を試みていますが、${(0, coordinate_1.displayCoord)(o.to)}に自分の駒があるので、移動できません`);
        }
        else if (occupier.type === "しょ") {
            (o.side === "白" ? old.hand_of_white : old.hand_of_black).push((0, type_1.unpromote)(occupier.prof));
            (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, o.to, piece_that_moves);
            (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, o.from, null);
            return {
                phase: "piece_phase_played",
                board: old.board,
                hand_of_black: old.hand_of_black,
                hand_of_white: old.hand_of_white,
                by_whom: old.who_goes_next
            };
        }
        else {
            (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, o.to, piece_that_moves);
            (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, o.from, null);
            return {
                phase: "piece_phase_played",
                board: old.board,
                hand_of_black: old.hand_of_black,
                hand_of_white: old.hand_of_white,
                by_whom: old.who_goes_next
            };
        }
    }
}
/**
 * `o.from` に駒があってその駒が `o.to` へと動く余地があるかどうかを返す。`o.to` が味方の駒で埋まっていたら false だし、ポーンの斜め前に敵駒がないなら斜め前は false となる。
 *  Checks whether there is a piece at `o.from` which can move to `o.to`. When `o.to` is occupied by an ally, this function returns false,
 *  and when there is no enemy piece diagonal to pawn, this function returns false for the diagonal direction.
 * @param board
 * @param o
 * @returns
 */
function can_move(board, o) {
    const p = (0, board_1.get_entity_from_coord)(board, o.from);
    if (!p) {
        return false;
    }
    if (p.type === "碁") {
        return false;
    }
    const piece_at_destination = (0, board_1.get_entity_from_coord)(board, o.to);
    if (piece_at_destination?.side === p.side) {
        return false;
    }
    if (p.prof !== "ポ") {
        return (0, can_see_1.can_see)(board, o);
    }
    const delta = (0, side_1.coordDiffSeenFrom)(p.side, o);
    // can always move forward
    if (delta.v === 1 && delta.h === 0) {
        return true;
    }
    // can take diagonally, as long as an opponent's piece is located there, or when it is an en passant
    if (delta.v === 1 && (delta.h === 1 || delta.h === -1)) {
        if (piece_at_destination?.side === (0, side_1.opponentOf)(p.side)) {
            return true;
        }
        else {
            const coord_horizontally_adjacent = (0, side_1.applyDeltaSeenFrom)(p.side, o.from, { v: 0, h: delta.h });
            const piece_horizontally_adjacent = (0, board_1.get_entity_from_coord)(board, coord_horizontally_adjacent);
            if (o.from[1] === "五"
                && piece_horizontally_adjacent?.type === "ス"
                && piece_horizontally_adjacent.prof === "ポ"
                && piece_horizontally_adjacent.subject_to_en_passant) {
                return "en passant";
            }
            else {
                return false;
            }
        }
    }
    if (p.never_moved && delta.v === 2 && delta.h === 0) {
        // can move two in the front, unless blocked
        const coord_in_front = (0, side_1.applyDeltaSeenFrom)(p.side, o.from, { v: 1, h: 0 });
        const coord_two_in_front = (0, side_1.applyDeltaSeenFrom)(p.side, o.from, { v: 2, h: 0 });
        if ((0, board_1.get_entity_from_coord)(board, coord_in_front)
            || (0, board_1.get_entity_from_coord)(board, coord_two_in_front)) {
            return false;
        }
        return true;
    }
    else {
        return false;
    }
}
exports.can_move = can_move;
function can_move_and_not_cause_doubled_pawns(board, o) {
    if (!can_move(board, o)) {
        return false;
    }
    const piece = (0, board_1.get_entity_from_coord)(board, o.from);
    if (piece?.type === "ス" && piece.prof === "ポ") {
        if (o.from[0] === o.to[0]) { // no risk of doubled pawns when the pawn moves straight
            return true;
        }
        else {
            const pawn_coords = (0, board_1.lookup_coords_from_side_and_prof)(board, piece.side, "ポ");
            const problematic_pawns = pawn_coords.filter(([col, _row]) => col === o.to[0]);
            // if there are no problematic pawns, return true
            // if there are, we want to avoid such a move in this function, so false
            return problematic_pawns.length === 0;
        }
    }
    else {
        return true;
    }
}
function castling(old, o) {
    // 検査済：
    // ① キング王が1回だけ前進した状態で
    //-----------------------------------
    // これから検査：
    // ② キャスリング対象のルーク（以下A）は一度も動いておらず
    // ③ 相手からの王手（チェック）が掛かっておらず移動先のマスと通過点のマスにも敵の駒の利きはなく
    // ④ キング王とAの間に駒（チェス、将棋）が無い場合に使用できる
    const from_column_index = "９８７６５４３２１".indexOf(o.from[0]);
    const to_column_index = "９８７６５４３２１".indexOf(o.to[0]);
    const rook_coord = [from_column_index < to_column_index ? "１" : "９", o.from[1]];
    const rook = (0, board_1.get_entity_from_coord)(old.board, rook_coord);
    const coord_that_king_passes_through = ["９８７６５４３２１"[(from_column_index + to_column_index) / 2], o.from[1]];
    if (rook?.type !== "ス" || rook.prof !== "ル") {
        throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へとキング王をキャスリングしようとしていますが、${(0, coordinate_1.displayCoord)(rook_coord)}にルークがないのでキャスリングできません`);
    }
    if (!rook.never_moved) {
        throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へとキング王をキャスリングしようとしていますが、${(0, coordinate_1.displayCoord)(rook_coord)}にあるルークは既に動いたことがあるルークなのでキャスリングできません`);
    }
    if ((0, can_see_1.do_any_of_my_pieces_see)(old.board, o.from, (0, side_1.opponentOf)(o.side))) {
        throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へとキング王をキャスリングしようとしていますが、相手からの王手（チェック）が掛かっているのでキャスリングできません`);
    }
    if ((0, can_see_1.do_any_of_my_pieces_see)(old.board, coord_that_king_passes_through, (0, side_1.opponentOf)(o.side))) {
        throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へとキング王をキャスリングしようとしていますが、通過点のマスに敵の駒の利きがあるのでキャスリングできません`);
    }
    if ((0, can_see_1.do_any_of_my_pieces_see)(old.board, o.to, (0, side_1.opponentOf)(o.side))) {
        throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へとキング王をキャスリングしようとしていますが、移動先のマスに敵の駒の利きがあるのでキャスリングできません`);
    }
    const coords_between_king_and_rook = (0, coordinate_1.columnsBetween)(o.from[0], o.to[0]).map(col => [col, o.from[1]]);
    const has_shogi_or_chess_piece = coords_between_king_and_rook.some(coord => {
        const entity = (0, board_1.get_entity_from_coord)(old.board, coord);
        return entity?.type === "しょ" || entity?.type === "ス" || entity?.type === "碁";
    });
    if (has_shogi_or_chess_piece) {
        throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へとキング王をキャスリングしようとしていますが、キング王とルークの間に駒があるのでキャスリングできません`);
    }
    // ⑤ 間に碁石があれば取り除き
    coords_between_king_and_rook.forEach(coord => (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, coord, null));
    // ⑥ キング王は A の方向に 2 マス移動し
    (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, o.to, {
        prof: "キ",
        side: o.side,
        type: "王",
        has_moved_only_once: false,
        never_moved: false,
    });
    (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, o.from, null);
    // ⑦ A はキング王を飛び越した隣のマスに移動する
    (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, coord_that_king_passes_through, rook);
    (0, board_1.put_entity_at_coord_and_also_adjust_flags)(old.board, rook_coord, null);
    return {
        phase: "piece_phase_played",
        board: old.board,
        hand_of_black: old.hand_of_black,
        hand_of_white: old.hand_of_white,
        by_whom: old.who_goes_next
    };
}


/***/ }),

/***/ "./node_modules/shogoss-core/dist/side.js":
/*!************************************************!*\
  !*** ./node_modules/shogoss-core/dist/side.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.applyDeltaSeenFrom = exports.is_within_nth_furthest_rows = exports.coordDiffSeenFrom = exports.LeftmostWhenSeenFrom = exports.RightmostWhenSeenFrom = exports.opponentOf = void 0;
const coordinate_1 = __webpack_require__(/*! ./coordinate */ "./node_modules/shogoss-core/dist/coordinate.js");
function opponentOf(side) {
    if (side === "黒")
        return "白";
    else
        return "黒";
}
exports.opponentOf = opponentOf;
function RightmostWhenSeenFrom(side, coords) {
    if (side === "黒") {
        return (0, coordinate_1.RightmostWhenSeenFromBlack)(coords);
    }
    else {
        return (0, coordinate_1.LeftmostWhenSeenFromBlack)(coords);
    }
}
exports.RightmostWhenSeenFrom = RightmostWhenSeenFrom;
function LeftmostWhenSeenFrom(side, coords) {
    if (side === "黒") {
        return (0, coordinate_1.LeftmostWhenSeenFromBlack)(coords);
    }
    else {
        return (0, coordinate_1.RightmostWhenSeenFromBlack)(coords);
    }
}
exports.LeftmostWhenSeenFrom = LeftmostWhenSeenFrom;
/** vertical が +1 = 前進　　horizontal が +1 = 左
 */
function coordDiffSeenFrom(side, o) {
    if (side === "白") {
        return (0, coordinate_1.coordDiff)(o);
    }
    else {
        const { h, v } = (0, coordinate_1.coordDiff)(o);
        return { h: -h, v: -v };
    }
}
exports.coordDiffSeenFrom = coordDiffSeenFrom;
function is_within_nth_furthest_rows(n, side, coord) {
    const row = coord[1];
    if (side === "黒") {
        return "一二三四五六七八九".indexOf(row) < n;
    }
    else {
        return "九八七六五四三二一".indexOf(row) < n;
    }
}
exports.is_within_nth_furthest_rows = is_within_nth_furthest_rows;
// since this function is only used to interpolate between two valid points, there is no need to perform and out-of-bounds check.
function applyDeltaSeenFrom(side, from, delta) {
    if (side === "白") {
        const [from_column, from_row] = from;
        const from_row_index = "一二三四五六七八九".indexOf(from_row);
        const from_column_index = "９８７６５４３２１".indexOf(from_column);
        const to_column_index = from_column_index + delta.h;
        const to_row_index = from_row_index + delta.v;
        const columns = ["９", "８", "７", "６", "５", "４", "３", "２", "１"];
        const rows = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
        return [columns[to_column_index], rows[to_row_index]];
    }
    else {
        const [from_column, from_row] = from;
        const from_row_index = "一二三四五六七八九".indexOf(from_row);
        const from_column_index = "９８７６５４３２１".indexOf(from_column);
        const to_column_index = from_column_index - delta.h;
        const to_row_index = from_row_index - delta.v;
        const columns = ["９", "８", "７", "６", "５", "４", "３", "２", "１"];
        const rows = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
        return [columns[to_column_index], rows[to_row_index]];
    }
}
exports.applyDeltaSeenFrom = applyDeltaSeenFrom;


/***/ }),

/***/ "./node_modules/shogoss-core/dist/surround.js":
/*!****************************************************!*\
  !*** ./node_modules/shogoss-core/dist/surround.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.remove_surrounded = void 0;
function remove_surrounded(color_to_be_removed, board) {
    const board_ = board.map(row => row.map(side => side === null ? "empty" : { side, visited: false, connected_component_index: -1 }));
    // Depth-first search to assign a unique index to each connected component
    // 各連結成分に一意なインデックスをふるための深さ優先探索
    const dfs_stack = [];
    const indices_that_survive = [];
    let index = 0;
    for (let I = 0; I < board_.length; I++) {
        for (let J = 0; J < board_[I].length; J++) {
            const sq = board_[I][J];
            if (sq !== "empty" && sq.side === color_to_be_removed && !sq.visited) {
                dfs_stack.push({ i: I, j: J });
            }
            while (dfs_stack.length > 0) {
                const vertex_coord = dfs_stack.pop();
                const vertex = board_[vertex_coord.i][vertex_coord.j];
                if (vertex === "empty") {
                    // `dfs_stack` に空のマスはプッシュされていないはず
                    // an empty square should not be pushed to `dfs_stack`
                    throw new Error("should not reach here");
                }
                vertex.visited = true;
                vertex.connected_component_index = index;
                [
                    { i: vertex_coord.i, j: vertex_coord.j + 1 },
                    { i: vertex_coord.i, j: vertex_coord.j - 1 },
                    { i: vertex_coord.i + 1, j: vertex_coord.j },
                    { i: vertex_coord.i - 1, j: vertex_coord.j },
                ].filter(({ i, j }) => { const row = board_[i]; return row && 0 <= j && j < row.length; }).forEach(({ i, j }) => {
                    const neighbor = board_[i][j];
                    if (neighbor === "empty") {
                        // next to an empty square (a liberty); survives.
                        // 呼吸点が隣接しているので、この index が振られている連結成分は丸々生き延びる
                        indices_that_survive.push(index);
                    }
                    else if (neighbor.side === color_to_be_removed && !neighbor.visited) {
                        dfs_stack.push({ i, j });
                    }
                });
            }
            index++;
        }
    }
    // indices_that_survive に記載のない index のやつらを削除して ans へと転記
    // Copy the content to `ans` while deleting the connected components whose index is not in `indices_that_survive`
    const ans = [];
    for (let I = 0; I < board_.length; I++) {
        const row = [];
        for (let J = 0; J < board_[I].length; J++) {
            const sq = board_[I][J];
            if (sq === "empty") {
                row.push(null);
            }
            else if (sq.side === color_to_be_removed
                && !indices_that_survive.includes(sq.connected_component_index)) {
                // does not survive
                row.push(null);
            }
            else {
                row.push(sq.side);
            }
        }
        ans.push(row);
    }
    return ans;
}
exports.remove_surrounded = remove_surrounded;


/***/ }),

/***/ "./node_modules/shogoss-core/dist/type.js":
/*!************************************************!*\
  !*** ./node_modules/shogoss-core/dist/type.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.is_promotable = exports.isUnpromotedShogiProfession = exports.professionFullName = exports.unpromote = void 0;
function unpromote(a) {
    if (a === "成桂")
        return "桂";
    if (a === "成銀")
        return "銀";
    if (a === "成香")
        return "香";
    return a;
}
exports.unpromote = unpromote;
function professionFullName(a) {
    if (a === "と") {
        return "とクィーン";
    }
    else if (a === "キ") {
        return "キング王";
    }
    else if (a === "ク") {
        return "クィーン";
    }
    else if (a === "ナ") {
        return "ナイト";
    }
    else if (a === "ビ") {
        return "ビショップ";
    }
    else if (a === "ポ") {
        return "ポーン兵";
    }
    else if (a === "ル") {
        return "ルーク";
    }
    else if (a === "超") {
        return "スーパーキング王";
    }
    else if (a === "桂") {
        return "桂馬";
    }
    else if (a === "香") {
        return "香車";
    }
    else if (a === "銀") {
        return "銀将";
    }
    else if (a === "金") {
        return "金将";
    }
    else {
        return a;
    }
}
exports.professionFullName = professionFullName;
function isUnpromotedShogiProfession(a) {
    return a === "香" ||
        a === "桂" ||
        a === "銀" ||
        a === "金";
}
exports.isUnpromotedShogiProfession = isUnpromotedShogiProfession;
function is_promotable(prof) {
    return prof === "桂" || prof === "銀" || prof === "香" || prof === "キ" || prof === "ポ";
}
exports.is_promotable = is_promotable;


/***/ }),

/***/ "./node_modules/shogoss-parser/dist/index.js":
/*!***************************************************!*\
  !*** ./node_modules/shogoss-parser/dist/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parse = exports.parse_one = exports.parse_profession = exports.parse_coord = void 0;
function parse_coord(s) {
    const column = ((c) => {
        if (c === "１" || c === "1") {
            return "１";
        }
        else if (c === "２" || c === "2") {
            return "２";
        }
        else if (c === "３" || c === "3") {
            return "３";
        }
        else if (c === "４" || c === "4") {
            return "４";
        }
        else if (c === "５" || c === "5") {
            return "５";
        }
        else if (c === "６" || c === "6") {
            return "６";
        }
        else if (c === "７" || c === "7") {
            return "７";
        }
        else if (c === "８" || c === "8") {
            return "８";
        }
        else if (c === "９" || c === "9") {
            return "９";
        }
        else {
            throw new Error(`棋譜の筋（列）が「${c}」であり「１〜９」「1〜9」のどれでもありません`);
        }
    })(s[0]);
    const row = ((c) => {
        if (c === "１" || c === "1" || c === "一") {
            return "一";
        }
        else if (c === "２" || c === "2" || c === "二") {
            return "二";
        }
        else if (c === "３" || c === "3" || c === "三") {
            return "三";
        }
        else if (c === "４" || c === "4" || c === "四") {
            return "四";
        }
        else if (c === "５" || c === "5" || c === "五") {
            return "五";
        }
        else if (c === "６" || c === "6" || c === "六") {
            return "六";
        }
        else if (c === "７" || c === "7" || c === "七") {
            return "七";
        }
        else if (c === "８" || c === "8" || c === "八") {
            return "八";
        }
        else if (c === "９" || c === "9" || c === "九") {
            return "九";
        }
        else {
            throw new Error(`棋譜の段（行）が「${c}」であり「１〜９」「1〜9」「一〜九」のどれでもありません`);
        }
    })(s[1]);
    return [column, row];
}
exports.parse_coord = parse_coord;
function parse_profession(s) {
    if (s === "香")
        return "香";
    else if (s === "桂")
        return "桂";
    else if (s === "銀")
        return "銀";
    else if (s === "金")
        return "金";
    else if (s === "成香" || s === "杏")
        return "成香";
    else if (s === "成桂" || s === "圭")
        return "成桂";
    else if (s === "成銀" || s === "全")
        return "成銀";
    else if (s === "ク")
        return "ク";
    else if (s === "ル")
        return "ル";
    else if (s === "ナ")
        return "ナ";
    else if (s === "ビ")
        return "ビ";
    else if (s === "ポ" || s === "歩" || s === "兵")
        return "ポ";
    else if (s === "と")
        return "と";
    else if (s === "キ" || s === "王")
        return "キ";
    else if (s === "超")
        return "超";
    else {
        throw new Error(`駒の種類が「${s}」であり「香」「桂」「銀」「金」「成香」「成桂」「成銀」「杏」「圭」「全」「ク」「ル」「ナ」「ビ」「ポ」「歩」「兵」「と」「キ」「王」「超」のどれでもありません`);
    }
}
exports.parse_profession = parse_profession;
function parse_one(s) {
    // 0:   ▲
    // 1-2: ７五
    // 3: ポ
    // (3-4 if promoted)
    let index = 0;
    const side = s[0] === "黒" || s[0] === "▲" || s[0] === "☗" ? "黒" :
        s[0] === "白" || s[0] === "△" || s[0] === "☖" ? "白" : (() => { throw new Error("棋譜が「黒」「▲」「☗」「白」「△」「☖」のどれかで始まっていません"); })();
    index++;
    const to = parse_coord(s.slice(index, index + 2));
    index += 2;
    const profession_length = s[3] === "成" ? 2 : 1;
    const prof = parse_profession(s.slice(index, index + profession_length));
    index += profession_length;
    // All that follows are optional.
    // 以降はオプショナル。「1. 移動元明記」「2. 成・不成」「3. 碁石の座標」がこの順番で現れなければならない。
    // 1. 移動元明記
    // 「右」「左」「打」、または「（4五）」など
    const from = (() => {
        if (s[index] === "右") {
            index++;
            return "右";
        }
        else if (s[index] === "左") {
            index++;
            return "左";
        }
        else if (s[index] === "打") {
            index++;
            return "打";
        }
        else if (s[index] === "(" || s[index] === "（") {
            index++;
            const coord = parse_coord(s.slice(index, index + 2));
            index += 2;
            if (s[index] === ")" || s[index] === "）") {
                index++;
                return coord;
            }
            else {
                throw new Error(`開きカッコと座標の後に閉じカッコがありません`);
            }
        }
        else {
            return null;
        }
    })();
    const promotes = (() => {
        if (s[index] === "成") {
            index++;
            return true;
        }
        else if (s.slice(index, index + 2) === "不成") {
            index += 2;
            return false;
        }
        else
            return null;
    })();
    const stone_to = (() => {
        const c = s[index];
        if (!c)
            return null;
        if (("1" <= c && c <= "9") || ("１" <= c && c <= "９")) {
            const coord = parse_coord(s.slice(index, index + 2));
            index += 2;
            if (!s[index]) {
                return coord;
            }
            else {
                throw new Error(`手「${s}」の末尾に解釈不能な「${s.slice(index)}」があります`);
            }
        }
        else {
            throw new Error(`手「${s}」の末尾に解釈不能な「${s.slice(index)}」があります`);
        }
    })();
    const piece_phase = promotes !== null ? (from ? { side, to, prof, promotes, from } : { side, to, prof, promotes })
        : (from ? { side, to, prof, from } : { side, to, prof });
    return stone_to ? { piece_phase, stone_to } : { piece_phase };
}
exports.parse_one = parse_one;
function parse(s) {
    s = s.replace(/([黒▲☗白△☖])/g, " $1");
    const moves = s.split(/\s/);
    return moves.map(s => s.trim()).filter(s => s !== "").map(parse_one);
}
exports.parse = parse;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const shogoss_core_1 = __webpack_require__(/*! shogoss-core */ "./node_modules/shogoss-core/dist/index.js");
const shogoss_parser_1 = __webpack_require__(/*! shogoss-parser */ "./node_modules/shogoss-parser/dist/index.js");
window.addEventListener("load", () => {
    render((0, shogoss_core_1.get_initial_state)("黒"));
    document.getElementById("load_history").addEventListener("click", load_history);
});
function load_history() {
    const text = document.getElementById("history").value;
    const moves = (0, shogoss_parser_1.parse)(text);
    try {
        const state = (0, shogoss_core_1.main)(moves);
        if (state.phase === "game_end") {
            alert(`勝者: ${state.victor}、理由: ${state.reason}`);
            render(state.final_situation);
        }
        else {
            render(state);
        }
    }
    catch (e) {
        alert(e);
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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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MUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCx3Q0FBd0MsY0FBYztBQUN4RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLE9BQU87QUFDM0Isd0JBQXdCLE9BQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyx3Q0FBd0MsZUFBZSxZQUFZLElBQUksT0FBTyxhQUFhLEdBQUcsSUFBSSxJQUFJO0FBQ3hJO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxnQkFBZ0IsSUFBSSxXQUFXLElBQUksS0FBSztBQUN4RixLQUFLO0FBQ0w7QUFDQSxnREFBZ0QsaUJBQWlCLElBQUksWUFBWSxJQUFJLEtBQUs7QUFDMUYsS0FBSztBQUNMO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvYWZ0ZXJfc3RvbmVfcGhhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Nob2dvc3MtY29yZS9kaXN0L2JvYXJkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC9jYW5fc2VlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC9jb29yZGluYXRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvcGllY2VfcGhhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Nob2dvc3MtY29yZS9kaXN0L3NpZGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Nob2dvc3MtY29yZS9kaXN0L3N1cnJvdW5kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC90eXBlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLXBhcnNlci9kaXN0L2luZGV4LmpzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5yZXNvbHZlX2FmdGVyX3N0b25lX3BoYXNlID0gdm9pZCAwO1xyXG5jb25zdCBib2FyZF8xID0gcmVxdWlyZShcIi4vYm9hcmRcIik7XHJcbmNvbnN0IHNpZGVfMSA9IHJlcXVpcmUoXCIuL3NpZGVcIik7XHJcbmNvbnN0IHN1cnJvdW5kXzEgPSByZXF1aXJlKFwiLi9zdXJyb3VuZFwiKTtcclxuY29uc3QgdHlwZV8xID0gcmVxdWlyZShcIi4vdHlwZVwiKTtcclxuLyoqIOefs+ODleOCp+OCpOOCuuOBjOe1guS6huOBl+OBn+W+jOOAgeWLneaVl+WIpOWumuOBqOWbsueigeaknOafu+OCkuOBmeOCi+OAgiAvIFRvIGJlIGNhbGxlZCBhZnRlciBhIHN0b25lIGlzIHBsYWNlZDogY2hlY2tzIHRoZSB2aWN0b3J5IGNvbmRpdGlvbiBhbmQgdGhlIGdhbWUtb2YtZ28gY29uZGl0aW9uLlxyXG4gKiDjgb7jgZ/jgIHnm7jmiYvjga7jg53lhbXjgavjgqLjg7Pjg5Hjg4PjgrXjg7Pjg5Xjg6njgrDjgYzjgaTjgYTjgabjgYTjgZ/jgonjgIHjgZ3jgozjgpLlj5bjgorpmaTjgY/vvIjoh6rliIbjgYzmiYvjgpLmjIfjgZfjgZ/jgZPjgajjgavjgojjgaPjgabjgIHjgqLjg7Pjg5Hjg4PjgrXjg7Pjga7mqKnliKnjgYzlpLHjgo/jgozjgZ/jga7jgafvvIlcclxuICogQWxzbywgaWYgdGhlIG9wcG9uZW50J3MgcGF3biBoYXMgYW4gZW4gcGFzc2FudCBmbGFnLCBkZWxldGUgaXQgKHNpbmNlLCBieSBwbGF5aW5nIGEgcGllY2UgdW5yZWxhdGVkIHRvIGVuIHBhc3NhbnQsIHlvdSBoYXZlIGxvc3QgdGhlIHJpZ2h0IHRvIGNhcHR1cmUgYnkgZW4gcGFzc2FudClcclxuICpcclxuICogMS4g6Ieq5YiG44Gu6aeS44Go55+z44Gr44KI44Gj44Gm5Zuy44G+44KM44Gm44GE44KL55u45omL44Gu6aeS44Go55+z44KS44GZ44G544Gm5Y+W44KK6Zmk44GPXHJcbiAqIDIuIOebuOaJi+OBrumnkuOBqOefs+OBq+OCiOOBo+OBpuWbsuOBvuOCjOOBpuOBhOOCi+iHquWIhuOBrumnkuOBqOefs+OCkuOBmeOBueOBpuWPluOCiumZpOOBj1xyXG4gKiAzLiDkuozjg53jgYznmbrnlJ/jgZfjgabjgYTjgovjgYvjg7vjgq3jg7PjgrDnjovjgYznm6TpnaLjgYvjgonpmaTjgYvjgozjgabjgYTjgovjgYvjgpLliKTlrprjgIJcclxuICogICAzLTEuIOS4oeOCreODs+OCsOeOi+OBjOmZpOOBi+OCjOOBpuOBhOOBn+OCieOAgeOCq+ODqeODhuOCuOODo+ODs+OCseODs+ODnOOCr+OCt+ODs+OCsFxyXG4gKiAgIDMtMi4g6Ieq5YiG44Gu546L44Gg44GR6Zmk44GL44KM44Gm44GE44Gf44KJ44CB44Gd44KM44Gv44CM546L44Gu6Ieq5q6644Gr44KI44KL5pWX5YyX44CNXHJcbiAqICAgMy0zLiDnm7jmiYvjga7njovjgaDjgZHpmaTjgYvjgozjgabjgYTjgovloLTlkIjjgIFcclxuICogICAgICAgMy0zLTEuIOS6jOODneOBjOeZuueUn+OBl+OBpuOBhOOBquOBkeOCjOOBsOOAgeOBneOCjOOBr+OAjOeOi+OBruaOkumZpOOBq+OCiOOCi+WLneWIqeOAjVxyXG4gKiAgICAgICAgICAgICAzLTMtMS0xLiDnm7jmiYvjga7njovjgpLlj5bjgorpmaTjgYTjgZ/jga7jgYzjgrnjg4bjg4Pjg5cgMS4g44Gn44GC44KK44CBXHJcbiAqICAgICAgICAgICAgICAgICAgICAgIOOBl+OBi+OCguOAjOOBlOOBo+OBneOCiuOAje+8iEByZV9oYWtvX21vb27mm7DjgY/jgIEy5YCL44GLM+WAi++8iVxyXG4gKiAgICAgICAgICAgICAgICAgICAgICDjgavoqbLlvZPjgZnjgovjgajjgY3jgavjga/jgIzjgrfjg6fjgrTjgrnvvIHjgI3jga7nmbrlo7BcclxuICogICAgICAgMy0zLTIuIOS6jOODneOBjOeZuueUn+OBl+OBpuOBhOOCi+OBquOCieOAgeOCq+ODqeODhuOCuOODo+ODs+OCseODs+ODnOOCr+OCt+ODs+OCsFxyXG4gKiAgIDMtNC4g44Gp44Gh44KJ44Gu546L44KC6Zmk44GL44KM44Gm44GE44Gq44GE5aC05ZCI44CBXHJcbiAqICAgICAgIDMtNC0xLiDkuozjg53jgYznmbrnlJ/jgZfjgabjgYTjgarjgZHjgozjgbDjgIHjgrLjg7zjg6DntprooYxcclxuICogICAgICAgMy00LTIuIOS6jOODneOBjOeZuueUn+OBl+OBpuOBhOOCi+OBquOCieOAgeOBneOCjOOBr+OAjOS6jOODneOBq+OCiOOCi+aVl+WMl+OAjVxyXG4gKlxyXG4gKiAxIOKGkiAyIOOBrumghueVquOBp+OBguOCi+agueaLoO+8muOCs+ODs+ODk+ODjeODvOOCt+ODp+ODs+OCouOCv+ODg+OCr+OBruWtmOWcqFxyXG4gKiAyIOKGkiAzIOOBrumghueVquOBp+OBguOCi+agueaLoO+8muWFrOW8j+ODq+ODvOODq+i/veiomFxyXG4gKiDjgIznn7Pjg5XjgqfjgqTjgrrjgpLnnYDmiYvjgZfjgZ/ntZDmnpzjgajjgZfjgaboh6rliIbjga7jg53jg7zjg7PlhbXjgYznm6TkuIrjgYvjgonmtojjgYjkuozjg53jgYzop6PmsbrjgZXjgozjgovloLTlkIjjgoLjgIHlj43liYfjgpLjgajjgonjgZrpgLLooYzjgafjgY3jgovjgILjgI1cclxuICpcclxuICogMS4gUmVtb3ZlIGFsbCB0aGUgb3Bwb25lbnQncyBwaWVjZXMgYW5kIHN0b25lcyBzdXJyb3VuZGVkIGJ5IHlvdXIgcGllY2VzIGFuZCBzdG9uZXNcclxuICogMi4gUmVtb3ZlIGFsbCB5b3VyIHBpZWNlcyBhbmQgc3RvbmVzIHN1cnJvdW5kZWQgYnkgdGhlIG9wcG9uZW50J3MgcGllY2VzIGFuZCBzdG9uZXNcclxuICogMy4gQ2hlY2tzIHdoZXRoZXIgdHdvIHBhd25zIG9jY3VweSB0aGUgc2FtZSBjb2x1bW4sIGFuZCBjaGVja3Mgd2hldGhlciBhIGtpbmcgaXMgcmVtb3ZlZCBmcm9tIHRoZSBib2FyZC5cclxuICogICAzLTEuIElmIGJvdGgga2luZ3MgYXJlIHJlbW92ZWQsIHRoYXQgaXMgYSBkcmF3LCBhbmQgdGhlcmVmb3JlIGEgS2FyYXRlIFJvY2stUGFwZXItU2Npc3NvcnMgQm94aW5nLlxyXG4gKiAgIDMtMi4gSWYgeW91ciBraW5nIGlzIHJlbW92ZWQgYnV0IHRoZSBvcHBvbmVudCdzIHJlbWFpbnMsIHRoZW4gaXQncyBhIGxvc3MgYnkga2luZydzIHN1aWNpZGUuXHJcbiAqICAgMy0zLiBJZiB0aGUgb3Bwb25lbnQncyBraW5nIGlzIHJlbW92ZWQgYnV0IHlvdXJzIHJlbWFpbnMsXHJcbiAqICAgICAgICAzLTMtMS4gSWYgbm8gdHdvIHBhd25zIG9jY3VweSB0aGUgc2FtZSBjb2x1bW4sIHRoZW4gaXQncyBhIHZpY3RvcnlcclxuICogICAgICAgICAgICAgMy0zLTEtMS4gSWYgdGhlIHN0ZXAgdGhhdCByZW1vdmVkIHRoZSBvcHBvbmVudCdzIGtpbmcgd2FzIHN0ZXAgMSxcclxuICogICAgICAgICAgICAgICAgICAgICAgYW5kIHdoZW4gYSBsYXJnZSBudW1iZXIgKD49IDIgb3IgMywgYWNjb3JkaW5nIHRvIEByZV9oYWtvX21vb24pXHJcbiAqICAgICAgICAgICAgICAgICAgICAgIG9mIHBpZWNlcy9zdG9uZXMgYXJlIHJlbW92ZWQsIHRoZW4gXCJTaG9Hb1NzIVwiIHNob3VsZCBiZSBzaG91dGVkXHJcbiAqXHJcbiAqIFRoZSBvcmRlcmluZyAxIOKGkiAyIGlzIG5lZWRlZCB0byBzdXBwb3J0IHRoZSBjb21iaW5hdGlvbiBhdHRhY2suXHJcbiAqIFRoZSBvcmRlcmluZyAyIOKGkiAzIGlzIGV4cGxpY2l0bHkgbWVudGlvbmVkIGJ5IHRoZSBhZGRlbmR1bSB0byB0aGUgb2ZmaWNpYWwgcnVsZTpcclxuICogICAgICAgICDjgIznn7Pjg5XjgqfjgqTjgrrjgpLnnYDmiYvjgZfjgZ/ntZDmnpzjgajjgZfjgaboh6rliIbjga7jg53jg7zjg7PlhbXjgYznm6TkuIrjgYvjgonmtojjgYjkuozjg53jgYzop6PmsbrjgZXjgozjgovloLTlkIjjgoLjgIHlj43liYfjgpLjgajjgonjgZrpgLLooYzjgafjgY3jgovjgILjgI1cclxuICoqL1xyXG5mdW5jdGlvbiByZXNvbHZlX2FmdGVyX3N0b25lX3BoYXNlKHBsYXllZCkge1xyXG4gICAgcmVtb3ZlX3N1cnJvdW5kZWRfZW5pdGl0aWVzX2Zyb21fYm9hcmRfYW5kX2FkZF90b19oYW5kX2lmX25lY2Vzc2FyeShwbGF5ZWQsICgwLCBzaWRlXzEub3Bwb25lbnRPZikocGxheWVkLmJ5X3dob20pKTtcclxuICAgIHJlbW92ZV9zdXJyb3VuZGVkX2VuaXRpdGllc19mcm9tX2JvYXJkX2FuZF9hZGRfdG9faGFuZF9pZl9uZWNlc3NhcnkocGxheWVkLCBwbGF5ZWQuYnlfd2hvbSk7XHJcbiAgICByZW5vdW5jZV9lbl9wYXNzYW50KHBsYXllZC5ib2FyZCwgcGxheWVkLmJ5X3dob20pO1xyXG4gICAgY29uc3QgZG91YmxlZF9wYXduc19leGlzdCA9IGRvZXNfZG91YmxlZF9wYXduc19leGlzdChwbGF5ZWQuYm9hcmQsIHBsYXllZC5ieV93aG9tKTtcclxuICAgIGNvbnN0IGlzX3lvdXJfa2luZ19hbGl2ZSA9IGtpbmdfaXNfYWxpdmUocGxheWVkLmJvYXJkLCBwbGF5ZWQuYnlfd2hvbSk7XHJcbiAgICBjb25zdCBpc19vcHBvbmVudHNfa2luZ19hbGl2ZSA9IGtpbmdfaXNfYWxpdmUocGxheWVkLmJvYXJkLCAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKHBsYXllZC5ieV93aG9tKSk7XHJcbiAgICBjb25zdCBzaXR1YXRpb24gPSB7XHJcbiAgICAgICAgYm9hcmQ6IHBsYXllZC5ib2FyZCxcclxuICAgICAgICBoYW5kX29mX2JsYWNrOiBwbGF5ZWQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICBoYW5kX29mX3doaXRlOiBwbGF5ZWQuaGFuZF9vZl93aGl0ZSxcclxuICAgIH07XHJcbiAgICBpZiAoIWlzX3lvdXJfa2luZ19hbGl2ZSkge1xyXG4gICAgICAgIGlmICghaXNfb3Bwb25lbnRzX2tpbmdfYWxpdmUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgcGhhc2U6IFwiZ2FtZV9lbmRcIiwgcmVhc29uOiBcImJvdGhfa2luZ19kZWFkXCIsIHZpY3RvcjogXCJLYXJhdGVKYW5rZW5Cb3hpbmdcIiwgZmluYWxfc2l0dWF0aW9uOiBzaXR1YXRpb24gfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHBoYXNlOiBcImdhbWVfZW5kXCIsIHJlYXNvbjogXCJraW5nX3N1aWNpZGVcIiwgdmljdG9yOiAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKHBsYXllZC5ieV93aG9tKSwgZmluYWxfc2l0dWF0aW9uOiBzaXR1YXRpb24gfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAoIWlzX29wcG9uZW50c19raW5nX2FsaXZlKSB7XHJcbiAgICAgICAgICAgIGlmICghZG91YmxlZF9wYXduc19leGlzdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcGhhc2U6IFwiZ2FtZV9lbmRcIiwgcmVhc29uOiBcImtpbmdfY2FwdHVyZVwiLCB2aWN0b3I6IHBsYXllZC5ieV93aG9tLCBmaW5hbF9zaXR1YXRpb246IHNpdHVhdGlvbiB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcGhhc2U6IFwiZ2FtZV9lbmRcIiwgcmVhc29uOiBcImtpbmdfY2FwdHVyZV9hbmRfZG91YmxlZF9wYXduc1wiLCB2aWN0b3I6IFwiS2FyYXRlSmFua2VuQm94aW5nXCIsIGZpbmFsX3NpdHVhdGlvbjogc2l0dWF0aW9uIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghZG91YmxlZF9wYXduc19leGlzdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBwaGFzZTogXCJyZXNvbHZlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGJvYXJkOiBwbGF5ZWQuYm9hcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZF9vZl9ibGFjazogcGxheWVkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZF9vZl93aGl0ZTogcGxheWVkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgd2hvX2dvZXNfbmV4dDogKDAsIHNpZGVfMS5vcHBvbmVudE9mKShwbGF5ZWQuYnlfd2hvbSlcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBwaGFzZTogXCJnYW1lX2VuZFwiLCByZWFzb246IFwiZG91YmxlZF9wYXduc1wiLCB2aWN0b3I6ICgwLCBzaWRlXzEub3Bwb25lbnRPZikocGxheWVkLmJ5X3dob20pLCBmaW5hbF9zaXR1YXRpb246IHNpdHVhdGlvbiB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMucmVzb2x2ZV9hZnRlcl9zdG9uZV9waGFzZSA9IHJlc29sdmVfYWZ0ZXJfc3RvbmVfcGhhc2U7XHJcbmZ1bmN0aW9uIHJlbm91bmNlX2VuX3Bhc3NhbnQoYm9hcmQsIGJ5X3dob20pIHtcclxuICAgIGNvbnN0IG9wcG9uZW50X3Bhd25fY29vcmRzID0gKDAsIGJvYXJkXzEubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGVfYW5kX3Byb2YpKGJvYXJkLCAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKGJ5X3dob20pLCBcIuODnVwiKTtcclxuICAgIGZvciAoY29uc3QgY29vcmQgb2Ygb3Bwb25lbnRfcGF3bl9jb29yZHMpIHtcclxuICAgICAgICAoMCwgYm9hcmRfMS5kZWxldGVfZW5fcGFzc2FudF9mbGFnKShib2FyZCwgY29vcmQpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGhhc19kdXBsaWNhdGVzKGFycmF5KSB7XHJcbiAgICByZXR1cm4gbmV3IFNldChhcnJheSkuc2l6ZSAhPT0gYXJyYXkubGVuZ3RoO1xyXG59XHJcbmZ1bmN0aW9uIGRvZXNfZG91YmxlZF9wYXduc19leGlzdChib2FyZCwgc2lkZSkge1xyXG4gICAgY29uc3QgY29vcmRzID0gKDAsIGJvYXJkXzEubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGVfYW5kX3Byb2YpKGJvYXJkLCBzaWRlLCBcIuODnVwiKTtcclxuICAgIGNvbnN0IGNvbHVtbnMgPSBjb29yZHMubWFwKChbY29sLCBfcm93XSkgPT4gY29sKTtcclxuICAgIHJldHVybiBoYXNfZHVwbGljYXRlcyhjb2x1bW5zKTtcclxufVxyXG5mdW5jdGlvbiBraW5nX2lzX2FsaXZlKGJvYXJkLCBzaWRlKSB7XHJcbiAgICByZXR1cm4gKDAsIGJvYXJkXzEubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGVfYW5kX3Byb2YpKGJvYXJkLCBzaWRlLCBcIuOCrVwiKS5sZW5ndGggKyAoMCwgYm9hcmRfMS5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZikoYm9hcmQsIHNpZGUsIFwi6LaFXCIpLmxlbmd0aCA+IDA7XHJcbn1cclxuZnVuY3Rpb24gcmVtb3ZlX3N1cnJvdW5kZWRfZW5pdGl0aWVzX2Zyb21fYm9hcmRfYW5kX2FkZF90b19oYW5kX2lmX25lY2Vzc2FyeShvbGQsIHNpZGUpIHtcclxuICAgIGNvbnN0IGJsYWNrX2FuZF93aGl0ZSA9IG9sZC5ib2FyZC5tYXAocm93ID0+IHJvdy5tYXAoc3EgPT4gc3EgPT09IG51bGwgPyBudWxsIDogc3Euc2lkZSkpO1xyXG4gICAgY29uc3QgaGFzX3N1cnZpdmVkID0gKDAsIHN1cnJvdW5kXzEucmVtb3ZlX3N1cnJvdW5kZWQpKHNpZGUsIGJsYWNrX2FuZF93aGl0ZSk7XHJcbiAgICBvbGQuYm9hcmQuZm9yRWFjaCgocm93LCBpKSA9PiByb3cuZm9yRWFjaCgoc3EsIGopID0+IHtcclxuICAgICAgICBpZiAoIWhhc19zdXJ2aXZlZFtpXT8uW2pdKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhcHR1cmVkX2VudGl0eSA9IHNxO1xyXG4gICAgICAgICAgICByb3dbal0gPSBudWxsO1xyXG4gICAgICAgICAgICBzZW5kX2NhcHR1cmVkX2VudGl0eV90b19vcHBvbmVudChvbGQsIGNhcHR1cmVkX2VudGl0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkpO1xyXG59XHJcbmZ1bmN0aW9uIHNlbmRfY2FwdHVyZWRfZW50aXR5X3RvX29wcG9uZW50KG9sZCwgY2FwdHVyZWRfZW50aXR5KSB7XHJcbiAgICBpZiAoIWNhcHR1cmVkX2VudGl0eSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICBjb25zdCBvcHBvbmVudCA9ICgwLCBzaWRlXzEub3Bwb25lbnRPZikoY2FwdHVyZWRfZW50aXR5LnNpZGUpO1xyXG4gICAgaWYgKGNhcHR1cmVkX2VudGl0eS50eXBlID09PSBcIuOBl+OCh1wiKSB7XHJcbiAgICAgICAgKG9wcG9uZW50ID09PSBcIueZvVwiID8gb2xkLmhhbmRfb2Zfd2hpdGUgOiBvbGQuaGFuZF9vZl9ibGFjaykucHVzaCgoMCwgdHlwZV8xLnVucHJvbW90ZSkoY2FwdHVyZWRfZW50aXR5LnByb2YpKTtcclxuICAgIH1cclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlID0gZXhwb3J0cy5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZiA9IGV4cG9ydHMucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MgPSBleHBvcnRzLmRlbGV0ZV9lbl9wYXNzYW50X2ZsYWcgPSBleHBvcnRzLmdldF9lbnRpdHlfZnJvbV9jb29yZCA9IHZvaWQgMDtcclxuY29uc3QgY29vcmRpbmF0ZV8xID0gcmVxdWlyZShcIi4vY29vcmRpbmF0ZVwiKTtcclxuZnVuY3Rpb24gZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKGJvYXJkLCBjb29yZCkge1xyXG4gICAgY29uc3QgW2NvbHVtbiwgcm93XSA9IGNvb3JkO1xyXG4gICAgY29uc3Qgcm93X2luZGV4ID0gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIi5pbmRleE9mKHJvdyk7XHJcbiAgICBjb25zdCBjb2x1bW5faW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2YoY29sdW1uKTtcclxuICAgIGlmIChyb3dfaW5kZXggPT09IC0xIHx8IGNvbHVtbl9pbmRleCA9PT0gLTEpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOW6p+aomeOAjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGNvb3JkKX3jgI3jga/kuI3mraPjgafjgZlgKTtcclxuICAgIH1cclxuICAgIHJldHVybiAoYm9hcmRbcm93X2luZGV4XT8uW2NvbHVtbl9pbmRleF0pID8/IG51bGw7XHJcbn1cclxuZXhwb3J0cy5nZXRfZW50aXR5X2Zyb21fY29vcmQgPSBnZXRfZW50aXR5X2Zyb21fY29vcmQ7XHJcbmZ1bmN0aW9uIGRlbGV0ZV9lbl9wYXNzYW50X2ZsYWcoYm9hcmQsIGNvb3JkKSB7XHJcbiAgICBjb25zdCBbY29sdW1uLCByb3ddID0gY29vcmQ7XHJcbiAgICBjb25zdCByb3dfaW5kZXggPSBcIuS4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5nVwiLmluZGV4T2Yocm93KTtcclxuICAgIGNvbnN0IGNvbHVtbl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihjb2x1bW4pO1xyXG4gICAgaWYgKHJvd19pbmRleCA9PT0gLTEgfHwgY29sdW1uX2luZGV4ID09PSAtMSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihg5bqn5qiZ44CMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoY29vcmQpfeOAjeOBr+S4jeato+OBp+OBmWApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcGF3biA9IGJvYXJkW3Jvd19pbmRleF1bY29sdW1uX2luZGV4XTtcclxuICAgIGlmIChwYXduPy50eXBlICE9PSBcIuOCuVwiIHx8IHBhd24ucHJvZiAhPT0gXCLjg51cIikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihg44Od44O844Oz44Gu44Gq44GE5bqn5qiZ44CMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoY29vcmQpfeOAjeOBq+WvvuOBl+OBpiBcXGBkZWxldGVfZW5fcGFzc2FudF9mbGFnKClcXGAg44GM5ZG844Gw44KM44G+44GX44GfYCk7XHJcbiAgICB9XHJcbiAgICBkZWxldGUgcGF3bi5zdWJqZWN0X3RvX2VuX3Bhc3NhbnQ7XHJcbn1cclxuZXhwb3J0cy5kZWxldGVfZW5fcGFzc2FudF9mbGFnID0gZGVsZXRlX2VuX3Bhc3NhbnRfZmxhZztcclxuLyoqXHJcbiAqIOmnkuODu+eigeefs+ODu251bGwg44KS55uk5LiK44Gu54m55a6a44Gu5L2N572u44Gr6YWN572u44GZ44KL44CCY2FuX2Nhc3RsZSDjg5Xjg6njgrDjgaggY2FuX2t1bWFsIOODleODqeOCsOOCkumBqeWunOiqv+aVtOOBmeOCi+OAglxyXG4gKiBAcGFyYW0gYm9hcmRcclxuICogQHBhcmFtIGNvb3JkXHJcbiAqIEBwYXJhbSBtYXliZV9lbnRpdHlcclxuICogQHJldHVybnNcclxuICovXHJcbmZ1bmN0aW9uIHB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKGJvYXJkLCBjb29yZCwgbWF5YmVfZW50aXR5KSB7XHJcbiAgICBjb25zdCBbY29sdW1uLCByb3ddID0gY29vcmQ7XHJcbiAgICBjb25zdCByb3dfaW5kZXggPSBcIuS4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5nVwiLmluZGV4T2Yocm93KTtcclxuICAgIGNvbnN0IGNvbHVtbl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihjb2x1bW4pO1xyXG4gICAgaWYgKHJvd19pbmRleCA9PT0gLTEgfHwgY29sdW1uX2luZGV4ID09PSAtMSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihg5bqn5qiZ44CMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoY29vcmQpfeOAjeOBr+S4jeato+OBp+OBmWApO1xyXG4gICAgfVxyXG4gICAgaWYgKG1heWJlX2VudGl0eT8udHlwZSA9PT0gXCLnjotcIikge1xyXG4gICAgICAgIGlmIChtYXliZV9lbnRpdHkubmV2ZXJfbW92ZWQpIHtcclxuICAgICAgICAgICAgbWF5YmVfZW50aXR5Lm5ldmVyX21vdmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG1heWJlX2VudGl0eS5oYXNfbW92ZWRfb25seV9vbmNlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobWF5YmVfZW50aXR5Lmhhc19tb3ZlZF9vbmx5X29uY2UpIHtcclxuICAgICAgICAgICAgbWF5YmVfZW50aXR5Lm5ldmVyX21vdmVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIG1heWJlX2VudGl0eS5oYXNfbW92ZWRfb25seV9vbmNlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobWF5YmVfZW50aXR5Py50eXBlID09PSBcIuOBl+OCh1wiICYmIG1heWJlX2VudGl0eS5wcm9mID09PSBcIummmVwiKSB7XHJcbiAgICAgICAgbWF5YmVfZW50aXR5LmNhbl9rdW1hbCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAobWF5YmVfZW50aXR5Py50eXBlID09PSBcIuOCuVwiKSB7XHJcbiAgICAgICAgbWF5YmVfZW50aXR5Lm5ldmVyX21vdmVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYm9hcmRbcm93X2luZGV4XVtjb2x1bW5faW5kZXhdID0gbWF5YmVfZW50aXR5O1xyXG59XHJcbmV4cG9ydHMucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MgPSBwdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncztcclxuZnVuY3Rpb24gbG9va3VwX2Nvb3Jkc19mcm9tX3NpZGVfYW5kX3Byb2YoYm9hcmQsIHNpZGUsIHByb2YpIHtcclxuICAgIGNvbnN0IGFucyA9IFtdO1xyXG4gICAgY29uc3Qgcm93cyA9IFtcIuS4gFwiLCBcIuS6jFwiLCBcIuS4iVwiLCBcIuWbm1wiLCBcIuS6lFwiLCBcIuWFrVwiLCBcIuS4g1wiLCBcIuWFq1wiLCBcIuS5nVwiXTtcclxuICAgIGNvbnN0IGNvbHMgPSBbXCLvvJFcIiwgXCLvvJJcIiwgXCLvvJNcIiwgXCLvvJRcIiwgXCLvvJVcIiwgXCLvvJZcIiwgXCLvvJdcIiwgXCLvvJhcIiwgXCLvvJlcIl07XHJcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjb2wgb2YgY29scykge1xyXG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IFtjb2wsIHJvd107XHJcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IGdldF9lbnRpdHlfZnJvbV9jb29yZChib2FyZCwgY29vcmQpO1xyXG4gICAgICAgICAgICBpZiAoZW50aXR5ID09PSBudWxsIHx8IGVudGl0eS50eXBlID09PSBcIueigVwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChlbnRpdHkucHJvZiA9PT0gcHJvZiAmJiBlbnRpdHkuc2lkZSA9PT0gc2lkZSkge1xyXG4gICAgICAgICAgICAgICAgYW5zLnB1c2goY29vcmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYW5zO1xyXG59XHJcbmV4cG9ydHMubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGVfYW5kX3Byb2YgPSBsb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZjtcclxuZnVuY3Rpb24gbG9va3VwX2Nvb3Jkc19mcm9tX3NpZGUoYm9hcmQsIHNpZGUpIHtcclxuICAgIGNvbnN0IGFucyA9IFtdO1xyXG4gICAgY29uc3Qgcm93cyA9IFtcIuS4gFwiLCBcIuS6jFwiLCBcIuS4iVwiLCBcIuWbm1wiLCBcIuS6lFwiLCBcIuWFrVwiLCBcIuS4g1wiLCBcIuWFq1wiLCBcIuS5nVwiXTtcclxuICAgIGNvbnN0IGNvbHMgPSBbXCLvvJFcIiwgXCLvvJJcIiwgXCLvvJNcIiwgXCLvvJRcIiwgXCLvvJVcIiwgXCLvvJZcIiwgXCLvvJdcIiwgXCLvvJhcIiwgXCLvvJlcIl07XHJcbiAgICBmb3IgKGNvbnN0IHJvdyBvZiByb3dzKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBjb2wgb2YgY29scykge1xyXG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IFtjb2wsIHJvd107XHJcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IGdldF9lbnRpdHlfZnJvbV9jb29yZChib2FyZCwgY29vcmQpO1xyXG4gICAgICAgICAgICBpZiAoZW50aXR5ID09PSBudWxsIHx8IGVudGl0eS50eXBlID09PSBcIueigVwiKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChlbnRpdHkuc2lkZSA9PT0gc2lkZSkge1xyXG4gICAgICAgICAgICAgICAgYW5zLnB1c2goY29vcmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYW5zO1xyXG59XHJcbmV4cG9ydHMubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGUgPSBsb29rdXBfY29vcmRzX2Zyb21fc2lkZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5kb19hbnlfb2ZfbXlfcGllY2VzX3NlZSA9IGV4cG9ydHMuY2FuX3NlZSA9IHZvaWQgMDtcclxuY29uc3QgYm9hcmRfMSA9IHJlcXVpcmUoXCIuL2JvYXJkXCIpO1xyXG5jb25zdCBzaWRlXzEgPSByZXF1aXJlKFwiLi9zaWRlXCIpO1xyXG5mdW5jdGlvbiBkZWx0YUVxKGQsIGRlbHRhKSB7XHJcbiAgICByZXR1cm4gZC52ID09PSBkZWx0YS52ICYmIGQuaCA9PT0gZGVsdGEuaDtcclxufVxyXG4vKipcclxuICogYG8uZnJvbWAg44Gr6aeS44GM44GC44Gj44Gm44Gd44Gu6aeS44GMIGBvLnRvYCDjgbjjgajliKnjgYTjgabjgYTjgovjgYvjganjgYbjgYvjgpLov5TjgZnjgILjg53jg7zjg7Pjga7mlpzjgoHliKnjgY3jga/luLjjgasgY2FuX3NlZSDjgajopovjgarjgZnjgILjg53jg7zjg7Pjga4y44Oe44K556e75YuV44Gv44CB6aeS44KS5Y+W44KL44GT44Go44GM44Gn44GN44Gq44GE44Gu44Gn44CM5Yip44GN44CN44Gn44Gv44Gq44GE44CCXHJcbiAqICBDaGVja3Mgd2hldGhlciB0aGVyZSBpcyBhIHBpZWNlIGF0IGBvLmZyb21gIHdoaWNoIGxvb2tzIGF0IGBvLnRvYC4gVGhlIGRpYWdvbmFsIG1vdmUgb2YgcGF3biBpcyBhbHdheXMgY29uc2lkZXJlZC4gQSBwYXduIG5ldmVyIHNlZXMgdHdvIHNxdWFyZXMgaW4gdGhlIGZyb250OyBpdCBjYW4gb25seSBtb3ZlIHRvIHRoZXJlLlxyXG4gKiBAcGFyYW0gYm9hcmRcclxuICogQHBhcmFtIG9cclxuICogQHJldHVybnNcclxuICovXHJcbmZ1bmN0aW9uIGNhbl9zZWUoYm9hcmQsIG8pIHtcclxuICAgIGNvbnN0IHAgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBvLmZyb20pO1xyXG4gICAgaWYgKCFwKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKHAudHlwZSA9PT0gXCLnooFcIikge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGNvbnN0IGRlbHRhID0gKDAsIHNpZGVfMS5jb29yZERpZmZTZWVuRnJvbSkocC5zaWRlLCBvKTtcclxuICAgIGlmIChwLnByb2YgPT09IFwi5oiQ5qGCXCIgfHwgcC5wcm9mID09PSBcIuaIkOmKgFwiIHx8IHAucHJvZiA9PT0gXCLmiJDppplcIiB8fCBwLnByb2YgPT09IFwi6YeRXCIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB7IHY6IDEsIGg6IC0xIH0sIHsgdjogMSwgaDogMCB9LCB7IHY6IDEsIGg6IDEgfSxcclxuICAgICAgICAgICAgeyB2OiAwLCBoOiAtMSB9LCAvKioqKioqKioqKioqLyB7IHY6IDAsIGg6IDEgfSxcclxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqLyB7IHY6IC0xLCBoOiAwIH0gLyoqKioqKioqKioqKioqL1xyXG4gICAgICAgIF0uc29tZShkID0+IGRlbHRhRXEoZCwgZGVsdGEpKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLpioBcIikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHsgdjogMSwgaDogLTEgfSwgeyB2OiAxLCBoOiAwIH0sIHsgdjogMSwgaDogMSB9LFxyXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgICAgICAgICAgeyB2OiAtMSwgaDogLTEgfSwgLyoqKioqKioqKioqKi8geyB2OiAxLCBoOiAxIH0sXHJcbiAgICAgICAgXS5zb21lKGQgPT4gZGVsdGFFcShkLCBkZWx0YSkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIuahglwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgeyB2OiAyLCBoOiAtMSB9LCB7IHY6IDIsIGg6IDEgfVxyXG4gICAgICAgIF0uc29tZShkID0+IGRlbHRhRXEoZCwgZGVsdGEpKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLjg4pcIikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHsgdjogMiwgaDogLTEgfSwgeyB2OiAyLCBoOiAxIH0sXHJcbiAgICAgICAgICAgIHsgdjogLTIsIGg6IC0xIH0sIHsgdjogLTIsIGg6IDEgfSxcclxuICAgICAgICAgICAgeyB2OiAtMSwgaDogMiB9LCB7IHY6IDEsIGg6IDIgfSxcclxuICAgICAgICAgICAgeyB2OiAtMSwgaDogLTIgfSwgeyB2OiAxLCBoOiAtMiB9XHJcbiAgICAgICAgXS5zb21lKGQgPT4gZGVsdGFFcShkLCBkZWx0YSkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIuOCrVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgeyB2OiAxLCBoOiAtMSB9LCB7IHY6IDEsIGg6IDAgfSwgeyB2OiAxLCBoOiAxIH0sXHJcbiAgICAgICAgICAgIHsgdjogMCwgaDogLTEgfSwgLyoqKioqKioqKioqKiovIHsgdjogMCwgaDogMSB9LFxyXG4gICAgICAgICAgICB7IHY6IC0xLCBoOiAtMSB9LCB7IHY6IC0xLCBoOiAwIH0sIHsgdjogLTEsIGg6IDEgfSxcclxuICAgICAgICBdLnNvbWUoZCA9PiBkZWx0YUVxKGQsIGRlbHRhKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi44GoXCIgfHwgcC5wcm9mID09PSBcIuOCr1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIGxvbmdfcmFuZ2UoW1xyXG4gICAgICAgICAgICB7IHY6IDEsIGg6IC0xIH0sIHsgdjogMSwgaDogMCB9LCB7IHY6IDEsIGg6IDEgfSxcclxuICAgICAgICAgICAgeyB2OiAwLCBoOiAtMSB9LCAvKioqKioqKioqKioqKi8geyB2OiAwLCBoOiAxIH0sXHJcbiAgICAgICAgICAgIHsgdjogLTEsIGg6IC0xIH0sIHsgdjogLTEsIGg6IDAgfSwgeyB2OiAtMSwgaDogMSB9LFxyXG4gICAgICAgIF0sIGJvYXJkLCBvLCBwLnNpZGUpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIuODk1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIGxvbmdfcmFuZ2UoW1xyXG4gICAgICAgICAgICB7IHY6IDEsIGg6IC0xIH0sIHsgdjogMSwgaDogMSB9LCB7IHY6IC0xLCBoOiAtMSB9LCB7IHY6IC0xLCBoOiAxIH0sXHJcbiAgICAgICAgXSwgYm9hcmQsIG8sIHAuc2lkZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi44OrXCIpIHtcclxuICAgICAgICByZXR1cm4gbG9uZ19yYW5nZShbXHJcbiAgICAgICAgICAgIHsgdjogMSwgaDogMCB9LCB7IHY6IDAsIGg6IC0xIH0sIHsgdjogMCwgaDogMSB9LCB7IHY6IC0xLCBoOiAwIH0sXHJcbiAgICAgICAgXSwgYm9hcmQsIG8sIHAuc2lkZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi6aaZXCIpIHtcclxuICAgICAgICByZXR1cm4gbG9uZ19yYW5nZShbeyB2OiAxLCBoOiAwIH1dLCBib2FyZCwgbywgcC5zaWRlKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLotoVcIikge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIuODnVwiKSB7XHJcbiAgICAgICAgaWYgKFt7IHY6IDEsIGg6IC0xIH0sIHsgdjogMSwgaDogMCB9LCB7IHY6IDEsIGg6IDEgfV0uc29tZShkID0+IGRlbHRhRXEoZCwgZGVsdGEpKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGEgcGF3biBjYW4gbmV2ZXIgc2VlIHR3byBzcXVhcmVzIGluIGZyb250OyBpdCBjYW4gb25seSBtb3ZlIHRvIHRoZXJlXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBfID0gcC5wcm9mO1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNob3VsZCBub3QgcmVhY2ggaGVyZVwiKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmNhbl9zZWUgPSBjYW5fc2VlO1xyXG5mdW5jdGlvbiBsb25nX3JhbmdlKGRpcmVjdGlvbnMsIGJvYXJkLCBvLCBzaWRlKSB7XHJcbiAgICBjb25zdCBkZWx0YSA9ICgwLCBzaWRlXzEuY29vcmREaWZmU2VlbkZyb20pKHNpZGUsIG8pO1xyXG4gICAgY29uc3QgbWF0Y2hpbmdfZGlyZWN0aW9ucyA9IGRpcmVjdGlvbnMuZmlsdGVyKGRpcmVjdGlvbiA9PiBkZWx0YS52ICogZGlyZWN0aW9uLnYgKyBkZWx0YS5oICogZGlyZWN0aW9uLmggPiAwIC8qIGlubmVyIHByb2R1Y3QgaXMgcG9zaXRpdmUgKi9cclxuICAgICAgICAmJiBkZWx0YS52ICogZGlyZWN0aW9uLmggLSBkaXJlY3Rpb24udiAqIGRlbHRhLmggPT09IDAgLyogY3Jvc3MgcHJvZHVjdCBpcyB6ZXJvICovKTtcclxuICAgIGlmIChtYXRjaGluZ19kaXJlY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGNvbnN0IGRpcmVjdGlvbiA9IG1hdGNoaW5nX2RpcmVjdGlvbnNbMF07XHJcbiAgICBmb3IgKGxldCBpID0geyB2OiBkaXJlY3Rpb24udiwgaDogZGlyZWN0aW9uLmggfTsgIWRlbHRhRXEoaSwgZGVsdGEpOyBpLnYgKz0gZGlyZWN0aW9uLnYsIGkuaCArPSBkaXJlY3Rpb24uaCkge1xyXG4gICAgICAgIGNvbnN0IGNvb3JkID0gKDAsIHNpZGVfMS5hcHBseURlbHRhU2VlbkZyb20pKHNpZGUsIG8uZnJvbSwgaSk7XHJcbiAgICAgICAgaWYgKCgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIGNvb3JkKSkge1xyXG4gICAgICAgICAgICAvLyBibG9ja2VkIGJ5IHNvbWV0aGluZzsgY2Fubm90IHNlZVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuZnVuY3Rpb24gZG9fYW55X29mX215X3BpZWNlc19zZWUoYm9hcmQsIGNvb3JkLCBzaWRlKSB7XHJcbiAgICBjb25zdCBvcHBvbmVudF9waWVjZV9jb29yZHMgPSAoMCwgYm9hcmRfMS5sb29rdXBfY29vcmRzX2Zyb21fc2lkZSkoYm9hcmQsIHNpZGUpO1xyXG4gICAgcmV0dXJuIG9wcG9uZW50X3BpZWNlX2Nvb3Jkcy5zb21lKGZyb20gPT4gY2FuX3NlZShib2FyZCwgeyBmcm9tLCB0bzogY29vcmQgfSkpO1xyXG59XHJcbmV4cG9ydHMuZG9fYW55X29mX215X3BpZWNlc19zZWUgPSBkb19hbnlfb2ZfbXlfcGllY2VzX3NlZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5MZWZ0bW9zdFdoZW5TZWVuRnJvbUJsYWNrID0gZXhwb3J0cy5SaWdodG1vc3RXaGVuU2VlbkZyb21CbGFjayA9IGV4cG9ydHMuY29vcmREaWZmID0gZXhwb3J0cy5jb2x1bW5zQmV0d2VlbiA9IGV4cG9ydHMuY29vcmRFcSA9IGV4cG9ydHMuZGlzcGxheUNvb3JkID0gdm9pZCAwO1xyXG5mdW5jdGlvbiBkaXNwbGF5Q29vcmQoY29vcmQpIHtcclxuICAgIHJldHVybiBgJHtjb29yZFswXX0ke2Nvb3JkWzFdfWA7XHJcbn1cclxuZXhwb3J0cy5kaXNwbGF5Q29vcmQgPSBkaXNwbGF5Q29vcmQ7XHJcbmZ1bmN0aW9uIGNvb3JkRXEoW2NvbDEsIHJvdzFdLCBbY29sMiwgcm93Ml0pIHtcclxuICAgIHJldHVybiBjb2wxID09PSBjb2wyICYmIHJvdzEgPT09IHJvdzI7XHJcbn1cclxuZXhwb3J0cy5jb29yZEVxID0gY29vcmRFcTtcclxuZnVuY3Rpb24gY29sdW1uc0JldHdlZW4oYSwgYikge1xyXG4gICAgY29uc3QgYV9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihhKTtcclxuICAgIGNvbnN0IGJfaW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2YoYik7XHJcbiAgICBpZiAoYV9pbmRleCA+PSBiX2luZGV4KVxyXG4gICAgICAgIHJldHVybiBjb2x1bW5zQmV0d2VlbihiLCBhKTtcclxuICAgIGNvbnN0IGFucyA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IGFfaW5kZXggKyAxOyBpIDwgYl9pbmRleDsgaSsrKSB7XHJcbiAgICAgICAgYW5zLnB1c2goXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIltpXSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYW5zO1xyXG59XHJcbmV4cG9ydHMuY29sdW1uc0JldHdlZW4gPSBjb2x1bW5zQmV0d2VlbjtcclxuZnVuY3Rpb24gY29vcmREaWZmKG8pIHtcclxuICAgIGNvbnN0IFtmcm9tX2NvbHVtbiwgZnJvbV9yb3ddID0gby5mcm9tO1xyXG4gICAgY29uc3QgZnJvbV9yb3dfaW5kZXggPSBcIuS4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5nVwiLmluZGV4T2YoZnJvbV9yb3cpO1xyXG4gICAgY29uc3QgZnJvbV9jb2x1bW5faW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2YoZnJvbV9jb2x1bW4pO1xyXG4gICAgY29uc3QgW3RvX2NvbHVtbiwgdG9fcm93XSA9IG8udG87XHJcbiAgICBjb25zdCB0b19yb3dfaW5kZXggPSBcIuS4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5nVwiLmluZGV4T2YodG9fcm93KTtcclxuICAgIGNvbnN0IHRvX2NvbHVtbl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZih0b19jb2x1bW4pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBoOiB0b19jb2x1bW5faW5kZXggLSBmcm9tX2NvbHVtbl9pbmRleCxcclxuICAgICAgICB2OiB0b19yb3dfaW5kZXggLSBmcm9tX3Jvd19pbmRleFxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmNvb3JkRGlmZiA9IGNvb3JkRGlmZjtcclxuZnVuY3Rpb24gUmlnaHRtb3N0V2hlblNlZW5Gcm9tQmxhY2soY29vcmRzKSB7XHJcbiAgICBpZiAoY29vcmRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyaWVkIHRvIHRha2UgdGhlIG1heGltdW0gb2YgYW4gZW1wdHkgYXJyYXlcIik7XHJcbiAgICB9XHJcbiAgICAvLyBTaW5jZSBcIu+8kVwiIHRvIFwi77yZXCIgYXJlIGNvbnNlY3V0aXZlIGluIFVuaWNvZGUsIHdlIGNhbiBqdXN0IHNvcnQgaXQgYXMgVVRGLTE2IHN0cmluZ1xyXG4gICAgY29uc3QgY29sdW1ucyA9IGNvb3Jkcy5tYXAoKFtjb2wsIF9yb3ddKSA9PiBjb2wpO1xyXG4gICAgY29sdW1ucy5zb3J0KCk7XHJcbiAgICBjb25zdCByaWdodG1vc3RfY29sdW1uID0gY29sdW1uc1swXTtcclxuICAgIHJldHVybiBjb29yZHMuZmlsdGVyKChbY29sLCBfcm93XSkgPT4gY29sID09PSByaWdodG1vc3RfY29sdW1uKTtcclxufVxyXG5leHBvcnRzLlJpZ2h0bW9zdFdoZW5TZWVuRnJvbUJsYWNrID0gUmlnaHRtb3N0V2hlblNlZW5Gcm9tQmxhY2s7XHJcbmZ1bmN0aW9uIExlZnRtb3N0V2hlblNlZW5Gcm9tQmxhY2soY29vcmRzKSB7XHJcbiAgICBpZiAoY29vcmRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyaWVkIHRvIHRha2UgdGhlIG1heGltdW0gb2YgYW4gZW1wdHkgYXJyYXlcIik7XHJcbiAgICB9XHJcbiAgICAvLyBTaW5jZSBcIu+8kVwiIHRvIFwi77yZXCIgYXJlIGNvbnNlY3V0aXZlIGluIFVuaWNvZGUsIHdlIGNhbiBqdXN0IHNvcnQgaXQgYXMgVVRGLTE2IHN0cmluZ1xyXG4gICAgY29uc3QgY29sdW1ucyA9IGNvb3Jkcy5tYXAoKFtjb2wsIF9yb3ddKSA9PiBjb2wpO1xyXG4gICAgY29sdW1ucy5zb3J0KCk7XHJcbiAgICBjb25zdCBsZWZ0bW9zdF9jb2x1bW4gPSBjb2x1bW5zW2NvbHVtbnMubGVuZ3RoIC0gMV07XHJcbiAgICByZXR1cm4gY29vcmRzLmZpbHRlcigoW2NvbCwgX3Jvd10pID0+IGNvbCA9PT0gbGVmdG1vc3RfY29sdW1uKTtcclxufVxyXG5leHBvcnRzLkxlZnRtb3N0V2hlblNlZW5Gcm9tQmxhY2sgPSBMZWZ0bW9zdFdoZW5TZWVuRnJvbUJsYWNrO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcclxuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XHJcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XHJcbiAgICB9XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSkpO1xyXG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZXhwb3J0cywgcCkpIF9fY3JlYXRlQmluZGluZyhleHBvcnRzLCBtLCBwKTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmZyb21fY3VzdG9tX3N0YXRlID0gZXhwb3J0cy5tYWluID0gZXhwb3J0cy5nZXRfaW5pdGlhbF9zdGF0ZSA9IGV4cG9ydHMuY29vcmRFcSA9IGV4cG9ydHMuZGlzcGxheUNvb3JkID0gZXhwb3J0cy5jYW5fbW92ZSA9IGV4cG9ydHMuY2FuX3NlZSA9IGV4cG9ydHMub3Bwb25lbnRPZiA9IHZvaWQgMDtcclxuY29uc3QgYm9hcmRfMSA9IHJlcXVpcmUoXCIuL2JvYXJkXCIpO1xyXG5jb25zdCBwaWVjZV9waGFzZV8xID0gcmVxdWlyZShcIi4vcGllY2VfcGhhc2VcIik7XHJcbmNvbnN0IGNvb3JkaW5hdGVfMSA9IHJlcXVpcmUoXCIuL2Nvb3JkaW5hdGVcIik7XHJcbmNvbnN0IGFmdGVyX3N0b25lX3BoYXNlXzEgPSByZXF1aXJlKFwiLi9hZnRlcl9zdG9uZV9waGFzZVwiKTtcclxuY29uc3Qgc2lkZV8xID0gcmVxdWlyZShcIi4vc2lkZVwiKTtcclxuY29uc3Qgc3Vycm91bmRfMSA9IHJlcXVpcmUoXCIuL3N1cnJvdW5kXCIpO1xyXG52YXIgc2lkZV8yID0gcmVxdWlyZShcIi4vc2lkZVwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwib3Bwb25lbnRPZlwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc2lkZV8yLm9wcG9uZW50T2Y7IH0gfSk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi90eXBlXCIpLCBleHBvcnRzKTtcclxudmFyIGNhbl9zZWVfMSA9IHJlcXVpcmUoXCIuL2Nhbl9zZWVcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImNhbl9zZWVcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNhbl9zZWVfMS5jYW5fc2VlOyB9IH0pO1xyXG52YXIgcGllY2VfcGhhc2VfMiA9IHJlcXVpcmUoXCIuL3BpZWNlX3BoYXNlXCIpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJjYW5fbW92ZVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcGllY2VfcGhhc2VfMi5jYW5fbW92ZTsgfSB9KTtcclxudmFyIGNvb3JkaW5hdGVfMiA9IHJlcXVpcmUoXCIuL2Nvb3JkaW5hdGVcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImRpc3BsYXlDb29yZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gY29vcmRpbmF0ZV8yLmRpc3BsYXlDb29yZDsgfSB9KTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiY29vcmRFcVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gY29vcmRpbmF0ZV8yLmNvb3JkRXE7IH0gfSk7XHJcbmNvbnN0IGdldF9pbml0aWFsX3N0YXRlID0gKHdob19nb2VzX2ZpcnN0KSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBoYXNlOiBcInJlc29sdmVkXCIsXHJcbiAgICAgICAgaGFuZF9vZl9ibGFjazogW10sXHJcbiAgICAgICAgaGFuZF9vZl93aGl0ZTogW10sXHJcbiAgICAgICAgd2hvX2dvZXNfbmV4dDogd2hvX2dvZXNfZmlyc3QsXHJcbiAgICAgICAgYm9hcmQ6IFtcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIummmVwiLCBjYW5fa3VtYWw6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLmoYJcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIumKgFwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi6YeRXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLnjotcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjgq1cIiwgbmV2ZXJfbW92ZWQ6IHRydWUsIGhhc19tb3ZlZF9vbmx5X29uY2U6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi6YeRXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLpioBcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuahglwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi6aaZXCIsIGNhbl9rdW1hbDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OrXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OKXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OTXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuOCr1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg5NcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg4pcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg6tcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCxdLFxyXG4gICAgICAgICAgICBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCxdLFxyXG4gICAgICAgICAgICBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCxdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg6tcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg4pcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg5NcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44KvXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODk1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODilwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODq1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi6aaZXCIsIGNhbl9rdW1hbDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuahglwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi6YqAXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLph5FcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIueOi1wiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuOCrVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSwgaGFzX21vdmVkX29ubHlfb25jZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLph5FcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIumKgFwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi5qGCXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLppplcIiwgY2FuX2t1bWFsOiB0cnVlIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgXVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0cy5nZXRfaW5pdGlhbF9zdGF0ZSA9IGdldF9pbml0aWFsX3N0YXRlO1xyXG4vKiog56KB55+z44KS572u44GP44CC6Ieq5q665omL44Gr44Gq44KL44KI44GG44Gq56KB55+z44Gu572u44GN5pa544Gv44Gn44GN44Gq44GE77yI5YWs5byP44Or44O844Or44CM5omT44Gj44Gf556s6ZaT44Gr5Y+W44KJ44KM44Gm44GX44G+44GG44Oe44K544Gr44Gv55+z44Gv5omT44Gm44Gq44GE44CN77yJXHJcbiAqXHJcbiAqIEBwYXJhbSBvbGRcclxuICogQHBhcmFtIHNpZGVcclxuICogQHBhcmFtIHN0b25lX3RvXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5mdW5jdGlvbiBwbGFjZV9zdG9uZShvbGQsIHNpZGUsIHN0b25lX3RvKSB7XHJcbiAgICBpZiAoKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShvbGQuYm9hcmQsIHN0b25lX3RvKSkgeyAvLyBpZiB0aGUgc3F1YXJlIGlzIGFscmVhZHkgb2NjdXBpZWRcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7c2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShzdG9uZV90byl944Gr56KB55+z44KS572u44GT44GG44Go44GX44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoc3RvbmVfdG8pfeOBruODnuOCueOBr+aXouOBq+Wfi+OBvuOBo+OBpuOBhOOBvuOBmWApO1xyXG4gICAgfVxyXG4gICAgLy8g44G+44Ga572u44GPXHJcbiAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBzdG9uZV90bywgeyB0eXBlOiBcIueigVwiLCBzaWRlIH0pO1xyXG4gICAgLy8g572u44GE44Gf5b6M44Gn44CB552A5omL56aB5q2i44GL44Gp44GG44GL44KS5Yik5pat44GZ44KL44Gf44KB44Gr44CBXHJcbiAgICAvL+OAjuWbsuOBvuOCjOOBpuOBhOOCi+ebuOaJi+OBrumnki/nn7PjgpLlj5bjgovjgI/ihpLjgI7lm7Ljgb7jgozjgabjgYTjgovoh6rliIbjga7pp5Iv55+z44KS5Y+W44KL44CP44KS44K344Of44Ol44Os44O844K344On44Oz44GX44Gm44CB572u44GE44Gf5L2N572u44Gu55+z44GM5q2744KT44Gn44GE44Gf44KJXHJcbiAgICBjb25zdCBibGFja19hbmRfd2hpdGUgPSBvbGQuYm9hcmQubWFwKHJvdyA9PiByb3cubWFwKHNxID0+IHNxID09PSBudWxsID8gbnVsbCA6IHNxLnNpZGUpKTtcclxuICAgIGNvbnN0IG9wcG9uZW50X3JlbW92ZWQgPSAoMCwgc3Vycm91bmRfMS5yZW1vdmVfc3Vycm91bmRlZCkoKDAsIHNpZGVfMS5vcHBvbmVudE9mKShzaWRlKSwgYmxhY2tfYW5kX3doaXRlKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9ICgwLCBzdXJyb3VuZF8xLnJlbW92ZV9zdXJyb3VuZGVkKShzaWRlLCBvcHBvbmVudF9yZW1vdmVkKTtcclxuICAgIGlmICgoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKHJlc3VsdCwgc3RvbmVfdG8pKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcGhhc2U6IFwic3RvbmVfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgICAgIGhhbmRfb2ZfYmxhY2s6IG9sZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgICAgICBoYW5kX29mX3doaXRlOiBvbGQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICAgICAgYnlfd2hvbTogb2xkLmJ5X3dob20sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtzaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHN0b25lX3RvKX3jgavnooHnn7PjgpLnva7jgZPjgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIHmiZPjgaPjgZ/nnqzplpPjgavlj5bjgonjgozjgabjgZfjgb7jgYbjga7jgafjgZPjgZPjga/nnYDmiYvnpoHmraLngrnjgafjgZlgKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBvbmVfdHVybihvbGQsIG1vdmUpIHtcclxuICAgIGNvbnN0IGFmdGVyX3BpZWNlX3BoYXNlID0gKDAsIHBpZWNlX3BoYXNlXzEucGxheV9waWVjZV9waGFzZSkob2xkLCBtb3ZlLnBpZWNlX3BoYXNlKTtcclxuICAgIGNvbnN0IGFmdGVyX3N0b25lX3BoYXNlID0gbW92ZS5zdG9uZV90byA/IHBsYWNlX3N0b25lKGFmdGVyX3BpZWNlX3BoYXNlLCBtb3ZlLnBpZWNlX3BoYXNlLnNpZGUsIG1vdmUuc3RvbmVfdG8pIDoge1xyXG4gICAgICAgIHBoYXNlOiBcInN0b25lX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgIGJvYXJkOiBhZnRlcl9waWVjZV9waGFzZS5ib2FyZCxcclxuICAgICAgICBoYW5kX29mX2JsYWNrOiBhZnRlcl9waWVjZV9waGFzZS5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgIGhhbmRfb2Zfd2hpdGU6IGFmdGVyX3BpZWNlX3BoYXNlLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgYnlfd2hvbTogYWZ0ZXJfcGllY2VfcGhhc2UuYnlfd2hvbSxcclxuICAgIH07XHJcbiAgICByZXR1cm4gKDAsIGFmdGVyX3N0b25lX3BoYXNlXzEucmVzb2x2ZV9hZnRlcl9zdG9uZV9waGFzZSkoYWZ0ZXJfc3RvbmVfcGhhc2UpO1xyXG59XHJcbmZ1bmN0aW9uIG1haW4obW92ZXMpIHtcclxuICAgIGlmIChtb3Zlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYznqbrjgafjgZlcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZnJvbV9jdXN0b21fc3RhdGUobW92ZXMsICgwLCBleHBvcnRzLmdldF9pbml0aWFsX3N0YXRlKShtb3Zlc1swXS5waWVjZV9waGFzZS5zaWRlKSk7XHJcbn1cclxuZXhwb3J0cy5tYWluID0gbWFpbjtcclxuZnVuY3Rpb24gZnJvbV9jdXN0b21fc3RhdGUobW92ZXMsIGluaXRpYWxfc3RhdGUpIHtcclxuICAgIGxldCBzdGF0ZSA9IGluaXRpYWxfc3RhdGU7XHJcbiAgICBmb3IgKGNvbnN0IG1vdmUgb2YgbW92ZXMpIHtcclxuICAgICAgICBjb25zdCBuZXh0ID0gb25lX3R1cm4oc3RhdGUsIG1vdmUpO1xyXG4gICAgICAgIGlmIChuZXh0LnBoYXNlID09PSBcImdhbWVfZW5kXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0YXRlID0gbmV4dDtcclxuICAgIH1cclxuICAgIHJldHVybiBzdGF0ZTtcclxufVxyXG5leHBvcnRzLmZyb21fY3VzdG9tX3N0YXRlID0gZnJvbV9jdXN0b21fc3RhdGU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuY2FuX21vdmUgPSBleHBvcnRzLnBsYXlfcGllY2VfcGhhc2UgPSB2b2lkIDA7XHJcbmNvbnN0IGJvYXJkXzEgPSByZXF1aXJlKFwiLi9ib2FyZFwiKTtcclxuY29uc3QgdHlwZV8xID0gcmVxdWlyZShcIi4vdHlwZVwiKTtcclxuY29uc3QgY29vcmRpbmF0ZV8xID0gcmVxdWlyZShcIi4vY29vcmRpbmF0ZVwiKTtcclxuY29uc3Qgc2lkZV8xID0gcmVxdWlyZShcIi4vc2lkZVwiKTtcclxuY29uc3QgY2FuX3NlZV8xID0gcmVxdWlyZShcIi4vY2FuX3NlZVwiKTtcclxuLyoqIOmnkuOCkuaJk+OBpOOAguaJi+mnkuOBi+OCieWwhuaji+mnkuOCkuebpOS4iuOBq+enu+WLleOBleOBm+OCi+OAguihjOOBjeOBqeOBk+OCjeOBrueEoeOBhOS9jee9ruOBq+ahgummrOOBqOmmmei7iuOCkuaJk+OBo+OBn+OCieOCqOODqeODvOOAglxyXG4gKlxyXG4gKi9cclxuZnVuY3Rpb24gcGFyYWNodXRlKG9sZCwgbykge1xyXG4gICAgaWYgKCgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkob2xkLmJvYXJkLCBvLnRvKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z95omT44Go44Gu44GT44Go44Gn44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944Oe44K544Gv5pei44Gr5Z+L44G+44Gj44Gm44GE44G+44GZYCk7XHJcbiAgICB9XHJcbiAgICBpZiAoby5wcm9mID09PSBcIuahglwiKSB7XHJcbiAgICAgICAgaWYgKCgwLCBzaWRlXzEuaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzKSgyLCBvLnNpZGUsIG8udG8pKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z95omT44Go44Gu44GT44Go44Gn44GZ44GM44CB6KGM44GN44Gp44GT44KN44Gu44Gq44GE5qGC6aas44Gv5omT44Gm44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoby5wcm9mID09PSBcIummmVwiKSB7XHJcbiAgICAgICAgaWYgKCgwLCBzaWRlXzEuaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzKSgxLCBvLnNpZGUsIG8udG8pKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z95omT44Go44Gu44GT44Go44Gn44GZ44GM44CB6KGM44GN44Gp44GT44KN44Gu44Gq44GE6aaZ6LuK44Gv5omT44Gm44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgaGFuZCA9IG9sZFtvLnNpZGUgPT09IFwi55m9XCIgPyBcImhhbmRfb2Zfd2hpdGVcIiA6IFwiaGFuZF9vZl9ibGFja1wiXTtcclxuICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8udG8sIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogby5zaWRlLCBwcm9mOiBvLnByb2YsIGNhbl9rdW1hbDogZmFsc2UgfSk7XHJcbiAgICBjb25zdCBpbmRleCA9IGhhbmQuZmluZEluZGV4KHByb2YgPT4gcHJvZiA9PT0gby5wcm9mKTtcclxuICAgIGhhbmQuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcGhhc2U6IFwicGllY2VfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgaGFuZF9vZl9ibGFjazogb2xkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgaGFuZF9vZl93aGl0ZTogb2xkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgYnlfd2hvbTogb2xkLndob19nb2VzX25leHQsXHJcbiAgICAgICAgYm9hcmQ6IG9sZC5ib2FyZFxyXG4gICAgfTtcclxufVxyXG5mdW5jdGlvbiBrdW1hbGluZzIob2xkLCBmcm9tLCB0bykge1xyXG4gICAgY29uc3Qga2luZyA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkob2xkLmJvYXJkLCBmcm9tKTtcclxuICAgIGlmIChraW5nPy50eXBlID09PSBcIueOi1wiKSB7XHJcbiAgICAgICAgaWYgKGtpbmcubmV2ZXJfbW92ZWQpIHtcclxuICAgICAgICAgICAgY29uc3QgbGFuY2UgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKG9sZC5ib2FyZCwgdG8pO1xyXG4gICAgICAgICAgICBpZiAoIWxhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOOCreODs+OCsOeOi+OBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHRvKX3jgbjli5XjgY/jgY/jgb7jgorjgpPjgZDjgpIke2tpbmcuc2lkZX3jgYzoqabjgb/jgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKSh0byl944Gr44Gv6aeS44GM44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobGFuY2UudHlwZSA9PT0gXCLnooFcIikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDjgq3jg7PjgrDnjovjgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShmcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKSh0byl944G45YuV44GP44GP44G+44KK44KT44GQ44KSJHtraW5nLnNpZGV944GM6Kmm44G/44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkodG8pfeOBq+OBguOCi+OBruOBr+mmmei7iuOBp+OBr+OBquOBj+eigeefs+OBp+OBmWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGxhbmNlLnR5cGUgIT09IFwi44GX44KHXCIgfHwgbGFuY2UucHJvZiAhPT0gXCLppplcIikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDjgq3jg7PjgrDnjovjgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShmcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKSh0byl944G45YuV44GP44GP44G+44KK44KT44GQ44KSJHtraW5nLnNpZGV944GM6Kmm44G/44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoZnJvbSl944Gr44Gv6aaZ6LuK44Gn44Gv44Gq44GE6aeS44GM44GC44KK44G+44GZYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGxhbmNlLmNhbl9rdW1hbCkge1xyXG4gICAgICAgICAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgdG8sIGtpbmcpO1xyXG4gICAgICAgICAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgZnJvbSwgbGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBwaGFzZTogXCJwaWVjZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBib2FyZDogb2xkLmJvYXJkLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRfb2ZfYmxhY2s6IG9sZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIGJ5X3dob206IG9sZC53aG9fZ29lc19uZXh0XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDjgq3jg7PjgrDnjovjgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShmcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKSh0byl944G45YuV44GP44GP44G+44KK44KT44GQ44KSJHtraW5nLnNpZGV944GM6Kmm44G/44Gm44GE44G+44GZ44GM44CB44GT44Gu6aaZ6LuK44Gv5omT44Gf44KM44Gf6aaZ6LuK44Gq44Gu44Gn44GP44G+44KK44KT44GQ44Gu5a++6LGh5aSW44Gn44GZYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoa2luZy5oYXNfbW92ZWRfb25seV9vbmNlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpZmYgPSAoMCwgc2lkZV8xLmNvb3JkRGlmZlNlZW5Gcm9tKShraW5nLnNpZGUsIHsgdG86IHRvLCBmcm9tIH0pO1xyXG4gICAgICAgICAgICBpZiAoZGlmZi52ID09PSAwICYmIChkaWZmLmggPT09IDIgfHwgZGlmZi5oID09PSAtMikgJiZcclxuICAgICAgICAgICAgICAgICgoa2luZy5zaWRlID09PSBcIum7klwiICYmIGZyb21bMV0gPT09IFwi5YWrXCIpIHx8IChraW5nLnNpZGUgPT09IFwi55m9XCIgJiYgZnJvbVsxXSA9PT0gXCLkuoxcIikpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FzdGxpbmcob2xkLCB7IGZyb20sIHRvOiB0bywgc2lkZToga2luZy5zaWRlIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2tpbmcuc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKSh0byl944Kt44Go44Gu44GT44Go44Gn44GZ44GM44CB44Gd44Gu44KI44GG44Gq56e75YuV44GM44Gn44GN44KLJHtraW5nLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoXCLjgq1cIil944Gv55uk5LiK44Gr44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtraW5nLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkodG8pfeOCreOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7a2luZy5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKFwi44KtXCIpfeOBr+ebpOS4iuOBq+OBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZnVuY3Rpb24gXFxga3VtYWxpbmcyKClcXGAgY2FsbGVkIG9uIGEgbm9uLWtpbmcgcGllY2VgKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogUmVzb2x2ZWQg44Gq54q25oWL44Gr6aeS44OV44Kn44Kk44K644KS6YGp55So44CC55yB55Wl44GV44KM44Gf5oOF5aCx44KS5b6p5YWD44GX44Gq44GM44KJ6YGp55So44GX44Gq44GN44KD44GE44GR44Gq44GE44Gu44Gn44CB44GL44Gq44KK44GX44KT44Gp44GE44CCXHJcbiAqIEBwYXJhbSBvbGQg5ZG844Gz5Ye644GX5b6M44Gr56C05aOK44GV44KM44Gm44GE44KL5Y+v6IO95oCn44GM44GC44KL44Gu44Gn44CB5b6M44Gn5L2/44GE44Gf44GE44Gq44KJ44OH44Kj44O844OX44Kz44OU44O844GX44Gm44GK44GP44GT44Go44CCXHJcbiAqIEBwYXJhbSBvXHJcbiAqL1xyXG5mdW5jdGlvbiBwbGF5X3BpZWNlX3BoYXNlKG9sZCwgbykge1xyXG4gICAgLy8gVGhlIHRoaW5nIGlzIHRoYXQgd2UgaGF2ZSB0byBpbmZlciB3aGljaCBwaWVjZSBoYXMgbW92ZWQsIHNpbmNlIHRoZSB1c3VhbCBub3RhdGlvbiBkb2VzIG5vdCBzaWduaWZ5XHJcbiAgICAvLyB3aGVyZSB0aGUgcGllY2UgY29tZXMgZnJvbS5cclxuICAgIC8vIOmdouWAkuOBquOBruOBr+OAgeWFt+S9k+eahOOBq+OBqeOBrumnkuOBjOWLleOBhOOBn+OBruOBi+OCkuOAgeaji+itnOOBruaDheWgseOBi+OCieW+qeWFg+OBl+OBpuOChOOCieOBquOBhOOBqOOBhOOBkeOBquOBhOOBqOOBhOOBhueCueOBp+OBguOCi++8iOaZrumAmuWni+eCueOBr+abuOOBi+OBquOBhOOBruOBp++8ieOAglxyXG4gICAgLy8gZmlyc3QsIHVzZSB0aGUgYHNpZGVgIGZpZWxkIGFuZCB0aGUgYHByb2ZgIGZpZWxkIHRvIGxpc3QgdXAgdGhlIHBvc3NpYmxlIHBvaW50cyBvZiBvcmlnaW4gXHJcbiAgICAvLyAobm90ZSB0aGF0IFwiaW4gaGFuZFwiIGlzIGEgcG9zc2liaWxpdHkpLlxyXG4gICAgY29uc3QgcG9zc2libGVfcG9pbnRzX29mX29yaWdpbiA9ICgwLCBib2FyZF8xLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mKShvbGQuYm9hcmQsIG8uc2lkZSwgby5wcm9mKTtcclxuICAgIGNvbnN0IGhhbmQgPSBvbGRbby5zaWRlID09PSBcIueZvVwiID8gXCJoYW5kX29mX3doaXRlXCIgOiBcImhhbmRfb2ZfYmxhY2tcIl07XHJcbiAgICBjb25zdCBleGlzdHNfaW5faGFuZCA9IGhhbmQuc29tZShwcm9mID0+IHByb2YgPT09IG8ucHJvZik7XHJcbiAgICBpZiAodHlwZW9mIG8uZnJvbSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIGlmIChvLmZyb20gPT09IFwi5omTXCIpIHtcclxuICAgICAgICAgICAgaWYgKGV4aXN0c19pbl9oYW5kKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKDAsIHR5cGVfMS5pc1VucHJvbW90ZWRTaG9naVByb2Zlc3Npb24pKG8ucHJvZikpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyYWNodXRlKG9sZCwgeyBzaWRlOiBvLnNpZGUsIHByb2Y6IG8ucHJvZiwgdG86IG8udG8gfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uIOS7peWkluOBr+aJi+mnkuOBq+WFpeOBo+OBpuOBhOOCi+OBr+OBmuOBjOOBquOBhOOBruOBp+OAgVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGV4aXN0c19pbl9oYW5kIOOBjOa6gOOBn+OBleOCjOOBpuOBhOOCi+aZgueCueOBpyBVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uIOOBp+OBguOCi+OBk+OBqOOBr+aXouOBq+eiuuWumuOBl+OBpuOBhOOCi1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInNob3VsZCBub3QgcmVhY2ggaGVyZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z95omT44Go44Gu44GT44Go44Gn44GZ44GM44CBJHtvLnNpZGV944Gu5omL6aeS44GrJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jga/jgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChvLmZyb20gPT09IFwi5Y+zXCIpIHtcclxuICAgICAgICAgICAgY29uc3QgcHJ1bmVkID0gcG9zc2libGVfcG9pbnRzX29mX29yaWdpbi5maWx0ZXIoZnJvbSA9PiBjYW5fbW92ZShvbGQuYm9hcmQsIHsgZnJvbSwgdG86IG8udG8gfSkpO1xyXG4gICAgICAgICAgICBpZiAocHJ1bmVkLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3lj7Pjgajjga7jgZPjgajjgafjgZnjgYzjgIHjgZ3jga7jgojjgYbjgarnp7vli5XjgYzjgafjgY3jgoske28uc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBr+ebpOS4iuOBq+OBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0bW9zdCA9ICgwLCBzaWRlXzEuUmlnaHRtb3N0V2hlblNlZW5Gcm9tKShvLnNpZGUsIHBydW5lZCk7XHJcbiAgICAgICAgICAgIGlmIChyaWdodG1vc3QubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbW92ZV9waWVjZShvbGQsIHsgZnJvbTogcmlnaHRtb3N0WzBdLCB0bzogby50bywgc2lkZTogby5zaWRlLCBwcm9tb3RlOiBvLnByb21vdGVzID8/IG51bGwgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7by5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944GM55uk5LiK44Gr6KSH5pWw44GC44KK44G+44GZYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoby5mcm9tID09PSBcIuW3plwiKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBydW5lZCA9IHBvc3NpYmxlX3BvaW50c19vZl9vcmlnaW4uZmlsdGVyKGZyb20gPT4gY2FuX21vdmUob2xkLmJvYXJkLCB7IGZyb20sIHRvOiBvLnRvIH0pKTtcclxuICAgICAgICAgICAgaWYgKHBydW5lZC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z95bem44Go44Gu44GT44Go44Gn44GZ44GM44CB44Gd44Gu44KI44GG44Gq56e75YuV44GM44Gn44GN44KLJHtvLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jga/nm6TkuIrjgavjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBsZWZ0bW9zdCA9ICgwLCBzaWRlXzEuTGVmdG1vc3RXaGVuU2VlbkZyb20pKG8uc2lkZSwgcHJ1bmVkKTtcclxuICAgICAgICAgICAgaWYgKGxlZnRtb3N0Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vdmVfcGllY2Uob2xkLCB7IGZyb206IGxlZnRtb3N0WzBdLCB0bzogby50bywgc2lkZTogby5zaWRlLCBwcm9tb3RlOiBvLnByb21vdGVzID8/IG51bGwgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7by5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944GM55uk5LiK44Gr6KSH5pWw44GC44KK44G+44GZYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIuOAjOaJk+OAjeOAjOWPs+OAjeOAjOW3puOAjeOAjOaIkOOAjeOAjOS4jeaIkOOAjeS7peWkluOBruaOpeWwvui+nuOBr+acquWun+ijheOBp+OBmeOAgu+8l+WFremHke+8iO+8l+S6lO+8ieOBquOBqeOBqOabuOOBhOOBpuS4i+OBleOBhOOAglwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlb2Ygby5mcm9tID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgLy8g6aeS44GM44Gp44GT44GL44KJ5p2l44Gf44GL44GM5YiG44GL44KJ44Gq44GE44CCXHJcbiAgICAgICAgLy8g44GT44Gu44KI44GG44Gq44Go44GN44Gr44Gv44CBXHJcbiAgICAgICAgLy8g44O75omT44Gk44GX44GL44Gq44GE44Gq44KJ5omT44GkXHJcbiAgICAgICAgLy8g44O744Gd44GG44Gn44Gq44GP44Gm44CB55uu55qE5Zyw44Gr6KGM44GR44KL6aeS44GM55uk5LiK44GrIDEg56iu6aGe44GX44GL44Gq44GE44Gq44KJ44CB44Gd44KM44KS44GZ44KLXHJcbiAgICAgICAgLy8g44Go44GE44GG6Kej5rG644KS44GZ44KL44GT44Go44Gr44Gq44KL44CCXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyDjgZfjgYvjgZfjgIHjgZPjga7jgrLjg7zjg6DjgavjgYrjgYTjgabjgIHkuozjg53jga/jgIznnYDmiYvjgafjgY3jgarjgYTmiYvjgI3jgafjga/jgarjgY/jgabjgIHjgIznnYDmiYvjgZfjgZ/lvozjgavjgIHnn7Pjg5XjgqfjgqTjgrrop6PmtojlvozjgavjgoLjgZ3jgozjgYzmrovjgaPjgabjgZfjgb7jgaPjgabjgYTjgZ/jgonjgIHlj43liYfosqDjgZHjgI3jgajjgarjgovjgoLjga7jgafjgYLjgovjgIJcclxuICAgICAgICAvLyDjgZPjga7liY3mj5Djga7jgoLjgajjgafjgIHjg53jgYzmqKrkuKbjgbPjgZfjgabjgYTjgovjgajjgY3jgavjgIHniYfmlrnjga7jg53jga7liY3jgavjgYLjgovpp5LjgpLlj5bjgo3jgYbjgajjgZfjgabjgYTjgovnirbms4HjgpLogIPjgYjjgabjgbvjgZfjgYTjgIJcclxuICAgICAgICAvLyDjgZnjgovjgajjgIHluLjorZjnmoTjgavjga/jgZ3jgpPjgarjgYLjgYvjgonjgZXjgb7jgarkuozjg53jga/mjIfjgZXjgarjgYTjga7jgafjgIEx44Oe44K55YmN6YCy44GX44Gm5Y+W44KL44Gu44GM5b2T44Gf44KK5YmN44Gn44GC44KK44CBXHJcbiAgICAgICAgLy8g44Gd44KM44KS5qOL6K2c44Gr6LW344GT44GZ44Go44GN44Gr44KP44GW44KP44GW44CM55u044CN44KS5LuY44GR44KL44Gq44Gp44OQ44Kr44OQ44Kr44GX44GE44CCXHJcbiAgICAgICAgLy8g44KI44Gj44Gm44CB5Ye655m654K55o6o6KuW44Gr44GK44GE44Gm44Gv44CB5pyA5Yid44Gv5LqM44Od44Gv5o6S6Zmk44GX44Gm5o6o6KuW44GZ44KL44GT44Go44Go44GZ44KL44CCXHJcbiAgICAgICAgLy8gV2UgaGF2ZSBubyBpbmZvIG9uIHdoZXJlIHRoZSBwaWVjZSBjYW1lIGZyb20uXHJcbiAgICAgICAgLy8gSW4gc3VjaCBjYXNlcywgdGhlIHJhdGlvbmFsIHdheSBvZiBpbmZlcmVuY2UgaXNcclxuICAgICAgICAvLyAqIFBhcmFjaHV0ZSBhIHBpZWNlIGlmIHlvdSBoYXZlIHRvLlxyXG4gICAgICAgIC8vICogT3RoZXJ3aXNlLCBpZiB0aGVyZSBpcyBvbmx5IG9uZSBwaWVjZSBvbiBib2FyZCB0aGF0IGNhbiBnbyB0byB0aGUgc3BlY2lmaWVkIGRlc3RpbmF0aW9uLCB0YWtlIHRoYXQgbW92ZS5cclxuICAgICAgICAvLyBcclxuICAgICAgICAvLyBIb3dldmVyLCBpbiB0aGlzIGdhbWUsIGRvdWJsZWQgcGF3bnMgYXJlIG5vdCBhbiBpbXBvc3NpYmxlIG1vdmUsIGJ1dCByYXRoZXIgYSBtb3ZlIHRoYXQgY2F1c2UgeW91IHRvIGxvc2UgaWYgaXQgcmVtYWluZWQgZXZlbiBhZnRlciB0aGUgcmVtb3ZhbC1ieS1nby5cclxuICAgICAgICAvLyBVbmRlciBzdWNoIGFuIGFzc3VtcHRpb24sIGNvbnNpZGVyIHRoZSBzaXR1YXRpb24gd2hlcmUgdGhlcmUgYXJlIHR3byBwYXducyBuZXh0IHRvIGVhY2ggb3RoZXIgYW5kIHRoZXJlIGlzIGFuIGVuZW15IHBpZWNlIHJpZ2h0IGluIGZyb250IG9mIG9uZSBvZiBpdC5cclxuICAgICAgICAvLyBJbiBzdWNoIGEgY2FzZSwgaXQgaXMgdmVyeSBlYXN5IHRvIHNlZSB0aGF0IHRha2luZyB0aGUgcGllY2UgZGlhZ29uYWxseSByZXN1bHRzIGluIGRvdWJsZWQgcGF3bnMuXHJcbiAgICAgICAgLy8gSGVuY2UsIHdoZW4gd3JpdGluZyB0aGF0IG1vdmUgZG93biwgeW91IGRvbid0IHdhbnQgdG8gZXhwbGljaXRseSBhbm5vdGF0ZSBzdWNoIGEgY2FzZSB3aXRoIOebtC5cclxuICAgICAgICAvLyBUaGVyZWZvcmUsIHdoZW4gaW5mZXJyaW5nIHRoZSBwb2ludCBvZiBvcmlnaW4sIEkgZmlyc3QgaWdub3JlIHRoZSBkb3VibGVkIHBhd25zLlxyXG4gICAgICAgIGNvbnN0IHBydW5lZCA9IHBvc3NpYmxlX3BvaW50c19vZl9vcmlnaW4uZmlsdGVyKGZyb20gPT4gY2FuX21vdmVfYW5kX25vdF9jYXVzZV9kb3VibGVkX3Bhd25zKG9sZC5ib2FyZCwgeyBmcm9tLCB0bzogby50byB9KSk7XHJcbiAgICAgICAgaWYgKHBydW5lZC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgaWYgKG8ucHJvZiA9PT0gXCLjgq1cIikge1xyXG4gICAgICAgICAgICAgICAgLy8g44Kt44Oj44K544Oq44Oz44Kw44GK44KI44Gz44GP44G+44KK44KT44GQ44Gv44Kt44Oz44Kw546L44Gu5YuV44GN44Go44GX44Gm5pu444GP44CCXHJcbiAgICAgICAgICAgICAgICAvLyDluLjjgavjgq3jg7PjgrDjgYzpgJrluLjli5XjgZHjgarjgYTnr4Tlm7Ljgbjjga7np7vli5XjgajjgarjgovjgIJcclxuICAgICAgICAgICAgICAgIHJldHVybiBrdW1hbGluZzIob2xkLCBwb3NzaWJsZV9wb2ludHNfb2Zfb3JpZ2luWzBdLCBvLnRvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChleGlzdHNfaW5faGFuZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCgwLCB0eXBlXzEuaXNVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uKShvLnByb2YpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFjaHV0ZShvbGQsIHsgc2lkZTogby5zaWRlLCBwcm9mOiBvLnByb2YsIHRvOiBvLnRvIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVW5wcm9tb3RlZFNob2dpUHJvZmVzc2lvbiDku6XlpJbjga/miYvpp5LjgavlhaXjgaPjgabjgYTjgovjga/jgZrjgYzjgarjgYTjga7jgafjgIFcclxuICAgICAgICAgICAgICAgICAgICAvLyBleGlzdHNfaW5faGFuZCDjgYzmuoDjgZ/jgZXjgozjgabjgYTjgovmmYLngrnjgacgVW5wcm9tb3RlZFNob2dpUHJvZmVzc2lvbiDjgafjgYLjgovjgZPjgajjga/ml6LjgavnorrlrprjgZfjgabjgYTjgotcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzaG91bGQgbm90IHJlYWNoIGhlcmVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcnVuZWRfYWxsb3dpbmdfZG91YmxlZF9wYXducyA9IHBvc3NpYmxlX3BvaW50c19vZl9vcmlnaW4uZmlsdGVyKGZyb20gPT4gY2FuX21vdmUob2xkLmJvYXJkLCB7IGZyb20sIHRvOiBvLnRvIH0pKTtcclxuICAgICAgICAgICAgICAgIGlmIChwcnVuZWRfYWxsb3dpbmdfZG91YmxlZF9wYXducy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7by5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944Gv55uk5LiK44Gr44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwcnVuZWRfYWxsb3dpbmdfZG91YmxlZF9wYXducy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmcm9tID0gcHJ1bmVkX2FsbG93aW5nX2RvdWJsZWRfcGF3bnNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vdmVfcGllY2Uob2xkLCB7IGZyb20sIHRvOiBvLnRvLCBzaWRlOiBvLnNpZGUsIHByb21vdGU6IG8ucHJvbW90ZXMgPz8gbnVsbCB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z944Go44Gu44GT44Go44Gn44GZ44GM44CB44Gd44Gu44KI44GG44Gq56e75YuV44GM44Gn44GN44KLJHtvLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jgYznm6TkuIrjgavopIfmlbDjgYLjgorjgIHjgZfjgYvjgoLjganjgozjgpLmjIfjgZfjgabjgoLkuozjg53jgafjgZlgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwcnVuZWQubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZyb20gPSBwcnVuZWRbMF07XHJcbiAgICAgICAgICAgIHJldHVybiBtb3ZlX3BpZWNlKG9sZCwgeyBmcm9tLCB0bzogby50bywgc2lkZTogby5zaWRlLCBwcm9tb3RlOiBvLnByb21vdGVzID8/IG51bGwgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7by5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944GM55uk5LiK44Gr6KSH5pWw44GC44KK44CB44Gp44KM44KS5o6h55So44GZ44KL44G544GN44GL5YiG44GL44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgZnJvbSA9IG8uZnJvbTtcclxuICAgICAgICBpZiAoIXBvc3NpYmxlX3BvaW50c19vZl9vcmlnaW4uc29tZShjID0+ICgwLCBjb29yZGluYXRlXzEuY29vcmRFcSkoYywgZnJvbSkpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444GoJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jgpLli5XjgYvjgZ3jgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShmcm9tKX3jgavjga8ke28uc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBr+OBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2FuX21vdmUob2xkLmJvYXJkLCB7IGZyb20sIHRvOiBvLnRvIH0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtb3ZlX3BpZWNlKG9sZCwgeyBmcm9tLCB0bzogby50bywgc2lkZTogby5zaWRlLCBwcm9tb3RlOiBvLnByb21vdGVzID8/IG51bGwgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG8ucHJvZiA9PT0gXCLjgq1cIikge1xyXG4gICAgICAgICAgICAvLyDjgq3jg6Pjgrnjg6rjg7PjgrDjgYrjgojjgbPjgY/jgb7jgorjgpPjgZDjga/jgq3jg7PjgrDnjovjga7li5XjgY3jgajjgZfjgabmm7jjgY/jgIJcclxuICAgICAgICAgICAgLy8g5bi444Gr44Kt44Oz44Kw44GM6YCa5bi45YuV44GR44Gq44GE56+E5Zuy44G444Gu56e75YuV44Go44Gq44KL44CCXHJcbiAgICAgICAgICAgIHJldHVybiBrdW1hbGluZzIob2xkLCBmcm9tLCBvLnRvKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444GoJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jgpLli5XjgYvjgZ3jgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIEkeygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBryR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOWLleOBkeOCi+mnkuOBp+OBr+OBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnRzLnBsYXlfcGllY2VfcGhhc2UgPSBwbGF5X3BpZWNlX3BoYXNlO1xyXG4vKiogYG8uc2lkZWAg44GM6aeS44KSIGBvLmZyb21gIOOBi+OCiSBgby50b2Ag44Gr5YuV44GL44GZ44CC44Gd44Gu6aeS44GMIGBvLmZyb21gIOOBi+OCiSBgby50b2Ag44G444GoIGNhbl9tb3ZlIOOBp+OBguOCi+OBk+OBqOOCkuimgeaxguOBmeOCi+OAguOCreODo+OCueODquODs+OCsOODu+OBj+OBvuOCiuOCk+OBkOOBr+aJseOCj+OBquOBhOOBjOOAgeOCouODs+ODkeODg+OCteODs+OBr+aJseOBhuOAglxyXG4gKi9cclxuZnVuY3Rpb24gbW92ZV9waWVjZShvbGQsIG8pIHtcclxuICAgIGNvbnN0IHBpZWNlX3RoYXRfbW92ZXMgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKG9sZC5ib2FyZCwgby5mcm9tKTtcclxuICAgIGlmICghcGllY2VfdGhhdF9tb3Zlcykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjga7np7vli5XjgpLoqabjgb/jgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBq+OBr+mnkuOBjOOBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocGllY2VfdGhhdF9tb3Zlcy50eXBlID09PSBcIueigVwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBruenu+WLleOCkuippuOBv+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944Gr44GC44KL44Gu44Gv56KB55+z44Gn44GC44KK44CB6aeS44Gn44Gv44GC44KK44G+44Gb44KTYCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwaWVjZV90aGF0X21vdmVzLnNpZGUgIT09IG8uc2lkZSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjga7np7vli5XjgpLoqabjgb/jgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBq+OBguOCi+OBruOBryR7KDAsIHNpZGVfMS5vcHBvbmVudE9mKShvLnNpZGUpfeOBrumnkuOBp+OBmWApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcmVzID0gY2FuX21vdmUob2xkLmJvYXJkLCB7IGZyb206IG8uZnJvbSwgdG86IG8udG8gfSk7XHJcbiAgICBpZiAocmVzID09PSBcImVuIHBhc3NhbnRcIikge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqICAgICAgICAgIGZyb21bMF0gdG9bMF1cclxuICAgICAgICAgKiAgICAgICAgIHwgIC4uICB8ICAuLiAgfFxyXG4gICAgICAgICAqIHRvWzFdICAgfCAgLi4gIHwgIHRvICB8XHJcbiAgICAgICAgICogZnJvbVsxXSB8IGZyb20gfCBwYXduIHxcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdCBjb29yZF9ob3Jpem9udGFsbHlfYWRqYWNlbnQgPSBbby50b1swXSwgby5mcm9tWzFdXTtcclxuICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLnRvLCBwaWVjZV90aGF0X21vdmVzKTtcclxuICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLmZyb20sIG51bGwpO1xyXG4gICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIGNvb3JkX2hvcml6b250YWxseV9hZGphY2VudCwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcGhhc2U6IFwicGllY2VfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgICAgIGhhbmRfb2ZfYmxhY2s6IG9sZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgICAgICBoYW5kX29mX3doaXRlOiBvbGQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICAgICAgYnlfd2hvbTogb2xkLndob19nb2VzX25leHRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIXJlcykge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjga7np7vli5XjgpLoqabjgb/jgabjgYTjgb7jgZnjgYzjgIHpp5Ljga7li5XjgY3kuIrjgZ3jga7jgojjgYbjgarnp7vli5Xjga/jgafjgY3jgb7jgZvjgpNgKTtcclxuICAgIH1cclxuICAgIGlmICgoMCwgdHlwZV8xLmlzX3Byb21vdGFibGUpKHBpZWNlX3RoYXRfbW92ZXMucHJvZilcclxuICAgICAgICAmJiAoKDAsIHNpZGVfMS5pc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3MpKDMsIG8uc2lkZSwgby5mcm9tKSB8fCAoMCwgc2lkZV8xLmlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cykoMywgby5zaWRlLCBvLnRvKSkpIHtcclxuICAgICAgICBpZiAoby5wcm9tb3RlKSB7XHJcbiAgICAgICAgICAgIGlmIChwaWVjZV90aGF0X21vdmVzLnByb2YgPT09IFwi5qGCXCIpIHtcclxuICAgICAgICAgICAgICAgIHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9IFwi5oiQ5qGCXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocGllY2VfdGhhdF9tb3Zlcy5wcm9mID09PSBcIumKgFwiKSB7XHJcbiAgICAgICAgICAgICAgICBwaWVjZV90aGF0X21vdmVzLnByb2YgPSBcIuaIkOmKgFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9PT0gXCLppplcIikge1xyXG4gICAgICAgICAgICAgICAgcGllY2VfdGhhdF9tb3Zlcy5wcm9mID0gXCLmiJDppplcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwaWVjZV90aGF0X21vdmVzLnByb2YgPT09IFwi44KtXCIpIHtcclxuICAgICAgICAgICAgICAgIHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9IFwi6LaFXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocGllY2VfdGhhdF9tb3Zlcy5wcm9mID09PSBcIuODnVwiKSB7XHJcbiAgICAgICAgICAgICAgICBwaWVjZV90aGF0X21vdmVzLnByb2YgPSBcIuOBqFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoKHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9PT0gXCLmoYJcIiAmJiAoMCwgc2lkZV8xLmlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cykoMiwgby5zaWRlLCBvLnRvKSlcclxuICAgICAgICAgICAgICAgIHx8IChwaWVjZV90aGF0X21vdmVzLnByb2YgPT09IFwi6aaZXCIgJiYgKDAsIHNpZGVfMS5pc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3MpKDEsIG8uc2lkZSwgby50bykpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7cGllY2VfdGhhdF9tb3Zlcy5wcm9mfeS4jeaIkOOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgSR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKHBpZWNlX3RoYXRfbW92ZXMucHJvZil944KS5LiN5oiQ44Gn6KGM44GN44Gp44GT44KN44Gu44Gq44GE44Go44GT44KN44Gr6KGM44GL44Gb44KL44GT44Go44Gv44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAoby5wcm9tb3RlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtwaWVjZV90aGF0X21vdmVzLnByb2Z9JHtvLnByb21vdGUgPyBcIuaIkFwiIDogXCLkuI3miJBcIn3jgajjga7jgZPjgajjgafjgZnjgYzjgIHjgZPjga7np7vli5Xjga/miJDjgorjgpLnmbrnlJ/jgZXjgZvjgarjgYTjga7jgafjgIwke28ucHJvbW90ZSA/IFwi5oiQXCIgOiBcIuS4jeaIkFwifeOAjeihqOiomOOBr+OBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IG9jY3VwaWVyID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShvbGQuYm9hcmQsIG8udG8pO1xyXG4gICAgaWYgKCFvY2N1cGllcikge1xyXG4gICAgICAgIGlmIChwaWVjZV90aGF0X21vdmVzLnByb2YgPT09IFwi44OdXCIgJiYgcGllY2VfdGhhdF9tb3Zlcy5uZXZlcl9tb3ZlZCAmJiBvLnRvWzFdID09PSBcIuS6lFwiKSB7XHJcbiAgICAgICAgICAgIHBpZWNlX3RoYXRfbW92ZXMuc3ViamVjdF90b19lbl9wYXNzYW50ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby50bywgcGllY2VfdGhhdF9tb3Zlcyk7XHJcbiAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby5mcm9tLCBudWxsKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwaGFzZTogXCJwaWVjZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICAgICAgYm9hcmQ6IG9sZC5ib2FyZCxcclxuICAgICAgICAgICAgaGFuZF9vZl9ibGFjazogb2xkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgICAgICBieV93aG9tOiBvbGQud2hvX2dvZXNfbmV4dFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChvY2N1cGllci50eXBlID09PSBcIueigVwiKSB7XHJcbiAgICAgICAgaWYgKG9jY3VwaWVyLnNpZGUgPT09IG8uc2lkZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Gu56e75YuV44KS6Kmm44G/44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944Gr6Ieq5YiG44Gu56KB55+z44GM44GC44KL44Gu44Gn44CB56e75YuV44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLnRvLCBwaWVjZV90aGF0X21vdmVzKTtcclxuICAgICAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby5mcm9tLCBudWxsKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBoYXNlOiBcInBpZWNlX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgICAgICAgICAgYm9hcmQ6IG9sZC5ib2FyZCxcclxuICAgICAgICAgICAgICAgIGhhbmRfb2ZfYmxhY2s6IG9sZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgICAgICAgICAgaGFuZF9vZl93aGl0ZTogb2xkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgICAgICAgICBieV93aG9tOiBvbGQud2hvX2dvZXNfbmV4dFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChvY2N1cGllci5zaWRlID09PSBvLnNpZGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBruenu+WLleOCkuippuOBv+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBq+iHquWIhuOBrumnkuOBjOOBguOCi+OBruOBp+OAgeenu+WLleOBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChvY2N1cGllci50eXBlID09PSBcIuOBl+OCh1wiKSB7XHJcbiAgICAgICAgICAgIChvLnNpZGUgPT09IFwi55m9XCIgPyBvbGQuaGFuZF9vZl93aGl0ZSA6IG9sZC5oYW5kX29mX2JsYWNrKS5wdXNoKCgwLCB0eXBlXzEudW5wcm9tb3RlKShvY2N1cGllci5wcm9mKSk7XHJcbiAgICAgICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8udG8sIHBpZWNlX3RoYXRfbW92ZXMpO1xyXG4gICAgICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLmZyb20sIG51bGwpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcGhhc2U6IFwicGllY2VfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgICAgICAgICBib2FyZDogb2xkLmJvYXJkLFxyXG4gICAgICAgICAgICAgICAgaGFuZF9vZl9ibGFjazogb2xkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgICAgICAgICBoYW5kX29mX3doaXRlOiBvbGQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICAgICAgICAgIGJ5X3dob206IG9sZC53aG9fZ29lc19uZXh0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLnRvLCBwaWVjZV90aGF0X21vdmVzKTtcclxuICAgICAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby5mcm9tLCBudWxsKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBoYXNlOiBcInBpZWNlX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgICAgICAgICAgYm9hcmQ6IG9sZC5ib2FyZCxcclxuICAgICAgICAgICAgICAgIGhhbmRfb2ZfYmxhY2s6IG9sZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgICAgICAgICAgaGFuZF9vZl93aGl0ZTogb2xkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgICAgICAgICBieV93aG9tOiBvbGQud2hvX2dvZXNfbmV4dFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vKipcclxuICogYG8uZnJvbWAg44Gr6aeS44GM44GC44Gj44Gm44Gd44Gu6aeS44GMIGBvLnRvYCDjgbjjgajli5XjgY/kvZnlnLDjgYzjgYLjgovjgYvjganjgYbjgYvjgpLov5TjgZnjgIJgby50b2Ag44GM5ZGz5pa544Gu6aeS44Gn5Z+L44G+44Gj44Gm44GE44Gf44KJIGZhbHNlIOOBoOOBl+OAgeODneODvOODs+OBruaWnOOCgeWJjeOBq+aVtemnkuOBjOOBquOBhOOBquOCieaWnOOCgeWJjeOBryBmYWxzZSDjgajjgarjgovjgIJcclxuICogIENoZWNrcyB3aGV0aGVyIHRoZXJlIGlzIGEgcGllY2UgYXQgYG8uZnJvbWAgd2hpY2ggY2FuIG1vdmUgdG8gYG8udG9gLiBXaGVuIGBvLnRvYCBpcyBvY2N1cGllZCBieSBhbiBhbGx5LCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgZmFsc2UsXHJcbiAqICBhbmQgd2hlbiB0aGVyZSBpcyBubyBlbmVteSBwaWVjZSBkaWFnb25hbCB0byBwYXduLCB0aGlzIGZ1bmN0aW9uIHJldHVybnMgZmFsc2UgZm9yIHRoZSBkaWFnb25hbCBkaXJlY3Rpb24uXHJcbiAqIEBwYXJhbSBib2FyZFxyXG4gKiBAcGFyYW0gb1xyXG4gKiBAcmV0dXJuc1xyXG4gKi9cclxuZnVuY3Rpb24gY2FuX21vdmUoYm9hcmQsIG8pIHtcclxuICAgIGNvbnN0IHAgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBvLmZyb20pO1xyXG4gICAgaWYgKCFwKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKHAudHlwZSA9PT0gXCLnooFcIikge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGNvbnN0IHBpZWNlX2F0X2Rlc3RpbmF0aW9uID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgby50byk7XHJcbiAgICBpZiAocGllY2VfYXRfZGVzdGluYXRpb24/LnNpZGUgPT09IHAuc2lkZSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChwLnByb2YgIT09IFwi44OdXCIpIHtcclxuICAgICAgICByZXR1cm4gKDAsIGNhbl9zZWVfMS5jYW5fc2VlKShib2FyZCwgbyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBkZWx0YSA9ICgwLCBzaWRlXzEuY29vcmREaWZmU2VlbkZyb20pKHAuc2lkZSwgbyk7XHJcbiAgICAvLyBjYW4gYWx3YXlzIG1vdmUgZm9yd2FyZFxyXG4gICAgaWYgKGRlbHRhLnYgPT09IDEgJiYgZGVsdGEuaCA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgLy8gY2FuIHRha2UgZGlhZ29uYWxseSwgYXMgbG9uZyBhcyBhbiBvcHBvbmVudCdzIHBpZWNlIGlzIGxvY2F0ZWQgdGhlcmUsIG9yIHdoZW4gaXQgaXMgYW4gZW4gcGFzc2FudFxyXG4gICAgaWYgKGRlbHRhLnYgPT09IDEgJiYgKGRlbHRhLmggPT09IDEgfHwgZGVsdGEuaCA9PT0gLTEpKSB7XHJcbiAgICAgICAgaWYgKHBpZWNlX2F0X2Rlc3RpbmF0aW9uPy5zaWRlID09PSAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKHAuc2lkZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBjb29yZF9ob3Jpem9udGFsbHlfYWRqYWNlbnQgPSAoMCwgc2lkZV8xLmFwcGx5RGVsdGFTZWVuRnJvbSkocC5zaWRlLCBvLmZyb20sIHsgdjogMCwgaDogZGVsdGEuaCB9KTtcclxuICAgICAgICAgICAgY29uc3QgcGllY2VfaG9yaXpvbnRhbGx5X2FkamFjZW50ID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgY29vcmRfaG9yaXpvbnRhbGx5X2FkamFjZW50KTtcclxuICAgICAgICAgICAgaWYgKG8uZnJvbVsxXSA9PT0gXCLkupRcIlxyXG4gICAgICAgICAgICAgICAgJiYgcGllY2VfaG9yaXpvbnRhbGx5X2FkamFjZW50Py50eXBlID09PSBcIuOCuVwiXHJcbiAgICAgICAgICAgICAgICAmJiBwaWVjZV9ob3Jpem9udGFsbHlfYWRqYWNlbnQucHJvZiA9PT0gXCLjg51cIlxyXG4gICAgICAgICAgICAgICAgJiYgcGllY2VfaG9yaXpvbnRhbGx5X2FkamFjZW50LnN1YmplY3RfdG9fZW5fcGFzc2FudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiZW4gcGFzc2FudFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHAubmV2ZXJfbW92ZWQgJiYgZGVsdGEudiA9PT0gMiAmJiBkZWx0YS5oID09PSAwKSB7XHJcbiAgICAgICAgLy8gY2FuIG1vdmUgdHdvIGluIHRoZSBmcm9udCwgdW5sZXNzIGJsb2NrZWRcclxuICAgICAgICBjb25zdCBjb29yZF9pbl9mcm9udCA9ICgwLCBzaWRlXzEuYXBwbHlEZWx0YVNlZW5Gcm9tKShwLnNpZGUsIG8uZnJvbSwgeyB2OiAxLCBoOiAwIH0pO1xyXG4gICAgICAgIGNvbnN0IGNvb3JkX3R3b19pbl9mcm9udCA9ICgwLCBzaWRlXzEuYXBwbHlEZWx0YVNlZW5Gcm9tKShwLnNpZGUsIG8uZnJvbSwgeyB2OiAyLCBoOiAwIH0pO1xyXG4gICAgICAgIGlmICgoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBjb29yZF9pbl9mcm9udClcclxuICAgICAgICAgICAgfHwgKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgY29vcmRfdHdvX2luX2Zyb250KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuY2FuX21vdmUgPSBjYW5fbW92ZTtcclxuZnVuY3Rpb24gY2FuX21vdmVfYW5kX25vdF9jYXVzZV9kb3VibGVkX3Bhd25zKGJvYXJkLCBvKSB7XHJcbiAgICBpZiAoIWNhbl9tb3ZlKGJvYXJkLCBvKSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGNvbnN0IHBpZWNlID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgby5mcm9tKTtcclxuICAgIGlmIChwaWVjZT8udHlwZSA9PT0gXCLjgrlcIiAmJiBwaWVjZS5wcm9mID09PSBcIuODnVwiKSB7XHJcbiAgICAgICAgaWYgKG8uZnJvbVswXSA9PT0gby50b1swXSkgeyAvLyBubyByaXNrIG9mIGRvdWJsZWQgcGF3bnMgd2hlbiB0aGUgcGF3biBtb3ZlcyBzdHJhaWdodFxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhd25fY29vcmRzID0gKDAsIGJvYXJkXzEubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGVfYW5kX3Byb2YpKGJvYXJkLCBwaWVjZS5zaWRlLCBcIuODnVwiKTtcclxuICAgICAgICAgICAgY29uc3QgcHJvYmxlbWF0aWNfcGF3bnMgPSBwYXduX2Nvb3Jkcy5maWx0ZXIoKFtjb2wsIF9yb3ddKSA9PiBjb2wgPT09IG8udG9bMF0pO1xyXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBhcmUgbm8gcHJvYmxlbWF0aWMgcGF3bnMsIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGFyZSwgd2Ugd2FudCB0byBhdm9pZCBzdWNoIGEgbW92ZSBpbiB0aGlzIGZ1bmN0aW9uLCBzbyBmYWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvYmxlbWF0aWNfcGF3bnMubGVuZ3RoID09PSAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGNhc3RsaW5nKG9sZCwgbykge1xyXG4gICAgLy8g5qSc5p+75riI77yaXHJcbiAgICAvLyDikaAg44Kt44Oz44Kw546L44GMMeWbnuOBoOOBkeWJjemAsuOBl+OBn+eKtuaFi+OBp1xyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgLy8g44GT44KM44GL44KJ5qSc5p+777yaXHJcbiAgICAvLyDikaEg44Kt44Oj44K544Oq44Oz44Kw5a++6LGh44Gu44Or44O844Kv77yI5Lul5LiLQe+8ieOBr+S4gOW6puOCguWLleOBhOOBpuOBiuOCieOBmlxyXG4gICAgLy8g4pGiIOebuOaJi+OBi+OCieOBrueOi+aJi++8iOODgeOCp+ODg+OCr++8ieOBjOaOm+OBi+OBo+OBpuOBiuOCieOBmuenu+WLleWFiOOBruODnuOCueOBqOmAmumBjueCueOBruODnuOCueOBq+OCguaVteOBrumnkuOBruWIqeOBjeOBr+OBquOBj1xyXG4gICAgLy8g4pGjIOOCreODs+OCsOeOi+OBqEHjga7plpPjgavpp5LvvIjjg4HjgqfjgrnjgIHlsIbmo4vvvInjgYznhKHjgYTloLTlkIjjgavkvb/nlKjjgafjgY3jgotcclxuICAgIGNvbnN0IGZyb21fY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKG8uZnJvbVswXSk7XHJcbiAgICBjb25zdCB0b19jb2x1bW5faW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2Yoby50b1swXSk7XHJcbiAgICBjb25zdCByb29rX2Nvb3JkID0gW2Zyb21fY29sdW1uX2luZGV4IDwgdG9fY29sdW1uX2luZGV4ID8gXCLvvJFcIiA6IFwi77yZXCIsIG8uZnJvbVsxXV07XHJcbiAgICBjb25zdCByb29rID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShvbGQuYm9hcmQsIHJvb2tfY29vcmQpO1xyXG4gICAgY29uc3QgY29vcmRfdGhhdF9raW5nX3Bhc3Nlc190aHJvdWdoID0gW1wi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCJbKGZyb21fY29sdW1uX2luZGV4ICsgdG9fY29sdW1uX2luZGV4KSAvIDJdLCBvLmZyb21bMV1dO1xyXG4gICAgaWYgKHJvb2s/LnR5cGUgIT09IFwi44K5XCIgfHwgcm9vay5wcm9mICE9PSBcIuODq1wiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBqOOCreODs+OCsOeOi+OCkuOCreODo+OCueODquODs+OCsOOBl+OCiOOBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHJvb2tfY29vcmQpfeOBq+ODq+ODvOOCr+OBjOOBquOBhOOBruOBp+OCreODo+OCueODquODs+OCsOOBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgfVxyXG4gICAgaWYgKCFyb29rLm5ldmVyX21vdmVkKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBqOOCreODs+OCsOeOi+OCkuOCreODo+OCueODquODs+OCsOOBl+OCiOOBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHJvb2tfY29vcmQpfeOBq+OBguOCi+ODq+ODvOOCr+OBr+aXouOBq+WLleOBhOOBn+OBk+OBqOOBjOOBguOCi+ODq+ODvOOCr+OBquOBruOBp+OCreODo+OCueODquODs+OCsOOBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgfVxyXG4gICAgaWYgKCgwLCBjYW5fc2VlXzEuZG9fYW55X29mX215X3BpZWNlc19zZWUpKG9sZC5ib2FyZCwgby5mcm9tLCAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKG8uc2lkZSkpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBqOOCreODs+OCsOeOi+OCkuOCreODo+OCueODquODs+OCsOOBl+OCiOOBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgeebuOaJi+OBi+OCieOBrueOi+aJi++8iOODgeOCp+ODg+OCr++8ieOBjOaOm+OBi+OBo+OBpuOBhOOCi+OBruOBp+OCreODo+OCueODquODs+OCsOOBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgfVxyXG4gICAgaWYgKCgwLCBjYW5fc2VlXzEuZG9fYW55X29mX215X3BpZWNlc19zZWUpKG9sZC5ib2FyZCwgY29vcmRfdGhhdF9raW5nX3Bhc3Nlc190aHJvdWdoLCAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKG8uc2lkZSkpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBqOOCreODs+OCsOeOi+OCkuOCreODo+OCueODquODs+OCsOOBl+OCiOOBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgemAmumBjueCueOBruODnuOCueOBq+aVteOBrumnkuOBruWIqeOBjeOBjOOBguOCi+OBruOBp+OCreODo+OCueODquODs+OCsOOBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgfVxyXG4gICAgaWYgKCgwLCBjYW5fc2VlXzEuZG9fYW55X29mX215X3BpZWNlc19zZWUpKG9sZC5ib2FyZCwgby50bywgKDAsIHNpZGVfMS5vcHBvbmVudE9mKShvLnNpZGUpKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjgajjgq3jg7PjgrDnjovjgpLjgq3jg6Pjgrnjg6rjg7PjgrDjgZfjgojjgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIHnp7vli5XlhYjjga7jg57jgrnjgavmlbXjga7pp5Ljga7liKnjgY3jgYzjgYLjgovjga7jgafjgq3jg6Pjgrnjg6rjg7PjgrDjgafjgY3jgb7jgZvjgpNgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGNvb3Jkc19iZXR3ZWVuX2tpbmdfYW5kX3Jvb2sgPSAoMCwgY29vcmRpbmF0ZV8xLmNvbHVtbnNCZXR3ZWVuKShvLmZyb21bMF0sIG8udG9bMF0pLm1hcChjb2wgPT4gW2NvbCwgby5mcm9tWzFdXSk7XHJcbiAgICBjb25zdCBoYXNfc2hvZ2lfb3JfY2hlc3NfcGllY2UgPSBjb29yZHNfYmV0d2Vlbl9raW5nX2FuZF9yb29rLnNvbWUoY29vcmQgPT4ge1xyXG4gICAgICAgIGNvbnN0IGVudGl0eSA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkob2xkLmJvYXJkLCBjb29yZCk7XHJcbiAgICAgICAgcmV0dXJuIGVudGl0eT8udHlwZSA9PT0gXCLjgZfjgodcIiB8fCBlbnRpdHk/LnR5cGUgPT09IFwi44K5XCIgfHwgZW50aXR5Py50eXBlID09PSBcIueigVwiO1xyXG4gICAgfSk7XHJcbiAgICBpZiAoaGFzX3Nob2dpX29yX2NoZXNzX3BpZWNlKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBqOOCreODs+OCsOeOi+OCkuOCreODo+OCueODquODs+OCsOOBl+OCiOOBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgeOCreODs+OCsOeOi+OBqOODq+ODvOOCr+OBrumWk+OBq+mnkuOBjOOBguOCi+OBruOBp+OCreODo+OCueODquODs+OCsOOBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgfVxyXG4gICAgLy8g4pGkIOmWk+OBq+eigeefs+OBjOOBguOCjOOBsOWPluOCiumZpOOBjVxyXG4gICAgY29vcmRzX2JldHdlZW5fa2luZ19hbmRfcm9vay5mb3JFYWNoKGNvb3JkID0+ICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIGNvb3JkLCBudWxsKSk7XHJcbiAgICAvLyDikaUg44Kt44Oz44Kw546L44GvIEEg44Gu5pa55ZCR44GrIDIg44Oe44K556e75YuV44GXXHJcbiAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLnRvLCB7XHJcbiAgICAgICAgcHJvZjogXCLjgq1cIixcclxuICAgICAgICBzaWRlOiBvLnNpZGUsXHJcbiAgICAgICAgdHlwZTogXCLnjotcIixcclxuICAgICAgICBoYXNfbW92ZWRfb25seV9vbmNlOiBmYWxzZSxcclxuICAgICAgICBuZXZlcl9tb3ZlZDogZmFsc2UsXHJcbiAgICB9KTtcclxuICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8uZnJvbSwgbnVsbCk7XHJcbiAgICAvLyDikaYgQSDjga/jgq3jg7PjgrDnjovjgpLpo5vjgbPotorjgZfjgZ/pmqPjga7jg57jgrnjgavnp7vli5XjgZnjgotcclxuICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIGNvb3JkX3RoYXRfa2luZ19wYXNzZXNfdGhyb3VnaCwgcm9vayk7XHJcbiAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCByb29rX2Nvb3JkLCBudWxsKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcGhhc2U6IFwicGllY2VfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgYm9hcmQ6IG9sZC5ib2FyZCxcclxuICAgICAgICBoYW5kX29mX2JsYWNrOiBvbGQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICBoYW5kX29mX3doaXRlOiBvbGQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICBieV93aG9tOiBvbGQud2hvX2dvZXNfbmV4dFxyXG4gICAgfTtcclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmFwcGx5RGVsdGFTZWVuRnJvbSA9IGV4cG9ydHMuaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzID0gZXhwb3J0cy5jb29yZERpZmZTZWVuRnJvbSA9IGV4cG9ydHMuTGVmdG1vc3RXaGVuU2VlbkZyb20gPSBleHBvcnRzLlJpZ2h0bW9zdFdoZW5TZWVuRnJvbSA9IGV4cG9ydHMub3Bwb25lbnRPZiA9IHZvaWQgMDtcclxuY29uc3QgY29vcmRpbmF0ZV8xID0gcmVxdWlyZShcIi4vY29vcmRpbmF0ZVwiKTtcclxuZnVuY3Rpb24gb3Bwb25lbnRPZihzaWRlKSB7XHJcbiAgICBpZiAoc2lkZSA9PT0gXCLpu5JcIilcclxuICAgICAgICByZXR1cm4gXCLnmb1cIjtcclxuICAgIGVsc2VcclxuICAgICAgICByZXR1cm4gXCLpu5JcIjtcclxufVxyXG5leHBvcnRzLm9wcG9uZW50T2YgPSBvcHBvbmVudE9mO1xyXG5mdW5jdGlvbiBSaWdodG1vc3RXaGVuU2VlbkZyb20oc2lkZSwgY29vcmRzKSB7XHJcbiAgICBpZiAoc2lkZSA9PT0gXCLpu5JcIikge1xyXG4gICAgICAgIHJldHVybiAoMCwgY29vcmRpbmF0ZV8xLlJpZ2h0bW9zdFdoZW5TZWVuRnJvbUJsYWNrKShjb29yZHMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICgwLCBjb29yZGluYXRlXzEuTGVmdG1vc3RXaGVuU2VlbkZyb21CbGFjaykoY29vcmRzKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLlJpZ2h0bW9zdFdoZW5TZWVuRnJvbSA9IFJpZ2h0bW9zdFdoZW5TZWVuRnJvbTtcclxuZnVuY3Rpb24gTGVmdG1vc3RXaGVuU2VlbkZyb20oc2lkZSwgY29vcmRzKSB7XHJcbiAgICBpZiAoc2lkZSA9PT0gXCLpu5JcIikge1xyXG4gICAgICAgIHJldHVybiAoMCwgY29vcmRpbmF0ZV8xLkxlZnRtb3N0V2hlblNlZW5Gcm9tQmxhY2spKGNvb3Jkcyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKDAsIGNvb3JkaW5hdGVfMS5SaWdodG1vc3RXaGVuU2VlbkZyb21CbGFjaykoY29vcmRzKTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLkxlZnRtb3N0V2hlblNlZW5Gcm9tID0gTGVmdG1vc3RXaGVuU2VlbkZyb207XHJcbi8qKiB2ZXJ0aWNhbCDjgYwgKzEgPSDliY3pgLLjgIDjgIBob3Jpem9udGFsIOOBjCArMSA9IOW3plxyXG4gKi9cclxuZnVuY3Rpb24gY29vcmREaWZmU2VlbkZyb20oc2lkZSwgbykge1xyXG4gICAgaWYgKHNpZGUgPT09IFwi55m9XCIpIHtcclxuICAgICAgICByZXR1cm4gKDAsIGNvb3JkaW5hdGVfMS5jb29yZERpZmYpKG8pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgeyBoLCB2IH0gPSAoMCwgY29vcmRpbmF0ZV8xLmNvb3JkRGlmZikobyk7XHJcbiAgICAgICAgcmV0dXJuIHsgaDogLWgsIHY6IC12IH07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5jb29yZERpZmZTZWVuRnJvbSA9IGNvb3JkRGlmZlNlZW5Gcm9tO1xyXG5mdW5jdGlvbiBpc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3Mobiwgc2lkZSwgY29vcmQpIHtcclxuICAgIGNvbnN0IHJvdyA9IGNvb3JkWzFdO1xyXG4gICAgaWYgKHNpZGUgPT09IFwi6buSXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIi5pbmRleE9mKHJvdykgPCBuO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIFwi5Lmd5YWr5LiD5YWt5LqU5Zub5LiJ5LqM5LiAXCIuaW5kZXhPZihyb3cpIDwgbjtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cyA9IGlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cztcclxuLy8gc2luY2UgdGhpcyBmdW5jdGlvbiBpcyBvbmx5IHVzZWQgdG8gaW50ZXJwb2xhdGUgYmV0d2VlbiB0d28gdmFsaWQgcG9pbnRzLCB0aGVyZSBpcyBubyBuZWVkIHRvIHBlcmZvcm0gYW5kIG91dC1vZi1ib3VuZHMgY2hlY2suXHJcbmZ1bmN0aW9uIGFwcGx5RGVsdGFTZWVuRnJvbShzaWRlLCBmcm9tLCBkZWx0YSkge1xyXG4gICAgaWYgKHNpZGUgPT09IFwi55m9XCIpIHtcclxuICAgICAgICBjb25zdCBbZnJvbV9jb2x1bW4sIGZyb21fcm93XSA9IGZyb207XHJcbiAgICAgICAgY29uc3QgZnJvbV9yb3dfaW5kZXggPSBcIuS4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5nVwiLmluZGV4T2YoZnJvbV9yb3cpO1xyXG4gICAgICAgIGNvbnN0IGZyb21fY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGZyb21fY29sdW1uKTtcclxuICAgICAgICBjb25zdCB0b19jb2x1bW5faW5kZXggPSBmcm9tX2NvbHVtbl9pbmRleCArIGRlbHRhLmg7XHJcbiAgICAgICAgY29uc3QgdG9fcm93X2luZGV4ID0gZnJvbV9yb3dfaW5kZXggKyBkZWx0YS52O1xyXG4gICAgICAgIGNvbnN0IGNvbHVtbnMgPSBbXCLvvJlcIiwgXCLvvJhcIiwgXCLvvJdcIiwgXCLvvJZcIiwgXCLvvJVcIiwgXCLvvJRcIiwgXCLvvJNcIiwgXCLvvJJcIiwgXCLvvJFcIl07XHJcbiAgICAgICAgY29uc3Qgcm93cyA9IFtcIuS4gFwiLCBcIuS6jFwiLCBcIuS4iVwiLCBcIuWbm1wiLCBcIuS6lFwiLCBcIuWFrVwiLCBcIuS4g1wiLCBcIuWFq1wiLCBcIuS5nVwiXTtcclxuICAgICAgICByZXR1cm4gW2NvbHVtbnNbdG9fY29sdW1uX2luZGV4XSwgcm93c1t0b19yb3dfaW5kZXhdXTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IFtmcm9tX2NvbHVtbiwgZnJvbV9yb3ddID0gZnJvbTtcclxuICAgICAgICBjb25zdCBmcm9tX3Jvd19pbmRleCA9IFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZihmcm9tX3Jvdyk7XHJcbiAgICAgICAgY29uc3QgZnJvbV9jb2x1bW5faW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2YoZnJvbV9jb2x1bW4pO1xyXG4gICAgICAgIGNvbnN0IHRvX2NvbHVtbl9pbmRleCA9IGZyb21fY29sdW1uX2luZGV4IC0gZGVsdGEuaDtcclxuICAgICAgICBjb25zdCB0b19yb3dfaW5kZXggPSBmcm9tX3Jvd19pbmRleCAtIGRlbHRhLnY7XHJcbiAgICAgICAgY29uc3QgY29sdW1ucyA9IFtcIu+8mVwiLCBcIu+8mFwiLCBcIu+8l1wiLCBcIu+8llwiLCBcIu+8lVwiLCBcIu+8lFwiLCBcIu+8k1wiLCBcIu+8klwiLCBcIu+8kVwiXTtcclxuICAgICAgICBjb25zdCByb3dzID0gW1wi5LiAXCIsIFwi5LqMXCIsIFwi5LiJXCIsIFwi5ZubXCIsIFwi5LqUXCIsIFwi5YWtXCIsIFwi5LiDXCIsIFwi5YWrXCIsIFwi5LmdXCJdO1xyXG4gICAgICAgIHJldHVybiBbY29sdW1uc1t0b19jb2x1bW5faW5kZXhdLCByb3dzW3RvX3Jvd19pbmRleF1dO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuYXBwbHlEZWx0YVNlZW5Gcm9tID0gYXBwbHlEZWx0YVNlZW5Gcm9tO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnJlbW92ZV9zdXJyb3VuZGVkID0gdm9pZCAwO1xyXG5mdW5jdGlvbiByZW1vdmVfc3Vycm91bmRlZChjb2xvcl90b19iZV9yZW1vdmVkLCBib2FyZCkge1xyXG4gICAgY29uc3QgYm9hcmRfID0gYm9hcmQubWFwKHJvdyA9PiByb3cubWFwKHNpZGUgPT4gc2lkZSA9PT0gbnVsbCA/IFwiZW1wdHlcIiA6IHsgc2lkZSwgdmlzaXRlZDogZmFsc2UsIGNvbm5lY3RlZF9jb21wb25lbnRfaW5kZXg6IC0xIH0pKTtcclxuICAgIC8vIERlcHRoLWZpcnN0IHNlYXJjaCB0byBhc3NpZ24gYSB1bmlxdWUgaW5kZXggdG8gZWFjaCBjb25uZWN0ZWQgY29tcG9uZW50XHJcbiAgICAvLyDlkITpgKPntZDmiJDliIbjgavkuIDmhI/jgarjgqTjg7Pjg4fjg4Pjgq/jgrnjgpLjgbXjgovjgZ/jgoHjga7mt7HjgZXlhKrlhYjmjqLntKJcclxuICAgIGNvbnN0IGRmc19zdGFjayA9IFtdO1xyXG4gICAgY29uc3QgaW5kaWNlc190aGF0X3N1cnZpdmUgPSBbXTtcclxuICAgIGxldCBpbmRleCA9IDA7XHJcbiAgICBmb3IgKGxldCBJID0gMDsgSSA8IGJvYXJkXy5sZW5ndGg7IEkrKykge1xyXG4gICAgICAgIGZvciAobGV0IEogPSAwOyBKIDwgYm9hcmRfW0ldLmxlbmd0aDsgSisrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNxID0gYm9hcmRfW0ldW0pdO1xyXG4gICAgICAgICAgICBpZiAoc3EgIT09IFwiZW1wdHlcIiAmJiBzcS5zaWRlID09PSBjb2xvcl90b19iZV9yZW1vdmVkICYmICFzcS52aXNpdGVkKSB7XHJcbiAgICAgICAgICAgICAgICBkZnNfc3RhY2sucHVzaCh7IGk6IEksIGo6IEogfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgd2hpbGUgKGRmc19zdGFjay5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2ZXJ0ZXhfY29vcmQgPSBkZnNfc3RhY2sucG9wKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2ZXJ0ZXggPSBib2FyZF9bdmVydGV4X2Nvb3JkLmldW3ZlcnRleF9jb29yZC5qXTtcclxuICAgICAgICAgICAgICAgIGlmICh2ZXJ0ZXggPT09IFwiZW1wdHlcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGBkZnNfc3RhY2tgIOOBq+epuuOBruODnuOCueOBr+ODl+ODg+OCt+ODpeOBleOCjOOBpuOBhOOBquOBhOOBr+OBmlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFuIGVtcHR5IHNxdWFyZSBzaG91bGQgbm90IGJlIHB1c2hlZCB0byBgZGZzX3N0YWNrYFxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInNob3VsZCBub3QgcmVhY2ggaGVyZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZlcnRleC52aXNpdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHZlcnRleC5jb25uZWN0ZWRfY29tcG9uZW50X2luZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgeyBpOiB2ZXJ0ZXhfY29vcmQuaSwgajogdmVydGV4X2Nvb3JkLmogKyAxIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyBpOiB2ZXJ0ZXhfY29vcmQuaSwgajogdmVydGV4X2Nvb3JkLmogLSAxIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyBpOiB2ZXJ0ZXhfY29vcmQuaSArIDEsIGo6IHZlcnRleF9jb29yZC5qIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgeyBpOiB2ZXJ0ZXhfY29vcmQuaSAtIDEsIGo6IHZlcnRleF9jb29yZC5qIH0sXHJcbiAgICAgICAgICAgICAgICBdLmZpbHRlcigoeyBpLCBqIH0pID0+IHsgY29uc3Qgcm93ID0gYm9hcmRfW2ldOyByZXR1cm4gcm93ICYmIDAgPD0gaiAmJiBqIDwgcm93Lmxlbmd0aDsgfSkuZm9yRWFjaCgoeyBpLCBqIH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZWlnaGJvciA9IGJvYXJkX1tpXVtqXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmVpZ2hib3IgPT09IFwiZW1wdHlcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBuZXh0IHRvIGFuIGVtcHR5IHNxdWFyZSAoYSBsaWJlcnR5KTsgc3Vydml2ZXMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOWRvOWQuOeCueOBjOmao+aOpeOBl+OBpuOBhOOCi+OBruOBp+OAgeOBk+OBriBpbmRleCDjgYzmjK/jgonjgozjgabjgYTjgovpgKPntZDmiJDliIbjga/kuLjjgIXnlJ/jgY3lu7bjgbPjgotcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5kaWNlc190aGF0X3N1cnZpdmUucHVzaChpbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5laWdoYm9yLnNpZGUgPT09IGNvbG9yX3RvX2JlX3JlbW92ZWQgJiYgIW5laWdoYm9yLnZpc2l0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGZzX3N0YWNrLnB1c2goeyBpLCBqIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gaW5kaWNlc190aGF0X3N1cnZpdmUg44Gr6KiY6LyJ44Gu44Gq44GEIGluZGV4IOOBruOChOOBpOOCieOCkuWJiumZpOOBl+OBpiBhbnMg44G444Go6Lui6KiYXHJcbiAgICAvLyBDb3B5IHRoZSBjb250ZW50IHRvIGBhbnNgIHdoaWxlIGRlbGV0aW5nIHRoZSBjb25uZWN0ZWQgY29tcG9uZW50cyB3aG9zZSBpbmRleCBpcyBub3QgaW4gYGluZGljZXNfdGhhdF9zdXJ2aXZlYFxyXG4gICAgY29uc3QgYW5zID0gW107XHJcbiAgICBmb3IgKGxldCBJID0gMDsgSSA8IGJvYXJkXy5sZW5ndGg7IEkrKykge1xyXG4gICAgICAgIGNvbnN0IHJvdyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IEogPSAwOyBKIDwgYm9hcmRfW0ldLmxlbmd0aDsgSisrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNxID0gYm9hcmRfW0ldW0pdO1xyXG4gICAgICAgICAgICBpZiAoc3EgPT09IFwiZW1wdHlcIikge1xyXG4gICAgICAgICAgICAgICAgcm93LnB1c2gobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoc3Euc2lkZSA9PT0gY29sb3JfdG9fYmVfcmVtb3ZlZFxyXG4gICAgICAgICAgICAgICAgJiYgIWluZGljZXNfdGhhdF9zdXJ2aXZlLmluY2x1ZGVzKHNxLmNvbm5lY3RlZF9jb21wb25lbnRfaW5kZXgpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkb2VzIG5vdCBzdXJ2aXZlXHJcbiAgICAgICAgICAgICAgICByb3cucHVzaChudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKHNxLnNpZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFucy5wdXNoKHJvdyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYW5zO1xyXG59XHJcbmV4cG9ydHMucmVtb3ZlX3N1cnJvdW5kZWQgPSByZW1vdmVfc3Vycm91bmRlZDtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5pc19wcm9tb3RhYmxlID0gZXhwb3J0cy5pc1VucHJvbW90ZWRTaG9naVByb2Zlc3Npb24gPSBleHBvcnRzLnByb2Zlc3Npb25GdWxsTmFtZSA9IGV4cG9ydHMudW5wcm9tb3RlID0gdm9pZCAwO1xyXG5mdW5jdGlvbiB1bnByb21vdGUoYSkge1xyXG4gICAgaWYgKGEgPT09IFwi5oiQ5qGCXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi5qGCXCI7XHJcbiAgICBpZiAoYSA9PT0gXCLmiJDpioBcIilcclxuICAgICAgICByZXR1cm4gXCLpioBcIjtcclxuICAgIGlmIChhID09PSBcIuaIkOmmmVwiKVxyXG4gICAgICAgIHJldHVybiBcIummmVwiO1xyXG4gICAgcmV0dXJuIGE7XHJcbn1cclxuZXhwb3J0cy51bnByb21vdGUgPSB1bnByb21vdGU7XHJcbmZ1bmN0aW9uIHByb2Zlc3Npb25GdWxsTmFtZShhKSB7XHJcbiAgICBpZiAoYSA9PT0gXCLjgahcIikge1xyXG4gICAgICAgIHJldHVybiBcIuOBqOOCr+OCo+ODvOODs1wiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYSA9PT0gXCLjgq1cIikge1xyXG4gICAgICAgIHJldHVybiBcIuOCreODs+OCsOeOi1wiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYSA9PT0gXCLjgq9cIikge1xyXG4gICAgICAgIHJldHVybiBcIuOCr+OCo+ODvOODs1wiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYSA9PT0gXCLjg4pcIikge1xyXG4gICAgICAgIHJldHVybiBcIuODiuOCpOODiFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYSA9PT0gXCLjg5NcIikge1xyXG4gICAgICAgIHJldHVybiBcIuODk+OCt+ODp+ODg+ODl1wiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYSA9PT0gXCLjg51cIikge1xyXG4gICAgICAgIHJldHVybiBcIuODneODvOODs+WFtVwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYSA9PT0gXCLjg6tcIikge1xyXG4gICAgICAgIHJldHVybiBcIuODq+ODvOOCr1wiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYSA9PT0gXCLotoVcIikge1xyXG4gICAgICAgIHJldHVybiBcIuOCueODvOODkeODvOOCreODs+OCsOeOi1wiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYSA9PT0gXCLmoYJcIikge1xyXG4gICAgICAgIHJldHVybiBcIuahgummrFwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYSA9PT0gXCLppplcIikge1xyXG4gICAgICAgIHJldHVybiBcIummmei7ilwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYSA9PT0gXCLpioBcIikge1xyXG4gICAgICAgIHJldHVybiBcIumKgOWwhlwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoYSA9PT0gXCLph5FcIikge1xyXG4gICAgICAgIHJldHVybiBcIumHkeWwhlwiO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGE7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5wcm9mZXNzaW9uRnVsbE5hbWUgPSBwcm9mZXNzaW9uRnVsbE5hbWU7XHJcbmZ1bmN0aW9uIGlzVW5wcm9tb3RlZFNob2dpUHJvZmVzc2lvbihhKSB7XHJcbiAgICByZXR1cm4gYSA9PT0gXCLppplcIiB8fFxyXG4gICAgICAgIGEgPT09IFwi5qGCXCIgfHxcclxuICAgICAgICBhID09PSBcIumKgFwiIHx8XHJcbiAgICAgICAgYSA9PT0gXCLph5FcIjtcclxufVxyXG5leHBvcnRzLmlzVW5wcm9tb3RlZFNob2dpUHJvZmVzc2lvbiA9IGlzVW5wcm9tb3RlZFNob2dpUHJvZmVzc2lvbjtcclxuZnVuY3Rpb24gaXNfcHJvbW90YWJsZShwcm9mKSB7XHJcbiAgICByZXR1cm4gcHJvZiA9PT0gXCLmoYJcIiB8fCBwcm9mID09PSBcIumKgFwiIHx8IHByb2YgPT09IFwi6aaZXCIgfHwgcHJvZiA9PT0gXCLjgq1cIiB8fCBwcm9mID09PSBcIuODnVwiO1xyXG59XHJcbmV4cG9ydHMuaXNfcHJvbW90YWJsZSA9IGlzX3Byb21vdGFibGU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXJzZSA9IGV4cG9ydHMucGFyc2Vfb25lID0gZXhwb3J0cy5wYXJzZV9wcm9mZXNzaW9uID0gZXhwb3J0cy5wYXJzZV9jb29yZCA9IHZvaWQgMDtcbmZ1bmN0aW9uIHBhcnNlX2Nvb3JkKHMpIHtcbiAgICBjb25zdCBjb2x1bW4gPSAoKGMpID0+IHtcbiAgICAgICAgaWYgKGMgPT09IFwi77yRXCIgfHwgYyA9PT0gXCIxXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIu+8kVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77ySXCIgfHwgYyA9PT0gXCIyXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIu+8klwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yTXCIgfHwgYyA9PT0gXCIzXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIu+8k1wiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yUXCIgfHwgYyA9PT0gXCI0XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIu+8lFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yVXCIgfHwgYyA9PT0gXCI1XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIu+8lVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yWXCIgfHwgYyA9PT0gXCI2XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIu+8llwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yXXCIgfHwgYyA9PT0gXCI3XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIu+8l1wiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yYXCIgfHwgYyA9PT0gXCI4XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIu+8mFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yZXCIgfHwgYyA9PT0gXCI5XCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIu+8mVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDmo4vorZzjga7nrYvvvIjliJfvvInjgYzjgIwke2N944CN44Gn44GC44KK44CM77yR44Cc77yZ44CN44CMMeOAnDnjgI3jga7jganjgozjgafjgoLjgYLjgorjgb7jgZvjgpNgKTtcbiAgICAgICAgfVxuICAgIH0pKHNbMF0pO1xuICAgIGNvbnN0IHJvdyA9ICgoYykgPT4ge1xuICAgICAgICBpZiAoYyA9PT0gXCLvvJFcIiB8fCBjID09PSBcIjFcIiB8fCBjID09PSBcIuS4gFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCLkuIBcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8klwiIHx8IGMgPT09IFwiMlwiIHx8IGMgPT09IFwi5LqMXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIuS6jFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yTXCIgfHwgYyA9PT0gXCIzXCIgfHwgYyA9PT0gXCLkuIlcIikge1xuICAgICAgICAgICAgcmV0dXJuIFwi5LiJXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJRcIiB8fCBjID09PSBcIjRcIiB8fCBjID09PSBcIuWbm1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCLlm5tcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8lVwiIHx8IGMgPT09IFwiNVwiIHx8IGMgPT09IFwi5LqUXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIuS6lFwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yWXCIgfHwgYyA9PT0gXCI2XCIgfHwgYyA9PT0gXCLlha1cIikge1xuICAgICAgICAgICAgcmV0dXJuIFwi5YWtXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJdcIiB8fCBjID09PSBcIjdcIiB8fCBjID09PSBcIuS4g1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCLkuINcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8mFwiIHx8IGMgPT09IFwiOFwiIHx8IGMgPT09IFwi5YWrXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIuWFq1wiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yZXCIgfHwgYyA9PT0gXCI5XCIgfHwgYyA9PT0gXCLkuZ1cIikge1xuICAgICAgICAgICAgcmV0dXJuIFwi5LmdXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOaji+itnOOBruaute+8iOihjO+8ieOBjOOAjCR7Y33jgI3jgafjgYLjgorjgIzvvJHjgJzvvJnjgI3jgIwx44CcOeOAjeOAjOS4gOOAnOS5neOAjeOBruOBqeOCjOOBp+OCguOBguOCiuOBvuOBm+OCk2ApO1xuICAgICAgICB9XG4gICAgfSkoc1sxXSk7XG4gICAgcmV0dXJuIFtjb2x1bW4sIHJvd107XG59XG5leHBvcnRzLnBhcnNlX2Nvb3JkID0gcGFyc2VfY29vcmQ7XG5mdW5jdGlvbiBwYXJzZV9wcm9mZXNzaW9uKHMpIHtcbiAgICBpZiAocyA9PT0gXCLppplcIilcbiAgICAgICAgcmV0dXJuIFwi6aaZXCI7XG4gICAgZWxzZSBpZiAocyA9PT0gXCLmoYJcIilcbiAgICAgICAgcmV0dXJuIFwi5qGCXCI7XG4gICAgZWxzZSBpZiAocyA9PT0gXCLpioBcIilcbiAgICAgICAgcmV0dXJuIFwi6YqAXCI7XG4gICAgZWxzZSBpZiAocyA9PT0gXCLph5FcIilcbiAgICAgICAgcmV0dXJuIFwi6YeRXCI7XG4gICAgZWxzZSBpZiAocyA9PT0gXCLmiJDppplcIiB8fCBzID09PSBcIuadj1wiKVxuICAgICAgICByZXR1cm4gXCLmiJDppplcIjtcbiAgICBlbHNlIGlmIChzID09PSBcIuaIkOahglwiIHx8IHMgPT09IFwi5ZytXCIpXG4gICAgICAgIHJldHVybiBcIuaIkOahglwiO1xuICAgIGVsc2UgaWYgKHMgPT09IFwi5oiQ6YqAXCIgfHwgcyA9PT0gXCLlhahcIilcbiAgICAgICAgcmV0dXJuIFwi5oiQ6YqAXCI7XG4gICAgZWxzZSBpZiAocyA9PT0gXCLjgq9cIilcbiAgICAgICAgcmV0dXJuIFwi44KvXCI7XG4gICAgZWxzZSBpZiAocyA9PT0gXCLjg6tcIilcbiAgICAgICAgcmV0dXJuIFwi44OrXCI7XG4gICAgZWxzZSBpZiAocyA9PT0gXCLjg4pcIilcbiAgICAgICAgcmV0dXJuIFwi44OKXCI7XG4gICAgZWxzZSBpZiAocyA9PT0gXCLjg5NcIilcbiAgICAgICAgcmV0dXJuIFwi44OTXCI7XG4gICAgZWxzZSBpZiAocyA9PT0gXCLjg51cIiB8fCBzID09PSBcIuatqVwiIHx8IHMgPT09IFwi5YW1XCIpXG4gICAgICAgIHJldHVybiBcIuODnVwiO1xuICAgIGVsc2UgaWYgKHMgPT09IFwi44GoXCIpXG4gICAgICAgIHJldHVybiBcIuOBqFwiO1xuICAgIGVsc2UgaWYgKHMgPT09IFwi44KtXCIgfHwgcyA9PT0gXCLnjotcIilcbiAgICAgICAgcmV0dXJuIFwi44KtXCI7XG4gICAgZWxzZSBpZiAocyA9PT0gXCLotoVcIilcbiAgICAgICAgcmV0dXJuIFwi6LaFXCI7XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihg6aeS44Gu56iu6aGe44GM44CMJHtzfeOAjeOBp+OBguOCiuOAjOmmmeOAjeOAjOahguOAjeOAjOmKgOOAjeOAjOmHkeOAjeOAjOaIkOmmmeOAjeOAjOaIkOahguOAjeOAjOaIkOmKgOOAjeOAjOadj+OAjeOAjOWcreOAjeOAjOWFqOOAjeOAjOOCr+OAjeOAjOODq+OAjeOAjOODiuOAjeOAjOODk+OAjeOAjOODneOAjeOAjOatqeOAjeOAjOWFteOAjeOAjOOBqOOAjeOAjOOCreOAjeOAjOeOi+OAjeOAjOi2heOAjeOBruOBqeOCjOOBp+OCguOBguOCiuOBvuOBm+OCk2ApO1xuICAgIH1cbn1cbmV4cG9ydHMucGFyc2VfcHJvZmVzc2lvbiA9IHBhcnNlX3Byb2Zlc3Npb247XG5mdW5jdGlvbiBwYXJzZV9vbmUocykge1xuICAgIC8vIDA6ICAg4payXG4gICAgLy8gMS0yOiDvvJfkupRcbiAgICAvLyAzOiDjg51cbiAgICAvLyAoMy00IGlmIHByb21vdGVkKVxuICAgIGxldCBpbmRleCA9IDA7XG4gICAgY29uc3Qgc2lkZSA9IHNbMF0gPT09IFwi6buSXCIgfHwgc1swXSA9PT0gXCLilrJcIiB8fCBzWzBdID09PSBcIuKYl1wiID8gXCLpu5JcIiA6XG4gICAgICAgIHNbMF0gPT09IFwi55m9XCIgfHwgc1swXSA9PT0gXCLilrNcIiB8fCBzWzBdID09PSBcIuKYllwiID8gXCLnmb1cIiA6ICgoKSA9PiB7IHRocm93IG5ldyBFcnJvcihcIuaji+itnOOBjOOAjOm7kuOAjeOAjOKWsuOAjeOAjOKYl+OAjeOAjOeZveOAjeOAjOKWs+OAjeOAjOKYluOAjeOBruOBqeOCjOOBi+OBp+Wni+OBvuOBo+OBpuOBhOOBvuOBm+OCk1wiKTsgfSkoKTtcbiAgICBpbmRleCsrO1xuICAgIGNvbnN0IHRvID0gcGFyc2VfY29vcmQocy5zbGljZShpbmRleCwgaW5kZXggKyAyKSk7XG4gICAgaW5kZXggKz0gMjtcbiAgICBjb25zdCBwcm9mZXNzaW9uX2xlbmd0aCA9IHNbM10gPT09IFwi5oiQXCIgPyAyIDogMTtcbiAgICBjb25zdCBwcm9mID0gcGFyc2VfcHJvZmVzc2lvbihzLnNsaWNlKGluZGV4LCBpbmRleCArIHByb2Zlc3Npb25fbGVuZ3RoKSk7XG4gICAgaW5kZXggKz0gcHJvZmVzc2lvbl9sZW5ndGg7XG4gICAgLy8gQWxsIHRoYXQgZm9sbG93cyBhcmUgb3B0aW9uYWwuXG4gICAgLy8g5Lul6ZmN44Gv44Kq44OX44K344On44OK44Or44CC44CMMS4g56e75YuV5YWD5piO6KiY44CN44CMMi4g5oiQ44O75LiN5oiQ44CN44CMMy4g56KB55+z44Gu5bqn5qiZ44CN44GM44GT44Gu6aCG55Wq44Gn54++44KM44Gq44GR44KM44Gw44Gq44KJ44Gq44GE44CCXG4gICAgLy8gMS4g56e75YuV5YWD5piO6KiYXG4gICAgLy8g44CM5Y+z44CN44CM5bem44CN44CM5omT44CN44CB44G+44Gf44Gv44CM77yINOS6lO+8ieOAjeOBquOBqVxuICAgIGNvbnN0IGZyb20gPSAoKCkgPT4ge1xuICAgICAgICBpZiAoc1tpbmRleF0gPT09IFwi5Y+zXCIpIHtcbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICByZXR1cm4gXCLlj7NcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzW2luZGV4XSA9PT0gXCLlt6ZcIikge1xuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgIHJldHVybiBcIuW3plwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNbaW5kZXhdID09PSBcIuaJk1wiKSB7XG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgcmV0dXJuIFwi5omTXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc1tpbmRleF0gPT09IFwiKFwiIHx8IHNbaW5kZXhdID09PSBcIu+8iFwiKSB7XG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgY29uc3QgY29vcmQgPSBwYXJzZV9jb29yZChzLnNsaWNlKGluZGV4LCBpbmRleCArIDIpKTtcbiAgICAgICAgICAgIGluZGV4ICs9IDI7XG4gICAgICAgICAgICBpZiAoc1tpbmRleF0gPT09IFwiKVwiIHx8IHNbaW5kZXhdID09PSBcIu+8iVwiKSB7XG4gICAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gY29vcmQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOmWi+OBjeOCq+ODg+OCs+OBqOW6p+aomeOBruW+jOOBq+mWieOBmOOCq+ODg+OCs+OBjOOBguOCiuOBvuOBm+OCk2ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9KSgpO1xuICAgIGNvbnN0IHByb21vdGVzID0gKCgpID0+IHtcbiAgICAgICAgaWYgKHNbaW5kZXhdID09PSBcIuaIkFwiKSB7XG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAocy5zbGljZShpbmRleCwgaW5kZXggKyAyKSA9PT0gXCLkuI3miJBcIikge1xuICAgICAgICAgICAgaW5kZXggKz0gMjtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9KSgpO1xuICAgIGNvbnN0IHN0b25lX3RvID0gKCgpID0+IHtcbiAgICAgICAgY29uc3QgYyA9IHNbaW5kZXhdO1xuICAgICAgICBpZiAoIWMpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgaWYgKChcIjFcIiA8PSBjICYmIGMgPD0gXCI5XCIpIHx8IChcIu+8kVwiIDw9IGMgJiYgYyA8PSBcIu+8mVwiKSkge1xuICAgICAgICAgICAgY29uc3QgY29vcmQgPSBwYXJzZV9jb29yZChzLnNsaWNlKGluZGV4LCBpbmRleCArIDIpKTtcbiAgICAgICAgICAgIGluZGV4ICs9IDI7XG4gICAgICAgICAgICBpZiAoIXNbaW5kZXhdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvb3JkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDmiYvjgIwke3N944CN44Gu5pyr5bC+44Gr6Kej6YeI5LiN6IO944Gq44CMJHtzLnNsaWNlKGluZGV4KX3jgI3jgYzjgYLjgorjgb7jgZlgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5omL44CMJHtzfeOAjeOBruacq+WwvuOBq+ino+mHiOS4jeiDveOBquOAjCR7cy5zbGljZShpbmRleCl944CN44GM44GC44KK44G+44GZYCk7XG4gICAgICAgIH1cbiAgICB9KSgpO1xuICAgIGNvbnN0IHBpZWNlX3BoYXNlID0gcHJvbW90ZXMgIT09IG51bGwgPyAoZnJvbSA/IHsgc2lkZSwgdG8sIHByb2YsIHByb21vdGVzLCBmcm9tIH0gOiB7IHNpZGUsIHRvLCBwcm9mLCBwcm9tb3RlcyB9KVxuICAgICAgICA6IChmcm9tID8geyBzaWRlLCB0bywgcHJvZiwgZnJvbSB9IDogeyBzaWRlLCB0bywgcHJvZiB9KTtcbiAgICByZXR1cm4gc3RvbmVfdG8gPyB7IHBpZWNlX3BoYXNlLCBzdG9uZV90byB9IDogeyBwaWVjZV9waGFzZSB9O1xufVxuZXhwb3J0cy5wYXJzZV9vbmUgPSBwYXJzZV9vbmU7XG5mdW5jdGlvbiBwYXJzZShzKSB7XG4gICAgcyA9IHMucmVwbGFjZSgvKFvpu5LilrLimJfnmb3ilrPimJZdKS9nLCBcIiAkMVwiKTtcbiAgICBjb25zdCBtb3ZlcyA9IHMuc3BsaXQoL1xccy8pO1xuICAgIHJldHVybiBtb3Zlcy5tYXAocyA9PiBzLnRyaW0oKSkuZmlsdGVyKHMgPT4gcyAhPT0gXCJcIikubWFwKHBhcnNlX29uZSk7XG59XG5leHBvcnRzLnBhcnNlID0gcGFyc2U7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3Qgc2hvZ29zc19jb3JlXzEgPSByZXF1aXJlKFwic2hvZ29zcy1jb3JlXCIpO1xyXG5jb25zdCBzaG9nb3NzX3BhcnNlcl8xID0gcmVxdWlyZShcInNob2dvc3MtcGFyc2VyXCIpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgcmVuZGVyKCgwLCBzaG9nb3NzX2NvcmVfMS5nZXRfaW5pdGlhbF9zdGF0ZSkoXCLpu5JcIikpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkX2hpc3RvcnlcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxvYWRfaGlzdG9yeSk7XHJcbn0pO1xyXG5mdW5jdGlvbiBsb2FkX2hpc3RvcnkoKSB7XHJcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaXN0b3J5XCIpLnZhbHVlO1xyXG4gICAgY29uc3QgbW92ZXMgPSAoMCwgc2hvZ29zc19wYXJzZXJfMS5wYXJzZSkodGV4dCk7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gKDAsIHNob2dvc3NfY29yZV8xLm1haW4pKG1vdmVzKTtcclxuICAgICAgICBpZiAoc3RhdGUucGhhc2UgPT09IFwiZ2FtZV9lbmRcIikge1xyXG4gICAgICAgICAgICBhbGVydChg5Yud6ICFOiAke3N0YXRlLnZpY3Rvcn3jgIHnkIbnlLE6ICR7c3RhdGUucmVhc29ufWApO1xyXG4gICAgICAgICAgICByZW5kZXIoc3RhdGUuZmluYWxfc2l0dWF0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlbmRlcihzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBhbGVydChlKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBnZXRDb250ZW50SFRNTEZyb21FbnRpdHkoZW50aXR5KSB7XHJcbiAgICBpZiAoZW50aXR5LnR5cGUgPT09IFwi56KBXCIpXHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICBpZiAoZW50aXR5LnR5cGUgPT09IFwi44K5XCIgJiYgZW50aXR5LnByb2YgIT09IFwi44GoXCIgJiYgZW50aXR5LnByb2YgIT09IFwi44OdXCIpIHtcclxuICAgICAgICByZXR1cm4gYDxzcGFuIHN0eWxlPVwiZm9udC1zaXplOiAyMDAlXCI+JHt7IOOCrTogXCLimZRcIiwg44KvOiBcIuKZlVwiLCDjg6s6IFwi4pmWXCIsIOODkzogXCLimZdcIiwg44OKOiBcIuKZmFwiIH1bZW50aXR5LnByb2ZdfTwvc3Bhbj5gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVudGl0eS5wcm9mO1xyXG59XHJcbmZ1bmN0aW9uIHJlbmRlcihzaXR1YXRpb24pIHtcclxuICAgIGxldCBhbnMgPSBcIlwiO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA5OyBpKyspIHtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDk7IGorKykge1xyXG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSBzaXR1YXRpb24uYm9hcmRbaV1bal07XHJcbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHN0ciA9IGdldENvbnRlbnRIVE1MRnJvbUVudGl0eShlbnRpdHkpO1xyXG4gICAgICAgICAgICBhbnMgKz0gYDxkaXYgY2xhc3M9XCIke2VudGl0eS5zaWRlID09PSBcIueZvVwiID8gXCJ3aGl0ZVwiIDogXCJibGFja1wifVwiIHN0eWxlPVwidG9wOiR7NTAgKyBpICogNTB9cHg7IGxlZnQ6JHsxMDAgKyBqICogNTB9cHg7XCI+JHtzdHJ9PC9kaXY+YDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzaXR1YXRpb24uaGFuZF9vZl93aGl0ZS5mb3JFYWNoKChwcm9mLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGFucyArPSBgPGRpdiBjbGFzcz1cIndoaXRlXCIgc3R5bGU9XCJ0b3A6JHs1MCArIGluZGV4ICogNTB9cHg7IGxlZnQ6IDQwcHg7XCI+JHtwcm9mfTwvZGl2PmA7XHJcbiAgICB9KTtcclxuICAgIHNpdHVhdGlvbi5oYW5kX29mX2JsYWNrLmZvckVhY2goKHByb2YsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgYW5zICs9IGA8ZGl2IGNsYXNzPVwiYmxhY2tcIiBzdHlsZT1cInRvcDokezQ1MCAtIGluZGV4ICogNTB9cHg7IGxlZnQ6IDU4NnB4O1wiPiR7cHJvZn08L2Rpdj5gO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvYXJkXCIpLmlubmVySFRNTCA9IGFucztcclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=