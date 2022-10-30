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
exports.parse = exports.munch_one = exports.parse_one = exports.parse_profession = exports.parse_coord = void 0;
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
    const { move, rest } = munch_one(s);
    if (rest !== "") {
        throw new Error(`手「${s}」の末尾に解釈不能な「${rest}」があります`);
    }
    else {
        return move;
    }
}
exports.parse_one = parse_one;
function munch_one(s) {
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
    const [stone_to, rest] = (() => {
        const c = s[index];
        if (!c)
            return [null, ""];
        if (("1" <= c && c <= "9") || ("１" <= c && c <= "９")) {
            const coord = parse_coord(s.slice(index, index + 2));
            index += 2;
            if (!s[index]) {
                return [coord, ""];
            }
            else {
                return [coord, s.slice(index)];
            }
        }
        else {
            return [null, s.slice(index)];
        }
    })();
    const piece_phase = promotes !== null ? (from ? { side, to, prof, promotes, from } : { side, to, prof, promotes })
        : (from ? { side, to, prof, from } : { side, to, prof });
    const move = stone_to ? { piece_phase, stone_to } : { piece_phase };
    return { move, rest };
}
exports.munch_one = munch_one;
function parse(s) {
    s = s.replace(/([黒▲☗白△☖])/g, " $1");
    const moves = s.split(/\s/);
    return moves.map(s => s.trim()).filter(s => s !== "").map(parse_one);
}
exports.parse = parse;


/***/ }),

