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
exports.from_custom_state = exports.main = exports.get_initial_state = exports.coordEq = exports.displayCoord = exports.throws_if_unkumalable = exports.throws_if_uncastlable = exports.can_move = exports.can_see = exports.opponentOf = void 0;
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
Object.defineProperty(exports, "throws_if_uncastlable", ({ enumerable: true, get: function () { return piece_phase_2.throws_if_uncastlable; } }));
Object.defineProperty(exports, "throws_if_unkumalable", ({ enumerable: true, get: function () { return piece_phase_2.throws_if_unkumalable; } }));
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
exports.throws_if_uncastlable = exports.can_move = exports.play_piece_phase = exports.throws_if_unkumalable = void 0;
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
function throws_if_unkumalable(board, o) {
    const king = (0, board_1.get_entity_from_coord)(board, o.from);
    if (king?.type === "王") {
        if (king.never_moved) {
            const lance = (0, board_1.get_entity_from_coord)(board, o.to);
            if (!lance) {
                throw new Error(`キング王が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へ動くくまりんぐを${king.side}が試みていますが、${(0, coordinate_1.displayCoord)(o.to)}には駒がありません`);
            }
            else if (lance.type === "碁") {
                throw new Error(`キング王が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へ動くくまりんぐを${king.side}が試みていますが、${(0, coordinate_1.displayCoord)(o.to)}にあるのは香車ではなく碁石です`);
            }
            else if (lance.type !== "しょ" || lance.prof !== "香") {
                throw new Error(`キング王が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へ動くくまりんぐを${king.side}が試みていますが、${(0, coordinate_1.displayCoord)(o.from)}には香車ではない駒があります`);
            }
            if (!lance.can_kumal) {
                throw new Error(`キング王が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へ動くくまりんぐを${king.side}が試みていますが、この香車は打たれた香車なのでくまりんぐの対象外です`);
            }
            else if (lance.side !== king.side) {
                throw new Error(`キング王が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へ動くくまりんぐを${king.side}が試みていますが、この香車は相手の香車なのでくまりんぐの対象外です`);
            }
            return { king, lance };
        }
    }
    throw new Error("くまりんぐではありません");
}
exports.throws_if_unkumalable = throws_if_unkumalable;
function kumaling_or_castling(old, from, to) {
    const king = (0, board_1.get_entity_from_coord)(old.board, from);
    if (king?.type === "王") {
        if (king.never_moved) {
            const { lance } = throws_if_unkumalable(old.board, { from, to });
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
                return kumaling_or_castling(old, possible_points_of_origin[0], o.to);
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
            return kumaling_or_castling(old, from, o.to);
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
function throws_if_uncastlable(board, o) {
    const king = (0, board_1.get_entity_from_coord)(board, o.from);
    if (king?.type === "王") {
        if (king.has_moved_only_once) {
            const diff = (0, side_1.coordDiffSeenFrom)(king.side, o);
            if (diff.v === 0 && (diff.h === 2 || diff.h === -2) &&
                ((king.side === "黒" && o.from[1] === "八") || (king.side === "白" && o.from[1] === "二"))) {
                // これから検査：
                // ② キャスリング対象のルーク（以下A）は一度も動いておらず
                // ③ 相手からの王手（チェック）が掛かっておらず移動先のマスと通過点のマスにも敵の駒の利きはなく
                // ④ キング王とAの間に駒（チェス、将棋）が無い場合に使用できる
                const from_column_index = "９８７６５４３２１".indexOf(o.from[0]);
                const to_column_index = "９８７６５４３２１".indexOf(o.to[0]);
                const rook_coord = [from_column_index < to_column_index ? "１" : "９", o.from[1]];
                const rook = (0, board_1.get_entity_from_coord)(board, rook_coord);
                const coord_that_king_passes_through = ["９８７６５４３２１"[(from_column_index + to_column_index) / 2], o.from[1]];
                if (rook?.type !== "ス" || rook.prof !== "ル") {
                    throw new Error(`${king.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へとキング王をキャスリングしようとしていますが、${(0, coordinate_1.displayCoord)(rook_coord)}にルークがないのでキャスリングできません`);
                }
                if (!rook.never_moved) {
                    throw new Error(`${king.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へとキング王をキャスリングしようとしていますが、${(0, coordinate_1.displayCoord)(rook_coord)}にあるルークは既に動いたことがあるルークなのでキャスリングできません`);
                }
                if ((0, can_see_1.do_any_of_my_pieces_see)(board, o.from, (0, side_1.opponentOf)(king.side))) {
                    throw new Error(`${king.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へとキング王をキャスリングしようとしていますが、相手からの王手（チェック）が掛かっているのでキャスリングできません`);
                }
                if ((0, can_see_1.do_any_of_my_pieces_see)(board, coord_that_king_passes_through, (0, side_1.opponentOf)(king.side))) {
                    throw new Error(`${king.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へとキング王をキャスリングしようとしていますが、通過点のマスに敵の駒の利きがあるのでキャスリングできません`);
                }
                if ((0, can_see_1.do_any_of_my_pieces_see)(board, o.to, (0, side_1.opponentOf)(king.side))) {
                    throw new Error(`${king.side}が${(0, coordinate_1.displayCoord)(o.from)}から${(0, coordinate_1.displayCoord)(o.to)}へとキング王をキャスリングしようとしていますが、移動先のマスに敵の駒の利きがあるのでキャスリングできません`);
                }
                return { coord_that_king_passes_through, rook, rook_coord, king };
            }
        }
    }
    throw new Error(`キャスリングではありません`);
}
exports.throws_if_uncastlable = throws_if_uncastlable;
function castling(old, o) {
    // 検査済：
    // ① キング王が1回だけ前進した状態で
    //-----------------------------------
    // これから検査：
    // ② キャスリング対象のルーク（以下A）は一度も動いておらず
    // ③ 相手からの王手（チェック）が掛かっておらず移動先のマスと通過点のマスにも敵の駒の利きはなく
    // ④ キング王とAの間に駒（チェス、将棋）が無い場合に使用できる
    const { coord_that_king_passes_through, rook_coord, rook } = throws_if_uncastlable(old.board, o);
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
exports.backward_history = exports.take_until_first_cursor = exports.forward_history = exports.parse_cursored = void 0;
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
function take_until_first_cursor(original_s) {
    let s = original_s;
    const indices = [];
    // n 手分をパース
    while (true) {
        s = s.trimStart();
        indices.push(original_s.length - s.length);
        // {| に遭遇したら、
        if (s.startsWith("{|")) {
            // {| 以降を雑に削る
            return original_s.slice(0, original_s.length - s.length);
        }
        else if (s.trimStart() === "") {
            return original_s;
        }
        const { move: _, rest } = (0, shogoss_parser_1.munch_one)(s);
        s = rest;
    }
}
exports.take_until_first_cursor = take_until_first_cursor;
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
    document.getElementById("hanzi_black_white").addEventListener("click", load_history);
});
function forward() {
    GUI_state.selected = null;
    const text = document.getElementById("history").value;
    const new_history = (0, gametree_1.forward_history)(text);
    if (new_history) {
        document.getElementById("history").value = new_history;
        load_history();
    }
}
function backward() {
    GUI_state.selected = null;
    const text = document.getElementById("history").value;
    const new_history = (0, gametree_1.backward_history)(text);
    if (new_history) {
        document.getElementById("history").value = new_history;
        load_history();
    }
}
function main_(moves) {
    try {
        return (0, shogoss_core_1.main)(moves);
    }
    catch (e) {
        if (e instanceof Error && e.message === "棋譜が空です") {
            // どっちかにしておけばいい
            return (0, shogoss_core_1.get_initial_state)("黒");
        }
        else {
            throw e;
        }
    }
}
function load_history() {
    GUI_state.selected = null;
    const text = document.getElementById("history").value;
    document.getElementById("forward").disabled = (0, gametree_1.forward_history)(text) === null;
    document.getElementById("backward").disabled = (0, gametree_1.backward_history)(text) === null;
    const moves = (0, gametree_1.parse_cursored)(text);
    try {
        const state = main_(moves.main);
        const previous_state = main_(moves.main.slice(0, -1));
        if (previous_state.phase === "game_end") {
            throw new Error("should not happen");
        }
        if (state.phase === "game_end") {
            alert(`勝者: ${state.victor}、理由: ${state.reason}`);
            render(state.final_situation, previous_state);
        }
        else {
            render(state, previous_state);
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
function same_entity(e1, e2) {
    if (!e2)
        return false;
    if (e1.side !== e2.side)
        return false;
    if (e1.type === "碁") {
        return e1.type === e2.type;
    }
    if (e2.type === "碁") {
        return false;
    }
    return e1.prof === e2.prof;
}
const GUI_state = {
    situation: (0, shogoss_core_1.get_initial_state)("黒"),
    selected: null,
};
function select_piece_on_board(coord) {
    GUI_state.selected = { type: "piece_on_board", coord };
    render(GUI_state.situation);
}
// previous_situation との差分には newly や newly_vacated といった CSS クラスをつけて描写
// ただし、GUI_state.selected がある場合には、差分ではなくて選んだ駒について知りたいはずなので、newly の描写を抑制する
function render(situation, previous_situation) {
    if (document.getElementById("hanzi_black_white").checked) {
        document.getElementById("history").value =
            document.getElementById("history").value.replace(/[黒▲☗]/g, "黒").replace(/[白△☖]/g, "白");
    }
    else {
        document.getElementById("history").value =
            document.getElementById("history").value.replace(/[黒▲☗]/g, "▲").replace(/[白△☖]/g, "△");
    }
    GUI_state.situation = situation;
    const board_dom = document.getElementById("board");
    board_dom.innerHTML = "";
    const ans = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const entity = situation.board[row][col];
            if (entity == null) {
                if (previous_situation?.board[row][col] && !GUI_state.selected) {
                    const newly_vacated = document.createElement("div");
                    newly_vacated.classList.add("newly_vacated");
                    newly_vacated.style.cssText = `top:${50 + row * 50}px; left:${100 + col * 50}px;`;
                    ans.push(newly_vacated);
                }
                continue;
            }
            const row_ = toShogiRowName(row);
            const col_ = toShogiColumnName(col);
            const is_newly_updated = previous_situation && !GUI_state.selected ? !same_entity(entity, previous_situation.board[row][col]) : false;
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
            piece_or_stone.addEventListener("click", () => select_piece_on_board([col_, row_]));
            ans.push(piece_or_stone);
        }
    }
    if (GUI_state.selected?.type === "piece_on_board") {
        const entity_that_moves = get_entity_from_coord(situation.board, GUI_state.selected.coord);
        if (entity_that_moves.type === "碁") {
            throw new Error("碁石が動くはずがない");
        }
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const row_ = toShogiRowName(row);
                const col_ = toShogiColumnName(col);
                const to = [col_, row_];
                const o = { to, from: GUI_state.selected.coord };
                const is_castlable = (() => {
                    try {
                        (0, shogoss_core_1.throws_if_uncastlable)(situation.board, o);
                        return true;
                    }
                    catch (e) {
                        return false;
                    }
                })();
                const is_kumalable = (() => {
                    try {
                        (0, shogoss_core_1.throws_if_unkumalable)(situation.board, o);
                        return true;
                    }
                    catch (e) {
                        return false;
                    }
                })();
                if ((0, shogoss_core_1.can_move)(situation.board, o) || is_castlable || is_kumalable) {
                    const possible_destination = document.createElement("div");
                    possible_destination.classList.add("possible_destination");
                    possible_destination.style.cssText = `top:${50 + row * 50}px; left:${100 + col * 50}px;`;
                    possible_destination.addEventListener("click", () => { play_piece_phase(to, entity_that_moves); });
                    ans.push(possible_destination);
                }
            }
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
function get_entity_from_coord(board, coord) {
    const [column, row] = coord;
    const row_index = "一二三四五六七八九".indexOf(row);
    const column_index = "９８７６５４３２１".indexOf(column);
    if (row_index === -1 || column_index === -1) {
        throw new Error(`不正な座標です`);
    }
    return (board[row_index]?.[column_index]) ?? null;
}
function play_piece_phase(to, entity_that_moves) {
    if (GUI_state.selected?.type !== "piece_on_board")
        throw new Error("play_piece_phase played without piece_on_board specified");
    let text = document.getElementById("history").value;
    const moves = (0, gametree_1.parse_cursored)(text);
    if (moves.unevaluated.length > 0) {
        if (!confirm("以降の局面が破棄されます。よろしいですか？（将来的には、局面を破棄せず分岐する機能を足したいと思っています）")) {
            GUI_state.selected = null;
            render(GUI_state.situation);
            return;
        }
        text = (0, gametree_1.take_until_first_cursor)(text);
    }
    const from = GUI_state.selected.coord;
    const full_notation = `${entity_that_moves.side === "黒" ? "▲" : "△"}${to[0]}${to[1]}${entity_that_moves.prof}(${from[0]}${from[1]})`;
    // 無理な手を指した時に落とす
    try {
        main_((0, gametree_1.parse_cursored)(text + full_notation).main);
    }
    catch (e) {
        alert(e);
        GUI_state.selected = null;
        render(GUI_state.situation);
        return;
    }
    const loose_notation = `${entity_that_moves.side === "黒" ? "▲" : "△"}${to[0]}${to[1]}${entity_that_moves.prof}`;
    function append_and_load(notation) {
        text = text.trimEnd();
        text += (text ? "　" : "") + notation;
        document.getElementById("history").value = text;
        load_history();
        return;
    }
    // 曖昧性が出ないときには from を書かずに通す
    try {
        main_((0, gametree_1.parse_cursored)(text + loose_notation).main);
    }
    catch (e) {
        // 曖昧性が出た
        append_and_load(full_notation);
        return;
    }
    // 曖昧性が無いので from を書かずに通す
    // ただし、ここで「二ポの可能性は無視して曖昧性を考える」という仕様が牙をむく
    if (entity_that_moves.prof !== "ポ") {
        append_and_load(loose_notation);
        return;
    }
    else {
        const loose = main_((0, gametree_1.parse_cursored)(text + loose_notation).main);
        const full = main_((0, gametree_1.parse_cursored)(text + full_notation).main);
        // loose で解釈すると二ポが回避できるが、full で解釈すると二ポであってゲームが終了するとき
        // これは「二ポです」を知らせるために始点明記が必要
        if (loose.phase === "resolved" && full.phase === "game_end") {
            append_and_load(full_notation);
            return;
        }
        else if (loose.phase === "resolved" && full.phase === "resolved") {
            // 移動したポーンが即座に碁で取られて二ポが解消するパターンの場合には、「直進」との競合が発生することはない
            // したがって、この場合は直進を採用して問題ないはず
            append_and_load(loose_notation);
            return;
        }
        else {
            // もうよくわかんないから full notation で書いておきます
            append_and_load(full_notation);
        }
    }
}
function toShogiRowName(n) {
    return "一二三四五六七八九"[n];
}
function toShogiColumnName(n) {
    return "９８７６５４３２１"[n];
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFNLEVBQUUsTUFBTSxFQUFFLHVCQUF1QixHQUFHLFFBQVEsRUFBRSxRQUFRO0FBQ3RJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLDJDQUEyQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsdUJBQXVCO0FBQ2xIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Nob2dvc3MtY29yZS9kaXN0L2FmdGVyX3N0b25lX3BoYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC9ib2FyZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvY2FuX3NlZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvY29vcmRpbmF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Nob2dvc3MtY29yZS9kaXN0L3BpZWNlX3BoYXNlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC9zaWRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC9zdXJyb3VuZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvdHlwZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1wYXJzZXIvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZXRyZWUudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnJlc29sdmVfYWZ0ZXJfc3RvbmVfcGhhc2UgPSB2b2lkIDA7XHJcbmNvbnN0IGJvYXJkXzEgPSByZXF1aXJlKFwiLi9ib2FyZFwiKTtcclxuY29uc3Qgc2lkZV8xID0gcmVxdWlyZShcIi4vc2lkZVwiKTtcclxuY29uc3Qgc3Vycm91bmRfMSA9IHJlcXVpcmUoXCIuL3N1cnJvdW5kXCIpO1xyXG5jb25zdCB0eXBlXzEgPSByZXF1aXJlKFwiLi90eXBlXCIpO1xyXG4vKiog55+z44OV44Kn44Kk44K644GM57WC5LqG44GX44Gf5b6M44CB5Yud5pWX5Yik5a6a44Go5Zuy56KB5qSc5p+744KS44GZ44KL44CCIC8gVG8gYmUgY2FsbGVkIGFmdGVyIGEgc3RvbmUgaXMgcGxhY2VkOiBjaGVja3MgdGhlIHZpY3RvcnkgY29uZGl0aW9uIGFuZCB0aGUgZ2FtZS1vZi1nbyBjb25kaXRpb24uXHJcbiAqIOOBvuOBn+OAgeebuOaJi+OBruODneWFteOBq+OCouODs+ODkeODg+OCteODs+ODleODqeOCsOOBjOOBpOOBhOOBpuOBhOOBn+OCieOAgeOBneOCjOOCkuWPluOCiumZpOOBj++8iOiHquWIhuOBjOaJi+OCkuaMh+OBl+OBn+OBk+OBqOOBq+OCiOOBo+OBpuOAgeOCouODs+ODkeODg+OCteODs+OBruaoqeWIqeOBjOWkseOCj+OCjOOBn+OBruOBp++8iVxyXG4gKiBBbHNvLCBpZiB0aGUgb3Bwb25lbnQncyBwYXduIGhhcyBhbiBlbiBwYXNzYW50IGZsYWcsIGRlbGV0ZSBpdCAoc2luY2UsIGJ5IHBsYXlpbmcgYSBwaWVjZSB1bnJlbGF0ZWQgdG8gZW4gcGFzc2FudCwgeW91IGhhdmUgbG9zdCB0aGUgcmlnaHQgdG8gY2FwdHVyZSBieSBlbiBwYXNzYW50KVxyXG4gKlxyXG4gKiAxLiDoh6rliIbjga7pp5Ljgajnn7PjgavjgojjgaPjgablm7Ljgb7jgozjgabjgYTjgovnm7jmiYvjga7pp5Ljgajnn7PjgpLjgZnjgbnjgablj5bjgorpmaTjgY9cclxuICogMi4g55u45omL44Gu6aeS44Go55+z44Gr44KI44Gj44Gm5Zuy44G+44KM44Gm44GE44KL6Ieq5YiG44Gu6aeS44Go55+z44KS44GZ44G544Gm5Y+W44KK6Zmk44GPXHJcbiAqIDMuIOS6jOODneOBjOeZuueUn+OBl+OBpuOBhOOCi+OBi+ODu+OCreODs+OCsOeOi+OBjOebpOmdouOBi+OCiemZpOOBi+OCjOOBpuOBhOOCi+OBi+OCkuWIpOWumuOAglxyXG4gKiAgIDMtMS4g5Lih44Kt44Oz44Kw546L44GM6Zmk44GL44KM44Gm44GE44Gf44KJ44CB44Kr44Op44OG44K444Oj44Oz44Kx44Oz44Oc44Kv44K344Oz44KwXHJcbiAqICAgMy0yLiDoh6rliIbjga7njovjgaDjgZHpmaTjgYvjgozjgabjgYTjgZ/jgonjgIHjgZ3jgozjga/jgIznjovjga7oh6rmrrrjgavjgojjgovmlZfljJfjgI1cclxuICogICAzLTMuIOebuOaJi+OBrueOi+OBoOOBkemZpOOBi+OCjOOBpuOBhOOCi+WgtOWQiOOAgVxyXG4gKiAgICAgICAzLTMtMS4g5LqM44Od44GM55m655Sf44GX44Gm44GE44Gq44GR44KM44Gw44CB44Gd44KM44Gv44CM546L44Gu5o6S6Zmk44Gr44KI44KL5Yud5Yip44CNXHJcbiAqICAgICAgICAgICAgIDMtMy0xLTEuIOebuOaJi+OBrueOi+OCkuWPluOCiumZpOOBhOOBn+OBruOBjOOCueODhuODg+ODlyAxLiDjgafjgYLjgorjgIFcclxuICogICAgICAgICAgICAgICAgICAgICAg44GX44GL44KC44CM44GU44Gj44Gd44KK44CN77yIQHJlX2hha29fbW9vbuabsOOBj+OAgTLlgIvjgYsz5YCL77yJXHJcbiAqICAgICAgICAgICAgICAgICAgICAgIOOBq+ipsuW9k+OBmeOCi+OBqOOBjeOBq+OBr+OAjOOCt+ODp+OCtOOCue+8geOAjeOBrueZuuWjsFxyXG4gKiAgICAgICAzLTMtMi4g5LqM44Od44GM55m655Sf44GX44Gm44GE44KL44Gq44KJ44CB44Kr44Op44OG44K444Oj44Oz44Kx44Oz44Oc44Kv44K344Oz44KwXHJcbiAqICAgMy00LiDjganjgaHjgonjga7njovjgoLpmaTjgYvjgozjgabjgYTjgarjgYTloLTlkIjjgIFcclxuICogICAgICAgMy00LTEuIOS6jOODneOBjOeZuueUn+OBl+OBpuOBhOOBquOBkeOCjOOBsOOAgeOCsuODvOODoOe2muihjFxyXG4gKiAgICAgICAzLTQtMi4g5LqM44Od44GM55m655Sf44GX44Gm44GE44KL44Gq44KJ44CB44Gd44KM44Gv44CM5LqM44Od44Gr44KI44KL5pWX5YyX44CNXHJcbiAqXHJcbiAqIDEg4oaSIDIg44Gu6aCG55Wq44Gn44GC44KL5qC55oug77ya44Kz44Oz44OT44ON44O844K344On44Oz44Ki44K/44OD44Kv44Gu5a2Y5ZyoXHJcbiAqIDIg4oaSIDMg44Gu6aCG55Wq44Gn44GC44KL5qC55oug77ya5YWs5byP44Or44O844Or6L+96KiYXHJcbiAqIOOAjOefs+ODleOCp+OCpOOCuuOCkuedgOaJi+OBl+OBn+e1kOaenOOBqOOBl+OBpuiHquWIhuOBruODneODvOODs+WFteOBjOebpOS4iuOBi+OCiea2iOOBiOS6jOODneOBjOino+axuuOBleOCjOOCi+WgtOWQiOOCguOAgeWPjeWJh+OCkuOBqOOCieOBmumAsuihjOOBp+OBjeOCi+OAguOAjVxyXG4gKlxyXG4gKiAxLiBSZW1vdmUgYWxsIHRoZSBvcHBvbmVudCdzIHBpZWNlcyBhbmQgc3RvbmVzIHN1cnJvdW5kZWQgYnkgeW91ciBwaWVjZXMgYW5kIHN0b25lc1xyXG4gKiAyLiBSZW1vdmUgYWxsIHlvdXIgcGllY2VzIGFuZCBzdG9uZXMgc3Vycm91bmRlZCBieSB0aGUgb3Bwb25lbnQncyBwaWVjZXMgYW5kIHN0b25lc1xyXG4gKiAzLiBDaGVja3Mgd2hldGhlciB0d28gcGF3bnMgb2NjdXB5IHRoZSBzYW1lIGNvbHVtbiwgYW5kIGNoZWNrcyB3aGV0aGVyIGEga2luZyBpcyByZW1vdmVkIGZyb20gdGhlIGJvYXJkLlxyXG4gKiAgIDMtMS4gSWYgYm90aCBraW5ncyBhcmUgcmVtb3ZlZCwgdGhhdCBpcyBhIGRyYXcsIGFuZCB0aGVyZWZvcmUgYSBLYXJhdGUgUm9jay1QYXBlci1TY2lzc29ycyBCb3hpbmcuXHJcbiAqICAgMy0yLiBJZiB5b3VyIGtpbmcgaXMgcmVtb3ZlZCBidXQgdGhlIG9wcG9uZW50J3MgcmVtYWlucywgdGhlbiBpdCdzIGEgbG9zcyBieSBraW5nJ3Mgc3VpY2lkZS5cclxuICogICAzLTMuIElmIHRoZSBvcHBvbmVudCdzIGtpbmcgaXMgcmVtb3ZlZCBidXQgeW91cnMgcmVtYWlucyxcclxuICogICAgICAgIDMtMy0xLiBJZiBubyB0d28gcGF3bnMgb2NjdXB5IHRoZSBzYW1lIGNvbHVtbiwgdGhlbiBpdCdzIGEgdmljdG9yeVxyXG4gKiAgICAgICAgICAgICAzLTMtMS0xLiBJZiB0aGUgc3RlcCB0aGF0IHJlbW92ZWQgdGhlIG9wcG9uZW50J3Mga2luZyB3YXMgc3RlcCAxLFxyXG4gKiAgICAgICAgICAgICAgICAgICAgICBhbmQgd2hlbiBhIGxhcmdlIG51bWJlciAoPj0gMiBvciAzLCBhY2NvcmRpbmcgdG8gQHJlX2hha29fbW9vbilcclxuICogICAgICAgICAgICAgICAgICAgICAgb2YgcGllY2VzL3N0b25lcyBhcmUgcmVtb3ZlZCwgdGhlbiBcIlNob0dvU3MhXCIgc2hvdWxkIGJlIHNob3V0ZWRcclxuICpcclxuICogVGhlIG9yZGVyaW5nIDEg4oaSIDIgaXMgbmVlZGVkIHRvIHN1cHBvcnQgdGhlIGNvbWJpbmF0aW9uIGF0dGFjay5cclxuICogVGhlIG9yZGVyaW5nIDIg4oaSIDMgaXMgZXhwbGljaXRseSBtZW50aW9uZWQgYnkgdGhlIGFkZGVuZHVtIHRvIHRoZSBvZmZpY2lhbCBydWxlOlxyXG4gKiAgICAgICAgIOOAjOefs+ODleOCp+OCpOOCuuOCkuedgOaJi+OBl+OBn+e1kOaenOOBqOOBl+OBpuiHquWIhuOBruODneODvOODs+WFteOBjOebpOS4iuOBi+OCiea2iOOBiOS6jOODneOBjOino+axuuOBleOCjOOCi+WgtOWQiOOCguOAgeWPjeWJh+OCkuOBqOOCieOBmumAsuihjOOBp+OBjeOCi+OAguOAjVxyXG4gKiovXHJcbmZ1bmN0aW9uIHJlc29sdmVfYWZ0ZXJfc3RvbmVfcGhhc2UocGxheWVkKSB7XHJcbiAgICByZW1vdmVfc3Vycm91bmRlZF9lbml0aXRpZXNfZnJvbV9ib2FyZF9hbmRfYWRkX3RvX2hhbmRfaWZfbmVjZXNzYXJ5KHBsYXllZCwgKDAsIHNpZGVfMS5vcHBvbmVudE9mKShwbGF5ZWQuYnlfd2hvbSkpO1xyXG4gICAgcmVtb3ZlX3N1cnJvdW5kZWRfZW5pdGl0aWVzX2Zyb21fYm9hcmRfYW5kX2FkZF90b19oYW5kX2lmX25lY2Vzc2FyeShwbGF5ZWQsIHBsYXllZC5ieV93aG9tKTtcclxuICAgIHJlbm91bmNlX2VuX3Bhc3NhbnQocGxheWVkLmJvYXJkLCBwbGF5ZWQuYnlfd2hvbSk7XHJcbiAgICBjb25zdCBkb3VibGVkX3Bhd25zX2V4aXN0ID0gZG9lc19kb3VibGVkX3Bhd25zX2V4aXN0KHBsYXllZC5ib2FyZCwgcGxheWVkLmJ5X3dob20pO1xyXG4gICAgY29uc3QgaXNfeW91cl9raW5nX2FsaXZlID0ga2luZ19pc19hbGl2ZShwbGF5ZWQuYm9hcmQsIHBsYXllZC5ieV93aG9tKTtcclxuICAgIGNvbnN0IGlzX29wcG9uZW50c19raW5nX2FsaXZlID0ga2luZ19pc19hbGl2ZShwbGF5ZWQuYm9hcmQsICgwLCBzaWRlXzEub3Bwb25lbnRPZikocGxheWVkLmJ5X3dob20pKTtcclxuICAgIGNvbnN0IHNpdHVhdGlvbiA9IHtcclxuICAgICAgICBib2FyZDogcGxheWVkLmJvYXJkLFxyXG4gICAgICAgIGhhbmRfb2ZfYmxhY2s6IHBsYXllZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgIGhhbmRfb2Zfd2hpdGU6IHBsYXllZC5oYW5kX29mX3doaXRlLFxyXG4gICAgfTtcclxuICAgIGlmICghaXNfeW91cl9raW5nX2FsaXZlKSB7XHJcbiAgICAgICAgaWYgKCFpc19vcHBvbmVudHNfa2luZ19hbGl2ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyBwaGFzZTogXCJnYW1lX2VuZFwiLCByZWFzb246IFwiYm90aF9raW5nX2RlYWRcIiwgdmljdG9yOiBcIkthcmF0ZUphbmtlbkJveGluZ1wiLCBmaW5hbF9zaXR1YXRpb246IHNpdHVhdGlvbiB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgcGhhc2U6IFwiZ2FtZV9lbmRcIiwgcmVhc29uOiBcImtpbmdfc3VpY2lkZVwiLCB2aWN0b3I6ICgwLCBzaWRlXzEub3Bwb25lbnRPZikocGxheWVkLmJ5X3dob20pLCBmaW5hbF9zaXR1YXRpb246IHNpdHVhdGlvbiB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICghaXNfb3Bwb25lbnRzX2tpbmdfYWxpdmUpIHtcclxuICAgICAgICAgICAgaWYgKCFkb3VibGVkX3Bhd25zX2V4aXN0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBwaGFzZTogXCJnYW1lX2VuZFwiLCByZWFzb246IFwia2luZ19jYXB0dXJlXCIsIHZpY3RvcjogcGxheWVkLmJ5X3dob20sIGZpbmFsX3NpdHVhdGlvbjogc2l0dWF0aW9uIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBwaGFzZTogXCJnYW1lX2VuZFwiLCByZWFzb246IFwia2luZ19jYXB0dXJlX2FuZF9kb3VibGVkX3Bhd25zXCIsIHZpY3RvcjogXCJLYXJhdGVKYW5rZW5Cb3hpbmdcIiwgZmluYWxfc2l0dWF0aW9uOiBzaXR1YXRpb24gfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKCFkb3VibGVkX3Bhd25zX2V4aXN0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBoYXNlOiBcInJlc29sdmVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYm9hcmQ6IHBsYXllZC5ib2FyZCxcclxuICAgICAgICAgICAgICAgICAgICBoYW5kX29mX2JsYWNrOiBwbGF5ZWQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICAgICAgICAgICAgICBoYW5kX29mX3doaXRlOiBwbGF5ZWQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICAgICAgICAgICAgICB3aG9fZ29lc19uZXh0OiAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKHBsYXllZC5ieV93aG9tKVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IHBoYXNlOiBcImdhbWVfZW5kXCIsIHJlYXNvbjogXCJkb3VibGVkX3Bhd25zXCIsIHZpY3RvcjogKDAsIHNpZGVfMS5vcHBvbmVudE9mKShwbGF5ZWQuYnlfd2hvbSksIGZpbmFsX3NpdHVhdGlvbjogc2l0dWF0aW9uIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5yZXNvbHZlX2FmdGVyX3N0b25lX3BoYXNlID0gcmVzb2x2ZV9hZnRlcl9zdG9uZV9waGFzZTtcclxuZnVuY3Rpb24gcmVub3VuY2VfZW5fcGFzc2FudChib2FyZCwgYnlfd2hvbSkge1xyXG4gICAgY29uc3Qgb3Bwb25lbnRfcGF3bl9jb29yZHMgPSAoMCwgYm9hcmRfMS5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZikoYm9hcmQsICgwLCBzaWRlXzEub3Bwb25lbnRPZikoYnlfd2hvbSksIFwi44OdXCIpO1xyXG4gICAgZm9yIChjb25zdCBjb29yZCBvZiBvcHBvbmVudF9wYXduX2Nvb3Jkcykge1xyXG4gICAgICAgICgwLCBib2FyZF8xLmRlbGV0ZV9lbl9wYXNzYW50X2ZsYWcpKGJvYXJkLCBjb29yZCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaGFzX2R1cGxpY2F0ZXMoYXJyYXkpIHtcclxuICAgIHJldHVybiBuZXcgU2V0KGFycmF5KS5zaXplICE9PSBhcnJheS5sZW5ndGg7XHJcbn1cclxuZnVuY3Rpb24gZG9lc19kb3VibGVkX3Bhd25zX2V4aXN0KGJvYXJkLCBzaWRlKSB7XHJcbiAgICBjb25zdCBjb29yZHMgPSAoMCwgYm9hcmRfMS5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZikoYm9hcmQsIHNpZGUsIFwi44OdXCIpO1xyXG4gICAgY29uc3QgY29sdW1ucyA9IGNvb3Jkcy5tYXAoKFtjb2wsIF9yb3ddKSA9PiBjb2wpO1xyXG4gICAgcmV0dXJuIGhhc19kdXBsaWNhdGVzKGNvbHVtbnMpO1xyXG59XHJcbmZ1bmN0aW9uIGtpbmdfaXNfYWxpdmUoYm9hcmQsIHNpZGUpIHtcclxuICAgIHJldHVybiAoMCwgYm9hcmRfMS5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZikoYm9hcmQsIHNpZGUsIFwi44KtXCIpLmxlbmd0aCArICgwLCBib2FyZF8xLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mKShib2FyZCwgc2lkZSwgXCLotoVcIikubGVuZ3RoID4gMDtcclxufVxyXG5mdW5jdGlvbiByZW1vdmVfc3Vycm91bmRlZF9lbml0aXRpZXNfZnJvbV9ib2FyZF9hbmRfYWRkX3RvX2hhbmRfaWZfbmVjZXNzYXJ5KG9sZCwgc2lkZSkge1xyXG4gICAgY29uc3QgYmxhY2tfYW5kX3doaXRlID0gb2xkLmJvYXJkLm1hcChyb3cgPT4gcm93Lm1hcChzcSA9PiBzcSA9PT0gbnVsbCA/IG51bGwgOiBzcS5zaWRlKSk7XHJcbiAgICBjb25zdCBoYXNfc3Vydml2ZWQgPSAoMCwgc3Vycm91bmRfMS5yZW1vdmVfc3Vycm91bmRlZCkoc2lkZSwgYmxhY2tfYW5kX3doaXRlKTtcclxuICAgIG9sZC5ib2FyZC5mb3JFYWNoKChyb3csIGkpID0+IHJvdy5mb3JFYWNoKChzcSwgaikgPT4ge1xyXG4gICAgICAgIGlmICghaGFzX3N1cnZpdmVkW2ldPy5bal0pIHtcclxuICAgICAgICAgICAgY29uc3QgY2FwdHVyZWRfZW50aXR5ID0gc3E7XHJcbiAgICAgICAgICAgIHJvd1tqXSA9IG51bGw7XHJcbiAgICAgICAgICAgIHNlbmRfY2FwdHVyZWRfZW50aXR5X3RvX29wcG9uZW50KG9sZCwgY2FwdHVyZWRfZW50aXR5KTtcclxuICAgICAgICB9XHJcbiAgICB9KSk7XHJcbn1cclxuZnVuY3Rpb24gc2VuZF9jYXB0dXJlZF9lbnRpdHlfdG9fb3Bwb25lbnQob2xkLCBjYXB0dXJlZF9lbnRpdHkpIHtcclxuICAgIGlmICghY2FwdHVyZWRfZW50aXR5KVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIGNvbnN0IG9wcG9uZW50ID0gKDAsIHNpZGVfMS5vcHBvbmVudE9mKShjYXB0dXJlZF9lbnRpdHkuc2lkZSk7XHJcbiAgICBpZiAoY2FwdHVyZWRfZW50aXR5LnR5cGUgPT09IFwi44GX44KHXCIpIHtcclxuICAgICAgICAob3Bwb25lbnQgPT09IFwi55m9XCIgPyBvbGQuaGFuZF9vZl93aGl0ZSA6IG9sZC5oYW5kX29mX2JsYWNrKS5wdXNoKCgwLCB0eXBlXzEudW5wcm9tb3RlKShjYXB0dXJlZF9lbnRpdHkucHJvZikpO1xyXG4gICAgfVxyXG59XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGUgPSBleHBvcnRzLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mID0gZXhwb3J0cy5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncyA9IGV4cG9ydHMuZGVsZXRlX2VuX3Bhc3NhbnRfZmxhZyA9IGV4cG9ydHMuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkID0gdm9pZCAwO1xyXG5jb25zdCBjb29yZGluYXRlXzEgPSByZXF1aXJlKFwiLi9jb29yZGluYXRlXCIpO1xyXG5mdW5jdGlvbiBnZXRfZW50aXR5X2Zyb21fY29vcmQoYm9hcmQsIGNvb3JkKSB7XHJcbiAgICBjb25zdCBbY29sdW1uLCByb3ddID0gY29vcmQ7XHJcbiAgICBjb25zdCByb3dfaW5kZXggPSBcIuS4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5nVwiLmluZGV4T2Yocm93KTtcclxuICAgIGNvbnN0IGNvbHVtbl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihjb2x1bW4pO1xyXG4gICAgaWYgKHJvd19pbmRleCA9PT0gLTEgfHwgY29sdW1uX2luZGV4ID09PSAtMSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihg5bqn5qiZ44CMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoY29vcmQpfeOAjeOBr+S4jeato+OBp+OBmWApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIChib2FyZFtyb3dfaW5kZXhdPy5bY29sdW1uX2luZGV4XSkgPz8gbnVsbDtcclxufVxyXG5leHBvcnRzLmdldF9lbnRpdHlfZnJvbV9jb29yZCA9IGdldF9lbnRpdHlfZnJvbV9jb29yZDtcclxuZnVuY3Rpb24gZGVsZXRlX2VuX3Bhc3NhbnRfZmxhZyhib2FyZCwgY29vcmQpIHtcclxuICAgIGNvbnN0IFtjb2x1bW4sIHJvd10gPSBjb29yZDtcclxuICAgIGNvbnN0IHJvd19pbmRleCA9IFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZihyb3cpO1xyXG4gICAgY29uc3QgY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGNvbHVtbik7XHJcbiAgICBpZiAocm93X2luZGV4ID09PSAtMSB8fCBjb2x1bW5faW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDluqfmqJnjgIwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShjb29yZCl944CN44Gv5LiN5q2j44Gn44GZYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBwYXduID0gYm9hcmRbcm93X2luZGV4XVtjb2x1bW5faW5kZXhdO1xyXG4gICAgaWYgKHBhd24/LnR5cGUgIT09IFwi44K5XCIgfHwgcGF3bi5wcm9mICE9PSBcIuODnVwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDjg53jg7zjg7Pjga7jgarjgYTluqfmqJnjgIwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShjb29yZCl944CN44Gr5a++44GX44GmIFxcYGRlbGV0ZV9lbl9wYXNzYW50X2ZsYWcoKVxcYCDjgYzlkbzjgbDjgozjgb7jgZfjgZ9gKTtcclxuICAgIH1cclxuICAgIGRlbGV0ZSBwYXduLnN1YmplY3RfdG9fZW5fcGFzc2FudDtcclxufVxyXG5leHBvcnRzLmRlbGV0ZV9lbl9wYXNzYW50X2ZsYWcgPSBkZWxldGVfZW5fcGFzc2FudF9mbGFnO1xyXG4vKipcclxuICog6aeS44O756KB55+z44O7bnVsbCDjgpLnm6TkuIrjga7nibnlrprjga7kvY3nva7jgavphY3nva7jgZnjgovjgIJjYW5fY2FzdGxlIOODleODqeOCsOOBqCBjYW5fa3VtYWwg44OV44Op44Kw44KS6YGp5a6c6Kq/5pW044GZ44KL44CCXHJcbiAqIEBwYXJhbSBib2FyZFxyXG4gKiBAcGFyYW0gY29vcmRcclxuICogQHBhcmFtIG1heWJlX2VudGl0eVxyXG4gKiBAcmV0dXJuc1xyXG4gKi9cclxuZnVuY3Rpb24gcHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MoYm9hcmQsIGNvb3JkLCBtYXliZV9lbnRpdHkpIHtcclxuICAgIGNvbnN0IFtjb2x1bW4sIHJvd10gPSBjb29yZDtcclxuICAgIGNvbnN0IHJvd19pbmRleCA9IFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZihyb3cpO1xyXG4gICAgY29uc3QgY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGNvbHVtbik7XHJcbiAgICBpZiAocm93X2luZGV4ID09PSAtMSB8fCBjb2x1bW5faW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDluqfmqJnjgIwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShjb29yZCl944CN44Gv5LiN5q2j44Gn44GZYCk7XHJcbiAgICB9XHJcbiAgICBpZiAobWF5YmVfZW50aXR5Py50eXBlID09PSBcIueOi1wiKSB7XHJcbiAgICAgICAgaWYgKG1heWJlX2VudGl0eS5uZXZlcl9tb3ZlZCkge1xyXG4gICAgICAgICAgICBtYXliZV9lbnRpdHkubmV2ZXJfbW92ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgbWF5YmVfZW50aXR5Lmhhc19tb3ZlZF9vbmx5X29uY2UgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChtYXliZV9lbnRpdHkuaGFzX21vdmVkX29ubHlfb25jZSkge1xyXG4gICAgICAgICAgICBtYXliZV9lbnRpdHkubmV2ZXJfbW92ZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgbWF5YmVfZW50aXR5Lmhhc19tb3ZlZF9vbmx5X29uY2UgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChtYXliZV9lbnRpdHk/LnR5cGUgPT09IFwi44GX44KHXCIgJiYgbWF5YmVfZW50aXR5LnByb2YgPT09IFwi6aaZXCIpIHtcclxuICAgICAgICBtYXliZV9lbnRpdHkuY2FuX2t1bWFsID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChtYXliZV9lbnRpdHk/LnR5cGUgPT09IFwi44K5XCIpIHtcclxuICAgICAgICBtYXliZV9lbnRpdHkubmV2ZXJfbW92ZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiBib2FyZFtyb3dfaW5kZXhdW2NvbHVtbl9pbmRleF0gPSBtYXliZV9lbnRpdHk7XHJcbn1cclxuZXhwb3J0cy5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncyA9IHB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzO1xyXG5mdW5jdGlvbiBsb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZihib2FyZCwgc2lkZSwgcHJvZikge1xyXG4gICAgY29uc3QgYW5zID0gW107XHJcbiAgICBjb25zdCByb3dzID0gW1wi5LiAXCIsIFwi5LqMXCIsIFwi5LiJXCIsIFwi5ZubXCIsIFwi5LqUXCIsIFwi5YWtXCIsIFwi5LiDXCIsIFwi5YWrXCIsIFwi5LmdXCJdO1xyXG4gICAgY29uc3QgY29scyA9IFtcIu+8kVwiLCBcIu+8klwiLCBcIu+8k1wiLCBcIu+8lFwiLCBcIu+8lVwiLCBcIu+8llwiLCBcIu+8l1wiLCBcIu+8mFwiLCBcIu+8mVwiXTtcclxuICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbCBvZiBjb2xzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gW2NvbCwgcm93XTtcclxuICAgICAgICAgICAgY29uc3QgZW50aXR5ID0gZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKGJvYXJkLCBjb29yZCk7XHJcbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IG51bGwgfHwgZW50aXR5LnR5cGUgPT09IFwi56KBXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGVudGl0eS5wcm9mID09PSBwcm9mICYmIGVudGl0eS5zaWRlID09PSBzaWRlKSB7XHJcbiAgICAgICAgICAgICAgICBhbnMucHVzaChjb29yZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuZXhwb3J0cy5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZiA9IGxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mO1xyXG5mdW5jdGlvbiBsb29rdXBfY29vcmRzX2Zyb21fc2lkZShib2FyZCwgc2lkZSkge1xyXG4gICAgY29uc3QgYW5zID0gW107XHJcbiAgICBjb25zdCByb3dzID0gW1wi5LiAXCIsIFwi5LqMXCIsIFwi5LiJXCIsIFwi5ZubXCIsIFwi5LqUXCIsIFwi5YWtXCIsIFwi5LiDXCIsIFwi5YWrXCIsIFwi5LmdXCJdO1xyXG4gICAgY29uc3QgY29scyA9IFtcIu+8kVwiLCBcIu+8klwiLCBcIu+8k1wiLCBcIu+8lFwiLCBcIu+8lVwiLCBcIu+8llwiLCBcIu+8l1wiLCBcIu+8mFwiLCBcIu+8mVwiXTtcclxuICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGNvbCBvZiBjb2xzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gW2NvbCwgcm93XTtcclxuICAgICAgICAgICAgY29uc3QgZW50aXR5ID0gZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKGJvYXJkLCBjb29yZCk7XHJcbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT09IG51bGwgfHwgZW50aXR5LnR5cGUgPT09IFwi56KBXCIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGVudGl0eS5zaWRlID09PSBzaWRlKSB7XHJcbiAgICAgICAgICAgICAgICBhbnMucHVzaChjb29yZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuZXhwb3J0cy5sb29rdXBfY29vcmRzX2Zyb21fc2lkZSA9IGxvb2t1cF9jb29yZHNfZnJvbV9zaWRlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmRvX2FueV9vZl9teV9waWVjZXNfc2VlID0gZXhwb3J0cy5jYW5fc2VlID0gdm9pZCAwO1xyXG5jb25zdCBib2FyZF8xID0gcmVxdWlyZShcIi4vYm9hcmRcIik7XHJcbmNvbnN0IHNpZGVfMSA9IHJlcXVpcmUoXCIuL3NpZGVcIik7XHJcbmZ1bmN0aW9uIGRlbHRhRXEoZCwgZGVsdGEpIHtcclxuICAgIHJldHVybiBkLnYgPT09IGRlbHRhLnYgJiYgZC5oID09PSBkZWx0YS5oO1xyXG59XHJcbi8qKlxyXG4gKiBgby5mcm9tYCDjgavpp5LjgYzjgYLjgaPjgabjgZ3jga7pp5LjgYwgYG8udG9gIOOBuOOBqOWIqeOBhOOBpuOBhOOCi+OBi+OBqeOBhuOBi+OCkui/lOOBmeOAguODneODvOODs+OBruaWnOOCgeWIqeOBjeOBr+W4uOOBqyBjYW5fc2VlIOOBqOimi+OBquOBmeOAguODneODvOODs+OBrjLjg57jgrnnp7vli5Xjga/jgIHpp5LjgpLlj5bjgovjgZPjgajjgYzjgafjgY3jgarjgYTjga7jgafjgIzliKnjgY3jgI3jgafjga/jgarjgYTjgIJcclxuICogIENoZWNrcyB3aGV0aGVyIHRoZXJlIGlzIGEgcGllY2UgYXQgYG8uZnJvbWAgd2hpY2ggbG9va3MgYXQgYG8udG9gLiBUaGUgZGlhZ29uYWwgbW92ZSBvZiBwYXduIGlzIGFsd2F5cyBjb25zaWRlcmVkLiBBIHBhd24gbmV2ZXIgc2VlcyB0d28gc3F1YXJlcyBpbiB0aGUgZnJvbnQ7IGl0IGNhbiBvbmx5IG1vdmUgdG8gdGhlcmUuXHJcbiAqIEBwYXJhbSBib2FyZFxyXG4gKiBAcGFyYW0gb1xyXG4gKiBAcmV0dXJuc1xyXG4gKi9cclxuZnVuY3Rpb24gY2FuX3NlZShib2FyZCwgbykge1xyXG4gICAgY29uc3QgcCA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIG8uZnJvbSk7XHJcbiAgICBpZiAoIXApIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAocC50eXBlID09PSBcIueigVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGVsdGEgPSAoMCwgc2lkZV8xLmNvb3JkRGlmZlNlZW5Gcm9tKShwLnNpZGUsIG8pO1xyXG4gICAgaWYgKHAucHJvZiA9PT0gXCLmiJDmoYJcIiB8fCBwLnByb2YgPT09IFwi5oiQ6YqAXCIgfHwgcC5wcm9mID09PSBcIuaIkOmmmVwiIHx8IHAucHJvZiA9PT0gXCLph5FcIikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHsgdjogMSwgaDogLTEgfSwgeyB2OiAxLCBoOiAwIH0sIHsgdjogMSwgaDogMSB9LFxyXG4gICAgICAgICAgICB7IHY6IDAsIGg6IC0xIH0sIC8qKioqKioqKioqKiovIHsgdjogMCwgaDogMSB9LFxyXG4gICAgICAgICAgICAvKioqKioqKioqKioqKiovIHsgdjogLTEsIGg6IDAgfSAvKioqKioqKioqKioqKiovXHJcbiAgICAgICAgXS5zb21lKGQgPT4gZGVsdGFFcShkLCBkZWx0YSkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIumKgFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgeyB2OiAxLCBoOiAtMSB9LCB7IHY6IDEsIGg6IDAgfSwgeyB2OiAxLCBoOiAxIH0sXHJcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgICAgICAgICB7IHY6IC0xLCBoOiAtMSB9LCAvKioqKioqKioqKioqLyB7IHY6IDEsIGg6IDEgfSxcclxuICAgICAgICBdLnNvbWUoZCA9PiBkZWx0YUVxKGQsIGRlbHRhKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi5qGCXCIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB7IHY6IDIsIGg6IC0xIH0sIHsgdjogMiwgaDogMSB9XHJcbiAgICAgICAgXS5zb21lKGQgPT4gZGVsdGFFcShkLCBkZWx0YSkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIuODilwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgeyB2OiAyLCBoOiAtMSB9LCB7IHY6IDIsIGg6IDEgfSxcclxuICAgICAgICAgICAgeyB2OiAtMiwgaDogLTEgfSwgeyB2OiAtMiwgaDogMSB9LFxyXG4gICAgICAgICAgICB7IHY6IC0xLCBoOiAyIH0sIHsgdjogMSwgaDogMiB9LFxyXG4gICAgICAgICAgICB7IHY6IC0xLCBoOiAtMiB9LCB7IHY6IDEsIGg6IC0yIH1cclxuICAgICAgICBdLnNvbWUoZCA9PiBkZWx0YUVxKGQsIGRlbHRhKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi44KtXCIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB7IHY6IDEsIGg6IC0xIH0sIHsgdjogMSwgaDogMCB9LCB7IHY6IDEsIGg6IDEgfSxcclxuICAgICAgICAgICAgeyB2OiAwLCBoOiAtMSB9LCAvKioqKioqKioqKioqKi8geyB2OiAwLCBoOiAxIH0sXHJcbiAgICAgICAgICAgIHsgdjogLTEsIGg6IC0xIH0sIHsgdjogLTEsIGg6IDAgfSwgeyB2OiAtMSwgaDogMSB9LFxyXG4gICAgICAgIF0uc29tZShkID0+IGRlbHRhRXEoZCwgZGVsdGEpKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLjgahcIiB8fCBwLnByb2YgPT09IFwi44KvXCIpIHtcclxuICAgICAgICByZXR1cm4gbG9uZ19yYW5nZShbXHJcbiAgICAgICAgICAgIHsgdjogMSwgaDogLTEgfSwgeyB2OiAxLCBoOiAwIH0sIHsgdjogMSwgaDogMSB9LFxyXG4gICAgICAgICAgICB7IHY6IDAsIGg6IC0xIH0sIC8qKioqKioqKioqKioqLyB7IHY6IDAsIGg6IDEgfSxcclxuICAgICAgICAgICAgeyB2OiAtMSwgaDogLTEgfSwgeyB2OiAtMSwgaDogMCB9LCB7IHY6IC0xLCBoOiAxIH0sXHJcbiAgICAgICAgXSwgYm9hcmQsIG8sIHAuc2lkZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi44OTXCIpIHtcclxuICAgICAgICByZXR1cm4gbG9uZ19yYW5nZShbXHJcbiAgICAgICAgICAgIHsgdjogMSwgaDogLTEgfSwgeyB2OiAxLCBoOiAxIH0sIHsgdjogLTEsIGg6IC0xIH0sIHsgdjogLTEsIGg6IDEgfSxcclxuICAgICAgICBdLCBib2FyZCwgbywgcC5zaWRlKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLjg6tcIikge1xyXG4gICAgICAgIHJldHVybiBsb25nX3JhbmdlKFtcclxuICAgICAgICAgICAgeyB2OiAxLCBoOiAwIH0sIHsgdjogMCwgaDogLTEgfSwgeyB2OiAwLCBoOiAxIH0sIHsgdjogLTEsIGg6IDAgfSxcclxuICAgICAgICBdLCBib2FyZCwgbywgcC5zaWRlKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLppplcIikge1xyXG4gICAgICAgIHJldHVybiBsb25nX3JhbmdlKFt7IHY6IDEsIGg6IDAgfV0sIGJvYXJkLCBvLCBwLnNpZGUpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIui2hVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi44OdXCIpIHtcclxuICAgICAgICBpZiAoW3sgdjogMSwgaDogLTEgfSwgeyB2OiAxLCBoOiAwIH0sIHsgdjogMSwgaDogMSB9XS5zb21lKGQgPT4gZGVsdGFFcShkLCBkZWx0YSkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gYSBwYXduIGNhbiBuZXZlciBzZWUgdHdvIHNxdWFyZXMgaW4gZnJvbnQ7IGl0IGNhbiBvbmx5IG1vdmUgdG8gdGhlcmVcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IF8gPSBwLnByb2Y7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2hvdWxkIG5vdCByZWFjaCBoZXJlXCIpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuY2FuX3NlZSA9IGNhbl9zZWU7XHJcbmZ1bmN0aW9uIGxvbmdfcmFuZ2UoZGlyZWN0aW9ucywgYm9hcmQsIG8sIHNpZGUpIHtcclxuICAgIGNvbnN0IGRlbHRhID0gKDAsIHNpZGVfMS5jb29yZERpZmZTZWVuRnJvbSkoc2lkZSwgbyk7XHJcbiAgICBjb25zdCBtYXRjaGluZ19kaXJlY3Rpb25zID0gZGlyZWN0aW9ucy5maWx0ZXIoZGlyZWN0aW9uID0+IGRlbHRhLnYgKiBkaXJlY3Rpb24udiArIGRlbHRhLmggKiBkaXJlY3Rpb24uaCA+IDAgLyogaW5uZXIgcHJvZHVjdCBpcyBwb3NpdGl2ZSAqL1xyXG4gICAgICAgICYmIGRlbHRhLnYgKiBkaXJlY3Rpb24uaCAtIGRpcmVjdGlvbi52ICogZGVsdGEuaCA9PT0gMCAvKiBjcm9zcyBwcm9kdWN0IGlzIHplcm8gKi8pO1xyXG4gICAgaWYgKG1hdGNoaW5nX2RpcmVjdGlvbnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGlyZWN0aW9uID0gbWF0Y2hpbmdfZGlyZWN0aW9uc1swXTtcclxuICAgIGZvciAobGV0IGkgPSB7IHY6IGRpcmVjdGlvbi52LCBoOiBkaXJlY3Rpb24uaCB9OyAhZGVsdGFFcShpLCBkZWx0YSk7IGkudiArPSBkaXJlY3Rpb24udiwgaS5oICs9IGRpcmVjdGlvbi5oKSB7XHJcbiAgICAgICAgY29uc3QgY29vcmQgPSAoMCwgc2lkZV8xLmFwcGx5RGVsdGFTZWVuRnJvbSkoc2lkZSwgby5mcm9tLCBpKTtcclxuICAgICAgICBpZiAoKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgY29vcmQpKSB7XHJcbiAgICAgICAgICAgIC8vIGJsb2NrZWQgYnkgc29tZXRoaW5nOyBjYW5ub3Qgc2VlXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiBkb19hbnlfb2ZfbXlfcGllY2VzX3NlZShib2FyZCwgY29vcmQsIHNpZGUpIHtcclxuICAgIGNvbnN0IG9wcG9uZW50X3BpZWNlX2Nvb3JkcyA9ICgwLCBib2FyZF8xLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlKShib2FyZCwgc2lkZSk7XHJcbiAgICByZXR1cm4gb3Bwb25lbnRfcGllY2VfY29vcmRzLnNvbWUoZnJvbSA9PiBjYW5fc2VlKGJvYXJkLCB7IGZyb20sIHRvOiBjb29yZCB9KSk7XHJcbn1cclxuZXhwb3J0cy5kb19hbnlfb2ZfbXlfcGllY2VzX3NlZSA9IGRvX2FueV9vZl9teV9waWVjZXNfc2VlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLkxlZnRtb3N0V2hlblNlZW5Gcm9tQmxhY2sgPSBleHBvcnRzLlJpZ2h0bW9zdFdoZW5TZWVuRnJvbUJsYWNrID0gZXhwb3J0cy5jb29yZERpZmYgPSBleHBvcnRzLmNvbHVtbnNCZXR3ZWVuID0gZXhwb3J0cy5jb29yZEVxID0gZXhwb3J0cy5kaXNwbGF5Q29vcmQgPSB2b2lkIDA7XHJcbmZ1bmN0aW9uIGRpc3BsYXlDb29yZChjb29yZCkge1xyXG4gICAgcmV0dXJuIGAke2Nvb3JkWzBdfSR7Y29vcmRbMV19YDtcclxufVxyXG5leHBvcnRzLmRpc3BsYXlDb29yZCA9IGRpc3BsYXlDb29yZDtcclxuZnVuY3Rpb24gY29vcmRFcShbY29sMSwgcm93MV0sIFtjb2wyLCByb3cyXSkge1xyXG4gICAgcmV0dXJuIGNvbDEgPT09IGNvbDIgJiYgcm93MSA9PT0gcm93MjtcclxufVxyXG5leHBvcnRzLmNvb3JkRXEgPSBjb29yZEVxO1xyXG5mdW5jdGlvbiBjb2x1bW5zQmV0d2VlbihhLCBiKSB7XHJcbiAgICBjb25zdCBhX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGEpO1xyXG4gICAgY29uc3QgYl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihiKTtcclxuICAgIGlmIChhX2luZGV4ID49IGJfaW5kZXgpXHJcbiAgICAgICAgcmV0dXJuIGNvbHVtbnNCZXR3ZWVuKGIsIGEpO1xyXG4gICAgY29uc3QgYW5zID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gYV9pbmRleCArIDE7IGkgPCBiX2luZGV4OyBpKyspIHtcclxuICAgICAgICBhbnMucHVzaChcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiW2ldKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuZXhwb3J0cy5jb2x1bW5zQmV0d2VlbiA9IGNvbHVtbnNCZXR3ZWVuO1xyXG5mdW5jdGlvbiBjb29yZERpZmYobykge1xyXG4gICAgY29uc3QgW2Zyb21fY29sdW1uLCBmcm9tX3Jvd10gPSBvLmZyb207XHJcbiAgICBjb25zdCBmcm9tX3Jvd19pbmRleCA9IFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZihmcm9tX3Jvdyk7XHJcbiAgICBjb25zdCBmcm9tX2NvbHVtbl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihmcm9tX2NvbHVtbik7XHJcbiAgICBjb25zdCBbdG9fY29sdW1uLCB0b19yb3ddID0gby50bztcclxuICAgIGNvbnN0IHRvX3Jvd19pbmRleCA9IFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZih0b19yb3cpO1xyXG4gICAgY29uc3QgdG9fY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKHRvX2NvbHVtbik7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGg6IHRvX2NvbHVtbl9pbmRleCAtIGZyb21fY29sdW1uX2luZGV4LFxyXG4gICAgICAgIHY6IHRvX3Jvd19pbmRleCAtIGZyb21fcm93X2luZGV4XHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuY29vcmREaWZmID0gY29vcmREaWZmO1xyXG5mdW5jdGlvbiBSaWdodG1vc3RXaGVuU2VlbkZyb21CbGFjayhjb29yZHMpIHtcclxuICAgIGlmIChjb29yZHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJpZWQgdG8gdGFrZSB0aGUgbWF4aW11bSBvZiBhbiBlbXB0eSBhcnJheVwiKTtcclxuICAgIH1cclxuICAgIC8vIFNpbmNlIFwi77yRXCIgdG8gXCLvvJlcIiBhcmUgY29uc2VjdXRpdmUgaW4gVW5pY29kZSwgd2UgY2FuIGp1c3Qgc29ydCBpdCBhcyBVVEYtMTYgc3RyaW5nXHJcbiAgICBjb25zdCBjb2x1bW5zID0gY29vcmRzLm1hcCgoW2NvbCwgX3Jvd10pID0+IGNvbCk7XHJcbiAgICBjb2x1bW5zLnNvcnQoKTtcclxuICAgIGNvbnN0IHJpZ2h0bW9zdF9jb2x1bW4gPSBjb2x1bW5zWzBdO1xyXG4gICAgcmV0dXJuIGNvb3Jkcy5maWx0ZXIoKFtjb2wsIF9yb3ddKSA9PiBjb2wgPT09IHJpZ2h0bW9zdF9jb2x1bW4pO1xyXG59XHJcbmV4cG9ydHMuUmlnaHRtb3N0V2hlblNlZW5Gcm9tQmxhY2sgPSBSaWdodG1vc3RXaGVuU2VlbkZyb21CbGFjaztcclxuZnVuY3Rpb24gTGVmdG1vc3RXaGVuU2VlbkZyb21CbGFjayhjb29yZHMpIHtcclxuICAgIGlmIChjb29yZHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidHJpZWQgdG8gdGFrZSB0aGUgbWF4aW11bSBvZiBhbiBlbXB0eSBhcnJheVwiKTtcclxuICAgIH1cclxuICAgIC8vIFNpbmNlIFwi77yRXCIgdG8gXCLvvJlcIiBhcmUgY29uc2VjdXRpdmUgaW4gVW5pY29kZSwgd2UgY2FuIGp1c3Qgc29ydCBpdCBhcyBVVEYtMTYgc3RyaW5nXHJcbiAgICBjb25zdCBjb2x1bW5zID0gY29vcmRzLm1hcCgoW2NvbCwgX3Jvd10pID0+IGNvbCk7XHJcbiAgICBjb2x1bW5zLnNvcnQoKTtcclxuICAgIGNvbnN0IGxlZnRtb3N0X2NvbHVtbiA9IGNvbHVtbnNbY29sdW1ucy5sZW5ndGggLSAxXTtcclxuICAgIHJldHVybiBjb29yZHMuZmlsdGVyKChbY29sLCBfcm93XSkgPT4gY29sID09PSBsZWZ0bW9zdF9jb2x1bW4pO1xyXG59XHJcbmV4cG9ydHMuTGVmdG1vc3RXaGVuU2VlbkZyb21CbGFjayA9IExlZnRtb3N0V2hlblNlZW5Gcm9tQmxhY2s7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xyXG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcclxuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcclxuICAgIH1cclxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KSk7XHJcbnZhciBfX2V4cG9ydFN0YXIgPSAodGhpcyAmJiB0aGlzLl9fZXhwb3J0U3RhcikgfHwgZnVuY3Rpb24obSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZnJvbV9jdXN0b21fc3RhdGUgPSBleHBvcnRzLm1haW4gPSBleHBvcnRzLmdldF9pbml0aWFsX3N0YXRlID0gZXhwb3J0cy5jb29yZEVxID0gZXhwb3J0cy5kaXNwbGF5Q29vcmQgPSBleHBvcnRzLnRocm93c19pZl91bmt1bWFsYWJsZSA9IGV4cG9ydHMudGhyb3dzX2lmX3VuY2FzdGxhYmxlID0gZXhwb3J0cy5jYW5fbW92ZSA9IGV4cG9ydHMuY2FuX3NlZSA9IGV4cG9ydHMub3Bwb25lbnRPZiA9IHZvaWQgMDtcclxuY29uc3QgYm9hcmRfMSA9IHJlcXVpcmUoXCIuL2JvYXJkXCIpO1xyXG5jb25zdCBwaWVjZV9waGFzZV8xID0gcmVxdWlyZShcIi4vcGllY2VfcGhhc2VcIik7XHJcbmNvbnN0IGNvb3JkaW5hdGVfMSA9IHJlcXVpcmUoXCIuL2Nvb3JkaW5hdGVcIik7XHJcbmNvbnN0IGFmdGVyX3N0b25lX3BoYXNlXzEgPSByZXF1aXJlKFwiLi9hZnRlcl9zdG9uZV9waGFzZVwiKTtcclxuY29uc3Qgc2lkZV8xID0gcmVxdWlyZShcIi4vc2lkZVwiKTtcclxuY29uc3Qgc3Vycm91bmRfMSA9IHJlcXVpcmUoXCIuL3N1cnJvdW5kXCIpO1xyXG52YXIgc2lkZV8yID0gcmVxdWlyZShcIi4vc2lkZVwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwib3Bwb25lbnRPZlwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc2lkZV8yLm9wcG9uZW50T2Y7IH0gfSk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi90eXBlXCIpLCBleHBvcnRzKTtcclxudmFyIGNhbl9zZWVfMSA9IHJlcXVpcmUoXCIuL2Nhbl9zZWVcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImNhbl9zZWVcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNhbl9zZWVfMS5jYW5fc2VlOyB9IH0pO1xyXG52YXIgcGllY2VfcGhhc2VfMiA9IHJlcXVpcmUoXCIuL3BpZWNlX3BoYXNlXCIpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJjYW5fbW92ZVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcGllY2VfcGhhc2VfMi5jYW5fbW92ZTsgfSB9KTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwidGhyb3dzX2lmX3VuY2FzdGxhYmxlXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwaWVjZV9waGFzZV8yLnRocm93c19pZl91bmNhc3RsYWJsZTsgfSB9KTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwidGhyb3dzX2lmX3Vua3VtYWxhYmxlXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwaWVjZV9waGFzZV8yLnRocm93c19pZl91bmt1bWFsYWJsZTsgfSB9KTtcclxudmFyIGNvb3JkaW5hdGVfMiA9IHJlcXVpcmUoXCIuL2Nvb3JkaW5hdGVcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImRpc3BsYXlDb29yZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gY29vcmRpbmF0ZV8yLmRpc3BsYXlDb29yZDsgfSB9KTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiY29vcmRFcVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gY29vcmRpbmF0ZV8yLmNvb3JkRXE7IH0gfSk7XHJcbmNvbnN0IGdldF9pbml0aWFsX3N0YXRlID0gKHdob19nb2VzX2ZpcnN0KSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBoYXNlOiBcInJlc29sdmVkXCIsXHJcbiAgICAgICAgaGFuZF9vZl9ibGFjazogW10sXHJcbiAgICAgICAgaGFuZF9vZl93aGl0ZTogW10sXHJcbiAgICAgICAgd2hvX2dvZXNfbmV4dDogd2hvX2dvZXNfZmlyc3QsXHJcbiAgICAgICAgYm9hcmQ6IFtcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIummmVwiLCBjYW5fa3VtYWw6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLmoYJcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIumKgFwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi6YeRXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLnjotcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjgq1cIiwgbmV2ZXJfbW92ZWQ6IHRydWUsIGhhc19tb3ZlZF9vbmx5X29uY2U6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi6YeRXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLpioBcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuahglwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi6aaZXCIsIGNhbl9rdW1hbDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OrXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OKXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OTXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuOCr1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg5NcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg4pcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg6tcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCxdLFxyXG4gICAgICAgICAgICBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCxdLFxyXG4gICAgICAgICAgICBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCxdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg6tcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg4pcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg5NcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44KvXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODk1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODilwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODq1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi6aaZXCIsIGNhbl9rdW1hbDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuahglwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi6YqAXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLph5FcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIueOi1wiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuOCrVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSwgaGFzX21vdmVkX29ubHlfb25jZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLph5FcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIumKgFwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi5qGCXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLppplcIiwgY2FuX2t1bWFsOiB0cnVlIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgXVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0cy5nZXRfaW5pdGlhbF9zdGF0ZSA9IGdldF9pbml0aWFsX3N0YXRlO1xyXG4vKiog56KB55+z44KS572u44GP44CC6Ieq5q665omL44Gr44Gq44KL44KI44GG44Gq56KB55+z44Gu572u44GN5pa544Gv44Gn44GN44Gq44GE77yI5YWs5byP44Or44O844Or44CM5omT44Gj44Gf556s6ZaT44Gr5Y+W44KJ44KM44Gm44GX44G+44GG44Oe44K544Gr44Gv55+z44Gv5omT44Gm44Gq44GE44CN77yJXHJcbiAqXHJcbiAqIEBwYXJhbSBvbGRcclxuICogQHBhcmFtIHNpZGVcclxuICogQHBhcmFtIHN0b25lX3RvXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5mdW5jdGlvbiBwbGFjZV9zdG9uZShvbGQsIHNpZGUsIHN0b25lX3RvKSB7XHJcbiAgICBpZiAoKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShvbGQuYm9hcmQsIHN0b25lX3RvKSkgeyAvLyBpZiB0aGUgc3F1YXJlIGlzIGFscmVhZHkgb2NjdXBpZWRcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7c2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShzdG9uZV90byl944Gr56KB55+z44KS572u44GT44GG44Go44GX44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoc3RvbmVfdG8pfeOBruODnuOCueOBr+aXouOBq+Wfi+OBvuOBo+OBpuOBhOOBvuOBmWApO1xyXG4gICAgfVxyXG4gICAgLy8g44G+44Ga572u44GPXHJcbiAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBzdG9uZV90bywgeyB0eXBlOiBcIueigVwiLCBzaWRlIH0pO1xyXG4gICAgLy8g572u44GE44Gf5b6M44Gn44CB552A5omL56aB5q2i44GL44Gp44GG44GL44KS5Yik5pat44GZ44KL44Gf44KB44Gr44CBXHJcbiAgICAvL+OAjuWbsuOBvuOCjOOBpuOBhOOCi+ebuOaJi+OBrumnki/nn7PjgpLlj5bjgovjgI/ihpLjgI7lm7Ljgb7jgozjgabjgYTjgovoh6rliIbjga7pp5Iv55+z44KS5Y+W44KL44CP44KS44K344Of44Ol44Os44O844K344On44Oz44GX44Gm44CB572u44GE44Gf5L2N572u44Gu55+z44GM5q2744KT44Gn44GE44Gf44KJXHJcbiAgICBjb25zdCBibGFja19hbmRfd2hpdGUgPSBvbGQuYm9hcmQubWFwKHJvdyA9PiByb3cubWFwKHNxID0+IHNxID09PSBudWxsID8gbnVsbCA6IHNxLnNpZGUpKTtcclxuICAgIGNvbnN0IG9wcG9uZW50X3JlbW92ZWQgPSAoMCwgc3Vycm91bmRfMS5yZW1vdmVfc3Vycm91bmRlZCkoKDAsIHNpZGVfMS5vcHBvbmVudE9mKShzaWRlKSwgYmxhY2tfYW5kX3doaXRlKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9ICgwLCBzdXJyb3VuZF8xLnJlbW92ZV9zdXJyb3VuZGVkKShzaWRlLCBvcHBvbmVudF9yZW1vdmVkKTtcclxuICAgIGlmICgoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKHJlc3VsdCwgc3RvbmVfdG8pKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcGhhc2U6IFwic3RvbmVfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgICAgIGhhbmRfb2ZfYmxhY2s6IG9sZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgICAgICBoYW5kX29mX3doaXRlOiBvbGQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICAgICAgYnlfd2hvbTogb2xkLmJ5X3dob20sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtzaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHN0b25lX3RvKX3jgavnooHnn7PjgpLnva7jgZPjgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIHmiZPjgaPjgZ/nnqzplpPjgavlj5bjgonjgozjgabjgZfjgb7jgYbjga7jgafjgZPjgZPjga/nnYDmiYvnpoHmraLngrnjgafjgZlgKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBvbmVfdHVybihvbGQsIG1vdmUpIHtcclxuICAgIGNvbnN0IGFmdGVyX3BpZWNlX3BoYXNlID0gKDAsIHBpZWNlX3BoYXNlXzEucGxheV9waWVjZV9waGFzZSkob2xkLCBtb3ZlLnBpZWNlX3BoYXNlKTtcclxuICAgIGNvbnN0IGFmdGVyX3N0b25lX3BoYXNlID0gbW92ZS5zdG9uZV90byA/IHBsYWNlX3N0b25lKGFmdGVyX3BpZWNlX3BoYXNlLCBtb3ZlLnBpZWNlX3BoYXNlLnNpZGUsIG1vdmUuc3RvbmVfdG8pIDoge1xyXG4gICAgICAgIHBoYXNlOiBcInN0b25lX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgIGJvYXJkOiBhZnRlcl9waWVjZV9waGFzZS5ib2FyZCxcclxuICAgICAgICBoYW5kX29mX2JsYWNrOiBhZnRlcl9waWVjZV9waGFzZS5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgIGhhbmRfb2Zfd2hpdGU6IGFmdGVyX3BpZWNlX3BoYXNlLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgYnlfd2hvbTogYWZ0ZXJfcGllY2VfcGhhc2UuYnlfd2hvbSxcclxuICAgIH07XHJcbiAgICByZXR1cm4gKDAsIGFmdGVyX3N0b25lX3BoYXNlXzEucmVzb2x2ZV9hZnRlcl9zdG9uZV9waGFzZSkoYWZ0ZXJfc3RvbmVfcGhhc2UpO1xyXG59XHJcbmZ1bmN0aW9uIG1haW4obW92ZXMpIHtcclxuICAgIGlmIChtb3Zlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYznqbrjgafjgZlcIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZnJvbV9jdXN0b21fc3RhdGUobW92ZXMsICgwLCBleHBvcnRzLmdldF9pbml0aWFsX3N0YXRlKShtb3Zlc1swXS5waWVjZV9waGFzZS5zaWRlKSk7XHJcbn1cclxuZXhwb3J0cy5tYWluID0gbWFpbjtcclxuZnVuY3Rpb24gZnJvbV9jdXN0b21fc3RhdGUobW92ZXMsIGluaXRpYWxfc3RhdGUpIHtcclxuICAgIGxldCBzdGF0ZSA9IGluaXRpYWxfc3RhdGU7XHJcbiAgICBmb3IgKGNvbnN0IG1vdmUgb2YgbW92ZXMpIHtcclxuICAgICAgICBjb25zdCBuZXh0ID0gb25lX3R1cm4oc3RhdGUsIG1vdmUpO1xyXG4gICAgICAgIGlmIChuZXh0LnBoYXNlID09PSBcImdhbWVfZW5kXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5leHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0YXRlID0gbmV4dDtcclxuICAgIH1cclxuICAgIHJldHVybiBzdGF0ZTtcclxufVxyXG5leHBvcnRzLmZyb21fY3VzdG9tX3N0YXRlID0gZnJvbV9jdXN0b21fc3RhdGU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMudGhyb3dzX2lmX3VuY2FzdGxhYmxlID0gZXhwb3J0cy5jYW5fbW92ZSA9IGV4cG9ydHMucGxheV9waWVjZV9waGFzZSA9IGV4cG9ydHMudGhyb3dzX2lmX3Vua3VtYWxhYmxlID0gdm9pZCAwO1xyXG5jb25zdCBib2FyZF8xID0gcmVxdWlyZShcIi4vYm9hcmRcIik7XHJcbmNvbnN0IHR5cGVfMSA9IHJlcXVpcmUoXCIuL3R5cGVcIik7XHJcbmNvbnN0IGNvb3JkaW5hdGVfMSA9IHJlcXVpcmUoXCIuL2Nvb3JkaW5hdGVcIik7XHJcbmNvbnN0IHNpZGVfMSA9IHJlcXVpcmUoXCIuL3NpZGVcIik7XHJcbmNvbnN0IGNhbl9zZWVfMSA9IHJlcXVpcmUoXCIuL2Nhbl9zZWVcIik7XHJcbi8qKiDpp5LjgpLmiZPjgaTjgILmiYvpp5LjgYvjgonlsIbmo4vpp5LjgpLnm6TkuIrjgavnp7vli5XjgZXjgZvjgovjgILooYzjgY3jganjgZPjgo3jga7nhKHjgYTkvY3nva7jgavmoYLppqzjgajpppnou4rjgpLmiZPjgaPjgZ/jgonjgqjjg6njg7zjgIJcclxuICpcclxuICovXHJcbmZ1bmN0aW9uIHBhcmFjaHV0ZShvbGQsIG8pIHtcclxuICAgIGlmICgoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKG9sZC5ib2FyZCwgby50bykpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeaJk+OBqOOBruOBk+OBqOOBp+OBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeODnuOCueOBr+aXouOBq+Wfi+OBvuOBo+OBpuOBhOOBvuOBmWApO1xyXG4gICAgfVxyXG4gICAgaWYgKG8ucHJvZiA9PT0gXCLmoYJcIikge1xyXG4gICAgICAgIGlmICgoMCwgc2lkZV8xLmlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cykoMiwgby5zaWRlLCBvLnRvKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeaJk+OBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeihjOOBjeOBqeOBk+OCjeOBruOBquOBhOahgummrOOBr+aJk+OBpuOBvuOBm+OCk2ApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG8ucHJvZiA9PT0gXCLppplcIikge1xyXG4gICAgICAgIGlmICgoMCwgc2lkZV8xLmlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cykoMSwgby5zaWRlLCBvLnRvKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeaJk+OBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeihjOOBjeOBqeOBk+OCjeOBruOBquOBhOmmmei7iuOBr+aJk+OBpuOBvuOBm+OCk2ApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IGhhbmQgPSBvbGRbby5zaWRlID09PSBcIueZvVwiID8gXCJoYW5kX29mX3doaXRlXCIgOiBcImhhbmRfb2ZfYmxhY2tcIl07XHJcbiAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLnRvLCB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IG8uc2lkZSwgcHJvZjogby5wcm9mLCBjYW5fa3VtYWw6IGZhbHNlIH0pO1xyXG4gICAgY29uc3QgaW5kZXggPSBoYW5kLmZpbmRJbmRleChwcm9mID0+IHByb2YgPT09IG8ucHJvZik7XHJcbiAgICBoYW5kLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBoYXNlOiBcInBpZWNlX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgIGhhbmRfb2ZfYmxhY2s6IG9sZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgIGJ5X3dob206IG9sZC53aG9fZ29lc19uZXh0LFxyXG4gICAgICAgIGJvYXJkOiBvbGQuYm9hcmRcclxuICAgIH07XHJcbn1cclxuZnVuY3Rpb24gdGhyb3dzX2lmX3Vua3VtYWxhYmxlKGJvYXJkLCBvKSB7XHJcbiAgICBjb25zdCBraW5nID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgby5mcm9tKTtcclxuICAgIGlmIChraW5nPy50eXBlID09PSBcIueOi1wiKSB7XHJcbiAgICAgICAgaWYgKGtpbmcubmV2ZXJfbW92ZWQpIHtcclxuICAgICAgICAgICAgY29uc3QgbGFuY2UgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBvLnRvKTtcclxuICAgICAgICAgICAgaWYgKCFsYW5jZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDjgq3jg7PjgrDnjovjgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOWLleOBj+OBj+OBvuOCiuOCk+OBkOOCkiR7a2luZy5zaWRlfeOBjOippuOBv+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBq+OBr+mnkuOBjOOBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGxhbmNlLnR5cGUgPT09IFwi56KBXCIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg44Kt44Oz44Kw546L44GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjli5XjgY/jgY/jgb7jgorjgpPjgZDjgpIke2tpbmcuc2lkZX3jgYzoqabjgb/jgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgavjgYLjgovjga7jga/pppnou4rjgafjga/jgarjgY/nooHnn7PjgafjgZlgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChsYW5jZS50eXBlICE9PSBcIuOBl+OCh1wiIHx8IGxhbmNlLnByb2YgIT09IFwi6aaZXCIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg44Kt44Oz44Kw546L44GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjli5XjgY/jgY/jgb7jgorjgpPjgZDjgpIke2tpbmcuc2lkZX3jgYzoqabjgb/jgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBq+OBr+mmmei7iuOBp+OBr+OBquOBhOmnkuOBjOOBguOCiuOBvuOBmWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghbGFuY2UuY2FuX2t1bWFsKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOOCreODs+OCsOeOi+OBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G45YuV44GP44GP44G+44KK44KT44GQ44KSJHtraW5nLnNpZGV944GM6Kmm44G/44Gm44GE44G+44GZ44GM44CB44GT44Gu6aaZ6LuK44Gv5omT44Gf44KM44Gf6aaZ6LuK44Gq44Gu44Gn44GP44G+44KK44KT44GQ44Gu5a++6LGh5aSW44Gn44GZYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobGFuY2Uuc2lkZSAhPT0ga2luZy5zaWRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOOCreODs+OCsOeOi+OBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G45YuV44GP44GP44G+44KK44KT44GQ44KSJHtraW5nLnNpZGV944GM6Kmm44G/44Gm44GE44G+44GZ44GM44CB44GT44Gu6aaZ6LuK44Gv55u45omL44Gu6aaZ6LuK44Gq44Gu44Gn44GP44G+44KK44KT44GQ44Gu5a++6LGh5aSW44Gn44GZYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHsga2luZywgbGFuY2UgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCLjgY/jgb7jgorjgpPjgZDjgafjga/jgYLjgorjgb7jgZvjgpNcIik7XHJcbn1cclxuZXhwb3J0cy50aHJvd3NfaWZfdW5rdW1hbGFibGUgPSB0aHJvd3NfaWZfdW5rdW1hbGFibGU7XHJcbmZ1bmN0aW9uIGt1bWFsaW5nX29yX2Nhc3RsaW5nKG9sZCwgZnJvbSwgdG8pIHtcclxuICAgIGNvbnN0IGtpbmcgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKG9sZC5ib2FyZCwgZnJvbSk7XHJcbiAgICBpZiAoa2luZz8udHlwZSA9PT0gXCLnjotcIikge1xyXG4gICAgICAgIGlmIChraW5nLm5ldmVyX21vdmVkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgbGFuY2UgfSA9IHRocm93c19pZl91bmt1bWFsYWJsZShvbGQuYm9hcmQsIHsgZnJvbSwgdG8gfSk7XHJcbiAgICAgICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIHRvLCBraW5nKTtcclxuICAgICAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgZnJvbSwgbGFuY2UpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcGhhc2U6IFwicGllY2VfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgICAgICAgICBib2FyZDogb2xkLmJvYXJkLFxyXG4gICAgICAgICAgICAgICAgaGFuZF9vZl9ibGFjazogb2xkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgICAgICAgICBoYW5kX29mX3doaXRlOiBvbGQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICAgICAgICAgIGJ5X3dob206IG9sZC53aG9fZ29lc19uZXh0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGtpbmcuaGFzX21vdmVkX29ubHlfb25jZSkge1xyXG4gICAgICAgICAgICBjb25zdCBkaWZmID0gKDAsIHNpZGVfMS5jb29yZERpZmZTZWVuRnJvbSkoa2luZy5zaWRlLCB7IHRvOiB0bywgZnJvbSB9KTtcclxuICAgICAgICAgICAgaWYgKGRpZmYudiA9PT0gMCAmJiAoZGlmZi5oID09PSAyIHx8IGRpZmYuaCA9PT0gLTIpICYmXHJcbiAgICAgICAgICAgICAgICAoKGtpbmcuc2lkZSA9PT0gXCLpu5JcIiAmJiBmcm9tWzFdID09PSBcIuWFq1wiKSB8fCAoa2luZy5zaWRlID09PSBcIueZvVwiICYmIGZyb21bMV0gPT09IFwi5LqMXCIpKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhc3RsaW5nKG9sZCwgeyBmcm9tLCB0bzogdG8sIHNpZGU6IGtpbmcuc2lkZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtraW5nLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkodG8pfeOCreOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7a2luZy5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKFwi44KtXCIpfeOBr+ebpOS4iuOBq+OBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7a2luZy5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHRvKX3jgq3jgajjga7jgZPjgajjgafjgZnjgYzjgIHjgZ3jga7jgojjgYbjgarnp7vli5XjgYzjgafjgY3jgoske2tpbmcuc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShcIuOCrVwiKX3jga/nm6TkuIrjgavjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGZ1bmN0aW9uIFxcYGt1bWFsaW5nMigpXFxgIGNhbGxlZCBvbiBhIG5vbi1raW5nIHBpZWNlYCk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFJlc29sdmVkIOOBqueKtuaFi+OBq+mnkuODleOCp+OCpOOCuuOCkumBqeeUqOOAguecgeeVpeOBleOCjOOBn+aDheWgseOCkuW+qeWFg+OBl+OBquOBjOOCiemBqeeUqOOBl+OBquOBjeOCg+OBhOOBkeOBquOBhOOBruOBp+OAgeOBi+OBquOCiuOBl+OCk+OBqeOBhOOAglxyXG4gKiBAcGFyYW0gb2xkIOWRvOOBs+WHuuOBl+W+jOOBq+egtOWjiuOBleOCjOOBpuOBhOOCi+WPr+iDveaAp+OBjOOBguOCi+OBruOBp+OAgeW+jOOBp+S9v+OBhOOBn+OBhOOBquOCieODh+OCo+ODvOODl+OCs+ODlOODvOOBl+OBpuOBiuOBj+OBk+OBqOOAglxyXG4gKiBAcGFyYW0gb1xyXG4gKi9cclxuZnVuY3Rpb24gcGxheV9waWVjZV9waGFzZShvbGQsIG8pIHtcclxuICAgIC8vIFRoZSB0aGluZyBpcyB0aGF0IHdlIGhhdmUgdG8gaW5mZXIgd2hpY2ggcGllY2UgaGFzIG1vdmVkLCBzaW5jZSB0aGUgdXN1YWwgbm90YXRpb24gZG9lcyBub3Qgc2lnbmlmeVxyXG4gICAgLy8gd2hlcmUgdGhlIHBpZWNlIGNvbWVzIGZyb20uXHJcbiAgICAvLyDpnaLlgJLjgarjga7jga/jgIHlhbfkvZPnmoTjgavjganjga7pp5LjgYzli5XjgYTjgZ/jga7jgYvjgpLjgIHmo4vorZzjga7mg4XloLHjgYvjgonlvqnlhYPjgZfjgabjgoTjgonjgarjgYTjgajjgYTjgZHjgarjgYTjgajjgYTjgYbngrnjgafjgYLjgovvvIjmma7pgJrlp4vngrnjga/mm7jjgYvjgarjgYTjga7jgafvvInjgIJcclxuICAgIC8vIGZpcnN0LCB1c2UgdGhlIGBzaWRlYCBmaWVsZCBhbmQgdGhlIGBwcm9mYCBmaWVsZCB0byBsaXN0IHVwIHRoZSBwb3NzaWJsZSBwb2ludHMgb2Ygb3JpZ2luIFxyXG4gICAgLy8gKG5vdGUgdGhhdCBcImluIGhhbmRcIiBpcyBhIHBvc3NpYmlsaXR5KS5cclxuICAgIGNvbnN0IHBvc3NpYmxlX3BvaW50c19vZl9vcmlnaW4gPSAoMCwgYm9hcmRfMS5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZikob2xkLmJvYXJkLCBvLnNpZGUsIG8ucHJvZik7XHJcbiAgICBjb25zdCBoYW5kID0gb2xkW28uc2lkZSA9PT0gXCLnmb1cIiA/IFwiaGFuZF9vZl93aGl0ZVwiIDogXCJoYW5kX29mX2JsYWNrXCJdO1xyXG4gICAgY29uc3QgZXhpc3RzX2luX2hhbmQgPSBoYW5kLnNvbWUocHJvZiA9PiBwcm9mID09PSBvLnByb2YpO1xyXG4gICAgaWYgKHR5cGVvZiBvLmZyb20gPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICBpZiAoby5mcm9tID09PSBcIuaJk1wiKSB7XHJcbiAgICAgICAgICAgIGlmIChleGlzdHNfaW5faGFuZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCgwLCB0eXBlXzEuaXNVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uKShvLnByb2YpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFjaHV0ZShvbGQsIHsgc2lkZTogby5zaWRlLCBwcm9mOiBvLnByb2YsIHRvOiBvLnRvIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVW5wcm9tb3RlZFNob2dpUHJvZmVzc2lvbiDku6XlpJbjga/miYvpp5LjgavlhaXjgaPjgabjgYTjgovjga/jgZrjgYzjgarjgYTjga7jgafjgIFcclxuICAgICAgICAgICAgICAgICAgICAvLyBleGlzdHNfaW5faGFuZCDjgYzmuoDjgZ/jgZXjgozjgabjgYTjgovmmYLngrnjgacgVW5wcm9tb3RlZFNob2dpUHJvZmVzc2lvbiDjgafjgYLjgovjgZPjgajjga/ml6LjgavnorrlrprjgZfjgabjgYTjgotcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzaG91bGQgbm90IHJlYWNoIGhlcmVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeaJk+OBqOOBruOBk+OBqOOBp+OBmeOBjOOAgSR7by5zaWRlfeOBruaJi+mnkuOBqyR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944Gv44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoby5mcm9tID09PSBcIuWPs1wiKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBydW5lZCA9IHBvc3NpYmxlX3BvaW50c19vZl9vcmlnaW4uZmlsdGVyKGZyb20gPT4gY2FuX21vdmUob2xkLmJvYXJkLCB7IGZyb20sIHRvOiBvLnRvIH0pKTtcclxuICAgICAgICAgICAgaWYgKHBydW5lZC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z95Y+z44Go44Gu44GT44Go44Gn44GZ44GM44CB44Gd44Gu44KI44GG44Gq56e75YuV44GM44Gn44GN44KLJHtvLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jga/nm6TkuIrjgavjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCByaWdodG1vc3QgPSAoMCwgc2lkZV8xLlJpZ2h0bW9zdFdoZW5TZWVuRnJvbSkoby5zaWRlLCBwcnVuZWQpO1xyXG4gICAgICAgICAgICBpZiAocmlnaHRtb3N0Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vdmVfcGllY2Uob2xkLCB7IGZyb206IHJpZ2h0bW9zdFswXSwgdG86IG8udG8sIHNpZGU6IG8uc2lkZSwgcHJvbW90ZTogby5wcm9tb3RlcyA/PyBudWxsIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3jgajjga7jgZPjgajjgafjgZnjgYzjgIHjgZ3jga7jgojjgYbjgarnp7vli5XjgYzjgafjgY3jgoske28uc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBjOebpOS4iuOBq+ikh+aVsOOBguOCiuOBvuOBmWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG8uZnJvbSA9PT0gXCLlt6ZcIikge1xyXG4gICAgICAgICAgICBjb25zdCBwcnVuZWQgPSBwb3NzaWJsZV9wb2ludHNfb2Zfb3JpZ2luLmZpbHRlcihmcm9tID0+IGNhbl9tb3ZlKG9sZC5ib2FyZCwgeyBmcm9tLCB0bzogby50byB9KSk7XHJcbiAgICAgICAgICAgIGlmIChwcnVuZWQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeW3puOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7by5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944Gv55uk5LiK44Gr44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgbGVmdG1vc3QgPSAoMCwgc2lkZV8xLkxlZnRtb3N0V2hlblNlZW5Gcm9tKShvLnNpZGUsIHBydW5lZCk7XHJcbiAgICAgICAgICAgIGlmIChsZWZ0bW9zdC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtb3ZlX3BpZWNlKG9sZCwgeyBmcm9tOiBsZWZ0bW9zdFswXSwgdG86IG8udG8sIHNpZGU6IG8uc2lkZSwgcHJvbW90ZTogby5wcm9tb3RlcyA/PyBudWxsIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3jgajjga7jgZPjgajjgafjgZnjgYzjgIHjgZ3jga7jgojjgYbjgarnp7vli5XjgYzjgafjgY3jgoske28uc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBjOebpOS4iuOBq+ikh+aVsOOBguOCiuOBvuOBmWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLjgIzmiZPjgI3jgIzlj7PjgI3jgIzlt6bjgI3jgIzmiJDjgI3jgIzkuI3miJDjgI3ku6XlpJbjga7mjqXlsL7ovp7jga/mnKrlrp/oo4XjgafjgZnjgILvvJflha3ph5HvvIjvvJfkupTvvInjgarjganjgajmm7jjgYTjgabkuIvjgZXjgYTjgIJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIG8uZnJvbSA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIC8vIOmnkuOBjOOBqeOBk+OBi+OCieadpeOBn+OBi+OBjOWIhuOBi+OCieOBquOBhOOAglxyXG4gICAgICAgIC8vIOOBk+OBruOCiOOBhuOBquOBqOOBjeOBq+OBr+OAgVxyXG4gICAgICAgIC8vIOODu+aJk+OBpOOBl+OBi+OBquOBhOOBquOCieaJk+OBpFxyXG4gICAgICAgIC8vIOODu+OBneOBhuOBp+OBquOBj+OBpuOAgeebrueahOWcsOOBq+ihjOOBkeOCi+mnkuOBjOebpOS4iuOBqyAxIOeorumhnuOBl+OBi+OBquOBhOOBquOCieOAgeOBneOCjOOCkuOBmeOCi1xyXG4gICAgICAgIC8vIOOBqOOBhOOBhuino+axuuOCkuOBmeOCi+OBk+OBqOOBq+OBquOCi+OAglxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8g44GX44GL44GX44CB44GT44Gu44Ky44O844Og44Gr44GK44GE44Gm44CB5LqM44Od44Gv44CM552A5omL44Gn44GN44Gq44GE5omL44CN44Gn44Gv44Gq44GP44Gm44CB44CM552A5omL44GX44Gf5b6M44Gr44CB55+z44OV44Kn44Kk44K66Kej5raI5b6M44Gr44KC44Gd44KM44GM5q6L44Gj44Gm44GX44G+44Gj44Gm44GE44Gf44KJ44CB5Y+N5YmH6LKg44GR44CN44Go44Gq44KL44KC44Gu44Gn44GC44KL44CCXHJcbiAgICAgICAgLy8g44GT44Gu5YmN5o+Q44Gu44KC44Go44Gn44CB44Od44GM5qiq5Lim44Gz44GX44Gm44GE44KL44Go44GN44Gr44CB54mH5pa544Gu44Od44Gu5YmN44Gr44GC44KL6aeS44KS5Y+W44KN44GG44Go44GX44Gm44GE44KL54q25rOB44KS6ICD44GI44Gm44G744GX44GE44CCXHJcbiAgICAgICAgLy8g44GZ44KL44Go44CB5bi46K2Y55qE44Gr44Gv44Gd44KT44Gq44GC44GL44KJ44GV44G+44Gq5LqM44Od44Gv5oyH44GV44Gq44GE44Gu44Gn44CBMeODnuOCueWJjemAsuOBl+OBpuWPluOCi+OBruOBjOW9k+OBn+OCiuWJjeOBp+OBguOCiuOAgVxyXG4gICAgICAgIC8vIOOBneOCjOOCkuaji+itnOOBq+i1t+OBk+OBmeOBqOOBjeOBq+OCj+OBluOCj+OBluOAjOebtOOAjeOCkuS7mOOBkeOCi+OBquOBqeODkOOCq+ODkOOCq+OBl+OBhOOAglxyXG4gICAgICAgIC8vIOOCiOOBo+OBpuOAgeWHuueZuueCueaOqOirluOBq+OBiuOBhOOBpuOBr+OAgeacgOWIneOBr+S6jOODneOBr+aOkumZpOOBl+OBpuaOqOirluOBmeOCi+OBk+OBqOOBqOOBmeOCi+OAglxyXG4gICAgICAgIC8vIFdlIGhhdmUgbm8gaW5mbyBvbiB3aGVyZSB0aGUgcGllY2UgY2FtZSBmcm9tLlxyXG4gICAgICAgIC8vIEluIHN1Y2ggY2FzZXMsIHRoZSByYXRpb25hbCB3YXkgb2YgaW5mZXJlbmNlIGlzXHJcbiAgICAgICAgLy8gKiBQYXJhY2h1dGUgYSBwaWVjZSBpZiB5b3UgaGF2ZSB0by5cclxuICAgICAgICAvLyAqIE90aGVyd2lzZSwgaWYgdGhlcmUgaXMgb25seSBvbmUgcGllY2Ugb24gYm9hcmQgdGhhdCBjYW4gZ28gdG8gdGhlIHNwZWNpZmllZCBkZXN0aW5hdGlvbiwgdGFrZSB0aGF0IG1vdmUuXHJcbiAgICAgICAgLy8gXHJcbiAgICAgICAgLy8gSG93ZXZlciwgaW4gdGhpcyBnYW1lLCBkb3VibGVkIHBhd25zIGFyZSBub3QgYW4gaW1wb3NzaWJsZSBtb3ZlLCBidXQgcmF0aGVyIGEgbW92ZSB0aGF0IGNhdXNlIHlvdSB0byBsb3NlIGlmIGl0IHJlbWFpbmVkIGV2ZW4gYWZ0ZXIgdGhlIHJlbW92YWwtYnktZ28uXHJcbiAgICAgICAgLy8gVW5kZXIgc3VjaCBhbiBhc3N1bXB0aW9uLCBjb25zaWRlciB0aGUgc2l0dWF0aW9uIHdoZXJlIHRoZXJlIGFyZSB0d28gcGF3bnMgbmV4dCB0byBlYWNoIG90aGVyIGFuZCB0aGVyZSBpcyBhbiBlbmVteSBwaWVjZSByaWdodCBpbiBmcm9udCBvZiBvbmUgb2YgaXQuXHJcbiAgICAgICAgLy8gSW4gc3VjaCBhIGNhc2UsIGl0IGlzIHZlcnkgZWFzeSB0byBzZWUgdGhhdCB0YWtpbmcgdGhlIHBpZWNlIGRpYWdvbmFsbHkgcmVzdWx0cyBpbiBkb3VibGVkIHBhd25zLlxyXG4gICAgICAgIC8vIEhlbmNlLCB3aGVuIHdyaXRpbmcgdGhhdCBtb3ZlIGRvd24sIHlvdSBkb24ndCB3YW50IHRvIGV4cGxpY2l0bHkgYW5ub3RhdGUgc3VjaCBhIGNhc2Ugd2l0aCDnm7QuXHJcbiAgICAgICAgLy8gVGhlcmVmb3JlLCB3aGVuIGluZmVycmluZyB0aGUgcG9pbnQgb2Ygb3JpZ2luLCBJIGZpcnN0IGlnbm9yZSB0aGUgZG91YmxlZCBwYXducy5cclxuICAgICAgICBjb25zdCBwcnVuZWQgPSBwb3NzaWJsZV9wb2ludHNfb2Zfb3JpZ2luLmZpbHRlcihmcm9tID0+IGNhbl9tb3ZlX2FuZF9ub3RfY2F1c2VfZG91YmxlZF9wYXducyhvbGQuYm9hcmQsIHsgZnJvbSwgdG86IG8udG8gfSkpO1xyXG4gICAgICAgIGlmIChwcnVuZWQubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgIGlmIChvLnByb2YgPT09IFwi44KtXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vIOOCreODo+OCueODquODs+OCsOOBiuOCiOOBs+OBj+OBvuOCiuOCk+OBkOOBr+OCreODs+OCsOeOi+OBruWLleOBjeOBqOOBl+OBpuabuOOBj+OAglxyXG4gICAgICAgICAgICAgICAgLy8g5bi444Gr44Kt44Oz44Kw44GM6YCa5bi45YuV44GR44Gq44GE56+E5Zuy44G444Gu56e75YuV44Go44Gq44KL44CCXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ga3VtYWxpbmdfb3JfY2FzdGxpbmcob2xkLCBwb3NzaWJsZV9wb2ludHNfb2Zfb3JpZ2luWzBdLCBvLnRvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChleGlzdHNfaW5faGFuZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCgwLCB0eXBlXzEuaXNVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uKShvLnByb2YpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmFjaHV0ZShvbGQsIHsgc2lkZTogby5zaWRlLCBwcm9mOiBvLnByb2YsIHRvOiBvLnRvIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVW5wcm9tb3RlZFNob2dpUHJvZmVzc2lvbiDku6XlpJbjga/miYvpp5LjgavlhaXjgaPjgabjgYTjgovjga/jgZrjgYzjgarjgYTjga7jgafjgIFcclxuICAgICAgICAgICAgICAgICAgICAvLyBleGlzdHNfaW5faGFuZCDjgYzmuoDjgZ/jgZXjgozjgabjgYTjgovmmYLngrnjgacgVW5wcm9tb3RlZFNob2dpUHJvZmVzc2lvbiDjgafjgYLjgovjgZPjgajjga/ml6LjgavnorrlrprjgZfjgabjgYTjgotcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzaG91bGQgbm90IHJlYWNoIGhlcmVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcnVuZWRfYWxsb3dpbmdfZG91YmxlZF9wYXducyA9IHBvc3NpYmxlX3BvaW50c19vZl9vcmlnaW4uZmlsdGVyKGZyb20gPT4gY2FuX21vdmUob2xkLmJvYXJkLCB7IGZyb20sIHRvOiBvLnRvIH0pKTtcclxuICAgICAgICAgICAgICAgIGlmIChwcnVuZWRfYWxsb3dpbmdfZG91YmxlZF9wYXducy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7by5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944Gv55uk5LiK44Gr44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChwcnVuZWRfYWxsb3dpbmdfZG91YmxlZF9wYXducy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBmcm9tID0gcHJ1bmVkX2FsbG93aW5nX2RvdWJsZWRfcGF3bnNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vdmVfcGllY2Uob2xkLCB7IGZyb20sIHRvOiBvLnRvLCBzaWRlOiBvLnNpZGUsIHByb21vdGU6IG8ucHJvbW90ZXMgPz8gbnVsbCB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z944Go44Gu44GT44Go44Gn44GZ44GM44CB44Gd44Gu44KI44GG44Gq56e75YuV44GM44Gn44GN44KLJHtvLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jgYznm6TkuIrjgavopIfmlbDjgYLjgorjgIHjgZfjgYvjgoLjganjgozjgpLmjIfjgZfjgabjgoLkuozjg53jgafjgZlgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChwcnVuZWQubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZyb20gPSBwcnVuZWRbMF07XHJcbiAgICAgICAgICAgIHJldHVybiBtb3ZlX3BpZWNlKG9sZCwgeyBmcm9tLCB0bzogby50bywgc2lkZTogby5zaWRlLCBwcm9tb3RlOiBvLnByb21vdGVzID8/IG51bGwgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7by5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944GM55uk5LiK44Gr6KSH5pWw44GC44KK44CB44Gp44KM44KS5o6h55So44GZ44KL44G544GN44GL5YiG44GL44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgZnJvbSA9IG8uZnJvbTtcclxuICAgICAgICBpZiAoIXBvc3NpYmxlX3BvaW50c19vZl9vcmlnaW4uc29tZShjID0+ICgwLCBjb29yZGluYXRlXzEuY29vcmRFcSkoYywgZnJvbSkpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444GoJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jgpLli5XjgYvjgZ3jgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShmcm9tKX3jgavjga8ke28uc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBr+OBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY2FuX21vdmUob2xkLmJvYXJkLCB7IGZyb20sIHRvOiBvLnRvIH0pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtb3ZlX3BpZWNlKG9sZCwgeyBmcm9tLCB0bzogby50bywgc2lkZTogby5zaWRlLCBwcm9tb3RlOiBvLnByb21vdGVzID8/IG51bGwgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG8ucHJvZiA9PT0gXCLjgq1cIikge1xyXG4gICAgICAgICAgICAvLyDjgq3jg6Pjgrnjg6rjg7PjgrDjgYrjgojjgbPjgY/jgb7jgorjgpPjgZDjga/jgq3jg7PjgrDnjovjga7li5XjgY3jgajjgZfjgabmm7jjgY/jgIJcclxuICAgICAgICAgICAgLy8g5bi444Gr44Kt44Oz44Kw44GM6YCa5bi45YuV44GR44Gq44GE56+E5Zuy44G444Gu56e75YuV44Go44Gq44KL44CCXHJcbiAgICAgICAgICAgIHJldHVybiBrdW1hbGluZ19vcl9jYXN0bGluZyhvbGQsIGZyb20sIG8udG8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShmcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjgagkeygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOCkuWLleOBi+OBneOBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944GvJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G45YuV44GR44KL6aeS44Gn44Gv44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMucGxheV9waWVjZV9waGFzZSA9IHBsYXlfcGllY2VfcGhhc2U7XHJcbi8qKiBgby5zaWRlYCDjgYzpp5LjgpIgYG8uZnJvbWAg44GL44KJIGBvLnRvYCDjgavli5XjgYvjgZnjgILjgZ3jga7pp5LjgYwgYG8uZnJvbWAg44GL44KJIGBvLnRvYCDjgbjjgaggY2FuX21vdmUg44Gn44GC44KL44GT44Go44KS6KaB5rGC44GZ44KL44CC44Kt44Oj44K544Oq44Oz44Kw44O744GP44G+44KK44KT44GQ44Gv5omx44KP44Gq44GE44GM44CB44Ki44Oz44OR44OD44K144Oz44Gv5omx44GG44CCXHJcbiAqL1xyXG5mdW5jdGlvbiBtb3ZlX3BpZWNlKG9sZCwgbykge1xyXG4gICAgY29uc3QgcGllY2VfdGhhdF9tb3ZlcyA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkob2xkLmJvYXJkLCBvLmZyb20pO1xyXG4gICAgaWYgKCFwaWVjZV90aGF0X21vdmVzKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBruenu+WLleOCkuippuOBv+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944Gr44Gv6aeS44GM44GC44KK44G+44Gb44KTYCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwaWVjZV90aGF0X21vdmVzLnR5cGUgPT09IFwi56KBXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Gu56e75YuV44KS6Kmm44G/44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgavjgYLjgovjga7jga/nooHnn7PjgafjgYLjgorjgIHpp5Ljgafjga/jgYLjgorjgb7jgZvjgpNgKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHBpZWNlX3RoYXRfbW92ZXMuc2lkZSAhPT0gby5zaWRlKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBruenu+WLleOCkuippuOBv+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944Gr44GC44KL44Gu44GvJHsoMCwgc2lkZV8xLm9wcG9uZW50T2YpKG8uc2lkZSl944Gu6aeS44Gn44GZYCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCByZXMgPSBjYW5fbW92ZShvbGQuYm9hcmQsIHsgZnJvbTogby5mcm9tLCB0bzogby50byB9KTtcclxuICAgIGlmIChyZXMgPT09IFwiZW4gcGFzc2FudFwiKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogICAgICAgICAgZnJvbVswXSB0b1swXVxyXG4gICAgICAgICAqICAgICAgICAgfCAgLi4gIHwgIC4uICB8XHJcbiAgICAgICAgICogdG9bMV0gICB8ICAuLiAgfCAgdG8gIHxcclxuICAgICAgICAgKiBmcm9tWzFdIHwgZnJvbSB8IHBhd24gfFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0IGNvb3JkX2hvcml6b250YWxseV9hZGphY2VudCA9IFtvLnRvWzBdLCBvLmZyb21bMV1dO1xyXG4gICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8udG8sIHBpZWNlX3RoYXRfbW92ZXMpO1xyXG4gICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8uZnJvbSwgbnVsbCk7XHJcbiAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgY29vcmRfaG9yaXpvbnRhbGx5X2FkamFjZW50LCBudWxsKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBwaGFzZTogXCJwaWVjZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICAgICAgYm9hcmQ6IG9sZC5ib2FyZCxcclxuICAgICAgICAgICAgaGFuZF9vZl9ibGFjazogb2xkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgICAgICBieV93aG9tOiBvbGQud2hvX2dvZXNfbmV4dFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICghcmVzKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBruenu+WLleOCkuippuOBv+OBpuOBhOOBvuOBmeOBjOOAgemnkuOBruWLleOBjeS4iuOBneOBruOCiOOBhuOBquenu+WLleOBr+OBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgfVxyXG4gICAgaWYgKCgwLCB0eXBlXzEuaXNfcHJvbW90YWJsZSkocGllY2VfdGhhdF9tb3Zlcy5wcm9mKVxyXG4gICAgICAgICYmICgoMCwgc2lkZV8xLmlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cykoMywgby5zaWRlLCBvLmZyb20pIHx8ICgwLCBzaWRlXzEuaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzKSgzLCBvLnNpZGUsIG8udG8pKSkge1xyXG4gICAgICAgIGlmIChvLnByb21vdGUpIHtcclxuICAgICAgICAgICAgaWYgKHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9PT0gXCLmoYJcIikge1xyXG4gICAgICAgICAgICAgICAgcGllY2VfdGhhdF9tb3Zlcy5wcm9mID0gXCLmiJDmoYJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwaWVjZV90aGF0X21vdmVzLnByb2YgPT09IFwi6YqAXCIpIHtcclxuICAgICAgICAgICAgICAgIHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9IFwi5oiQ6YqAXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocGllY2VfdGhhdF9tb3Zlcy5wcm9mID09PSBcIummmVwiKSB7XHJcbiAgICAgICAgICAgICAgICBwaWVjZV90aGF0X21vdmVzLnByb2YgPSBcIuaIkOmmmVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9PT0gXCLjgq1cIikge1xyXG4gICAgICAgICAgICAgICAgcGllY2VfdGhhdF9tb3Zlcy5wcm9mID0gXCLotoVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwaWVjZV90aGF0X21vdmVzLnByb2YgPT09IFwi44OdXCIpIHtcclxuICAgICAgICAgICAgICAgIHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9IFwi44GoXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICgocGllY2VfdGhhdF9tb3Zlcy5wcm9mID09PSBcIuahglwiICYmICgwLCBzaWRlXzEuaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzKSgyLCBvLnNpZGUsIG8udG8pKVxyXG4gICAgICAgICAgICAgICAgfHwgKHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9PT0gXCLppplcIiAmJiAoMCwgc2lkZV8xLmlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cykoMSwgby5zaWRlLCBvLnRvKSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtwaWVjZV90aGF0X21vdmVzLnByb2Z95LiN5oiQ44Go44Gu44GT44Go44Gn44GZ44GM44CBJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkocGllY2VfdGhhdF9tb3Zlcy5wcm9mKX3jgpLkuI3miJDjgafooYzjgY3jganjgZPjgo3jga7jgarjgYTjgajjgZPjgo3jgavooYzjgYvjgZvjgovjgZPjgajjga/jgafjgY3jgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChvLnByb21vdGUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke3BpZWNlX3RoYXRfbW92ZXMucHJvZn0ke28ucHJvbW90ZSA/IFwi5oiQXCIgOiBcIuS4jeaIkFwifeOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBk+OBruenu+WLleOBr+aIkOOCiuOCkueZuueUn+OBleOBm+OBquOBhOOBruOBp+OAjCR7by5wcm9tb3RlID8gXCLmiJBcIiA6IFwi5LiN5oiQXCJ944CN6KGo6KiY44Gv44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3Qgb2NjdXBpZXIgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKG9sZC5ib2FyZCwgby50byk7XHJcbiAgICBpZiAoIW9jY3VwaWVyKSB7XHJcbiAgICAgICAgaWYgKHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9PT0gXCLjg51cIiAmJiBwaWVjZV90aGF0X21vdmVzLm5ldmVyX21vdmVkICYmIG8udG9bMV0gPT09IFwi5LqUXCIpIHtcclxuICAgICAgICAgICAgcGllY2VfdGhhdF9tb3Zlcy5zdWJqZWN0X3RvX2VuX3Bhc3NhbnQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLnRvLCBwaWVjZV90aGF0X21vdmVzKTtcclxuICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLmZyb20sIG51bGwpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHBoYXNlOiBcInBpZWNlX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgICAgICBib2FyZDogb2xkLmJvYXJkLFxyXG4gICAgICAgICAgICBoYW5kX29mX2JsYWNrOiBvbGQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICAgICAgaGFuZF9vZl93aGl0ZTogb2xkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgICAgIGJ5X3dob206IG9sZC53aG9fZ29lc19uZXh0XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG9jY3VwaWVyLnR5cGUgPT09IFwi56KBXCIpIHtcclxuICAgICAgICBpZiAob2NjdXBpZXIuc2lkZSA9PT0gby5zaWRlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjga7np7vli5XjgpLoqabjgb/jgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgavoh6rliIbjga7nooHnn7PjgYzjgYLjgovjga7jgafjgIHnp7vli5XjgafjgY3jgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8udG8sIHBpZWNlX3RoYXRfbW92ZXMpO1xyXG4gICAgICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLmZyb20sIG51bGwpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcGhhc2U6IFwicGllY2VfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgICAgICAgICBib2FyZDogb2xkLmJvYXJkLFxyXG4gICAgICAgICAgICAgICAgaGFuZF9vZl9ibGFjazogb2xkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgICAgICAgICBoYW5kX29mX3doaXRlOiBvbGQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICAgICAgICAgIGJ5X3dob206IG9sZC53aG9fZ29lc19uZXh0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKG9jY3VwaWVyLnNpZGUgPT09IG8uc2lkZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Gu56e75YuV44KS6Kmm44G/44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944Gr6Ieq5YiG44Gu6aeS44GM44GC44KL44Gu44Gn44CB56e75YuV44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG9jY3VwaWVyLnR5cGUgPT09IFwi44GX44KHXCIpIHtcclxuICAgICAgICAgICAgKG8uc2lkZSA9PT0gXCLnmb1cIiA/IG9sZC5oYW5kX29mX3doaXRlIDogb2xkLmhhbmRfb2ZfYmxhY2spLnB1c2goKDAsIHR5cGVfMS51bnByb21vdGUpKG9jY3VwaWVyLnByb2YpKTtcclxuICAgICAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby50bywgcGllY2VfdGhhdF9tb3Zlcyk7XHJcbiAgICAgICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8uZnJvbSwgbnVsbCk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwaGFzZTogXCJwaWVjZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICAgICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgICAgICAgICBoYW5kX29mX2JsYWNrOiBvbGQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICAgICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgICAgICAgICAgYnlfd2hvbTogb2xkLndob19nb2VzX25leHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8udG8sIHBpZWNlX3RoYXRfbW92ZXMpO1xyXG4gICAgICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLmZyb20sIG51bGwpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcGhhc2U6IFwicGllY2VfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgICAgICAgICBib2FyZDogb2xkLmJvYXJkLFxyXG4gICAgICAgICAgICAgICAgaGFuZF9vZl9ibGFjazogb2xkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgICAgICAgICBoYW5kX29mX3doaXRlOiBvbGQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICAgICAgICAgIGJ5X3dob206IG9sZC53aG9fZ29lc19uZXh0XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBgby5mcm9tYCDjgavpp5LjgYzjgYLjgaPjgabjgZ3jga7pp5LjgYwgYG8udG9gIOOBuOOBqOWLleOBj+S9meWcsOOBjOOBguOCi+OBi+OBqeOBhuOBi+OCkui/lOOBmeOAgmBvLnRvYCDjgYzlkbPmlrnjga7pp5Ljgafln4vjgb7jgaPjgabjgYTjgZ/jgokgZmFsc2Ug44Gg44GX44CB44Od44O844Oz44Gu5pac44KB5YmN44Gr5pW16aeS44GM44Gq44GE44Gq44KJ5pac44KB5YmN44GvIGZhbHNlIOOBqOOBquOCi+OAglxyXG4gKiAgQ2hlY2tzIHdoZXRoZXIgdGhlcmUgaXMgYSBwaWVjZSBhdCBgby5mcm9tYCB3aGljaCBjYW4gbW92ZSB0byBgby50b2AuIFdoZW4gYG8udG9gIGlzIG9jY3VwaWVkIGJ5IGFuIGFsbHksIHRoaXMgZnVuY3Rpb24gcmV0dXJucyBmYWxzZSxcclxuICogIGFuZCB3aGVuIHRoZXJlIGlzIG5vIGVuZW15IHBpZWNlIGRpYWdvbmFsIHRvIHBhd24sIHRoaXMgZnVuY3Rpb24gcmV0dXJucyBmYWxzZSBmb3IgdGhlIGRpYWdvbmFsIGRpcmVjdGlvbi5cclxuICogQHBhcmFtIGJvYXJkXHJcbiAqIEBwYXJhbSBvXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5mdW5jdGlvbiBjYW5fbW92ZShib2FyZCwgbykge1xyXG4gICAgY29uc3QgcCA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIG8uZnJvbSk7XHJcbiAgICBpZiAoIXApIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAocC50eXBlID09PSBcIueigVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcGllY2VfYXRfZGVzdGluYXRpb24gPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBvLnRvKTtcclxuICAgIGlmIChwaWVjZV9hdF9kZXN0aW5hdGlvbj8uc2lkZSA9PT0gcC5zaWRlKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgaWYgKHAucHJvZiAhPT0gXCLjg51cIikge1xyXG4gICAgICAgIHJldHVybiAoMCwgY2FuX3NlZV8xLmNhbl9zZWUpKGJvYXJkLCBvKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGRlbHRhID0gKDAsIHNpZGVfMS5jb29yZERpZmZTZWVuRnJvbSkocC5zaWRlLCBvKTtcclxuICAgIC8vIGNhbiBhbHdheXMgbW92ZSBmb3J3YXJkXHJcbiAgICBpZiAoZGVsdGEudiA9PT0gMSAmJiBkZWx0YS5oID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICAvLyBjYW4gdGFrZSBkaWFnb25hbGx5LCBhcyBsb25nIGFzIGFuIG9wcG9uZW50J3MgcGllY2UgaXMgbG9jYXRlZCB0aGVyZSwgb3Igd2hlbiBpdCBpcyBhbiBlbiBwYXNzYW50XHJcbiAgICBpZiAoZGVsdGEudiA9PT0gMSAmJiAoZGVsdGEuaCA9PT0gMSB8fCBkZWx0YS5oID09PSAtMSkpIHtcclxuICAgICAgICBpZiAocGllY2VfYXRfZGVzdGluYXRpb24/LnNpZGUgPT09ICgwLCBzaWRlXzEub3Bwb25lbnRPZikocC5zaWRlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkX2hvcml6b250YWxseV9hZGphY2VudCA9ICgwLCBzaWRlXzEuYXBwbHlEZWx0YVNlZW5Gcm9tKShwLnNpZGUsIG8uZnJvbSwgeyB2OiAwLCBoOiBkZWx0YS5oIH0pO1xyXG4gICAgICAgICAgICBjb25zdCBwaWVjZV9ob3Jpem9udGFsbHlfYWRqYWNlbnQgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBjb29yZF9ob3Jpem9udGFsbHlfYWRqYWNlbnQpO1xyXG4gICAgICAgICAgICBpZiAoby5mcm9tWzFdID09PSBcIuS6lFwiXHJcbiAgICAgICAgICAgICAgICAmJiBwaWVjZV9ob3Jpem9udGFsbHlfYWRqYWNlbnQ/LnR5cGUgPT09IFwi44K5XCJcclxuICAgICAgICAgICAgICAgICYmIHBpZWNlX2hvcml6b250YWxseV9hZGphY2VudC5wcm9mID09PSBcIuODnVwiXHJcbiAgICAgICAgICAgICAgICAmJiBwaWVjZV9ob3Jpem9udGFsbHlfYWRqYWNlbnQuc3ViamVjdF90b19lbl9wYXNzYW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJlbiBwYXNzYW50XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAocC5uZXZlcl9tb3ZlZCAmJiBkZWx0YS52ID09PSAyICYmIGRlbHRhLmggPT09IDApIHtcclxuICAgICAgICAvLyBjYW4gbW92ZSB0d28gaW4gdGhlIGZyb250LCB1bmxlc3MgYmxvY2tlZFxyXG4gICAgICAgIGNvbnN0IGNvb3JkX2luX2Zyb250ID0gKDAsIHNpZGVfMS5hcHBseURlbHRhU2VlbkZyb20pKHAuc2lkZSwgby5mcm9tLCB7IHY6IDEsIGg6IDAgfSk7XHJcbiAgICAgICAgY29uc3QgY29vcmRfdHdvX2luX2Zyb250ID0gKDAsIHNpZGVfMS5hcHBseURlbHRhU2VlbkZyb20pKHAuc2lkZSwgby5mcm9tLCB7IHY6IDIsIGg6IDAgfSk7XHJcbiAgICAgICAgaWYgKCgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIGNvb3JkX2luX2Zyb250KVxyXG4gICAgICAgICAgICB8fCAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBjb29yZF90d29faW5fZnJvbnQpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5jYW5fbW92ZSA9IGNhbl9tb3ZlO1xyXG5mdW5jdGlvbiBjYW5fbW92ZV9hbmRfbm90X2NhdXNlX2RvdWJsZWRfcGF3bnMoYm9hcmQsIG8pIHtcclxuICAgIGlmICghY2FuX21vdmUoYm9hcmQsIG8pKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgcGllY2UgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBvLmZyb20pO1xyXG4gICAgaWYgKHBpZWNlPy50eXBlID09PSBcIuOCuVwiICYmIHBpZWNlLnByb2YgPT09IFwi44OdXCIpIHtcclxuICAgICAgICBpZiAoby5mcm9tWzBdID09PSBvLnRvWzBdKSB7IC8vIG5vIHJpc2sgb2YgZG91YmxlZCBwYXducyB3aGVuIHRoZSBwYXduIG1vdmVzIHN0cmFpZ2h0XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgcGF3bl9jb29yZHMgPSAoMCwgYm9hcmRfMS5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZikoYm9hcmQsIHBpZWNlLnNpZGUsIFwi44OdXCIpO1xyXG4gICAgICAgICAgICBjb25zdCBwcm9ibGVtYXRpY19wYXducyA9IHBhd25fY29vcmRzLmZpbHRlcigoW2NvbCwgX3Jvd10pID0+IGNvbCA9PT0gby50b1swXSk7XHJcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGFyZSBubyBwcm9ibGVtYXRpYyBwYXducywgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgYXJlLCB3ZSB3YW50IHRvIGF2b2lkIHN1Y2ggYSBtb3ZlIGluIHRoaXMgZnVuY3Rpb24sIHNvIGZhbHNlXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9ibGVtYXRpY19wYXducy5sZW5ndGggPT09IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdGhyb3dzX2lmX3VuY2FzdGxhYmxlKGJvYXJkLCBvKSB7XHJcbiAgICBjb25zdCBraW5nID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgby5mcm9tKTtcclxuICAgIGlmIChraW5nPy50eXBlID09PSBcIueOi1wiKSB7XHJcbiAgICAgICAgaWYgKGtpbmcuaGFzX21vdmVkX29ubHlfb25jZSkge1xyXG4gICAgICAgICAgICBjb25zdCBkaWZmID0gKDAsIHNpZGVfMS5jb29yZERpZmZTZWVuRnJvbSkoa2luZy5zaWRlLCBvKTtcclxuICAgICAgICAgICAgaWYgKGRpZmYudiA9PT0gMCAmJiAoZGlmZi5oID09PSAyIHx8IGRpZmYuaCA9PT0gLTIpICYmXHJcbiAgICAgICAgICAgICAgICAoKGtpbmcuc2lkZSA9PT0gXCLpu5JcIiAmJiBvLmZyb21bMV0gPT09IFwi5YWrXCIpIHx8IChraW5nLnNpZGUgPT09IFwi55m9XCIgJiYgby5mcm9tWzFdID09PSBcIuS6jFwiKSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIOOBk+OCjOOBi+OCieaknOafu++8mlxyXG4gICAgICAgICAgICAgICAgLy8g4pGhIOOCreODo+OCueODquODs+OCsOWvvuixoeOBruODq+ODvOOCr++8iOS7peS4i0HvvInjga/kuIDluqbjgoLli5XjgYTjgabjgYrjgonjgZpcclxuICAgICAgICAgICAgICAgIC8vIOKRoiDnm7jmiYvjgYvjgonjga7njovmiYvvvIjjg4Hjgqfjg4Pjgq/vvInjgYzmjpvjgYvjgaPjgabjgYrjgonjgZrnp7vli5XlhYjjga7jg57jgrnjgajpgJrpgY7ngrnjga7jg57jgrnjgavjgoLmlbXjga7pp5Ljga7liKnjgY3jga/jgarjgY9cclxuICAgICAgICAgICAgICAgIC8vIOKRoyDjgq3jg7PjgrDnjovjgahB44Gu6ZaT44Gr6aeS77yI44OB44Kn44K544CB5bCG5qOL77yJ44GM54Sh44GE5aC05ZCI44Gr5L2/55So44Gn44GN44KLXHJcbiAgICAgICAgICAgICAgICBjb25zdCBmcm9tX2NvbHVtbl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihvLmZyb21bMF0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdG9fY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKG8udG9bMF0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm9va19jb29yZCA9IFtmcm9tX2NvbHVtbl9pbmRleCA8IHRvX2NvbHVtbl9pbmRleCA/IFwi77yRXCIgOiBcIu+8mVwiLCBvLmZyb21bMV1dO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm9vayA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIHJvb2tfY29vcmQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29vcmRfdGhhdF9raW5nX3Bhc3Nlc190aHJvdWdoID0gW1wi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCJbKGZyb21fY29sdW1uX2luZGV4ICsgdG9fY29sdW1uX2luZGV4KSAvIDJdLCBvLmZyb21bMV1dO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJvb2s/LnR5cGUgIT09IFwi44K5XCIgfHwgcm9vay5wcm9mICE9PSBcIuODq1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2tpbmcuc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBqOOCreODs+OCsOeOi+OCkuOCreODo+OCueODquODs+OCsOOBl+OCiOOBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHJvb2tfY29vcmQpfeOBq+ODq+ODvOOCr+OBjOOBquOBhOOBruOBp+OCreODo+OCueODquODs+OCsOOBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFyb29rLm5ldmVyX21vdmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2tpbmcuc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBqOOCreODs+OCsOeOi+OCkuOCreODo+OCueODquODs+OCsOOBl+OCiOOBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHJvb2tfY29vcmQpfeOBq+OBguOCi+ODq+ODvOOCr+OBr+aXouOBq+WLleOBhOOBn+OBk+OBqOOBjOOBguOCi+ODq+ODvOOCr+OBquOBruOBp+OCreODo+OCueODquODs+OCsOOBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCgwLCBjYW5fc2VlXzEuZG9fYW55X29mX215X3BpZWNlc19zZWUpKGJvYXJkLCBvLmZyb20sICgwLCBzaWRlXzEub3Bwb25lbnRPZikoa2luZy5zaWRlKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7a2luZy5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Go44Kt44Oz44Kw546L44KS44Kt44Oj44K544Oq44Oz44Kw44GX44KI44GG44Go44GX44Gm44GE44G+44GZ44GM44CB55u45omL44GL44KJ44Gu546L5omL77yI44OB44Kn44OD44Kv77yJ44GM5o6b44GL44Gj44Gm44GE44KL44Gu44Gn44Kt44Oj44K544Oq44Oz44Kw44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoKDAsIGNhbl9zZWVfMS5kb19hbnlfb2ZfbXlfcGllY2VzX3NlZSkoYm9hcmQsIGNvb3JkX3RoYXRfa2luZ19wYXNzZXNfdGhyb3VnaCwgKDAsIHNpZGVfMS5vcHBvbmVudE9mKShraW5nLnNpZGUpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtraW5nLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjgajjgq3jg7PjgrDnjovjgpLjgq3jg6Pjgrnjg6rjg7PjgrDjgZfjgojjgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIHpgJrpgY7ngrnjga7jg57jgrnjgavmlbXjga7pp5Ljga7liKnjgY3jgYzjgYLjgovjga7jgafjgq3jg6Pjgrnjg6rjg7PjgrDjgafjgY3jgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgoMCwgY2FuX3NlZV8xLmRvX2FueV9vZl9teV9waWVjZXNfc2VlKShib2FyZCwgby50bywgKDAsIHNpZGVfMS5vcHBvbmVudE9mKShraW5nLnNpZGUpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtraW5nLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjgajjgq3jg7PjgrDnjovjgpLjgq3jg6Pjgrnjg6rjg7PjgrDjgZfjgojjgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIHnp7vli5XlhYjjga7jg57jgrnjgavmlbXjga7pp5Ljga7liKnjgY3jgYzjgYLjgovjga7jgafjgq3jg6Pjgrnjg6rjg7PjgrDjgafjgY3jgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB7IGNvb3JkX3RoYXRfa2luZ19wYXNzZXNfdGhyb3VnaCwgcm9vaywgcm9va19jb29yZCwga2luZyB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhyb3cgbmV3IEVycm9yKGDjgq3jg6Pjgrnjg6rjg7PjgrDjgafjga/jgYLjgorjgb7jgZvjgpNgKTtcclxufVxyXG5leHBvcnRzLnRocm93c19pZl91bmNhc3RsYWJsZSA9IHRocm93c19pZl91bmNhc3RsYWJsZTtcclxuZnVuY3Rpb24gY2FzdGxpbmcob2xkLCBvKSB7XHJcbiAgICAvLyDmpJzmn7vmuIjvvJpcclxuICAgIC8vIOKRoCDjgq3jg7PjgrDnjovjgYwx5Zue44Gg44GR5YmN6YCy44GX44Gf54q25oWL44GnXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAvLyDjgZPjgozjgYvjgonmpJzmn7vvvJpcclxuICAgIC8vIOKRoSDjgq3jg6Pjgrnjg6rjg7PjgrDlr77osaHjga7jg6vjg7zjgq/vvIjku6XkuItB77yJ44Gv5LiA5bqm44KC5YuV44GE44Gm44GK44KJ44GaXHJcbiAgICAvLyDikaIg55u45omL44GL44KJ44Gu546L5omL77yI44OB44Kn44OD44Kv77yJ44GM5o6b44GL44Gj44Gm44GK44KJ44Ga56e75YuV5YWI44Gu44Oe44K544Go6YCa6YGO54K544Gu44Oe44K544Gr44KC5pW144Gu6aeS44Gu5Yip44GN44Gv44Gq44GPXHJcbiAgICAvLyDikaMg44Kt44Oz44Kw546L44GoQeOBrumWk+OBq+mnku+8iOODgeOCp+OCueOAgeWwhuaji++8ieOBjOeEoeOBhOWgtOWQiOOBq+S9v+eUqOOBp+OBjeOCi1xyXG4gICAgY29uc3QgeyBjb29yZF90aGF0X2tpbmdfcGFzc2VzX3Rocm91Z2gsIHJvb2tfY29vcmQsIHJvb2sgfSA9IHRocm93c19pZl91bmNhc3RsYWJsZShvbGQuYm9hcmQsIG8pO1xyXG4gICAgY29uc3QgY29vcmRzX2JldHdlZW5fa2luZ19hbmRfcm9vayA9ICgwLCBjb29yZGluYXRlXzEuY29sdW1uc0JldHdlZW4pKG8uZnJvbVswXSwgby50b1swXSkubWFwKGNvbCA9PiBbY29sLCBvLmZyb21bMV1dKTtcclxuICAgIGNvbnN0IGhhc19zaG9naV9vcl9jaGVzc19waWVjZSA9IGNvb3Jkc19iZXR3ZWVuX2tpbmdfYW5kX3Jvb2suc29tZShjb29yZCA9PiB7XHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShvbGQuYm9hcmQsIGNvb3JkKTtcclxuICAgICAgICByZXR1cm4gZW50aXR5Py50eXBlID09PSBcIuOBl+OCh1wiIHx8IGVudGl0eT8udHlwZSA9PT0gXCLjgrlcIiB8fCBlbnRpdHk/LnR5cGUgPT09IFwi56KBXCI7XHJcbiAgICB9KTtcclxuICAgIGlmIChoYXNfc2hvZ2lfb3JfY2hlc3NfcGllY2UpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Go44Kt44Oz44Kw546L44KS44Kt44Oj44K544Oq44Oz44Kw44GX44KI44GG44Go44GX44Gm44GE44G+44GZ44GM44CB44Kt44Oz44Kw546L44Go44Or44O844Kv44Gu6ZaT44Gr6aeS44GM44GC44KL44Gu44Gn44Kt44Oj44K544Oq44Oz44Kw44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICB9XHJcbiAgICAvLyDikaQg6ZaT44Gr56KB55+z44GM44GC44KM44Gw5Y+W44KK6Zmk44GNXHJcbiAgICBjb29yZHNfYmV0d2Vlbl9raW5nX2FuZF9yb29rLmZvckVhY2goY29vcmQgPT4gKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgY29vcmQsIG51bGwpKTtcclxuICAgIC8vIOKRpSDjgq3jg7PjgrDnjovjga8gQSDjga7mlrnlkJHjgasgMiDjg57jgrnnp7vli5XjgZdcclxuICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8udG8sIHtcclxuICAgICAgICBwcm9mOiBcIuOCrVwiLFxyXG4gICAgICAgIHNpZGU6IG8uc2lkZSxcclxuICAgICAgICB0eXBlOiBcIueOi1wiLFxyXG4gICAgICAgIGhhc19tb3ZlZF9vbmx5X29uY2U6IGZhbHNlLFxyXG4gICAgICAgIG5ldmVyX21vdmVkOiBmYWxzZSxcclxuICAgIH0pO1xyXG4gICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby5mcm9tLCBudWxsKTtcclxuICAgIC8vIOKRpiBBIOOBr+OCreODs+OCsOeOi+OCkumjm+OBs+i2iuOBl+OBn+mao+OBruODnuOCueOBq+enu+WLleOBmeOCi1xyXG4gICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgY29vcmRfdGhhdF9raW5nX3Bhc3Nlc190aHJvdWdoLCByb29rKTtcclxuICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIHJvb2tfY29vcmQsIG51bGwpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwaGFzZTogXCJwaWVjZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICBib2FyZDogb2xkLmJvYXJkLFxyXG4gICAgICAgIGhhbmRfb2ZfYmxhY2s6IG9sZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgIGJ5X3dob206IG9sZC53aG9fZ29lc19uZXh0XHJcbiAgICB9O1xyXG59XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuYXBwbHlEZWx0YVNlZW5Gcm9tID0gZXhwb3J0cy5pc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3MgPSBleHBvcnRzLmNvb3JkRGlmZlNlZW5Gcm9tID0gZXhwb3J0cy5MZWZ0bW9zdFdoZW5TZWVuRnJvbSA9IGV4cG9ydHMuUmlnaHRtb3N0V2hlblNlZW5Gcm9tID0gZXhwb3J0cy5vcHBvbmVudE9mID0gdm9pZCAwO1xyXG5jb25zdCBjb29yZGluYXRlXzEgPSByZXF1aXJlKFwiLi9jb29yZGluYXRlXCIpO1xyXG5mdW5jdGlvbiBvcHBvbmVudE9mKHNpZGUpIHtcclxuICAgIGlmIChzaWRlID09PSBcIum7klwiKVxyXG4gICAgICAgIHJldHVybiBcIueZvVwiO1xyXG4gICAgZWxzZVxyXG4gICAgICAgIHJldHVybiBcIum7klwiO1xyXG59XHJcbmV4cG9ydHMub3Bwb25lbnRPZiA9IG9wcG9uZW50T2Y7XHJcbmZ1bmN0aW9uIFJpZ2h0bW9zdFdoZW5TZWVuRnJvbShzaWRlLCBjb29yZHMpIHtcclxuICAgIGlmIChzaWRlID09PSBcIum7klwiKSB7XHJcbiAgICAgICAgcmV0dXJuICgwLCBjb29yZGluYXRlXzEuUmlnaHRtb3N0V2hlblNlZW5Gcm9tQmxhY2spKGNvb3Jkcyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gKDAsIGNvb3JkaW5hdGVfMS5MZWZ0bW9zdFdoZW5TZWVuRnJvbUJsYWNrKShjb29yZHMpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuUmlnaHRtb3N0V2hlblNlZW5Gcm9tID0gUmlnaHRtb3N0V2hlblNlZW5Gcm9tO1xyXG5mdW5jdGlvbiBMZWZ0bW9zdFdoZW5TZWVuRnJvbShzaWRlLCBjb29yZHMpIHtcclxuICAgIGlmIChzaWRlID09PSBcIum7klwiKSB7XHJcbiAgICAgICAgcmV0dXJuICgwLCBjb29yZGluYXRlXzEuTGVmdG1vc3RXaGVuU2VlbkZyb21CbGFjaykoY29vcmRzKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAoMCwgY29vcmRpbmF0ZV8xLlJpZ2h0bW9zdFdoZW5TZWVuRnJvbUJsYWNrKShjb29yZHMpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuTGVmdG1vc3RXaGVuU2VlbkZyb20gPSBMZWZ0bW9zdFdoZW5TZWVuRnJvbTtcclxuLyoqIHZlcnRpY2FsIOOBjCArMSA9IOWJjemAsuOAgOOAgGhvcml6b250YWwg44GMICsxID0g5bemXHJcbiAqL1xyXG5mdW5jdGlvbiBjb29yZERpZmZTZWVuRnJvbShzaWRlLCBvKSB7XHJcbiAgICBpZiAoc2lkZSA9PT0gXCLnmb1cIikge1xyXG4gICAgICAgIHJldHVybiAoMCwgY29vcmRpbmF0ZV8xLmNvb3JkRGlmZikobyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCB7IGgsIHYgfSA9ICgwLCBjb29yZGluYXRlXzEuY29vcmREaWZmKShvKTtcclxuICAgICAgICByZXR1cm4geyBoOiAtaCwgdjogLXYgfTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmNvb3JkRGlmZlNlZW5Gcm9tID0gY29vcmREaWZmU2VlbkZyb207XHJcbmZ1bmN0aW9uIGlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cyhuLCBzaWRlLCBjb29yZCkge1xyXG4gICAgY29uc3Qgcm93ID0gY29vcmRbMV07XHJcbiAgICBpZiAoc2lkZSA9PT0gXCLpu5JcIikge1xyXG4gICAgICAgIHJldHVybiBcIuS4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5nVwiLmluZGV4T2Yocm93KSA8IG47XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gXCLkuZ3lhavkuIPlha3kupTlm5vkuInkuozkuIBcIi5pbmRleE9mKHJvdykgPCBuO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzID0gaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzO1xyXG4vLyBzaW5jZSB0aGlzIGZ1bmN0aW9uIGlzIG9ubHkgdXNlZCB0byBpbnRlcnBvbGF0ZSBiZXR3ZWVuIHR3byB2YWxpZCBwb2ludHMsIHRoZXJlIGlzIG5vIG5lZWQgdG8gcGVyZm9ybSBhbmQgb3V0LW9mLWJvdW5kcyBjaGVjay5cclxuZnVuY3Rpb24gYXBwbHlEZWx0YVNlZW5Gcm9tKHNpZGUsIGZyb20sIGRlbHRhKSB7XHJcbiAgICBpZiAoc2lkZSA9PT0gXCLnmb1cIikge1xyXG4gICAgICAgIGNvbnN0IFtmcm9tX2NvbHVtbiwgZnJvbV9yb3ddID0gZnJvbTtcclxuICAgICAgICBjb25zdCBmcm9tX3Jvd19pbmRleCA9IFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZihmcm9tX3Jvdyk7XHJcbiAgICAgICAgY29uc3QgZnJvbV9jb2x1bW5faW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2YoZnJvbV9jb2x1bW4pO1xyXG4gICAgICAgIGNvbnN0IHRvX2NvbHVtbl9pbmRleCA9IGZyb21fY29sdW1uX2luZGV4ICsgZGVsdGEuaDtcclxuICAgICAgICBjb25zdCB0b19yb3dfaW5kZXggPSBmcm9tX3Jvd19pbmRleCArIGRlbHRhLnY7XHJcbiAgICAgICAgY29uc3QgY29sdW1ucyA9IFtcIu+8mVwiLCBcIu+8mFwiLCBcIu+8l1wiLCBcIu+8llwiLCBcIu+8lVwiLCBcIu+8lFwiLCBcIu+8k1wiLCBcIu+8klwiLCBcIu+8kVwiXTtcclxuICAgICAgICBjb25zdCByb3dzID0gW1wi5LiAXCIsIFwi5LqMXCIsIFwi5LiJXCIsIFwi5ZubXCIsIFwi5LqUXCIsIFwi5YWtXCIsIFwi5LiDXCIsIFwi5YWrXCIsIFwi5LmdXCJdO1xyXG4gICAgICAgIHJldHVybiBbY29sdW1uc1t0b19jb2x1bW5faW5kZXhdLCByb3dzW3RvX3Jvd19pbmRleF1dO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgW2Zyb21fY29sdW1uLCBmcm9tX3Jvd10gPSBmcm9tO1xyXG4gICAgICAgIGNvbnN0IGZyb21fcm93X2luZGV4ID0gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIi5pbmRleE9mKGZyb21fcm93KTtcclxuICAgICAgICBjb25zdCBmcm9tX2NvbHVtbl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihmcm9tX2NvbHVtbik7XHJcbiAgICAgICAgY29uc3QgdG9fY29sdW1uX2luZGV4ID0gZnJvbV9jb2x1bW5faW5kZXggLSBkZWx0YS5oO1xyXG4gICAgICAgIGNvbnN0IHRvX3Jvd19pbmRleCA9IGZyb21fcm93X2luZGV4IC0gZGVsdGEudjtcclxuICAgICAgICBjb25zdCBjb2x1bW5zID0gW1wi77yZXCIsIFwi77yYXCIsIFwi77yXXCIsIFwi77yWXCIsIFwi77yVXCIsIFwi77yUXCIsIFwi77yTXCIsIFwi77ySXCIsIFwi77yRXCJdO1xyXG4gICAgICAgIGNvbnN0IHJvd3MgPSBbXCLkuIBcIiwgXCLkuoxcIiwgXCLkuIlcIiwgXCLlm5tcIiwgXCLkupRcIiwgXCLlha1cIiwgXCLkuINcIiwgXCLlhatcIiwgXCLkuZ1cIl07XHJcbiAgICAgICAgcmV0dXJuIFtjb2x1bW5zW3RvX2NvbHVtbl9pbmRleF0sIHJvd3NbdG9fcm93X2luZGV4XV07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5hcHBseURlbHRhU2VlbkZyb20gPSBhcHBseURlbHRhU2VlbkZyb207XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMucmVtb3ZlX3N1cnJvdW5kZWQgPSB2b2lkIDA7XHJcbmZ1bmN0aW9uIHJlbW92ZV9zdXJyb3VuZGVkKGNvbG9yX3RvX2JlX3JlbW92ZWQsIGJvYXJkKSB7XHJcbiAgICBjb25zdCBib2FyZF8gPSBib2FyZC5tYXAocm93ID0+IHJvdy5tYXAoc2lkZSA9PiBzaWRlID09PSBudWxsID8gXCJlbXB0eVwiIDogeyBzaWRlLCB2aXNpdGVkOiBmYWxzZSwgY29ubmVjdGVkX2NvbXBvbmVudF9pbmRleDogLTEgfSkpO1xyXG4gICAgLy8gRGVwdGgtZmlyc3Qgc2VhcmNoIHRvIGFzc2lnbiBhIHVuaXF1ZSBpbmRleCB0byBlYWNoIGNvbm5lY3RlZCBjb21wb25lbnRcclxuICAgIC8vIOWQhOmAo+e1kOaIkOWIhuOBq+S4gOaEj+OBquOCpOODs+ODh+ODg+OCr+OCueOCkuOBteOCi+OBn+OCgeOBrua3seOBleWEquWFiOaOoue0olxyXG4gICAgY29uc3QgZGZzX3N0YWNrID0gW107XHJcbiAgICBjb25zdCBpbmRpY2VzX3RoYXRfc3Vydml2ZSA9IFtdO1xyXG4gICAgbGV0IGluZGV4ID0gMDtcclxuICAgIGZvciAobGV0IEkgPSAwOyBJIDwgYm9hcmRfLmxlbmd0aDsgSSsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgSiA9IDA7IEogPCBib2FyZF9bSV0ubGVuZ3RoOyBKKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgc3EgPSBib2FyZF9bSV1bSl07XHJcbiAgICAgICAgICAgIGlmIChzcSAhPT0gXCJlbXB0eVwiICYmIHNxLnNpZGUgPT09IGNvbG9yX3RvX2JlX3JlbW92ZWQgJiYgIXNxLnZpc2l0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGRmc19zdGFjay5wdXNoKHsgaTogSSwgajogSiB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aGlsZSAoZGZzX3N0YWNrLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleF9jb29yZCA9IGRmc19zdGFjay5wb3AoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZlcnRleCA9IGJvYXJkX1t2ZXJ0ZXhfY29vcmQuaV1bdmVydGV4X2Nvb3JkLmpdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZlcnRleCA9PT0gXCJlbXB0eVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYGRmc19zdGFja2Ag44Gr56m644Gu44Oe44K544Gv44OX44OD44K344Ol44GV44KM44Gm44GE44Gq44GE44Gv44GaXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYW4gZW1wdHkgc3F1YXJlIHNob3VsZCBub3QgYmUgcHVzaGVkIHRvIGBkZnNfc3RhY2tgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2hvdWxkIG5vdCByZWFjaCBoZXJlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmVydGV4LnZpc2l0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdmVydGV4LmNvbm5lY3RlZF9jb21wb25lbnRfaW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICB7IGk6IHZlcnRleF9jb29yZC5pLCBqOiB2ZXJ0ZXhfY29vcmQuaiArIDEgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IGk6IHZlcnRleF9jb29yZC5pLCBqOiB2ZXJ0ZXhfY29vcmQuaiAtIDEgfSxcclxuICAgICAgICAgICAgICAgICAgICB7IGk6IHZlcnRleF9jb29yZC5pICsgMSwgajogdmVydGV4X2Nvb3JkLmogfSxcclxuICAgICAgICAgICAgICAgICAgICB7IGk6IHZlcnRleF9jb29yZC5pIC0gMSwgajogdmVydGV4X2Nvb3JkLmogfSxcclxuICAgICAgICAgICAgICAgIF0uZmlsdGVyKCh7IGksIGogfSkgPT4geyBjb25zdCByb3cgPSBib2FyZF9baV07IHJldHVybiByb3cgJiYgMCA8PSBqICYmIGogPCByb3cubGVuZ3RoOyB9KS5mb3JFYWNoKCh7IGksIGogfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5laWdoYm9yID0gYm9hcmRfW2ldW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZWlnaGJvciA9PT0gXCJlbXB0eVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5leHQgdG8gYW4gZW1wdHkgc3F1YXJlIChhIGxpYmVydHkpOyBzdXJ2aXZlcy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g5ZG85ZC454K544GM6Zqj5o6l44GX44Gm44GE44KL44Gu44Gn44CB44GT44GuIGluZGV4IOOBjOaMr+OCieOCjOOBpuOBhOOCi+mAo+e1kOaIkOWIhuOBr+S4uOOAheeUn+OBjeW7tuOBs+OCi1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRpY2VzX3RoYXRfc3Vydml2ZS5wdXNoKGluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAobmVpZ2hib3Iuc2lkZSA9PT0gY29sb3JfdG9fYmVfcmVtb3ZlZCAmJiAhbmVpZ2hib3IudmlzaXRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZnNfc3RhY2sucHVzaCh7IGksIGogfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBpbmRpY2VzX3RoYXRfc3Vydml2ZSDjgavoqJjovInjga7jgarjgYQgaW5kZXgg44Gu44KE44Gk44KJ44KS5YmK6Zmk44GX44GmIGFucyDjgbjjgajou6LoqJhcclxuICAgIC8vIENvcHkgdGhlIGNvbnRlbnQgdG8gYGFuc2Agd2hpbGUgZGVsZXRpbmcgdGhlIGNvbm5lY3RlZCBjb21wb25lbnRzIHdob3NlIGluZGV4IGlzIG5vdCBpbiBgaW5kaWNlc190aGF0X3N1cnZpdmVgXHJcbiAgICBjb25zdCBhbnMgPSBbXTtcclxuICAgIGZvciAobGV0IEkgPSAwOyBJIDwgYm9hcmRfLmxlbmd0aDsgSSsrKSB7XHJcbiAgICAgICAgY29uc3Qgcm93ID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgSiA9IDA7IEogPCBib2FyZF9bSV0ubGVuZ3RoOyBKKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgc3EgPSBib2FyZF9bSV1bSl07XHJcbiAgICAgICAgICAgIGlmIChzcSA9PT0gXCJlbXB0eVwiKSB7XHJcbiAgICAgICAgICAgICAgICByb3cucHVzaChudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChzcS5zaWRlID09PSBjb2xvcl90b19iZV9yZW1vdmVkXHJcbiAgICAgICAgICAgICAgICAmJiAhaW5kaWNlc190aGF0X3N1cnZpdmUuaW5jbHVkZXMoc3EuY29ubmVjdGVkX2NvbXBvbmVudF9pbmRleCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRvZXMgbm90IHN1cnZpdmVcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcm93LnB1c2goc3Euc2lkZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYW5zLnB1c2gocm93KTtcclxuICAgIH1cclxuICAgIHJldHVybiBhbnM7XHJcbn1cclxuZXhwb3J0cy5yZW1vdmVfc3Vycm91bmRlZCA9IHJlbW92ZV9zdXJyb3VuZGVkO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmlzX3Byb21vdGFibGUgPSBleHBvcnRzLmlzVW5wcm9tb3RlZFNob2dpUHJvZmVzc2lvbiA9IGV4cG9ydHMucHJvZmVzc2lvbkZ1bGxOYW1lID0gZXhwb3J0cy51bnByb21vdGUgPSB2b2lkIDA7XHJcbmZ1bmN0aW9uIHVucHJvbW90ZShhKSB7XHJcbiAgICBpZiAoYSA9PT0gXCLmiJDmoYJcIilcclxuICAgICAgICByZXR1cm4gXCLmoYJcIjtcclxuICAgIGlmIChhID09PSBcIuaIkOmKgFwiKVxyXG4gICAgICAgIHJldHVybiBcIumKgFwiO1xyXG4gICAgaWYgKGEgPT09IFwi5oiQ6aaZXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi6aaZXCI7XHJcbiAgICByZXR1cm4gYTtcclxufVxyXG5leHBvcnRzLnVucHJvbW90ZSA9IHVucHJvbW90ZTtcclxuZnVuY3Rpb24gcHJvZmVzc2lvbkZ1bGxOYW1lKGEpIHtcclxuICAgIGlmIChhID09PSBcIuOBqFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44Go44Kv44Kj44O844OzXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIuOCrVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44Kt44Oz44Kw546LXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIuOCr1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44Kv44Kj44O844OzXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIuODilwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44OK44Kk44OIXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIuODk1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44OT44K344On44OD44OXXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIuODnVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44Od44O844Oz5YW1XCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIuODq1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44Or44O844KvXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIui2hVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi44K544O844OR44O844Kt44Oz44Kw546LXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIuahglwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi5qGC6aasXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIummmVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi6aaZ6LuKXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIumKgFwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi6YqA5bCGXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhID09PSBcIumHkVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi6YeR5bCGXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLnByb2Zlc3Npb25GdWxsTmFtZSA9IHByb2Zlc3Npb25GdWxsTmFtZTtcclxuZnVuY3Rpb24gaXNVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uKGEpIHtcclxuICAgIHJldHVybiBhID09PSBcIummmVwiIHx8XHJcbiAgICAgICAgYSA9PT0gXCLmoYJcIiB8fFxyXG4gICAgICAgIGEgPT09IFwi6YqAXCIgfHxcclxuICAgICAgICBhID09PSBcIumHkVwiO1xyXG59XHJcbmV4cG9ydHMuaXNVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uID0gaXNVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uO1xyXG5mdW5jdGlvbiBpc19wcm9tb3RhYmxlKHByb2YpIHtcclxuICAgIHJldHVybiBwcm9mID09PSBcIuahglwiIHx8IHByb2YgPT09IFwi6YqAXCIgfHwgcHJvZiA9PT0gXCLppplcIiB8fCBwcm9mID09PSBcIuOCrVwiIHx8IHByb2YgPT09IFwi44OdXCI7XHJcbn1cclxuZXhwb3J0cy5pc19wcm9tb3RhYmxlID0gaXNfcHJvbW90YWJsZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5wYXJzZSA9IGV4cG9ydHMubXVuY2hfb25lID0gZXhwb3J0cy5wYXJzZV9vbmUgPSBleHBvcnRzLnBhcnNlX3Byb2Zlc3Npb24gPSBleHBvcnRzLnBhcnNlX2Nvb3JkID0gdm9pZCAwO1xyXG5mdW5jdGlvbiBwYXJzZV9jb29yZChzKSB7XHJcbiAgICBjb25zdCBjb2x1bW4gPSAoKGMpID0+IHtcclxuICAgICAgICBpZiAoYyA9PT0gXCLvvJFcIiB8fCBjID09PSBcIjFcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJFcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJJcIiB8fCBjID09PSBcIjJcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJNcIiB8fCBjID09PSBcIjNcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJNcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJRcIiB8fCBjID09PSBcIjRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJVcIiB8fCBjID09PSBcIjVcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJZcIiB8fCBjID09PSBcIjZcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJZcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJdcIiB8fCBjID09PSBcIjdcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJdcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJhcIiB8fCBjID09PSBcIjhcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJhcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJlcIiB8fCBjID09PSBcIjlcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLvvJlcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5qOL6K2c44Gu562L77yI5YiX77yJ44GM44CMJHtjfeOAjeOBp+OBguOCiuOAjO+8keOAnO+8meOAjeOAjDHjgJw544CN44Gu44Gp44KM44Gn44KC44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkoc1swXSk7XHJcbiAgICBjb25zdCByb3cgPSAoKGMpID0+IHtcclxuICAgICAgICBpZiAoYyA9PT0gXCLvvJFcIiB8fCBjID09PSBcIjFcIiB8fCBjID09PSBcIuS4gFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuS4gFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8klwiIHx8IGMgPT09IFwiMlwiIHx8IGMgPT09IFwi5LqMXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwi5LqMXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yTXCIgfHwgYyA9PT0gXCIzXCIgfHwgYyA9PT0gXCLkuIlcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLkuIlcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJRcIiB8fCBjID09PSBcIjRcIiB8fCBjID09PSBcIuWbm1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuWbm1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8lVwiIHx8IGMgPT09IFwiNVwiIHx8IGMgPT09IFwi5LqUXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwi5LqUXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yWXCIgfHwgYyA9PT0gXCI2XCIgfHwgYyA9PT0gXCLlha1cIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLlha1cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJdcIiB8fCBjID09PSBcIjdcIiB8fCBjID09PSBcIuS4g1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuS4g1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8mFwiIHx8IGMgPT09IFwiOFwiIHx8IGMgPT09IFwi5YWrXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwi5YWrXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yZXCIgfHwgYyA9PT0gXCI5XCIgfHwgYyA9PT0gXCLkuZ1cIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLkuZ1cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg5qOL6K2c44Gu5q6177yI6KGM77yJ44GM44CMJHtjfeOAjeOBp+OBguOCiuOAjO+8keOAnO+8meOAjeOAjDHjgJw544CN44CM5LiA44Cc5Lmd44CN44Gu44Gp44KM44Gn44KC44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkoc1sxXSk7XHJcbiAgICByZXR1cm4gW2NvbHVtbiwgcm93XTtcclxufVxyXG5leHBvcnRzLnBhcnNlX2Nvb3JkID0gcGFyc2VfY29vcmQ7XHJcbmZ1bmN0aW9uIHBhcnNlX3Byb2Zlc3Npb24ocykge1xyXG4gICAgaWYgKHMgPT09IFwi6aaZXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi6aaZXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuahglwiKVxyXG4gICAgICAgIHJldHVybiBcIuahglwiO1xyXG4gICAgZWxzZSBpZiAocyA9PT0gXCLpioBcIilcclxuICAgICAgICByZXR1cm4gXCLpioBcIjtcclxuICAgIGVsc2UgaWYgKHMgPT09IFwi6YeRXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi6YeRXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuaIkOmmmVwiIHx8IHMgPT09IFwi5p2PXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi5oiQ6aaZXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuaIkOahglwiIHx8IHMgPT09IFwi5ZytXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi5oiQ5qGCXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuaIkOmKgFwiIHx8IHMgPT09IFwi5YWoXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi5oiQ6YqAXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuOCr1wiKVxyXG4gICAgICAgIHJldHVybiBcIuOCr1wiO1xyXG4gICAgZWxzZSBpZiAocyA9PT0gXCLjg6tcIilcclxuICAgICAgICByZXR1cm4gXCLjg6tcIjtcclxuICAgIGVsc2UgaWYgKHMgPT09IFwi44OKXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi44OKXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuODk1wiKVxyXG4gICAgICAgIHJldHVybiBcIuODk1wiO1xyXG4gICAgZWxzZSBpZiAocyA9PT0gXCLjg51cIiB8fCBzID09PSBcIuatqVwiIHx8IHMgPT09IFwi5YW1XCIpXHJcbiAgICAgICAgcmV0dXJuIFwi44OdXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuOBqFwiKVxyXG4gICAgICAgIHJldHVybiBcIuOBqFwiO1xyXG4gICAgZWxzZSBpZiAocyA9PT0gXCLjgq1cIiB8fCBzID09PSBcIueOi1wiKVxyXG4gICAgICAgIHJldHVybiBcIuOCrVwiO1xyXG4gICAgZWxzZSBpZiAocyA9PT0gXCLotoVcIilcclxuICAgICAgICByZXR1cm4gXCLotoVcIjtcclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihg6aeS44Gu56iu6aGe44GM44CMJHtzfeOAjeOBp+OBguOCiuOAjOmmmeOAjeOAjOahguOAjeOAjOmKgOOAjeOAjOmHkeOAjeOAjOaIkOmmmeOAjeOAjOaIkOahguOAjeOAjOaIkOmKgOOAjeOAjOadj+OAjeOAjOWcreOAjeOAjOWFqOOAjeOAjOOCr+OAjeOAjOODq+OAjeOAjOODiuOAjeOAjOODk+OAjeOAjOODneOAjeOAjOatqeOAjeOAjOWFteOAjeOAjOOBqOOAjeOAjOOCreOAjeOAjOeOi+OAjeOAjOi2heOAjeOBruOBqeOCjOOBp+OCguOBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMucGFyc2VfcHJvZmVzc2lvbiA9IHBhcnNlX3Byb2Zlc3Npb247XHJcbmZ1bmN0aW9uIHBhcnNlX29uZShzKSB7XHJcbiAgICBjb25zdCB7IG1vdmUsIHJlc3QgfSA9IG11bmNoX29uZShzKTtcclxuICAgIGlmIChyZXN0ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDmiYvjgIwke3N944CN44Gu5pyr5bC+44Gr6Kej6YeI5LiN6IO944Gq44CMJHtyZXN0feOAjeOBjOOBguOCiuOBvuOBmWApO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG1vdmU7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5wYXJzZV9vbmUgPSBwYXJzZV9vbmU7XHJcbmZ1bmN0aW9uIG11bmNoX29uZShzKSB7XHJcbiAgICAvLyAwOiAgIOKWslxyXG4gICAgLy8gMS0yOiDvvJfkupRcclxuICAgIC8vIDM6IOODnVxyXG4gICAgLy8gKDMtNCBpZiBwcm9tb3RlZClcclxuICAgIGxldCBpbmRleCA9IDA7XHJcbiAgICBjb25zdCBzaWRlID0gc1swXSA9PT0gXCLpu5JcIiB8fCBzWzBdID09PSBcIuKWslwiIHx8IHNbMF0gPT09IFwi4piXXCIgPyBcIum7klwiIDpcclxuICAgICAgICBzWzBdID09PSBcIueZvVwiIHx8IHNbMF0gPT09IFwi4pazXCIgfHwgc1swXSA9PT0gXCLimJZcIiA/IFwi55m9XCIgOiAoKCkgPT4geyB0aHJvdyBuZXcgRXJyb3IoXCLmo4vorZzjgYzjgIzpu5LjgI3jgIzilrLjgI3jgIzimJfjgI3jgIznmb3jgI3jgIzilrPjgI3jgIzimJbjgI3jga7jganjgozjgYvjgaflp4vjgb7jgaPjgabjgYTjgb7jgZvjgpNcIik7IH0pKCk7XHJcbiAgICBpbmRleCsrO1xyXG4gICAgY29uc3QgdG8gPSBwYXJzZV9jb29yZChzLnNsaWNlKGluZGV4LCBpbmRleCArIDIpKTtcclxuICAgIGluZGV4ICs9IDI7XHJcbiAgICBjb25zdCBwcm9mZXNzaW9uX2xlbmd0aCA9IHNbM10gPT09IFwi5oiQXCIgPyAyIDogMTtcclxuICAgIGNvbnN0IHByb2YgPSBwYXJzZV9wcm9mZXNzaW9uKHMuc2xpY2UoaW5kZXgsIGluZGV4ICsgcHJvZmVzc2lvbl9sZW5ndGgpKTtcclxuICAgIGluZGV4ICs9IHByb2Zlc3Npb25fbGVuZ3RoO1xyXG4gICAgLy8gQWxsIHRoYXQgZm9sbG93cyBhcmUgb3B0aW9uYWwuXHJcbiAgICAvLyDku6XpmY3jga/jgqrjg5fjgrfjg6fjg4rjg6vjgILjgIwxLiDnp7vli5XlhYPmmI7oqJjjgI3jgIwyLiDmiJDjg7vkuI3miJDjgI3jgIwzLiDnooHnn7Pjga7luqfmqJnjgI3jgYzjgZPjga7poIbnlarjgafnj77jgozjgarjgZHjgozjgbDjgarjgonjgarjgYTjgIJcclxuICAgIC8vIDEuIOenu+WLleWFg+aYjuiomFxyXG4gICAgLy8g44CM5Y+z44CN44CM5bem44CN44CM5omT44CN44CB44G+44Gf44Gv44CM77yINOS6lO+8ieOAjeOBquOBqVxyXG4gICAgY29uc3QgZnJvbSA9ICgoKSA9PiB7XHJcbiAgICAgICAgaWYgKHNbaW5kZXhdID09PSBcIuWPs1wiKSB7XHJcbiAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuWPs1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzW2luZGV4XSA9PT0gXCLlt6ZcIikge1xyXG4gICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICByZXR1cm4gXCLlt6ZcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc1tpbmRleF0gPT09IFwi5omTXCIpIHtcclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgcmV0dXJuIFwi5omTXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNbaW5kZXhdID09PSBcIihcIiB8fCBzW2luZGV4XSA9PT0gXCLvvIhcIikge1xyXG4gICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IHBhcnNlX2Nvb3JkKHMuc2xpY2UoaW5kZXgsIGluZGV4ICsgMikpO1xyXG4gICAgICAgICAgICBpbmRleCArPSAyO1xyXG4gICAgICAgICAgICBpZiAoc1tpbmRleF0gPT09IFwiKVwiIHx8IHNbaW5kZXhdID09PSBcIu+8iVwiKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvb3JkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDplovjgY3jgqvjg4PjgrPjgajluqfmqJnjga7lvozjgavplonjgZjjgqvjg4PjgrPjgYzjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfSkoKTtcclxuICAgIGNvbnN0IHByb21vdGVzID0gKCgpID0+IHtcclxuICAgICAgICBpZiAoc1tpbmRleF0gPT09IFwi5oiQXCIpIHtcclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHMuc2xpY2UoaW5kZXgsIGluZGV4ICsgMikgPT09IFwi5LiN5oiQXCIpIHtcclxuICAgICAgICAgICAgaW5kZXggKz0gMjtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSkoKTtcclxuICAgIGNvbnN0IFtzdG9uZV90bywgcmVzdF0gPSAoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGMgPSBzW2luZGV4XTtcclxuICAgICAgICBpZiAoIWMpXHJcbiAgICAgICAgICAgIHJldHVybiBbbnVsbCwgXCJcIl07XHJcbiAgICAgICAgaWYgKChcIjFcIiA8PSBjICYmIGMgPD0gXCI5XCIpIHx8IChcIu+8kVwiIDw9IGMgJiYgYyA8PSBcIu+8mVwiKSkge1xyXG4gICAgICAgICAgICBjb25zdCBjb29yZCA9IHBhcnNlX2Nvb3JkKHMuc2xpY2UoaW5kZXgsIGluZGV4ICsgMikpO1xyXG4gICAgICAgICAgICBpbmRleCArPSAyO1xyXG4gICAgICAgICAgICBpZiAoIXNbaW5kZXhdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW2Nvb3JkLCBcIlwiXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbY29vcmQsIHMuc2xpY2UoaW5kZXgpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtudWxsLCBzLnNsaWNlKGluZGV4KV07XHJcbiAgICAgICAgfVxyXG4gICAgfSkoKTtcclxuICAgIGNvbnN0IHBpZWNlX3BoYXNlID0gcHJvbW90ZXMgIT09IG51bGwgPyAoZnJvbSA/IHsgc2lkZSwgdG8sIHByb2YsIHByb21vdGVzLCBmcm9tIH0gOiB7IHNpZGUsIHRvLCBwcm9mLCBwcm9tb3RlcyB9KVxyXG4gICAgICAgIDogKGZyb20gPyB7IHNpZGUsIHRvLCBwcm9mLCBmcm9tIH0gOiB7IHNpZGUsIHRvLCBwcm9mIH0pO1xyXG4gICAgY29uc3QgbW92ZSA9IHN0b25lX3RvID8geyBwaWVjZV9waGFzZSwgc3RvbmVfdG8gfSA6IHsgcGllY2VfcGhhc2UgfTtcclxuICAgIHJldHVybiB7IG1vdmUsIHJlc3QgfTtcclxufVxyXG5leHBvcnRzLm11bmNoX29uZSA9IG11bmNoX29uZTtcclxuZnVuY3Rpb24gcGFyc2Uocykge1xyXG4gICAgcyA9IHMucmVwbGFjZSgvKFvpu5LilrLimJfnmb3ilrPimJZdKS9nLCBcIiAkMVwiKTtcclxuICAgIGNvbnN0IG1vdmVzID0gcy5zcGxpdCgvXFxzLyk7XHJcbiAgICByZXR1cm4gbW92ZXMubWFwKHMgPT4gcy50cmltKCkpLmZpbHRlcihzID0+IHMgIT09IFwiXCIpLm1hcChwYXJzZV9vbmUpO1xyXG59XHJcbmV4cG9ydHMucGFyc2UgPSBwYXJzZTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5iYWNrd2FyZF9oaXN0b3J5ID0gZXhwb3J0cy50YWtlX3VudGlsX2ZpcnN0X2N1cnNvciA9IGV4cG9ydHMuZm9yd2FyZF9oaXN0b3J5ID0gZXhwb3J0cy5wYXJzZV9jdXJzb3JlZCA9IHZvaWQgMDtcclxuY29uc3Qgc2hvZ29zc19wYXJzZXJfMSA9IHJlcXVpcmUoXCJzaG9nb3NzLXBhcnNlclwiKTtcclxuZnVuY3Rpb24gcGFyc2VfY3Vyc29yZWQocykge1xyXG4gICAgY29uc3QgYW5zID0geyBtYWluOiBbXSwgdW5ldmFsdWF0ZWQ6IFtdIH07XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIHMgPSBzLnRyaW1TdGFydCgpO1xyXG4gICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoXCJ7fFwiKSkge1xyXG4gICAgICAgICAgICBzID0gcy5zbGljZShCT09LTUFSS19MRU5HVEgpO1xyXG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcyA9IHMudHJpbVN0YXJ0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocy5zdGFydHNXaXRoKFwifVwiKSlcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYW5zO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeyBtb3ZlLCByZXN0IH0gPSAoMCwgc2hvZ29zc19wYXJzZXJfMS5tdW5jaF9vbmUpKHMpO1xyXG4gICAgICAgICAgICAgICAgcyA9IHJlc3Q7XHJcbiAgICAgICAgICAgICAgICBhbnMudW5ldmFsdWF0ZWQucHVzaChtb3ZlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzLnRyaW1TdGFydCgpID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhbnM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHsgbW92ZSwgcmVzdCB9ID0gKDAsIHNob2dvc3NfcGFyc2VyXzEubXVuY2hfb25lKShzKTtcclxuICAgICAgICBzID0gcmVzdDtcclxuICAgICAgICBhbnMubWFpbi5wdXNoKG1vdmUpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMucGFyc2VfY3Vyc29yZWQgPSBwYXJzZV9jdXJzb3JlZDtcclxuY29uc3QgQk9PS01BUktfTEVOR1RIID0gXCJ7fFwiLmxlbmd0aDtcclxuZnVuY3Rpb24gZm9yd2FyZF9oaXN0b3J5KG9yaWdpbmFsX3MpIHtcclxuICAgIGxldCBzID0gb3JpZ2luYWxfcztcclxuICAgIC8vIG4g5omL5YiG44KS44OR44O844K5XHJcbiAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgIHMgPSBzLnRyaW1TdGFydCgpO1xyXG4gICAgICAgIC8vIHt8IOOBq+mBremBh+OBl+OBn+OCieOAgVxyXG4gICAgICAgIGNvbnN0IHRpbGxfbnRoID0gb3JpZ2luYWxfcy5zbGljZSgwLCBvcmlnaW5hbF9zLmxlbmd0aCAtIHMubGVuZ3RoKTtcclxuICAgICAgICBpZiAocy5zdGFydHNXaXRoKFwie3xcIikpIHtcclxuICAgICAgICAgICAgLy8ge3wg44KS6Kqt44G/6aOb44Gw44GX44CBXHJcbiAgICAgICAgICAgIHMgPSBzLnNsaWNlKEJPT0tNQVJLX0xFTkdUSCk7XHJcbiAgICAgICAgICAgIC8vIOOCueODmuODvOOCueOCkuS/neWFqOOBl+OBplxyXG4gICAgICAgICAgICBjb25zdCBzdGFydF9vZl9zcGFjZSA9IG9yaWdpbmFsX3MubGVuZ3RoIC0gcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHMgPSBzLnRyaW1TdGFydCgpO1xyXG4gICAgICAgICAgICAvLyAgMSDmiYvliIbjgpLjg5Hjg7zjgrnjgIIxIOaJi+OCguaui+OBo+OBpuOBquOBhOOBquOCieOAgeOBneOCjOOBr+OBneOCjOS7peS4iiBmb3J3YXJkIOOBp+OBjeOBquOBhOOBruOBpyBudWxsIOOCkui/lOOBmVxyXG4gICAgICAgICAgICBpZiAocy5zdGFydHNXaXRoKFwifVwiKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgeyBtb3ZlOiBfLCByZXN0IH0gPSAoMCwgc2hvZ29zc19wYXJzZXJfMS5tdW5jaF9vbmUpKHMpO1xyXG4gICAgICAgICAgICBzID0gcmVzdDtcclxuICAgICAgICAgICAgY29uc3QgZW5kX29mX3NwYWNlX2FuZF9tb3ZlID0gb3JpZ2luYWxfcy5sZW5ndGggLSBzLmxlbmd0aDtcclxuICAgICAgICAgICAgcyA9IHMudHJpbVN0YXJ0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVuZF9vZl9zcGFjZV9hbmRfbW92ZV9hbmRfc3BhY2UgPSBvcmlnaW5hbF9zLmxlbmd0aCAtIHMubGVuZ3RoO1xyXG4gICAgICAgICAgICByZXR1cm4gdGlsbF9udGggKyBvcmlnaW5hbF9zLnNsaWNlKHN0YXJ0X29mX3NwYWNlLCBlbmRfb2Zfc3BhY2VfYW5kX21vdmUpICsgb3JpZ2luYWxfcy5zbGljZShlbmRfb2Zfc3BhY2VfYW5kX21vdmUsIGVuZF9vZl9zcGFjZV9hbmRfbW92ZV9hbmRfc3BhY2UpICsgXCJ7fFwiICsgb3JpZ2luYWxfcy5zbGljZShlbmRfb2Zfc3BhY2VfYW5kX21vdmVfYW5kX3NwYWNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocy50cmltU3RhcnQoKSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8g44Gd44KM5Lul5LiKIGZvcndhcmQg44Gn44GN44Gq44GE44Gu44GnIG51bGwg44KS6L+U44GZXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHsgbW92ZTogXywgcmVzdCB9ID0gKDAsIHNob2dvc3NfcGFyc2VyXzEubXVuY2hfb25lKShzKTtcclxuICAgICAgICBzID0gcmVzdDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmZvcndhcmRfaGlzdG9yeSA9IGZvcndhcmRfaGlzdG9yeTtcclxuZnVuY3Rpb24gdGFrZV91bnRpbF9maXJzdF9jdXJzb3Iob3JpZ2luYWxfcykge1xyXG4gICAgbGV0IHMgPSBvcmlnaW5hbF9zO1xyXG4gICAgY29uc3QgaW5kaWNlcyA9IFtdO1xyXG4gICAgLy8gbiDmiYvliIbjgpLjg5Hjg7zjgrlcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgcyA9IHMudHJpbVN0YXJ0KCk7XHJcbiAgICAgICAgaW5kaWNlcy5wdXNoKG9yaWdpbmFsX3MubGVuZ3RoIC0gcy5sZW5ndGgpO1xyXG4gICAgICAgIC8vIHt8IOOBq+mBremBh+OBl+OBn+OCieOAgVxyXG4gICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoXCJ7fFwiKSkge1xyXG4gICAgICAgICAgICAvLyB7fCDku6XpmY3jgpLpm5HjgavliYrjgotcclxuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsX3Muc2xpY2UoMCwgb3JpZ2luYWxfcy5sZW5ndGggLSBzLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHMudHJpbVN0YXJ0KCkgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsX3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHsgbW92ZTogXywgcmVzdCB9ID0gKDAsIHNob2dvc3NfcGFyc2VyXzEubXVuY2hfb25lKShzKTtcclxuICAgICAgICBzID0gcmVzdDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLnRha2VfdW50aWxfZmlyc3RfY3Vyc29yID0gdGFrZV91bnRpbF9maXJzdF9jdXJzb3I7XHJcbmZ1bmN0aW9uIGJhY2t3YXJkX2hpc3Rvcnkob3JpZ2luYWxfcykge1xyXG4gICAgbGV0IHMgPSBvcmlnaW5hbF9zO1xyXG4gICAgY29uc3QgaW5kaWNlcyA9IFtdO1xyXG4gICAgLy8gbiDmiYvliIbjgpLjg5Hjg7zjgrlcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgcyA9IHMudHJpbVN0YXJ0KCk7XHJcbiAgICAgICAgaW5kaWNlcy5wdXNoKG9yaWdpbmFsX3MubGVuZ3RoIC0gcy5sZW5ndGgpO1xyXG4gICAgICAgIC8vIHt8IOOBq+mBremBh+OBl+OBn+OCieOAgVxyXG4gICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoXCJ7fFwiKSkge1xyXG4gICAgICAgICAgICBjb25zdCBubWludXMxX2VuZCA9IGluZGljZXNbaW5kaWNlcy5sZW5ndGggLSAyXTtcclxuICAgICAgICAgICAgY29uc3Qgbl9lbmQgPSBpbmRpY2VzW2luZGljZXMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIGlmIChubWludXMxX2VuZCA9PT0gdW5kZWZpbmVkIHx8IG5fZW5kID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyDjgZ3jgozku6XkuIogYmFja3dhcmQg44Gn44GN44Gq44GE44Gu44GnIG51bGwg44KS6L+U44GZXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsX3Muc2xpY2UoMCwgbm1pbnVzMV9lbmQpICsgXCJ7fFwiICsgb3JpZ2luYWxfcy5zbGljZShubWludXMxX2VuZCwgbl9lbmQpICsgb3JpZ2luYWxfcy5zbGljZShuX2VuZCArIEJPT0tNQVJLX0xFTkdUSCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHMudHJpbVN0YXJ0KCkgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgLy8g5qCe44GM44Gq44GE44Gu44Gn55Sf44KE44GZXHJcbiAgICAgICAgICAgIGNvbnN0IG5taW51czFfZW5kID0gaW5kaWNlc1tpbmRpY2VzLmxlbmd0aCAtIDJdO1xyXG4gICAgICAgICAgICBjb25zdCBuX2VuZCA9IGluZGljZXNbaW5kaWNlcy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgaWYgKG5taW51czFfZW5kID09PSB1bmRlZmluZWQgfHwgbl9lbmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7IC8vIOOBneOCjOS7peS4iiBiYWNrd2FyZCDjgafjgY3jgarjgYTjga7jgacgbnVsbCDjgpLov5TjgZlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxfcy5zbGljZSgwLCBubWludXMxX2VuZCkgKyBcInt8XCIgKyBvcmlnaW5hbF9zLnNsaWNlKG5taW51czFfZW5kLCBuX2VuZCkgKyBvcmlnaW5hbF9zLnNsaWNlKG5fZW5kKSArIFwifVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB7IG1vdmU6IF8sIHJlc3QgfSA9ICgwLCBzaG9nb3NzX3BhcnNlcl8xLm11bmNoX29uZSkocyk7XHJcbiAgICAgICAgcyA9IHJlc3Q7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5iYWNrd2FyZF9oaXN0b3J5ID0gYmFja3dhcmRfaGlzdG9yeTtcclxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHNob2dvc3NfY29yZV8xID0gcmVxdWlyZShcInNob2dvc3MtY29yZVwiKTtcclxuY29uc3QgZ2FtZXRyZWVfMSA9IHJlcXVpcmUoXCIuL2dhbWV0cmVlXCIpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgcmVuZGVyKCgwLCBzaG9nb3NzX2NvcmVfMS5nZXRfaW5pdGlhbF9zdGF0ZSkoXCLpu5JcIikpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkX2hpc3RvcnlcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxvYWRfaGlzdG9yeSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcndhcmRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZvcndhcmQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrd2FyZFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYmFja3dhcmQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoYW56aV9ibGFja193aGl0ZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbG9hZF9oaXN0b3J5KTtcclxufSk7XHJcbmZ1bmN0aW9uIGZvcndhcmQoKSB7XHJcbiAgICBHVUlfc3RhdGUuc2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGlzdG9yeVwiKS52YWx1ZTtcclxuICAgIGNvbnN0IG5ld19oaXN0b3J5ID0gKDAsIGdhbWV0cmVlXzEuZm9yd2FyZF9oaXN0b3J5KSh0ZXh0KTtcclxuICAgIGlmIChuZXdfaGlzdG9yeSkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGlzdG9yeVwiKS52YWx1ZSA9IG5ld19oaXN0b3J5O1xyXG4gICAgICAgIGxvYWRfaGlzdG9yeSgpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGJhY2t3YXJkKCkge1xyXG4gICAgR1VJX3N0YXRlLnNlbGVjdGVkID0gbnVsbDtcclxuICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpc3RvcnlcIikudmFsdWU7XHJcbiAgICBjb25zdCBuZXdfaGlzdG9yeSA9ICgwLCBnYW1ldHJlZV8xLmJhY2t3YXJkX2hpc3RvcnkpKHRleHQpO1xyXG4gICAgaWYgKG5ld19oaXN0b3J5KSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaXN0b3J5XCIpLnZhbHVlID0gbmV3X2hpc3Rvcnk7XHJcbiAgICAgICAgbG9hZF9oaXN0b3J5KCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gbWFpbl8obW92ZXMpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuICgwLCBzaG9nb3NzX2NvcmVfMS5tYWluKShtb3Zlcyk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgRXJyb3IgJiYgZS5tZXNzYWdlID09PSBcIuaji+itnOOBjOepuuOBp+OBmVwiKSB7XHJcbiAgICAgICAgICAgIC8vIOOBqeOBo+OBoeOBi+OBq+OBl+OBpuOBiuOBkeOBsOOBhOOBhFxyXG4gICAgICAgICAgICByZXR1cm4gKDAsIHNob2dvc3NfY29yZV8xLmdldF9pbml0aWFsX3N0YXRlKShcIum7klwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGxvYWRfaGlzdG9yeSgpIHtcclxuICAgIEdVSV9zdGF0ZS5zZWxlY3RlZCA9IG51bGw7XHJcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaXN0b3J5XCIpLnZhbHVlO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3J3YXJkXCIpLmRpc2FibGVkID0gKDAsIGdhbWV0cmVlXzEuZm9yd2FyZF9oaXN0b3J5KSh0ZXh0KSA9PT0gbnVsbDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFja3dhcmRcIikuZGlzYWJsZWQgPSAoMCwgZ2FtZXRyZWVfMS5iYWNrd2FyZF9oaXN0b3J5KSh0ZXh0KSA9PT0gbnVsbDtcclxuICAgIGNvbnN0IG1vdmVzID0gKDAsIGdhbWV0cmVlXzEucGFyc2VfY3Vyc29yZWQpKHRleHQpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IG1haW5fKG1vdmVzLm1haW4pO1xyXG4gICAgICAgIGNvbnN0IHByZXZpb3VzX3N0YXRlID0gbWFpbl8obW92ZXMubWFpbi5zbGljZSgwLCAtMSkpO1xyXG4gICAgICAgIGlmIChwcmV2aW91c19zdGF0ZS5waGFzZSA9PT0gXCJnYW1lX2VuZFwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInNob3VsZCBub3QgaGFwcGVuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3RhdGUucGhhc2UgPT09IFwiZ2FtZV9lbmRcIikge1xyXG4gICAgICAgICAgICBhbGVydChg5Yud6ICFOiAke3N0YXRlLnZpY3Rvcn3jgIHnkIbnlLE6ICR7c3RhdGUucmVhc29ufWApO1xyXG4gICAgICAgICAgICByZW5kZXIoc3RhdGUuZmluYWxfc2l0dWF0aW9uLCBwcmV2aW91c19zdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZW5kZXIoc3RhdGUsIHByZXZpb3VzX3N0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGFsZXJ0KGUpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGdldENvbnRlbnRIVE1MRnJvbUVudGl0eShlbnRpdHkpIHtcclxuICAgIGlmIChlbnRpdHkudHlwZSA9PT0gXCLnooFcIilcclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIGlmIChlbnRpdHkudHlwZSA9PT0gXCLjgrlcIiAmJiBlbnRpdHkucHJvZiAhPT0gXCLjgahcIiAmJiBlbnRpdHkucHJvZiAhPT0gXCLjg51cIikge1xyXG4gICAgICAgIHJldHVybiBgPHNwYW4gc3R5bGU9XCJmb250LXNpemU6IDIwMCVcIj4ke3sg44KtOiBcIuKZlFwiLCDjgq86IFwi4pmVXCIsIOODqzogXCLimZZcIiwg44OTOiBcIuKZl1wiLCDjg4o6IFwi4pmYXCIgfVtlbnRpdHkucHJvZl19PC9zcGFuPmA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZW50aXR5LnByb2Y7XHJcbn1cclxuZnVuY3Rpb24gc2FtZV9lbnRpdHkoZTEsIGUyKSB7XHJcbiAgICBpZiAoIWUyKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIGlmIChlMS5zaWRlICE9PSBlMi5zaWRlKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIGlmIChlMS50eXBlID09PSBcIueigVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIGUxLnR5cGUgPT09IGUyLnR5cGU7XHJcbiAgICB9XHJcbiAgICBpZiAoZTIudHlwZSA9PT0gXCLnooFcIikge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiBlMS5wcm9mID09PSBlMi5wcm9mO1xyXG59XHJcbmNvbnN0IEdVSV9zdGF0ZSA9IHtcclxuICAgIHNpdHVhdGlvbjogKDAsIHNob2dvc3NfY29yZV8xLmdldF9pbml0aWFsX3N0YXRlKShcIum7klwiKSxcclxuICAgIHNlbGVjdGVkOiBudWxsLFxyXG59O1xyXG5mdW5jdGlvbiBzZWxlY3RfcGllY2Vfb25fYm9hcmQoY29vcmQpIHtcclxuICAgIEdVSV9zdGF0ZS5zZWxlY3RlZCA9IHsgdHlwZTogXCJwaWVjZV9vbl9ib2FyZFwiLCBjb29yZCB9O1xyXG4gICAgcmVuZGVyKEdVSV9zdGF0ZS5zaXR1YXRpb24pO1xyXG59XHJcbi8vIHByZXZpb3VzX3NpdHVhdGlvbiDjgajjga7lt67liIbjgavjga8gbmV3bHkg44KEIG5ld2x5X3ZhY2F0ZWQg44Go44GE44Gj44GfIENTUyDjgq/jg6njgrnjgpLjgaTjgZHjgabmj4/lhplcclxuLy8g44Gf44Gg44GX44CBR1VJX3N0YXRlLnNlbGVjdGVkIOOBjOOBguOCi+WgtOWQiOOBq+OBr+OAgeW3ruWIhuOBp+OBr+OBquOBj+OBpumBuOOCk+OBoOmnkuOBq+OBpOOBhOOBpuefpeOCiuOBn+OBhOOBr+OBmuOBquOBruOBp+OAgW5ld2x5IOOBruaPj+WGmeOCkuaKkeWItuOBmeOCi1xyXG5mdW5jdGlvbiByZW5kZXIoc2l0dWF0aW9uLCBwcmV2aW91c19zaXR1YXRpb24pIHtcclxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhhbnppX2JsYWNrX3doaXRlXCIpLmNoZWNrZWQpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpc3RvcnlcIikudmFsdWUgPVxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpc3RvcnlcIikudmFsdWUucmVwbGFjZSgvW+m7kuKWsuKYl10vZywgXCLpu5JcIikucmVwbGFjZSgvW+eZveKWs+KYll0vZywgXCLnmb1cIik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpc3RvcnlcIikudmFsdWUgPVxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpc3RvcnlcIikudmFsdWUucmVwbGFjZSgvW+m7kuKWsuKYl10vZywgXCLilrJcIikucmVwbGFjZSgvW+eZveKWs+KYll0vZywgXCLilrNcIik7XHJcbiAgICB9XHJcbiAgICBHVUlfc3RhdGUuc2l0dWF0aW9uID0gc2l0dWF0aW9uO1xyXG4gICAgY29uc3QgYm9hcmRfZG9tID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib2FyZFwiKTtcclxuICAgIGJvYXJkX2RvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgY29uc3QgYW5zID0gW107XHJcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCA5OyByb3crKykge1xyXG4gICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDk7IGNvbCsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IHNpdHVhdGlvbi5ib2FyZFtyb3ddW2NvbF07XHJcbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzX3NpdHVhdGlvbj8uYm9hcmRbcm93XVtjb2xdICYmICFHVUlfc3RhdGUuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdseV92YWNhdGVkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXdseV92YWNhdGVkLmNsYXNzTGlzdC5hZGQoXCJuZXdseV92YWNhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld2x5X3ZhY2F0ZWQuc3R5bGUuY3NzVGV4dCA9IGB0b3A6JHs1MCArIHJvdyAqIDUwfXB4OyBsZWZ0OiR7MTAwICsgY29sICogNTB9cHg7YDtcclxuICAgICAgICAgICAgICAgICAgICBhbnMucHVzaChuZXdseV92YWNhdGVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHJvd18gPSB0b1Nob2dpUm93TmFtZShyb3cpO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xfID0gdG9TaG9naUNvbHVtbk5hbWUoY29sKTtcclxuICAgICAgICAgICAgY29uc3QgaXNfbmV3bHlfdXBkYXRlZCA9IHByZXZpb3VzX3NpdHVhdGlvbiAmJiAhR1VJX3N0YXRlLnNlbGVjdGVkID8gIXNhbWVfZW50aXR5KGVudGl0eSwgcHJldmlvdXNfc2l0dWF0aW9uLmJvYXJkW3Jvd11bY29sXSkgOiBmYWxzZTtcclxuICAgICAgICAgICAgY29uc3QgaXNfc2VsZWN0ZWQgPSBHVUlfc3RhdGUuc2VsZWN0ZWQ/LnR5cGUgPT09IFwicGllY2Vfb25fYm9hcmRcIiA/IEdVSV9zdGF0ZS5zZWxlY3RlZC5jb29yZFsxXSA9PT0gcm93XyAmJiBHVUlfc3RhdGUuc2VsZWN0ZWQuY29vcmRbMF0gPT09IGNvbF8gOiBmYWxzZTtcclxuICAgICAgICAgICAgY29uc3QgcGllY2Vfb3Jfc3RvbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBwaWVjZV9vcl9zdG9uZS5jbGFzc0xpc3QuYWRkKGVudGl0eS5zaWRlID09PSBcIueZvVwiID8gXCJ3aGl0ZVwiIDogXCJibGFja1wiKTtcclxuICAgICAgICAgICAgaWYgKGlzX25ld2x5X3VwZGF0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHBpZWNlX29yX3N0b25lLmNsYXNzTGlzdC5hZGQoXCJuZXdseVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaXNfc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHBpZWNlX29yX3N0b25lLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwaWVjZV9vcl9zdG9uZS5zdHlsZS5jc3NUZXh0ID0gYHRvcDokezUwICsgcm93ICogNTB9cHg7IGxlZnQ6JHsxMDAgKyBjb2wgKiA1MH1weDtgO1xyXG4gICAgICAgICAgICBwaWVjZV9vcl9zdG9uZS5pbm5lckhUTUwgPSBnZXRDb250ZW50SFRNTEZyb21FbnRpdHkoZW50aXR5KTtcclxuICAgICAgICAgICAgcGllY2Vfb3Jfc3RvbmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHNlbGVjdF9waWVjZV9vbl9ib2FyZChbY29sXywgcm93X10pKTtcclxuICAgICAgICAgICAgYW5zLnB1c2gocGllY2Vfb3Jfc3RvbmUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChHVUlfc3RhdGUuc2VsZWN0ZWQ/LnR5cGUgPT09IFwicGllY2Vfb25fYm9hcmRcIikge1xyXG4gICAgICAgIGNvbnN0IGVudGl0eV90aGF0X21vdmVzID0gZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKHNpdHVhdGlvbi5ib2FyZCwgR1VJX3N0YXRlLnNlbGVjdGVkLmNvb3JkKTtcclxuICAgICAgICBpZiAoZW50aXR5X3RoYXRfbW92ZXMudHlwZSA9PT0gXCLnooFcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCLnooHnn7PjgYzli5XjgY/jga/jgZrjgYzjgarjgYRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDk7IHJvdysrKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDk7IGNvbCsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb3dfID0gdG9TaG9naVJvd05hbWUocm93KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbF8gPSB0b1Nob2dpQ29sdW1uTmFtZShjb2wpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdG8gPSBbY29sXywgcm93X107XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvID0geyB0bywgZnJvbTogR1VJX3N0YXRlLnNlbGVjdGVkLmNvb3JkIH07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc19jYXN0bGFibGUgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICgwLCBzaG9nb3NzX2NvcmVfMS50aHJvd3NfaWZfdW5jYXN0bGFibGUpKHNpdHVhdGlvbi5ib2FyZCwgbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzX2t1bWFsYWJsZSA9ICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKDAsIHNob2dvc3NfY29yZV8xLnRocm93c19pZl91bmt1bWFsYWJsZSkoc2l0dWF0aW9uLmJvYXJkLCBvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCgwLCBzaG9nb3NzX2NvcmVfMS5jYW5fbW92ZSkoc2l0dWF0aW9uLmJvYXJkLCBvKSB8fCBpc19jYXN0bGFibGUgfHwgaXNfa3VtYWxhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zc2libGVfZGVzdGluYXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc3NpYmxlX2Rlc3RpbmF0aW9uLmNsYXNzTGlzdC5hZGQoXCJwb3NzaWJsZV9kZXN0aW5hdGlvblwiKTtcclxuICAgICAgICAgICAgICAgICAgICBwb3NzaWJsZV9kZXN0aW5hdGlvbi5zdHlsZS5jc3NUZXh0ID0gYHRvcDokezUwICsgcm93ICogNTB9cHg7IGxlZnQ6JHsxMDAgKyBjb2wgKiA1MH1weDtgO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc3NpYmxlX2Rlc3RpbmF0aW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7IHBsYXlfcGllY2VfcGhhc2UodG8sIGVudGl0eV90aGF0X21vdmVzKTsgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5zLnB1c2gocG9zc2libGVfZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgc2l0dWF0aW9uLmhhbmRfb2Zfd2hpdGUuZm9yRWFjaCgocHJvZiwgaW5kZXgpID0+IHtcclxuICAgICAgICBjb25zdCBwaWVjZV9pbl9oYW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICBwaWVjZV9pbl9oYW5kLmNsYXNzTGlzdC5hZGQoXCJ3aGl0ZVwiKTtcclxuICAgICAgICBwaWVjZV9pbl9oYW5kLnN0eWxlLmNzc1RleHQgPSBgdG9wOiR7NTAgKyBpbmRleCAqIDUwfXB4OyBsZWZ0OiA0MHB4O2A7XHJcbiAgICAgICAgcGllY2VfaW5faGFuZC5pbm5lckhUTUwgPSBwcm9mO1xyXG4gICAgICAgIGFucy5wdXNoKHBpZWNlX2luX2hhbmQpO1xyXG4gICAgfSk7XHJcbiAgICBzaXR1YXRpb24uaGFuZF9vZl9ibGFjay5mb3JFYWNoKChwcm9mLCBpbmRleCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHBpZWNlX2luX2hhbmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHBpZWNlX2luX2hhbmQuY2xhc3NMaXN0LmFkZChcImJsYWNrXCIpO1xyXG4gICAgICAgIHBpZWNlX2luX2hhbmQuc3R5bGUuY3NzVGV4dCA9IGB0b3A6JHs0NTAgLSBpbmRleCAqIDUwfXB4OyBsZWZ0OiA1ODZweDtgO1xyXG4gICAgICAgIHBpZWNlX2luX2hhbmQuaW5uZXJIVE1MID0gcHJvZjtcclxuICAgICAgICBhbnMucHVzaChwaWVjZV9pbl9oYW5kKTtcclxuICAgIH0pO1xyXG4gICAgYm9hcmRfZG9tLmFwcGVuZCguLi5hbnMpO1xyXG59XHJcbmZ1bmN0aW9uIGdldF9lbnRpdHlfZnJvbV9jb29yZChib2FyZCwgY29vcmQpIHtcclxuICAgIGNvbnN0IFtjb2x1bW4sIHJvd10gPSBjb29yZDtcclxuICAgIGNvbnN0IHJvd19pbmRleCA9IFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZihyb3cpO1xyXG4gICAgY29uc3QgY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGNvbHVtbik7XHJcbiAgICBpZiAocm93X2luZGV4ID09PSAtMSB8fCBjb2x1bW5faW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDkuI3mraPjgarluqfmqJnjgafjgZlgKTtcclxuICAgIH1cclxuICAgIHJldHVybiAoYm9hcmRbcm93X2luZGV4XT8uW2NvbHVtbl9pbmRleF0pID8/IG51bGw7XHJcbn1cclxuZnVuY3Rpb24gcGxheV9waWVjZV9waGFzZSh0bywgZW50aXR5X3RoYXRfbW92ZXMpIHtcclxuICAgIGlmIChHVUlfc3RhdGUuc2VsZWN0ZWQ/LnR5cGUgIT09IFwicGllY2Vfb25fYm9hcmRcIilcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJwbGF5X3BpZWNlX3BoYXNlIHBsYXllZCB3aXRob3V0IHBpZWNlX29uX2JvYXJkIHNwZWNpZmllZFwiKTtcclxuICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaXN0b3J5XCIpLnZhbHVlO1xyXG4gICAgY29uc3QgbW92ZXMgPSAoMCwgZ2FtZXRyZWVfMS5wYXJzZV9jdXJzb3JlZCkodGV4dCk7XHJcbiAgICBpZiAobW92ZXMudW5ldmFsdWF0ZWQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGlmICghY29uZmlybShcIuS7pemZjeOBruWxgOmdouOBjOegtOajhOOBleOCjOOBvuOBmeOAguOCiOOCjeOBl+OBhOOBp+OBmeOBi++8n++8iOWwhuadpeeahOOBq+OBr+OAgeWxgOmdouOCkuegtOajhOOBm+OBmuWIhuWykOOBmeOCi+apn+iDveOCkui2s+OBl+OBn+OBhOOBqOaAneOBo+OBpuOBhOOBvuOBme+8iVwiKSkge1xyXG4gICAgICAgICAgICBHVUlfc3RhdGUuc2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgICAgICAgICByZW5kZXIoR1VJX3N0YXRlLnNpdHVhdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGV4dCA9ICgwLCBnYW1ldHJlZV8xLnRha2VfdW50aWxfZmlyc3RfY3Vyc29yKSh0ZXh0KTtcclxuICAgIH1cclxuICAgIGNvbnN0IGZyb20gPSBHVUlfc3RhdGUuc2VsZWN0ZWQuY29vcmQ7XHJcbiAgICBjb25zdCBmdWxsX25vdGF0aW9uID0gYCR7ZW50aXR5X3RoYXRfbW92ZXMuc2lkZSA9PT0gXCLpu5JcIiA/IFwi4payXCIgOiBcIuKWs1wifSR7dG9bMF19JHt0b1sxXX0ke2VudGl0eV90aGF0X21vdmVzLnByb2Z9KCR7ZnJvbVswXX0ke2Zyb21bMV19KWA7XHJcbiAgICAvLyDnhKHnkIbjgarmiYvjgpLmjIfjgZfjgZ/mmYLjgavokL3jgajjgZlcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbWFpbl8oKDAsIGdhbWV0cmVlXzEucGFyc2VfY3Vyc29yZWQpKHRleHQgKyBmdWxsX25vdGF0aW9uKS5tYWluKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgYWxlcnQoZSk7XHJcbiAgICAgICAgR1VJX3N0YXRlLnNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICByZW5kZXIoR1VJX3N0YXRlLnNpdHVhdGlvbik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbG9vc2Vfbm90YXRpb24gPSBgJHtlbnRpdHlfdGhhdF9tb3Zlcy5zaWRlID09PSBcIum7klwiID8gXCLilrJcIiA6IFwi4pazXCJ9JHt0b1swXX0ke3RvWzFdfSR7ZW50aXR5X3RoYXRfbW92ZXMucHJvZn1gO1xyXG4gICAgZnVuY3Rpb24gYXBwZW5kX2FuZF9sb2FkKG5vdGF0aW9uKSB7XHJcbiAgICAgICAgdGV4dCA9IHRleHQudHJpbUVuZCgpO1xyXG4gICAgICAgIHRleHQgKz0gKHRleHQgPyBcIuOAgFwiIDogXCJcIikgKyBub3RhdGlvbjtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpc3RvcnlcIikudmFsdWUgPSB0ZXh0O1xyXG4gICAgICAgIGxvYWRfaGlzdG9yeSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIOabluaYp+aAp+OBjOWHuuOBquOBhOOBqOOBjeOBq+OBryBmcm9tIOOCkuabuOOBi+OBmuOBq+mAmuOBmVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBtYWluXygoMCwgZ2FtZXRyZWVfMS5wYXJzZV9jdXJzb3JlZCkodGV4dCArIGxvb3NlX25vdGF0aW9uKS5tYWluKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgLy8g5puW5pin5oCn44GM5Ye644GfXHJcbiAgICAgICAgYXBwZW5kX2FuZF9sb2FkKGZ1bGxfbm90YXRpb24pO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIOabluaYp+aAp+OBjOeEoeOBhOOBruOBpyBmcm9tIOOCkuabuOOBi+OBmuOBq+mAmuOBmVxyXG4gICAgLy8g44Gf44Gg44GX44CB44GT44GT44Gn44CM5LqM44Od44Gu5Y+v6IO95oCn44Gv54Sh6KaW44GX44Gm5puW5pin5oCn44KS6ICD44GI44KL44CN44Go44GE44GG5LuV5qeY44GM54mZ44KS44KA44GPXHJcbiAgICBpZiAoZW50aXR5X3RoYXRfbW92ZXMucHJvZiAhPT0gXCLjg51cIikge1xyXG4gICAgICAgIGFwcGVuZF9hbmRfbG9hZChsb29zZV9ub3RhdGlvbik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbG9vc2UgPSBtYWluXygoMCwgZ2FtZXRyZWVfMS5wYXJzZV9jdXJzb3JlZCkodGV4dCArIGxvb3NlX25vdGF0aW9uKS5tYWluKTtcclxuICAgICAgICBjb25zdCBmdWxsID0gbWFpbl8oKDAsIGdhbWV0cmVlXzEucGFyc2VfY3Vyc29yZWQpKHRleHQgKyBmdWxsX25vdGF0aW9uKS5tYWluKTtcclxuICAgICAgICAvLyBsb29zZSDjgafop6Pph4jjgZnjgovjgajkuozjg53jgYzlm57pgb/jgafjgY3jgovjgYzjgIFmdWxsIOOBp+ino+mHiOOBmeOCi+OBqOS6jOODneOBp+OBguOBo+OBpuOCsuODvOODoOOBjOe1guS6huOBmeOCi+OBqOOBjVxyXG4gICAgICAgIC8vIOOBk+OCjOOBr+OAjOS6jOODneOBp+OBmeOAjeOCkuefpeOCieOBm+OCi+OBn+OCgeOBq+Wni+eCueaYjuiomOOBjOW/heimgVxyXG4gICAgICAgIGlmIChsb29zZS5waGFzZSA9PT0gXCJyZXNvbHZlZFwiICYmIGZ1bGwucGhhc2UgPT09IFwiZ2FtZV9lbmRcIikge1xyXG4gICAgICAgICAgICBhcHBlbmRfYW5kX2xvYWQoZnVsbF9ub3RhdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobG9vc2UucGhhc2UgPT09IFwicmVzb2x2ZWRcIiAmJiBmdWxsLnBoYXNlID09PSBcInJlc29sdmVkXCIpIHtcclxuICAgICAgICAgICAgLy8g56e75YuV44GX44Gf44Od44O844Oz44GM5Y2z5bqn44Gr56KB44Gn5Y+W44KJ44KM44Gm5LqM44Od44GM6Kej5raI44GZ44KL44OR44K/44O844Oz44Gu5aC05ZCI44Gr44Gv44CB44CM55u06YCy44CN44Go44Gu56u25ZCI44GM55m655Sf44GZ44KL44GT44Go44Gv44Gq44GEXHJcbiAgICAgICAgICAgIC8vIOOBl+OBn+OBjOOBo+OBpuOAgeOBk+OBruWgtOWQiOOBr+ebtOmAsuOCkuaOoeeUqOOBl+OBpuWVj+mhjOOBquOBhOOBr+OBmlxyXG4gICAgICAgICAgICBhcHBlbmRfYW5kX2xvYWQobG9vc2Vfbm90YXRpb24pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyDjgoLjgYbjgojjgY/jgo/jgYvjgpPjgarjgYTjgYvjgokgZnVsbCBub3RhdGlvbiDjgafmm7jjgYTjgabjgYrjgY3jgb7jgZlcclxuICAgICAgICAgICAgYXBwZW5kX2FuZF9sb2FkKGZ1bGxfbm90YXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB0b1Nob2dpUm93TmFtZShuKSB7XHJcbiAgICByZXR1cm4gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIltuXTtcclxufVxyXG5mdW5jdGlvbiB0b1Nob2dpQ29sdW1uTmFtZShuKSB7XHJcbiAgICByZXR1cm4gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIltuXTtcclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=