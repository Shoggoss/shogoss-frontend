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
    render((0, shogoss_core_1.get_initial_state)("黒").board);
    document.getElementById("load_history").addEventListener("click", load_history);
});
function load_history() {
    const text = document.getElementById("history").value;
    const moves = (0, shogoss_parser_1.parse)(text);
    try {
        const state = (0, shogoss_core_1.main)(moves);
        if (state.phase === "game_end") {
            alert(`勝者: ${state.victor}、理由: ${state.reason}`);
            render(state.final_situation.board);
        }
        else {
            render(state.board);
        }
    }
    catch (e) {
        alert(e);
    }
}
function getContentHTMLFromEntity(entity) {
    if (entity.type === "碁")
        return "";
    if (entity.type === "ス" && entity.prof !== "と") {
        return `<span style="font-size: 200%">${{ キ: "♔", ク: "♕", ル: "♖", ビ: "♗", ナ: "♘", ポ: "♙" }[entity.prof]}</span>`;
    }
    return entity.prof;
}
function render(board) {
    let ans = "";
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const entity = board[i][j];
            if (entity === null) {
                continue;
            }
            const str = getContentHTMLFromEntity(entity);
            ans += `<div class="${entity.side === "白" ? "white" : "black"}" style="top:${50 + i * 50}px; left:${100 + j * 50}px;">${str}</div>`;
        }
    }
    document.getElementById("board").innerHTML = ans;
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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MUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxnREFBZ0QsY0FBYztBQUNoSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLE9BQU87QUFDM0Isd0JBQXdCLE9BQU87QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQyx3Q0FBd0MsZUFBZSxZQUFZLElBQUksT0FBTyxhQUFhLEdBQUcsSUFBSSxJQUFJO0FBQ3hJO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Nob2dvc3MtY29yZS9kaXN0L2FmdGVyX3N0b25lX3BoYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC9ib2FyZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvY2FuX3NlZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvY29vcmRpbmF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Nob2dvc3MtY29yZS9kaXN0L3BpZWNlX3BoYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC9zaWRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC9zdXJyb3VuZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvdHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1wYXJzZXIvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMucmVzb2x2ZV9hZnRlcl9zdG9uZV9waGFzZSA9IHZvaWQgMDtcclxuY29uc3QgYm9hcmRfMSA9IHJlcXVpcmUoXCIuL2JvYXJkXCIpO1xyXG5jb25zdCBzaWRlXzEgPSByZXF1aXJlKFwiLi9zaWRlXCIpO1xyXG5jb25zdCBzdXJyb3VuZF8xID0gcmVxdWlyZShcIi4vc3Vycm91bmRcIik7XHJcbmNvbnN0IHR5cGVfMSA9IHJlcXVpcmUoXCIuL3R5cGVcIik7XHJcbi8qKiDnn7Pjg5XjgqfjgqTjgrrjgYzntYLkuobjgZfjgZ/lvozjgIHli53mlZfliKTlrprjgajlm7LnooHmpJzmn7vjgpLjgZnjgovjgIIgLyBUbyBiZSBjYWxsZWQgYWZ0ZXIgYSBzdG9uZSBpcyBwbGFjZWQ6IGNoZWNrcyB0aGUgdmljdG9yeSBjb25kaXRpb24gYW5kIHRoZSBnYW1lLW9mLWdvIGNvbmRpdGlvbi5cclxuICog44G+44Gf44CB55u45omL44Gu44Od5YW144Gr44Ki44Oz44OR44OD44K144Oz44OV44Op44Kw44GM44Gk44GE44Gm44GE44Gf44KJ44CB44Gd44KM44KS5Y+W44KK6Zmk44GP77yI6Ieq5YiG44GM5omL44KS5oyH44GX44Gf44GT44Go44Gr44KI44Gj44Gm44CB44Ki44Oz44OR44OD44K144Oz44Gu5qip5Yip44GM5aSx44KP44KM44Gf44Gu44Gn77yJXHJcbiAqIEFsc28sIGlmIHRoZSBvcHBvbmVudCdzIHBhd24gaGFzIGFuIGVuIHBhc3NhbnQgZmxhZywgZGVsZXRlIGl0IChzaW5jZSwgYnkgcGxheWluZyBhIHBpZWNlIHVucmVsYXRlZCB0byBlbiBwYXNzYW50LCB5b3UgaGF2ZSBsb3N0IHRoZSByaWdodCB0byBjYXB0dXJlIGJ5IGVuIHBhc3NhbnQpXHJcbiAqXHJcbiAqIDEuIOiHquWIhuOBrumnkuOBqOefs+OBq+OCiOOBo+OBpuWbsuOBvuOCjOOBpuOBhOOCi+ebuOaJi+OBrumnkuOBqOefs+OCkuOBmeOBueOBpuWPluOCiumZpOOBj1xyXG4gKiAyLiDnm7jmiYvjga7pp5Ljgajnn7PjgavjgojjgaPjgablm7Ljgb7jgozjgabjgYTjgovoh6rliIbjga7pp5Ljgajnn7PjgpLjgZnjgbnjgablj5bjgorpmaTjgY9cclxuICogMy4g5LqM44Od44GM55m655Sf44GX44Gm44GE44KL44GL44O744Kt44Oz44Kw546L44GM55uk6Z2i44GL44KJ6Zmk44GL44KM44Gm44GE44KL44GL44KS5Yik5a6a44CCXHJcbiAqICAgMy0xLiDkuKHjgq3jg7PjgrDnjovjgYzpmaTjgYvjgozjgabjgYTjgZ/jgonjgIHjgqvjg6njg4bjgrjjg6Pjg7PjgrHjg7Pjg5zjgq/jgrfjg7PjgrBcclxuICogICAzLTIuIOiHquWIhuOBrueOi+OBoOOBkemZpOOBi+OCjOOBpuOBhOOBn+OCieOAgeOBneOCjOOBr+OAjOeOi+OBruiHquauuuOBq+OCiOOCi+aVl+WMl+OAjVxyXG4gKiAgIDMtMy4g55u45omL44Gu546L44Gg44GR6Zmk44GL44KM44Gm44GE44KL5aC05ZCI44CBXHJcbiAqICAgICAgIDMtMy0xLiDkuozjg53jgYznmbrnlJ/jgZfjgabjgYTjgarjgZHjgozjgbDjgIHjgZ3jgozjga/jgIznjovjga7mjpLpmaTjgavjgojjgovli53liKnjgI1cclxuICogICAgICAgICAgICAgMy0zLTEtMS4g55u45omL44Gu546L44KS5Y+W44KK6Zmk44GE44Gf44Gu44GM44K544OG44OD44OXIDEuIOOBp+OBguOCiuOAgVxyXG4gKiAgICAgICAgICAgICAgICAgICAgICDjgZfjgYvjgoLjgIzjgZTjgaPjgZ3jgorjgI3vvIhAcmVfaGFrb19tb29u5puw44GP44CBMuWAi+OBizPlgIvvvIlcclxuICogICAgICAgICAgICAgICAgICAgICAg44Gr6Kmy5b2T44GZ44KL44Go44GN44Gr44Gv44CM44K344On44K044K577yB44CN44Gu55m65aOwXHJcbiAqICAgICAgIDMtMy0yLiDkuozjg53jgYznmbrnlJ/jgZfjgabjgYTjgovjgarjgonjgIHjgqvjg6njg4bjgrjjg6Pjg7PjgrHjg7Pjg5zjgq/jgrfjg7PjgrBcclxuICogICAzLTQuIOOBqeOBoeOCieOBrueOi+OCgumZpOOBi+OCjOOBpuOBhOOBquOBhOWgtOWQiOOAgVxyXG4gKiAgICAgICAzLTQtMS4g5LqM44Od44GM55m655Sf44GX44Gm44GE44Gq44GR44KM44Gw44CB44Ky44O844Og57aa6KGMXHJcbiAqICAgICAgIDMtNC0yLiDkuozjg53jgYznmbrnlJ/jgZfjgabjgYTjgovjgarjgonjgIHjgZ3jgozjga/jgIzkuozjg53jgavjgojjgovmlZfljJfjgI1cclxuICpcclxuICogMSDihpIgMiDjga7poIbnlarjgafjgYLjgovmoLnmi6DvvJrjgrPjg7Pjg5Pjg43jg7zjgrfjg6fjg7PjgqLjgr/jg4Pjgq/jga7lrZjlnKhcclxuICogMiDihpIgMyDjga7poIbnlarjgafjgYLjgovmoLnmi6DvvJrlhazlvI/jg6vjg7zjg6vov73oqJhcclxuICog44CM55+z44OV44Kn44Kk44K644KS552A5omL44GX44Gf57WQ5p6c44Go44GX44Gm6Ieq5YiG44Gu44Od44O844Oz5YW144GM55uk5LiK44GL44KJ5raI44GI5LqM44Od44GM6Kej5rG644GV44KM44KL5aC05ZCI44KC44CB5Y+N5YmH44KS44Go44KJ44Ga6YCy6KGM44Gn44GN44KL44CC44CNXHJcbiAqXHJcbiAqIDEuIFJlbW92ZSBhbGwgdGhlIG9wcG9uZW50J3MgcGllY2VzIGFuZCBzdG9uZXMgc3Vycm91bmRlZCBieSB5b3VyIHBpZWNlcyBhbmQgc3RvbmVzXHJcbiAqIDIuIFJlbW92ZSBhbGwgeW91ciBwaWVjZXMgYW5kIHN0b25lcyBzdXJyb3VuZGVkIGJ5IHRoZSBvcHBvbmVudCdzIHBpZWNlcyBhbmQgc3RvbmVzXHJcbiAqIDMuIENoZWNrcyB3aGV0aGVyIHR3byBwYXducyBvY2N1cHkgdGhlIHNhbWUgY29sdW1uLCBhbmQgY2hlY2tzIHdoZXRoZXIgYSBraW5nIGlzIHJlbW92ZWQgZnJvbSB0aGUgYm9hcmQuXHJcbiAqICAgMy0xLiBJZiBib3RoIGtpbmdzIGFyZSByZW1vdmVkLCB0aGF0IGlzIGEgZHJhdywgYW5kIHRoZXJlZm9yZSBhIEthcmF0ZSBSb2NrLVBhcGVyLVNjaXNzb3JzIEJveGluZy5cclxuICogICAzLTIuIElmIHlvdXIga2luZyBpcyByZW1vdmVkIGJ1dCB0aGUgb3Bwb25lbnQncyByZW1haW5zLCB0aGVuIGl0J3MgYSBsb3NzIGJ5IGtpbmcncyBzdWljaWRlLlxyXG4gKiAgIDMtMy4gSWYgdGhlIG9wcG9uZW50J3Mga2luZyBpcyByZW1vdmVkIGJ1dCB5b3VycyByZW1haW5zLFxyXG4gKiAgICAgICAgMy0zLTEuIElmIG5vIHR3byBwYXducyBvY2N1cHkgdGhlIHNhbWUgY29sdW1uLCB0aGVuIGl0J3MgYSB2aWN0b3J5XHJcbiAqICAgICAgICAgICAgIDMtMy0xLTEuIElmIHRoZSBzdGVwIHRoYXQgcmVtb3ZlZCB0aGUgb3Bwb25lbnQncyBraW5nIHdhcyBzdGVwIDEsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgIGFuZCB3aGVuIGEgbGFyZ2UgbnVtYmVyICg+PSAyIG9yIDMsIGFjY29yZGluZyB0byBAcmVfaGFrb19tb29uKVxyXG4gKiAgICAgICAgICAgICAgICAgICAgICBvZiBwaWVjZXMvc3RvbmVzIGFyZSByZW1vdmVkLCB0aGVuIFwiU2hvR29TcyFcIiBzaG91bGQgYmUgc2hvdXRlZFxyXG4gKlxyXG4gKiBUaGUgb3JkZXJpbmcgMSDihpIgMiBpcyBuZWVkZWQgdG8gc3VwcG9ydCB0aGUgY29tYmluYXRpb24gYXR0YWNrLlxyXG4gKiBUaGUgb3JkZXJpbmcgMiDihpIgMyBpcyBleHBsaWNpdGx5IG1lbnRpb25lZCBieSB0aGUgYWRkZW5kdW0gdG8gdGhlIG9mZmljaWFsIHJ1bGU6XHJcbiAqICAgICAgICAg44CM55+z44OV44Kn44Kk44K644KS552A5omL44GX44Gf57WQ5p6c44Go44GX44Gm6Ieq5YiG44Gu44Od44O844Oz5YW144GM55uk5LiK44GL44KJ5raI44GI5LqM44Od44GM6Kej5rG644GV44KM44KL5aC05ZCI44KC44CB5Y+N5YmH44KS44Go44KJ44Ga6YCy6KGM44Gn44GN44KL44CC44CNXHJcbiAqKi9cclxuZnVuY3Rpb24gcmVzb2x2ZV9hZnRlcl9zdG9uZV9waGFzZShwbGF5ZWQpIHtcclxuICAgIHJlbW92ZV9zdXJyb3VuZGVkX2VuaXRpdGllc19mcm9tX2JvYXJkX2FuZF9hZGRfdG9faGFuZF9pZl9uZWNlc3NhcnkocGxheWVkLCAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKHBsYXllZC5ieV93aG9tKSk7XHJcbiAgICByZW1vdmVfc3Vycm91bmRlZF9lbml0aXRpZXNfZnJvbV9ib2FyZF9hbmRfYWRkX3RvX2hhbmRfaWZfbmVjZXNzYXJ5KHBsYXllZCwgcGxheWVkLmJ5X3dob20pO1xyXG4gICAgcmVub3VuY2VfZW5fcGFzc2FudChwbGF5ZWQuYm9hcmQsIHBsYXllZC5ieV93aG9tKTtcclxuICAgIGNvbnN0IGRvdWJsZWRfcGF3bnNfZXhpc3QgPSBkb2VzX2RvdWJsZWRfcGF3bnNfZXhpc3QocGxheWVkLmJvYXJkLCBwbGF5ZWQuYnlfd2hvbSk7XHJcbiAgICBjb25zdCBpc195b3VyX2tpbmdfYWxpdmUgPSBraW5nX2lzX2FsaXZlKHBsYXllZC5ib2FyZCwgcGxheWVkLmJ5X3dob20pO1xyXG4gICAgY29uc3QgaXNfb3Bwb25lbnRzX2tpbmdfYWxpdmUgPSBraW5nX2lzX2FsaXZlKHBsYXllZC5ib2FyZCwgKDAsIHNpZGVfMS5vcHBvbmVudE9mKShwbGF5ZWQuYnlfd2hvbSkpO1xyXG4gICAgY29uc3Qgc2l0dWF0aW9uID0ge1xyXG4gICAgICAgIGJvYXJkOiBwbGF5ZWQuYm9hcmQsXHJcbiAgICAgICAgaGFuZF9vZl9ibGFjazogcGxheWVkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgaGFuZF9vZl93aGl0ZTogcGxheWVkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICB9O1xyXG4gICAgaWYgKCFpc195b3VyX2tpbmdfYWxpdmUpIHtcclxuICAgICAgICBpZiAoIWlzX29wcG9uZW50c19raW5nX2FsaXZlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHBoYXNlOiBcImdhbWVfZW5kXCIsIHJlYXNvbjogXCJib3RoX2tpbmdfZGVhZFwiLCB2aWN0b3I6IFwiS2FyYXRlSmFua2VuQm94aW5nXCIsIGZpbmFsX3NpdHVhdGlvbjogc2l0dWF0aW9uIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4geyBwaGFzZTogXCJnYW1lX2VuZFwiLCByZWFzb246IFwia2luZ19zdWljaWRlXCIsIHZpY3RvcjogKDAsIHNpZGVfMS5vcHBvbmVudE9mKShwbGF5ZWQuYnlfd2hvbSksIGZpbmFsX3NpdHVhdGlvbjogc2l0dWF0aW9uIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKCFpc19vcHBvbmVudHNfa2luZ19hbGl2ZSkge1xyXG4gICAgICAgICAgICBpZiAoIWRvdWJsZWRfcGF3bnNfZXhpc3QpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IHBoYXNlOiBcImdhbWVfZW5kXCIsIHJlYXNvbjogXCJraW5nX2NhcHR1cmVcIiwgdmljdG9yOiBwbGF5ZWQuYnlfd2hvbSwgZmluYWxfc2l0dWF0aW9uOiBzaXR1YXRpb24gfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IHBoYXNlOiBcImdhbWVfZW5kXCIsIHJlYXNvbjogXCJraW5nX2NhcHR1cmVfYW5kX2RvdWJsZWRfcGF3bnNcIiwgdmljdG9yOiBcIkthcmF0ZUphbmtlbkJveGluZ1wiLCBmaW5hbF9zaXR1YXRpb246IHNpdHVhdGlvbiB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoIWRvdWJsZWRfcGF3bnNfZXhpc3QpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGhhc2U6IFwicmVzb2x2ZWRcIixcclxuICAgICAgICAgICAgICAgICAgICBib2FyZDogcGxheWVkLmJvYXJkLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRfb2ZfYmxhY2s6IHBsYXllZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgICAgICAgICAgICAgIGhhbmRfb2Zfd2hpdGU6IHBsYXllZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHdob19nb2VzX25leHQ6ICgwLCBzaWRlXzEub3Bwb25lbnRPZikocGxheWVkLmJ5X3dob20pXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcGhhc2U6IFwiZ2FtZV9lbmRcIiwgcmVhc29uOiBcImRvdWJsZWRfcGF3bnNcIiwgdmljdG9yOiAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKHBsYXllZC5ieV93aG9tKSwgZmluYWxfc2l0dWF0aW9uOiBzaXR1YXRpb24gfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnRzLnJlc29sdmVfYWZ0ZXJfc3RvbmVfcGhhc2UgPSByZXNvbHZlX2FmdGVyX3N0b25lX3BoYXNlO1xyXG5mdW5jdGlvbiByZW5vdW5jZV9lbl9wYXNzYW50KGJvYXJkLCBieV93aG9tKSB7XHJcbiAgICBjb25zdCBvcHBvbmVudF9wYXduX2Nvb3JkcyA9ICgwLCBib2FyZF8xLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mKShib2FyZCwgKDAsIHNpZGVfMS5vcHBvbmVudE9mKShieV93aG9tKSwgXCLjg51cIik7XHJcbiAgICBmb3IgKGNvbnN0IGNvb3JkIG9mIG9wcG9uZW50X3Bhd25fY29vcmRzKSB7XHJcbiAgICAgICAgKDAsIGJvYXJkXzEuZGVsZXRlX2VuX3Bhc3NhbnRfZmxhZykoYm9hcmQsIGNvb3JkKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBoYXNfZHVwbGljYXRlcyhhcnJheSkge1xyXG4gICAgcmV0dXJuIG5ldyBTZXQoYXJyYXkpLnNpemUgIT09IGFycmF5Lmxlbmd0aDtcclxufVxyXG5mdW5jdGlvbiBkb2VzX2RvdWJsZWRfcGF3bnNfZXhpc3QoYm9hcmQsIHNpZGUpIHtcclxuICAgIGNvbnN0IGNvb3JkcyA9ICgwLCBib2FyZF8xLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mKShib2FyZCwgc2lkZSwgXCLjg51cIik7XHJcbiAgICBjb25zdCBjb2x1bW5zID0gY29vcmRzLm1hcCgoW2NvbCwgX3Jvd10pID0+IGNvbCk7XHJcbiAgICByZXR1cm4gaGFzX2R1cGxpY2F0ZXMoY29sdW1ucyk7XHJcbn1cclxuZnVuY3Rpb24ga2luZ19pc19hbGl2ZShib2FyZCwgc2lkZSkge1xyXG4gICAgcmV0dXJuICgwLCBib2FyZF8xLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mKShib2FyZCwgc2lkZSwgXCLjgq1cIikubGVuZ3RoICsgKDAsIGJvYXJkXzEubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGVfYW5kX3Byb2YpKGJvYXJkLCBzaWRlLCBcIui2hVwiKS5sZW5ndGggPiAwO1xyXG59XHJcbmZ1bmN0aW9uIHJlbW92ZV9zdXJyb3VuZGVkX2VuaXRpdGllc19mcm9tX2JvYXJkX2FuZF9hZGRfdG9faGFuZF9pZl9uZWNlc3Nhcnkob2xkLCBzaWRlKSB7XHJcbiAgICBjb25zdCBibGFja19hbmRfd2hpdGUgPSBvbGQuYm9hcmQubWFwKHJvdyA9PiByb3cubWFwKHNxID0+IHNxID09PSBudWxsID8gbnVsbCA6IHNxLnNpZGUpKTtcclxuICAgIGNvbnN0IGhhc19zdXJ2aXZlZCA9ICgwLCBzdXJyb3VuZF8xLnJlbW92ZV9zdXJyb3VuZGVkKShzaWRlLCBibGFja19hbmRfd2hpdGUpO1xyXG4gICAgb2xkLmJvYXJkLmZvckVhY2goKHJvdywgaSkgPT4gcm93LmZvckVhY2goKHNxLCBqKSA9PiB7XHJcbiAgICAgICAgaWYgKCFoYXNfc3Vydml2ZWRbaV0/LltqXSkge1xyXG4gICAgICAgICAgICBjb25zdCBjYXB0dXJlZF9lbnRpdHkgPSBzcTtcclxuICAgICAgICAgICAgcm93W2pdID0gbnVsbDtcclxuICAgICAgICAgICAgc2VuZF9jYXB0dXJlZF9lbnRpdHlfdG9fb3Bwb25lbnQob2xkLCBjYXB0dXJlZF9lbnRpdHkpO1xyXG4gICAgICAgIH1cclxuICAgIH0pKTtcclxufVxyXG5mdW5jdGlvbiBzZW5kX2NhcHR1cmVkX2VudGl0eV90b19vcHBvbmVudChvbGQsIGNhcHR1cmVkX2VudGl0eSkge1xyXG4gICAgaWYgKCFjYXB0dXJlZF9lbnRpdHkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgY29uc3Qgb3Bwb25lbnQgPSAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKGNhcHR1cmVkX2VudGl0eS5zaWRlKTtcclxuICAgIGlmIChjYXB0dXJlZF9lbnRpdHkudHlwZSA9PT0gXCLjgZfjgodcIikge1xyXG4gICAgICAgIChvcHBvbmVudCA9PT0gXCLnmb1cIiA/IG9sZC5oYW5kX29mX3doaXRlIDogb2xkLmhhbmRfb2ZfYmxhY2spLnB1c2goKDAsIHR5cGVfMS51bnByb21vdGUpKGNhcHR1cmVkX2VudGl0eS5wcm9mKSk7XHJcbiAgICB9XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5sb29rdXBfY29vcmRzX2Zyb21fc2lkZSA9IGV4cG9ydHMubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGVfYW5kX3Byb2YgPSBleHBvcnRzLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzID0gZXhwb3J0cy5kZWxldGVfZW5fcGFzc2FudF9mbGFnID0gZXhwb3J0cy5nZXRfZW50aXR5X2Zyb21fY29vcmQgPSB2b2lkIDA7XHJcbmNvbnN0IGNvb3JkaW5hdGVfMSA9IHJlcXVpcmUoXCIuL2Nvb3JkaW5hdGVcIik7XHJcbmZ1bmN0aW9uIGdldF9lbnRpdHlfZnJvbV9jb29yZChib2FyZCwgY29vcmQpIHtcclxuICAgIGNvbnN0IFtjb2x1bW4sIHJvd10gPSBjb29yZDtcclxuICAgIGNvbnN0IHJvd19pbmRleCA9IFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZihyb3cpO1xyXG4gICAgY29uc3QgY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGNvbHVtbik7XHJcbiAgICBpZiAocm93X2luZGV4ID09PSAtMSB8fCBjb2x1bW5faW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDluqfmqJnjgIwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShjb29yZCl944CN44Gv5LiN5q2j44Gn44GZYCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKGJvYXJkW3Jvd19pbmRleF0/Lltjb2x1bW5faW5kZXhdKSA/PyBudWxsO1xyXG59XHJcbmV4cG9ydHMuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkID0gZ2V0X2VudGl0eV9mcm9tX2Nvb3JkO1xyXG5mdW5jdGlvbiBkZWxldGVfZW5fcGFzc2FudF9mbGFnKGJvYXJkLCBjb29yZCkge1xyXG4gICAgY29uc3QgW2NvbHVtbiwgcm93XSA9IGNvb3JkO1xyXG4gICAgY29uc3Qgcm93X2luZGV4ID0gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIi5pbmRleE9mKHJvdyk7XHJcbiAgICBjb25zdCBjb2x1bW5faW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2YoY29sdW1uKTtcclxuICAgIGlmIChyb3dfaW5kZXggPT09IC0xIHx8IGNvbHVtbl9pbmRleCA9PT0gLTEpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOW6p+aomeOAjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGNvb3JkKX3jgI3jga/kuI3mraPjgafjgZlgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHBhd24gPSBib2FyZFtyb3dfaW5kZXhdW2NvbHVtbl9pbmRleF07XHJcbiAgICBpZiAocGF3bj8udHlwZSAhPT0gXCLjgrlcIiB8fCBwYXduLnByb2YgIT09IFwi44OdXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOODneODvOODs+OBruOBquOBhOW6p+aomeOAjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGNvb3JkKX3jgI3jgavlr77jgZfjgaYgXFxgZGVsZXRlX2VuX3Bhc3NhbnRfZmxhZygpXFxgIOOBjOWRvOOBsOOCjOOBvuOBl+OBn2ApO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlIHBhd24uc3ViamVjdF90b19lbl9wYXNzYW50O1xyXG59XHJcbmV4cG9ydHMuZGVsZXRlX2VuX3Bhc3NhbnRfZmxhZyA9IGRlbGV0ZV9lbl9wYXNzYW50X2ZsYWc7XHJcbi8qKlxyXG4gKiDpp5Ljg7vnooHnn7Pjg7tudWxsIOOCkuebpOS4iuOBrueJueWumuOBruS9jee9ruOBq+mFjee9ruOBmeOCi+OAgmNhbl9jYXN0bGUg44OV44Op44Kw44GoIGNhbl9rdW1hbCDjg5Xjg6njgrDjgpLpganlrpzoqr/mlbTjgZnjgovjgIJcclxuICogQHBhcmFtIGJvYXJkXHJcbiAqIEBwYXJhbSBjb29yZFxyXG4gKiBAcGFyYW0gbWF5YmVfZW50aXR5XHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5mdW5jdGlvbiBwdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncyhib2FyZCwgY29vcmQsIG1heWJlX2VudGl0eSkge1xyXG4gICAgY29uc3QgW2NvbHVtbiwgcm93XSA9IGNvb3JkO1xyXG4gICAgY29uc3Qgcm93X2luZGV4ID0gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIi5pbmRleE9mKHJvdyk7XHJcbiAgICBjb25zdCBjb2x1bW5faW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2YoY29sdW1uKTtcclxuICAgIGlmIChyb3dfaW5kZXggPT09IC0xIHx8IGNvbHVtbl9pbmRleCA9PT0gLTEpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOW6p+aomeOAjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGNvb3JkKX3jgI3jga/kuI3mraPjgafjgZlgKTtcclxuICAgIH1cclxuICAgIGlmIChtYXliZV9lbnRpdHk/LnR5cGUgPT09IFwi546LXCIpIHtcclxuICAgICAgICBpZiAobWF5YmVfZW50aXR5Lm5ldmVyX21vdmVkKSB7XHJcbiAgICAgICAgICAgIG1heWJlX2VudGl0eS5uZXZlcl9tb3ZlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBtYXliZV9lbnRpdHkuaGFzX21vdmVkX29ubHlfb25jZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG1heWJlX2VudGl0eS5oYXNfbW92ZWRfb25seV9vbmNlKSB7XHJcbiAgICAgICAgICAgIG1heWJlX2VudGl0eS5uZXZlcl9tb3ZlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBtYXliZV9lbnRpdHkuaGFzX21vdmVkX29ubHlfb25jZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG1heWJlX2VudGl0eT8udHlwZSA9PT0gXCLjgZfjgodcIiAmJiBtYXliZV9lbnRpdHkucHJvZiA9PT0gXCLppplcIikge1xyXG4gICAgICAgIG1heWJlX2VudGl0eS5jYW5fa3VtYWwgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG1heWJlX2VudGl0eT8udHlwZSA9PT0gXCLjgrlcIikge1xyXG4gICAgICAgIG1heWJlX2VudGl0eS5uZXZlcl9tb3ZlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJvYXJkW3Jvd19pbmRleF1bY29sdW1uX2luZGV4XSA9IG1heWJlX2VudGl0eTtcclxufVxyXG5leHBvcnRzLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzID0gcHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3M7XHJcbmZ1bmN0aW9uIGxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mKGJvYXJkLCBzaWRlLCBwcm9mKSB7XHJcbiAgICBjb25zdCBhbnMgPSBbXTtcclxuICAgIGNvbnN0IHJvd3MgPSBbXCLkuIBcIiwgXCLkuoxcIiwgXCLkuIlcIiwgXCLlm5tcIiwgXCLkupRcIiwgXCLlha1cIiwgXCLkuINcIiwgXCLlhatcIiwgXCLkuZ1cIl07XHJcbiAgICBjb25zdCBjb2xzID0gW1wi77yRXCIsIFwi77ySXCIsIFwi77yTXCIsIFwi77yUXCIsIFwi77yVXCIsIFwi77yWXCIsIFwi77yXXCIsIFwi77yYXCIsIFwi77yZXCJdO1xyXG4gICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xyXG4gICAgICAgIGZvciAoY29uc3QgY29sIG9mIGNvbHMpIHtcclxuICAgICAgICAgICAgY29uc3QgY29vcmQgPSBbY29sLCByb3ddO1xyXG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSBnZXRfZW50aXR5X2Zyb21fY29vcmQoYm9hcmQsIGNvb3JkKTtcclxuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gbnVsbCB8fCBlbnRpdHkudHlwZSA9PT0gXCLnooFcIikge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZW50aXR5LnByb2YgPT09IHByb2YgJiYgZW50aXR5LnNpZGUgPT09IHNpZGUpIHtcclxuICAgICAgICAgICAgICAgIGFucy5wdXNoKGNvb3JkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFucztcclxufVxyXG5leHBvcnRzLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mID0gbG9va3VwX2Nvb3Jkc19mcm9tX3NpZGVfYW5kX3Byb2Y7XHJcbmZ1bmN0aW9uIGxvb2t1cF9jb29yZHNfZnJvbV9zaWRlKGJvYXJkLCBzaWRlKSB7XHJcbiAgICBjb25zdCBhbnMgPSBbXTtcclxuICAgIGNvbnN0IHJvd3MgPSBbXCLkuIBcIiwgXCLkuoxcIiwgXCLkuIlcIiwgXCLlm5tcIiwgXCLkupRcIiwgXCLlha1cIiwgXCLkuINcIiwgXCLlhatcIiwgXCLkuZ1cIl07XHJcbiAgICBjb25zdCBjb2xzID0gW1wi77yRXCIsIFwi77ySXCIsIFwi77yTXCIsIFwi77yUXCIsIFwi77yVXCIsIFwi77yWXCIsIFwi77yXXCIsIFwi77yYXCIsIFwi77yZXCJdO1xyXG4gICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xyXG4gICAgICAgIGZvciAoY29uc3QgY29sIG9mIGNvbHMpIHtcclxuICAgICAgICAgICAgY29uc3QgY29vcmQgPSBbY29sLCByb3ddO1xyXG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSBnZXRfZW50aXR5X2Zyb21fY29vcmQoYm9hcmQsIGNvb3JkKTtcclxuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gbnVsbCB8fCBlbnRpdHkudHlwZSA9PT0gXCLnooFcIikge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZW50aXR5LnNpZGUgPT09IHNpZGUpIHtcclxuICAgICAgICAgICAgICAgIGFucy5wdXNoKGNvb3JkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFucztcclxufVxyXG5leHBvcnRzLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlID0gbG9va3VwX2Nvb3Jkc19mcm9tX3NpZGU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZG9fYW55X29mX215X3BpZWNlc19zZWUgPSBleHBvcnRzLmNhbl9zZWUgPSB2b2lkIDA7XHJcbmNvbnN0IGJvYXJkXzEgPSByZXF1aXJlKFwiLi9ib2FyZFwiKTtcclxuY29uc3Qgc2lkZV8xID0gcmVxdWlyZShcIi4vc2lkZVwiKTtcclxuZnVuY3Rpb24gZGVsdGFFcShkLCBkZWx0YSkge1xyXG4gICAgcmV0dXJuIGQudiA9PT0gZGVsdGEudiAmJiBkLmggPT09IGRlbHRhLmg7XHJcbn1cclxuLyoqXHJcbiAqIGBvLmZyb21gIOOBq+mnkuOBjOOBguOBo+OBpuOBneOBrumnkuOBjCBgby50b2Ag44G444Go5Yip44GE44Gm44GE44KL44GL44Gp44GG44GL44KS6L+U44GZ44CC44Od44O844Oz44Gu5pac44KB5Yip44GN44Gv5bi444GrIGNhbl9zZWUg44Go6KaL44Gq44GZ44CC44Od44O844Oz44GuMuODnuOCueenu+WLleOBr+OAgemnkuOCkuWPluOCi+OBk+OBqOOBjOOBp+OBjeOBquOBhOOBruOBp+OAjOWIqeOBjeOAjeOBp+OBr+OBquOBhOOAglxyXG4gKiAgQ2hlY2tzIHdoZXRoZXIgdGhlcmUgaXMgYSBwaWVjZSBhdCBgby5mcm9tYCB3aGljaCBsb29rcyBhdCBgby50b2AuIFRoZSBkaWFnb25hbCBtb3ZlIG9mIHBhd24gaXMgYWx3YXlzIGNvbnNpZGVyZWQuIEEgcGF3biBuZXZlciBzZWVzIHR3byBzcXVhcmVzIGluIHRoZSBmcm9udDsgaXQgY2FuIG9ubHkgbW92ZSB0byB0aGVyZS5cclxuICogQHBhcmFtIGJvYXJkXHJcbiAqIEBwYXJhbSBvXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5mdW5jdGlvbiBjYW5fc2VlKGJvYXJkLCBvKSB7XHJcbiAgICBjb25zdCBwID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgby5mcm9tKTtcclxuICAgIGlmICghcCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChwLnR5cGUgPT09IFwi56KBXCIpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjb25zdCBkZWx0YSA9ICgwLCBzaWRlXzEuY29vcmREaWZmU2VlbkZyb20pKHAuc2lkZSwgbyk7XHJcbiAgICBpZiAocC5wcm9mID09PSBcIuaIkOahglwiIHx8IHAucHJvZiA9PT0gXCLmiJDpioBcIiB8fCBwLnByb2YgPT09IFwi5oiQ6aaZXCIgfHwgcC5wcm9mID09PSBcIumHkVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgeyB2OiAxLCBoOiAtMSB9LCB7IHY6IDEsIGg6IDAgfSwgeyB2OiAxLCBoOiAxIH0sXHJcbiAgICAgICAgICAgIHsgdjogMCwgaDogLTEgfSwgLyoqKioqKioqKioqKi8geyB2OiAwLCBoOiAxIH0sXHJcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKi8geyB2OiAtMSwgaDogMCB9IC8qKioqKioqKioqKioqKi9cclxuICAgICAgICBdLnNvbWUoZCA9PiBkZWx0YUVxKGQsIGRlbHRhKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi6YqAXCIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB7IHY6IDEsIGg6IC0xIH0sIHsgdjogMSwgaDogMCB9LCB7IHY6IDEsIGg6IDEgfSxcclxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgICAgICAgICAgIHsgdjogLTEsIGg6IC0xIH0sIC8qKioqKioqKioqKiovIHsgdjogMSwgaDogMSB9LFxyXG4gICAgICAgIF0uc29tZShkID0+IGRlbHRhRXEoZCwgZGVsdGEpKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLmoYJcIikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHsgdjogMiwgaDogLTEgfSwgeyB2OiAyLCBoOiAxIH1cclxuICAgICAgICBdLnNvbWUoZCA9PiBkZWx0YUVxKGQsIGRlbHRhKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi44OKXCIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB7IHY6IDIsIGg6IC0xIH0sIHsgdjogMiwgaDogMSB9LFxyXG4gICAgICAgICAgICB7IHY6IC0yLCBoOiAtMSB9LCB7IHY6IC0yLCBoOiAxIH0sXHJcbiAgICAgICAgICAgIHsgdjogLTEsIGg6IDIgfSwgeyB2OiAxLCBoOiAyIH0sXHJcbiAgICAgICAgICAgIHsgdjogLTEsIGg6IC0yIH0sIHsgdjogMSwgaDogLTIgfVxyXG4gICAgICAgIF0uc29tZShkID0+IGRlbHRhRXEoZCwgZGVsdGEpKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLjgq1cIikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHsgdjogMSwgaDogLTEgfSwgeyB2OiAxLCBoOiAwIH0sIHsgdjogMSwgaDogMSB9LFxyXG4gICAgICAgICAgICB7IHY6IDAsIGg6IC0xIH0sIC8qKioqKioqKioqKioqLyB7IHY6IDAsIGg6IDEgfSxcclxuICAgICAgICAgICAgeyB2OiAtMSwgaDogLTEgfSwgeyB2OiAtMSwgaDogMCB9LCB7IHY6IC0xLCBoOiAxIH0sXHJcbiAgICAgICAgXS5zb21lKGQgPT4gZGVsdGFFcShkLCBkZWx0YSkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIuOBqFwiIHx8IHAucHJvZiA9PT0gXCLjgq9cIikge1xyXG4gICAgICAgIHJldHVybiBsb25nX3JhbmdlKFtcclxuICAgICAgICAgICAgeyB2OiAxLCBoOiAtMSB9LCB7IHY6IDEsIGg6IDAgfSwgeyB2OiAxLCBoOiAxIH0sXHJcbiAgICAgICAgICAgIHsgdjogMCwgaDogLTEgfSwgLyoqKioqKioqKioqKiovIHsgdjogMCwgaDogMSB9LFxyXG4gICAgICAgICAgICB7IHY6IC0xLCBoOiAtMSB9LCB7IHY6IC0xLCBoOiAwIH0sIHsgdjogLTEsIGg6IDEgfSxcclxuICAgICAgICBdLCBib2FyZCwgbywgcC5zaWRlKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLjg5NcIikge1xyXG4gICAgICAgIHJldHVybiBsb25nX3JhbmdlKFtcclxuICAgICAgICAgICAgeyB2OiAxLCBoOiAtMSB9LCB7IHY6IDEsIGg6IDEgfSwgeyB2OiAtMSwgaDogLTEgfSwgeyB2OiAtMSwgaDogMSB9LFxyXG4gICAgICAgIF0sIGJvYXJkLCBvLCBwLnNpZGUpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIuODq1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIGxvbmdfcmFuZ2UoW1xyXG4gICAgICAgICAgICB7IHY6IDEsIGg6IDAgfSwgeyB2OiAwLCBoOiAtMSB9LCB7IHY6IDAsIGg6IDEgfSwgeyB2OiAtMSwgaDogMCB9LFxyXG4gICAgICAgIF0sIGJvYXJkLCBvLCBwLnNpZGUpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIummmVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIGxvbmdfcmFuZ2UoW3sgdjogMSwgaDogMCB9XSwgYm9hcmQsIG8sIHAuc2lkZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi6LaFXCIpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLjg51cIikge1xyXG4gICAgICAgIGlmIChbeyB2OiAxLCBoOiAtMSB9LCB7IHY6IDEsIGg6IDAgfSwgeyB2OiAxLCBoOiAxIH1dLnNvbWUoZCA9PiBkZWx0YUVxKGQsIGRlbHRhKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBhIHBhd24gY2FuIG5ldmVyIHNlZSB0d28gc3F1YXJlcyBpbiBmcm9udDsgaXQgY2FuIG9ubHkgbW92ZSB0byB0aGVyZVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgXyA9IHAucHJvZjtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IHJlYWNoIGhlcmVcIik7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5jYW5fc2VlID0gY2FuX3NlZTtcclxuZnVuY3Rpb24gbG9uZ19yYW5nZShkaXJlY3Rpb25zLCBib2FyZCwgbywgc2lkZSkge1xyXG4gICAgY29uc3QgZGVsdGEgPSAoMCwgc2lkZV8xLmNvb3JkRGlmZlNlZW5Gcm9tKShzaWRlLCBvKTtcclxuICAgIGNvbnN0IG1hdGNoaW5nX2RpcmVjdGlvbnMgPSBkaXJlY3Rpb25zLmZpbHRlcihkaXJlY3Rpb24gPT4gZGVsdGEudiAqIGRpcmVjdGlvbi52ICsgZGVsdGEuaCAqIGRpcmVjdGlvbi5oID4gMCAvKiBpbm5lciBwcm9kdWN0IGlzIHBvc2l0aXZlICovXHJcbiAgICAgICAgJiYgZGVsdGEudiAqIGRpcmVjdGlvbi5oIC0gZGlyZWN0aW9uLnYgKiBkZWx0YS5oID09PSAwIC8qIGNyb3NzIHByb2R1Y3QgaXMgemVybyAqLyk7XHJcbiAgICBpZiAobWF0Y2hpbmdfZGlyZWN0aW9ucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjb25zdCBkaXJlY3Rpb24gPSBtYXRjaGluZ19kaXJlY3Rpb25zWzBdO1xyXG4gICAgZm9yIChsZXQgaSA9IHsgdjogZGlyZWN0aW9uLnYsIGg6IGRpcmVjdGlvbi5oIH07ICFkZWx0YUVxKGksIGRlbHRhKTsgaS52ICs9IGRpcmVjdGlvbi52LCBpLmggKz0gZGlyZWN0aW9uLmgpIHtcclxuICAgICAgICBjb25zdCBjb29yZCA9ICgwLCBzaWRlXzEuYXBwbHlEZWx0YVNlZW5Gcm9tKShzaWRlLCBvLmZyb20sIGkpO1xyXG4gICAgICAgIGlmICgoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBjb29yZCkpIHtcclxuICAgICAgICAgICAgLy8gYmxvY2tlZCBieSBzb21ldGhpbmc7IGNhbm5vdCBzZWVcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbmZ1bmN0aW9uIGRvX2FueV9vZl9teV9waWVjZXNfc2VlKGJvYXJkLCBjb29yZCwgc2lkZSkge1xyXG4gICAgY29uc3Qgb3Bwb25lbnRfcGllY2VfY29vcmRzID0gKDAsIGJvYXJkXzEubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGUpKGJvYXJkLCBzaWRlKTtcclxuICAgIHJldHVybiBvcHBvbmVudF9waWVjZV9jb29yZHMuc29tZShmcm9tID0+IGNhbl9zZWUoYm9hcmQsIHsgZnJvbSwgdG86IGNvb3JkIH0pKTtcclxufVxyXG5leHBvcnRzLmRvX2FueV9vZl9teV9waWVjZXNfc2VlID0gZG9fYW55X29mX215X3BpZWNlc19zZWU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuTGVmdG1vc3RXaGVuU2VlbkZyb21CbGFjayA9IGV4cG9ydHMuUmlnaHRtb3N0V2hlblNlZW5Gcm9tQmxhY2sgPSBleHBvcnRzLmNvb3JkRGlmZiA9IGV4cG9ydHMuY29sdW1uc0JldHdlZW4gPSBleHBvcnRzLmNvb3JkRXEgPSBleHBvcnRzLmRpc3BsYXlDb29yZCA9IHZvaWQgMDtcclxuZnVuY3Rpb24gZGlzcGxheUNvb3JkKGNvb3JkKSB7XHJcbiAgICByZXR1cm4gYCR7Y29vcmRbMF19JHtjb29yZFsxXX1gO1xyXG59XHJcbmV4cG9ydHMuZGlzcGxheUNvb3JkID0gZGlzcGxheUNvb3JkO1xyXG5mdW5jdGlvbiBjb29yZEVxKFtjb2wxLCByb3cxXSwgW2NvbDIsIHJvdzJdKSB7XHJcbiAgICByZXR1cm4gY29sMSA9PT0gY29sMiAmJiByb3cxID09PSByb3cyO1xyXG59XHJcbmV4cG9ydHMuY29vcmRFcSA9IGNvb3JkRXE7XHJcbmZ1bmN0aW9uIGNvbHVtbnNCZXR3ZWVuKGEsIGIpIHtcclxuICAgIGNvbnN0IGFfaW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2YoYSk7XHJcbiAgICBjb25zdCBiX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGIpO1xyXG4gICAgaWYgKGFfaW5kZXggPj0gYl9pbmRleClcclxuICAgICAgICByZXR1cm4gY29sdW1uc0JldHdlZW4oYiwgYSk7XHJcbiAgICBjb25zdCBhbnMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSBhX2luZGV4ICsgMTsgaSA8IGJfaW5kZXg7IGkrKykge1xyXG4gICAgICAgIGFucy5wdXNoKFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCJbaV0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFucztcclxufVxyXG5leHBvcnRzLmNvbHVtbnNCZXR3ZWVuID0gY29sdW1uc0JldHdlZW47XHJcbmZ1bmN0aW9uIGNvb3JkRGlmZihvKSB7XHJcbiAgICBjb25zdCBbZnJvbV9jb2x1bW4sIGZyb21fcm93XSA9IG8uZnJvbTtcclxuICAgIGNvbnN0IGZyb21fcm93X2luZGV4ID0gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIi5pbmRleE9mKGZyb21fcm93KTtcclxuICAgIGNvbnN0IGZyb21fY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGZyb21fY29sdW1uKTtcclxuICAgIGNvbnN0IFt0b19jb2x1bW4sIHRvX3Jvd10gPSBvLnRvO1xyXG4gICAgY29uc3QgdG9fcm93X2luZGV4ID0gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIi5pbmRleE9mKHRvX3Jvdyk7XHJcbiAgICBjb25zdCB0b19jb2x1bW5faW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2YodG9fY29sdW1uKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaDogdG9fY29sdW1uX2luZGV4IC0gZnJvbV9jb2x1bW5faW5kZXgsXHJcbiAgICAgICAgdjogdG9fcm93X2luZGV4IC0gZnJvbV9yb3dfaW5kZXhcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5jb29yZERpZmYgPSBjb29yZERpZmY7XHJcbmZ1bmN0aW9uIFJpZ2h0bW9zdFdoZW5TZWVuRnJvbUJsYWNrKGNvb3Jkcykge1xyXG4gICAgaWYgKGNvb3Jkcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cmllZCB0byB0YWtlIHRoZSBtYXhpbXVtIG9mIGFuIGVtcHR5IGFycmF5XCIpO1xyXG4gICAgfVxyXG4gICAgLy8gU2luY2UgXCLvvJFcIiB0byBcIu+8mVwiIGFyZSBjb25zZWN1dGl2ZSBpbiBVbmljb2RlLCB3ZSBjYW4ganVzdCBzb3J0IGl0IGFzIFVURi0xNiBzdHJpbmdcclxuICAgIGNvbnN0IGNvbHVtbnMgPSBjb29yZHMubWFwKChbY29sLCBfcm93XSkgPT4gY29sKTtcclxuICAgIGNvbHVtbnMuc29ydCgpO1xyXG4gICAgY29uc3QgcmlnaHRtb3N0X2NvbHVtbiA9IGNvbHVtbnNbMF07XHJcbiAgICByZXR1cm4gY29vcmRzLmZpbHRlcigoW2NvbCwgX3Jvd10pID0+IGNvbCA9PT0gcmlnaHRtb3N0X2NvbHVtbik7XHJcbn1cclxuZXhwb3J0cy5SaWdodG1vc3RXaGVuU2VlbkZyb21CbGFjayA9IFJpZ2h0bW9zdFdoZW5TZWVuRnJvbUJsYWNrO1xyXG5mdW5jdGlvbiBMZWZ0bW9zdFdoZW5TZWVuRnJvbUJsYWNrKGNvb3Jkcykge1xyXG4gICAgaWYgKGNvb3Jkcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cmllZCB0byB0YWtlIHRoZSBtYXhpbXVtIG9mIGFuIGVtcHR5IGFycmF5XCIpO1xyXG4gICAgfVxyXG4gICAgLy8gU2luY2UgXCLvvJFcIiB0byBcIu+8mVwiIGFyZSBjb25zZWN1dGl2ZSBpbiBVbmljb2RlLCB3ZSBjYW4ganVzdCBzb3J0IGl0IGFzIFVURi0xNiBzdHJpbmdcclxuICAgIGNvbnN0IGNvbHVtbnMgPSBjb29yZHMubWFwKChbY29sLCBfcm93XSkgPT4gY29sKTtcclxuICAgIGNvbHVtbnMuc29ydCgpO1xyXG4gICAgY29uc3QgbGVmdG1vc3RfY29sdW1uID0gY29sdW1uc1tjb2x1bW5zLmxlbmd0aCAtIDFdO1xyXG4gICAgcmV0dXJuIGNvb3Jkcy5maWx0ZXIoKFtjb2wsIF9yb3ddKSA9PiBjb2wgPT09IGxlZnRtb3N0X2NvbHVtbik7XHJcbn1cclxuZXhwb3J0cy5MZWZ0bW9zdFdoZW5TZWVuRnJvbUJsYWNrID0gTGVmdG1vc3RXaGVuU2VlbkZyb21CbGFjaztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XHJcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xyXG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pKTtcclxudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5mcm9tX2N1c3RvbV9zdGF0ZSA9IGV4cG9ydHMubWFpbiA9IGV4cG9ydHMuZ2V0X2luaXRpYWxfc3RhdGUgPSBleHBvcnRzLmNvb3JkRXEgPSBleHBvcnRzLmRpc3BsYXlDb29yZCA9IGV4cG9ydHMuY2FuX21vdmUgPSBleHBvcnRzLmNhbl9zZWUgPSBleHBvcnRzLm9wcG9uZW50T2YgPSB2b2lkIDA7XHJcbmNvbnN0IGJvYXJkXzEgPSByZXF1aXJlKFwiLi9ib2FyZFwiKTtcclxuY29uc3QgcGllY2VfcGhhc2VfMSA9IHJlcXVpcmUoXCIuL3BpZWNlX3BoYXNlXCIpO1xyXG5jb25zdCBjb29yZGluYXRlXzEgPSByZXF1aXJlKFwiLi9jb29yZGluYXRlXCIpO1xyXG5jb25zdCBhZnRlcl9zdG9uZV9waGFzZV8xID0gcmVxdWlyZShcIi4vYWZ0ZXJfc3RvbmVfcGhhc2VcIik7XHJcbmNvbnN0IHNpZGVfMSA9IHJlcXVpcmUoXCIuL3NpZGVcIik7XHJcbmNvbnN0IHN1cnJvdW5kXzEgPSByZXF1aXJlKFwiLi9zdXJyb3VuZFwiKTtcclxudmFyIHNpZGVfMiA9IHJlcXVpcmUoXCIuL3NpZGVcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIm9wcG9uZW50T2ZcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNpZGVfMi5vcHBvbmVudE9mOyB9IH0pO1xyXG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vdHlwZVwiKSwgZXhwb3J0cyk7XHJcbnZhciBjYW5fc2VlXzEgPSByZXF1aXJlKFwiLi9jYW5fc2VlXCIpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJjYW5fc2VlXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBjYW5fc2VlXzEuY2FuX3NlZTsgfSB9KTtcclxudmFyIHBpZWNlX3BoYXNlXzIgPSByZXF1aXJlKFwiLi9waWVjZV9waGFzZVwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiY2FuX21vdmVcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHBpZWNlX3BoYXNlXzIuY2FuX21vdmU7IH0gfSk7XHJcbnZhciBjb29yZGluYXRlXzIgPSByZXF1aXJlKFwiLi9jb29yZGluYXRlXCIpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJkaXNwbGF5Q29vcmRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvb3JkaW5hdGVfMi5kaXNwbGF5Q29vcmQ7IH0gfSk7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImNvb3JkRXFcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvb3JkaW5hdGVfMi5jb29yZEVxOyB9IH0pO1xyXG5jb25zdCBnZXRfaW5pdGlhbF9zdGF0ZSA9ICh3aG9fZ29lc19maXJzdCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwaGFzZTogXCJyZXNvbHZlZFwiLFxyXG4gICAgICAgIGhhbmRfb2ZfYmxhY2s6IFtdLFxyXG4gICAgICAgIGhhbmRfb2Zfd2hpdGU6IFtdLFxyXG4gICAgICAgIHdob19nb2VzX25leHQ6IHdob19nb2VzX2ZpcnN0LFxyXG4gICAgICAgIGJvYXJkOiBbXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLppplcIiwgY2FuX2t1bWFsOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi5qGCXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLpioBcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIumHkVwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi546LXCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44KtXCIsIG5ldmVyX21vdmVkOiB0cnVlLCBoYXNfbW92ZWRfb25seV9vbmNlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIumHkVwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi6YqAXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLmoYJcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIummmVwiLCBjYW5fa3VtYWw6IHRydWUgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODq1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODilwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODk1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjgq9cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OTXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OKXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OrXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW251bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsXSxcclxuICAgICAgICAgICAgW251bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsXSxcclxuICAgICAgICAgICAgW251bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsIG51bGwsXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OrXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OKXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OTXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuOCr1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg5NcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg4pcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg6tcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIummmVwiLCBjYW5fa3VtYWw6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLmoYJcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIumKgFwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi6YeRXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLnjotcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjgq1cIiwgbmV2ZXJfbW92ZWQ6IHRydWUsIGhhc19tb3ZlZF9vbmx5X29uY2U6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi6YeRXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLpioBcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuahglwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi6aaZXCIsIGNhbl9rdW1hbDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIF1cclxuICAgIH07XHJcbn07XHJcbmV4cG9ydHMuZ2V0X2luaXRpYWxfc3RhdGUgPSBnZXRfaW5pdGlhbF9zdGF0ZTtcclxuLyoqIOeigeefs+OCkue9ruOBj+OAguiHquauuuaJi+OBq+OBquOCi+OCiOOBhuOBqueigeefs+OBrue9ruOBjeaWueOBr+OBp+OBjeOBquOBhO+8iOWFrOW8j+ODq+ODvOODq+OAjOaJk+OBo+OBn+eerOmWk+OBq+WPluOCieOCjOOBpuOBl+OBvuOBhuODnuOCueOBq+OBr+efs+OBr+aJk+OBpuOBquOBhOOAje+8iVxyXG4gKlxyXG4gKiBAcGFyYW0gb2xkXHJcbiAqIEBwYXJhbSBzaWRlXHJcbiAqIEBwYXJhbSBzdG9uZV90b1xyXG4gKiBAcmV0dXJuc1xyXG4gKi9cclxuZnVuY3Rpb24gcGxhY2Vfc3RvbmUob2xkLCBzaWRlLCBzdG9uZV90bykge1xyXG4gICAgaWYgKCgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkob2xkLmJvYXJkLCBzdG9uZV90bykpIHsgLy8gaWYgdGhlIHNxdWFyZSBpcyBhbHJlYWR5IG9jY3VwaWVkXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3NpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoc3RvbmVfdG8pfeOBq+eigeefs+OCkue9ruOBk+OBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHN0b25lX3RvKX3jga7jg57jgrnjga/ml6Ljgavln4vjgb7jgaPjgabjgYTjgb7jgZlgKTtcclxuICAgIH1cclxuICAgIC8vIOOBvuOBmue9ruOBj1xyXG4gICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgc3RvbmVfdG8sIHsgdHlwZTogXCLnooFcIiwgc2lkZSB9KTtcclxuICAgIC8vIOe9ruOBhOOBn+W+jOOBp+OAgeedgOaJi+emgeatouOBi+OBqeOBhuOBi+OCkuWIpOaWreOBmeOCi+OBn+OCgeOBq+OAgVxyXG4gICAgLy/jgI7lm7Ljgb7jgozjgabjgYTjgovnm7jmiYvjga7pp5Iv55+z44KS5Y+W44KL44CP4oaS44CO5Zuy44G+44KM44Gm44GE44KL6Ieq5YiG44Gu6aeSL+efs+OCkuWPluOCi+OAj+OCkuOCt+ODn+ODpeODrOODvOOCt+ODp+ODs+OBl+OBpuOAgee9ruOBhOOBn+S9jee9ruOBruefs+OBjOatu+OCk+OBp+OBhOOBn+OCiVxyXG4gICAgY29uc3QgYmxhY2tfYW5kX3doaXRlID0gb2xkLmJvYXJkLm1hcChyb3cgPT4gcm93Lm1hcChzcSA9PiBzcSA9PT0gbnVsbCA/IG51bGwgOiBzcS5zaWRlKSk7XHJcbiAgICBjb25zdCBvcHBvbmVudF9yZW1vdmVkID0gKDAsIHN1cnJvdW5kXzEucmVtb3ZlX3N1cnJvdW5kZWQpKCgwLCBzaWRlXzEub3Bwb25lbnRPZikoc2lkZSksIGJsYWNrX2FuZF93aGl0ZSk7XHJcbiAgICBjb25zdCByZXN1bHQgPSAoMCwgc3Vycm91bmRfMS5yZW1vdmVfc3Vycm91bmRlZCkoc2lkZSwgb3Bwb25lbnRfcmVtb3ZlZCk7XHJcbiAgICBpZiAoKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShyZXN1bHQsIHN0b25lX3RvKSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHBoYXNlOiBcInN0b25lX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgICAgICBib2FyZDogb2xkLmJvYXJkLFxyXG4gICAgICAgICAgICBoYW5kX29mX2JsYWNrOiBvbGQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICAgICAgaGFuZF9vZl93aGl0ZTogb2xkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgICAgIGJ5X3dob206IG9sZC5ieV93aG9tLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7c2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShzdG9uZV90byl944Gr56KB55+z44KS572u44GT44GG44Go44GX44Gm44GE44G+44GZ44GM44CB5omT44Gj44Gf556s6ZaT44Gr5Y+W44KJ44KM44Gm44GX44G+44GG44Gu44Gn44GT44GT44Gv552A5omL56aB5q2i54K544Gn44GZYCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gb25lX3R1cm4ob2xkLCBtb3ZlKSB7XHJcbiAgICBjb25zdCBhZnRlcl9waWVjZV9waGFzZSA9ICgwLCBwaWVjZV9waGFzZV8xLnBsYXlfcGllY2VfcGhhc2UpKG9sZCwgbW92ZS5waWVjZV9waGFzZSk7XHJcbiAgICBjb25zdCBhZnRlcl9zdG9uZV9waGFzZSA9IG1vdmUuc3RvbmVfdG8gPyBwbGFjZV9zdG9uZShhZnRlcl9waWVjZV9waGFzZSwgbW92ZS5waWVjZV9waGFzZS5zaWRlLCBtb3ZlLnN0b25lX3RvKSA6IHtcclxuICAgICAgICBwaGFzZTogXCJzdG9uZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICBib2FyZDogYWZ0ZXJfcGllY2VfcGhhc2UuYm9hcmQsXHJcbiAgICAgICAgaGFuZF9vZl9ibGFjazogYWZ0ZXJfcGllY2VfcGhhc2UuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICBoYW5kX29mX3doaXRlOiBhZnRlcl9waWVjZV9waGFzZS5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgIGJ5X3dob206IGFmdGVyX3BpZWNlX3BoYXNlLmJ5X3dob20sXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuICgwLCBhZnRlcl9zdG9uZV9waGFzZV8xLnJlc29sdmVfYWZ0ZXJfc3RvbmVfcGhhc2UpKGFmdGVyX3N0b25lX3BoYXNlKTtcclxufVxyXG5mdW5jdGlvbiBtYWluKG1vdmVzKSB7XHJcbiAgICBpZiAobW92ZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi5qOL6K2c44GM56m644Gn44GZXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZyb21fY3VzdG9tX3N0YXRlKG1vdmVzLCAoMCwgZXhwb3J0cy5nZXRfaW5pdGlhbF9zdGF0ZSkobW92ZXNbMF0ucGllY2VfcGhhc2Uuc2lkZSkpO1xyXG59XHJcbmV4cG9ydHMubWFpbiA9IG1haW47XHJcbmZ1bmN0aW9uIGZyb21fY3VzdG9tX3N0YXRlKG1vdmVzLCBpbml0aWFsX3N0YXRlKSB7XHJcbiAgICBsZXQgc3RhdGUgPSBpbml0aWFsX3N0YXRlO1xyXG4gICAgZm9yIChjb25zdCBtb3ZlIG9mIG1vdmVzKSB7XHJcbiAgICAgICAgY29uc3QgbmV4dCA9IG9uZV90dXJuKHN0YXRlLCBtb3ZlKTtcclxuICAgICAgICBpZiAobmV4dC5waGFzZSA9PT0gXCJnYW1lX2VuZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdGF0ZSA9IG5leHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RhdGU7XHJcbn1cclxuZXhwb3J0cy5mcm9tX2N1c3RvbV9zdGF0ZSA9IGZyb21fY3VzdG9tX3N0YXRlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmNhbl9tb3ZlID0gZXhwb3J0cy5wbGF5X3BpZWNlX3BoYXNlID0gdm9pZCAwO1xyXG5jb25zdCBib2FyZF8xID0gcmVxdWlyZShcIi4vYm9hcmRcIik7XHJcbmNvbnN0IHR5cGVfMSA9IHJlcXVpcmUoXCIuL3R5cGVcIik7XHJcbmNvbnN0IGNvb3JkaW5hdGVfMSA9IHJlcXVpcmUoXCIuL2Nvb3JkaW5hdGVcIik7XHJcbmNvbnN0IHNpZGVfMSA9IHJlcXVpcmUoXCIuL3NpZGVcIik7XHJcbmNvbnN0IGNhbl9zZWVfMSA9IHJlcXVpcmUoXCIuL2Nhbl9zZWVcIik7XHJcbi8qKiDpp5LjgpLmiZPjgaTjgILmiYvpp5LjgYvjgonlsIbmo4vpp5LjgpLnm6TkuIrjgavnp7vli5XjgZXjgZvjgovjgILooYzjgY3jganjgZPjgo3jga7nhKHjgYTkvY3nva7jgavmoYLppqzjgajpppnou4rjgpLmiZPjgaPjgZ/jgonjgqjjg6njg7zjgIJcclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHBhcmFjaHV0ZShvbGQsIG8pIHtcclxuICAgIGlmICgoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKG9sZC5ib2FyZCwgby50bykpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeaJk+OBqOOBruOBk+OBqOOBp+OBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeODnuOCueOBr+aXouOBq+Wfi+OBvuOBo+OBpuOBhOOBvuOBmWApO1xyXG4gICAgfVxyXG4gICAgaWYgKG8ucHJvZiA9PT0gXCLmoYJcIikge1xyXG4gICAgICAgIGlmICgoMCwgc2lkZV8xLmlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cykoMiwgby5zaWRlLCBvLnRvKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeaJk+OBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeihjOOBjeOBqeOBk+OCjeOBruOBquOBhOahgummrOOBr+aJk+OBpuOBvuOBm+OCk2ApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG8ucHJvZiA9PT0gXCLppplcIikge1xyXG4gICAgICAgIGlmICgoMCwgc2lkZV8xLmlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cykoMSwgby5zaWRlLCBvLnRvKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeaJk+OBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeihjOOBjeOBqeOBk+OCjeOBruOBquOBhOmmmei7iuOBr+aJk+OBpuOBvuOBm+OCk2ApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IGhhbmQgPSBvbGRbby5zaWRlID09PSBcIueZvVwiID8gXCJoYW5kX29mX3doaXRlXCIgOiBcImhhbmRfb2ZfYmxhY2tcIl07XHJcbiAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLnRvLCB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IG8uc2lkZSwgcHJvZjogby5wcm9mLCBjYW5fa3VtYWw6IGZhbHNlIH0pO1xyXG4gICAgY29uc3QgaW5kZXggPSBoYW5kLmZpbmRJbmRleChwcm9mID0+IHByb2YgPT09IG8ucHJvZik7XHJcbiAgICBoYW5kLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBoYXNlOiBcInBpZWNlX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgIGhhbmRfb2ZfYmxhY2s6IG9sZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgIGJ5X3dob206IG9sZC53aG9fZ29lc19uZXh0LFxyXG4gICAgICAgIGJvYXJkOiBvbGQuYm9hcmRcclxuICAgIH07XHJcbn1cclxuZnVuY3Rpb24ga3VtYWxpbmcyKG9sZCwgZnJvbSwgdG8pIHtcclxuICAgIGNvbnN0IGtpbmcgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKG9sZC5ib2FyZCwgZnJvbSk7XHJcbiAgICBpZiAoa2luZz8udHlwZSA9PT0gXCLnjotcIikge1xyXG4gICAgICAgIGlmIChraW5nLm5ldmVyX21vdmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhbmNlID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShvbGQuYm9hcmQsIHRvKTtcclxuICAgICAgICAgICAgaWYgKCFsYW5jZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDjgq3jg7PjgrDnjovjgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShmcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKSh0byl944G45YuV44GP44GP44G+44KK44KT44GQ44KSJHtraW5nLnNpZGV944GM6Kmm44G/44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkodG8pfeOBq+OBr+mnkuOBjOOBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGxhbmNlLnR5cGUgPT09IFwi56KBXCIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg44Kt44Oz44Kw546L44GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkodG8pfeOBuOWLleOBj+OBj+OBvuOCiuOCk+OBkOOCkiR7a2luZy5zaWRlfeOBjOippuOBv+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHRvKX3jgavjgYLjgovjga7jga/pppnou4rjgafjga/jgarjgY/nooHnn7PjgafjgZlgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChsYW5jZS50eXBlICE9PSBcIuOBl+OCh1wiIHx8IGxhbmNlLnByb2YgIT09IFwi6aaZXCIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg44Kt44Oz44Kw546L44GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkodG8pfeOBuOWLleOBj+OBj+OBvuOCiuOCk+OBkOOCkiR7a2luZy5zaWRlfeOBjOippuOBv+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGZyb20pfeOBq+OBr+mmmei7iuOBp+OBr+OBquOBhOmnkuOBjOOBguOCiuOBvuOBmWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChsYW5jZS5jYW5fa3VtYWwpIHtcclxuICAgICAgICAgICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIHRvLCBraW5nKTtcclxuICAgICAgICAgICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIGZyb20sIGxhbmNlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGhhc2U6IFwicGllY2VfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYm9hcmQ6IG9sZC5ib2FyZCxcclxuICAgICAgICAgICAgICAgICAgICBoYW5kX29mX2JsYWNrOiBvbGQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICAgICAgICAgICAgICBoYW5kX29mX3doaXRlOiBvbGQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICAgICAgICAgICAgICBieV93aG9tOiBvbGQud2hvX2dvZXNfbmV4dFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg44Kt44Oz44Kw546L44GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkodG8pfeOBuOWLleOBj+OBj+OBvuOCiuOCk+OBkOOCkiR7a2luZy5zaWRlfeOBjOippuOBv+OBpuOBhOOBvuOBmeOBjOOAgeOBk+OBrummmei7iuOBr+aJk+OBn+OCjOOBn+mmmei7iuOBquOBruOBp+OBj+OBvuOCiuOCk+OBkOOBruWvvuixoeWkluOBp+OBmWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGtpbmcuaGFzX21vdmVkX29ubHlfb25jZSkge1xyXG4gICAgICAgICAgICBjb25zdCBkaWZmID0gKDAsIHNpZGVfMS5jb29yZERpZmZTZWVuRnJvbSkoa2luZy5zaWRlLCB7IHRvOiB0bywgZnJvbSB9KTtcclxuICAgICAgICAgICAgaWYgKGRpZmYudiA9PT0gMCAmJiAoZGlmZi5oID09PSAyIHx8IGRpZmYuaCA9PT0gLTIpICYmXHJcbiAgICAgICAgICAgICAgICAoKGtpbmcuc2lkZSA9PT0gXCLpu5JcIiAmJiBmcm9tWzFdID09PSBcIuWFq1wiKSB8fCAoa2luZy5zaWRlID09PSBcIueZvVwiICYmIGZyb21bMV0gPT09IFwi5LqMXCIpKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhc3RsaW5nKG9sZCwgeyBmcm9tLCB0bzogdG8sIHNpZGU6IGtpbmcuc2lkZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtraW5nLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkodG8pfeOCreOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7a2luZy5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKFwi44KtXCIpfeOBr+ebpOS4iuOBq+OBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7a2luZy5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHRvKX3jgq3jgajjga7jgZPjgajjgafjgZnjgYzjgIHjgZ3jga7jgojjgYbjgarnp7vli5XjgYzjgafjgY3jgoske2tpbmcuc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShcIuOCrVwiKX3jga/nm6TkuIrjgavjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZ1bmN0aW9uIFxcYGt1bWFsaW5nMigpXFxgIGNhbGxlZCBvbiBhIG5vbi1raW5nIHBpZWNlYCk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFJlc29sdmVkIOOBqueKtuaFi+OBq+mnkuODleOCp+OCpOOCuuOCkumBqeeUqOOAguecgeeVpeOBleOCjOOBn+aDheWgseOCkuW+qeWFg+OBl+OBquOBjOOCiemBqeeUqOOBl+OBquOBjeOCg+OBhOOBkeOBquOBhOOBruOBp+OAgeOBi+OBquOCiuOBl+OCk+OBqeOBhOOAglxyXG4gKiBAcGFyYW0gb2xkIOWRvOOBs+WHuuOBl+W+jOOBq+egtOWjiuOBleOCjOOBpuOBhOOCi+WPr+iDveaAp+OBjOOBguOCi+OBruOBp+OAgeW+jOOBp+S9v+OBhOOBn+OBhOOBquOCieODh+OCo+ODvOODl+OCs+ODlOODvOOBl+OBpuOBiuOBj+OBk+OBqOOAglxyXG4gKiBAcGFyYW0gb1xyXG4gKi9cclxuZnVuY3Rpb24gcGxheV9waWVjZV9waGFzZShvbGQsIG8pIHtcclxuICAgIC8vIFRoZSB0aGluZyBpcyB0aGF0IHdlIGhhdmUgdG8gaW5mZXIgd2hpY2ggcGllY2UgaGFzIG1vdmVkLCBzaW5jZSB0aGUgdXN1YWwgbm90YXRpb24gZG9lcyBub3Qgc2lnbmlmeVxyXG4gICAgLy8gd2hlcmUgdGhlIHBpZWNlIGNvbWVzIGZyb20uXHJcbiAgICAvLyDpnaLlgJLjgarjga7jga/jgIHlhbfkvZPnmoTjgavjganjga7pp5LjgYzli5XjgYTjgZ/jga7jgYvjgpLjgIHmo4vorZzjga7mg4XloLHjgYvjgonlvqnlhYPjgZfjgabjgoTjgonjgarjgYTjgajjgYTjgZHjgarjgYTjgajjgYTjgYbngrnjgafjgYLjgovvvIjmma7pgJrlp4vngrnjga/mm7jjgYvjgarjgYTjga7jgafvvInjgIJcclxuICAgIC8vIGZpcnN0LCB1c2UgdGhlIGBzaWRlYCBmaWVsZCBhbmQgdGhlIGBwcm9mYCBmaWVsZCB0byBsaXN0IHVwIHRoZSBwb3NzaWJsZSBwb2ludHMgb2Ygb3JpZ2luIFxyXG4gICAgLy8gKG5vdGUgdGhhdCBcImluIGhhbmRcIiBpcyBhIHBvc3NpYmlsaXR5KS5cclxuICAgIGNvbnN0IHBvc3NpYmxlX3BvaW50c19vZl9vcmlnaW4gPSAoMCwgYm9hcmRfMS5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZikob2xkLmJvYXJkLCBvLnNpZGUsIG8ucHJvZik7XHJcbiAgICBjb25zdCBoYW5kID0gb2xkW28uc2lkZSA9PT0gXCLnmb1cIiA/IFwiaGFuZF9vZl93aGl0ZVwiIDogXCJoYW5kX29mX2JsYWNrXCJdO1xyXG4gICAgY29uc3QgZXhpc3RzX2luX2hhbmQgPSBoYW5kLnNvbWUocHJvZiA9PiBwcm9mID09PSBvLnByb2YpO1xyXG4gICAgaWYgKHR5cGVvZiBvLmZyb20gPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICBpZiAoby5mcm9tID09PSBcIuaJk1wiKSB7XHJcbiAgICAgICAgICAgIGlmIChleGlzdHNfaW5faGFuZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCgwLCB0eXBlXzEuaXNVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uKShvLnByb2YpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFjaHV0ZShvbGQsIHsgc2lkZTogby5zaWRlLCBwcm9mOiBvLnByb2YsIHRvOiBvLnRvIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVW5wcm9tb3RlZFNob2dpUHJvZmVzc2lvbiDku6XlpJbjga/miYvpp5LjgavlhaXjgaPjgabjgYTjgovjga/jgZrjgYzjgarjgYTjga7jgafjgIFcclxuICAgICAgICAgICAgICAgICAgICAvLyBleGlzdHNfaW5faGFuZCDjgYzmuoDjgZ/jgZXjgozjgabjgYTjgovmmYLngrnjgacgVW5wcm9tb3RlZFNob2dpUHJvZmVzc2lvbiDjgafjgYLjgovjgZPjgajjga/ml6LjgavnorrlrprjgZfjgabjgYTjgotcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzaG91bGQgbm90IHJlYWNoIGhlcmVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeaJk+OBqOOBruOBk+OBqOOBp+OBmeOBjOOAgSR7by5zaWRlfeOBruaJi+mnkuOBqyR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944Gv44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoby5mcm9tID09PSBcIuWPs1wiKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBydW5lZCA9IHBvc3NpYmxlX3BvaW50c19vZl9vcmlnaW4uZmlsdGVyKGZyb20gPT4gY2FuX21vdmUob2xkLmJvYXJkLCB7IGZyb20sIHRvOiBvLnRvIH0pKTtcclxuICAgICAgICAgICAgaWYgKHBydW5lZC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z95Y+z44Go44Gu44GT44Go44Gn44GZ44GM44CB44Gd44Gu44KI44GG44Gq56e75YuV44GM44Gn44GN44KLJHtvLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jga/nm6TkuIrjgavjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCByaWdodG1vc3QgPSAoMCwgc2lkZV8xLlJpZ2h0bW9zdFdoZW5TZWVuRnJvbSkoby5zaWRlLCBwcnVuZWQpO1xyXG4gICAgICAgICAgICBpZiAocmlnaHRtb3N0Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vdmVfcGllY2Uob2xkLCB7IGZyb206IHJpZ2h0bW9zdFswXSwgdG86IG8udG8sIHNpZGU6IG8uc2lkZSwgcHJvbW90ZTogby5wcm9tb3RlcyA/PyBudWxsIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3jgajjga7jgZPjgajjgafjgZnjgYzjgIHjgZ3jga7jgojjgYbjgarnp7vli5XjgYzjgafjgY3jgoske28uc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBjOebpOS4iuOBq+ikh+aVsOOBguOCiuOBvuOBmWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG8uZnJvbSA9PT0gXCLlt6ZcIikge1xyXG4gICAgICAgICAgICBjb25zdCBwcnVuZWQgPSBwb3NzaWJsZV9wb2ludHNfb2Zfb3JpZ2luLmZpbHRlcihmcm9tID0+IGNhbl9tb3ZlKG9sZC5ib2FyZCwgeyBmcm9tLCB0bzogby50byB9KSk7XHJcbiAgICAgICAgICAgIGlmIChwcnVuZWQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeW3puOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7by5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944Gv55uk5LiK44Gr44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgbGVmdG1vc3QgPSAoMCwgc2lkZV8xLkxlZnRtb3N0V2hlblNlZW5Gcm9tKShvLnNpZGUsIHBydW5lZCk7XHJcbiAgICAgICAgICAgIGlmIChsZWZ0bW9zdC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb3ZlX3BpZWNlKG9sZCwgeyBmcm9tOiBsZWZ0bW9zdFswXSwgdG86IG8udG8sIHNpZGU6IG8uc2lkZSwgcHJvbW90ZTogby5wcm9tb3RlcyA/PyBudWxsIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3jgajjga7jgZPjgajjgafjgZnjgYzjgIHjgZ3jga7jgojjgYbjgarnp7vli5XjgYzjgafjgY3jgoske28uc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBjOebpOS4iuOBq+ikh+aVsOOBguOCiuOBvuOBmWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLjgIzmiZPjgI3jgIzlj7PjgI3jgIzlt6bjgI3jgIzmiJDjgI3jgIzkuI3miJDjgI3ku6XlpJbjga7mjqXlsL7ovp7jga/mnKrlrp/oo4XjgafjgZnjgILvvJflha3ph5HvvIjvvJfkupTvvInjgarjganjgajmm7jjgYTjgabkuIvjgZXjgYTjgIJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIG8uZnJvbSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIC8vIOmnkuOBjOOBqeOBk+OBi+OCieadpeOBn+OBi+OBjOWIhuOBi+OCieOBquOBhOOAglxyXG4gICAgICAgIC8vIOOBk+OBruOCiOOBhuOBquOBqOOBjeOBq+OBr+OAgVxyXG4gICAgICAgIC8vIOODu+aJk+OBpOOBl+OBi+OBquOBhOOBquOCieaJk+OBpFxyXG4gICAgICAgIC8vIOODu+OBneOBhuOBp+OBquOBj+OBpuOAgeebrueahOWcsOOBq+ihjOOBkeOCi+mnkuOBjOebpOS4iuOBqyAxIOeorumhnuOBl+OBi+OBquOBhOOBquOCieOAgeOBneOCjOOCkuOBmeOCi1xyXG4gICAgICAgIC8vIOOBqOOBhOOBhuino+axuuOCkuOBmeOCi+OBk+OBqOOBq+OBquOCi+OAglxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8g44GX44GL44GX44CB44GT44Gu44Ky44O844Og44Gr44GK44GE44Gm44CB5LqM44Od44Gv44CM552A5omL44Gn44GN44Gq44GE5omL44CN44Gn44Gv44Gq44GP44Gm44CB44CM552A5omL44GX44Gf5b6M44Gr44CB55+z44OV44Kn44Kk44K66Kej5raI5b6M44Gr44KC44Gd44KM44GM5q6L44Gj44Gm44GX44G+44Gj44Gm44GE44Gf44KJ44CB5Y+N5YmH6LKg44GR44CN44Go44Gq44KL44KC44Gu44Gn44GC44KL44CCXHJcbiAgICAgICAgLy8g44GT44Gu5YmN5o+Q44Gu44KC44Go44Gn44CB44Od44GM5qiq5Lim44Gz44GX44Gm44GE44KL44Go44GN44Gr44CB54mH5pa544Gu44Od44Gu5YmN44Gr44GC44KL6aeS44KS5Y+W44KN44GG44Go44GX44Gm44GE44KL54q25rOB44KS6ICD44GI44Gm44G744GX44GE44CCXHJcbiAgICAgICAgLy8g44GZ44KL44Go44CB5bi46K2Y55qE44Gr44Gv44Gd44KT44Gq44GC44GL44KJ44GV44G+44Gq5LqM44Od44Gv5oyH44GV44Gq44GE44Gu44Gn44CBMeODnuOCueWJjemAsuOBl+OBpuWPluOCi+OBruOBjOW9k+OBn+OCiuWJjeOBp+OBguOCiuOAgVxyXG4gICAgICAgIC8vIOOBneOCjOOCkuaji+itnOOBq+i1t+OBk+OBmeOBqOOBjeOBq+OCj+OBluOCj+OBluOAjOebtOOAjeOCkuS7mOOBkeOCi+OBquOBqeODkOOCq+ODkOOCq+OBl+OBhOOAglxyXG4gICAgICAgIC8vIOOCiOOBo+OBpuOAgeWHuueZuueCueaOqOirluOBq+OBiuOBhOOBpuOBr+OAgeacgOWIneOBr+S6jOODneOBr+aOkumZpOOBl+OBpuaOqOirluOBmeOCi+OBk+OBqOOBqOOBmeOCi+OAglxyXG4gICAgICAgIC8vIFdlIGhhdmUgbm8gaW5mbyBvbiB3aGVyZSB0aGUgcGllY2UgY2FtZSBmcm9tLlxyXG4gICAgICAgIC8vIEluIHN1Y2ggY2FzZXMsIHRoZSByYXRpb25hbCB3YXkgb2YgaW5mZXJlbmNlIGlzXHJcbiAgICAgICAgLy8gKiBQYXJhY2h1dGUgYSBwaWVjZSBpZiB5b3UgaGF2ZSB0by5cclxuICAgICAgICAvLyAqIE90aGVyd2lzZSwgaWYgdGhlcmUgaXMgb25seSBvbmUgcGllY2Ugb24gYm9hcmQgdGhhdCBjYW4gZ28gdG8gdGhlIHNwZWNpZmllZCBkZXN0aW5hdGlvbiwgdGFrZSB0aGF0IG1vdmUuXHJcbiAgICAgICAgLy8gXHJcbiAgICAgICAgLy8gSG93ZXZlciwgaW4gdGhpcyBnYW1lLCBkb3VibGVkIHBhd25zIGFyZSBub3QgYW4gaW1wb3NzaWJsZSBtb3ZlLCBidXQgcmF0aGVyIGEgbW92ZSB0aGF0IGNhdXNlIHlvdSB0byBsb3NlIGlmIGl0IHJlbWFpbmVkIGV2ZW4gYWZ0ZXIgdGhlIHJlbW92YWwtYnktZ28uXHJcbiAgICAgICAgLy8gVW5kZXIgc3VjaCBhbiBhc3N1bXB0aW9uLCBjb25zaWRlciB0aGUgc2l0dWF0aW9uIHdoZXJlIHRoZXJlIGFyZSB0d28gcGF3bnMgbmV4dCB0byBlYWNoIG90aGVyIGFuZCB0aGVyZSBpcyBhbiBlbmVteSBwaWVjZSByaWdodCBpbiBmcm9udCBvZiBvbmUgb2YgaXQuXHJcbiAgICAgICAgLy8gSW4gc3VjaCBhIGNhc2UsIGl0IGlzIHZlcnkgZWFzeSB0byBzZWUgdGhhdCB0YWtpbmcgdGhlIHBpZWNlIGRpYWdvbmFsbHkgcmVzdWx0cyBpbiBkb3VibGVkIHBhd25zLlxyXG4gICAgICAgIC8vIEhlbmNlLCB3aGVuIHdyaXRpbmcgdGhhdCBtb3ZlIGRvd24sIHlvdSBkb24ndCB3YW50IHRvIGV4cGxpY2l0bHkgYW5ub3RhdGUgc3VjaCBhIGNhc2Ugd2l0aCDnm7QuXHJcbiAgICAgICAgLy8gVGhlcmVmb3JlLCB3aGVuIGluZmVycmluZyB0aGUgcG9pbnQgb2Ygb3JpZ2luLCBJIGZpcnN0IGlnbm9yZSB0aGUgZG91YmxlZCBwYXducy5cclxuICAgICAgICBjb25zdCBwcnVuZWQgPSBwb3NzaWJsZV9wb2ludHNfb2Zfb3JpZ2luLmZpbHRlcihmcm9tID0+IGNhbl9tb3ZlX2FuZF9ub3RfY2F1c2VfZG91YmxlZF9wYXducyhvbGQuYm9hcmQsIHsgZnJvbSwgdG86IG8udG8gfSkpO1xyXG4gICAgICAgIGlmIChwcnVuZWQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGlmIChvLnByb2YgPT09IFwi44KtXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vIOOCreODo+OCueODquODs+OCsOOBiuOCiOOBs+OBj+OBvuOCiuOCk+OBkOOBr+OCreODs+OCsOeOi+OBruWLleOBjeOBqOOBl+OBpuabuOOBj+OAglxyXG4gICAgICAgICAgICAgICAgLy8g5bi444Gr44Kt44Oz44Kw44GM6YCa5bi45YuV44GR44Gq44GE56+E5Zuy44G444Gu56e75YuV44Go44Gq44KL44CCXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ga3VtYWxpbmcyKG9sZCwgcG9zc2libGVfcG9pbnRzX29mX29yaWdpblswXSwgby50byk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZXhpc3RzX2luX2hhbmQpIHtcclxuICAgICAgICAgICAgICAgIGlmICgoMCwgdHlwZV8xLmlzVW5wcm9tb3RlZFNob2dpUHJvZmVzc2lvbikoby5wcm9mKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJhY2h1dGUob2xkLCB7IHNpZGU6IG8uc2lkZSwgcHJvZjogby5wcm9mLCB0bzogby50byB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFVucHJvbW90ZWRTaG9naVByb2Zlc3Npb24g5Lul5aSW44Gv5omL6aeS44Gr5YWl44Gj44Gm44GE44KL44Gv44Ga44GM44Gq44GE44Gu44Gn44CBXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZXhpc3RzX2luX2hhbmQg44GM5rqA44Gf44GV44KM44Gm44GE44KL5pmC54K544GnIFVucHJvbW90ZWRTaG9naVByb2Zlc3Npb24g44Gn44GC44KL44GT44Go44Gv5pei44Gr56K65a6a44GX44Gm44GE44KLXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2hvdWxkIG5vdCByZWFjaCBoZXJlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJ1bmVkX2FsbG93aW5nX2RvdWJsZWRfcGF3bnMgPSBwb3NzaWJsZV9wb2ludHNfb2Zfb3JpZ2luLmZpbHRlcihmcm9tID0+IGNhbl9tb3ZlKG9sZC5ib2FyZCwgeyBmcm9tLCB0bzogby50byB9KSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJ1bmVkX2FsbG93aW5nX2RvdWJsZWRfcGF3bnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3jgajjga7jgZPjgajjgafjgZnjgYzjgIHjgZ3jga7jgojjgYbjgarnp7vli5XjgYzjgafjgY3jgoske28uc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBr+ebpOS4iuOBq+OBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocHJ1bmVkX2FsbG93aW5nX2RvdWJsZWRfcGF3bnMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZnJvbSA9IHBydW5lZF9hbGxvd2luZ19kb3VibGVkX3Bhd25zWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtb3ZlX3BpZWNlKG9sZCwgeyBmcm9tLCB0bzogby50bywgc2lkZTogby5zaWRlLCBwcm9tb3RlOiBvLnByb21vdGVzID8/IG51bGwgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7by5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944GM55uk5LiK44Gr6KSH5pWw44GC44KK44CB44GX44GL44KC44Gp44KM44KS5oyH44GX44Gm44KC5LqM44Od44Gn44GZYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocHJ1bmVkLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCBmcm9tID0gcHJ1bmVkWzBdO1xyXG4gICAgICAgICAgICByZXR1cm4gbW92ZV9waWVjZShvbGQsIHsgZnJvbSwgdG86IG8udG8sIHNpZGU6IG8uc2lkZSwgcHJvbW90ZTogby5wcm9tb3RlcyA/PyBudWxsIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3jgajjga7jgZPjgajjgafjgZnjgYzjgIHjgZ3jga7jgojjgYbjgarnp7vli5XjgYzjgafjgY3jgoske28uc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBjOebpOS4iuOBq+ikh+aVsOOBguOCiuOAgeOBqeOCjOOCkuaOoeeUqOOBmeOCi+OBueOBjeOBi+WIhuOBi+OCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IGZyb20gPSBvLmZyb207XHJcbiAgICAgICAgaWYgKCFwb3NzaWJsZV9wb2ludHNfb2Zfb3JpZ2luLnNvbWUoYyA9PiAoMCwgY29vcmRpbmF0ZV8xLmNvb3JkRXEpKGMsIGZyb20pKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBqCR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944KS5YuV44GL44Gd44GG44Go44GX44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoZnJvbSl944Gr44GvJHtvLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jga/jgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNhbl9tb3ZlKG9sZC5ib2FyZCwgeyBmcm9tLCB0bzogby50byB9KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbW92ZV9waWVjZShvbGQsIHsgZnJvbSwgdG86IG8udG8sIHNpZGU6IG8uc2lkZSwgcHJvbW90ZTogby5wcm9tb3RlcyA/PyBudWxsIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChvLnByb2YgPT09IFwi44KtXCIpIHtcclxuICAgICAgICAgICAgLy8g44Kt44Oj44K544Oq44Oz44Kw44GK44KI44Gz44GP44G+44KK44KT44GQ44Gv44Kt44Oz44Kw546L44Gu5YuV44GN44Go44GX44Gm5pu444GP44CCXHJcbiAgICAgICAgICAgIC8vIOW4uOOBq+OCreODs+OCsOOBjOmAmuW4uOWLleOBkeOBquOBhOevhOWbsuOBuOOBruenu+WLleOBqOOBquOCi+OAglxyXG4gICAgICAgICAgICByZXR1cm4ga3VtYWxpbmcyKG9sZCwgZnJvbSwgby50byk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBqCR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944KS5YuV44GL44Gd44GG44Go44GX44Gm44GE44G+44GZ44GM44CBJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jga8keygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShmcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjli5XjgZHjgovpp5Ljgafjga/jgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5wbGF5X3BpZWNlX3BoYXNlID0gcGxheV9waWVjZV9waGFzZTtcclxuLyoqIGBvLnNpZGVgIOOBjOmnkuOCkiBgby5mcm9tYCDjgYvjgokgYG8udG9gIOOBq+WLleOBi+OBmeOAguOBneOBrumnkuOBjCBgby5mcm9tYCDjgYvjgokgYG8udG9gIOOBuOOBqCBjYW5fbW92ZSDjgafjgYLjgovjgZPjgajjgpLopoHmsYLjgZnjgovjgILjgq3jg6Pjgrnjg6rjg7PjgrDjg7vjgY/jgb7jgorjgpPjgZDjga/mibHjgo/jgarjgYTjgYzjgIHjgqLjg7Pjg5Hjg4PjgrXjg7Pjga/mibHjgYbjgIJcclxuICovXHJcbmZ1bmN0aW9uIG1vdmVfcGllY2Uob2xkLCBvKSB7XHJcbiAgICBjb25zdCBwaWVjZV90aGF0X21vdmVzID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShvbGQuYm9hcmQsIG8uZnJvbSk7XHJcbiAgICBpZiAoIXBpZWNlX3RoYXRfbW92ZXMpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Gu56e75YuV44KS6Kmm44G/44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgavjga/pp5LjgYzjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHBpZWNlX3RoYXRfbW92ZXMudHlwZSA9PT0gXCLnooFcIikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjga7np7vli5XjgpLoqabjgb/jgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBq+OBguOCi+OBruOBr+eigeefs+OBp+OBguOCiuOAgemnkuOBp+OBr+OBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocGllY2VfdGhhdF9tb3Zlcy5zaWRlICE9PSBvLnNpZGUpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Gu56e75YuV44KS6Kmm44G/44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgavjgYLjgovjga7jga8keygwLCBzaWRlXzEub3Bwb25lbnRPZikoby5zaWRlKX3jga7pp5LjgafjgZlgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHJlcyA9IGNhbl9tb3ZlKG9sZC5ib2FyZCwgeyBmcm9tOiBvLmZyb20sIHRvOiBvLnRvIH0pO1xyXG4gICAgaWYgKHJlcyA9PT0gXCJlbiBwYXNzYW50XCIpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiAgICAgICAgICBmcm9tWzBdIHRvWzBdXHJcbiAgICAgICAgICogICAgICAgICB8ICAuLiAgfCAgLi4gIHxcclxuICAgICAgICAgKiB0b1sxXSAgIHwgIC4uICB8ICB0byAgfFxyXG4gICAgICAgICAqIGZyb21bMV0gfCBmcm9tIHwgcGF3biB8XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3QgY29vcmRfaG9yaXpvbnRhbGx5X2FkamFjZW50ID0gW28udG9bMF0sIG8uZnJvbVsxXV07XHJcbiAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby50bywgcGllY2VfdGhhdF9tb3Zlcyk7XHJcbiAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby5mcm9tLCBudWxsKTtcclxuICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBjb29yZF9ob3Jpem9udGFsbHlfYWRqYWNlbnQsIG51bGwpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHBoYXNlOiBcInBpZWNlX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgICAgICBib2FyZDogb2xkLmJvYXJkLFxyXG4gICAgICAgICAgICBoYW5kX29mX2JsYWNrOiBvbGQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICAgICAgaGFuZF9vZl93aGl0ZTogb2xkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgICAgIGJ5X3dob206IG9sZC53aG9fZ29lc19uZXh0XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCFyZXMpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Gu56e75YuV44KS6Kmm44G/44Gm44GE44G+44GZ44GM44CB6aeS44Gu5YuV44GN5LiK44Gd44Gu44KI44GG44Gq56e75YuV44Gv44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICB9XHJcbiAgICBpZiAoKDAsIHR5cGVfMS5pc19wcm9tb3RhYmxlKShwaWVjZV90aGF0X21vdmVzLnByb2YpXHJcbiAgICAgICAgJiYgKCgwLCBzaWRlXzEuaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzKSgzLCBvLnNpZGUsIG8uZnJvbSkgfHwgKDAsIHNpZGVfMS5pc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3MpKDMsIG8uc2lkZSwgby50bykpKSB7XHJcbiAgICAgICAgaWYgKG8ucHJvbW90ZSkge1xyXG4gICAgICAgICAgICBpZiAocGllY2VfdGhhdF9tb3Zlcy5wcm9mID09PSBcIuahglwiKSB7XHJcbiAgICAgICAgICAgICAgICBwaWVjZV90aGF0X21vdmVzLnByb2YgPSBcIuaIkOahglwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9PT0gXCLpioBcIikge1xyXG4gICAgICAgICAgICAgICAgcGllY2VfdGhhdF9tb3Zlcy5wcm9mID0gXCLmiJDpioBcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwaWVjZV90aGF0X21vdmVzLnByb2YgPT09IFwi6aaZXCIpIHtcclxuICAgICAgICAgICAgICAgIHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9IFwi5oiQ6aaZXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocGllY2VfdGhhdF9tb3Zlcy5wcm9mID09PSBcIuOCrVwiKSB7XHJcbiAgICAgICAgICAgICAgICBwaWVjZV90aGF0X21vdmVzLnByb2YgPSBcIui2hVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9PT0gXCLjg51cIikge1xyXG4gICAgICAgICAgICAgICAgcGllY2VfdGhhdF9tb3Zlcy5wcm9mID0gXCLjgahcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKChwaWVjZV90aGF0X21vdmVzLnByb2YgPT09IFwi5qGCXCIgJiYgKDAsIHNpZGVfMS5pc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3MpKDIsIG8uc2lkZSwgby50bykpXHJcbiAgICAgICAgICAgICAgICB8fCAocGllY2VfdGhhdF9tb3Zlcy5wcm9mID09PSBcIummmVwiICYmICgwLCBzaWRlXzEuaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzKSgxLCBvLnNpZGUsIG8udG8pKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke3BpZWNlX3RoYXRfbW92ZXMucHJvZn3kuI3miJDjgajjga7jgZPjgajjgafjgZnjgYzjgIEkeygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShwaWVjZV90aGF0X21vdmVzLnByb2YpfeOCkuS4jeaIkOOBp+ihjOOBjeOBqeOBk+OCjeOBruOBquOBhOOBqOOBk+OCjeOBq+ihjOOBi+OBm+OCi+OBk+OBqOOBr+OBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKG8ucHJvbW90ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7cGllY2VfdGhhdF9tb3Zlcy5wcm9mfSR7by5wcm9tb3RlID8gXCLmiJBcIiA6IFwi5LiN5oiQXCJ944Go44Gu44GT44Go44Gn44GZ44GM44CB44GT44Gu56e75YuV44Gv5oiQ44KK44KS55m655Sf44GV44Gb44Gq44GE44Gu44Gn44CMJHtvLnByb21vdGUgPyBcIuaIkFwiIDogXCLkuI3miJBcIn3jgI3ooajoqJjjga/jgafjgY3jgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBvY2N1cGllciA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkob2xkLmJvYXJkLCBvLnRvKTtcclxuICAgIGlmICghb2NjdXBpZXIpIHtcclxuICAgICAgICBpZiAocGllY2VfdGhhdF9tb3Zlcy5wcm9mID09PSBcIuODnVwiICYmIHBpZWNlX3RoYXRfbW92ZXMubmV2ZXJfbW92ZWQgJiYgby50b1sxXSA9PT0gXCLkupRcIikge1xyXG4gICAgICAgICAgICBwaWVjZV90aGF0X21vdmVzLnN1YmplY3RfdG9fZW5fcGFzc2FudCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8udG8sIHBpZWNlX3RoYXRfbW92ZXMpO1xyXG4gICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8uZnJvbSwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcGhhc2U6IFwicGllY2VfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgICAgIGhhbmRfb2ZfYmxhY2s6IG9sZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgICAgICBoYW5kX29mX3doaXRlOiBvbGQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICAgICAgYnlfd2hvbTogb2xkLndob19nb2VzX25leHRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAob2NjdXBpZXIudHlwZSA9PT0gXCLnooFcIikge1xyXG4gICAgICAgIGlmIChvY2N1cGllci5zaWRlID09PSBvLnNpZGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBruenu+WLleOCkuippuOBv+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBq+iHquWIhuOBrueigeefs+OBjOOBguOCi+OBruOBp+OAgeenu+WLleOBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby50bywgcGllY2VfdGhhdF9tb3Zlcyk7XHJcbiAgICAgICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8uZnJvbSwgbnVsbCk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwaGFzZTogXCJwaWVjZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICAgICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgICAgICAgICBoYW5kX29mX2JsYWNrOiBvbGQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICAgICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgICAgICAgICAgYnlfd2hvbTogb2xkLndob19nb2VzX25leHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAob2NjdXBpZXIuc2lkZSA9PT0gby5zaWRlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjga7np7vli5XjgpLoqabjgb/jgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgavoh6rliIbjga7pp5LjgYzjgYLjgovjga7jgafjgIHnp7vli5XjgafjgY3jgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAob2NjdXBpZXIudHlwZSA9PT0gXCLjgZfjgodcIikge1xyXG4gICAgICAgICAgICAoby5zaWRlID09PSBcIueZvVwiID8gb2xkLmhhbmRfb2Zfd2hpdGUgOiBvbGQuaGFuZF9vZl9ibGFjaykucHVzaCgoMCwgdHlwZV8xLnVucHJvbW90ZSkob2NjdXBpZXIucHJvZikpO1xyXG4gICAgICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLnRvLCBwaWVjZV90aGF0X21vdmVzKTtcclxuICAgICAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby5mcm9tLCBudWxsKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBoYXNlOiBcInBpZWNlX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgICAgICAgICAgYm9hcmQ6IG9sZC5ib2FyZCxcclxuICAgICAgICAgICAgICAgIGhhbmRfb2ZfYmxhY2s6IG9sZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgICAgICAgICAgaGFuZF9vZl93aGl0ZTogb2xkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgICAgICAgICBieV93aG9tOiBvbGQud2hvX2dvZXNfbmV4dFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby50bywgcGllY2VfdGhhdF9tb3Zlcyk7XHJcbiAgICAgICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8uZnJvbSwgbnVsbCk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwaGFzZTogXCJwaWVjZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICAgICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgICAgICAgICBoYW5kX29mX2JsYWNrOiBvbGQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICAgICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgICAgICAgICAgYnlfd2hvbTogb2xkLndob19nb2VzX25leHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIGBvLmZyb21gIOOBq+mnkuOBjOOBguOBo+OBpuOBneOBrumnkuOBjCBgby50b2Ag44G444Go5YuV44GP5L2Z5Zyw44GM44GC44KL44GL44Gp44GG44GL44KS6L+U44GZ44CCYG8udG9gIOOBjOWRs+aWueOBrumnkuOBp+Wfi+OBvuOBo+OBpuOBhOOBn+OCiSBmYWxzZSDjgaDjgZfjgIHjg53jg7zjg7Pjga7mlpzjgoHliY3jgavmlbXpp5LjgYzjgarjgYTjgarjgonmlpzjgoHliY3jga8gZmFsc2Ug44Go44Gq44KL44CCXHJcbiAqICBDaGVja3Mgd2hldGhlciB0aGVyZSBpcyBhIHBpZWNlIGF0IGBvLmZyb21gIHdoaWNoIGNhbiBtb3ZlIHRvIGBvLnRvYC4gV2hlbiBgby50b2AgaXMgb2NjdXBpZWQgYnkgYW4gYWxseSwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIGZhbHNlLFxyXG4gKiAgYW5kIHdoZW4gdGhlcmUgaXMgbm8gZW5lbXkgcGllY2UgZGlhZ29uYWwgdG8gcGF3biwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIGZhbHNlIGZvciB0aGUgZGlhZ29uYWwgZGlyZWN0aW9uLlxyXG4gKiBAcGFyYW0gYm9hcmRcclxuICogQHBhcmFtIG9cclxuICogQHJldHVybnNcclxuICovXHJcbmZ1bmN0aW9uIGNhbl9tb3ZlKGJvYXJkLCBvKSB7XHJcbiAgICBjb25zdCBwID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgby5mcm9tKTtcclxuICAgIGlmICghcCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChwLnR5cGUgPT09IFwi56KBXCIpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjb25zdCBwaWVjZV9hdF9kZXN0aW5hdGlvbiA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIG8udG8pO1xyXG4gICAgaWYgKHBpZWNlX2F0X2Rlc3RpbmF0aW9uPy5zaWRlID09PSBwLnNpZGUpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAocC5wcm9mICE9PSBcIuODnVwiKSB7XHJcbiAgICAgICAgcmV0dXJuICgwLCBjYW5fc2VlXzEuY2FuX3NlZSkoYm9hcmQsIG8pO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGVsdGEgPSAoMCwgc2lkZV8xLmNvb3JkRGlmZlNlZW5Gcm9tKShwLnNpZGUsIG8pO1xyXG4gICAgLy8gY2FuIGFsd2F5cyBtb3ZlIGZvcndhcmRcclxuICAgIGlmIChkZWx0YS52ID09PSAxICYmIGRlbHRhLmggPT09IDApIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIC8vIGNhbiB0YWtlIGRpYWdvbmFsbHksIGFzIGxvbmcgYXMgYW4gb3Bwb25lbnQncyBwaWVjZSBpcyBsb2NhdGVkIHRoZXJlLCBvciB3aGVuIGl0IGlzIGFuIGVuIHBhc3NhbnRcclxuICAgIGlmIChkZWx0YS52ID09PSAxICYmIChkZWx0YS5oID09PSAxIHx8IGRlbHRhLmggPT09IC0xKSkge1xyXG4gICAgICAgIGlmIChwaWVjZV9hdF9kZXN0aW5hdGlvbj8uc2lkZSA9PT0gKDAsIHNpZGVfMS5vcHBvbmVudE9mKShwLnNpZGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgY29vcmRfaG9yaXpvbnRhbGx5X2FkamFjZW50ID0gKDAsIHNpZGVfMS5hcHBseURlbHRhU2VlbkZyb20pKHAuc2lkZSwgby5mcm9tLCB7IHY6IDAsIGg6IGRlbHRhLmggfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBpZWNlX2hvcml6b250YWxseV9hZGphY2VudCA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIGNvb3JkX2hvcml6b250YWxseV9hZGphY2VudCk7XHJcbiAgICAgICAgICAgIGlmIChvLmZyb21bMV0gPT09IFwi5LqUXCJcclxuICAgICAgICAgICAgICAgICYmIHBpZWNlX2hvcml6b250YWxseV9hZGphY2VudD8udHlwZSA9PT0gXCLjgrlcIlxyXG4gICAgICAgICAgICAgICAgJiYgcGllY2VfaG9yaXpvbnRhbGx5X2FkamFjZW50LnByb2YgPT09IFwi44OdXCJcclxuICAgICAgICAgICAgICAgICYmIHBpZWNlX2hvcml6b250YWxseV9hZGphY2VudC5zdWJqZWN0X3RvX2VuX3Bhc3NhbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImVuIHBhc3NhbnRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChwLm5ldmVyX21vdmVkICYmIGRlbHRhLnYgPT09IDIgJiYgZGVsdGEuaCA9PT0gMCkge1xyXG4gICAgICAgIC8vIGNhbiBtb3ZlIHR3byBpbiB0aGUgZnJvbnQsIHVubGVzcyBibG9ja2VkXHJcbiAgICAgICAgY29uc3QgY29vcmRfaW5fZnJvbnQgPSAoMCwgc2lkZV8xLmFwcGx5RGVsdGFTZWVuRnJvbSkocC5zaWRlLCBvLmZyb20sIHsgdjogMSwgaDogMCB9KTtcclxuICAgICAgICBjb25zdCBjb29yZF90d29faW5fZnJvbnQgPSAoMCwgc2lkZV8xLmFwcGx5RGVsdGFTZWVuRnJvbSkocC5zaWRlLCBvLmZyb20sIHsgdjogMiwgaDogMCB9KTtcclxuICAgICAgICBpZiAoKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgY29vcmRfaW5fZnJvbnQpXHJcbiAgICAgICAgICAgIHx8ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIGNvb3JkX3R3b19pbl9mcm9udCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmNhbl9tb3ZlID0gY2FuX21vdmU7XHJcbmZ1bmN0aW9uIGNhbl9tb3ZlX2FuZF9ub3RfY2F1c2VfZG91YmxlZF9wYXducyhib2FyZCwgbykge1xyXG4gICAgaWYgKCFjYW5fbW92ZShib2FyZCwgbykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjb25zdCBwaWVjZSA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIG8uZnJvbSk7XHJcbiAgICBpZiAocGllY2U/LnR5cGUgPT09IFwi44K5XCIgJiYgcGllY2UucHJvZiA9PT0gXCLjg51cIikge1xyXG4gICAgICAgIGlmIChvLmZyb21bMF0gPT09IG8udG9bMF0pIHsgLy8gbm8gcmlzayBvZiBkb3VibGVkIHBhd25zIHdoZW4gdGhlIHBhd24gbW92ZXMgc3RyYWlnaHRcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBwYXduX2Nvb3JkcyA9ICgwLCBib2FyZF8xLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mKShib2FyZCwgcGllY2Uuc2lkZSwgXCLjg51cIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2JsZW1hdGljX3Bhd25zID0gcGF3bl9jb29yZHMuZmlsdGVyKChbY29sLCBfcm93XSkgPT4gY29sID09PSBvLnRvWzBdKTtcclxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgYXJlIG5vIHByb2JsZW1hdGljIHBhd25zLCByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBhcmUsIHdlIHdhbnQgdG8gYXZvaWQgc3VjaCBhIG1vdmUgaW4gdGhpcyBmdW5jdGlvbiwgc28gZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHByb2JsZW1hdGljX3Bhd25zLmxlbmd0aCA9PT0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBjYXN0bGluZyhvbGQsIG8pIHtcclxuICAgIC8vIOaknOafu+a4iO+8mlxyXG4gICAgLy8g4pGgIOOCreODs+OCsOeOi+OBjDHlm57jgaDjgZHliY3pgLLjgZfjgZ/nirbmhYvjgadcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIOOBk+OCjOOBi+OCieaknOafu++8mlxyXG4gICAgLy8g4pGhIOOCreODo+OCueODquODs+OCsOWvvuixoeOBruODq+ODvOOCr++8iOS7peS4i0HvvInjga/kuIDluqbjgoLli5XjgYTjgabjgYrjgonjgZpcclxuICAgIC8vIOKRoiDnm7jmiYvjgYvjgonjga7njovmiYvvvIjjg4Hjgqfjg4Pjgq/vvInjgYzmjpvjgYvjgaPjgabjgYrjgonjgZrnp7vli5XlhYjjga7jg57jgrnjgajpgJrpgY7ngrnjga7jg57jgrnjgavjgoLmlbXjga7pp5Ljga7liKnjgY3jga/jgarjgY9cclxuICAgIC8vIOKRoyDjgq3jg7PjgrDnjovjgahB44Gu6ZaT44Gr6aeS77yI44OB44Kn44K544CB5bCG5qOL77yJ44GM54Sh44GE5aC05ZCI44Gr5L2/55So44Gn44GN44KLXHJcbiAgICBjb25zdCBmcm9tX2NvbHVtbl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihvLmZyb21bMF0pO1xyXG4gICAgY29uc3QgdG9fY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKG8udG9bMF0pO1xyXG4gICAgY29uc3Qgcm9va19jb29yZCA9IFtmcm9tX2NvbHVtbl9pbmRleCA8IHRvX2NvbHVtbl9pbmRleCA/IFwi77yRXCIgOiBcIu+8mVwiLCBvLmZyb21bMV1dO1xyXG4gICAgY29uc3Qgcm9vayA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkob2xkLmJvYXJkLCByb29rX2Nvb3JkKTtcclxuICAgIGNvbnN0IGNvb3JkX3RoYXRfa2luZ19wYXNzZXNfdGhyb3VnaCA9IFtcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiWyhmcm9tX2NvbHVtbl9pbmRleCArIHRvX2NvbHVtbl9pbmRleCkgLyAyXSwgby5mcm9tWzFdXTtcclxuICAgIGlmIChyb29rPy50eXBlICE9PSBcIuOCuVwiIHx8IHJvb2sucHJvZiAhPT0gXCLjg6tcIikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjgajjgq3jg7PjgrDnjovjgpLjgq3jg6Pjgrnjg6rjg7PjgrDjgZfjgojjgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShyb29rX2Nvb3JkKX3jgavjg6vjg7zjgq/jgYzjgarjgYTjga7jgafjgq3jg6Pjgrnjg6rjg7PjgrDjgafjgY3jgb7jgZvjgpNgKTtcclxuICAgIH1cclxuICAgIGlmICghcm9vay5uZXZlcl9tb3ZlZCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjgajjgq3jg7PjgrDnjovjgpLjgq3jg6Pjgrnjg6rjg7PjgrDjgZfjgojjgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShyb29rX2Nvb3JkKX3jgavjgYLjgovjg6vjg7zjgq/jga/ml6Ljgavli5XjgYTjgZ/jgZPjgajjgYzjgYLjgovjg6vjg7zjgq/jgarjga7jgafjgq3jg6Pjgrnjg6rjg7PjgrDjgafjgY3jgb7jgZvjgpNgKTtcclxuICAgIH1cclxuICAgIGlmICgoMCwgY2FuX3NlZV8xLmRvX2FueV9vZl9teV9waWVjZXNfc2VlKShvbGQuYm9hcmQsIG8uZnJvbSwgKDAsIHNpZGVfMS5vcHBvbmVudE9mKShvLnNpZGUpKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjgajjgq3jg7PjgrDnjovjgpLjgq3jg6Pjgrnjg6rjg7PjgrDjgZfjgojjgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIHnm7jmiYvjgYvjgonjga7njovmiYvvvIjjg4Hjgqfjg4Pjgq/vvInjgYzmjpvjgYvjgaPjgabjgYTjgovjga7jgafjgq3jg6Pjgrnjg6rjg7PjgrDjgafjgY3jgb7jgZvjgpNgKTtcclxuICAgIH1cclxuICAgIGlmICgoMCwgY2FuX3NlZV8xLmRvX2FueV9vZl9teV9waWVjZXNfc2VlKShvbGQuYm9hcmQsIGNvb3JkX3RoYXRfa2luZ19wYXNzZXNfdGhyb3VnaCwgKDAsIHNpZGVfMS5vcHBvbmVudE9mKShvLnNpZGUpKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjgajjgq3jg7PjgrDnjovjgpLjgq3jg6Pjgrnjg6rjg7PjgrDjgZfjgojjgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIHpgJrpgY7ngrnjga7jg57jgrnjgavmlbXjga7pp5Ljga7liKnjgY3jgYzjgYLjgovjga7jgafjgq3jg6Pjgrnjg6rjg7PjgrDjgafjgY3jgb7jgZvjgpNgKTtcclxuICAgIH1cclxuICAgIGlmICgoMCwgY2FuX3NlZV8xLmRvX2FueV9vZl9teV9waWVjZXNfc2VlKShvbGQuYm9hcmQsIG8udG8sICgwLCBzaWRlXzEub3Bwb25lbnRPZikoby5zaWRlKSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Go44Kt44Oz44Kw546L44KS44Kt44Oj44K544Oq44Oz44Kw44GX44KI44GG44Go44GX44Gm44GE44G+44GZ44GM44CB56e75YuV5YWI44Gu44Oe44K544Gr5pW144Gu6aeS44Gu5Yip44GN44GM44GC44KL44Gu44Gn44Kt44Oj44K544Oq44Oz44Kw44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBjb29yZHNfYmV0d2Vlbl9raW5nX2FuZF9yb29rID0gKDAsIGNvb3JkaW5hdGVfMS5jb2x1bW5zQmV0d2Vlbikoby5mcm9tWzBdLCBvLnRvWzBdKS5tYXAoY29sID0+IFtjb2wsIG8uZnJvbVsxXV0pO1xyXG4gICAgY29uc3QgaGFzX3Nob2dpX29yX2NoZXNzX3BpZWNlID0gY29vcmRzX2JldHdlZW5fa2luZ19hbmRfcm9vay5zb21lKGNvb3JkID0+IHtcclxuICAgICAgICBjb25zdCBlbnRpdHkgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKG9sZC5ib2FyZCwgY29vcmQpO1xyXG4gICAgICAgIHJldHVybiBlbnRpdHk/LnR5cGUgPT09IFwi44GX44KHXCIgfHwgZW50aXR5Py50eXBlID09PSBcIuOCuVwiIHx8IGVudGl0eT8udHlwZSA9PT0gXCLnooFcIjtcclxuICAgIH0pO1xyXG4gICAgaWYgKGhhc19zaG9naV9vcl9jaGVzc19waWVjZSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjgajjgq3jg7PjgrDnjovjgpLjgq3jg6Pjgrnjg6rjg7PjgrDjgZfjgojjgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIHjgq3jg7PjgrDnjovjgajjg6vjg7zjgq/jga7plpPjgavpp5LjgYzjgYLjgovjga7jgafjgq3jg6Pjgrnjg6rjg7PjgrDjgafjgY3jgb7jgZvjgpNgKTtcclxuICAgIH1cclxuICAgIC8vIOKRpCDplpPjgavnooHnn7PjgYzjgYLjgozjgbDlj5bjgorpmaTjgY1cclxuICAgIGNvb3Jkc19iZXR3ZWVuX2tpbmdfYW5kX3Jvb2suZm9yRWFjaChjb29yZCA9PiAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBjb29yZCwgbnVsbCkpO1xyXG4gICAgLy8g4pGlIOOCreODs+OCsOeOi+OBryBBIOOBruaWueWQkeOBqyAyIOODnuOCueenu+WLleOBl1xyXG4gICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby50bywge1xyXG4gICAgICAgIHByb2Y6IFwi44KtXCIsXHJcbiAgICAgICAgc2lkZTogby5zaWRlLFxyXG4gICAgICAgIHR5cGU6IFwi546LXCIsXHJcbiAgICAgICAgaGFzX21vdmVkX29ubHlfb25jZTogZmFsc2UsXHJcbiAgICAgICAgbmV2ZXJfbW92ZWQ6IGZhbHNlLFxyXG4gICAgfSk7XHJcbiAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLmZyb20sIG51bGwpO1xyXG4gICAgLy8g4pGmIEEg44Gv44Kt44Oz44Kw546L44KS6aOb44Gz6LaK44GX44Gf6Zqj44Gu44Oe44K544Gr56e75YuV44GZ44KLXHJcbiAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBjb29yZF90aGF0X2tpbmdfcGFzc2VzX3Rocm91Z2gsIHJvb2spO1xyXG4gICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgcm9va19jb29yZCwgbnVsbCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBoYXNlOiBcInBpZWNlX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgaGFuZF9vZl9ibGFjazogb2xkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgaGFuZF9vZl93aGl0ZTogb2xkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgYnlfd2hvbTogb2xkLndob19nb2VzX25leHRcclxuICAgIH07XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5hcHBseURlbHRhU2VlbkZyb20gPSBleHBvcnRzLmlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cyA9IGV4cG9ydHMuY29vcmREaWZmU2VlbkZyb20gPSBleHBvcnRzLkxlZnRtb3N0V2hlblNlZW5Gcm9tID0gZXhwb3J0cy5SaWdodG1vc3RXaGVuU2VlbkZyb20gPSBleHBvcnRzLm9wcG9uZW50T2YgPSB2b2lkIDA7XHJcbmNvbnN0IGNvb3JkaW5hdGVfMSA9IHJlcXVpcmUoXCIuL2Nvb3JkaW5hdGVcIik7XHJcbmZ1bmN0aW9uIG9wcG9uZW50T2Yoc2lkZSkge1xyXG4gICAgaWYgKHNpZGUgPT09IFwi6buSXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi55m9XCI7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIFwi6buSXCI7XHJcbn1cclxuZXhwb3J0cy5vcHBvbmVudE9mID0gb3Bwb25lbnRPZjtcclxuZnVuY3Rpb24gUmlnaHRtb3N0V2hlblNlZW5Gcm9tKHNpZGUsIGNvb3Jkcykge1xyXG4gICAgaWYgKHNpZGUgPT09IFwi6buSXCIpIHtcclxuICAgICAgICByZXR1cm4gKDAsIGNvb3JkaW5hdGVfMS5SaWdodG1vc3RXaGVuU2VlbkZyb21CbGFjaykoY29vcmRzKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAoMCwgY29vcmRpbmF0ZV8xLkxlZnRtb3N0V2hlblNlZW5Gcm9tQmxhY2spKGNvb3Jkcyk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5SaWdodG1vc3RXaGVuU2VlbkZyb20gPSBSaWdodG1vc3RXaGVuU2VlbkZyb207XHJcbmZ1bmN0aW9uIExlZnRtb3N0V2hlblNlZW5Gcm9tKHNpZGUsIGNvb3Jkcykge1xyXG4gICAgaWYgKHNpZGUgPT09IFwi6buSXCIpIHtcclxuICAgICAgICByZXR1cm4gKDAsIGNvb3JkaW5hdGVfMS5MZWZ0bW9zdFdoZW5TZWVuRnJvbUJsYWNrKShjb29yZHMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICgwLCBjb29yZGluYXRlXzEuUmlnaHRtb3N0V2hlblNlZW5Gcm9tQmxhY2spKGNvb3Jkcyk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5MZWZ0bW9zdFdoZW5TZWVuRnJvbSA9IExlZnRtb3N0V2hlblNlZW5Gcm9tO1xyXG4vKiogdmVydGljYWwg44GMICsxID0g5YmN6YCy44CA44CAaG9yaXpvbnRhbCDjgYwgKzEgPSDlt6ZcclxuICovXHJcbmZ1bmN0aW9uIGNvb3JkRGlmZlNlZW5Gcm9tKHNpZGUsIG8pIHtcclxuICAgIGlmIChzaWRlID09PSBcIueZvVwiKSB7XHJcbiAgICAgICAgcmV0dXJuICgwLCBjb29yZGluYXRlXzEuY29vcmREaWZmKShvKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHsgaCwgdiB9ID0gKDAsIGNvb3JkaW5hdGVfMS5jb29yZERpZmYpKG8pO1xyXG4gICAgICAgIHJldHVybiB7IGg6IC1oLCB2OiAtdiB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuY29vcmREaWZmU2VlbkZyb20gPSBjb29yZERpZmZTZWVuRnJvbTtcclxuZnVuY3Rpb24gaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzKG4sIHNpZGUsIGNvb3JkKSB7XHJcbiAgICBjb25zdCByb3cgPSBjb29yZFsxXTtcclxuICAgIGlmIChzaWRlID09PSBcIum7klwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZihyb3cpIDwgbjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBcIuS5neWFq+S4g+WFreS6lOWbm+S4ieS6jOS4gFwiLmluZGV4T2Yocm93KSA8IG47XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5pc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3MgPSBpc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3M7XHJcbi8vIHNpbmNlIHRoaXMgZnVuY3Rpb24gaXMgb25seSB1c2VkIHRvIGludGVycG9sYXRlIGJldHdlZW4gdHdvIHZhbGlkIHBvaW50cywgdGhlcmUgaXMgbm8gbmVlZCB0byBwZXJmb3JtIGFuZCBvdXQtb2YtYm91bmRzIGNoZWNrLlxyXG5mdW5jdGlvbiBhcHBseURlbHRhU2VlbkZyb20oc2lkZSwgZnJvbSwgZGVsdGEpIHtcclxuICAgIGlmIChzaWRlID09PSBcIueZvVwiKSB7XHJcbiAgICAgICAgY29uc3QgW2Zyb21fY29sdW1uLCBmcm9tX3Jvd10gPSBmcm9tO1xyXG4gICAgICAgIGNvbnN0IGZyb21fcm93X2luZGV4ID0gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIi5pbmRleE9mKGZyb21fcm93KTtcclxuICAgICAgICBjb25zdCBmcm9tX2NvbHVtbl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihmcm9tX2NvbHVtbik7XHJcbiAgICAgICAgY29uc3QgdG9fY29sdW1uX2luZGV4ID0gZnJvbV9jb2x1bW5faW5kZXggKyBkZWx0YS5oO1xyXG4gICAgICAgIGNvbnN0IHRvX3Jvd19pbmRleCA9IGZyb21fcm93X2luZGV4ICsgZGVsdGEudjtcclxuICAgICAgICBjb25zdCBjb2x1bW5zID0gW1wi77yZXCIsIFwi77yYXCIsIFwi77yXXCIsIFwi77yWXCIsIFwi77yVXCIsIFwi77yUXCIsIFwi77yTXCIsIFwi77ySXCIsIFwi77yRXCJdO1xyXG4gICAgICAgIGNvbnN0IHJvd3MgPSBbXCLkuIBcIiwgXCLkuoxcIiwgXCLkuIlcIiwgXCLlm5tcIiwgXCLkupRcIiwgXCLlha1cIiwgXCLkuINcIiwgXCLlhatcIiwgXCLkuZ1cIl07XHJcbiAgICAgICAgcmV0dXJuIFtjb2x1bW5zW3RvX2NvbHVtbl9pbmRleF0sIHJvd3NbdG9fcm93X2luZGV4XV07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBbZnJvbV9jb2x1bW4sIGZyb21fcm93XSA9IGZyb207XHJcbiAgICAgICAgY29uc3QgZnJvbV9yb3dfaW5kZXggPSBcIuS4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5nVwiLmluZGV4T2YoZnJvbV9yb3cpO1xyXG4gICAgICAgIGNvbnN0IGZyb21fY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGZyb21fY29sdW1uKTtcclxuICAgICAgICBjb25zdCB0b19jb2x1bW5faW5kZXggPSBmcm9tX2NvbHVtbl9pbmRleCAtIGRlbHRhLmg7XHJcbiAgICAgICAgY29uc3QgdG9fcm93X2luZGV4ID0gZnJvbV9yb3dfaW5kZXggLSBkZWx0YS52O1xyXG4gICAgICAgIGNvbnN0IGNvbHVtbnMgPSBbXCLvvJlcIiwgXCLvvJhcIiwgXCLvvJdcIiwgXCLvvJZcIiwgXCLvvJVcIiwgXCLvvJRcIiwgXCLvvJNcIiwgXCLvvJJcIiwgXCLvvJFcIl07XHJcbiAgICAgICAgY29uc3Qgcm93cyA9IFtcIuS4gFwiLCBcIuS6jFwiLCBcIuS4iVwiLCBcIuWbm1wiLCBcIuS6lFwiLCBcIuWFrVwiLCBcIuS4g1wiLCBcIuWFq1wiLCBcIuS5nVwiXTtcclxuICAgICAgICByZXR1cm4gW2NvbHVtbnNbdG9fY29sdW1uX2luZGV4XSwgcm93c1t0b19yb3dfaW5kZXhdXTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmFwcGx5RGVsdGFTZWVuRnJvbSA9IGFwcGx5RGVsdGFTZWVuRnJvbTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5yZW1vdmVfc3Vycm91bmRlZCA9IHZvaWQgMDtcclxuZnVuY3Rpb24gcmVtb3ZlX3N1cnJvdW5kZWQoY29sb3JfdG9fYmVfcmVtb3ZlZCwgYm9hcmQpIHtcclxuICAgIGNvbnN0IGJvYXJkXyA9IGJvYXJkLm1hcChyb3cgPT4gcm93Lm1hcChzaWRlID0+IHNpZGUgPT09IG51bGwgPyBcImVtcHR5XCIgOiB7IHNpZGUsIHZpc2l0ZWQ6IGZhbHNlLCBjb25uZWN0ZWRfY29tcG9uZW50X2luZGV4OiAtMSB9KSk7XHJcbiAgICAvLyBEZXB0aC1maXJzdCBzZWFyY2ggdG8gYXNzaWduIGEgdW5pcXVlIGluZGV4IHRvIGVhY2ggY29ubmVjdGVkIGNvbXBvbmVudFxyXG4gICAgLy8g5ZCE6YCj57WQ5oiQ5YiG44Gr5LiA5oSP44Gq44Kk44Oz44OH44OD44Kv44K544KS44G144KL44Gf44KB44Gu5rex44GV5YSq5YWI5o6i57SiXHJcbiAgICBjb25zdCBkZnNfc3RhY2sgPSBbXTtcclxuICAgIGNvbnN0IGluZGljZXNfdGhhdF9zdXJ2aXZlID0gW107XHJcbiAgICBsZXQgaW5kZXggPSAwO1xyXG4gICAgZm9yIChsZXQgSSA9IDA7IEkgPCBib2FyZF8ubGVuZ3RoOyBJKyspIHtcclxuICAgICAgICBmb3IgKGxldCBKID0gMDsgSiA8IGJvYXJkX1tJXS5sZW5ndGg7IEorKykge1xyXG4gICAgICAgICAgICBjb25zdCBzcSA9IGJvYXJkX1tJXVtKXTtcclxuICAgICAgICAgICAgaWYgKHNxICE9PSBcImVtcHR5XCIgJiYgc3Euc2lkZSA9PT0gY29sb3JfdG9fYmVfcmVtb3ZlZCAmJiAhc3EudmlzaXRlZCkge1xyXG4gICAgICAgICAgICAgICAgZGZzX3N0YWNrLnB1c2goeyBpOiBJLCBqOiBKIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdoaWxlIChkZnNfc3RhY2subGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmVydGV4X2Nvb3JkID0gZGZzX3N0YWNrLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmVydGV4ID0gYm9hcmRfW3ZlcnRleF9jb29yZC5pXVt2ZXJ0ZXhfY29vcmQual07XHJcbiAgICAgICAgICAgICAgICBpZiAodmVydGV4ID09PSBcImVtcHR5XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBgZGZzX3N0YWNrYCDjgavnqbrjga7jg57jgrnjga/jg5fjg4Pjgrfjg6XjgZXjgozjgabjgYTjgarjgYTjga/jgZpcclxuICAgICAgICAgICAgICAgICAgICAvLyBhbiBlbXB0eSBzcXVhcmUgc2hvdWxkIG5vdCBiZSBwdXNoZWQgdG8gYGRmc19zdGFja2BcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzaG91bGQgbm90IHJlYWNoIGhlcmVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXgudmlzaXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXguY29ubmVjdGVkX2NvbXBvbmVudF9pbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIHsgaTogdmVydGV4X2Nvb3JkLmksIGo6IHZlcnRleF9jb29yZC5qICsgMSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgaTogdmVydGV4X2Nvb3JkLmksIGo6IHZlcnRleF9jb29yZC5qIC0gMSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgaTogdmVydGV4X2Nvb3JkLmkgKyAxLCBqOiB2ZXJ0ZXhfY29vcmQuaiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgaTogdmVydGV4X2Nvb3JkLmkgLSAxLCBqOiB2ZXJ0ZXhfY29vcmQuaiB9LFxyXG4gICAgICAgICAgICAgICAgXS5maWx0ZXIoKHsgaSwgaiB9KSA9PiB7IGNvbnN0IHJvdyA9IGJvYXJkX1tpXTsgcmV0dXJuIHJvdyAmJiAwIDw9IGogJiYgaiA8IHJvdy5sZW5ndGg7IH0pLmZvckVhY2goKHsgaSwgaiB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmVpZ2hib3IgPSBib2FyZF9baV1bal07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5laWdoYm9yID09PSBcImVtcHR5XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV4dCB0byBhbiBlbXB0eSBzcXVhcmUgKGEgbGliZXJ0eSk7IHN1cnZpdmVzLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlkbzlkLjngrnjgYzpmqPmjqXjgZfjgabjgYTjgovjga7jgafjgIHjgZPjga4gaW5kZXgg44GM5oyv44KJ44KM44Gm44GE44KL6YCj57WQ5oiQ5YiG44Gv5Li444CF55Sf44GN5bu244Gz44KLXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXNfdGhhdF9zdXJ2aXZlLnB1c2goaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChuZWlnaGJvci5zaWRlID09PSBjb2xvcl90b19iZV9yZW1vdmVkICYmICFuZWlnaGJvci52aXNpdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRmc19zdGFjay5wdXNoKHsgaSwgaiB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGluZGljZXNfdGhhdF9zdXJ2aXZlIOOBq+iomOi8ieOBruOBquOBhCBpbmRleCDjga7jgoTjgaTjgonjgpLliYrpmaTjgZfjgaYgYW5zIOOBuOOBqOi7ouiomFxyXG4gICAgLy8gQ29weSB0aGUgY29udGVudCB0byBgYW5zYCB3aGlsZSBkZWxldGluZyB0aGUgY29ubmVjdGVkIGNvbXBvbmVudHMgd2hvc2UgaW5kZXggaXMgbm90IGluIGBpbmRpY2VzX3RoYXRfc3Vydml2ZWBcclxuICAgIGNvbnN0IGFucyA9IFtdO1xyXG4gICAgZm9yIChsZXQgSSA9IDA7IEkgPCBib2FyZF8ubGVuZ3RoOyBJKyspIHtcclxuICAgICAgICBjb25zdCByb3cgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBKID0gMDsgSiA8IGJvYXJkX1tJXS5sZW5ndGg7IEorKykge1xyXG4gICAgICAgICAgICBjb25zdCBzcSA9IGJvYXJkX1tJXVtKXTtcclxuICAgICAgICAgICAgaWYgKHNxID09PSBcImVtcHR5XCIpIHtcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHNxLnNpZGUgPT09IGNvbG9yX3RvX2JlX3JlbW92ZWRcclxuICAgICAgICAgICAgICAgICYmICFpbmRpY2VzX3RoYXRfc3Vydml2ZS5pbmNsdWRlcyhzcS5jb25uZWN0ZWRfY29tcG9uZW50X2luZGV4KSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZG9lcyBub3Qgc3Vydml2ZVxyXG4gICAgICAgICAgICAgICAgcm93LnB1c2gobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByb3cucHVzaChzcS5zaWRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBhbnMucHVzaChyb3cpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFucztcclxufVxyXG5leHBvcnRzLnJlbW92ZV9zdXJyb3VuZGVkID0gcmVtb3ZlX3N1cnJvdW5kZWQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuaXNfcHJvbW90YWJsZSA9IGV4cG9ydHMuaXNVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uID0gZXhwb3J0cy5wcm9mZXNzaW9uRnVsbE5hbWUgPSBleHBvcnRzLnVucHJvbW90ZSA9IHZvaWQgMDtcclxuZnVuY3Rpb24gdW5wcm9tb3RlKGEpIHtcclxuICAgIGlmIChhID09PSBcIuaIkOahglwiKVxyXG4gICAgICAgIHJldHVybiBcIuahglwiO1xyXG4gICAgaWYgKGEgPT09IFwi5oiQ6YqAXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi6YqAXCI7XHJcbiAgICBpZiAoYSA9PT0gXCLmiJDppplcIilcclxuICAgICAgICByZXR1cm4gXCLppplcIjtcclxuICAgIHJldHVybiBhO1xyXG59XHJcbmV4cG9ydHMudW5wcm9tb3RlID0gdW5wcm9tb3RlO1xyXG5mdW5jdGlvbiBwcm9mZXNzaW9uRnVsbE5hbWUoYSkge1xyXG4gICAgaWYgKGEgPT09IFwi44GoXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjgajjgq/jgqPjg7zjg7NcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi44KtXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjgq3jg7PjgrDnjotcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi44KvXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjgq/jgqPjg7zjg7NcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi44OKXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjg4rjgqTjg4hcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi44OTXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjg5Pjgrfjg6fjg4Pjg5dcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi44OdXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjg53jg7zjg7PlhbVcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi44OrXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjg6vjg7zjgq9cIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi6LaFXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjgrnjg7zjg5Hjg7zjgq3jg7PjgrDnjotcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi5qGCXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLmoYLppqxcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi6aaZXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLpppnou4pcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi6YqAXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLpioDlsIZcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi6YeRXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLph5HlsIZcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMucHJvZmVzc2lvbkZ1bGxOYW1lID0gcHJvZmVzc2lvbkZ1bGxOYW1lO1xyXG5mdW5jdGlvbiBpc1VucHJvbW90ZWRTaG9naVByb2Zlc3Npb24oYSkge1xyXG4gICAgcmV0dXJuIGEgPT09IFwi6aaZXCIgfHxcclxuICAgICAgICBhID09PSBcIuahglwiIHx8XHJcbiAgICAgICAgYSA9PT0gXCLpioBcIiB8fFxyXG4gICAgICAgIGEgPT09IFwi6YeRXCI7XHJcbn1cclxuZXhwb3J0cy5pc1VucHJvbW90ZWRTaG9naVByb2Zlc3Npb24gPSBpc1VucHJvbW90ZWRTaG9naVByb2Zlc3Npb247XHJcbmZ1bmN0aW9uIGlzX3Byb21vdGFibGUocHJvZikge1xyXG4gICAgcmV0dXJuIHByb2YgPT09IFwi5qGCXCIgfHwgcHJvZiA9PT0gXCLpioBcIiB8fCBwcm9mID09PSBcIummmVwiIHx8IHByb2YgPT09IFwi44KtXCIgfHwgcHJvZiA9PT0gXCLjg51cIjtcclxufVxyXG5leHBvcnRzLmlzX3Byb21vdGFibGUgPSBpc19wcm9tb3RhYmxlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucGFyc2UgPSBleHBvcnRzLnBhcnNlX29uZSA9IGV4cG9ydHMucGFyc2VfcHJvZmVzc2lvbiA9IGV4cG9ydHMucGFyc2VfY29vcmQgPSB2b2lkIDA7XG5mdW5jdGlvbiBwYXJzZV9jb29yZChzKSB7XG4gICAgY29uc3QgY29sdW1uID0gKChjKSA9PiB7XG4gICAgICAgIGlmIChjID09PSBcIu+8kVwiIHx8IGMgPT09IFwiMVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCLvvJFcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8klwiIHx8IGMgPT09IFwiMlwiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCLvvJJcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8k1wiIHx8IGMgPT09IFwiM1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCLvvJNcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8lFwiIHx8IGMgPT09IFwiNFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCLvvJRcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8lVwiIHx8IGMgPT09IFwiNVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCLvvJVcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8llwiIHx8IGMgPT09IFwiNlwiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCLvvJZcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8l1wiIHx8IGMgPT09IFwiN1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCLvvJdcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8mFwiIHx8IGMgPT09IFwiOFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCLvvJhcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8mVwiIHx8IGMgPT09IFwiOVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCLvvJlcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5qOL6K2c44Gu562L77yI5YiX77yJ44GM44CMJHtjfeOAjeOBp+OBguOCiuOAjO+8keOAnO+8meOAjeOAjDHjgJw544CN44Gu44Gp44KM44Gn44KC44GC44KK44G+44Gb44KTYCk7XG4gICAgICAgIH1cbiAgICB9KShzWzBdKTtcbiAgICBjb25zdCByb3cgPSAoKGMpID0+IHtcbiAgICAgICAgaWYgKGMgPT09IFwi77yRXCIgfHwgYyA9PT0gXCIxXCIgfHwgYyA9PT0gXCLkuIBcIikge1xuICAgICAgICAgICAgcmV0dXJuIFwi5LiAXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJJcIiB8fCBjID09PSBcIjJcIiB8fCBjID09PSBcIuS6jFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCLkuoxcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8k1wiIHx8IGMgPT09IFwiM1wiIHx8IGMgPT09IFwi5LiJXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIuS4iVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yUXCIgfHwgYyA9PT0gXCI0XCIgfHwgYyA9PT0gXCLlm5tcIikge1xuICAgICAgICAgICAgcmV0dXJuIFwi5ZubXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJVcIiB8fCBjID09PSBcIjVcIiB8fCBjID09PSBcIuS6lFwiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCLkupRcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8llwiIHx8IGMgPT09IFwiNlwiIHx8IGMgPT09IFwi5YWtXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIuWFrVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yXXCIgfHwgYyA9PT0gXCI3XCIgfHwgYyA9PT0gXCLkuINcIikge1xuICAgICAgICAgICAgcmV0dXJuIFwi5LiDXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJhcIiB8fCBjID09PSBcIjhcIiB8fCBjID09PSBcIuWFq1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gXCLlhatcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8mVwiIHx8IGMgPT09IFwiOVwiIHx8IGMgPT09IFwi5LmdXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBcIuS5nVwiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDmo4vorZzjga7mrrXvvIjooYzvvInjgYzjgIwke2N944CN44Gn44GC44KK44CM77yR44Cc77yZ44CN44CMMeOAnDnjgI3jgIzkuIDjgJzkuZ3jgI3jga7jganjgozjgafjgoLjgYLjgorjgb7jgZvjgpNgKTtcbiAgICAgICAgfVxuICAgIH0pKHNbMV0pO1xuICAgIHJldHVybiBbY29sdW1uLCByb3ddO1xufVxuZXhwb3J0cy5wYXJzZV9jb29yZCA9IHBhcnNlX2Nvb3JkO1xuZnVuY3Rpb24gcGFyc2VfcHJvZmVzc2lvbihzKSB7XG4gICAgaWYgKHMgPT09IFwi6aaZXCIpXG4gICAgICAgIHJldHVybiBcIummmVwiO1xuICAgIGVsc2UgaWYgKHMgPT09IFwi5qGCXCIpXG4gICAgICAgIHJldHVybiBcIuahglwiO1xuICAgIGVsc2UgaWYgKHMgPT09IFwi6YqAXCIpXG4gICAgICAgIHJldHVybiBcIumKgFwiO1xuICAgIGVsc2UgaWYgKHMgPT09IFwi6YeRXCIpXG4gICAgICAgIHJldHVybiBcIumHkVwiO1xuICAgIGVsc2UgaWYgKHMgPT09IFwi5oiQ6aaZXCIgfHwgcyA9PT0gXCLmnY9cIilcbiAgICAgICAgcmV0dXJuIFwi5oiQ6aaZXCI7XG4gICAgZWxzZSBpZiAocyA9PT0gXCLmiJDmoYJcIiB8fCBzID09PSBcIuWcrVwiKVxuICAgICAgICByZXR1cm4gXCLmiJDmoYJcIjtcbiAgICBlbHNlIGlmIChzID09PSBcIuaIkOmKgFwiIHx8IHMgPT09IFwi5YWoXCIpXG4gICAgICAgIHJldHVybiBcIuaIkOmKgFwiO1xuICAgIGVsc2UgaWYgKHMgPT09IFwi44KvXCIpXG4gICAgICAgIHJldHVybiBcIuOCr1wiO1xuICAgIGVsc2UgaWYgKHMgPT09IFwi44OrXCIpXG4gICAgICAgIHJldHVybiBcIuODq1wiO1xuICAgIGVsc2UgaWYgKHMgPT09IFwi44OKXCIpXG4gICAgICAgIHJldHVybiBcIuODilwiO1xuICAgIGVsc2UgaWYgKHMgPT09IFwi44OTXCIpXG4gICAgICAgIHJldHVybiBcIuODk1wiO1xuICAgIGVsc2UgaWYgKHMgPT09IFwi44OdXCIgfHwgcyA9PT0gXCLmralcIiB8fCBzID09PSBcIuWFtVwiKVxuICAgICAgICByZXR1cm4gXCLjg51cIjtcbiAgICBlbHNlIGlmIChzID09PSBcIuOBqFwiKVxuICAgICAgICByZXR1cm4gXCLjgahcIjtcbiAgICBlbHNlIGlmIChzID09PSBcIuOCrVwiIHx8IHMgPT09IFwi546LXCIpXG4gICAgICAgIHJldHVybiBcIuOCrVwiO1xuICAgIGVsc2UgaWYgKHMgPT09IFwi6LaFXCIpXG4gICAgICAgIHJldHVybiBcIui2hVwiO1xuICAgIGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOmnkuOBrueorumhnuOBjOOAjCR7c33jgI3jgafjgYLjgorjgIzpppnjgI3jgIzmoYLjgI3jgIzpioDjgI3jgIzph5HjgI3jgIzmiJDpppnjgI3jgIzmiJDmoYLjgI3jgIzmiJDpioDjgI3jgIzmnY/jgI3jgIzlnK3jgI3jgIzlhajjgI3jgIzjgq/jgI3jgIzjg6vjgI3jgIzjg4rjgI3jgIzjg5PjgI3jgIzjg53jgI3jgIzmranjgI3jgIzlhbXjgI3jgIzjgajjgI3jgIzjgq3jgI3jgIznjovjgI3jgIzotoXjgI3jga7jganjgozjgafjgoLjgYLjgorjgb7jgZvjgpNgKTtcbiAgICB9XG59XG5leHBvcnRzLnBhcnNlX3Byb2Zlc3Npb24gPSBwYXJzZV9wcm9mZXNzaW9uO1xuZnVuY3Rpb24gcGFyc2Vfb25lKHMpIHtcbiAgICAvLyAwOiAgIOKWslxuICAgIC8vIDEtMjog77yX5LqUXG4gICAgLy8gMzog44OdXG4gICAgLy8gKDMtNCBpZiBwcm9tb3RlZClcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGNvbnN0IHNpZGUgPSBzWzBdID09PSBcIum7klwiIHx8IHNbMF0gPT09IFwi4payXCIgfHwgc1swXSA9PT0gXCLimJdcIiA/IFwi6buSXCIgOlxuICAgICAgICBzWzBdID09PSBcIueZvVwiIHx8IHNbMF0gPT09IFwi4pazXCIgfHwgc1swXSA9PT0gXCLimJZcIiA/IFwi55m9XCIgOiAoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYzjgIzpu5LjgI3jgIzilrLjgI3jgIzimJfjgI3jgIznmb3jgI3jgIzilrPjgI3jgIzimJbjgI3jga7jganjgozjgYvjgaflp4vjgb7jgaPjgabjgYTjgb7jgZvjgpNcIik7IH0pKCk7XG4gICAgaW5kZXgrKztcbiAgICBjb25zdCB0byA9IHBhcnNlX2Nvb3JkKHMuc2xpY2UoaW5kZXgsIGluZGV4ICsgMikpO1xuICAgIGluZGV4ICs9IDI7XG4gICAgY29uc3QgcHJvZmVzc2lvbl9sZW5ndGggPSBzWzNdID09PSBcIuaIkFwiID8gMiA6IDE7XG4gICAgY29uc3QgcHJvZiA9IHBhcnNlX3Byb2Zlc3Npb24ocy5zbGljZShpbmRleCwgaW5kZXggKyBwcm9mZXNzaW9uX2xlbmd0aCkpO1xuICAgIGluZGV4ICs9IHByb2Zlc3Npb25fbGVuZ3RoO1xuICAgIC8vIEFsbCB0aGF0IGZvbGxvd3MgYXJlIG9wdGlvbmFsLlxuICAgIC8vIOS7pemZjeOBr+OCquODl+OCt+ODp+ODiuODq+OAguOAjDEuIOenu+WLleWFg+aYjuiomOOAjeOAjDIuIOaIkOODu+S4jeaIkOOAjeOAjDMuIOeigeefs+OBruW6p+aomeOAjeOBjOOBk+OBrumghueVquOBp+ePvuOCjOOBquOBkeOCjOOBsOOBquOCieOBquOBhOOAglxuICAgIC8vIDEuIOenu+WLleWFg+aYjuiomFxuICAgIC8vIOOAjOWPs+OAjeOAjOW3puOAjeOAjOaJk+OAjeOAgeOBvuOBn+OBr+OAjO+8iDTkupTvvInjgI3jgarjgalcbiAgICBjb25zdCBmcm9tID0gKCgpID0+IHtcbiAgICAgICAgaWYgKHNbaW5kZXhdID09PSBcIuWPs1wiKSB7XG4gICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgcmV0dXJuIFwi5Y+zXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc1tpbmRleF0gPT09IFwi5bemXCIpIHtcbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICByZXR1cm4gXCLlt6ZcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzW2luZGV4XSA9PT0gXCLmiZNcIikge1xuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgIHJldHVybiBcIuaJk1wiO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNbaW5kZXhdID09PSBcIihcIiB8fCBzW2luZGV4XSA9PT0gXCLvvIhcIikge1xuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gcGFyc2VfY29vcmQocy5zbGljZShpbmRleCwgaW5kZXggKyAyKSk7XG4gICAgICAgICAgICBpbmRleCArPSAyO1xuICAgICAgICAgICAgaWYgKHNbaW5kZXhdID09PSBcIilcIiB8fCBzW2luZGV4XSA9PT0gXCLvvIlcIikge1xuICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvb3JkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDplovjgY3jgqvjg4PjgrPjgajluqfmqJnjga7lvozjgavplonjgZjjgqvjg4PjgrPjgYzjgYLjgorjgb7jgZvjgpNgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSkoKTtcbiAgICBjb25zdCBwcm9tb3RlcyA9ICgoKSA9PiB7XG4gICAgICAgIGlmIChzW2luZGV4XSA9PT0gXCLmiJBcIikge1xuICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHMuc2xpY2UoaW5kZXgsIGluZGV4ICsgMikgPT09IFwi5LiN5oiQXCIpIHtcbiAgICAgICAgICAgIGluZGV4ICs9IDI7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSkoKTtcbiAgICBjb25zdCBzdG9uZV90byA9ICgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGMgPSBzW2luZGV4XTtcbiAgICAgICAgaWYgKCFjKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIGlmICgoXCIxXCIgPD0gYyAmJiBjIDw9IFwiOVwiKSB8fCAoXCLvvJFcIiA8PSBjICYmIGMgPD0gXCLvvJlcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gcGFyc2VfY29vcmQocy5zbGljZShpbmRleCwgaW5kZXggKyAyKSk7XG4gICAgICAgICAgICBpbmRleCArPSAyO1xuICAgICAgICAgICAgaWYgKCFzW2luZGV4XSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb29yZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5omL44CMJHtzfeOAjeOBruacq+WwvuOBq+ino+mHiOS4jeiDveOBquOAjCR7cy5zbGljZShpbmRleCl944CN44GM44GC44KK44G+44GZYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOaJi+OAjCR7c33jgI3jga7mnKvlsL7jgavop6Pph4jkuI3og73jgarjgIwke3Muc2xpY2UoaW5kZXgpfeOAjeOBjOOBguOCiuOBvuOBmWApO1xuICAgICAgICB9XG4gICAgfSkoKTtcbiAgICBjb25zdCBwaWVjZV9waGFzZSA9IHByb21vdGVzICE9PSBudWxsID8gKGZyb20gPyB7IHNpZGUsIHRvLCBwcm9mLCBwcm9tb3RlcywgZnJvbSB9IDogeyBzaWRlLCB0bywgcHJvZiwgcHJvbW90ZXMgfSlcbiAgICAgICAgOiAoZnJvbSA/IHsgc2lkZSwgdG8sIHByb2YsIGZyb20gfSA6IHsgc2lkZSwgdG8sIHByb2YgfSk7XG4gICAgcmV0dXJuIHN0b25lX3RvID8geyBwaWVjZV9waGFzZSwgc3RvbmVfdG8gfSA6IHsgcGllY2VfcGhhc2UgfTtcbn1cbmV4cG9ydHMucGFyc2Vfb25lID0gcGFyc2Vfb25lO1xuZnVuY3Rpb24gcGFyc2Uocykge1xuICAgIHMgPSBzLnJlcGxhY2UoLyhb6buS4pay4piX55m94paz4piWXSkvZywgXCIgJDFcIik7XG4gICAgY29uc3QgbW92ZXMgPSBzLnNwbGl0KC9cXHMvKTtcbiAgICByZXR1cm4gbW92ZXMubWFwKHMgPT4gcy50cmltKCkpLmZpbHRlcihzID0+IHMgIT09IFwiXCIpLm1hcChwYXJzZV9vbmUpO1xufVxuZXhwb3J0cy5wYXJzZSA9IHBhcnNlO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3Qgc2hvZ29zc19jb3JlXzEgPSByZXF1aXJlKFwic2hvZ29zcy1jb3JlXCIpO1xuY29uc3Qgc2hvZ29zc19wYXJzZXJfMSA9IHJlcXVpcmUoXCJzaG9nb3NzLXBhcnNlclwiKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XG4gICAgcmVuZGVyKCgwLCBzaG9nb3NzX2NvcmVfMS5nZXRfaW5pdGlhbF9zdGF0ZSkoXCLpu5JcIikuYm9hcmQpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZF9oaXN0b3J5XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsb2FkX2hpc3RvcnkpO1xufSk7XG5mdW5jdGlvbiBsb2FkX2hpc3RvcnkoKSB7XG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGlzdG9yeVwiKS52YWx1ZTtcbiAgICBjb25zdCBtb3ZlcyA9ICgwLCBzaG9nb3NzX3BhcnNlcl8xLnBhcnNlKSh0ZXh0KTtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBzdGF0ZSA9ICgwLCBzaG9nb3NzX2NvcmVfMS5tYWluKShtb3Zlcyk7XG4gICAgICAgIGlmIChzdGF0ZS5waGFzZSA9PT0gXCJnYW1lX2VuZFwiKSB7XG4gICAgICAgICAgICBhbGVydChg5Yud6ICFOiAke3N0YXRlLnZpY3Rvcn3jgIHnkIbnlLE6ICR7c3RhdGUucmVhc29ufWApO1xuICAgICAgICAgICAgcmVuZGVyKHN0YXRlLmZpbmFsX3NpdHVhdGlvbi5ib2FyZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZW5kZXIoc3RhdGUuYm9hcmQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGFsZXJ0KGUpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdldENvbnRlbnRIVE1MRnJvbUVudGl0eShlbnRpdHkpIHtcbiAgICBpZiAoZW50aXR5LnR5cGUgPT09IFwi56KBXCIpXG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIGlmIChlbnRpdHkudHlwZSA9PT0gXCLjgrlcIiAmJiBlbnRpdHkucHJvZiAhPT0gXCLjgahcIikge1xuICAgICAgICByZXR1cm4gYDxzcGFuIHN0eWxlPVwiZm9udC1zaXplOiAyMDAlXCI+JHt7IOOCrTogXCLimZRcIiwg44KvOiBcIuKZlVwiLCDjg6s6IFwi4pmWXCIsIOODkzogXCLimZdcIiwg44OKOiBcIuKZmFwiLCDjg506IFwi4pmZXCIgfVtlbnRpdHkucHJvZl19PC9zcGFuPmA7XG4gICAgfVxuICAgIHJldHVybiBlbnRpdHkucHJvZjtcbn1cbmZ1bmN0aW9uIHJlbmRlcihib2FyZCkge1xuICAgIGxldCBhbnMgPSBcIlwiO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgOTsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSBib2FyZFtpXVtqXTtcbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHN0ciA9IGdldENvbnRlbnRIVE1MRnJvbUVudGl0eShlbnRpdHkpO1xuICAgICAgICAgICAgYW5zICs9IGA8ZGl2IGNsYXNzPVwiJHtlbnRpdHkuc2lkZSA9PT0gXCLnmb1cIiA/IFwid2hpdGVcIiA6IFwiYmxhY2tcIn1cIiBzdHlsZT1cInRvcDokezUwICsgaSAqIDUwfXB4OyBsZWZ0OiR7MTAwICsgaiAqIDUwfXB4O1wiPiR7c3RyfTwvZGl2PmA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib2FyZFwiKS5pbm5lckhUTUwgPSBhbnM7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=