/***/ "./src/gametree.ts":
/*!*************************!*\
  !*** ./src/gametree.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.backward_history = exports.forward_history = exports.parse_cursored = void 0;
const shogoss_parser_1 = __webpack_require__(/*! shogoss-parser */ "./node_modules/shogoss-parser/dist/index.js");
function parse_cursored(s) {
    const ans = { main: [], unevaluated: [] };
    while (true) {
        s = s.trimStart();
        if (s.startsWith("{|")) {
            s = s.slice(BOOKMARK_LENGTH);
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
const BOOKMARK_LENGTH = "{|".length;
function forward_history(original_s) {
    let s = original_s;
    // n 手分をパース
    while (true) {
        s = s.trimStart();
        // {| に遭遇したら、
        const till_nth = original_s.slice(0, original_s.length - s.length);
        if (s.startsWith("{|")) {
            // {| を読み飛ばし、
            s = s.slice(BOOKMARK_LENGTH);
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
function backward_history(original_s) {
    let s = original_s;
    const indices = [];
    // n 手分をパース
    while (true) {
        s = s.trimStart();
        indices.push(original_s.length - s.length);
        // {| に遭遇したら、
        if (s.startsWith("{|")) {
            const nminus1_end = indices[indices.length - 2];
            const n_end = indices[indices.length - 1];
            if (nminus1_end === undefined || n_end === undefined) {
                return null; // それ以上 backward できないので null を返す
            }
            return original_s.slice(0, nminus1_end) + "{|" + original_s.slice(nminus1_end, n_end) + original_s.slice(n_end + BOOKMARK_LENGTH);
        }
        else if (s.trimStart() === "") {
            // 栞がないので生やす
            const nminus1_end = indices[indices.length - 2];
            const n_end = indices[indices.length - 1];
            if (nminus1_end === undefined || n_end === undefined) {
                return null; // それ以上 backward できないので null を返す
            }
            return original_s.slice(0, nminus1_end) + "{|" + original_s.slice(nminus1_end, n_end) + original_s.slice(n_end) + "}";
        }
        const { move: _, rest } = (0, shogoss_parser_1.munch_one)(s);
        s = rest;
    }
}
exports.backward_history = backward_history;


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
const gametree_1 = __webpack_require__(/*! ./gametree */ "./src/gametree.ts");
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
    const text = document.getElementById("history").value;
    const new_history = (0, gametree_1.backward_history)(text);
    if (new_history) {
        document.getElementById("history").value = new_history;
        load_history();
    }
}
function load_history() {
    const text = document.getElementById("history").value;
    document.getElementById("forward").disabled = (0, gametree_1.forward_history)(text) === null;
    document.getElementById("backward").disabled = (0, gametree_1.backward_history)(text) === null;
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
        if (e instanceof Error && e.message === "棋譜が空です") {
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
            if (entity == null) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBLHlCQUF5QixhQUFhLE9BQU8sYUFBYTtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Qsd0NBQXdDLGNBQWM7QUFDeEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixPQUFPO0FBQzNCLHdCQUF3QixPQUFPO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0Msd0NBQXdDLGVBQWUsWUFBWSxJQUFJLE9BQU8sYUFBYSxHQUFHLElBQUksSUFBSTtBQUN4STtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsZ0JBQWdCLElBQUksV0FBVyxJQUFJLEtBQUs7QUFDeEYsS0FBSztBQUNMO0FBQ0EsZ0RBQWdELGlCQUFpQixJQUFJLFlBQVksSUFBSSxLQUFLO0FBQzFGLEtBQUs7QUFDTDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Nob2dvc3MtY29yZS9kaXN0L2FmdGVyX3N0b25lX3BoYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC9ib2FyZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvY2FuX3NlZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvY29vcmRpbmF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Nob2dvc3MtY29yZS9kaXN0L3BpZWNlX3BoYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC9zaWRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC9zdXJyb3VuZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvdHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1wYXJzZXIvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZXRyZWUudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnJlc29sdmVfYWZ0ZXJfc3RvbmVfcGhhc2UgPSB2b2lkIDA7XHJcbmNvbnN0IGJvYXJkXzEgPSByZXF1aXJlKFwiLi9ib2FyZFwiKTtcclxuY29uc3Qgc2lkZV8xID0gcmVxdWlyZShcIi4vc2lkZVwiKTtcclxuY29uc3Qgc3Vycm91bmRfMSA9IHJlcXVpcmUoXCIuL3N1cnJvdW5kXCIpO1xyXG5jb25zdCB0eXBlXzEgPSByZXF1aXJlKFwiLi90eXBlXCIpO1xyXG4vKiog55+z44OV44Kn44Kk44K644GM57WC5LqG44GX44Gf5b6M44CB5Yud5pWX5Yik5a6a44Go5Zuy56KB5qSc5p+744KS44GZ44KL44CCIC8gVG8gYmUgY2FsbGVkIGFmdGVyIGEgc3RvbmUgaXMgcGxhY2VkOiBjaGVja3MgdGhlIHZpY3RvcnkgY29uZGl0aW9uIGFuZCB0aGUgZ2FtZS1vZi1nbyBjb25kaXRpb24uXHJcbiAqIOOBvuOBn+OAgeebuOaJi+OBruODneWFteOBq+OCouODs+ODkeODg+OCteODs+ODleODqeOCsOOBjOOBpOOBhOOBpuOBhOOBn+OCieOAgeOBneOCjOOCkuWPluOCiumZpOOBj++8iOiHquWIhuOBjOaJi+OCkuaMh+OBl+OBn+OBk+OBqOOBq+OCiOOBo+OBpuOAgeOCouODs+ODkeODg+OCteODs+OBruaoqeWIqeOBjOWkseOCj+OCjOOBn+OBruOBp++8iVxyXG4gKiBBbHNvLCBpZiB0aGUgb3Bwb25lbnQncyBwYXduIGhhcyBhbiBlbiBwYXNzYW50IGZsYWcsIGRlbGV0ZSBpdCAoc2luY2UsIGJ5IHBsYXlpbmcgYSBwaWVjZSB1bnJlbGF0ZWQgdG8gZW4gcGFzc2FudCwgeW91IGhhdmUgbG9zdCB0aGUgcmlnaHQgdG8gY2FwdHVyZSBieSBlbiBwYXNzYW50KVxyXG4gKlxyXG4gKiAxLiDoh6rliIbjga7pp5Ljgajnn7PjgavjgojjgaPjgablm7Ljgb7jgozjgabjgYTjgovnm7jmiYvjga7pp5Ljgajnn7PjgpLjgZnjgbnjgablj5bjgorpmaTjgY9cclxuICogMi4g55u45omL44Gu6aeS44Go55+z44Gr44KI44Gj44Gm5Zuy44G+44KM44Gm44GE44KL6Ieq5YiG44Gu6aeS44Go55+z44KS44GZ44G544Gm5Y+W44KK6Zmk44GPXHJcbiAqIDMuIOS6jOODneOBjOeZuueUn+OBl+OBpuOBhOOCi+OBi+ODu+OCreODs+OCsOeOi+OBjOebpOmdouOBi+OCiemZpOOBi+OCjOOBpuOBhOOCi+OBi+OCkuWIpOWumuOAglxyXG4gKiAgIDMtMS4g5Lih44Kt44Oz44Kw546L44GM6Zmk44GL44KM44Gm44GE44Gf44KJ44CB44Kr44Op44OG44K444Oj44Oz44Kx44Oz44Oc44Kv44K344Oz44KwXHJcbiAqICAgMy0yLiDoh6rliIbjga7njovjgaDjgZHpmaTjgYvjgozjgabjgYTjgZ/jgonjgIHjgZ3jgozjga/jgIznjovjga7oh6rmrrrjgavjgojjgovmlZfljJfjgI1cclxuICogICAzLTMuIOebuOaJi+OBrueOi+OBoOOBkemZpOOBi+OCjOOBpuOBhOOCi+WgtOWQiOOAgVxyXG4gKiAgICAgICAzLTMtMS4g5LqM44Od44GM55m655Sf44GX44Gm44GE44Gq44GR44KM44Gw44CB44Gd44KM44Gv44CM546L44Gu5o6S6Zmk44Gr44KI44KL5Yud5Yip44CNXHJcbiAqICAgICAgICAgICAgIDMtMy0xLTEuIOebuOaJi+OBrueOi+OCkuWPluOCiumZpOOBhOOBn+OBruOBjOOCueODhuODg+ODlyAxLiDjgafjgYLjgorjgIFcclxuICogICAgICAgICAgICAgICAgICAgICAg44GX44GL44KC44CM44GU44Gj44Gd44KK44CN77yIQHJlX2hha29fbW9vbuabsOOBj+OAgTLlgIvjgYsz5YCL77yJXHJcbiAqICAgICAgICAgICAgICAgICAgICAgIOOBq+ipsuW9k+OBmeOCi+OBqOOBjeOBq+OBr+OAjOOCt+ODp+OCtOOCue+8geOAjeOBrueZuuWjsFxyXG4gKiAgICAgICAzLTMtMi4g5LqM44Od44GM55m655Sf44GX44Gm44GE44KL44Gq44KJ44CB44Kr44Op44OG44K444Oj44Oz44Kx44Oz44Oc44Kv44K344Oz44KwXHJcbiAqICAgMy00LiDjganjgaHjgonjga7njovjgoLpmaTjgYvjgozjgabjgYTjgarjgYTloLTlkIjjgIFcclxuICogICAgICAgMy00LTEuIOS6jOODneOBjOeZuueUn+OBl+OBpuOBhOOBquOBkeOCjOOBsOOAgeOCsuODvOODoOe2muihjFxyXG4gKiAgICAgICAzLTQtMi4g5LqM44Od44GM55m655Sf44GX44Gm44GE44KL44Gq44KJ44CB44Gd44KM44Gv44CM5LqM44Od44Gr44KI44KL5pWX5YyX44CNXHJcbiAqXHJcbiAqIDEg4oaSIDIg44Gu6aCG55Wq44Gn44GC44KL5qC55oug77ya44Kz44Oz44OT44ON44O844K344On44Oz44Ki44K/44OD44Kv44Gu5a2Y5ZyoXHJcbiAqIDIg4oaSIDMg44Gu6aCG55Wq44Gn44GC44KL5qC55oug77ya5YWs5byP44Or44O844Or6L+96KiYXHJcbiAqIOOAjOefs+ODleOCp+OCpOOCuuOCkuedgOaJi+OBl+OBn+e1kOaenOOBqOOBl+OBpuiHquWIhuOBruODneODvOODs+WFteOBjOebpOS4iuOBi+OCiea2iOOBiOS6jOODneOBjOino+axuuOBleOCjOOCi+WgtOWQiOOCguOAgeWPjeWJh+OCkuOBqOOCieOBmumAsuihjOOBp+OBjeOCi+OAguOAjVxyXG4gKlxyXG4gKiAxLiBSZW1vdmUgYWxsIHRoZSBvcHBvbmVudCdzIHBpZWNlcyBhbmQgc3RvbmVzIHN1cnJvdW5kZWQgYnkgeW91ciBwaWVjZXMgYW5kIHN0b25lc1xyXG4gKiAyLiBSZW1vdmUgYWxsIHlvdXIgcGllY2VzIGFuZCBzdG9uZXMgc3Vycm91bmRlZCBieSB0aGUgb3Bwb25lbnQncyBwaWVjZXMgYW5kIHN0b25lc1xyXG4gKiAzLiBDaGVja3Mgd2hldGhlciB0d28gcGF3bnMgb2NjdXB5IHRoZSBzYW1lIGNvbHVtbiwgYW5kIGNoZWNrcyB3aGV0aGVyIGEga2luZyBpcyByZW1vdmVkIGZyb20gdGhlIGJvYXJkLlxyXG4gKiAgIDMtMS4gSWYgYm90aCBraW5ncyBhcmUgcmVtb3ZlZCwgdGhhdCBpcyBhIGRyYXcsIGFuZCB0aGVyZWZvcmUgYSBLYXJhdGUgUm9jay1QYXBlci1TY2lzc29ycyBCb3hpbmcuXHJcbiAqICAgMy0yLiBJZiB5b3VyIGtpbmcgaXMgcmVtb3ZlZCBidXQgdGhlIG9wcG9uZW50J3MgcmVtYWlucywgdGhlbiBpdCdzIGEgbG9zcyBieSBraW5nJ3Mgc3VpY2lkZS5cclxuICogICAzLTMuIElmIHRoZSBvcHBvbmVudCdzIGtpbmcgaXMgcmVtb3ZlZCBidXQgeW91cnMgcmVtYWlucyxcclxuICogICAgICAgIDMtMy0xLiBJZiBubyB0d28gcGF3bnMgb2NjdXB5IHRoZSBzYW1lIGNvbHVtbiwgdGhlbiBpdCdzIGEgdmljdG9yeVxyXG4gKiAgICAgICAgICAgICAzLTMtMS0xLiBJZiB0aGUgc3RlcCB0aGF0IHJlbW92ZWQgdGhlIG9wcG9uZW50J3Mga2luZyB3YXMgc3RlcCAxLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICBhbmQgd2hlbiBhIGxhcmdlIG51bWJlciAoPj0gMiBvciAzLCBhY2NvcmRpbmcgdG8gQHJlX2hha29fbW9vbilcclxuICogICAgICAgICAgICAgICAgICAgICAgb2YgcGllY2VzL3N0b25lcyBhcmUgcmVtb3ZlZCwgdGhlbiBcIlNob0dvU3MhXCIgc2hvdWxkIGJlIHNob3V0ZWRcclxuICpcclxuICogVGhlIG9yZGVyaW5nIDEg4oaSIDIgaXMgbmVlZGVkIHRvIHN1cHBvcnQgdGhlIGNvbWJpbmF0aW9uIGF0dGFjay5cclxuICogVGhlIG9yZGVyaW5nIDIg4oaSIDMgaXMgZXhwbGljaXRseSBtZW50aW9uZWQgYnkgdGhlIGFkZGVuZHVtIHRvIHRoZSBvZmZpY2lhbCBydWxlOlxyXG4gKiAgICAgICAgIOOAjOefs+ODleOCp+OCpOOCuuOCkuedgOaJi+OBl+OBn+e1kOaenOOBqOOBl+OBpuiHquWIhuOBruODneODvOODs+WFteOBjOebpOS4iuOBi+OCiea2iOOBiOS6jOODneOBjOino+axuuOBleOCjOOCi+WgtOWQiOOCguOAgeWPjeWJh+OCkuOBqOOCieOBmumAsuihjOOBp+OBjeOCi+OAguOAjVxyXG4gKiovXHJcbmZ1bmN0aW9uIHJlc29sdmVfYWZ0ZXJfc3RvbmVfcGhhc2UocGxheWVkKSB7XHJcbiAgICByZW1vdmVfc3Vycm91bmRlZF9lbml0aXRpZXNfZnJvbV9ib2FyZF9hbmRfYWRkX3RvX2hhbmRfaWZfbmVjZXNzYXJ5KHBsYXllZCwgKDAsIHNpZGVfMS5vcHBvbmVudE9mKShwbGF5ZWQuYnlfd2hvbSkpO1xyXG4gICAgcmVtb3ZlX3N1cnJvdW5kZWRfZW5pdGl0aWVzX2Zyb21fYm9hcmRfYW5kX2FkZF90b19oYW5kX2lmX25lY2Vzc2FyeShwbGF5ZWQsIHBsYXllZC5ieV93aG9tKTtcclxuICAgIHJlbm91bmNlX2VuX3Bhc3NhbnQocGxheWVkLmJvYXJkLCBwbGF5ZWQuYnlfd2hvbSk7XHJcbiAgICBjb25zdCBkb3VibGVkX3Bhd25zX2V4aXN0ID0gZG9lc19kb3VibGVkX3Bhd25zX2V4aXN0KHBsYXllZC5ib2FyZCwgcGxheWVkLmJ5X3dob20pO1xyXG4gICAgY29uc3QgaXNfeW91cl9raW5nX2FsaXZlID0ga2luZ19pc19hbGl2ZShwbGF5ZWQuYm9hcmQsIHBsYXllZC5ieV93aG9tKTtcclxuICAgIGNvbnN0IGlzX29wcG9uZW50c19raW5nX2FsaXZlID0ga2luZ19pc19hbGl2ZShwbGF5ZWQuYm9hcmQsICgwLCBzaWRlXzEub3Bwb25lbnRPZikocGxheWVkLmJ5X3dob20pKTtcclxuICAgIGNvbnN0IHNpdHVhdGlvbiA9IHtcclxuICAgICAgICBib2FyZDogcGxheWVkLmJvYXJkLFxyXG4gICAgICAgIGhhbmRfb2ZfYmxhY2s6IHBsYXllZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgIGhhbmRfb2Zfd2hpdGU6IHBsYXllZC5oYW5kX29mX3doaXRlLFxyXG4gICAgfTtcclxuICAgIGlmICghaXNfeW91cl9raW5nX2FsaXZlKSB7XHJcbiAgICAgICAgaWYgKCFpc19vcHBvbmVudHNfa2luZ19hbGl2ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBwaGFzZTogXCJnYW1lX2VuZFwiLCByZWFzb246IFwiYm90aF9raW5nX2RlYWRcIiwgdmljdG9yOiBcIkthcmF0ZUphbmtlbkJveGluZ1wiLCBmaW5hbF9zaXR1YXRpb246IHNpdHVhdGlvbiB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgcGhhc2U6IFwiZ2FtZV9lbmRcIiwgcmVhc29uOiBcImtpbmdfc3VpY2lkZVwiLCB2aWN0b3I6ICgwLCBzaWRlXzEub3Bwb25lbnRPZikocGxheWVkLmJ5X3dob20pLCBmaW5hbF9zaXR1YXRpb246IHNpdHVhdGlvbiB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghaXNfb3Bwb25lbnRzX2tpbmdfYWxpdmUpIHtcclxuICAgICAgICAgICAgaWYgKCFkb3VibGVkX3Bhd25zX2V4aXN0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBwaGFzZTogXCJnYW1lX2VuZFwiLCByZWFzb246IFwia2luZ19jYXB0dXJlXCIsIHZpY3RvcjogcGxheWVkLmJ5X3dob20sIGZpbmFsX3NpdHVhdGlvbjogc2l0dWF0aW9uIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBwaGFzZTogXCJnYW1lX2VuZFwiLCByZWFzb246IFwia2luZ19jYXB0dXJlX2FuZF9kb3VibGVkX3Bhd25zXCIsIHZpY3RvcjogXCJLYXJhdGVKYW5rZW5Cb3hpbmdcIiwgZmluYWxfc2l0dWF0aW9uOiBzaXR1YXRpb24gfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFkb3VibGVkX3Bhd25zX2V4aXN0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBoYXNlOiBcInJlc29sdmVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYm9hcmQ6IHBsYXllZC5ib2FyZCxcclxuICAgICAgICAgICAgICAgICAgICBoYW5kX29mX2JsYWNrOiBwbGF5ZWQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICAgICAgICAgICAgICBoYW5kX29mX3doaXRlOiBwbGF5ZWQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICAgICAgICAgICAgICB3aG9fZ29lc19uZXh0OiAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKHBsYXllZC5ieV93aG9tKVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IHBoYXNlOiBcImdhbWVfZW5kXCIsIHJlYXNvbjogXCJkb3VibGVkX3Bhd25zXCIsIHZpY3RvcjogKDAsIHNpZGVfMS5vcHBvbmVudE9mKShwbGF5ZWQuYnlfd2hvbSksIGZpbmFsX3NpdHVhdGlvbjogc2l0dWF0aW9uIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5yZXNvbHZlX2FmdGVyX3N0b25lX3BoYXNlID0gcmVzb2x2ZV9hZnRlcl9zdG9uZV9waGFzZTtcclxuZnVuY3Rpb24gcmVub3VuY2VfZW5fcGFzc2FudChib2FyZCwgYnlfd2hvbSkge1xyXG4gICAgY29uc3Qgb3Bwb25lbnRfcGF3bl9jb29yZHMgPSAoMCwgYm9hcmRfMS5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZikoYm9hcmQsICgwLCBzaWRlXzEub3Bwb25lbnRPZikoYnlfd2hvbSksIFwi44OdXCIpO1xyXG4gICAgZm9yIChjb25zdCBjb29yZCBvZiBvcHBvbmVudF9wYXduX2Nvb3Jkcykge1xyXG4gICAgICAgICgwLCBib2FyZF8xLmRlbGV0ZV9lbl9wYXNzYW50X2ZsYWcpKGJvYXJkLCBjb29yZCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaGFzX2R1cGxpY2F0ZXMoYXJyYXkpIHtcclxuICAgIHJldHVybiBuZXcgU2V0KGFycmF5KS5zaXplICE9PSBhcnJheS5sZW5ndGg7XHJcbn1cclxuZnVuY3Rpb24gZG9lc19kb3VibGVkX3Bhd25zX2V4aXN0KGJvYXJkLCBzaWRlKSB7XHJcbiAgICBjb25zdCBjb29yZHMgPSAoMCwgYm9hcmRfMS5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZikoYm9hcmQsIHNpZGUsIFwi44OdXCIpO1xyXG4gICAgY29uc3QgY29sdW1ucyA9IGNvb3Jkcy5tYXAoKFtjb2wsIF9yb3ddKSA9PiBjb2wpO1xyXG4gICAgcmV0dXJuIGhhc19kdXBsaWNhdGVzKGNvbHVtbnMpO1xyXG59XHJcbmZ1bmN0aW9uIGtpbmdfaXNfYWxpdmUoYm9hcmQsIHNpZGUpIHtcclxuICAgIHJldHVybiAoMCwgYm9hcmRfMS5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZikoYm9hcmQsIHNpZGUsIFwi44KtXCIpLmxlbmd0aCArICgwLCBib2FyZF8xLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mKShib2FyZCwgc2lkZSwgXCLotoVcIikubGVuZ3RoID4gMDtcclxufVxyXG5mdW5jdGlvbiByZW1vdmVfc3Vycm91bmRlZF9lbml0aXRpZXNfZnJvbV9ib2FyZF9hbmRfYWRkX3RvX2hhbmRfaWZfbmVjZXNzYXJ5KG9sZCwgc2lkZSkge1xyXG4gICAgY29uc3QgYmxhY2tfYW5kX3doaXRlID0gb2xkLmJvYXJkLm1hcChyb3cgPT4gcm93Lm1hcChzcSA9PiBzcSA9PT0gbnVsbCA/IG51bGwgOiBzcS5zaWRlKSk7XHJcbiAgICBjb25zdCBoYXNfc3Vydml2ZWQgPSAoMCwgc3Vycm91bmRfMS5yZW1vdmVfc3Vycm91bmRlZCkoc2lkZSwgYmxhY2tfYW5kX3doaXRlKTtcclxuICAgIG9sZC5ib2FyZC5mb3JFYWNoKChyb3csIGkpID0+IHJvdy5mb3JFYWNoKChzcSwgaikgPT4ge1xyXG4gICAgICAgIGlmICghaGFzX3N1cnZpdmVkW2ldPy5bal0pIHtcclxuICAgICAgICAgICAgY29uc3QgY2FwdHVyZWRfZW50aXR5ID0gc3E7XHJcbiAgICAgICAgICAgIHJvd1tqXSA9IG51bGw7XHJcbiAgICAgICAgICAgIHNlbmRfY2FwdHVyZWRfZW50aXR5X3RvX29wcG9uZW50KG9sZCwgY2FwdHVyZWRfZW50aXR5KTtcclxuICAgICAgICB9XHJcbiAgICB9KSk7XHJcbn1cclxuZnVuY3Rpb24gc2VuZF9jYXB0dXJlZF9lbnRpdHlfdG9fb3Bwb25lbnQob2xkLCBjYXB0dXJlZF9lbnRpdHkpIHtcclxuICAgIGlmICghY2FwdHVyZWRfZW50aXR5KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIGNvbnN0IG9wcG9uZW50ID0gKDAsIHNpZGVfMS5vcHBvbmVudE9mKShjYXB0dXJlZF9lbnRpdHkuc2lkZSk7XHJcbiAgICBpZiAoY2FwdHVyZWRfZW50aXR5LnR5cGUgPT09IFwi44GX44KHXCIpIHtcclxuICAgICAgICAob3Bwb25lbnQgPT09IFwi55m9XCIgPyBvbGQuaGFuZF9vZl93aGl0ZSA6IG9sZC5oYW5kX29mX2JsYWNrKS5wdXNoKCgwLCB0eXBlXzEudW5wcm9tb3RlKShjYXB0dXJlZF9lbnRpdHkucHJvZikpO1xyXG4gICAgfVxyXG59XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGUgPSBleHBvcnRzLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mID0gZXhwb3J0cy5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncyA9IGV4cG9ydHMuZGVsZXRlX2VuX3Bhc3NhbnRfZmxhZyA9IGV4cG9ydHMuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkID0gdm9pZCAwO1xyXG5jb25zdCBjb29yZGluYXRlXzEgPSByZXF1aXJlKFwiLi9jb29yZGluYXRlXCIpO1xyXG5mdW5jdGlvbiBnZXRfZW50aXR5X2Zyb21fY29vcmQoYm9hcmQsIGNvb3JkKSB7XHJcbiAgICBjb25zdCBbY29sdW1uLCByb3ddID0gY29vcmQ7XHJcbiAgICBjb25zdCByb3dfaW5kZXggPSBcIuS4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5nVwiLmluZGV4T2Yocm93KTtcclxuICAgIGNvbnN0IGNvbHVtbl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihjb2x1bW4pO1xyXG4gICAgaWYgKHJvd19pbmRleCA9PT0gLTEgfHwgY29sdW1uX2luZGV4ID09PSAtMSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihg5bqn5qiZ44CMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoY29vcmQpfeOAjeOBr+S4jeato+OBp+OBmWApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIChib2FyZFtyb3dfaW5kZXhdPy5bY29sdW1uX2luZGV4XSkgPz8gbnVsbDtcclxufVxyXG5leHBvcnRzLmdldF9lbnRpdHlfZnJvbV9jb29yZCA9IGdldF9lbnRpdHlfZnJvbV9jb29yZDtcclxuZnVuY3Rpb24gZGVsZXRlX2VuX3Bhc3NhbnRfZmxhZyhib2FyZCwgY29vcmQpIHtcclxuICAgIGNvbnN0IFtjb2x1bW4sIHJvd10gPSBjb29yZDtcclxuICAgIGNvbnN0IHJvd19pbmRleCA9IFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZihyb3cpO1xyXG4gICAgY29uc3QgY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGNvbHVtbik7XHJcbiAgICBpZiAocm93X2luZGV4ID09PSAtMSB8fCBjb2x1bW5faW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDluqfmqJnjgIwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShjb29yZCl944CN44Gv5LiN5q2j44Gn44GZYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBwYXduID0gYm9hcmRbcm93X2luZGV4XVtjb2x1bW5faW5kZXhdO1xyXG4gICAgaWYgKHBhd24/LnR5cGUgIT09IFwi44K5XCIgfHwgcGF3bi5wcm9mICE9PSBcIuODnVwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDjg53jg7zjg7Pjga7jgarjgYTluqfmqJnjgIwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShjb29yZCl944CN44Gr5a++44GX44GmIFxcYGRlbGV0ZV9lbl9wYXNzYW50X2ZsYWcoKVxcYCDjgYzlkbzjgbDjgozjgb7jgZfjgZ9gKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZSBwYXduLnN1YmplY3RfdG9fZW5fcGFzc2FudDtcclxufVxyXG5leHBvcnRzLmRlbGV0ZV9lbl9wYXNzYW50X2ZsYWcgPSBkZWxldGVfZW5fcGFzc2FudF9mbGFnO1xyXG4vKipcclxuICog6aeS44O756KB55+z44O7bnVsbCDjgpLnm6TkuIrjga7nibnlrprjga7kvY3nva7jgavphY3nva7jgZnjgovjgIJjYW5fY2FzdGxlIOODleODqeOCsOOBqCBjYW5fa3VtYWwg44OV44Op44Kw44KS6YGp5a6c6Kq/5pW044GZ44KL44CCXHJcbiAqIEBwYXJhbSBib2FyZFxyXG4gKiBAcGFyYW0gY29vcmRcclxuICogQHBhcmFtIG1heWJlX2VudGl0eVxyXG4gKiBAcmV0dXJuc1xyXG4gKi9cclxuZnVuY3Rpb24gcHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MoYm9hcmQsIGNvb3JkLCBtYXliZV9lbnRpdHkpIHtcclxuICAgIGNvbnN0IFtjb2x1bW4sIHJvd10gPSBjb29yZDtcclxuICAgIGNvbnN0IHJvd19pbmRleCA9IFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZihyb3cpO1xyXG4gICAgY29uc3QgY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGNvbHVtbik7XHJcbiAgICBpZiAocm93X2luZGV4ID09PSAtMSB8fCBjb2x1bW5faW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDluqfmqJnjgIwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShjb29yZCl944CN44Gv5LiN5q2j44Gn44GZYCk7XHJcbiAgICB9XHJcbiAgICBpZiAobWF5YmVfZW50aXR5Py50eXBlID09PSBcIueOi1wiKSB7XHJcbiAgICAgICAgaWYgKG1heWJlX2VudGl0eS5uZXZlcl9tb3ZlZCkge1xyXG4gICAgICAgICAgICBtYXliZV9lbnRpdHkubmV2ZXJfbW92ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgbWF5YmVfZW50aXR5Lmhhc19tb3ZlZF9vbmx5X29uY2UgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChtYXliZV9lbnRpdHkuaGFzX21vdmVkX29ubHlfb25jZSkge1xyXG4gICAgICAgICAgICBtYXliZV9lbnRpdHkubmV2ZXJfbW92ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgbWF5YmVfZW50aXR5Lmhhc19tb3ZlZF9vbmx5X29uY2UgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChtYXliZV9lbnRpdHk/LnR5cGUgPT09IFwi44GX44KHXCIgJiYgbWF5YmVfZW50aXR5LnByb2YgPT09IFwi6aaZXCIpIHtcclxuICAgICAgICBtYXliZV9lbnRpdHkuY2FuX2t1bWFsID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChtYXliZV9lbnRpdHk/LnR5cGUgPT09IFwi44K5XCIpIHtcclxuICAgICAgICBtYXliZV9lbnRpdHkubmV2ZXJfbW92ZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiBib2FyZFtyb3dfaW5kZXhdW2NvbHVtbl9pbmRleF0gPSBtYXliZV9lbnRpdHk7XHJcbn1cclxuZXhwb3J0cy5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncyA9IHB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzO1xyXG5mdW5jdGlvbiBsb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZihib2FyZCwgc2lkZSwgcHJvZikge1xyXG4gICAgY29uc3QgYW5zID0gW107XHJcbiAgICBjb25zdCByb3dzID0gW1wi5LiAXCIsIFwi5LqMXCIsIFwi5LiJXCIsIFwi5ZubXCIsIFwi5LqUXCIsIFwi5YWtXCIsIFwi5LiDXCIsIFwi5YWrXCIsIFwi5LmdXCJdO1xyXG4gICAgY29uc3QgY29scyA9IFtcIu+8kVwiLCBcIu+8klwiLCBcIu+8k1wiLCBcIu+8lFwiLCBcIu+8lVwiLCBcIu+8llwiLCBcIu+8l1wiLCBcIu+8mFwiLCBcIu+8mVwiXTtcclxuICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbCBvZiBjb2xzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gW2NvbCwgcm93XTtcclxuICAgICAgICAgICAgY29uc3QgZW50aXR5ID0gZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKGJvYXJkLCBjb29yZCk7XHJcbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IG51bGwgfHwgZW50aXR5LnR5cGUgPT09IFwi56KBXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGVudGl0eS5wcm9mID09PSBwcm9mICYmIGVudGl0eS5zaWRlID09PSBzaWRlKSB7XHJcbiAgICAgICAgICAgICAgICBhbnMucHVzaChjb29yZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuZXhwb3J0cy5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZiA9IGxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mO1xyXG5mdW5jdGlvbiBsb29rdXBfY29vcmRzX2Zyb21fc2lkZShib2FyZCwgc2lkZSkge1xyXG4gICAgY29uc3QgYW5zID0gW107XHJcbiAgICBjb25zdCByb3dzID0gW1wi5LiAXCIsIFwi5LqMXCIsIFwi5LiJXCIsIFwi5ZubXCIsIFwi5LqUXCIsIFwi5YWtXCIsIFwi5LiDXCIsIFwi5YWrXCIsIFwi5LmdXCJdO1xyXG4gICAgY29uc3QgY29scyA9IFtcIu+8kVwiLCBcIu+8klwiLCBcIu+8k1wiLCBcIu+8lFwiLCBcIu+8lVwiLCBcIu+8llwiLCBcIu+8l1wiLCBcIu+8mFwiLCBcIu+8mVwiXTtcclxuICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbCBvZiBjb2xzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gW2NvbCwgcm93XTtcclxuICAgICAgICAgICAgY29uc3QgZW50aXR5ID0gZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKGJvYXJkLCBjb29yZCk7XHJcbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IG51bGwgfHwgZW50aXR5LnR5cGUgPT09IFwi56KBXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGVudGl0eS5zaWRlID09PSBzaWRlKSB7XHJcbiAgICAgICAgICAgICAgICBhbnMucHVzaChjb29yZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuZXhwb3J0cy5sb29rdXBfY29vcmRzX2Zyb21fc2lkZSA9IGxvb2t1cF9jb29yZHNfZnJvbV9zaWRlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRvX2FueV9vZl9teV9waWVjZXNfc2VlID0gZXhwb3J0cy5jYW5fc2VlID0gdm9pZCAwO1xyXG5jb25zdCBib2FyZF8xID0gcmVxdWlyZShcIi4vYm9hcmRcIik7XHJcbmNvbnN0IHNpZGVfMSA9IHJlcXVpcmUoXCIuL3NpZGVcIik7XHJcbmZ1bmN0aW9uIGRlbHRhRXEoZCwgZGVsdGEpIHtcclxuICAgIHJldHVybiBkLnYgPT09IGRlbHRhLnYgJiYgZC5oID09PSBkZWx0YS5oO1xyXG59XHJcbi8qKlxyXG4gKiBgby5mcm9tYCDjgavpp5LjgYzjgYLjgaPjgabjgZ3jga7pp5LjgYwgYG8udG9gIOOBuOOBqOWIqeOBhOOBpuOBhOOCi+OBi+OBqeOBhuOBi+OCkui/lOOBmeOAguODneODvOODs+OBruaWnOOCgeWIqeOBjeOBr+W4uOOBqyBjYW5fc2VlIOOBqOimi+OBquOBmeOAguODneODvOODs+OBrjLjg57jgrnnp7vli5Xjga/jgIHpp5LjgpLlj5bjgovjgZPjgajjgYzjgafjgY3jgarjgYTjga7jgafjgIzliKnjgY3jgI3jgafjga/jgarjgYTjgIJcclxuICogIENoZWNrcyB3aGV0aGVyIHRoZXJlIGlzIGEgcGllY2UgYXQgYG8uZnJvbWAgd2hpY2ggbG9va3MgYXQgYG8udG9gLiBUaGUgZGlhZ29uYWwgbW92ZSBvZiBwYXduIGlzIGFsd2F5cyBjb25zaWRlcmVkLiBBIHBhd24gbmV2ZXIgc2VlcyB0d28gc3F1YXJlcyBpbiB0aGUgZnJvbnQ7IGl0IGNhbiBvbmx5IG1vdmUgdG8gdGhlcmUuXHJcbiAqIEBwYXJhbSBib2FyZFxyXG4gKiBAcGFyYW0gb1xyXG4gKiBAcmV0dXJuc1xyXG4gKi9cclxuZnVuY3Rpb24gY2FuX3NlZShib2FyZCwgbykge1xyXG4gICAgY29uc3QgcCA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIG8uZnJvbSk7XHJcbiAgICBpZiAoIXApIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAocC50eXBlID09PSBcIueigVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGVsdGEgPSAoMCwgc2lkZV8xLmNvb3JkRGlmZlNlZW5Gcm9tKShwLnNpZGUsIG8pO1xyXG4gICAgaWYgKHAucHJvZiA9PT0gXCLmiJDmoYJcIiB8fCBwLnByb2YgPT09IFwi5oiQ6YqAXCIgfHwgcC5wcm9mID09PSBcIuaIkOmmmVwiIHx8IHAucHJvZiA9PT0gXCLph5FcIikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHsgdjogMSwgaDogLTEgfSwgeyB2OiAxLCBoOiAwIH0sIHsgdjogMSwgaDogMSB9LFxyXG4gICAgICAgICAgICB7IHY6IDAsIGg6IC0xIH0sIC8qKioqKioqKioqKiovIHsgdjogMCwgaDogMSB9LFxyXG4gICAgICAgICAgICAvKioqKioqKioqKioqKiovIHsgdjogLTEsIGg6IDAgfSAvKioqKioqKioqKioqKiovXHJcbiAgICAgICAgXS5zb21lKGQgPT4gZGVsdGFFcShkLCBkZWx0YSkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIumKgFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgeyB2OiAxLCBoOiAtMSB9LCB7IHY6IDEsIGg6IDAgfSwgeyB2OiAxLCBoOiAxIH0sXHJcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgICAgICAgICB7IHY6IC0xLCBoOiAtMSB9LCAvKioqKioqKioqKioqLyB7IHY6IDEsIGg6IDEgfSxcclxuICAgICAgICBdLnNvbWUoZCA9PiBkZWx0YUVxKGQsIGRlbHRhKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi5qGCXCIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB7IHY6IDIsIGg6IC0xIH0sIHsgdjogMiwgaDogMSB9XHJcbiAgICAgICAgXS5zb21lKGQgPT4gZGVsdGFFcShkLCBkZWx0YSkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIuODilwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgeyB2OiAyLCBoOiAtMSB9LCB7IHY6IDIsIGg6IDEgfSxcclxuICAgICAgICAgICAgeyB2OiAtMiwgaDogLTEgfSwgeyB2OiAtMiwgaDogMSB9LFxyXG4gICAgICAgICAgICB7IHY6IC0xLCBoOiAyIH0sIHsgdjogMSwgaDogMiB9LFxyXG4gICAgICAgICAgICB7IHY6IC0xLCBoOiAtMiB9LCB7IHY6IDEsIGg6IC0yIH1cclxuICAgICAgICBdLnNvbWUoZCA9PiBkZWx0YUVxKGQsIGRlbHRhKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi44KtXCIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB7IHY6IDEsIGg6IC0xIH0sIHsgdjogMSwgaDogMCB9LCB7IHY6IDEsIGg6IDEgfSxcclxuICAgICAgICAgICAgeyB2OiAwLCBoOiAtMSB9LCAvKioqKioqKioqKioqKi8geyB2OiAwLCBoOiAxIH0sXHJcbiAgICAgICAgICAgIHsgdjogLTEsIGg6IC0xIH0sIHsgdjogLTEsIGg6IDAgfSwgeyB2OiAtMSwgaDogMSB9LFxyXG4gICAgICAgIF0uc29tZShkID0+IGRlbHRhRXEoZCwgZGVsdGEpKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLjgahcIiB8fCBwLnByb2YgPT09IFwi44KvXCIpIHtcclxuICAgICAgICByZXR1cm4gbG9uZ19yYW5nZShbXHJcbiAgICAgICAgICAgIHsgdjogMSwgaDogLTEgfSwgeyB2OiAxLCBoOiAwIH0sIHsgdjogMSwgaDogMSB9LFxyXG4gICAgICAgICAgICB7IHY6IDAsIGg6IC0xIH0sIC8qKioqKioqKioqKioqLyB7IHY6IDAsIGg6IDEgfSxcclxuICAgICAgICAgICAgeyB2OiAtMSwgaDogLTEgfSwgeyB2OiAtMSwgaDogMCB9LCB7IHY6IC0xLCBoOiAxIH0sXHJcbiAgICAgICAgXSwgYm9hcmQsIG8sIHAuc2lkZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi44OTXCIpIHtcclxuICAgICAgICByZXR1cm4gbG9uZ19yYW5nZShbXHJcbiAgICAgICAgICAgIHsgdjogMSwgaDogLTEgfSwgeyB2OiAxLCBoOiAxIH0sIHsgdjogLTEsIGg6IC0xIH0sIHsgdjogLTEsIGg6IDEgfSxcclxuICAgICAgICBdLCBib2FyZCwgbywgcC5zaWRlKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLjg6tcIikge1xyXG4gICAgICAgIHJldHVybiBsb25nX3JhbmdlKFtcclxuICAgICAgICAgICAgeyB2OiAxLCBoOiAwIH0sIHsgdjogMCwgaDogLTEgfSwgeyB2OiAwLCBoOiAxIH0sIHsgdjogLTEsIGg6IDAgfSxcclxuICAgICAgICBdLCBib2FyZCwgbywgcC5zaWRlKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLppplcIikge1xyXG4gICAgICAgIHJldHVybiBsb25nX3JhbmdlKFt7IHY6IDEsIGg6IDAgfV0sIGJvYXJkLCBvLCBwLnNpZGUpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIui2hVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi44OdXCIpIHtcclxuICAgICAgICBpZiAoW3sgdjogMSwgaDogLTEgfSwgeyB2OiAxLCBoOiAwIH0sIHsgdjogMSwgaDogMSB9XS5zb21lKGQgPT4gZGVsdGFFcShkLCBkZWx0YSkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gYSBwYXduIGNhbiBuZXZlciBzZWUgdHdvIHNxdWFyZXMgaW4gZnJvbnQ7IGl0IGNhbiBvbmx5IG1vdmUgdG8gdGhlcmVcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IF8gPSBwLnByb2Y7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCByZWFjaCBoZXJlXCIpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuY2FuX3NlZSA9IGNhbl9zZWU7XHJcbmZ1bmN0aW9uIGxvbmdfcmFuZ2UoZGlyZWN0aW9ucywgYm9hcmQsIG8sIHNpZGUpIHtcclxuICAgIGNvbnN0IGRlbHRhID0gKDAsIHNpZGVfMS5jb29yZERpZmZTZWVuRnJvbSkoc2lkZSwgbyk7XHJcbiAgICBjb25zdCBtYXRjaGluZ19kaXJlY3Rpb25zID0gZGlyZWN0aW9ucy5maWx0ZXIoZGlyZWN0aW9uID0+IGRlbHRhLnYgKiBkaXJlY3Rpb24udiArIGRlbHRhLmggKiBkaXJlY3Rpb24uaCA+IDAgLyogaW5uZXIgcHJvZHVjdCBpcyBwb3NpdGl2ZSAqL1xyXG4gICAgICAgICYmIGRlbHRhLnYgKiBkaXJlY3Rpb24uaCAtIGRpcmVjdGlvbi52ICogZGVsdGEuaCA9PT0gMCAvKiBjcm9zcyBwcm9kdWN0IGlzIHplcm8gKi8pO1xyXG4gICAgaWYgKG1hdGNoaW5nX2RpcmVjdGlvbnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGlyZWN0aW9uID0gbWF0Y2hpbmdfZGlyZWN0aW9uc1swXTtcclxuICAgIGZvciAobGV0IGkgPSB7IHY6IGRpcmVjdGlvbi52LCBoOiBkaXJlY3Rpb24uaCB9OyAhZGVsdGFFcShpLCBkZWx0YSk7IGkudiArPSBkaXJlY3Rpb24udiwgaS5oICs9IGRpcmVjdGlvbi5oKSB7XHJcbiAgICAgICAgY29uc3QgY29vcmQgPSAoMCwgc2lkZV8xLmFwcGx5RGVsdGFTZWVuRnJvbSkoc2lkZSwgby5mcm9tLCBpKTtcclxuICAgICAgICBpZiAoKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgY29vcmQpKSB7XHJcbiAgICAgICAgICAgIC8vIGJsb2NrZWQgYnkgc29tZXRoaW5nOyBjYW5ub3Qgc2VlXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiBkb19hbnlfb2ZfbXlfcGllY2VzX3NlZShib2FyZCwgY29vcmQsIHNpZGUpIHtcclxuICAgIGNvbnN0IG9wcG9uZW50X3BpZWNlX2Nvb3JkcyA9ICgwLCBib2FyZF8xLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlKShib2FyZCwgc2lkZSk7XHJcbiAgICByZXR1cm4gb3Bwb25lbnRfcGllY2VfY29vcmRzLnNvbWUoZnJvbSA9PiBjYW5fc2VlKGJvYXJkLCB7IGZyb20sIHRvOiBjb29yZCB9KSk7XHJcbn1cclxuZXhwb3J0cy5kb19hbnlfb2ZfbXlfcGllY2VzX3NlZSA9IGRvX2FueV9vZl9teV9waWVjZXNfc2VlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLkxlZnRtb3N0V2hlblNlZW5Gcm9tQmxhY2sgPSBleHBvcnRzLlJpZ2h0bW9zdFdoZW5TZWVuRnJvbUJsYWNrID0gZXhwb3J0cy5jb29yZERpZmYgPSBleHBvcnRzLmNvbHVtbnNCZXR3ZWVuID0gZXhwb3J0cy5jb29yZEVxID0gZXhwb3J0cy5kaXNwbGF5Q29vcmQgPSB2b2lkIDA7XHJcbmZ1bmN0aW9uIGRpc3BsYXlDb29yZChjb29yZCkge1xyXG4gICAgcmV0dXJuIGAke2Nvb3JkWzBdfSR7Y29vcmRbMV19YDtcclxufVxyXG5leHBvcnRzLmRpc3BsYXlDb29yZCA9IGRpc3BsYXlDb29yZDtcclxuZnVuY3Rpb24gY29vcmRFcShbY29sMSwgcm93MV0sIFtjb2wyLCByb3cyXSkge1xyXG4gICAgcmV0dXJuIGNvbDEgPT09IGNvbDIgJiYgcm93MSA9PT0gcm93MjtcclxufVxyXG5leHBvcnRzLmNvb3JkRXEgPSBjb29yZEVxO1xyXG5mdW5jdGlvbiBjb2x1bW5zQmV0d2VlbihhLCBiKSB7XHJcbiAgICBjb25zdCBhX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGEpO1xyXG4gICAgY29uc3QgYl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihiKTtcclxuICAgIGlmIChhX2luZGV4ID49IGJfaW5kZXgpXHJcbiAgICAgICAgcmV0dXJuIGNvbHVtbnNCZXR3ZWVuKGIsIGEpO1xyXG4gICAgY29uc3QgYW5zID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gYV9pbmRleCArIDE7IGkgPCBiX2luZGV4OyBpKyspIHtcclxuICAgICAgICBhbnMucHVzaChcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiW2ldKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuZXhwb3J0cy5jb2x1bW5zQmV0d2VlbiA9IGNvbHVtbnNCZXR3ZWVuO1xyXG5mdW5jdGlvbiBjb29yZERpZmYobykge1xyXG4gICAgY29uc3QgW2Zyb21fY29sdW1uLCBmcm9tX3Jvd10gPSBvLmZyb207XHJcbiAgICBjb25zdCBmcm9tX3Jvd19pbmRleCA9IFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZihmcm9tX3Jvdyk7XHJcbiAgICBjb25zdCBmcm9tX2NvbHVtbl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihmcm9tX2NvbHVtbik7XHJcbiAgICBjb25zdCBbdG9fY29sdW1uLCB0b19yb3ddID0gby50bztcclxuICAgIGNvbnN0IHRvX3Jvd19pbmRleCA9IFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZih0b19yb3cpO1xyXG4gICAgY29uc3QgdG9fY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKHRvX2NvbHVtbik7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGg6IHRvX2NvbHVtbl9pbmRleCAtIGZyb21fY29sdW1uX2luZGV4LFxyXG4gICAgICAgIHY6IHRvX3Jvd19pbmRleCAtIGZyb21fcm93X2luZGV4XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuY29vcmREaWZmID0gY29vcmREaWZmO1xyXG5mdW5jdGlvbiBSaWdodG1vc3RXaGVuU2VlbkZyb21CbGFjayhjb29yZHMpIHtcclxuICAgIGlmIChjb29yZHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJpZWQgdG8gdGFrZSB0aGUgbWF4aW11bSBvZiBhbiBlbXB0eSBhcnJheVwiKTtcclxuICAgIH1cclxuICAgIC8vIFNpbmNlIFwi77yRXCIgdG8gXCLvvJlcIiBhcmUgY29uc2VjdXRpdmUgaW4gVW5pY29kZSwgd2UgY2FuIGp1c3Qgc29ydCBpdCBhcyBVVEYtMTYgc3RyaW5nXHJcbiAgICBjb25zdCBjb2x1bW5zID0gY29vcmRzLm1hcCgoW2NvbCwgX3Jvd10pID0+IGNvbCk7XHJcbiAgICBjb2x1bW5zLnNvcnQoKTtcclxuICAgIGNvbnN0IHJpZ2h0bW9zdF9jb2x1bW4gPSBjb2x1bW5zWzBdO1xyXG4gICAgcmV0dXJuIGNvb3Jkcy5maWx0ZXIoKFtjb2wsIF9yb3ddKSA9PiBjb2wgPT09IHJpZ2h0bW9zdF9jb2x1bW4pO1xyXG59XHJcbmV4cG9ydHMuUmlnaHRtb3N0V2hlblNlZW5Gcm9tQmxhY2sgPSBSaWdodG1vc3RXaGVuU2VlbkZyb21CbGFjaztcclxuZnVuY3Rpb24gTGVmdG1vc3RXaGVuU2VlbkZyb21CbGFjayhjb29yZHMpIHtcclxuICAgIGlmIChjb29yZHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJpZWQgdG8gdGFrZSB0aGUgbWF4aW11bSBvZiBhbiBlbXB0eSBhcnJheVwiKTtcclxuICAgIH1cclxuICAgIC8vIFNpbmNlIFwi77yRXCIgdG8gXCLvvJlcIiBhcmUgY29uc2VjdXRpdmUgaW4gVW5pY29kZSwgd2UgY2FuIGp1c3Qgc29ydCBpdCBhcyBVVEYtMTYgc3RyaW5nXHJcbiAgICBjb25zdCBjb2x1bW5zID0gY29vcmRzLm1hcCgoW2NvbCwgX3Jvd10pID0+IGNvbCk7XHJcbiAgICBjb2x1bW5zLnNvcnQoKTtcclxuICAgIGNvbnN0IGxlZnRtb3N0X2NvbHVtbiA9IGNvbHVtbnNbY29sdW1ucy5sZW5ndGggLSAxXTtcclxuICAgIHJldHVybiBjb29yZHMuZmlsdGVyKChbY29sLCBfcm93XSkgPT4gY29sID09PSBsZWZ0bW9zdF9jb2x1bW4pO1xyXG59XHJcbmV4cG9ydHMuTGVmdG1vc3RXaGVuU2VlbkZyb21CbGFjayA9IExlZnRtb3N0V2hlblNlZW5Gcm9tQmxhY2s7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xyXG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcclxuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZnJvbV9jdXN0b21fc3RhdGUgPSBleHBvcnRzLm1haW4gPSBleHBvcnRzLmdldF9pbml0aWFsX3N0YXRlID0gZXhwb3J0cy5jb29yZEVxID0gZXhwb3J0cy5kaXNwbGF5Q29vcmQgPSBleHBvcnRzLmNhbl9tb3ZlID0gZXhwb3J0cy5jYW5fc2VlID0gZXhwb3J0cy5vcHBvbmVudE9mID0gdm9pZCAwO1xyXG5jb25zdCBib2FyZF8xID0gcmVxdWlyZShcIi4vYm9hcmRcIik7XHJcbmNvbnN0IHBpZWNlX3BoYXNlXzEgPSByZXF1aXJlKFwiLi9waWVjZV9waGFzZVwiKTtcclxuY29uc3QgY29vcmRpbmF0ZV8xID0gcmVxdWlyZShcIi4vY29vcmRpbmF0ZVwiKTtcclxuY29uc3QgYWZ0ZXJfc3RvbmVfcGhhc2VfMSA9IHJlcXVpcmUoXCIuL2FmdGVyX3N0b25lX3BoYXNlXCIpO1xyXG5jb25zdCBzaWRlXzEgPSByZXF1aXJlKFwiLi9zaWRlXCIpO1xyXG5jb25zdCBzdXJyb3VuZF8xID0gcmVxdWlyZShcIi4vc3Vycm91bmRcIik7XHJcbnZhciBzaWRlXzIgPSByZXF1aXJlKFwiLi9zaWRlXCIpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJvcHBvbmVudE9mXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBzaWRlXzIub3Bwb25lbnRPZjsgfSB9KTtcclxuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3R5cGVcIiksIGV4cG9ydHMpO1xyXG52YXIgY2FuX3NlZV8xID0gcmVxdWlyZShcIi4vY2FuX3NlZVwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiY2FuX3NlZVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gY2FuX3NlZV8xLmNhbl9zZWU7IH0gfSk7XHJcbnZhciBwaWVjZV9waGFzZV8yID0gcmVxdWlyZShcIi4vcGllY2VfcGhhc2VcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImNhbl9tb3ZlXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwaWVjZV9waGFzZV8yLmNhbl9tb3ZlOyB9IH0pO1xyXG52YXIgY29vcmRpbmF0ZV8yID0gcmVxdWlyZShcIi4vY29vcmRpbmF0ZVwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZGlzcGxheUNvb3JkXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBjb29yZGluYXRlXzIuZGlzcGxheUNvb3JkOyB9IH0pO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJjb29yZEVxXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBjb29yZGluYXRlXzIuY29vcmRFcTsgfSB9KTtcclxuY29uc3QgZ2V0X2luaXRpYWxfc3RhdGUgPSAod2hvX2dvZXNfZmlyc3QpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcGhhc2U6IFwicmVzb2x2ZWRcIixcclxuICAgICAgICBoYW5kX29mX2JsYWNrOiBbXSxcclxuICAgICAgICBoYW5kX29mX3doaXRlOiBbXSxcclxuICAgICAgICB3aG9fZ29lc19uZXh0OiB3aG9fZ29lc19maXJzdCxcclxuICAgICAgICBib2FyZDogW1xyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi6aaZXCIsIGNhbl9rdW1hbDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuahglwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi6YqAXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLph5FcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIueOi1wiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuOCrVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSwgaGFzX21vdmVkX29ubHlfb25jZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLph5FcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIumKgFwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi5qGCXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLppplcIiwgY2FuX2t1bWFsOiB0cnVlIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg6tcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg4pcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg5NcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44KvXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODk1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODilwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODq1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLF0sXHJcbiAgICAgICAgICAgIFtudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLF0sXHJcbiAgICAgICAgICAgIFtudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLCBudWxsLF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg51cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODq1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODilwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODk1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjgq9cIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OTXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OKXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OrXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLppplcIiwgY2FuX2t1bWFsOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi5qGCXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLpioBcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIumHkVwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi546LXCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44KtXCIsIG5ldmVyX21vdmVkOiB0cnVlLCBoYXNfbW92ZWRfb25seV9vbmNlOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIumHkVwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi6YqAXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLmoYJcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIummmVwiLCBjYW5fa3VtYWw6IHRydWUgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICBdXHJcbiAgICB9O1xyXG59O1xyXG5leHBvcnRzLmdldF9pbml0aWFsX3N0YXRlID0gZ2V0X2luaXRpYWxfc3RhdGU7XHJcbi8qKiDnooHnn7PjgpLnva7jgY/jgILoh6rmrrrmiYvjgavjgarjgovjgojjgYbjgarnooHnn7Pjga7nva7jgY3mlrnjga/jgafjgY3jgarjgYTvvIjlhazlvI/jg6vjg7zjg6vjgIzmiZPjgaPjgZ/nnqzplpPjgavlj5bjgonjgozjgabjgZfjgb7jgYbjg57jgrnjgavjga/nn7Pjga/miZPjgabjgarjgYTjgI3vvIlcclxuICpcclxuICogQHBhcmFtIG9sZFxyXG4gKiBAcGFyYW0gc2lkZVxyXG4gKiBAcGFyYW0gc3RvbmVfdG9cclxuICogQHJldHVybnNcclxuICovXHJcbmZ1bmN0aW9uIHBsYWNlX3N0b25lKG9sZCwgc2lkZSwgc3RvbmVfdG8pIHtcclxuICAgIGlmICgoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKG9sZC5ib2FyZCwgc3RvbmVfdG8pKSB7IC8vIGlmIHRoZSBzcXVhcmUgaXMgYWxyZWFkeSBvY2N1cGllZFxyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtzaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHN0b25lX3RvKX3jgavnooHnn7PjgpLnva7jgZPjgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShzdG9uZV90byl944Gu44Oe44K544Gv5pei44Gr5Z+L44G+44Gj44Gm44GE44G+44GZYCk7XHJcbiAgICB9XHJcbiAgICAvLyDjgb7jgZrnva7jgY9cclxuICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIHN0b25lX3RvLCB7IHR5cGU6IFwi56KBXCIsIHNpZGUgfSk7XHJcbiAgICAvLyDnva7jgYTjgZ/lvozjgafjgIHnnYDmiYvnpoHmraLjgYvjganjgYbjgYvjgpLliKTmlq3jgZnjgovjgZ/jgoHjgavjgIFcclxuICAgIC8v44CO5Zuy44G+44KM44Gm44GE44KL55u45omL44Gu6aeSL+efs+OCkuWPluOCi+OAj+KGkuOAjuWbsuOBvuOCjOOBpuOBhOOCi+iHquWIhuOBrumnki/nn7PjgpLlj5bjgovjgI/jgpLjgrfjg5/jg6Xjg6zjg7zjgrfjg6fjg7PjgZfjgabjgIHnva7jgYTjgZ/kvY3nva7jga7nn7PjgYzmrbvjgpPjgafjgYTjgZ/jgolcclxuICAgIGNvbnN0IGJsYWNrX2FuZF93aGl0ZSA9IG9sZC5ib2FyZC5tYXAocm93ID0+IHJvdy5tYXAoc3EgPT4gc3EgPT09IG51bGwgPyBudWxsIDogc3Euc2lkZSkpO1xyXG4gICAgY29uc3Qgb3Bwb25lbnRfcmVtb3ZlZCA9ICgwLCBzdXJyb3VuZF8xLnJlbW92ZV9zdXJyb3VuZGVkKSgoMCwgc2lkZV8xLm9wcG9uZW50T2YpKHNpZGUpLCBibGFja19hbmRfd2hpdGUpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gKDAsIHN1cnJvdW5kXzEucmVtb3ZlX3N1cnJvdW5kZWQpKHNpZGUsIG9wcG9uZW50X3JlbW92ZWQpO1xyXG4gICAgaWYgKCgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkocmVzdWx0LCBzdG9uZV90bykpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwaGFzZTogXCJzdG9uZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICAgICAgYm9hcmQ6IG9sZC5ib2FyZCxcclxuICAgICAgICAgICAgaGFuZF9vZl9ibGFjazogb2xkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgICAgICBieV93aG9tOiBvbGQuYnlfd2hvbSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3NpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoc3RvbmVfdG8pfeOBq+eigeefs+OCkue9ruOBk+OBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgeaJk+OBo+OBn+eerOmWk+OBq+WPluOCieOCjOOBpuOBl+OBvuOBhuOBruOBp+OBk+OBk+OBr+edgOaJi+emgeatoueCueOBp+OBmWApO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIG9uZV90dXJuKG9sZCwgbW92ZSkge1xyXG4gICAgY29uc3QgYWZ0ZXJfcGllY2VfcGhhc2UgPSAoMCwgcGllY2VfcGhhc2VfMS5wbGF5X3BpZWNlX3BoYXNlKShvbGQsIG1vdmUucGllY2VfcGhhc2UpO1xyXG4gICAgY29uc3QgYWZ0ZXJfc3RvbmVfcGhhc2UgPSBtb3ZlLnN0b25lX3RvID8gcGxhY2Vfc3RvbmUoYWZ0ZXJfcGllY2VfcGhhc2UsIG1vdmUucGllY2VfcGhhc2Uuc2lkZSwgbW92ZS5zdG9uZV90bykgOiB7XHJcbiAgICAgICAgcGhhc2U6IFwic3RvbmVfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgYm9hcmQ6IGFmdGVyX3BpZWNlX3BoYXNlLmJvYXJkLFxyXG4gICAgICAgIGhhbmRfb2ZfYmxhY2s6IGFmdGVyX3BpZWNlX3BoYXNlLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgaGFuZF9vZl93aGl0ZTogYWZ0ZXJfcGllY2VfcGhhc2UuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICBieV93aG9tOiBhZnRlcl9waWVjZV9waGFzZS5ieV93aG9tLFxyXG4gICAgfTtcclxuICAgIHJldHVybiAoMCwgYWZ0ZXJfc3RvbmVfcGhhc2VfMS5yZXNvbHZlX2FmdGVyX3N0b25lX3BoYXNlKShhZnRlcl9zdG9uZV9waGFzZSk7XHJcbn1cclxuZnVuY3Rpb24gbWFpbihtb3Zlcykge1xyXG4gICAgaWYgKG1vdmVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIuaji+itnOOBjOepuuOBp+OBmVwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmcm9tX2N1c3RvbV9zdGF0ZShtb3ZlcywgKDAsIGV4cG9ydHMuZ2V0X2luaXRpYWxfc3RhdGUpKG1vdmVzWzBdLnBpZWNlX3BoYXNlLnNpZGUpKTtcclxufVxyXG5leHBvcnRzLm1haW4gPSBtYWluO1xyXG5mdW5jdGlvbiBmcm9tX2N1c3RvbV9zdGF0ZShtb3ZlcywgaW5pdGlhbF9zdGF0ZSkge1xyXG4gICAgbGV0IHN0YXRlID0gaW5pdGlhbF9zdGF0ZTtcclxuICAgIGZvciAoY29uc3QgbW92ZSBvZiBtb3Zlcykge1xyXG4gICAgICAgIGNvbnN0IG5leHQgPSBvbmVfdHVybihzdGF0ZSwgbW92ZSk7XHJcbiAgICAgICAgaWYgKG5leHQucGhhc2UgPT09IFwiZ2FtZV9lbmRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3RhdGUgPSBuZXh0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0YXRlO1xyXG59XHJcbmV4cG9ydHMuZnJvbV9jdXN0b21fc3RhdGUgPSBmcm9tX2N1c3RvbV9zdGF0ZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5jYW5fbW92ZSA9IGV4cG9ydHMucGxheV9waWVjZV9waGFzZSA9IHZvaWQgMDtcclxuY29uc3QgYm9hcmRfMSA9IHJlcXVpcmUoXCIuL2JvYXJkXCIpO1xyXG5jb25zdCB0eXBlXzEgPSByZXF1aXJlKFwiLi90eXBlXCIpO1xyXG5jb25zdCBjb29yZGluYXRlXzEgPSByZXF1aXJlKFwiLi9jb29yZGluYXRlXCIpO1xyXG5jb25zdCBzaWRlXzEgPSByZXF1aXJlKFwiLi9zaWRlXCIpO1xyXG5jb25zdCBjYW5fc2VlXzEgPSByZXF1aXJlKFwiLi9jYW5fc2VlXCIpO1xyXG4vKiog6aeS44KS5omT44Gk44CC5omL6aeS44GL44KJ5bCG5qOL6aeS44KS55uk5LiK44Gr56e75YuV44GV44Gb44KL44CC6KGM44GN44Gp44GT44KN44Gu54Sh44GE5L2N572u44Gr5qGC6aas44Go6aaZ6LuK44KS5omT44Gj44Gf44KJ44Ko44Op44O844CCXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJhY2h1dGUob2xkLCBvKSB7XHJcbiAgICBpZiAoKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShvbGQuYm9hcmQsIG8udG8pKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3miZPjgajjga7jgZPjgajjgafjgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jg57jgrnjga/ml6Ljgavln4vjgb7jgaPjgabjgYTjgb7jgZlgKTtcclxuICAgIH1cclxuICAgIGlmIChvLnByb2YgPT09IFwi5qGCXCIpIHtcclxuICAgICAgICBpZiAoKDAsIHNpZGVfMS5pc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3MpKDIsIG8uc2lkZSwgby50bykpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3miZPjgajjga7jgZPjgajjgafjgZnjgYzjgIHooYzjgY3jganjgZPjgo3jga7jgarjgYTmoYLppqzjga/miZPjgabjgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChvLnByb2YgPT09IFwi6aaZXCIpIHtcclxuICAgICAgICBpZiAoKDAsIHNpZGVfMS5pc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3MpKDEsIG8uc2lkZSwgby50bykpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3miZPjgajjga7jgZPjgajjgafjgZnjgYzjgIHooYzjgY3jganjgZPjgo3jga7jgarjgYTpppnou4rjga/miZPjgabjgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBoYW5kID0gb2xkW28uc2lkZSA9PT0gXCLnmb1cIiA/IFwiaGFuZF9vZl93aGl0ZVwiIDogXCJoYW5kX29mX2JsYWNrXCJdO1xyXG4gICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby50bywgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBvLnNpZGUsIHByb2Y6IG8ucHJvZiwgY2FuX2t1bWFsOiBmYWxzZSB9KTtcclxuICAgIGNvbnN0IGluZGV4ID0gaGFuZC5maW5kSW5kZXgocHJvZiA9PiBwcm9mID09PSBvLnByb2YpO1xyXG4gICAgaGFuZC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwaGFzZTogXCJwaWVjZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICBoYW5kX29mX2JsYWNrOiBvbGQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICBoYW5kX29mX3doaXRlOiBvbGQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICBieV93aG9tOiBvbGQud2hvX2dvZXNfbmV4dCxcclxuICAgICAgICBib2FyZDogb2xkLmJvYXJkXHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGt1bWFsaW5nMihvbGQsIGZyb20sIHRvKSB7XHJcbiAgICBjb25zdCBraW5nID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShvbGQuYm9hcmQsIGZyb20pO1xyXG4gICAgaWYgKGtpbmc/LnR5cGUgPT09IFwi546LXCIpIHtcclxuICAgICAgICBpZiAoa2luZy5uZXZlcl9tb3ZlZCkge1xyXG4gICAgICAgICAgICBjb25zdCBsYW5jZSA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkob2xkLmJvYXJkLCB0byk7XHJcbiAgICAgICAgICAgIGlmICghbGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg44Kt44Oz44Kw546L44GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkodG8pfeOBuOWLleOBj+OBj+OBvuOCiuOCk+OBkOOCkiR7a2luZy5zaWRlfeOBjOippuOBv+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHRvKX3jgavjga/pp5LjgYzjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChsYW5jZS50eXBlID09PSBcIueigVwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOOCreODs+OCsOeOi+OBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHRvKX3jgbjli5XjgY/jgY/jgb7jgorjgpPjgZDjgpIke2tpbmcuc2lkZX3jgYzoqabjgb/jgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKSh0byl944Gr44GC44KL44Gu44Gv6aaZ6LuK44Gn44Gv44Gq44GP56KB55+z44Gn44GZYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobGFuY2UudHlwZSAhPT0gXCLjgZfjgodcIiB8fCBsYW5jZS5wcm9mICE9PSBcIummmVwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOOCreODs+OCsOeOi+OBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHRvKX3jgbjli5XjgY/jgY/jgb7jgorjgpPjgZDjgpIke2tpbmcuc2lkZX3jgYzoqabjgb/jgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShmcm9tKX3jgavjga/pppnou4rjgafjga/jgarjgYTpp5LjgYzjgYLjgorjgb7jgZlgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobGFuY2UuY2FuX2t1bWFsKSB7XHJcbiAgICAgICAgICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCB0bywga2luZyk7XHJcbiAgICAgICAgICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBmcm9tLCBsYW5jZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBoYXNlOiBcInBpZWNlX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZF9vZl9ibGFjazogb2xkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZF9vZl93aGl0ZTogb2xkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgYnlfd2hvbTogb2xkLndob19nb2VzX25leHRcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOOCreODs+OCsOeOi+OBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHRvKX3jgbjli5XjgY/jgY/jgb7jgorjgpPjgZDjgpIke2tpbmcuc2lkZX3jgYzoqabjgb/jgabjgYTjgb7jgZnjgYzjgIHjgZPjga7pppnou4rjga/miZPjgZ/jgozjgZ/pppnou4rjgarjga7jgafjgY/jgb7jgorjgpPjgZDjga7lr77osaHlpJbjgafjgZlgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChraW5nLmhhc19tb3ZlZF9vbmx5X29uY2UpIHtcclxuICAgICAgICAgICAgY29uc3QgZGlmZiA9ICgwLCBzaWRlXzEuY29vcmREaWZmU2VlbkZyb20pKGtpbmcuc2lkZSwgeyB0bzogdG8sIGZyb20gfSk7XHJcbiAgICAgICAgICAgIGlmIChkaWZmLnYgPT09IDAgJiYgKGRpZmYuaCA9PT0gMiB8fCBkaWZmLmggPT09IC0yKSAmJlxyXG4gICAgICAgICAgICAgICAgKChraW5nLnNpZGUgPT09IFwi6buSXCIgJiYgZnJvbVsxXSA9PT0gXCLlhatcIikgfHwgKGtpbmcuc2lkZSA9PT0gXCLnmb1cIiAmJiBmcm9tWzFdID09PSBcIuS6jFwiKSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYXN0bGluZyhvbGQsIHsgZnJvbSwgdG86IHRvLCBzaWRlOiBraW5nLnNpZGUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7a2luZy5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHRvKX3jgq3jgajjga7jgZPjgajjgafjgZnjgYzjgIHjgZ3jga7jgojjgYbjgarnp7vli5XjgYzjgafjgY3jgoske2tpbmcuc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShcIuOCrVwiKX3jga/nm6TkuIrjgavjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2tpbmcuc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKSh0byl944Kt44Go44Gu44GT44Go44Gn44GZ44GM44CB44Gd44Gu44KI44GG44Gq56e75YuV44GM44Gn44GN44KLJHtraW5nLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoXCLjgq1cIil944Gv55uk5LiK44Gr44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBmdW5jdGlvbiBcXGBrdW1hbGluZzIoKVxcYCBjYWxsZWQgb24gYSBub24ta2luZyBwaWVjZWApO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBSZXNvbHZlZCDjgarnirbmhYvjgavpp5Ljg5XjgqfjgqTjgrrjgpLpgannlKjjgILnnIHnlaXjgZXjgozjgZ/mg4XloLHjgpLlvqnlhYPjgZfjgarjgYzjgonpgannlKjjgZfjgarjgY3jgoPjgYTjgZHjgarjgYTjga7jgafjgIHjgYvjgarjgorjgZfjgpPjganjgYTjgIJcclxuICogQHBhcmFtIG9sZCDlkbzjgbPlh7rjgZflvozjgavnoLTlo4rjgZXjgozjgabjgYTjgovlj6/og73mgKfjgYzjgYLjgovjga7jgafjgIHlvozjgafkvb/jgYTjgZ/jgYTjgarjgonjg4fjgqPjg7zjg5fjgrPjg5Tjg7zjgZfjgabjgYrjgY/jgZPjgajjgIJcclxuICogQHBhcmFtIG9cclxuICovXHJcbmZ1bmN0aW9uIHBsYXlfcGllY2VfcGhhc2Uob2xkLCBvKSB7XHJcbiAgICAvLyBUaGUgdGhpbmcgaXMgdGhhdCB3ZSBoYXZlIHRvIGluZmVyIHdoaWNoIHBpZWNlIGhhcyBtb3ZlZCwgc2luY2UgdGhlIHVzdWFsIG5vdGF0aW9uIGRvZXMgbm90IHNpZ25pZnlcclxuICAgIC8vIHdoZXJlIHRoZSBwaWVjZSBjb21lcyBmcm9tLlxyXG4gICAgLy8g6Z2i5YCS44Gq44Gu44Gv44CB5YW35L2T55qE44Gr44Gp44Gu6aeS44GM5YuV44GE44Gf44Gu44GL44KS44CB5qOL6K2c44Gu5oOF5aCx44GL44KJ5b6p5YWD44GX44Gm44KE44KJ44Gq44GE44Go44GE44GR44Gq44GE44Go44GE44GG54K544Gn44GC44KL77yI5pmu6YCa5aeL54K544Gv5pu444GL44Gq44GE44Gu44Gn77yJ44CCXHJcbiAgICAvLyBmaXJzdCwgdXNlIHRoZSBgc2lkZWAgZmllbGQgYW5kIHRoZSBgcHJvZmAgZmllbGQgdG8gbGlzdCB1cCB0aGUgcG9zc2libGUgcG9pbnRzIG9mIG9yaWdpbiBcclxuICAgIC8vIChub3RlIHRoYXQgXCJpbiBoYW5kXCIgaXMgYSBwb3NzaWJpbGl0eSkuXHJcbiAgICBjb25zdCBwb3NzaWJsZV9wb2ludHNfb2Zfb3JpZ2luID0gKDAsIGJvYXJkXzEubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGVfYW5kX3Byb2YpKG9sZC5ib2FyZCwgby5zaWRlLCBvLnByb2YpO1xyXG4gICAgY29uc3QgaGFuZCA9IG9sZFtvLnNpZGUgPT09IFwi55m9XCIgPyBcImhhbmRfb2Zfd2hpdGVcIiA6IFwiaGFuZF9vZl9ibGFja1wiXTtcclxuICAgIGNvbnN0IGV4aXN0c19pbl9oYW5kID0gaGFuZC5zb21lKHByb2YgPT4gcHJvZiA9PT0gby5wcm9mKTtcclxuICAgIGlmICh0eXBlb2Ygby5mcm9tID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgaWYgKG8uZnJvbSA9PT0gXCLmiZNcIikge1xyXG4gICAgICAgICAgICBpZiAoZXhpc3RzX2luX2hhbmQpIHtcclxuICAgICAgICAgICAgICAgIGlmICgoMCwgdHlwZV8xLmlzVW5wcm9tb3RlZFNob2dpUHJvZmVzc2lvbikoby5wcm9mKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJhY2h1dGUob2xkLCB7IHNpZGU6IG8uc2lkZSwgcHJvZjogby5wcm9mLCB0bzogby50byB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFVucHJvbW90ZWRTaG9naVByb2Zlc3Npb24g5Lul5aSW44Gv5omL6aeS44Gr5YWl44Gj44Gm44GE44KL44Gv44Ga44GM44Gq44GE44Gu44Gn44CBXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZXhpc3RzX2luX2hhbmQg44GM5rqA44Gf44GV44KM44Gm44GE44KL5pmC54K544GnIFVucHJvbW90ZWRTaG9naVByb2Zlc3Npb24g44Gn44GC44KL44GT44Go44Gv5pei44Gr56K65a6a44GX44Gm44GE44KLXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2hvdWxkIG5vdCByZWFjaCBoZXJlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3miZPjgajjga7jgZPjgajjgafjgZnjgYzjgIEke28uc2lkZX3jga7miYvpp5LjgaskeygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBr+OBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG8uZnJvbSA9PT0gXCLlj7NcIikge1xyXG4gICAgICAgICAgICBjb25zdCBwcnVuZWQgPSBwb3NzaWJsZV9wb2ludHNfb2Zfb3JpZ2luLmZpbHRlcihmcm9tID0+IGNhbl9tb3ZlKG9sZC5ib2FyZCwgeyBmcm9tLCB0bzogby50byB9KSk7XHJcbiAgICAgICAgICAgIGlmIChwcnVuZWQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeWPs+OBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7by5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944Gv55uk5LiK44Gr44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgcmlnaHRtb3N0ID0gKDAsIHNpZGVfMS5SaWdodG1vc3RXaGVuU2VlbkZyb20pKG8uc2lkZSwgcHJ1bmVkKTtcclxuICAgICAgICAgICAgaWYgKHJpZ2h0bW9zdC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb3ZlX3BpZWNlKG9sZCwgeyBmcm9tOiByaWdodG1vc3RbMF0sIHRvOiBvLnRvLCBzaWRlOiBvLnNpZGUsIHByb21vdGU6IG8ucHJvbW90ZXMgPz8gbnVsbCB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z944Go44Gu44GT44Go44Gn44GZ44GM44CB44Gd44Gu44KI44GG44Gq56e75YuV44GM44Gn44GN44KLJHtvLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jgYznm6TkuIrjgavopIfmlbDjgYLjgorjgb7jgZlgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChvLmZyb20gPT09IFwi5bemXCIpIHtcclxuICAgICAgICAgICAgY29uc3QgcHJ1bmVkID0gcG9zc2libGVfcG9pbnRzX29mX29yaWdpbi5maWx0ZXIoZnJvbSA9PiBjYW5fbW92ZShvbGQuYm9hcmQsIHsgZnJvbSwgdG86IG8udG8gfSkpO1xyXG4gICAgICAgICAgICBpZiAocHJ1bmVkLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3lt6bjgajjga7jgZPjgajjgafjgZnjgYzjgIHjgZ3jga7jgojjgYbjgarnp7vli5XjgYzjgafjgY3jgoske28uc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBr+ebpOS4iuOBq+OBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGxlZnRtb3N0ID0gKDAsIHNpZGVfMS5MZWZ0bW9zdFdoZW5TZWVuRnJvbSkoby5zaWRlLCBwcnVuZWQpO1xyXG4gICAgICAgICAgICBpZiAobGVmdG1vc3QubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbW92ZV9waWVjZShvbGQsIHsgZnJvbTogbGVmdG1vc3RbMF0sIHRvOiBvLnRvLCBzaWRlOiBvLnNpZGUsIHByb21vdGU6IG8ucHJvbW90ZXMgPz8gbnVsbCB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z944Go44Gu44GT44Go44Gn44GZ44GM44CB44Gd44Gu44KI44GG44Gq56e75YuV44GM44Gn44GN44KLJHtvLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jgYznm6TkuIrjgavopIfmlbDjgYLjgorjgb7jgZlgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi44CM5omT44CN44CM5Y+z44CN44CM5bem44CN44CM5oiQ44CN44CM5LiN5oiQ44CN5Lul5aSW44Gu5o6l5bC+6L6e44Gv5pyq5a6f6KOF44Gn44GZ44CC77yX5YWt6YeR77yI77yX5LqU77yJ44Gq44Gp44Go5pu444GE44Gm5LiL44GV44GE44CCXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHR5cGVvZiBvLmZyb20gPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAvLyDpp5LjgYzjganjgZPjgYvjgonmnaXjgZ/jgYvjgYzliIbjgYvjgonjgarjgYTjgIJcclxuICAgICAgICAvLyDjgZPjga7jgojjgYbjgarjgajjgY3jgavjga/jgIFcclxuICAgICAgICAvLyDjg7vmiZPjgaTjgZfjgYvjgarjgYTjgarjgonmiZPjgaRcclxuICAgICAgICAvLyDjg7vjgZ3jgYbjgafjgarjgY/jgabjgIHnm67nmoTlnLDjgavooYzjgZHjgovpp5LjgYznm6TkuIrjgasgMSDnqK7poZ7jgZfjgYvjgarjgYTjgarjgonjgIHjgZ3jgozjgpLjgZnjgotcclxuICAgICAgICAvLyDjgajjgYTjgYbop6PmsbrjgpLjgZnjgovjgZPjgajjgavjgarjgovjgIJcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vIOOBl+OBi+OBl+OAgeOBk+OBruOCsuODvOODoOOBq+OBiuOBhOOBpuOAgeS6jOODneOBr+OAjOedgOaJi+OBp+OBjeOBquOBhOaJi+OAjeOBp+OBr+OBquOBj+OBpuOAgeOAjOedgOaJi+OBl+OBn+W+jOOBq+OAgeefs+ODleOCp+OCpOOCuuino+a2iOW+jOOBq+OCguOBneOCjOOBjOaui+OBo+OBpuOBl+OBvuOBo+OBpuOBhOOBn+OCieOAgeWPjeWJh+iyoOOBkeOAjeOBqOOBquOCi+OCguOBruOBp+OBguOCi+OAglxyXG4gICAgICAgIC8vIOOBk+OBruWJjeaPkOOBruOCguOBqOOBp+OAgeODneOBjOaoquS4puOBs+OBl+OBpuOBhOOCi+OBqOOBjeOBq+OAgeeJh+aWueOBruODneOBruWJjeOBq+OBguOCi+mnkuOCkuWPluOCjeOBhuOBqOOBl+OBpuOBhOOCi+eKtuazgeOCkuiAg+OBiOOBpuOBu+OBl+OBhOOAglxyXG4gICAgICAgIC8vIOOBmeOCi+OBqOOAgeW4uOitmOeahOOBq+OBr+OBneOCk+OBquOBguOBi+OCieOBleOBvuOBquS6jOODneOBr+aMh+OBleOBquOBhOOBruOBp+OAgTHjg57jgrnliY3pgLLjgZfjgablj5bjgovjga7jgYzlvZPjgZ/jgorliY3jgafjgYLjgorjgIFcclxuICAgICAgICAvLyDjgZ3jgozjgpLmo4vorZzjgavotbfjgZPjgZnjgajjgY3jgavjgo/jgZbjgo/jgZbjgIznm7TjgI3jgpLku5jjgZHjgovjgarjganjg5Djgqvjg5DjgqvjgZfjgYTjgIJcclxuICAgICAgICAvLyDjgojjgaPjgabjgIHlh7rnmbrngrnmjqjoq5bjgavjgYrjgYTjgabjga/jgIHmnIDliJ3jga/kuozjg53jga/mjpLpmaTjgZfjgabmjqjoq5bjgZnjgovjgZPjgajjgajjgZnjgovjgIJcclxuICAgICAgICAvLyBXZSBoYXZlIG5vIGluZm8gb24gd2hlcmUgdGhlIHBpZWNlIGNhbWUgZnJvbS5cclxuICAgICAgICAvLyBJbiBzdWNoIGNhc2VzLCB0aGUgcmF0aW9uYWwgd2F5IG9mIGluZmVyZW5jZSBpc1xyXG4gICAgICAgIC8vICogUGFyYWNodXRlIGEgcGllY2UgaWYgeW91IGhhdmUgdG8uXHJcbiAgICAgICAgLy8gKiBPdGhlcndpc2UsIGlmIHRoZXJlIGlzIG9ubHkgb25lIHBpZWNlIG9uIGJvYXJkIHRoYXQgY2FuIGdvIHRvIHRoZSBzcGVjaWZpZWQgZGVzdGluYXRpb24sIHRha2UgdGhhdCBtb3ZlLlxyXG4gICAgICAgIC8vIFxyXG4gICAgICAgIC8vIEhvd2V2ZXIsIGluIHRoaXMgZ2FtZSwgZG91YmxlZCBwYXducyBhcmUgbm90IGFuIGltcG9zc2libGUgbW92ZSwgYnV0IHJhdGhlciBhIG1vdmUgdGhhdCBjYXVzZSB5b3UgdG8gbG9zZSBpZiBpdCByZW1haW5lZCBldmVuIGFmdGVyIHRoZSByZW1vdmFsLWJ5LWdvLlxyXG4gICAgICAgIC8vIFVuZGVyIHN1Y2ggYW4gYXNzdW1wdGlvbiwgY29uc2lkZXIgdGhlIHNpdHVhdGlvbiB3aGVyZSB0aGVyZSBhcmUgdHdvIHBhd25zIG5leHQgdG8gZWFjaCBvdGhlciBhbmQgdGhlcmUgaXMgYW4gZW5lbXkgcGllY2UgcmlnaHQgaW4gZnJvbnQgb2Ygb25lIG9mIGl0LlxyXG4gICAgICAgIC8vIEluIHN1Y2ggYSBjYXNlLCBpdCBpcyB2ZXJ5IGVhc3kgdG8gc2VlIHRoYXQgdGFraW5nIHRoZSBwaWVjZSBkaWFnb25hbGx5IHJlc3VsdHMgaW4gZG91YmxlZCBwYXducy5cclxuICAgICAgICAvLyBIZW5jZSwgd2hlbiB3cml0aW5nIHRoYXQgbW92ZSBkb3duLCB5b3UgZG9uJ3Qgd2FudCB0byBleHBsaWNpdGx5IGFubm90YXRlIHN1Y2ggYSBjYXNlIHdpdGgg55u0LlxyXG4gICAgICAgIC8vIFRoZXJlZm9yZSwgd2hlbiBpbmZlcnJpbmcgdGhlIHBvaW50IG9mIG9yaWdpbiwgSSBmaXJzdCBpZ25vcmUgdGhlIGRvdWJsZWQgcGF3bnMuXHJcbiAgICAgICAgY29uc3QgcHJ1bmVkID0gcG9zc2libGVfcG9pbnRzX29mX29yaWdpbi5maWx0ZXIoZnJvbSA9PiBjYW5fbW92ZV9hbmRfbm90X2NhdXNlX2RvdWJsZWRfcGF3bnMob2xkLmJvYXJkLCB7IGZyb20sIHRvOiBvLnRvIH0pKTtcclxuICAgICAgICBpZiAocHJ1bmVkLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBpZiAoby5wcm9mID09PSBcIuOCrVwiKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDjgq3jg6Pjgrnjg6rjg7PjgrDjgYrjgojjgbPjgY/jgb7jgorjgpPjgZDjga/jgq3jg7PjgrDnjovjga7li5XjgY3jgajjgZfjgabmm7jjgY/jgIJcclxuICAgICAgICAgICAgICAgIC8vIOW4uOOBq+OCreODs+OCsOOBjOmAmuW4uOWLleOBkeOBquOBhOevhOWbsuOBuOOBruenu+WLleOBqOOBquOCi+OAglxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGt1bWFsaW5nMihvbGQsIHBvc3NpYmxlX3BvaW50c19vZl9vcmlnaW5bMF0sIG8udG8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGV4aXN0c19pbl9oYW5kKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKDAsIHR5cGVfMS5pc1VucHJvbW90ZWRTaG9naVByb2Zlc3Npb24pKG8ucHJvZikpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyYWNodXRlKG9sZCwgeyBzaWRlOiBvLnNpZGUsIHByb2Y6IG8ucHJvZiwgdG86IG8udG8gfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uIOS7peWkluOBr+aJi+mnkuOBq+WFpeOBo+OBpuOBhOOCi+OBr+OBmuOBjOOBquOBhOOBruOBp+OAgVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGV4aXN0c19pbl9oYW5kIOOBjOa6gOOBn+OBleOCjOOBpuOBhOOCi+aZgueCueOBpyBVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uIOOBp+OBguOCi+OBk+OBqOOBr+aXouOBq+eiuuWumuOBl+OBpuOBhOOCi1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInNob3VsZCBub3QgcmVhY2ggaGVyZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBydW5lZF9hbGxvd2luZ19kb3VibGVkX3Bhd25zID0gcG9zc2libGVfcG9pbnRzX29mX29yaWdpbi5maWx0ZXIoZnJvbSA9PiBjYW5fbW92ZShvbGQuYm9hcmQsIHsgZnJvbSwgdG86IG8udG8gfSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBydW5lZF9hbGxvd2luZ19kb3VibGVkX3Bhd25zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z944Go44Gu44GT44Go44Gn44GZ44GM44CB44Gd44Gu44KI44GG44Gq56e75YuV44GM44Gn44GN44KLJHtvLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jga/nm6TkuIrjgavjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBydW5lZF9hbGxvd2luZ19kb3VibGVkX3Bhd25zLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyb20gPSBwcnVuZWRfYWxsb3dpbmdfZG91YmxlZF9wYXduc1swXTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW92ZV9waWVjZShvbGQsIHsgZnJvbSwgdG86IG8udG8sIHNpZGU6IG8uc2lkZSwgcHJvbW90ZTogby5wcm9tb3RlcyA/PyBudWxsIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3jgajjga7jgZPjgajjgafjgZnjgYzjgIHjgZ3jga7jgojjgYbjgarnp7vli5XjgYzjgafjgY3jgoske28uc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBjOebpOS4iuOBq+ikh+aVsOOBguOCiuOAgeOBl+OBi+OCguOBqeOCjOOCkuaMh+OBl+OBpuOCguS6jOODneOBp+OBmWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHBydW5lZC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgY29uc3QgZnJvbSA9IHBydW5lZFswXTtcclxuICAgICAgICAgICAgcmV0dXJuIG1vdmVfcGllY2Uob2xkLCB7IGZyb20sIHRvOiBvLnRvLCBzaWRlOiBvLnNpZGUsIHByb21vdGU6IG8ucHJvbW90ZXMgPz8gbnVsbCB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z944Go44Gu44GT44Go44Gn44GZ44GM44CB44Gd44Gu44KI44GG44Gq56e75YuV44GM44Gn44GN44KLJHtvLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jgYznm6TkuIrjgavopIfmlbDjgYLjgorjgIHjganjgozjgpLmjqHnlKjjgZnjgovjgbnjgY3jgYvliIbjgYvjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBmcm9tID0gby5mcm9tO1xyXG4gICAgICAgIGlmICghcG9zc2libGVfcG9pbnRzX29mX29yaWdpbi5zb21lKGMgPT4gKDAsIGNvb3JkaW5hdGVfMS5jb29yZEVxKShjLCBmcm9tKSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShmcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjgagkeygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOCkuWLleOBi+OBneOBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGZyb20pfeOBq+OBryR7by5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944Gv44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjYW5fbW92ZShvbGQuYm9hcmQsIHsgZnJvbSwgdG86IG8udG8gfSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1vdmVfcGllY2Uob2xkLCB7IGZyb20sIHRvOiBvLnRvLCBzaWRlOiBvLnNpZGUsIHByb21vdGU6IG8ucHJvbW90ZXMgPz8gbnVsbCB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoby5wcm9mID09PSBcIuOCrVwiKSB7XHJcbiAgICAgICAgICAgIC8vIOOCreODo+OCueODquODs+OCsOOBiuOCiOOBs+OBj+OBvuOCiuOCk+OBkOOBr+OCreODs+OCsOeOi+OBruWLleOBjeOBqOOBl+OBpuabuOOBj+OAglxyXG4gICAgICAgICAgICAvLyDluLjjgavjgq3jg7PjgrDjgYzpgJrluLjli5XjgZHjgarjgYTnr4Tlm7Ljgbjjga7np7vli5XjgajjgarjgovjgIJcclxuICAgICAgICAgICAgcmV0dXJuIGt1bWFsaW5nMihvbGQsIGZyb20sIG8udG8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShmcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjgagkeygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOCkuWLleOBi+OBneOBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944GvJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G45YuV44GR44KL6aeS44Gn44Gv44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMucGxheV9waWVjZV9waGFzZSA9IHBsYXlfcGllY2VfcGhhc2U7XHJcbi8qKiBgby5zaWRlYCDjgYzpp5LjgpIgYG8uZnJvbWAg44GL44KJIGBvLnRvYCDjgavli5XjgYvjgZnjgILjgZ3jga7pp5LjgYwgYG8uZnJvbWAg44GL44KJIGBvLnRvYCDjgbjjgaggY2FuX21vdmUg44Gn44GC44KL44GT44Go44KS6KaB5rGC44GZ44KL44CC44Kt44Oj44K544Oq44Oz44Kw44O744GP44G+44KK44KT44GQ44Gv5omx44KP44Gq44GE44GM44CB44Ki44Oz44OR44OD44K144Oz44Gv5omx44GG44CCXHJcbiAqL1xyXG5mdW5jdGlvbiBtb3ZlX3BpZWNlKG9sZCwgbykge1xyXG4gICAgY29uc3QgcGllY2VfdGhhdF9tb3ZlcyA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkob2xkLmJvYXJkLCBvLmZyb20pO1xyXG4gICAgaWYgKCFwaWVjZV90aGF0X21vdmVzKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBruenu+WLleOCkuippuOBv+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944Gr44Gv6aeS44GM44GC44KK44G+44Gb44KTYCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwaWVjZV90aGF0X21vdmVzLnR5cGUgPT09IFwi56KBXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Gu56e75YuV44KS6Kmm44G/44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgavjgYLjgovjga7jga/nooHnn7PjgafjgYLjgorjgIHpp5Ljgafjga/jgYLjgorjgb7jgZvjgpNgKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHBpZWNlX3RoYXRfbW92ZXMuc2lkZSAhPT0gby5zaWRlKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBruenu+WLleOCkuippuOBv+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944Gr44GC44KL44Gu44GvJHsoMCwgc2lkZV8xLm9wcG9uZW50T2YpKG8uc2lkZSl944Gu6aeS44Gn44GZYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXMgPSBjYW5fbW92ZShvbGQuYm9hcmQsIHsgZnJvbTogby5mcm9tLCB0bzogby50byB9KTtcclxuICAgIGlmIChyZXMgPT09IFwiZW4gcGFzc2FudFwiKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogICAgICAgICAgZnJvbVswXSB0b1swXVxyXG4gICAgICAgICAqICAgICAgICAgfCAgLi4gIHwgIC4uICB8XHJcbiAgICAgICAgICogdG9bMV0gICB8ICAuLiAgfCAgdG8gIHxcclxuICAgICAgICAgKiBmcm9tWzFdIHwgZnJvbSB8IHBhd24gfFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0IGNvb3JkX2hvcml6b250YWxseV9hZGphY2VudCA9IFtvLnRvWzBdLCBvLmZyb21bMV1dO1xyXG4gICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8udG8sIHBpZWNlX3RoYXRfbW92ZXMpO1xyXG4gICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8uZnJvbSwgbnVsbCk7XHJcbiAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgY29vcmRfaG9yaXpvbnRhbGx5X2FkamFjZW50LCBudWxsKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwaGFzZTogXCJwaWVjZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICAgICAgYm9hcmQ6IG9sZC5ib2FyZCxcclxuICAgICAgICAgICAgaGFuZF9vZl9ibGFjazogb2xkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgICAgICBieV93aG9tOiBvbGQud2hvX2dvZXNfbmV4dFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICghcmVzKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBruenu+WLleOCkuippuOBv+OBpuOBhOOBvuOBmeOBjOOAgemnkuOBruWLleOBjeS4iuOBneOBruOCiOOBhuOBquenu+WLleOBr+OBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgfVxyXG4gICAgaWYgKCgwLCB0eXBlXzEuaXNfcHJvbW90YWJsZSkocGllY2VfdGhhdF9tb3Zlcy5wcm9mKVxyXG4gICAgICAgICYmICgoMCwgc2lkZV8xLmlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cykoMywgby5zaWRlLCBvLmZyb20pIHx8ICgwLCBzaWRlXzEuaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzKSgzLCBvLnNpZGUsIG8udG8pKSkge1xyXG4gICAgICAgIGlmIChvLnByb21vdGUpIHtcclxuICAgICAgICAgICAgaWYgKHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9PT0gXCLmoYJcIikge1xyXG4gICAgICAgICAgICAgICAgcGllY2VfdGhhdF9tb3Zlcy5wcm9mID0gXCLmiJDmoYJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwaWVjZV90aGF0X21vdmVzLnByb2YgPT09IFwi6YqAXCIpIHtcclxuICAgICAgICAgICAgICAgIHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9IFwi5oiQ6YqAXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocGllY2VfdGhhdF9tb3Zlcy5wcm9mID09PSBcIummmVwiKSB7XHJcbiAgICAgICAgICAgICAgICBwaWVjZV90aGF0X21vdmVzLnByb2YgPSBcIuaIkOmmmVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9PT0gXCLjgq1cIikge1xyXG4gICAgICAgICAgICAgICAgcGllY2VfdGhhdF9tb3Zlcy5wcm9mID0gXCLotoVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwaWVjZV90aGF0X21vdmVzLnByb2YgPT09IFwi44OdXCIpIHtcclxuICAgICAgICAgICAgICAgIHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9IFwi44GoXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICgocGllY2VfdGhhdF9tb3Zlcy5wcm9mID09PSBcIuahglwiICYmICgwLCBzaWRlXzEuaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzKSgyLCBvLnNpZGUsIG8udG8pKVxyXG4gICAgICAgICAgICAgICAgfHwgKHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9PT0gXCLppplcIiAmJiAoMCwgc2lkZV8xLmlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cykoMSwgby5zaWRlLCBvLnRvKSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtwaWVjZV90aGF0X21vdmVzLnByb2Z95LiN5oiQ44Go44Gu44GT44Go44Gn44GZ44GM44CBJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkocGllY2VfdGhhdF9tb3Zlcy5wcm9mKX3jgpLkuI3miJDjgafooYzjgY3jganjgZPjgo3jga7jgarjgYTjgajjgZPjgo3jgavooYzjgYvjgZvjgovjgZPjgajjga/jgafjgY3jgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChvLnByb21vdGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke3BpZWNlX3RoYXRfbW92ZXMucHJvZn0ke28ucHJvbW90ZSA/IFwi5oiQXCIgOiBcIuS4jeaIkFwifeOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBk+OBruenu+WLleOBr+aIkOOCiuOCkueZuueUn+OBleOBm+OBquOBhOOBruOBp+OAjCR7by5wcm9tb3RlID8gXCLmiJBcIiA6IFwi5LiN5oiQXCJ944CN6KGo6KiY44Gv44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3Qgb2NjdXBpZXIgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKG9sZC5ib2FyZCwgby50byk7XHJcbiAgICBpZiAoIW9jY3VwaWVyKSB7XHJcbiAgICAgICAgaWYgKHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9PT0gXCLjg51cIiAmJiBwaWVjZV90aGF0X21vdmVzLm5ldmVyX21vdmVkICYmIG8udG9bMV0gPT09IFwi5LqUXCIpIHtcclxuICAgICAgICAgICAgcGllY2VfdGhhdF9tb3Zlcy5zdWJqZWN0X3RvX2VuX3Bhc3NhbnQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLnRvLCBwaWVjZV90aGF0X21vdmVzKTtcclxuICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLmZyb20sIG51bGwpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHBoYXNlOiBcInBpZWNlX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgICAgICBib2FyZDogb2xkLmJvYXJkLFxyXG4gICAgICAgICAgICBoYW5kX29mX2JsYWNrOiBvbGQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICAgICAgaGFuZF9vZl93aGl0ZTogb2xkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgICAgIGJ5X3dob206IG9sZC53aG9fZ29lc19uZXh0XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG9jY3VwaWVyLnR5cGUgPT09IFwi56KBXCIpIHtcclxuICAgICAgICBpZiAob2NjdXBpZXIuc2lkZSA9PT0gby5zaWRlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjga7np7vli5XjgpLoqabjgb/jgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgavoh6rliIbjga7nooHnn7PjgYzjgYLjgovjga7jgafjgIHnp7vli5XjgafjgY3jgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8udG8sIHBpZWNlX3RoYXRfbW92ZXMpO1xyXG4gICAgICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLmZyb20sIG51bGwpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcGhhc2U6IFwicGllY2VfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgICAgICAgICBib2FyZDogb2xkLmJvYXJkLFxyXG4gICAgICAgICAgICAgICAgaGFuZF9vZl9ibGFjazogb2xkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgICAgICAgICBoYW5kX29mX3doaXRlOiBvbGQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICAgICAgICAgIGJ5X3dob206IG9sZC53aG9fZ29lc19uZXh0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKG9jY3VwaWVyLnNpZGUgPT09IG8uc2lkZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Gu56e75YuV44KS6Kmm44G/44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944Gr6Ieq5YiG44Gu6aeS44GM44GC44KL44Gu44Gn44CB56e75YuV44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG9jY3VwaWVyLnR5cGUgPT09IFwi44GX44KHXCIpIHtcclxuICAgICAgICAgICAgKG8uc2lkZSA9PT0gXCLnmb1cIiA/IG9sZC5oYW5kX29mX3doaXRlIDogb2xkLmhhbmRfb2ZfYmxhY2spLnB1c2goKDAsIHR5cGVfMS51bnByb21vdGUpKG9jY3VwaWVyLnByb2YpKTtcclxuICAgICAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby50bywgcGllY2VfdGhhdF9tb3Zlcyk7XHJcbiAgICAgICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8uZnJvbSwgbnVsbCk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwaGFzZTogXCJwaWVjZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICAgICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgICAgICAgICBoYW5kX29mX2JsYWNrOiBvbGQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICAgICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgICAgICAgICAgYnlfd2hvbTogb2xkLndob19nb2VzX25leHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8udG8sIHBpZWNlX3RoYXRfbW92ZXMpO1xyXG4gICAgICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLmZyb20sIG51bGwpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcGhhc2U6IFwicGllY2VfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgICAgICAgICBib2FyZDogb2xkLmJvYXJkLFxyXG4gICAgICAgICAgICAgICAgaGFuZF9vZl9ibGFjazogb2xkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgICAgICAgICBoYW5kX29mX3doaXRlOiBvbGQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICAgICAgICAgIGJ5X3dob206IG9sZC53aG9fZ29lc19uZXh0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBgby5mcm9tYCDjgavpp5LjgYzjgYLjgaPjgabjgZ3jga7pp5LjgYwgYG8udG9gIOOBuOOBqOWLleOBj+S9meWcsOOBjOOBguOCi+OBi+OBqeOBhuOBi+OCkui/lOOBmeOAgmBvLnRvYCDjgYzlkbPmlrnjga7pp5Ljgafln4vjgb7jgaPjgabjgYTjgZ/jgokgZmFsc2Ug44Gg44GX44CB44Od44O844Oz44Gu5pac44KB5YmN44Gr5pW16aeS44GM44Gq44GE44Gq44KJ5pac44KB5YmN44GvIGZhbHNlIOOBqOOBquOCi+OAglxyXG4gKiAgQ2hlY2tzIHdoZXRoZXIgdGhlcmUgaXMgYSBwaWVjZSBhdCBgby5mcm9tYCB3aGljaCBjYW4gbW92ZSB0byBgby50b2AuIFdoZW4gYG8udG9gIGlzIG9jY3VwaWVkIGJ5IGFuIGFsbHksIHRoaXMgZnVuY3Rpb24gcmV0dXJucyBmYWxzZSxcclxuICogIGFuZCB3aGVuIHRoZXJlIGlzIG5vIGVuZW15IHBpZWNlIGRpYWdvbmFsIHRvIHBhd24sIHRoaXMgZnVuY3Rpb24gcmV0dXJucyBmYWxzZSBmb3IgdGhlIGRpYWdvbmFsIGRpcmVjdGlvbi5cclxuICogQHBhcmFtIGJvYXJkXHJcbiAqIEBwYXJhbSBvXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5mdW5jdGlvbiBjYW5fbW92ZShib2FyZCwgbykge1xyXG4gICAgY29uc3QgcCA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIG8uZnJvbSk7XHJcbiAgICBpZiAoIXApIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAocC50eXBlID09PSBcIueigVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcGllY2VfYXRfZGVzdGluYXRpb24gPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBvLnRvKTtcclxuICAgIGlmIChwaWVjZV9hdF9kZXN0aW5hdGlvbj8uc2lkZSA9PT0gcC5zaWRlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKHAucHJvZiAhPT0gXCLjg51cIikge1xyXG4gICAgICAgIHJldHVybiAoMCwgY2FuX3NlZV8xLmNhbl9zZWUpKGJvYXJkLCBvKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGRlbHRhID0gKDAsIHNpZGVfMS5jb29yZERpZmZTZWVuRnJvbSkocC5zaWRlLCBvKTtcclxuICAgIC8vIGNhbiBhbHdheXMgbW92ZSBmb3J3YXJkXHJcbiAgICBpZiAoZGVsdGEudiA9PT0gMSAmJiBkZWx0YS5oID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICAvLyBjYW4gdGFrZSBkaWFnb25hbGx5LCBhcyBsb25nIGFzIGFuIG9wcG9uZW50J3MgcGllY2UgaXMgbG9jYXRlZCB0aGVyZSwgb3Igd2hlbiBpdCBpcyBhbiBlbiBwYXNzYW50XHJcbiAgICBpZiAoZGVsdGEudiA9PT0gMSAmJiAoZGVsdGEuaCA9PT0gMSB8fCBkZWx0YS5oID09PSAtMSkpIHtcclxuICAgICAgICBpZiAocGllY2VfYXRfZGVzdGluYXRpb24/LnNpZGUgPT09ICgwLCBzaWRlXzEub3Bwb25lbnRPZikocC5zaWRlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkX2hvcml6b250YWxseV9hZGphY2VudCA9ICgwLCBzaWRlXzEuYXBwbHlEZWx0YVNlZW5Gcm9tKShwLnNpZGUsIG8uZnJvbSwgeyB2OiAwLCBoOiBkZWx0YS5oIH0pO1xyXG4gICAgICAgICAgICBjb25zdCBwaWVjZV9ob3Jpem9udGFsbHlfYWRqYWNlbnQgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBjb29yZF9ob3Jpem9udGFsbHlfYWRqYWNlbnQpO1xyXG4gICAgICAgICAgICBpZiAoby5mcm9tWzFdID09PSBcIuS6lFwiXHJcbiAgICAgICAgICAgICAgICAmJiBwaWVjZV9ob3Jpem9udGFsbHlfYWRqYWNlbnQ/LnR5cGUgPT09IFwi44K5XCJcclxuICAgICAgICAgICAgICAgICYmIHBpZWNlX2hvcml6b250YWxseV9hZGphY2VudC5wcm9mID09PSBcIuODnVwiXHJcbiAgICAgICAgICAgICAgICAmJiBwaWVjZV9ob3Jpem9udGFsbHlfYWRqYWNlbnQuc3ViamVjdF90b19lbl9wYXNzYW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJlbiBwYXNzYW50XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAocC5uZXZlcl9tb3ZlZCAmJiBkZWx0YS52ID09PSAyICYmIGRlbHRhLmggPT09IDApIHtcclxuICAgICAgICAvLyBjYW4gbW92ZSB0d28gaW4gdGhlIGZyb250LCB1bmxlc3MgYmxvY2tlZFxyXG4gICAgICAgIGNvbnN0IGNvb3JkX2luX2Zyb250ID0gKDAsIHNpZGVfMS5hcHBseURlbHRhU2VlbkZyb20pKHAuc2lkZSwgby5mcm9tLCB7IHY6IDEsIGg6IDAgfSk7XHJcbiAgICAgICAgY29uc3QgY29vcmRfdHdvX2luX2Zyb250ID0gKDAsIHNpZGVfMS5hcHBseURlbHRhU2VlbkZyb20pKHAuc2lkZSwgby5mcm9tLCB7IHY6IDIsIGg6IDAgfSk7XHJcbiAgICAgICAgaWYgKCgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIGNvb3JkX2luX2Zyb250KVxyXG4gICAgICAgICAgICB8fCAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBjb29yZF90d29faW5fZnJvbnQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5jYW5fbW92ZSA9IGNhbl9tb3ZlO1xyXG5mdW5jdGlvbiBjYW5fbW92ZV9hbmRfbm90X2NhdXNlX2RvdWJsZWRfcGF3bnMoYm9hcmQsIG8pIHtcclxuICAgIGlmICghY2FuX21vdmUoYm9hcmQsIG8pKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcGllY2UgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBvLmZyb20pO1xyXG4gICAgaWYgKHBpZWNlPy50eXBlID09PSBcIuOCuVwiICYmIHBpZWNlLnByb2YgPT09IFwi44OdXCIpIHtcclxuICAgICAgICBpZiAoby5mcm9tWzBdID09PSBvLnRvWzBdKSB7IC8vIG5vIHJpc2sgb2YgZG91YmxlZCBwYXducyB3aGVuIHRoZSBwYXduIG1vdmVzIHN0cmFpZ2h0XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgcGF3bl9jb29yZHMgPSAoMCwgYm9hcmRfMS5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZikoYm9hcmQsIHBpZWNlLnNpZGUsIFwi44OdXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBwcm9ibGVtYXRpY19wYXducyA9IHBhd25fY29vcmRzLmZpbHRlcigoW2NvbCwgX3Jvd10pID0+IGNvbCA9PT0gby50b1swXSk7XHJcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGFyZSBubyBwcm9ibGVtYXRpYyBwYXducywgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgYXJlLCB3ZSB3YW50IHRvIGF2b2lkIHN1Y2ggYSBtb3ZlIGluIHRoaXMgZnVuY3Rpb24sIHNvIGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9ibGVtYXRpY19wYXducy5sZW5ndGggPT09IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gY2FzdGxpbmcob2xkLCBvKSB7XHJcbiAgICAvLyDmpJzmn7vmuIjvvJpcclxuICAgIC8vIOKRoCDjgq3jg7PjgrDnjovjgYwx5Zue44Gg44GR5YmN6YCy44GX44Gf54q25oWL44GnXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyDjgZPjgozjgYvjgonmpJzmn7vvvJpcclxuICAgIC8vIOKRoSDjgq3jg6Pjgrnjg6rjg7PjgrDlr77osaHjga7jg6vjg7zjgq/vvIjku6XkuItB77yJ44Gv5LiA5bqm44KC5YuV44GE44Gm44GK44KJ44GaXHJcbiAgICAvLyDikaIg55u45omL44GL44KJ44Gu546L5omL77yI44OB44Kn44OD44Kv77yJ44GM5o6b44GL44Gj44Gm44GK44KJ44Ga56e75YuV5YWI44Gu44Oe44K544Go6YCa6YGO54K544Gu44Oe44K544Gr44KC5pW144Gu6aeS44Gu5Yip44GN44Gv44Gq44GPXHJcbiAgICAvLyDikaMg44Kt44Oz44Kw546L44GoQeOBrumWk+OBq+mnku+8iOODgeOCp+OCueOAgeWwhuaji++8ieOBjOeEoeOBhOWgtOWQiOOBq+S9v+eUqOOBp+OBjeOCi1xyXG4gICAgY29uc3QgZnJvbV9jb2x1bW5faW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2Yoby5mcm9tWzBdKTtcclxuICAgIGNvbnN0IHRvX2NvbHVtbl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihvLnRvWzBdKTtcclxuICAgIGNvbnN0IHJvb2tfY29vcmQgPSBbZnJvbV9jb2x1bW5faW5kZXggPCB0b19jb2x1bW5faW5kZXggPyBcIu+8kVwiIDogXCLvvJlcIiwgby5mcm9tWzFdXTtcclxuICAgIGNvbnN0IHJvb2sgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKG9sZC5ib2FyZCwgcm9va19jb29yZCk7XHJcbiAgICBjb25zdCBjb29yZF90aGF0X2tpbmdfcGFzc2VzX3Rocm91Z2ggPSBbXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIlsoZnJvbV9jb2x1bW5faW5kZXggKyB0b19jb2x1bW5faW5kZXgpIC8gMl0sIG8uZnJvbVsxXV07XHJcbiAgICBpZiAocm9vaz8udHlwZSAhPT0gXCLjgrlcIiB8fCByb29rLnByb2YgIT09IFwi44OrXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Go44Kt44Oz44Kw546L44KS44Kt44Oj44K544Oq44Oz44Kw44GX44KI44GG44Go44GX44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkocm9va19jb29yZCl944Gr44Or44O844Kv44GM44Gq44GE44Gu44Gn44Kt44Oj44K544Oq44Oz44Kw44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXJvb2submV2ZXJfbW92ZWQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Go44Kt44Oz44Kw546L44KS44Kt44Oj44K544Oq44Oz44Kw44GX44KI44GG44Go44GX44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkocm9va19jb29yZCl944Gr44GC44KL44Or44O844Kv44Gv5pei44Gr5YuV44GE44Gf44GT44Go44GM44GC44KL44Or44O844Kv44Gq44Gu44Gn44Kt44Oj44K544Oq44Oz44Kw44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICB9XHJcbiAgICBpZiAoKDAsIGNhbl9zZWVfMS5kb19hbnlfb2ZfbXlfcGllY2VzX3NlZSkob2xkLmJvYXJkLCBvLmZyb20sICgwLCBzaWRlXzEub3Bwb25lbnRPZikoby5zaWRlKSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Go44Kt44Oz44Kw546L44KS44Kt44Oj44K544Oq44Oz44Kw44GX44KI44GG44Go44GX44Gm44GE44G+44GZ44GM44CB55u45omL44GL44KJ44Gu546L5omL77yI44OB44Kn44OD44Kv77yJ44GM5o6b44GL44Gj44Gm44GE44KL44Gu44Gn44Kt44Oj44K544Oq44Oz44Kw44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICB9XHJcbiAgICBpZiAoKDAsIGNhbl9zZWVfMS5kb19hbnlfb2ZfbXlfcGllY2VzX3NlZSkob2xkLmJvYXJkLCBjb29yZF90aGF0X2tpbmdfcGFzc2VzX3Rocm91Z2gsICgwLCBzaWRlXzEub3Bwb25lbnRPZikoby5zaWRlKSkpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Go44Kt44Oz44Kw546L44KS44Kt44Oj44K544Oq44Oz44Kw44GX44KI44GG44Go44GX44Gm44GE44G+44GZ44GM44CB6YCa6YGO54K544Gu44Oe44K544Gr5pW144Gu6aeS44Gu5Yip44GN44GM44GC44KL44Gu44Gn44Kt44Oj44K544Oq44Oz44Kw44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICB9XHJcbiAgICBpZiAoKDAsIGNhbl9zZWVfMS5kb19hbnlfb2ZfbXlfcGllY2VzX3NlZSkob2xkLmJvYXJkLCBvLnRvLCAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKG8uc2lkZSkpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBqOOCreODs+OCsOeOi+OCkuOCreODo+OCueODquODs+OCsOOBl+OCiOOBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgeenu+WLleWFiOOBruODnuOCueOBq+aVteOBrumnkuOBruWIqeOBjeOBjOOBguOCi+OBruOBp+OCreODo+OCueODquODs+OCsOOBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgY29vcmRzX2JldHdlZW5fa2luZ19hbmRfcm9vayA9ICgwLCBjb29yZGluYXRlXzEuY29sdW1uc0JldHdlZW4pKG8uZnJvbVswXSwgby50b1swXSkubWFwKGNvbCA9PiBbY29sLCBvLmZyb21bMV1dKTtcclxuICAgIGNvbnN0IGhhc19zaG9naV9vcl9jaGVzc19waWVjZSA9IGNvb3Jkc19iZXR3ZWVuX2tpbmdfYW5kX3Jvb2suc29tZShjb29yZCA9PiB7XHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShvbGQuYm9hcmQsIGNvb3JkKTtcclxuICAgICAgICByZXR1cm4gZW50aXR5Py50eXBlID09PSBcIuOBl+OCh1wiIHx8IGVudGl0eT8udHlwZSA9PT0gXCLjgrlcIiB8fCBlbnRpdHk/LnR5cGUgPT09IFwi56KBXCI7XHJcbiAgICB9KTtcclxuICAgIGlmIChoYXNfc2hvZ2lfb3JfY2hlc3NfcGllY2UpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Go44Kt44Oz44Kw546L44KS44Kt44Oj44K544Oq44Oz44Kw44GX44KI44GG44Go44GX44Gm44GE44G+44GZ44GM44CB44Kt44Oz44Kw546L44Go44Or44O844Kv44Gu6ZaT44Gr6aeS44GM44GC44KL44Gu44Gn44Kt44Oj44K544Oq44Oz44Kw44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICB9XHJcbiAgICAvLyDikaQg6ZaT44Gr56KB55+z44GM44GC44KM44Gw5Y+W44KK6Zmk44GNXHJcbiAgICBjb29yZHNfYmV0d2Vlbl9raW5nX2FuZF9yb29rLmZvckVhY2goY29vcmQgPT4gKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgY29vcmQsIG51bGwpKTtcclxuICAgIC8vIOKRpSDjgq3jg7PjgrDnjovjga8gQSDjga7mlrnlkJHjgasgMiDjg57jgrnnp7vli5XjgZdcclxuICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8udG8sIHtcclxuICAgICAgICBwcm9mOiBcIuOCrVwiLFxyXG4gICAgICAgIHNpZGU6IG8uc2lkZSxcclxuICAgICAgICB0eXBlOiBcIueOi1wiLFxyXG4gICAgICAgIGhhc19tb3ZlZF9vbmx5X29uY2U6IGZhbHNlLFxyXG4gICAgICAgIG5ldmVyX21vdmVkOiBmYWxzZSxcclxuICAgIH0pO1xyXG4gICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby5mcm9tLCBudWxsKTtcclxuICAgIC8vIOKRpiBBIOOBr+OCreODs+OCsOeOi+OCkumjm+OBs+i2iuOBl+OBn+mao+OBruODnuOCueOBq+enu+WLleOBmeOCi1xyXG4gICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgY29vcmRfdGhhdF9raW5nX3Bhc3Nlc190aHJvdWdoLCByb29rKTtcclxuICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIHJvb2tfY29vcmQsIG51bGwpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwaGFzZTogXCJwaWVjZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICBib2FyZDogb2xkLmJvYXJkLFxyXG4gICAgICAgIGhhbmRfb2ZfYmxhY2s6IG9sZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgIGJ5X3dob206IG9sZC53aG9fZ29lc19uZXh0XHJcbiAgICB9O1xyXG59XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuYXBwbHlEZWx0YVNlZW5Gcm9tID0gZXhwb3J0cy5pc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3MgPSBleHBvcnRzLmNvb3JkRGlmZlNlZW5Gcm9tID0gZXhwb3J0cy5MZWZ0bW9zdFdoZW5TZWVuRnJvbSA9IGV4cG9ydHMuUmlnaHRtb3N0V2hlblNlZW5Gcm9tID0gZXhwb3J0cy5vcHBvbmVudE9mID0gdm9pZCAwO1xyXG5jb25zdCBjb29yZGluYXRlXzEgPSByZXF1aXJlKFwiLi9jb29yZGluYXRlXCIpO1xyXG5mdW5jdGlvbiBvcHBvbmVudE9mKHNpZGUpIHtcclxuICAgIGlmIChzaWRlID09PSBcIum7klwiKVxyXG4gICAgICAgIHJldHVybiBcIueZvVwiO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBcIum7klwiO1xyXG59XHJcbmV4cG9ydHMub3Bwb25lbnRPZiA9IG9wcG9uZW50T2Y7XHJcbmZ1bmN0aW9uIFJpZ2h0bW9zdFdoZW5TZWVuRnJvbShzaWRlLCBjb29yZHMpIHtcclxuICAgIGlmIChzaWRlID09PSBcIum7klwiKSB7XHJcbiAgICAgICAgcmV0dXJuICgwLCBjb29yZGluYXRlXzEuUmlnaHRtb3N0V2hlblNlZW5Gcm9tQmxhY2spKGNvb3Jkcyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKDAsIGNvb3JkaW5hdGVfMS5MZWZ0bW9zdFdoZW5TZWVuRnJvbUJsYWNrKShjb29yZHMpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuUmlnaHRtb3N0V2hlblNlZW5Gcm9tID0gUmlnaHRtb3N0V2hlblNlZW5Gcm9tO1xyXG5mdW5jdGlvbiBMZWZ0bW9zdFdoZW5TZWVuRnJvbShzaWRlLCBjb29yZHMpIHtcclxuICAgIGlmIChzaWRlID09PSBcIum7klwiKSB7XHJcbiAgICAgICAgcmV0dXJuICgwLCBjb29yZGluYXRlXzEuTGVmdG1vc3RXaGVuU2VlbkZyb21CbGFjaykoY29vcmRzKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAoMCwgY29vcmRpbmF0ZV8xLlJpZ2h0bW9zdFdoZW5TZWVuRnJvbUJsYWNrKShjb29yZHMpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuTGVmdG1vc3RXaGVuU2VlbkZyb20gPSBMZWZ0bW9zdFdoZW5TZWVuRnJvbTtcclxuLyoqIHZlcnRpY2FsIOOBjCArMSA9IOWJjemAsuOAgOOAgGhvcml6b250YWwg44GMICsxID0g5bemXHJcbiAqL1xyXG5mdW5jdGlvbiBjb29yZERpZmZTZWVuRnJvbShzaWRlLCBvKSB7XHJcbiAgICBpZiAoc2lkZSA9PT0gXCLnmb1cIikge1xyXG4gICAgICAgIHJldHVybiAoMCwgY29vcmRpbmF0ZV8xLmNvb3JkRGlmZikobyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCB7IGgsIHYgfSA9ICgwLCBjb29yZGluYXRlXzEuY29vcmREaWZmKShvKTtcclxuICAgICAgICByZXR1cm4geyBoOiAtaCwgdjogLXYgfTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmNvb3JkRGlmZlNlZW5Gcm9tID0gY29vcmREaWZmU2VlbkZyb207XHJcbmZ1bmN0aW9uIGlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cyhuLCBzaWRlLCBjb29yZCkge1xyXG4gICAgY29uc3Qgcm93ID0gY29vcmRbMV07XHJcbiAgICBpZiAoc2lkZSA9PT0gXCLpu5JcIikge1xyXG4gICAgICAgIHJldHVybiBcIuS4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5nVwiLmluZGV4T2Yocm93KSA8IG47XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gXCLkuZ3lhavkuIPlha3kupTlm5vkuInkuozkuIBcIi5pbmRleE9mKHJvdykgPCBuO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzID0gaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzO1xyXG4vLyBzaW5jZSB0aGlzIGZ1bmN0aW9uIGlzIG9ubHkgdXNlZCB0byBpbnRlcnBvbGF0ZSBiZXR3ZWVuIHR3byB2YWxpZCBwb2ludHMsIHRoZXJlIGlzIG5vIG5lZWQgdG8gcGVyZm9ybSBhbmQgb3V0LW9mLWJvdW5kcyBjaGVjay5cclxuZnVuY3Rpb24gYXBwbHlEZWx0YVNlZW5Gcm9tKHNpZGUsIGZyb20sIGRlbHRhKSB7XHJcbiAgICBpZiAoc2lkZSA9PT0gXCLnmb1cIikge1xyXG4gICAgICAgIGNvbnN0IFtmcm9tX2NvbHVtbiwgZnJvbV9yb3ddID0gZnJvbTtcclxuICAgICAgICBjb25zdCBmcm9tX3Jvd19pbmRleCA9IFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZihmcm9tX3Jvdyk7XHJcbiAgICAgICAgY29uc3QgZnJvbV9jb2x1bW5faW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2YoZnJvbV9jb2x1bW4pO1xyXG4gICAgICAgIGNvbnN0IHRvX2NvbHVtbl9pbmRleCA9IGZyb21fY29sdW1uX2luZGV4ICsgZGVsdGEuaDtcclxuICAgICAgICBjb25zdCB0b19yb3dfaW5kZXggPSBmcm9tX3Jvd19pbmRleCArIGRlbHRhLnY7XHJcbiAgICAgICAgY29uc3QgY29sdW1ucyA9IFtcIu+8mVwiLCBcIu+8mFwiLCBcIu+8l1wiLCBcIu+8llwiLCBcIu+8lVwiLCBcIu+8lFwiLCBcIu+8k1wiLCBcIu+8klwiLCBcIu+8kVwiXTtcclxuICAgICAgICBjb25zdCByb3dzID0gW1wi5LiAXCIsIFwi5LqMXCIsIFwi5LiJXCIsIFwi5ZubXCIsIFwi5LqUXCIsIFwi5YWtXCIsIFwi5LiDXCIsIFwi5YWrXCIsIFwi5LmdXCJdO1xyXG4gICAgICAgIHJldHVybiBbY29sdW1uc1t0b19jb2x1bW5faW5kZXhdLCByb3dzW3RvX3Jvd19pbmRleF1dO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgW2Zyb21fY29sdW1uLCBmcm9tX3Jvd10gPSBmcm9tO1xyXG4gICAgICAgIGNvbnN0IGZyb21fcm93X2luZGV4ID0gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIi5pbmRleE9mKGZyb21fcm93KTtcclxuICAgICAgICBjb25zdCBmcm9tX2NvbHVtbl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihmcm9tX2NvbHVtbik7XHJcbiAgICAgICAgY29uc3QgdG9fY29sdW1uX2luZGV4ID0gZnJvbV9jb2x1bW5faW5kZXggLSBkZWx0YS5oO1xyXG4gICAgICAgIGNvbnN0IHRvX3Jvd19pbmRleCA9IGZyb21fcm93X2luZGV4IC0gZGVsdGEudjtcclxuICAgICAgICBjb25zdCBjb2x1bW5zID0gW1wi77yZXCIsIFwi77yYXCIsIFwi77yXXCIsIFwi77yWXCIsIFwi77yVXCIsIFwi77yUXCIsIFwi77yTXCIsIFwi77ySXCIsIFwi77yRXCJdO1xyXG4gICAgICAgIGNvbnN0IHJvd3MgPSBbXCLkuIBcIiwgXCLkuoxcIiwgXCLkuIlcIiwgXCLlm5tcIiwgXCLkupRcIiwgXCLlha1cIiwgXCLkuINcIiwgXCLlhatcIiwgXCLkuZ1cIl07XHJcbiAgICAgICAgcmV0dXJuIFtjb2x1bW5zW3RvX2NvbHVtbl9pbmRleF0sIHJvd3NbdG9fcm93X2luZGV4XV07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5hcHBseURlbHRhU2VlbkZyb20gPSBhcHBseURlbHRhU2VlbkZyb207XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMucmVtb3ZlX3N1cnJvdW5kZWQgPSB2b2lkIDA7XHJcbmZ1bmN0aW9uIHJlbW92ZV9zdXJyb3VuZGVkKGNvbG9yX3RvX2JlX3JlbW92ZWQsIGJvYXJkKSB7XHJcbiAgICBjb25zdCBib2FyZF8gPSBib2FyZC5tYXAocm93ID0+IHJvdy5tYXAoc2lkZSA9PiBzaWRlID09PSBudWxsID8gXCJlbXB0eVwiIDogeyBzaWRlLCB2aXNpdGVkOiBmYWxzZSwgY29ubmVjdGVkX2NvbXBvbmVudF9pbmRleDogLTEgfSkpO1xyXG4gICAgLy8gRGVwdGgtZmlyc3Qgc2VhcmNoIHRvIGFzc2lnbiBhIHVuaXF1ZSBpbmRleCB0byBlYWNoIGNvbm5lY3RlZCBjb21wb25lbnRcclxuICAgIC8vIOWQhOmAo+e1kOaIkOWIhuOBq+S4gOaEj+OBquOCpOODs+ODh+ODg+OCr+OCueOCkuOBteOCi+OBn+OCgeOBrua3seOBleWEquWFiOaOoue0olxyXG4gICAgY29uc3QgZGZzX3N0YWNrID0gW107XHJcbiAgICBjb25zdCBpbmRpY2VzX3RoYXRfc3Vydml2ZSA9IFtdO1xyXG4gICAgbGV0IGluZGV4ID0gMDtcclxuICAgIGZvciAobGV0IEkgPSAwOyBJIDwgYm9hcmRfLmxlbmd0aDsgSSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgSiA9IDA7IEogPCBib2FyZF9bSV0ubGVuZ3RoOyBKKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgc3EgPSBib2FyZF9bSV1bSl07XHJcbiAgICAgICAgICAgIGlmIChzcSAhPT0gXCJlbXB0eVwiICYmIHNxLnNpZGUgPT09IGNvbG9yX3RvX2JlX3JlbW92ZWQgJiYgIXNxLnZpc2l0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGRmc19zdGFjay5wdXNoKHsgaTogSSwgajogSiB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aGlsZSAoZGZzX3N0YWNrLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleF9jb29yZCA9IGRmc19zdGFjay5wb3AoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleCA9IGJvYXJkX1t2ZXJ0ZXhfY29vcmQuaV1bdmVydGV4X2Nvb3JkLmpdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZlcnRleCA9PT0gXCJlbXB0eVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYGRmc19zdGFja2Ag44Gr56m644Gu44Oe44K544Gv44OX44OD44K344Ol44GV44KM44Gm44GE44Gq44GE44Gv44GaXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYW4gZW1wdHkgc3F1YXJlIHNob3VsZCBub3QgYmUgcHVzaGVkIHRvIGBkZnNfc3RhY2tgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2hvdWxkIG5vdCByZWFjaCBoZXJlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmVydGV4LnZpc2l0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4LmNvbm5lY3RlZF9jb21wb25lbnRfaW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICB7IGk6IHZlcnRleF9jb29yZC5pLCBqOiB2ZXJ0ZXhfY29vcmQuaiArIDEgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IGk6IHZlcnRleF9jb29yZC5pLCBqOiB2ZXJ0ZXhfY29vcmQuaiAtIDEgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IGk6IHZlcnRleF9jb29yZC5pICsgMSwgajogdmVydGV4X2Nvb3JkLmogfSxcclxuICAgICAgICAgICAgICAgICAgICB7IGk6IHZlcnRleF9jb29yZC5pIC0gMSwgajogdmVydGV4X2Nvb3JkLmogfSxcclxuICAgICAgICAgICAgICAgIF0uZmlsdGVyKCh7IGksIGogfSkgPT4geyBjb25zdCByb3cgPSBib2FyZF9baV07IHJldHVybiByb3cgJiYgMCA8PSBqICYmIGogPCByb3cubGVuZ3RoOyB9KS5mb3JFYWNoKCh7IGksIGogfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5laWdoYm9yID0gYm9hcmRfW2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZWlnaGJvciA9PT0gXCJlbXB0eVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5leHQgdG8gYW4gZW1wdHkgc3F1YXJlIChhIGxpYmVydHkpOyBzdXJ2aXZlcy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5ZG85ZC454K544GM6Zqj5o6l44GX44Gm44GE44KL44Gu44Gn44CB44GT44GuIGluZGV4IOOBjOaMr+OCieOCjOOBpuOBhOOCi+mAo+e1kOaIkOWIhuOBr+S4uOOAheeUn+OBjeW7tuOBs+OCi1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzX3RoYXRfc3Vydml2ZS5wdXNoKGluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobmVpZ2hib3Iuc2lkZSA9PT0gY29sb3JfdG9fYmVfcmVtb3ZlZCAmJiAhbmVpZ2hib3IudmlzaXRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZnNfc3RhY2sucHVzaCh7IGksIGogfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBpbmRpY2VzX3RoYXRfc3Vydml2ZSDjgavoqJjovInjga7jgarjgYQgaW5kZXgg44Gu44KE44Gk44KJ44KS5YmK6Zmk44GX44GmIGFucyDjgbjjgajou6LoqJhcclxuICAgIC8vIENvcHkgdGhlIGNvbnRlbnQgdG8gYGFuc2Agd2hpbGUgZGVsZXRpbmcgdGhlIGNvbm5lY3RlZCBjb21wb25lbnRzIHdob3NlIGluZGV4IGlzIG5vdCBpbiBgaW5kaWNlc190aGF0X3N1cnZpdmVgXHJcbiAgICBjb25zdCBhbnMgPSBbXTtcclxuICAgIGZvciAobGV0IEkgPSAwOyBJIDwgYm9hcmRfLmxlbmd0aDsgSSsrKSB7XHJcbiAgICAgICAgY29uc3Qgcm93ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgSiA9IDA7IEogPCBib2FyZF9bSV0ubGVuZ3RoOyBKKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgc3EgPSBib2FyZF9bSV1bSl07XHJcbiAgICAgICAgICAgIGlmIChzcSA9PT0gXCJlbXB0eVwiKSB7XHJcbiAgICAgICAgICAgICAgICByb3cucHVzaChudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChzcS5zaWRlID09PSBjb2xvcl90b19iZV9yZW1vdmVkXHJcbiAgICAgICAgICAgICAgICAmJiAhaW5kaWNlc190aGF0X3N1cnZpdmUuaW5jbHVkZXMoc3EuY29ubmVjdGVkX2NvbXBvbmVudF9pbmRleCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRvZXMgbm90IHN1cnZpdmVcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcm93LnB1c2goc3Euc2lkZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYW5zLnB1c2gocm93KTtcclxuICAgIH1cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuZXhwb3J0cy5yZW1vdmVfc3Vycm91bmRlZCA9IHJlbW92ZV9zdXJyb3VuZGVkO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmlzX3Byb21vdGFibGUgPSBleHBvcnRzLmlzVW5wcm9tb3RlZFNob2dpUHJvZmVzc2lvbiA9IGV4cG9ydHMucHJvZmVzc2lvbkZ1bGxOYW1lID0gZXhwb3J0cy51bnByb21vdGUgPSB2b2lkIDA7XHJcbmZ1bmN0aW9uIHVucHJvbW90ZShhKSB7XHJcbiAgICBpZiAoYSA9PT0gXCLmiJDmoYJcIilcclxuICAgICAgICByZXR1cm4gXCLmoYJcIjtcclxuICAgIGlmIChhID09PSBcIuaIkOmKgFwiKVxyXG4gICAgICAgIHJldHVybiBcIumKgFwiO1xyXG4gICAgaWYgKGEgPT09IFwi5oiQ6aaZXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi6aaZXCI7XHJcbiAgICByZXR1cm4gYTtcclxufVxyXG5leHBvcnRzLnVucHJvbW90ZSA9IHVucHJvbW90ZTtcclxuZnVuY3Rpb24gcHJvZmVzc2lvbkZ1bGxOYW1lKGEpIHtcclxuICAgIGlmIChhID09PSBcIuOBqFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44Go44Kv44Kj44O844OzXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIuOCrVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44Kt44Oz44Kw546LXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIuOCr1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44Kv44Kj44O844OzXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIuODilwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44OK44Kk44OIXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIuODk1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44OT44K344On44OD44OXXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIuODnVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44Od44O844Oz5YW1XCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIuODq1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44Or44O844KvXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIui2hVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44K544O844OR44O844Kt44Oz44Kw546LXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIuahglwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi5qGC6aasXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIummmVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi6aaZ6LuKXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIumKgFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi6YqA5bCGXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIumHkVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi6YeR5bCGXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLnByb2Zlc3Npb25GdWxsTmFtZSA9IHByb2Zlc3Npb25GdWxsTmFtZTtcclxuZnVuY3Rpb24gaXNVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uKGEpIHtcclxuICAgIHJldHVybiBhID09PSBcIummmVwiIHx8XHJcbiAgICAgICAgYSA9PT0gXCLmoYJcIiB8fFxyXG4gICAgICAgIGEgPT09IFwi6YqAXCIgfHxcclxuICAgICAgICBhID09PSBcIumHkVwiO1xyXG59XHJcbmV4cG9ydHMuaXNVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uID0gaXNVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uO1xyXG5mdW5jdGlvbiBpc19wcm9tb3RhYmxlKHByb2YpIHtcclxuICAgIHJldHVybiBwcm9mID09PSBcIuahglwiIHx8IHByb2YgPT09IFwi6YqAXCIgfHwgcHJvZiA9PT0gXCLppplcIiB8fCBwcm9mID09PSBcIuOCrVwiIHx8IHByb2YgPT09IFwi44OdXCI7XHJcbn1cclxuZXhwb3J0cy5pc19wcm9tb3RhYmxlID0gaXNfcHJvbW90YWJsZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5wYXJzZSA9IGV4cG9ydHMubXVuY2hfb25lID0gZXhwb3J0cy5wYXJzZV9vbmUgPSBleHBvcnRzLnBhcnNlX3Byb2Zlc3Npb24gPSBleHBvcnRzLnBhcnNlX2Nvb3JkID0gdm9pZCAwO1xyXG5mdW5jdGlvbiBwYXJzZV9jb29yZChzKSB7XHJcbiAgICBjb25zdCBjb2x1bW4gPSAoKGMpID0+IHtcclxuICAgICAgICBpZiAoYyA9PT0gXCLvvJFcIiB8fCBjID09PSBcIjFcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJFcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJJcIiB8fCBjID09PSBcIjJcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJNcIiB8fCBjID09PSBcIjNcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJNcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJRcIiB8fCBjID09PSBcIjRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJVcIiB8fCBjID09PSBcIjVcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJZcIiB8fCBjID09PSBcIjZcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJZcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJdcIiB8fCBjID09PSBcIjdcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJdcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJhcIiB8fCBjID09PSBcIjhcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJhcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJlcIiB8fCBjID09PSBcIjlcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJlcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5qOL6K2c44Gu562L77yI5YiX77yJ44GM44CMJHtjfeOAjeOBp+OBguOCiuOAjO+8keOAnO+8meOAjeOAjDHjgJw544CN44Gu44Gp44KM44Gn44KC44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkoc1swXSk7XHJcbiAgICBjb25zdCByb3cgPSAoKGMpID0+IHtcclxuICAgICAgICBpZiAoYyA9PT0gXCLvvJFcIiB8fCBjID09PSBcIjFcIiB8fCBjID09PSBcIuS4gFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuS4gFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8klwiIHx8IGMgPT09IFwiMlwiIHx8IGMgPT09IFwi5LqMXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwi5LqMXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yTXCIgfHwgYyA9PT0gXCIzXCIgfHwgYyA9PT0gXCLkuIlcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLkuIlcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJRcIiB8fCBjID09PSBcIjRcIiB8fCBjID09PSBcIuWbm1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuWbm1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8lVwiIHx8IGMgPT09IFwiNVwiIHx8IGMgPT09IFwi5LqUXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwi5LqUXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yWXCIgfHwgYyA9PT0gXCI2XCIgfHwgYyA9PT0gXCLlha1cIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLlha1cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJdcIiB8fCBjID09PSBcIjdcIiB8fCBjID09PSBcIuS4g1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuS4g1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8mFwiIHx8IGMgPT09IFwiOFwiIHx8IGMgPT09IFwi5YWrXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwi5YWrXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yZXCIgfHwgYyA9PT0gXCI5XCIgfHwgYyA9PT0gXCLkuZ1cIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLkuZ1cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5qOL6K2c44Gu5q6177yI6KGM77yJ44GM44CMJHtjfeOAjeOBp+OBguOCiuOAjO+8keOAnO+8meOAjeOAjDHjgJw544CN44CM5LiA44Cc5Lmd44CN44Gu44Gp44KM44Gn44KC44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkoc1sxXSk7XHJcbiAgICByZXR1cm4gW2NvbHVtbiwgcm93XTtcclxufVxyXG5leHBvcnRzLnBhcnNlX2Nvb3JkID0gcGFyc2VfY29vcmQ7XHJcbmZ1bmN0aW9uIHBhcnNlX3Byb2Zlc3Npb24ocykge1xyXG4gICAgaWYgKHMgPT09IFwi6aaZXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi6aaZXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuahglwiKVxyXG4gICAgICAgIHJldHVybiBcIuahglwiO1xyXG4gICAgZWxzZSBpZiAocyA9PT0gXCLpioBcIilcclxuICAgICAgICByZXR1cm4gXCLpioBcIjtcclxuICAgIGVsc2UgaWYgKHMgPT09IFwi6YeRXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi6YeRXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuaIkOmmmVwiIHx8IHMgPT09IFwi5p2PXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi5oiQ6aaZXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuaIkOahglwiIHx8IHMgPT09IFwi5ZytXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi5oiQ5qGCXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuaIkOmKgFwiIHx8IHMgPT09IFwi5YWoXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi5oiQ6YqAXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuOCr1wiKVxyXG4gICAgICAgIHJldHVybiBcIuOCr1wiO1xyXG4gICAgZWxzZSBpZiAocyA9PT0gXCLjg6tcIilcclxuICAgICAgICByZXR1cm4gXCLjg6tcIjtcclxuICAgIGVsc2UgaWYgKHMgPT09IFwi44OKXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi44OKXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuODk1wiKVxyXG4gICAgICAgIHJldHVybiBcIuODk1wiO1xyXG4gICAgZWxzZSBpZiAocyA9PT0gXCLjg51cIiB8fCBzID09PSBcIuatqVwiIHx8IHMgPT09IFwi5YW1XCIpXHJcbiAgICAgICAgcmV0dXJuIFwi44OdXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuOBqFwiKVxyXG4gICAgICAgIHJldHVybiBcIuOBqFwiO1xyXG4gICAgZWxzZSBpZiAocyA9PT0gXCLjgq1cIiB8fCBzID09PSBcIueOi1wiKVxyXG4gICAgICAgIHJldHVybiBcIuOCrVwiO1xyXG4gICAgZWxzZSBpZiAocyA9PT0gXCLotoVcIilcclxuICAgICAgICByZXR1cm4gXCLotoVcIjtcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihg6aeS44Gu56iu6aGe44GM44CMJHtzfeOAjeOBp+OBguOCiuOAjOmmmeOAjeOAjOahguOAjeOAjOmKgOOAjeOAjOmHkeOAjeOAjOaIkOmmmeOAjeOAjOaIkOahguOAjeOAjOaIkOmKgOOAjeOAjOadj+OAjeOAjOWcreOAjeOAjOWFqOOAjeOAjOOCr+OAjeOAjOODq+OAjeOAjOODiuOAjeOAjOODk+OAjeOAjOODneOAjeOAjOatqeOAjeOAjOWFteOAjeOAjOOBqOOAjeOAjOOCreOAjeOAjOeOi+OAjeOAjOi2heOAjeOBruOBqeOCjOOBp+OCguOBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMucGFyc2VfcHJvZmVzc2lvbiA9IHBhcnNlX3Byb2Zlc3Npb247XHJcbmZ1bmN0aW9uIHBhcnNlX29uZShzKSB7XHJcbiAgICBjb25zdCB7IG1vdmUsIHJlc3QgfSA9IG11bmNoX29uZShzKTtcclxuICAgIGlmIChyZXN0ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDmiYvjgIwke3N944CN44Gu5pyr5bC+44Gr6Kej6YeI5LiN6IO944Gq44CMJHtyZXN0feOAjeOBjOOBguOCiuOBvuOBmWApO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG1vdmU7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5wYXJzZV9vbmUgPSBwYXJzZV9vbmU7XHJcbmZ1bmN0aW9uIG11bmNoX29uZShzKSB7XHJcbiAgICAvLyAwOiAgIOKWslxyXG4gICAgLy8gMS0yOiDvvJfkupRcclxuICAgIC8vIDM6IOODnVxyXG4gICAgLy8gKDMtNCBpZiBwcm9tb3RlZClcclxuICAgIGxldCBpbmRleCA9IDA7XHJcbiAgICBjb25zdCBzaWRlID0gc1swXSA9PT0gXCLpu5JcIiB8fCBzWzBdID09PSBcIuKWslwiIHx8IHNbMF0gPT09IFwi4piXXCIgPyBcIum7klwiIDpcclxuICAgICAgICBzWzBdID09PSBcIueZvVwiIHx8IHNbMF0gPT09IFwi4pazXCIgfHwgc1swXSA9PT0gXCLimJZcIiA/IFwi55m9XCIgOiAoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYzjgIzpu5LjgI3jgIzilrLjgI3jgIzimJfjgI3jgIznmb3jgI3jgIzilrPjgI3jgIzimJbjgI3jga7jganjgozjgYvjgaflp4vjgb7jgaPjgabjgYTjgb7jgZvjgpNcIik7IH0pKCk7XHJcbiAgICBpbmRleCsrO1xyXG4gICAgY29uc3QgdG8gPSBwYXJzZV9jb29yZChzLnNsaWNlKGluZGV4LCBpbmRleCArIDIpKTtcclxuICAgIGluZGV4ICs9IDI7XHJcbiAgICBjb25zdCBwcm9mZXNzaW9uX2xlbmd0aCA9IHNbM10gPT09IFwi5oiQXCIgPyAyIDogMTtcclxuICAgIGNvbnN0IHByb2YgPSBwYXJzZV9wcm9mZXNzaW9uKHMuc2xpY2UoaW5kZXgsIGluZGV4ICsgcHJvZmVzc2lvbl9sZW5ndGgpKTtcclxuICAgIGluZGV4ICs9IHByb2Zlc3Npb25fbGVuZ3RoO1xyXG4gICAgLy8gQWxsIHRoYXQgZm9sbG93cyBhcmUgb3B0aW9uYWwuXHJcbiAgICAvLyDku6XpmY3jga/jgqrjg5fjgrfjg6fjg4rjg6vjgILjgIwxLiDnp7vli5XlhYPmmI7oqJjjgI3jgIwyLiDmiJDjg7vkuI3miJDjgI3jgIwzLiDnooHnn7Pjga7luqfmqJnjgI3jgYzjgZPjga7poIbnlarjgafnj77jgozjgarjgZHjgozjgbDjgarjgonjgarjgYTjgIJcclxuICAgIC8vIDEuIOenu+WLleWFg+aYjuiomFxyXG4gICAgLy8g44CM5Y+z44CN44CM5bem44CN44CM5omT44CN44CB44G+44Gf44Gv44CM77yINOS6lO+8ieOAjeOBquOBqVxyXG4gICAgY29uc3QgZnJvbSA9ICgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHNbaW5kZXhdID09PSBcIuWPs1wiKSB7XHJcbiAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuWPs1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzW2luZGV4XSA9PT0gXCLlt6ZcIikge1xyXG4gICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICByZXR1cm4gXCLlt6ZcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc1tpbmRleF0gPT09IFwi5omTXCIpIHtcclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgcmV0dXJuIFwi5omTXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNbaW5kZXhdID09PSBcIihcIiB8fCBzW2luZGV4XSA9PT0gXCLvvIhcIikge1xyXG4gICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IHBhcnNlX2Nvb3JkKHMuc2xpY2UoaW5kZXgsIGluZGV4ICsgMikpO1xyXG4gICAgICAgICAgICBpbmRleCArPSAyO1xyXG4gICAgICAgICAgICBpZiAoc1tpbmRleF0gPT09IFwiKVwiIHx8IHNbaW5kZXhdID09PSBcIu+8iVwiKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvb3JkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDplovjgY3jgqvjg4PjgrPjgajluqfmqJnjga7lvozjgavplonjgZjjgqvjg4PjgrPjgYzjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfSkoKTtcclxuICAgIGNvbnN0IHByb21vdGVzID0gKCgpID0+IHtcclxuICAgICAgICBpZiAoc1tpbmRleF0gPT09IFwi5oiQXCIpIHtcclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHMuc2xpY2UoaW5kZXgsIGluZGV4ICsgMikgPT09IFwi5LiN5oiQXCIpIHtcclxuICAgICAgICAgICAgaW5kZXggKz0gMjtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSkoKTtcclxuICAgIGNvbnN0IFtzdG9uZV90bywgcmVzdF0gPSAoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGMgPSBzW2luZGV4XTtcclxuICAgICAgICBpZiAoIWMpXHJcbiAgICAgICAgICAgIHJldHVybiBbbnVsbCwgXCJcIl07XHJcbiAgICAgICAgaWYgKChcIjFcIiA8PSBjICYmIGMgPD0gXCI5XCIpIHx8IChcIu+8kVwiIDw9IGMgJiYgYyA8PSBcIu+8mVwiKSkge1xyXG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IHBhcnNlX2Nvb3JkKHMuc2xpY2UoaW5kZXgsIGluZGV4ICsgMikpO1xyXG4gICAgICAgICAgICBpbmRleCArPSAyO1xyXG4gICAgICAgICAgICBpZiAoIXNbaW5kZXhdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW2Nvb3JkLCBcIlwiXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbY29vcmQsIHMuc2xpY2UoaW5kZXgpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtudWxsLCBzLnNsaWNlKGluZGV4KV07XHJcbiAgICAgICAgfVxyXG4gICAgfSkoKTtcclxuICAgIGNvbnN0IHBpZWNlX3BoYXNlID0gcHJvbW90ZXMgIT09IG51bGwgPyAoZnJvbSA/IHsgc2lkZSwgdG8sIHByb2YsIHByb21vdGVzLCBmcm9tIH0gOiB7IHNpZGUsIHRvLCBwcm9mLCBwcm9tb3RlcyB9KVxyXG4gICAgICAgIDogKGZyb20gPyB7IHNpZGUsIHRvLCBwcm9mLCBmcm9tIH0gOiB7IHNpZGUsIHRvLCBwcm9mIH0pO1xyXG4gICAgY29uc3QgbW92ZSA9IHN0b25lX3RvID8geyBwaWVjZV9waGFzZSwgc3RvbmVfdG8gfSA6IHsgcGllY2VfcGhhc2UgfTtcclxuICAgIHJldHVybiB7IG1vdmUsIHJlc3QgfTtcclxufVxyXG5leHBvcnRzLm11bmNoX29uZSA9IG11bmNoX29uZTtcclxuZnVuY3Rpb24gcGFyc2Uocykge1xyXG4gICAgcyA9IHMucmVwbGFjZSgvKFvpu5LilrLimJfnmb3ilrPimJZdKS9nLCBcIiAkMVwiKTtcclxuICAgIGNvbnN0IG1vdmVzID0gcy5zcGxpdCgvXFxzLyk7XHJcbiAgICByZXR1cm4gbW92ZXMubWFwKHMgPT4gcy50cmltKCkpLmZpbHRlcihzID0+IHMgIT09IFwiXCIpLm1hcChwYXJzZV9vbmUpO1xyXG59XHJcbmV4cG9ydHMucGFyc2UgPSBwYXJzZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5iYWNrd2FyZF9oaXN0b3J5ID0gZXhwb3J0cy5mb3J3YXJkX2hpc3RvcnkgPSBleHBvcnRzLnBhcnNlX2N1cnNvcmVkID0gdm9pZCAwO1xyXG5jb25zdCBzaG9nb3NzX3BhcnNlcl8xID0gcmVxdWlyZShcInNob2dvc3MtcGFyc2VyXCIpO1xyXG5mdW5jdGlvbiBwYXJzZV9jdXJzb3JlZChzKSB7XHJcbiAgICBjb25zdCBhbnMgPSB7IG1haW46IFtdLCB1bmV2YWx1YXRlZDogW10gfTtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgcyA9IHMudHJpbVN0YXJ0KCk7XHJcbiAgICAgICAgaWYgKHMuc3RhcnRzV2l0aChcInt8XCIpKSB7XHJcbiAgICAgICAgICAgIHMgPSBzLnNsaWNlKEJPT0tNQVJLX0xFTkdUSCk7XHJcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBzID0gcy50cmltU3RhcnQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoXCJ9XCIpKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbnM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7IG1vdmUsIHJlc3QgfSA9ICgwLCBzaG9nb3NzX3BhcnNlcl8xLm11bmNoX29uZSkocyk7XHJcbiAgICAgICAgICAgICAgICBzID0gcmVzdDtcclxuICAgICAgICAgICAgICAgIGFucy51bmV2YWx1YXRlZC5wdXNoKG1vdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHMudHJpbVN0YXJ0KCkgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFucztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgeyBtb3ZlLCByZXN0IH0gPSAoMCwgc2hvZ29zc19wYXJzZXJfMS5tdW5jaF9vbmUpKHMpO1xyXG4gICAgICAgIHMgPSByZXN0O1xyXG4gICAgICAgIGFucy5tYWluLnB1c2gobW92ZSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5wYXJzZV9jdXJzb3JlZCA9IHBhcnNlX2N1cnNvcmVkO1xyXG5jb25zdCBCT09LTUFSS19MRU5HVEggPSBcInt8XCIubGVuZ3RoO1xyXG5mdW5jdGlvbiBmb3J3YXJkX2hpc3Rvcnkob3JpZ2luYWxfcykge1xyXG4gICAgbGV0IHMgPSBvcmlnaW5hbF9zO1xyXG4gICAgLy8gbiDmiYvliIbjgpLjg5Hjg7zjgrlcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgcyA9IHMudHJpbVN0YXJ0KCk7XHJcbiAgICAgICAgLy8ge3wg44Gr6YGt6YGH44GX44Gf44KJ44CBXHJcbiAgICAgICAgY29uc3QgdGlsbF9udGggPSBvcmlnaW5hbF9zLnNsaWNlKDAsIG9yaWdpbmFsX3MubGVuZ3RoIC0gcy5sZW5ndGgpO1xyXG4gICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoXCJ7fFwiKSkge1xyXG4gICAgICAgICAgICAvLyB7fCDjgpLoqq3jgb/po5vjgbDjgZfjgIFcclxuICAgICAgICAgICAgcyA9IHMuc2xpY2UoQk9PS01BUktfTEVOR1RIKTtcclxuICAgICAgICAgICAgLy8g44K544Oa44O844K544KS5L+d5YWo44GX44GmXHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0X29mX3NwYWNlID0gb3JpZ2luYWxfcy5sZW5ndGggLSBzLmxlbmd0aDtcclxuICAgICAgICAgICAgcyA9IHMudHJpbVN0YXJ0KCk7XHJcbiAgICAgICAgICAgIC8vICAxIOaJi+WIhuOCkuODkeODvOOCueOAgjEg5omL44KC5q6L44Gj44Gm44Gq44GE44Gq44KJ44CB44Gd44KM44Gv44Gd44KM5Lul5LiKIGZvcndhcmQg44Gn44GN44Gq44GE44Gu44GnIG51bGwg44KS6L+U44GZXHJcbiAgICAgICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoXCJ9XCIpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB7IG1vdmU6IF8sIHJlc3QgfSA9ICgwLCBzaG9nb3NzX3BhcnNlcl8xLm11bmNoX29uZSkocyk7XHJcbiAgICAgICAgICAgIHMgPSByZXN0O1xyXG4gICAgICAgICAgICBjb25zdCBlbmRfb2Zfc3BhY2VfYW5kX21vdmUgPSBvcmlnaW5hbF9zLmxlbmd0aCAtIHMubGVuZ3RoO1xyXG4gICAgICAgICAgICBzID0gcy50cmltU3RhcnQoKTtcclxuICAgICAgICAgICAgY29uc3QgZW5kX29mX3NwYWNlX2FuZF9tb3ZlX2FuZF9zcGFjZSA9IG9yaWdpbmFsX3MubGVuZ3RoIC0gcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHJldHVybiB0aWxsX250aCArIG9yaWdpbmFsX3Muc2xpY2Uoc3RhcnRfb2Zfc3BhY2UsIGVuZF9vZl9zcGFjZV9hbmRfbW92ZSkgKyBvcmlnaW5hbF9zLnNsaWNlKGVuZF9vZl9zcGFjZV9hbmRfbW92ZSwgZW5kX29mX3NwYWNlX2FuZF9tb3ZlX2FuZF9zcGFjZSkgKyBcInt8XCIgKyBvcmlnaW5hbF9zLnNsaWNlKGVuZF9vZl9zcGFjZV9hbmRfbW92ZV9hbmRfc3BhY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzLnRyaW1TdGFydCgpID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyDjgZ3jgozku6XkuIogZm9yd2FyZCDjgafjgY3jgarjgYTjga7jgacgbnVsbCDjgpLov5TjgZlcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgeyBtb3ZlOiBfLCByZXN0IH0gPSAoMCwgc2hvZ29zc19wYXJzZXJfMS5tdW5jaF9vbmUpKHMpO1xyXG4gICAgICAgIHMgPSByZXN0O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZm9yd2FyZF9oaXN0b3J5ID0gZm9yd2FyZF9oaXN0b3J5O1xyXG5mdW5jdGlvbiBiYWNrd2FyZF9oaXN0b3J5KG9yaWdpbmFsX3MpIHtcclxuICAgIGxldCBzID0gb3JpZ2luYWxfcztcclxuICAgIGNvbnN0IGluZGljZXMgPSBbXTtcclxuICAgIC8vIG4g5omL5YiG44KS44OR44O844K5XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIHMgPSBzLnRyaW1TdGFydCgpO1xyXG4gICAgICAgIGluZGljZXMucHVzaChvcmlnaW5hbF9zLmxlbmd0aCAtIHMubGVuZ3RoKTtcclxuICAgICAgICAvLyB7fCDjgavpga3pgYfjgZfjgZ/jgonjgIFcclxuICAgICAgICBpZiAocy5zdGFydHNXaXRoKFwie3xcIikpIHtcclxuICAgICAgICAgICAgY29uc3Qgbm1pbnVzMV9lbmQgPSBpbmRpY2VzW2luZGljZXMubGVuZ3RoIC0gMl07XHJcbiAgICAgICAgICAgIGNvbnN0IG5fZW5kID0gaW5kaWNlc1tpbmRpY2VzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICBpZiAobm1pbnVzMV9lbmQgPT09IHVuZGVmaW5lZCB8fCBuX2VuZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8g44Gd44KM5Lul5LiKIGJhY2t3YXJkIOOBp+OBjeOBquOBhOOBruOBpyBudWxsIOOCkui/lOOBmVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbF9zLnNsaWNlKDAsIG5taW51czFfZW5kKSArIFwie3xcIiArIG9yaWdpbmFsX3Muc2xpY2Uobm1pbnVzMV9lbmQsIG5fZW5kKSArIG9yaWdpbmFsX3Muc2xpY2Uobl9lbmQgKyBCT09LTUFSS19MRU5HVEgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzLnRyaW1TdGFydCgpID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIC8vIOagnuOBjOOBquOBhOOBruOBp+eUn+OChOOBmVxyXG4gICAgICAgICAgICBjb25zdCBubWludXMxX2VuZCA9IGluZGljZXNbaW5kaWNlcy5sZW5ndGggLSAyXTtcclxuICAgICAgICAgICAgY29uc3Qgbl9lbmQgPSBpbmRpY2VzW2luZGljZXMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIGlmIChubWludXMxX2VuZCA9PT0gdW5kZWZpbmVkIHx8IG5fZW5kID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyDjgZ3jgozku6XkuIogYmFja3dhcmQg44Gn44GN44Gq44GE44Gu44GnIG51bGwg44KS6L+U44GZXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsX3Muc2xpY2UoMCwgbm1pbnVzMV9lbmQpICsgXCJ7fFwiICsgb3JpZ2luYWxfcy5zbGljZShubWludXMxX2VuZCwgbl9lbmQpICsgb3JpZ2luYWxfcy5zbGljZShuX2VuZCkgKyBcIn1cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgeyBtb3ZlOiBfLCByZXN0IH0gPSAoMCwgc2hvZ29zc19wYXJzZXJfMS5tdW5jaF9vbmUpKHMpO1xyXG4gICAgICAgIHMgPSByZXN0O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuYmFja3dhcmRfaGlzdG9yeSA9IGJhY2t3YXJkX2hpc3Rvcnk7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBzaG9nb3NzX2NvcmVfMSA9IHJlcXVpcmUoXCJzaG9nb3NzLWNvcmVcIik7XHJcbmNvbnN0IGdhbWV0cmVlXzEgPSByZXF1aXJlKFwiLi9nYW1ldHJlZVwiKTtcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcclxuICAgIHJlbmRlcigoMCwgc2hvZ29zc19jb3JlXzEuZ2V0X2luaXRpYWxfc3RhdGUpKFwi6buSXCIpKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9hZF9oaXN0b3J5XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBsb2FkX2hpc3RvcnkpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3J3YXJkXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmb3J3YXJkKTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFja3dhcmRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGJhY2t3YXJkKTtcclxufSk7XHJcbmZ1bmN0aW9uIGZvcndhcmQoKSB7XHJcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaXN0b3J5XCIpLnZhbHVlO1xyXG4gICAgY29uc3QgbmV3X2hpc3RvcnkgPSAoMCwgZ2FtZXRyZWVfMS5mb3J3YXJkX2hpc3RvcnkpKHRleHQpO1xyXG4gICAgaWYgKG5ld19oaXN0b3J5KSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaXN0b3J5XCIpLnZhbHVlID0gbmV3X2hpc3Rvcnk7XHJcbiAgICAgICAgbG9hZF9oaXN0b3J5KCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gYmFja3dhcmQoKSB7XHJcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaXN0b3J5XCIpLnZhbHVlO1xyXG4gICAgY29uc3QgbmV3X2hpc3RvcnkgPSAoMCwgZ2FtZXRyZWVfMS5iYWNrd2FyZF9oaXN0b3J5KSh0ZXh0KTtcclxuICAgIGlmIChuZXdfaGlzdG9yeSkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGlzdG9yeVwiKS52YWx1ZSA9IG5ld19oaXN0b3J5O1xyXG4gICAgICAgIGxvYWRfaGlzdG9yeSgpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGxvYWRfaGlzdG9yeSgpIHtcclxuICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpc3RvcnlcIikudmFsdWU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcndhcmRcIikuZGlzYWJsZWQgPSAoMCwgZ2FtZXRyZWVfMS5mb3J3YXJkX2hpc3RvcnkpKHRleHQpID09PSBudWxsO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrd2FyZFwiKS5kaXNhYmxlZCA9ICgwLCBnYW1ldHJlZV8xLmJhY2t3YXJkX2hpc3RvcnkpKHRleHQpID09PSBudWxsO1xyXG4gICAgY29uc3QgbW92ZXMgPSAoMCwgZ2FtZXRyZWVfMS5wYXJzZV9jdXJzb3JlZCkodGV4dCk7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gKDAsIHNob2dvc3NfY29yZV8xLm1haW4pKG1vdmVzLm1haW4pO1xyXG4gICAgICAgIGlmIChzdGF0ZS5waGFzZSA9PT0gXCJnYW1lX2VuZFwiKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KGDli53ogIU6ICR7c3RhdGUudmljdG9yfeOAgeeQhueUsTogJHtzdGF0ZS5yZWFzb259YCk7XHJcbiAgICAgICAgICAgIHJlbmRlcihzdGF0ZS5maW5hbF9zaXR1YXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmVuZGVyKHN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgRXJyb3IgJiYgZS5tZXNzYWdlID09PSBcIuaji+itnOOBjOepuuOBp+OBmVwiKSB7XHJcbiAgICAgICAgICAgIC8vIOOBqeOBo+OBoeOBi+OBq+OBl+OBpuOBiuOBkeOBsOOBhOOBhFxyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9ICgwLCBzaG9nb3NzX2NvcmVfMS5nZXRfaW5pdGlhbF9zdGF0ZSkoXCLpu5JcIik7XHJcbiAgICAgICAgICAgIHJlbmRlcihzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBhbGVydChlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZ2V0Q29udGVudEhUTUxGcm9tRW50aXR5KGVudGl0eSkge1xyXG4gICAgaWYgKGVudGl0eS50eXBlID09PSBcIueigVwiKVxyXG4gICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgaWYgKGVudGl0eS50eXBlID09PSBcIuOCuVwiICYmIGVudGl0eS5wcm9mICE9PSBcIuOBqFwiICYmIGVudGl0eS5wcm9mICE9PSBcIuODnVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIGA8c3BhbiBzdHlsZT1cImZvbnQtc2l6ZTogMjAwJVwiPiR7eyDjgq06IFwi4pmUXCIsIOOCrzogXCLimZVcIiwg44OrOiBcIuKZllwiLCDjg5M6IFwi4pmXXCIsIOODijogXCLimZhcIiB9W2VudGl0eS5wcm9mXX08L3NwYW4+YDtcclxuICAgIH1cclxuICAgIHJldHVybiBlbnRpdHkucHJvZjtcclxufVxyXG5mdW5jdGlvbiByZW5kZXIoc2l0dWF0aW9uKSB7XHJcbiAgICBsZXQgYW5zID0gXCJcIjtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgOTsgaSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA5OyBqKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZW50aXR5ID0gc2l0dWF0aW9uLmJvYXJkW2ldW2pdO1xyXG4gICAgICAgICAgICBpZiAoZW50aXR5ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHN0ciA9IGdldENvbnRlbnRIVE1MRnJvbUVudGl0eShlbnRpdHkpO1xyXG4gICAgICAgICAgICBhbnMgKz0gYDxkaXYgY2xhc3M9XCIke2VudGl0eS5zaWRlID09PSBcIueZvVwiID8gXCJ3aGl0ZVwiIDogXCJibGFja1wifVwiIHN0eWxlPVwidG9wOiR7NTAgKyBpICogNTB9cHg7IGxlZnQ6JHsxMDAgKyBqICogNTB9cHg7XCI+JHtzdHJ9PC9kaXY+YDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBzaXR1YXRpb24uaGFuZF9vZl93aGl0ZS5mb3JFYWNoKChwcm9mLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGFucyArPSBgPGRpdiBjbGFzcz1cIndoaXRlXCIgc3R5bGU9XCJ0b3A6JHs1MCArIGluZGV4ICogNTB9cHg7IGxlZnQ6IDQwcHg7XCI+JHtwcm9mfTwvZGl2PmA7XHJcbiAgICB9KTtcclxuICAgIHNpdHVhdGlvbi5oYW5kX29mX2JsYWNrLmZvckVhY2goKHByb2YsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgYW5zICs9IGA8ZGl2IGNsYXNzPVwiYmxhY2tcIiBzdHlsZT1cInRvcDokezQ1MCAtIGluZGV4ICogNTB9cHg7IGxlZnQ6IDU4NnB4O1wiPiR7cHJvZn08L2Rpdj5gO1xyXG4gICAgfSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvYXJkXCIpLmlubmVySFRNTCA9IGFucztcclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=