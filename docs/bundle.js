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
exports.lookup_coords_from_side = exports.lookup_coords_from_side_and_prof = exports.put_entity_at_coord_and_also_adjust_flags = exports.delete_en_passant_flag = exports.clone_board = exports.get_entity_from_coord = void 0;
const type_1 = __webpack_require__(/*! ./type */ "./node_modules/shogoss-core/dist/type.js");
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
function clone_board(board) {
    return board.map(row => row.map(sq => sq === null ? null : (0, type_1.clone_entity)(sq)));
}
exports.clone_board = clone_board;
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
exports.from_custom_state = exports.main = exports.can_place_stone = exports.get_initial_state = exports.coordEq = exports.displayCoord = exports.entry_is_forbidden = exports.throws_if_unkumalable = exports.throws_if_uncastlable = exports.can_move = exports.can_see = exports.opponentOf = void 0;
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
Object.defineProperty(exports, "entry_is_forbidden", ({ enumerable: true, get: function () { return piece_phase_2.entry_is_forbidden; } }));
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
function can_place_stone(board, side, stone_to) {
    if ((0, board_1.get_entity_from_coord)(board, stone_to)) { // if the square is already occupied
        return false;
    }
    const new_board = (0, board_1.clone_board)(board);
    // まず置く
    (0, board_1.put_entity_at_coord_and_also_adjust_flags)(new_board, stone_to, { type: "碁", side });
    // 置いた後で、着手禁止かどうかを判断するために、
    //『囲まれている相手の駒/石を取る』→『囲まれている自分の駒/石を取る』をシミュレーションして、置いた位置の石が死んでいたら
    const black_and_white = new_board.map(row => row.map(sq => sq === null ? null : sq.side));
    const opponent_removed = (0, surround_1.remove_surrounded)((0, side_1.opponentOf)(side), black_and_white);
    const result = (0, surround_1.remove_surrounded)(side, opponent_removed);
    if ((0, board_1.get_entity_from_coord)(result, stone_to)) {
        return true;
    }
    else {
        return false;
    }
}
exports.can_place_stone = can_place_stone;
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
exports.throws_if_uncastlable = exports.can_move = exports.play_piece_phase = exports.throws_if_unkumalable = exports.entry_is_forbidden = void 0;
const board_1 = __webpack_require__(/*! ./board */ "./node_modules/shogoss-core/dist/board.js");
const type_1 = __webpack_require__(/*! ./type */ "./node_modules/shogoss-core/dist/type.js");
const coordinate_1 = __webpack_require__(/*! ./coordinate */ "./node_modules/shogoss-core/dist/coordinate.js");
const side_1 = __webpack_require__(/*! ./side */ "./node_modules/shogoss-core/dist/side.js");
const can_see_1 = __webpack_require__(/*! ./can_see */ "./node_modules/shogoss-core/dist/can_see.js");
function entry_is_forbidden(prof, side, to) {
    if (prof === "桂") {
        return (0, side_1.is_within_nth_furthest_rows)(2, side, to);
    }
    else if (prof === "香" || prof === "ポ") {
        return (0, side_1.is_within_nth_furthest_rows)(1, side, to);
    }
    else {
        return false;
    }
}
exports.entry_is_forbidden = entry_is_forbidden;
/** 駒を打つ。手駒から将棋駒を盤上に移動させる。行きどころの無い位置に桂馬と香車を打ったらエラー。
 *
 */
function parachute(old, o) {
    if ((0, board_1.get_entity_from_coord)(old.board, o.to)) {
        throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.to)}${o.prof}打とのことですが、${(0, coordinate_1.displayCoord)(o.to)}マスは既に埋まっています`);
    }
    if (entry_is_forbidden(o.prof, o.side, o.to)) {
        throw new Error(`${o.side}が${(0, coordinate_1.displayCoord)(o.to)}${o.prof}打とのことですが、行きどころのない${(0, type_1.professionFullName)(o.prof)}は打てません`);
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
exports.is_promotable = exports.isUnpromotedShogiProfession = exports.professionFullName = exports.unpromote = exports.clone_entity = void 0;
function clone_entity(entity) {
    return JSON.parse(JSON.stringify(entity));
}
exports.clone_entity = clone_entity;
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

/***/ "./node_modules/shogoss-frontend-gametree-parser/dist/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/shogoss-frontend-gametree-parser/dist/index.js ***!
  \*********************************************************************/
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
const shogoss_frontend_gametree_parser_1 = __webpack_require__(/*! shogoss-frontend-gametree-parser */ "./node_modules/shogoss-frontend-gametree-parser/dist/index.js");
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
    const new_history = (0, shogoss_frontend_gametree_parser_1.forward_history)(text);
    if (new_history) {
        document.getElementById("history").value = new_history;
        load_history();
    }
}
function backward() {
    GUI_state.selected = null;
    const text = document.getElementById("history").value;
    const new_history = (0, shogoss_frontend_gametree_parser_1.backward_history)(text);
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
    document.getElementById("forward").disabled = (0, shogoss_frontend_gametree_parser_1.forward_history)(text) === null;
    document.getElementById("backward").disabled = (0, shogoss_frontend_gametree_parser_1.backward_history)(text) === null;
    const moves = (0, shogoss_frontend_gametree_parser_1.parse_cursored)(text);
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
function select_piece_in_hand(index, side) {
    GUI_state.selected = { type: "piece_in_hand", index, side };
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
            if (entity.type !== "碁") {
                piece_or_stone.addEventListener("click", () => select_piece_on_board([col_, row_]));
            }
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
                    possible_destination.addEventListener("click", () => { move_piece(to, entity_that_moves); });
                    ans.push(possible_destination);
                }
            }
        }
    }
    else if (GUI_state.selected?.type === "piece_in_hand") {
        const hand = GUI_state.selected.side === "白" ? situation.hand_of_white : situation.hand_of_black;
        const selected_profession = hand[GUI_state.selected.index];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const row_ = toShogiRowName(row);
                const col_ = toShogiColumnName(col);
                const to = [col_, row_];
                if (get_entity_from_coord(situation.board, to)) {
                    continue; // 駒がある場所には打てない
                }
                if ((0, shogoss_core_1.entry_is_forbidden)(selected_profession, GUI_state.selected.side, to)) {
                    continue; // 桂馬と香車は打てる場所が限られる
                }
                const side = GUI_state.selected.side;
                const possible_destination = document.createElement("div");
                possible_destination.classList.add("possible_destination");
                possible_destination.style.cssText = `top:${50 + row * 50}px; left:${100 + col * 50}px;`;
                possible_destination.addEventListener("click", () => parachute(to, selected_profession, side));
                ans.push(possible_destination);
            }
        }
    }
    else if (GUI_state.selected?.type === "stone_in_hand") {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const row_ = toShogiRowName(row);
                const col_ = toShogiColumnName(col);
                const to = [col_, row_];
                if (get_entity_from_coord(situation.board, to)) {
                    continue; // 駒がある場所には打てない
                }
                if (!(0, shogoss_core_1.can_place_stone)(situation.board, GUI_state.selected.side, to)) {
                    continue; // 着手禁止点を除外する
                }
                const side = GUI_state.selected.side;
                const possible_destination = document.createElement("div");
                possible_destination.classList.add("possible_destination");
                possible_destination.style.cssText = `top:${50 + row * 50}px; left:${100 + col * 50}px;`;
                possible_destination.addEventListener("click", () => place_stone(to, side));
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
        const is_selected = GUI_state.selected?.type === "piece_in_hand" && GUI_state.selected.side === "白" && GUI_state.selected.index === index;
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
        const is_selected = GUI_state.selected?.type === "piece_in_hand" && GUI_state.selected.side === "黒" && GUI_state.selected.index === index;
        if (is_selected) {
            piece_in_hand.classList.add("selected");
        }
        ans.push(piece_in_hand);
    });
    // 棋譜の最後が自分の動きで終わっているなら、碁石を置くオプションを表示する
    const text = document.getElementById("history").value;
    const moves = (0, shogoss_frontend_gametree_parser_1.parse_cursored)(text);
    const final_move = moves.main[moves.main.length - 1];
    if (final_move && !final_move.stone_to) {
        if (final_move.piece_phase.side === "白") {
            const stone_in_hand = document.createElement("div");
            stone_in_hand.classList.add("white");
            stone_in_hand.style.cssText = `top:${50 - 1 * 50}px; left: 586px;`;
            stone_in_hand.addEventListener("click", () => select_stone_in_hand("白"));
            const is_selected = GUI_state.selected?.type === "stone_in_hand" && GUI_state.selected.side === "白";
            if (is_selected) {
                stone_in_hand.classList.add("selected");
            }
            ans.push(stone_in_hand);
        }
        else {
            const stone_in_hand = document.createElement("div");
            stone_in_hand.classList.add("black");
            stone_in_hand.style.cssText = `top:${450 + 1 * 50}px; left: 40px;`;
            stone_in_hand.addEventListener("click", () => select_stone_in_hand("黒"));
            const is_selected = GUI_state.selected?.type === "stone_in_hand" && GUI_state.selected.side === "黒";
            if (is_selected) {
                stone_in_hand.classList.add("selected");
            }
            ans.push(stone_in_hand);
        }
    }
    board_dom.append(...ans);
}
function select_stone_in_hand(side) {
    GUI_state.selected = { type: "stone_in_hand", side };
    render(GUI_state.situation);
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
function place_stone(to, side) {
    let text = document.getElementById("history").value;
    const moves = (0, shogoss_frontend_gametree_parser_1.parse_cursored)(text);
    if (moves.unevaluated.length > 0) {
        if (!confirm("以降の局面が破棄されます。よろしいですか？（将来的には、局面を破棄せず分岐する機能を足したいと思っています）")) {
            GUI_state.selected = null;
            render(GUI_state.situation);
            return null;
        }
    }
    text = (0, shogoss_frontend_gametree_parser_1.take_until_first_cursor)(text);
    text = text.trimEnd();
    const stone_coord = `${to[0]}${to[1]}`;
    // 無理な手を指した時に落とす
    try {
        main_((0, shogoss_frontend_gametree_parser_1.parse_cursored)(text + stone_coord).main);
    }
    catch (e) {
        alert(e);
        GUI_state.selected = null;
        render(GUI_state.situation);
        return;
    }
    text = text.trimEnd();
    text += stone_coord;
    document.getElementById("history").value = text;
    load_history();
    return text;
}
function parachute(to, prof, side) {
    let text = document.getElementById("history").value;
    const moves = (0, shogoss_frontend_gametree_parser_1.parse_cursored)(text);
    if (moves.unevaluated.length > 0) {
        if (!confirm("以降の局面が破棄されます。よろしいですか？（将来的には、局面を破棄せず分岐する機能を足したいと思っています）")) {
            GUI_state.selected = null;
            render(GUI_state.situation);
            return null;
        }
    }
    text = (0, shogoss_frontend_gametree_parser_1.take_until_first_cursor)(text);
    const from_txt = "打";
    const full_notation = `${side === "黒" ? "▲" : "△"}${to[0]}${to[1]}${prof}${from_txt}`;
    // 無理な手を指した時に落とす
    try {
        main_((0, shogoss_frontend_gametree_parser_1.parse_cursored)(text + full_notation).main);
    }
    catch (e) {
        alert(e);
        GUI_state.selected = null;
        render(GUI_state.situation);
        return;
    }
    const loose_notation = `${side === "黒" ? "▲" : "△"}${to[0]}${to[1]}${prof}`;
    // 曖昧性が出ないときには from を書かずに通す
    try {
        main_((0, shogoss_frontend_gametree_parser_1.parse_cursored)(text + loose_notation).main);
    }
    catch (e) {
        // 曖昧性が出た
        text = append_and_load(full_notation, text);
        return;
    }
    // 曖昧性が無いので from を書かずに通す
    text = append_and_load(loose_notation, text);
    return;
}
function append_and_load(notation, text) {
    text = text.trimEnd();
    text += (text ? "　" : "") + notation;
    document.getElementById("history").value = text;
    load_history();
    return text;
}
function move_piece(to, entity_that_moves) {
    if (GUI_state.selected?.type !== "piece_on_board") {
        throw new Error("should not happen");
    }
    let text = document.getElementById("history").value;
    const moves = (0, shogoss_frontend_gametree_parser_1.parse_cursored)(text);
    if (moves.unevaluated.length > 0) {
        if (!confirm("以降の局面が破棄されます。よろしいですか？（将来的には、局面を破棄せず分岐する機能を足したいと思っています）")) {
            GUI_state.selected = null;
            render(GUI_state.situation);
            return null;
        }
    }
    text = (0, shogoss_frontend_gametree_parser_1.take_until_first_cursor)(text);
    const from = GUI_state.selected.coord;
    const from_txt = `${from[0]}${from[1]}`;
    const full_notation = `${entity_that_moves.side === "黒" ? "▲" : "△"}${to[0]}${to[1]}${entity_that_moves.prof}(${from_txt})`;
    // 無理な手を指した時に落とす
    try {
        main_((0, shogoss_frontend_gametree_parser_1.parse_cursored)(text + full_notation).main);
    }
    catch (e) {
        alert(e);
        GUI_state.selected = null;
        render(GUI_state.situation);
        return;
    }
    const loose_notation = `${entity_that_moves.side === "黒" ? "▲" : "△"}${to[0]}${to[1]}${entity_that_moves.prof}`;
    // 曖昧性が出ないときには from を書かずに通す
    try {
        main_((0, shogoss_frontend_gametree_parser_1.parse_cursored)(text + loose_notation).main);
    }
    catch (e) {
        // 曖昧性が出た
        text = append_and_load(full_notation, text);
        return;
    }
    // 曖昧性が無いので from を書かずに通す
    // ただし、ここで「二ポの可能性は無視して曖昧性を考える」という仕様が牙をむく
    if (entity_that_moves.prof !== "ポ") {
        text = append_and_load(loose_notation, text);
        return;
    }
    else {
        const loose = main_((0, shogoss_frontend_gametree_parser_1.parse_cursored)(text + loose_notation).main);
        const full = main_((0, shogoss_frontend_gametree_parser_1.parse_cursored)(text + full_notation).main);
        // loose で解釈すると二ポが回避できるが、full で解釈すると二ポであってゲームが終了するとき
        // これは「二ポです」を知らせるために始点明記が必要
        if (loose.phase === "resolved" && full.phase === "game_end") {
            text = append_and_load(full_notation, text);
            return;
        }
        else if (loose.phase === "resolved" && full.phase === "resolved") {
            // 移動したポーンが即座に碁で取られて二ポが解消するパターンの場合には、「直進」との競合が発生することはない
            // したがって、この場合は直進を採用して問題ないはず
            text = append_and_load(loose_notation, text);
            return;
        }
        else {
            // もうよくわかんないから full notation で書いておきます
            text = append_and_load(full_notation, text);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q3RFLGtCQUFrQixvREFBb0Q7QUFDdEUsa0JBQWtCLG1EQUFtRDtBQUNyRTtBQUNBO0FBQ0Esa0JBQWtCLG9EQUFvRDtBQUN0RSxrQkFBa0Isb0RBQW9EO0FBQ3RFLGtCQUFrQixvREFBb0Q7QUFDdEU7QUFDQSxrQkFBa0Isb0RBQW9EO0FBQ3RFO0FBQ0Esa0JBQWtCLG9EQUFvRDtBQUN0RSxrQkFBa0Isb0RBQW9EO0FBQ3RFLGtCQUFrQixvREFBb0Q7QUFDdEU7QUFDQTtBQUNBLGtCQUFrQixvREFBb0Q7QUFDdEUsa0JBQWtCLG9EQUFvRDtBQUN0RSxrQkFBa0Isb0RBQW9EO0FBQ3RFLGtCQUFrQixvREFBb0Q7QUFDdEUsa0JBQWtCLG9EQUFvRDtBQUN0RSxrQkFBa0Isb0RBQW9EO0FBQ3RFLGtCQUFrQixvREFBb0Q7QUFDdEUsa0JBQWtCLG9EQUFvRDtBQUN0RSxrQkFBa0Isb0RBQW9EO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isb0RBQW9EO0FBQ3RFLGtCQUFrQixvREFBb0Q7QUFDdEUsa0JBQWtCLG9EQUFvRDtBQUN0RSxrQkFBa0Isb0RBQW9EO0FBQ3RFLGtCQUFrQixvREFBb0Q7QUFDdEUsa0JBQWtCLG9EQUFvRDtBQUN0RSxrQkFBa0Isb0RBQW9EO0FBQ3RFLGtCQUFrQixvREFBb0Q7QUFDdEUsa0JBQWtCLG9EQUFvRDtBQUN0RTtBQUNBO0FBQ0Esa0JBQWtCLG9EQUFvRDtBQUN0RSxrQkFBa0Isb0RBQW9EO0FBQ3RFLGtCQUFrQixvREFBb0Q7QUFDdEU7QUFDQSxrQkFBa0Isb0RBQW9EO0FBQ3RFO0FBQ0Esa0JBQWtCLG9EQUFvRDtBQUN0RSxrQkFBa0Isb0RBQW9EO0FBQ3RFLGtCQUFrQixvREFBb0Q7QUFDdEU7QUFDQTtBQUNBLGtCQUFrQixtREFBbUQ7QUFDckUsa0JBQWtCLG9EQUFvRDtBQUN0RSxrQkFBa0Isb0RBQW9EO0FBQ3RFLGtCQUFrQixvREFBb0Q7QUFDdEUsa0JBQWtCLGdGQUFnRjtBQUNsRyxrQkFBa0Isb0RBQW9EO0FBQ3RFLGtCQUFrQixvREFB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvYWZ0ZXJfc3RvbmVfcGhhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Nob2dvc3MtY29yZS9kaXN0L2JvYXJkLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC9jYW5fc2VlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC9jb29yZGluYXRlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc2hvZ29zcy1jb3JlL2Rpc3QvcGllY2VfcGhhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Nob2dvc3MtY29yZS9kaXN0L3NpZGUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3Nob2dvc3MtY29yZS9kaXN0L3N1cnJvdW5kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWNvcmUvZGlzdC90eXBlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLWZyb250ZW5kLWdhbWV0cmVlLXBhcnNlci9kaXN0L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zaG9nb3NzLXBhcnNlci9kaXN0L2luZGV4LmpzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5yZXNvbHZlX2FmdGVyX3N0b25lX3BoYXNlID0gdm9pZCAwO1xyXG5jb25zdCBib2FyZF8xID0gcmVxdWlyZShcIi4vYm9hcmRcIik7XHJcbmNvbnN0IHNpZGVfMSA9IHJlcXVpcmUoXCIuL3NpZGVcIik7XHJcbmNvbnN0IHN1cnJvdW5kXzEgPSByZXF1aXJlKFwiLi9zdXJyb3VuZFwiKTtcclxuY29uc3QgdHlwZV8xID0gcmVxdWlyZShcIi4vdHlwZVwiKTtcclxuLyoqIOefs+ODleOCp+OCpOOCuuOBjOe1guS6huOBl+OBn+W+jOOAgeWLneaVl+WIpOWumuOBqOWbsueigeaknOafu+OCkuOBmeOCi+OAgiAvIFRvIGJlIGNhbGxlZCBhZnRlciBhIHN0b25lIGlzIHBsYWNlZDogY2hlY2tzIHRoZSB2aWN0b3J5IGNvbmRpdGlvbiBhbmQgdGhlIGdhbWUtb2YtZ28gY29uZGl0aW9uLlxyXG4gKiDjgb7jgZ/jgIHnm7jmiYvjga7jg53lhbXjgavjgqLjg7Pjg5Hjg4PjgrXjg7Pjg5Xjg6njgrDjgYzjgaTjgYTjgabjgYTjgZ/jgonjgIHjgZ3jgozjgpLlj5bjgorpmaTjgY/vvIjoh6rliIbjgYzmiYvjgpLmjIfjgZfjgZ/jgZPjgajjgavjgojjgaPjgabjgIHjgqLjg7Pjg5Hjg4PjgrXjg7Pjga7mqKnliKnjgYzlpLHjgo/jgozjgZ/jga7jgafvvIlcclxuICogQWxzbywgaWYgdGhlIG9wcG9uZW50J3MgcGF3biBoYXMgYW4gZW4gcGFzc2FudCBmbGFnLCBkZWxldGUgaXQgKHNpbmNlLCBieSBwbGF5aW5nIGEgcGllY2UgdW5yZWxhdGVkIHRvIGVuIHBhc3NhbnQsIHlvdSBoYXZlIGxvc3QgdGhlIHJpZ2h0IHRvIGNhcHR1cmUgYnkgZW4gcGFzc2FudClcclxuICpcclxuICogMS4g6Ieq5YiG44Gu6aeS44Go55+z44Gr44KI44Gj44Gm5Zuy44G+44KM44Gm44GE44KL55u45omL44Gu6aeS44Go55+z44KS44GZ44G544Gm5Y+W44KK6Zmk44GPXHJcbiAqIDIuIOebuOaJi+OBrumnkuOBqOefs+OBq+OCiOOBo+OBpuWbsuOBvuOCjOOBpuOBhOOCi+iHquWIhuOBrumnkuOBqOefs+OCkuOBmeOBueOBpuWPluOCiumZpOOBj1xyXG4gKiAzLiDkuozjg53jgYznmbrnlJ/jgZfjgabjgYTjgovjgYvjg7vjgq3jg7PjgrDnjovjgYznm6TpnaLjgYvjgonpmaTjgYvjgozjgabjgYTjgovjgYvjgpLliKTlrprjgIJcclxuICogICAzLTEuIOS4oeOCreODs+OCsOeOi+OBjOmZpOOBi+OCjOOBpuOBhOOBn+OCieOAgeOCq+ODqeODhuOCuOODo+ODs+OCseODs+ODnOOCr+OCt+ODs+OCsFxyXG4gKiAgIDMtMi4g6Ieq5YiG44Gu546L44Gg44GR6Zmk44GL44KM44Gm44GE44Gf44KJ44CB44Gd44KM44Gv44CM546L44Gu6Ieq5q6644Gr44KI44KL5pWX5YyX44CNXHJcbiAqICAgMy0zLiDnm7jmiYvjga7njovjgaDjgZHpmaTjgYvjgozjgabjgYTjgovloLTlkIjjgIFcclxuICogICAgICAgMy0zLTEuIOS6jOODneOBjOeZuueUn+OBl+OBpuOBhOOBquOBkeOCjOOBsOOAgeOBneOCjOOBr+OAjOeOi+OBruaOkumZpOOBq+OCiOOCi+WLneWIqeOAjVxyXG4gKiAgICAgICAgICAgICAzLTMtMS0xLiDnm7jmiYvjga7njovjgpLlj5bjgorpmaTjgYTjgZ/jga7jgYzjgrnjg4bjg4Pjg5cgMS4g44Gn44GC44KK44CBXHJcbiAqICAgICAgICAgICAgICAgICAgICAgIOOBl+OBi+OCguOAjOOBlOOBo+OBneOCiuOAje+8iEByZV9oYWtvX21vb27mm7DjgY/jgIEy5YCL44GLM+WAi++8iVxyXG4gKiAgICAgICAgICAgICAgICAgICAgICDjgavoqbLlvZPjgZnjgovjgajjgY3jgavjga/jgIzjgrfjg6fjgrTjgrnvvIHjgI3jga7nmbrlo7BcclxuICogICAgICAgMy0zLTIuIOS6jOODneOBjOeZuueUn+OBl+OBpuOBhOOCi+OBquOCieOAgeOCq+ODqeODhuOCuOODo+ODs+OCseODs+ODnOOCr+OCt+ODs+OCsFxyXG4gKiAgIDMtNC4g44Gp44Gh44KJ44Gu546L44KC6Zmk44GL44KM44Gm44GE44Gq44GE5aC05ZCI44CBXHJcbiAqICAgICAgIDMtNC0xLiDkuozjg53jgYznmbrnlJ/jgZfjgabjgYTjgarjgZHjgozjgbDjgIHjgrLjg7zjg6DntprooYxcclxuICogICAgICAgMy00LTIuIOS6jOODneOBjOeZuueUn+OBl+OBpuOBhOOCi+OBquOCieOAgeOBneOCjOOBr+OAjOS6jOODneOBq+OCiOOCi+aVl+WMl+OAjVxyXG4gKlxyXG4gKiAxIOKGkiAyIOOBrumghueVquOBp+OBguOCi+agueaLoO+8muOCs+ODs+ODk+ODjeODvOOCt+ODp+ODs+OCouOCv+ODg+OCr+OBruWtmOWcqFxyXG4gKiAyIOKGkiAzIOOBrumghueVquOBp+OBguOCi+agueaLoO+8muWFrOW8j+ODq+ODvOODq+i/veiomFxyXG4gKiDjgIznn7Pjg5XjgqfjgqTjgrrjgpLnnYDmiYvjgZfjgZ/ntZDmnpzjgajjgZfjgaboh6rliIbjga7jg53jg7zjg7PlhbXjgYznm6TkuIrjgYvjgonmtojjgYjkuozjg53jgYzop6PmsbrjgZXjgozjgovloLTlkIjjgoLjgIHlj43liYfjgpLjgajjgonjgZrpgLLooYzjgafjgY3jgovjgILjgI1cclxuICpcclxuICogMS4gUmVtb3ZlIGFsbCB0aGUgb3Bwb25lbnQncyBwaWVjZXMgYW5kIHN0b25lcyBzdXJyb3VuZGVkIGJ5IHlvdXIgcGllY2VzIGFuZCBzdG9uZXNcclxuICogMi4gUmVtb3ZlIGFsbCB5b3VyIHBpZWNlcyBhbmQgc3RvbmVzIHN1cnJvdW5kZWQgYnkgdGhlIG9wcG9uZW50J3MgcGllY2VzIGFuZCBzdG9uZXNcclxuICogMy4gQ2hlY2tzIHdoZXRoZXIgdHdvIHBhd25zIG9jY3VweSB0aGUgc2FtZSBjb2x1bW4sIGFuZCBjaGVja3Mgd2hldGhlciBhIGtpbmcgaXMgcmVtb3ZlZCBmcm9tIHRoZSBib2FyZC5cclxuICogICAzLTEuIElmIGJvdGgga2luZ3MgYXJlIHJlbW92ZWQsIHRoYXQgaXMgYSBkcmF3LCBhbmQgdGhlcmVmb3JlIGEgS2FyYXRlIFJvY2stUGFwZXItU2Npc3NvcnMgQm94aW5nLlxyXG4gKiAgIDMtMi4gSWYgeW91ciBraW5nIGlzIHJlbW92ZWQgYnV0IHRoZSBvcHBvbmVudCdzIHJlbWFpbnMsIHRoZW4gaXQncyBhIGxvc3MgYnkga2luZydzIHN1aWNpZGUuXHJcbiAqICAgMy0zLiBJZiB0aGUgb3Bwb25lbnQncyBraW5nIGlzIHJlbW92ZWQgYnV0IHlvdXJzIHJlbWFpbnMsXHJcbiAqICAgICAgICAzLTMtMS4gSWYgbm8gdHdvIHBhd25zIG9jY3VweSB0aGUgc2FtZSBjb2x1bW4sIHRoZW4gaXQncyBhIHZpY3RvcnlcclxuICogICAgICAgICAgICAgMy0zLTEtMS4gSWYgdGhlIHN0ZXAgdGhhdCByZW1vdmVkIHRoZSBvcHBvbmVudCdzIGtpbmcgd2FzIHN0ZXAgMSxcclxuICogICAgICAgICAgICAgICAgICAgICAgYW5kIHdoZW4gYSBsYXJnZSBudW1iZXIgKD49IDIgb3IgMywgYWNjb3JkaW5nIHRvIEByZV9oYWtvX21vb24pXHJcbiAqICAgICAgICAgICAgICAgICAgICAgIG9mIHBpZWNlcy9zdG9uZXMgYXJlIHJlbW92ZWQsIHRoZW4gXCJTaG9Hb1NzIVwiIHNob3VsZCBiZSBzaG91dGVkXHJcbiAqXHJcbiAqIFRoZSBvcmRlcmluZyAxIOKGkiAyIGlzIG5lZWRlZCB0byBzdXBwb3J0IHRoZSBjb21iaW5hdGlvbiBhdHRhY2suXHJcbiAqIFRoZSBvcmRlcmluZyAyIOKGkiAzIGlzIGV4cGxpY2l0bHkgbWVudGlvbmVkIGJ5IHRoZSBhZGRlbmR1bSB0byB0aGUgb2ZmaWNpYWwgcnVsZTpcclxuICogICAgICAgICDjgIznn7Pjg5XjgqfjgqTjgrrjgpLnnYDmiYvjgZfjgZ/ntZDmnpzjgajjgZfjgaboh6rliIbjga7jg53jg7zjg7PlhbXjgYznm6TkuIrjgYvjgonmtojjgYjkuozjg53jgYzop6PmsbrjgZXjgozjgovloLTlkIjjgoLjgIHlj43liYfjgpLjgajjgonjgZrpgLLooYzjgafjgY3jgovjgILjgI1cclxuICoqL1xyXG5mdW5jdGlvbiByZXNvbHZlX2FmdGVyX3N0b25lX3BoYXNlKHBsYXllZCkge1xyXG4gICAgcmVtb3ZlX3N1cnJvdW5kZWRfZW5pdGl0aWVzX2Zyb21fYm9hcmRfYW5kX2FkZF90b19oYW5kX2lmX25lY2Vzc2FyeShwbGF5ZWQsICgwLCBzaWRlXzEub3Bwb25lbnRPZikocGxheWVkLmJ5X3dob20pKTtcclxuICAgIHJlbW92ZV9zdXJyb3VuZGVkX2VuaXRpdGllc19mcm9tX2JvYXJkX2FuZF9hZGRfdG9faGFuZF9pZl9uZWNlc3NhcnkocGxheWVkLCBwbGF5ZWQuYnlfd2hvbSk7XHJcbiAgICByZW5vdW5jZV9lbl9wYXNzYW50KHBsYXllZC5ib2FyZCwgcGxheWVkLmJ5X3dob20pO1xyXG4gICAgY29uc3QgZG91YmxlZF9wYXduc19leGlzdCA9IGRvZXNfZG91YmxlZF9wYXduc19leGlzdChwbGF5ZWQuYm9hcmQsIHBsYXllZC5ieV93aG9tKTtcclxuICAgIGNvbnN0IGlzX3lvdXJfa2luZ19hbGl2ZSA9IGtpbmdfaXNfYWxpdmUocGxheWVkLmJvYXJkLCBwbGF5ZWQuYnlfd2hvbSk7XHJcbiAgICBjb25zdCBpc19vcHBvbmVudHNfa2luZ19hbGl2ZSA9IGtpbmdfaXNfYWxpdmUocGxheWVkLmJvYXJkLCAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKHBsYXllZC5ieV93aG9tKSk7XHJcbiAgICBjb25zdCBzaXR1YXRpb24gPSB7XHJcbiAgICAgICAgYm9hcmQ6IHBsYXllZC5ib2FyZCxcclxuICAgICAgICBoYW5kX29mX2JsYWNrOiBwbGF5ZWQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICBoYW5kX29mX3doaXRlOiBwbGF5ZWQuaGFuZF9vZl93aGl0ZSxcclxuICAgIH07XHJcbiAgICBpZiAoIWlzX3lvdXJfa2luZ19hbGl2ZSkge1xyXG4gICAgICAgIGlmICghaXNfb3Bwb25lbnRzX2tpbmdfYWxpdmUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgcGhhc2U6IFwiZ2FtZV9lbmRcIiwgcmVhc29uOiBcImJvdGhfa2luZ19kZWFkXCIsIHZpY3RvcjogXCJLYXJhdGVKYW5rZW5Cb3hpbmdcIiwgZmluYWxfc2l0dWF0aW9uOiBzaXR1YXRpb24gfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHBoYXNlOiBcImdhbWVfZW5kXCIsIHJlYXNvbjogXCJraW5nX3N1aWNpZGVcIiwgdmljdG9yOiAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKHBsYXllZC5ieV93aG9tKSwgZmluYWxfc2l0dWF0aW9uOiBzaXR1YXRpb24gfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAoIWlzX29wcG9uZW50c19raW5nX2FsaXZlKSB7XHJcbiAgICAgICAgICAgIGlmICghZG91YmxlZF9wYXduc19leGlzdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcGhhc2U6IFwiZ2FtZV9lbmRcIiwgcmVhc29uOiBcImtpbmdfY2FwdHVyZVwiLCB2aWN0b3I6IHBsYXllZC5ieV93aG9tLCBmaW5hbF9zaXR1YXRpb246IHNpdHVhdGlvbiB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcGhhc2U6IFwiZ2FtZV9lbmRcIiwgcmVhc29uOiBcImtpbmdfY2FwdHVyZV9hbmRfZG91YmxlZF9wYXduc1wiLCB2aWN0b3I6IFwiS2FyYXRlSmFua2VuQm94aW5nXCIsIGZpbmFsX3NpdHVhdGlvbjogc2l0dWF0aW9uIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghZG91YmxlZF9wYXduc19leGlzdCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICBwaGFzZTogXCJyZXNvbHZlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGJvYXJkOiBwbGF5ZWQuYm9hcmQsXHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZF9vZl9ibGFjazogcGxheWVkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgICAgICAgICAgICAgaGFuZF9vZl93aGl0ZTogcGxheWVkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgd2hvX2dvZXNfbmV4dDogKDAsIHNpZGVfMS5vcHBvbmVudE9mKShwbGF5ZWQuYnlfd2hvbSlcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBwaGFzZTogXCJnYW1lX2VuZFwiLCByZWFzb246IFwiZG91YmxlZF9wYXduc1wiLCB2aWN0b3I6ICgwLCBzaWRlXzEub3Bwb25lbnRPZikocGxheWVkLmJ5X3dob20pLCBmaW5hbF9zaXR1YXRpb246IHNpdHVhdGlvbiB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMucmVzb2x2ZV9hZnRlcl9zdG9uZV9waGFzZSA9IHJlc29sdmVfYWZ0ZXJfc3RvbmVfcGhhc2U7XHJcbmZ1bmN0aW9uIHJlbm91bmNlX2VuX3Bhc3NhbnQoYm9hcmQsIGJ5X3dob20pIHtcclxuICAgIGNvbnN0IG9wcG9uZW50X3Bhd25fY29vcmRzID0gKDAsIGJvYXJkXzEubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGVfYW5kX3Byb2YpKGJvYXJkLCAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKGJ5X3dob20pLCBcIuODnVwiKTtcclxuICAgIGZvciAoY29uc3QgY29vcmQgb2Ygb3Bwb25lbnRfcGF3bl9jb29yZHMpIHtcclxuICAgICAgICAoMCwgYm9hcmRfMS5kZWxldGVfZW5fcGFzc2FudF9mbGFnKShib2FyZCwgY29vcmQpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGhhc19kdXBsaWNhdGVzKGFycmF5KSB7XHJcbiAgICByZXR1cm4gbmV3IFNldChhcnJheSkuc2l6ZSAhPT0gYXJyYXkubGVuZ3RoO1xyXG59XHJcbmZ1bmN0aW9uIGRvZXNfZG91YmxlZF9wYXduc19leGlzdChib2FyZCwgc2lkZSkge1xyXG4gICAgY29uc3QgY29vcmRzID0gKDAsIGJvYXJkXzEubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGVfYW5kX3Byb2YpKGJvYXJkLCBzaWRlLCBcIuODnVwiKTtcclxuICAgIGNvbnN0IGNvbHVtbnMgPSBjb29yZHMubWFwKChbY29sLCBfcm93XSkgPT4gY29sKTtcclxuICAgIHJldHVybiBoYXNfZHVwbGljYXRlcyhjb2x1bW5zKTtcclxufVxyXG5mdW5jdGlvbiBraW5nX2lzX2FsaXZlKGJvYXJkLCBzaWRlKSB7XHJcbiAgICByZXR1cm4gKDAsIGJvYXJkXzEubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGVfYW5kX3Byb2YpKGJvYXJkLCBzaWRlLCBcIuOCrVwiKS5sZW5ndGggKyAoMCwgYm9hcmRfMS5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZikoYm9hcmQsIHNpZGUsIFwi6LaFXCIpLmxlbmd0aCA+IDA7XHJcbn1cclxuZnVuY3Rpb24gcmVtb3ZlX3N1cnJvdW5kZWRfZW5pdGl0aWVzX2Zyb21fYm9hcmRfYW5kX2FkZF90b19oYW5kX2lmX25lY2Vzc2FyeShvbGQsIHNpZGUpIHtcclxuICAgIGNvbnN0IGJsYWNrX2FuZF93aGl0ZSA9IG9sZC5ib2FyZC5tYXAocm93ID0+IHJvdy5tYXAoc3EgPT4gc3EgPT09IG51bGwgPyBudWxsIDogc3Euc2lkZSkpO1xyXG4gICAgY29uc3QgaGFzX3N1cnZpdmVkID0gKDAsIHN1cnJvdW5kXzEucmVtb3ZlX3N1cnJvdW5kZWQpKHNpZGUsIGJsYWNrX2FuZF93aGl0ZSk7XHJcbiAgICBvbGQuYm9hcmQuZm9yRWFjaCgocm93LCBpKSA9PiByb3cuZm9yRWFjaCgoc3EsIGopID0+IHtcclxuICAgICAgICBpZiAoIWhhc19zdXJ2aXZlZFtpXT8uW2pdKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhcHR1cmVkX2VudGl0eSA9IHNxO1xyXG4gICAgICAgICAgICByb3dbal0gPSBudWxsO1xyXG4gICAgICAgICAgICBzZW5kX2NhcHR1cmVkX2VudGl0eV90b19vcHBvbmVudChvbGQsIGNhcHR1cmVkX2VudGl0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSkpO1xyXG59XHJcbmZ1bmN0aW9uIHNlbmRfY2FwdHVyZWRfZW50aXR5X3RvX29wcG9uZW50KG9sZCwgY2FwdHVyZWRfZW50aXR5KSB7XHJcbiAgICBpZiAoIWNhcHR1cmVkX2VudGl0eSlcclxuICAgICAgICByZXR1cm47XHJcbiAgICBjb25zdCBvcHBvbmVudCA9ICgwLCBzaWRlXzEub3Bwb25lbnRPZikoY2FwdHVyZWRfZW50aXR5LnNpZGUpO1xyXG4gICAgaWYgKGNhcHR1cmVkX2VudGl0eS50eXBlID09PSBcIuOBl+OCh1wiKSB7XHJcbiAgICAgICAgKG9wcG9uZW50ID09PSBcIueZvVwiID8gb2xkLmhhbmRfb2Zfd2hpdGUgOiBvbGQuaGFuZF9vZl9ibGFjaykucHVzaCgoMCwgdHlwZV8xLnVucHJvbW90ZSkoY2FwdHVyZWRfZW50aXR5LnByb2YpKTtcclxuICAgIH1cclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlID0gZXhwb3J0cy5sb29rdXBfY29vcmRzX2Zyb21fc2lkZV9hbmRfcHJvZiA9IGV4cG9ydHMucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MgPSBleHBvcnRzLmRlbGV0ZV9lbl9wYXNzYW50X2ZsYWcgPSBleHBvcnRzLmNsb25lX2JvYXJkID0gZXhwb3J0cy5nZXRfZW50aXR5X2Zyb21fY29vcmQgPSB2b2lkIDA7XHJcbmNvbnN0IHR5cGVfMSA9IHJlcXVpcmUoXCIuL3R5cGVcIik7XHJcbmNvbnN0IGNvb3JkaW5hdGVfMSA9IHJlcXVpcmUoXCIuL2Nvb3JkaW5hdGVcIik7XHJcbmZ1bmN0aW9uIGdldF9lbnRpdHlfZnJvbV9jb29yZChib2FyZCwgY29vcmQpIHtcclxuICAgIGNvbnN0IFtjb2x1bW4sIHJvd10gPSBjb29yZDtcclxuICAgIGNvbnN0IHJvd19pbmRleCA9IFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZihyb3cpO1xyXG4gICAgY29uc3QgY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGNvbHVtbik7XHJcbiAgICBpZiAocm93X2luZGV4ID09PSAtMSB8fCBjb2x1bW5faW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDluqfmqJnjgIwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShjb29yZCl944CN44Gv5LiN5q2j44Gn44GZYCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKGJvYXJkW3Jvd19pbmRleF0/Lltjb2x1bW5faW5kZXhdKSA/PyBudWxsO1xyXG59XHJcbmV4cG9ydHMuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkID0gZ2V0X2VudGl0eV9mcm9tX2Nvb3JkO1xyXG5mdW5jdGlvbiBjbG9uZV9ib2FyZChib2FyZCkge1xyXG4gICAgcmV0dXJuIGJvYXJkLm1hcChyb3cgPT4gcm93Lm1hcChzcSA9PiBzcSA9PT0gbnVsbCA/IG51bGwgOiAoMCwgdHlwZV8xLmNsb25lX2VudGl0eSkoc3EpKSk7XHJcbn1cclxuZXhwb3J0cy5jbG9uZV9ib2FyZCA9IGNsb25lX2JvYXJkO1xyXG5mdW5jdGlvbiBkZWxldGVfZW5fcGFzc2FudF9mbGFnKGJvYXJkLCBjb29yZCkge1xyXG4gICAgY29uc3QgW2NvbHVtbiwgcm93XSA9IGNvb3JkO1xyXG4gICAgY29uc3Qgcm93X2luZGV4ID0gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIi5pbmRleE9mKHJvdyk7XHJcbiAgICBjb25zdCBjb2x1bW5faW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2YoY29sdW1uKTtcclxuICAgIGlmIChyb3dfaW5kZXggPT09IC0xIHx8IGNvbHVtbl9pbmRleCA9PT0gLTEpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOW6p+aomeOAjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGNvb3JkKX3jgI3jga/kuI3mraPjgafjgZlgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHBhd24gPSBib2FyZFtyb3dfaW5kZXhdW2NvbHVtbl9pbmRleF07XHJcbiAgICBpZiAocGF3bj8udHlwZSAhPT0gXCLjgrlcIiB8fCBwYXduLnByb2YgIT09IFwi44OdXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOODneODvOODs+OBruOBquOBhOW6p+aomeOAjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGNvb3JkKX3jgI3jgavlr77jgZfjgaYgXFxgZGVsZXRlX2VuX3Bhc3NhbnRfZmxhZygpXFxgIOOBjOWRvOOBsOOCjOOBvuOBl+OBn2ApO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlIHBhd24uc3ViamVjdF90b19lbl9wYXNzYW50O1xyXG59XHJcbmV4cG9ydHMuZGVsZXRlX2VuX3Bhc3NhbnRfZmxhZyA9IGRlbGV0ZV9lbl9wYXNzYW50X2ZsYWc7XHJcbi8qKlxyXG4gKiDpp5Ljg7vnooHnn7Pjg7tudWxsIOOCkuebpOS4iuOBrueJueWumuOBruS9jee9ruOBq+mFjee9ruOBmeOCi+OAgmNhbl9jYXN0bGUg44OV44Op44Kw44GoIGNhbl9rdW1hbCDjg5Xjg6njgrDjgpLpganlrpzoqr/mlbTjgZnjgovjgIJcclxuICogQHBhcmFtIGJvYXJkXHJcbiAqIEBwYXJhbSBjb29yZFxyXG4gKiBAcGFyYW0gbWF5YmVfZW50aXR5XHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5mdW5jdGlvbiBwdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncyhib2FyZCwgY29vcmQsIG1heWJlX2VudGl0eSkge1xyXG4gICAgY29uc3QgW2NvbHVtbiwgcm93XSA9IGNvb3JkO1xyXG4gICAgY29uc3Qgcm93X2luZGV4ID0gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIi5pbmRleE9mKHJvdyk7XHJcbiAgICBjb25zdCBjb2x1bW5faW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2YoY29sdW1uKTtcclxuICAgIGlmIChyb3dfaW5kZXggPT09IC0xIHx8IGNvbHVtbl9pbmRleCA9PT0gLTEpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOW6p+aomeOAjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGNvb3JkKX3jgI3jga/kuI3mraPjgafjgZlgKTtcclxuICAgIH1cclxuICAgIGlmIChtYXliZV9lbnRpdHk/LnR5cGUgPT09IFwi546LXCIpIHtcclxuICAgICAgICBpZiAobWF5YmVfZW50aXR5Lm5ldmVyX21vdmVkKSB7XHJcbiAgICAgICAgICAgIG1heWJlX2VudGl0eS5uZXZlcl9tb3ZlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBtYXliZV9lbnRpdHkuaGFzX21vdmVkX29ubHlfb25jZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG1heWJlX2VudGl0eS5oYXNfbW92ZWRfb25seV9vbmNlKSB7XHJcbiAgICAgICAgICAgIG1heWJlX2VudGl0eS5uZXZlcl9tb3ZlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBtYXliZV9lbnRpdHkuaGFzX21vdmVkX29ubHlfb25jZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG1heWJlX2VudGl0eT8udHlwZSA9PT0gXCLjgZfjgodcIiAmJiBtYXliZV9lbnRpdHkucHJvZiA9PT0gXCLppplcIikge1xyXG4gICAgICAgIG1heWJlX2VudGl0eS5jYW5fa3VtYWwgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKG1heWJlX2VudGl0eT8udHlwZSA9PT0gXCLjgrlcIikge1xyXG4gICAgICAgIG1heWJlX2VudGl0eS5uZXZlcl9tb3ZlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJvYXJkW3Jvd19pbmRleF1bY29sdW1uX2luZGV4XSA9IG1heWJlX2VudGl0eTtcclxufVxyXG5leHBvcnRzLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzID0gcHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3M7XHJcbmZ1bmN0aW9uIGxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mKGJvYXJkLCBzaWRlLCBwcm9mKSB7XHJcbiAgICBjb25zdCBhbnMgPSBbXTtcclxuICAgIGNvbnN0IHJvd3MgPSBbXCLkuIBcIiwgXCLkuoxcIiwgXCLkuIlcIiwgXCLlm5tcIiwgXCLkupRcIiwgXCLlha1cIiwgXCLkuINcIiwgXCLlhatcIiwgXCLkuZ1cIl07XHJcbiAgICBjb25zdCBjb2xzID0gW1wi77yRXCIsIFwi77ySXCIsIFwi77yTXCIsIFwi77yUXCIsIFwi77yVXCIsIFwi77yWXCIsIFwi77yXXCIsIFwi77yYXCIsIFwi77yZXCJdO1xyXG4gICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xyXG4gICAgICAgIGZvciAoY29uc3QgY29sIG9mIGNvbHMpIHtcclxuICAgICAgICAgICAgY29uc3QgY29vcmQgPSBbY29sLCByb3ddO1xyXG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSBnZXRfZW50aXR5X2Zyb21fY29vcmQoYm9hcmQsIGNvb3JkKTtcclxuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gbnVsbCB8fCBlbnRpdHkudHlwZSA9PT0gXCLnooFcIikge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZW50aXR5LnByb2YgPT09IHByb2YgJiYgZW50aXR5LnNpZGUgPT09IHNpZGUpIHtcclxuICAgICAgICAgICAgICAgIGFucy5wdXNoKGNvb3JkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFucztcclxufVxyXG5leHBvcnRzLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mID0gbG9va3VwX2Nvb3Jkc19mcm9tX3NpZGVfYW5kX3Byb2Y7XHJcbmZ1bmN0aW9uIGxvb2t1cF9jb29yZHNfZnJvbV9zaWRlKGJvYXJkLCBzaWRlKSB7XHJcbiAgICBjb25zdCBhbnMgPSBbXTtcclxuICAgIGNvbnN0IHJvd3MgPSBbXCLkuIBcIiwgXCLkuoxcIiwgXCLkuIlcIiwgXCLlm5tcIiwgXCLkupRcIiwgXCLlha1cIiwgXCLkuINcIiwgXCLlhatcIiwgXCLkuZ1cIl07XHJcbiAgICBjb25zdCBjb2xzID0gW1wi77yRXCIsIFwi77ySXCIsIFwi77yTXCIsIFwi77yUXCIsIFwi77yVXCIsIFwi77yWXCIsIFwi77yXXCIsIFwi77yYXCIsIFwi77yZXCJdO1xyXG4gICAgZm9yIChjb25zdCByb3cgb2Ygcm93cykge1xyXG4gICAgICAgIGZvciAoY29uc3QgY29sIG9mIGNvbHMpIHtcclxuICAgICAgICAgICAgY29uc3QgY29vcmQgPSBbY29sLCByb3ddO1xyXG4gICAgICAgICAgICBjb25zdCBlbnRpdHkgPSBnZXRfZW50aXR5X2Zyb21fY29vcmQoYm9hcmQsIGNvb3JkKTtcclxuICAgICAgICAgICAgaWYgKGVudGl0eSA9PT0gbnVsbCB8fCBlbnRpdHkudHlwZSA9PT0gXCLnooFcIikge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZW50aXR5LnNpZGUgPT09IHNpZGUpIHtcclxuICAgICAgICAgICAgICAgIGFucy5wdXNoKGNvb3JkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFucztcclxufVxyXG5leHBvcnRzLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlID0gbG9va3VwX2Nvb3Jkc19mcm9tX3NpZGU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZG9fYW55X29mX215X3BpZWNlc19zZWUgPSBleHBvcnRzLmNhbl9zZWUgPSB2b2lkIDA7XHJcbmNvbnN0IGJvYXJkXzEgPSByZXF1aXJlKFwiLi9ib2FyZFwiKTtcclxuY29uc3Qgc2lkZV8xID0gcmVxdWlyZShcIi4vc2lkZVwiKTtcclxuZnVuY3Rpb24gZGVsdGFFcShkLCBkZWx0YSkge1xyXG4gICAgcmV0dXJuIGQudiA9PT0gZGVsdGEudiAmJiBkLmggPT09IGRlbHRhLmg7XHJcbn1cclxuLyoqXHJcbiAqIGBvLmZyb21gIOOBq+mnkuOBjOOBguOBo+OBpuOBneOBrumnkuOBjCBgby50b2Ag44G444Go5Yip44GE44Gm44GE44KL44GL44Gp44GG44GL44KS6L+U44GZ44CC44Od44O844Oz44Gu5pac44KB5Yip44GN44Gv5bi444GrIGNhbl9zZWUg44Go6KaL44Gq44GZ44CC44Od44O844Oz44GuMuODnuOCueenu+WLleOBr+OAgemnkuOCkuWPluOCi+OBk+OBqOOBjOOBp+OBjeOBquOBhOOBruOBp+OAjOWIqeOBjeOAjeOBp+OBr+OBquOBhOOAglxyXG4gKiAgQ2hlY2tzIHdoZXRoZXIgdGhlcmUgaXMgYSBwaWVjZSBhdCBgby5mcm9tYCB3aGljaCBsb29rcyBhdCBgby50b2AuIFRoZSBkaWFnb25hbCBtb3ZlIG9mIHBhd24gaXMgYWx3YXlzIGNvbnNpZGVyZWQuIEEgcGF3biBuZXZlciBzZWVzIHR3byBzcXVhcmVzIGluIHRoZSBmcm9udDsgaXQgY2FuIG9ubHkgbW92ZSB0byB0aGVyZS5cclxuICogQHBhcmFtIGJvYXJkXHJcbiAqIEBwYXJhbSBvXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5mdW5jdGlvbiBjYW5fc2VlKGJvYXJkLCBvKSB7XHJcbiAgICBjb25zdCBwID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgby5mcm9tKTtcclxuICAgIGlmICghcCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChwLnR5cGUgPT09IFwi56KBXCIpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjb25zdCBkZWx0YSA9ICgwLCBzaWRlXzEuY29vcmREaWZmU2VlbkZyb20pKHAuc2lkZSwgbyk7XHJcbiAgICBpZiAocC5wcm9mID09PSBcIuaIkOahglwiIHx8IHAucHJvZiA9PT0gXCLmiJDpioBcIiB8fCBwLnByb2YgPT09IFwi5oiQ6aaZXCIgfHwgcC5wcm9mID09PSBcIumHkVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgeyB2OiAxLCBoOiAtMSB9LCB7IHY6IDEsIGg6IDAgfSwgeyB2OiAxLCBoOiAxIH0sXHJcbiAgICAgICAgICAgIHsgdjogMCwgaDogLTEgfSwgLyoqKioqKioqKioqKi8geyB2OiAwLCBoOiAxIH0sXHJcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKi8geyB2OiAtMSwgaDogMCB9IC8qKioqKioqKioqKioqKi9cclxuICAgICAgICBdLnNvbWUoZCA9PiBkZWx0YUVxKGQsIGRlbHRhKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi6YqAXCIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB7IHY6IDEsIGg6IC0xIH0sIHsgdjogMSwgaDogMCB9LCB7IHY6IDEsIGg6IDEgfSxcclxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcbiAgICAgICAgICAgIHsgdjogLTEsIGg6IC0xIH0sIC8qKioqKioqKioqKiovIHsgdjogMSwgaDogMSB9LFxyXG4gICAgICAgIF0uc29tZShkID0+IGRlbHRhRXEoZCwgZGVsdGEpKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLmoYJcIikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHsgdjogMiwgaDogLTEgfSwgeyB2OiAyLCBoOiAxIH1cclxuICAgICAgICBdLnNvbWUoZCA9PiBkZWx0YUVxKGQsIGRlbHRhKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi44OKXCIpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB7IHY6IDIsIGg6IC0xIH0sIHsgdjogMiwgaDogMSB9LFxyXG4gICAgICAgICAgICB7IHY6IC0yLCBoOiAtMSB9LCB7IHY6IC0yLCBoOiAxIH0sXHJcbiAgICAgICAgICAgIHsgdjogLTEsIGg6IDIgfSwgeyB2OiAxLCBoOiAyIH0sXHJcbiAgICAgICAgICAgIHsgdjogLTEsIGg6IC0yIH0sIHsgdjogMSwgaDogLTIgfVxyXG4gICAgICAgIF0uc29tZShkID0+IGRlbHRhRXEoZCwgZGVsdGEpKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLjgq1cIikge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHsgdjogMSwgaDogLTEgfSwgeyB2OiAxLCBoOiAwIH0sIHsgdjogMSwgaDogMSB9LFxyXG4gICAgICAgICAgICB7IHY6IDAsIGg6IC0xIH0sIC8qKioqKioqKioqKioqLyB7IHY6IDAsIGg6IDEgfSxcclxuICAgICAgICAgICAgeyB2OiAtMSwgaDogLTEgfSwgeyB2OiAtMSwgaDogMCB9LCB7IHY6IC0xLCBoOiAxIH0sXHJcbiAgICAgICAgXS5zb21lKGQgPT4gZGVsdGFFcShkLCBkZWx0YSkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIuOBqFwiIHx8IHAucHJvZiA9PT0gXCLjgq9cIikge1xyXG4gICAgICAgIHJldHVybiBsb25nX3JhbmdlKFtcclxuICAgICAgICAgICAgeyB2OiAxLCBoOiAtMSB9LCB7IHY6IDEsIGg6IDAgfSwgeyB2OiAxLCBoOiAxIH0sXHJcbiAgICAgICAgICAgIHsgdjogMCwgaDogLTEgfSwgLyoqKioqKioqKioqKiovIHsgdjogMCwgaDogMSB9LFxyXG4gICAgICAgICAgICB7IHY6IC0xLCBoOiAtMSB9LCB7IHY6IC0xLCBoOiAwIH0sIHsgdjogLTEsIGg6IDEgfSxcclxuICAgICAgICBdLCBib2FyZCwgbywgcC5zaWRlKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLjg5NcIikge1xyXG4gICAgICAgIHJldHVybiBsb25nX3JhbmdlKFtcclxuICAgICAgICAgICAgeyB2OiAxLCBoOiAtMSB9LCB7IHY6IDEsIGg6IDEgfSwgeyB2OiAtMSwgaDogLTEgfSwgeyB2OiAtMSwgaDogMSB9LFxyXG4gICAgICAgIF0sIGJvYXJkLCBvLCBwLnNpZGUpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIuODq1wiKSB7XHJcbiAgICAgICAgcmV0dXJuIGxvbmdfcmFuZ2UoW1xyXG4gICAgICAgICAgICB7IHY6IDEsIGg6IDAgfSwgeyB2OiAwLCBoOiAtMSB9LCB7IHY6IDAsIGg6IDEgfSwgeyB2OiAtMSwgaDogMCB9LFxyXG4gICAgICAgIF0sIGJvYXJkLCBvLCBwLnNpZGUpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocC5wcm9mID09PSBcIummmVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIGxvbmdfcmFuZ2UoW3sgdjogMSwgaDogMCB9XSwgYm9hcmQsIG8sIHAuc2lkZSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChwLnByb2YgPT09IFwi6LaFXCIpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHAucHJvZiA9PT0gXCLjg51cIikge1xyXG4gICAgICAgIGlmIChbeyB2OiAxLCBoOiAtMSB9LCB7IHY6IDEsIGg6IDAgfSwgeyB2OiAxLCBoOiAxIH1dLnNvbWUoZCA9PiBkZWx0YUVxKGQsIGRlbHRhKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBhIHBhd24gY2FuIG5ldmVyIHNlZSB0d28gc3F1YXJlcyBpbiBmcm9udDsgaXQgY2FuIG9ubHkgbW92ZSB0byB0aGVyZVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgXyA9IHAucHJvZjtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaG91bGQgbm90IHJlYWNoIGhlcmVcIik7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5jYW5fc2VlID0gY2FuX3NlZTtcclxuZnVuY3Rpb24gbG9uZ19yYW5nZShkaXJlY3Rpb25zLCBib2FyZCwgbywgc2lkZSkge1xyXG4gICAgY29uc3QgZGVsdGEgPSAoMCwgc2lkZV8xLmNvb3JkRGlmZlNlZW5Gcm9tKShzaWRlLCBvKTtcclxuICAgIGNvbnN0IG1hdGNoaW5nX2RpcmVjdGlvbnMgPSBkaXJlY3Rpb25zLmZpbHRlcihkaXJlY3Rpb24gPT4gZGVsdGEudiAqIGRpcmVjdGlvbi52ICsgZGVsdGEuaCAqIGRpcmVjdGlvbi5oID4gMCAvKiBpbm5lciBwcm9kdWN0IGlzIHBvc2l0aXZlICovXHJcbiAgICAgICAgJiYgZGVsdGEudiAqIGRpcmVjdGlvbi5oIC0gZGlyZWN0aW9uLnYgKiBkZWx0YS5oID09PSAwIC8qIGNyb3NzIHByb2R1Y3QgaXMgemVybyAqLyk7XHJcbiAgICBpZiAobWF0Y2hpbmdfZGlyZWN0aW9ucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjb25zdCBkaXJlY3Rpb24gPSBtYXRjaGluZ19kaXJlY3Rpb25zWzBdO1xyXG4gICAgZm9yIChsZXQgaSA9IHsgdjogZGlyZWN0aW9uLnYsIGg6IGRpcmVjdGlvbi5oIH07ICFkZWx0YUVxKGksIGRlbHRhKTsgaS52ICs9IGRpcmVjdGlvbi52LCBpLmggKz0gZGlyZWN0aW9uLmgpIHtcclxuICAgICAgICBjb25zdCBjb29yZCA9ICgwLCBzaWRlXzEuYXBwbHlEZWx0YVNlZW5Gcm9tKShzaWRlLCBvLmZyb20sIGkpO1xyXG4gICAgICAgIGlmICgoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBjb29yZCkpIHtcclxuICAgICAgICAgICAgLy8gYmxvY2tlZCBieSBzb21ldGhpbmc7IGNhbm5vdCBzZWVcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbmZ1bmN0aW9uIGRvX2FueV9vZl9teV9waWVjZXNfc2VlKGJvYXJkLCBjb29yZCwgc2lkZSkge1xyXG4gICAgY29uc3Qgb3Bwb25lbnRfcGllY2VfY29vcmRzID0gKDAsIGJvYXJkXzEubG9va3VwX2Nvb3Jkc19mcm9tX3NpZGUpKGJvYXJkLCBzaWRlKTtcclxuICAgIHJldHVybiBvcHBvbmVudF9waWVjZV9jb29yZHMuc29tZShmcm9tID0+IGNhbl9zZWUoYm9hcmQsIHsgZnJvbSwgdG86IGNvb3JkIH0pKTtcclxufVxyXG5leHBvcnRzLmRvX2FueV9vZl9teV9waWVjZXNfc2VlID0gZG9fYW55X29mX215X3BpZWNlc19zZWU7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuTGVmdG1vc3RXaGVuU2VlbkZyb21CbGFjayA9IGV4cG9ydHMuUmlnaHRtb3N0V2hlblNlZW5Gcm9tQmxhY2sgPSBleHBvcnRzLmNvb3JkRGlmZiA9IGV4cG9ydHMuY29sdW1uc0JldHdlZW4gPSBleHBvcnRzLmNvb3JkRXEgPSBleHBvcnRzLmRpc3BsYXlDb29yZCA9IHZvaWQgMDtcclxuZnVuY3Rpb24gZGlzcGxheUNvb3JkKGNvb3JkKSB7XHJcbiAgICByZXR1cm4gYCR7Y29vcmRbMF19JHtjb29yZFsxXX1gO1xyXG59XHJcbmV4cG9ydHMuZGlzcGxheUNvb3JkID0gZGlzcGxheUNvb3JkO1xyXG5mdW5jdGlvbiBjb29yZEVxKFtjb2wxLCByb3cxXSwgW2NvbDIsIHJvdzJdKSB7XHJcbiAgICByZXR1cm4gY29sMSA9PT0gY29sMiAmJiByb3cxID09PSByb3cyO1xyXG59XHJcbmV4cG9ydHMuY29vcmRFcSA9IGNvb3JkRXE7XHJcbmZ1bmN0aW9uIGNvbHVtbnNCZXR3ZWVuKGEsIGIpIHtcclxuICAgIGNvbnN0IGFfaW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2YoYSk7XHJcbiAgICBjb25zdCBiX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGIpO1xyXG4gICAgaWYgKGFfaW5kZXggPj0gYl9pbmRleClcclxuICAgICAgICByZXR1cm4gY29sdW1uc0JldHdlZW4oYiwgYSk7XHJcbiAgICBjb25zdCBhbnMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSBhX2luZGV4ICsgMTsgaSA8IGJfaW5kZXg7IGkrKykge1xyXG4gICAgICAgIGFucy5wdXNoKFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCJbaV0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFucztcclxufVxyXG5leHBvcnRzLmNvbHVtbnNCZXR3ZWVuID0gY29sdW1uc0JldHdlZW47XHJcbmZ1bmN0aW9uIGNvb3JkRGlmZihvKSB7XHJcbiAgICBjb25zdCBbZnJvbV9jb2x1bW4sIGZyb21fcm93XSA9IG8uZnJvbTtcclxuICAgIGNvbnN0IGZyb21fcm93X2luZGV4ID0gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIi5pbmRleE9mKGZyb21fcm93KTtcclxuICAgIGNvbnN0IGZyb21fY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGZyb21fY29sdW1uKTtcclxuICAgIGNvbnN0IFt0b19jb2x1bW4sIHRvX3Jvd10gPSBvLnRvO1xyXG4gICAgY29uc3QgdG9fcm93X2luZGV4ID0gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIi5pbmRleE9mKHRvX3Jvdyk7XHJcbiAgICBjb25zdCB0b19jb2x1bW5faW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2YodG9fY29sdW1uKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaDogdG9fY29sdW1uX2luZGV4IC0gZnJvbV9jb2x1bW5faW5kZXgsXHJcbiAgICAgICAgdjogdG9fcm93X2luZGV4IC0gZnJvbV9yb3dfaW5kZXhcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5jb29yZERpZmYgPSBjb29yZERpZmY7XHJcbmZ1bmN0aW9uIFJpZ2h0bW9zdFdoZW5TZWVuRnJvbUJsYWNrKGNvb3Jkcykge1xyXG4gICAgaWYgKGNvb3Jkcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cmllZCB0byB0YWtlIHRoZSBtYXhpbXVtIG9mIGFuIGVtcHR5IGFycmF5XCIpO1xyXG4gICAgfVxyXG4gICAgLy8gU2luY2UgXCLvvJFcIiB0byBcIu+8mVwiIGFyZSBjb25zZWN1dGl2ZSBpbiBVbmljb2RlLCB3ZSBjYW4ganVzdCBzb3J0IGl0IGFzIFVURi0xNiBzdHJpbmdcclxuICAgIGNvbnN0IGNvbHVtbnMgPSBjb29yZHMubWFwKChbY29sLCBfcm93XSkgPT4gY29sKTtcclxuICAgIGNvbHVtbnMuc29ydCgpO1xyXG4gICAgY29uc3QgcmlnaHRtb3N0X2NvbHVtbiA9IGNvbHVtbnNbMF07XHJcbiAgICByZXR1cm4gY29vcmRzLmZpbHRlcigoW2NvbCwgX3Jvd10pID0+IGNvbCA9PT0gcmlnaHRtb3N0X2NvbHVtbik7XHJcbn1cclxuZXhwb3J0cy5SaWdodG1vc3RXaGVuU2VlbkZyb21CbGFjayA9IFJpZ2h0bW9zdFdoZW5TZWVuRnJvbUJsYWNrO1xyXG5mdW5jdGlvbiBMZWZ0bW9zdFdoZW5TZWVuRnJvbUJsYWNrKGNvb3Jkcykge1xyXG4gICAgaWYgKGNvb3Jkcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cmllZCB0byB0YWtlIHRoZSBtYXhpbXVtIG9mIGFuIGVtcHR5IGFycmF5XCIpO1xyXG4gICAgfVxyXG4gICAgLy8gU2luY2UgXCLvvJFcIiB0byBcIu+8mVwiIGFyZSBjb25zZWN1dGl2ZSBpbiBVbmljb2RlLCB3ZSBjYW4ganVzdCBzb3J0IGl0IGFzIFVURi0xNiBzdHJpbmdcclxuICAgIGNvbnN0IGNvbHVtbnMgPSBjb29yZHMubWFwKChbY29sLCBfcm93XSkgPT4gY29sKTtcclxuICAgIGNvbHVtbnMuc29ydCgpO1xyXG4gICAgY29uc3QgbGVmdG1vc3RfY29sdW1uID0gY29sdW1uc1tjb2x1bW5zLmxlbmd0aCAtIDFdO1xyXG4gICAgcmV0dXJuIGNvb3Jkcy5maWx0ZXIoKFtjb2wsIF9yb3ddKSA9PiBjb2wgPT09IGxlZnRtb3N0X2NvbHVtbik7XHJcbn1cclxuZXhwb3J0cy5MZWZ0bW9zdFdoZW5TZWVuRnJvbUJsYWNrID0gTGVmdG1vc3RXaGVuU2VlbkZyb21CbGFjaztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XHJcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xyXG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcclxufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBvW2syXSA9IG1ba107XHJcbn0pKTtcclxudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5mcm9tX2N1c3RvbV9zdGF0ZSA9IGV4cG9ydHMubWFpbiA9IGV4cG9ydHMuY2FuX3BsYWNlX3N0b25lID0gZXhwb3J0cy5nZXRfaW5pdGlhbF9zdGF0ZSA9IGV4cG9ydHMuY29vcmRFcSA9IGV4cG9ydHMuZGlzcGxheUNvb3JkID0gZXhwb3J0cy5lbnRyeV9pc19mb3JiaWRkZW4gPSBleHBvcnRzLnRocm93c19pZl91bmt1bWFsYWJsZSA9IGV4cG9ydHMudGhyb3dzX2lmX3VuY2FzdGxhYmxlID0gZXhwb3J0cy5jYW5fbW92ZSA9IGV4cG9ydHMuY2FuX3NlZSA9IGV4cG9ydHMub3Bwb25lbnRPZiA9IHZvaWQgMDtcclxuY29uc3QgYm9hcmRfMSA9IHJlcXVpcmUoXCIuL2JvYXJkXCIpO1xyXG5jb25zdCBwaWVjZV9waGFzZV8xID0gcmVxdWlyZShcIi4vcGllY2VfcGhhc2VcIik7XHJcbmNvbnN0IGNvb3JkaW5hdGVfMSA9IHJlcXVpcmUoXCIuL2Nvb3JkaW5hdGVcIik7XHJcbmNvbnN0IGFmdGVyX3N0b25lX3BoYXNlXzEgPSByZXF1aXJlKFwiLi9hZnRlcl9zdG9uZV9waGFzZVwiKTtcclxuY29uc3Qgc2lkZV8xID0gcmVxdWlyZShcIi4vc2lkZVwiKTtcclxuY29uc3Qgc3Vycm91bmRfMSA9IHJlcXVpcmUoXCIuL3N1cnJvdW5kXCIpO1xyXG52YXIgc2lkZV8yID0gcmVxdWlyZShcIi4vc2lkZVwiKTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwib3Bwb25lbnRPZlwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc2lkZV8yLm9wcG9uZW50T2Y7IH0gfSk7XHJcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi90eXBlXCIpLCBleHBvcnRzKTtcclxudmFyIGNhbl9zZWVfMSA9IHJlcXVpcmUoXCIuL2Nhbl9zZWVcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImNhbl9zZWVcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNhbl9zZWVfMS5jYW5fc2VlOyB9IH0pO1xyXG52YXIgcGllY2VfcGhhc2VfMiA9IHJlcXVpcmUoXCIuL3BpZWNlX3BoYXNlXCIpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJjYW5fbW92ZVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcGllY2VfcGhhc2VfMi5jYW5fbW92ZTsgfSB9KTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwidGhyb3dzX2lmX3VuY2FzdGxhYmxlXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwaWVjZV9waGFzZV8yLnRocm93c19pZl91bmNhc3RsYWJsZTsgfSB9KTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwidGhyb3dzX2lmX3Vua3VtYWxhYmxlXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwaWVjZV9waGFzZV8yLnRocm93c19pZl91bmt1bWFsYWJsZTsgfSB9KTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZW50cnlfaXNfZm9yYmlkZGVuXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwaWVjZV9waGFzZV8yLmVudHJ5X2lzX2ZvcmJpZGRlbjsgfSB9KTtcclxudmFyIGNvb3JkaW5hdGVfMiA9IHJlcXVpcmUoXCIuL2Nvb3JkaW5hdGVcIik7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImRpc3BsYXlDb29yZFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gY29vcmRpbmF0ZV8yLmRpc3BsYXlDb29yZDsgfSB9KTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiY29vcmRFcVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gY29vcmRpbmF0ZV8yLmNvb3JkRXE7IH0gfSk7XHJcbmNvbnN0IGdldF9pbml0aWFsX3N0YXRlID0gKHdob19nb2VzX2ZpcnN0KSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBoYXNlOiBcInJlc29sdmVkXCIsXHJcbiAgICAgICAgaGFuZF9vZl9ibGFjazogW10sXHJcbiAgICAgICAgaGFuZF9vZl93aGl0ZTogW10sXHJcbiAgICAgICAgd2hvX2dvZXNfbmV4dDogd2hvX2dvZXNfZmlyc3QsXHJcbiAgICAgICAgYm9hcmQ6IFtcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIummmVwiLCBjYW5fa3VtYWw6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLmoYJcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIumKgFwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi6YeRXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLnjotcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjgq1cIiwgbmV2ZXJfbW92ZWQ6IHRydWUsIGhhc19tb3ZlZF9vbmx5X29uY2U6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi6YeRXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLpioBcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuahglwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi6aaZXCIsIGNhbl9rdW1hbDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OrXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OKXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi55m9XCIsIHByb2Y6IFwi44OTXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuOCr1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgbnVsbCxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg5NcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg4pcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLnmb1cIiwgcHJvZjogXCLjg6tcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIueZvVwiLCBwcm9mOiBcIuODnVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCxdLFxyXG4gICAgICAgICAgICBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCxdLFxyXG4gICAgICAgICAgICBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgbnVsbCxdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44OdXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg6tcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg4pcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgrlcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLjg5NcIiwgbmV2ZXJfbW92ZWQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgIG51bGwsXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44K5XCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi44KvXCIsIG5ldmVyX21vdmVkOiB0cnVlIH0sXHJcbiAgICAgICAgICAgICAgICBudWxsLFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODk1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODilwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOCuVwiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuODq1wiLCBuZXZlcl9tb3ZlZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi6aaZXCIsIGNhbl9rdW1hbDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuahglwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi6YqAXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLph5FcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIueOi1wiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIuOCrVwiLCBuZXZlcl9tb3ZlZDogdHJ1ZSwgaGFzX21vdmVkX29ubHlfb25jZTogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLph5FcIiwgY2FuX2t1bWFsOiBmYWxzZSB9LFxyXG4gICAgICAgICAgICAgICAgeyB0eXBlOiBcIuOBl+OCh1wiLCBzaWRlOiBcIum7klwiLCBwcm9mOiBcIumKgFwiLCBjYW5fa3VtYWw6IGZhbHNlIH0sXHJcbiAgICAgICAgICAgICAgICB7IHR5cGU6IFwi44GX44KHXCIsIHNpZGU6IFwi6buSXCIsIHByb2Y6IFwi5qGCXCIsIGNhbl9rdW1hbDogZmFsc2UgfSxcclxuICAgICAgICAgICAgICAgIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogXCLpu5JcIiwgcHJvZjogXCLppplcIiwgY2FuX2t1bWFsOiB0cnVlIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgXVxyXG4gICAgfTtcclxufTtcclxuZXhwb3J0cy5nZXRfaW5pdGlhbF9zdGF0ZSA9IGdldF9pbml0aWFsX3N0YXRlO1xyXG4vKiog56KB55+z44KS572u44GP44CC6Ieq5q665omL44Gr44Gq44KL44KI44GG44Gq56KB55+z44Gu572u44GN5pa544Gv44Gn44GN44Gq44GE77yI5YWs5byP44Or44O844Or44CM5omT44Gj44Gf556s6ZaT44Gr5Y+W44KJ44KM44Gm44GX44G+44GG44Oe44K544Gr44Gv55+z44Gv5omT44Gm44Gq44GE44CN77yJXHJcbiAqXHJcbiAqIEBwYXJhbSBvbGRcclxuICogQHBhcmFtIHNpZGVcclxuICogQHBhcmFtIHN0b25lX3RvXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5mdW5jdGlvbiBwbGFjZV9zdG9uZShvbGQsIHNpZGUsIHN0b25lX3RvKSB7XHJcbiAgICBpZiAoKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShvbGQuYm9hcmQsIHN0b25lX3RvKSkgeyAvLyBpZiB0aGUgc3F1YXJlIGlzIGFscmVhZHkgb2NjdXBpZWRcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7c2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShzdG9uZV90byl944Gr56KB55+z44KS572u44GT44GG44Go44GX44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoc3RvbmVfdG8pfeOBruODnuOCueOBr+aXouOBq+Wfi+OBvuOBo+OBpuOBhOOBvuOBmWApO1xyXG4gICAgfVxyXG4gICAgLy8g44G+44Ga572u44GPXHJcbiAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBzdG9uZV90bywgeyB0eXBlOiBcIueigVwiLCBzaWRlIH0pO1xyXG4gICAgLy8g572u44GE44Gf5b6M44Gn44CB552A5omL56aB5q2i44GL44Gp44GG44GL44KS5Yik5pat44GZ44KL44Gf44KB44Gr44CBXHJcbiAgICAvL+OAjuWbsuOBvuOCjOOBpuOBhOOCi+ebuOaJi+OBrumnki/nn7PjgpLlj5bjgovjgI/ihpLjgI7lm7Ljgb7jgozjgabjgYTjgovoh6rliIbjga7pp5Iv55+z44KS5Y+W44KL44CP44KS44K344Of44Ol44Os44O844K344On44Oz44GX44Gm44CB572u44GE44Gf5L2N572u44Gu55+z44GM5q2744KT44Gn44GE44Gf44KJXHJcbiAgICBjb25zdCBibGFja19hbmRfd2hpdGUgPSBvbGQuYm9hcmQubWFwKHJvdyA9PiByb3cubWFwKHNxID0+IHNxID09PSBudWxsID8gbnVsbCA6IHNxLnNpZGUpKTtcclxuICAgIGNvbnN0IG9wcG9uZW50X3JlbW92ZWQgPSAoMCwgc3Vycm91bmRfMS5yZW1vdmVfc3Vycm91bmRlZCkoKDAsIHNpZGVfMS5vcHBvbmVudE9mKShzaWRlKSwgYmxhY2tfYW5kX3doaXRlKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9ICgwLCBzdXJyb3VuZF8xLnJlbW92ZV9zdXJyb3VuZGVkKShzaWRlLCBvcHBvbmVudF9yZW1vdmVkKTtcclxuICAgIGlmICgoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKHJlc3VsdCwgc3RvbmVfdG8pKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcGhhc2U6IFwic3RvbmVfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgICAgIGhhbmRfb2ZfYmxhY2s6IG9sZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgICAgICBoYW5kX29mX3doaXRlOiBvbGQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICAgICAgYnlfd2hvbTogb2xkLmJ5X3dob20sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtzaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKHN0b25lX3RvKX3jgavnooHnn7PjgpLnva7jgZPjgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIHmiZPjgaPjgZ/nnqzplpPjgavlj5bjgonjgozjgabjgZfjgb7jgYbjga7jgafjgZPjgZPjga/nnYDmiYvnpoHmraLngrnjgafjgZlgKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBjYW5fcGxhY2Vfc3RvbmUoYm9hcmQsIHNpZGUsIHN0b25lX3RvKSB7XHJcbiAgICBpZiAoKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgc3RvbmVfdG8pKSB7IC8vIGlmIHRoZSBzcXVhcmUgaXMgYWxyZWFkeSBvY2N1cGllZFxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGNvbnN0IG5ld19ib2FyZCA9ICgwLCBib2FyZF8xLmNsb25lX2JvYXJkKShib2FyZCk7XHJcbiAgICAvLyDjgb7jgZrnva7jgY9cclxuICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShuZXdfYm9hcmQsIHN0b25lX3RvLCB7IHR5cGU6IFwi56KBXCIsIHNpZGUgfSk7XHJcbiAgICAvLyDnva7jgYTjgZ/lvozjgafjgIHnnYDmiYvnpoHmraLjgYvjganjgYbjgYvjgpLliKTmlq3jgZnjgovjgZ/jgoHjgavjgIFcclxuICAgIC8v44CO5Zuy44G+44KM44Gm44GE44KL55u45omL44Gu6aeSL+efs+OCkuWPluOCi+OAj+KGkuOAjuWbsuOBvuOCjOOBpuOBhOOCi+iHquWIhuOBrumnki/nn7PjgpLlj5bjgovjgI/jgpLjgrfjg5/jg6Xjg6zjg7zjgrfjg6fjg7PjgZfjgabjgIHnva7jgYTjgZ/kvY3nva7jga7nn7PjgYzmrbvjgpPjgafjgYTjgZ/jgolcclxuICAgIGNvbnN0IGJsYWNrX2FuZF93aGl0ZSA9IG5ld19ib2FyZC5tYXAocm93ID0+IHJvdy5tYXAoc3EgPT4gc3EgPT09IG51bGwgPyBudWxsIDogc3Euc2lkZSkpO1xyXG4gICAgY29uc3Qgb3Bwb25lbnRfcmVtb3ZlZCA9ICgwLCBzdXJyb3VuZF8xLnJlbW92ZV9zdXJyb3VuZGVkKSgoMCwgc2lkZV8xLm9wcG9uZW50T2YpKHNpZGUpLCBibGFja19hbmRfd2hpdGUpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gKDAsIHN1cnJvdW5kXzEucmVtb3ZlX3N1cnJvdW5kZWQpKHNpZGUsIG9wcG9uZW50X3JlbW92ZWQpO1xyXG4gICAgaWYgKCgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkocmVzdWx0LCBzdG9uZV90bykpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmNhbl9wbGFjZV9zdG9uZSA9IGNhbl9wbGFjZV9zdG9uZTtcclxuZnVuY3Rpb24gb25lX3R1cm4ob2xkLCBtb3ZlKSB7XHJcbiAgICBjb25zdCBhZnRlcl9waWVjZV9waGFzZSA9ICgwLCBwaWVjZV9waGFzZV8xLnBsYXlfcGllY2VfcGhhc2UpKG9sZCwgbW92ZS5waWVjZV9waGFzZSk7XHJcbiAgICBjb25zdCBhZnRlcl9zdG9uZV9waGFzZSA9IG1vdmUuc3RvbmVfdG8gPyBwbGFjZV9zdG9uZShhZnRlcl9waWVjZV9waGFzZSwgbW92ZS5waWVjZV9waGFzZS5zaWRlLCBtb3ZlLnN0b25lX3RvKSA6IHtcclxuICAgICAgICBwaGFzZTogXCJzdG9uZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICBib2FyZDogYWZ0ZXJfcGllY2VfcGhhc2UuYm9hcmQsXHJcbiAgICAgICAgaGFuZF9vZl9ibGFjazogYWZ0ZXJfcGllY2VfcGhhc2UuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICBoYW5kX29mX3doaXRlOiBhZnRlcl9waWVjZV9waGFzZS5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgIGJ5X3dob206IGFmdGVyX3BpZWNlX3BoYXNlLmJ5X3dob20sXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuICgwLCBhZnRlcl9zdG9uZV9waGFzZV8xLnJlc29sdmVfYWZ0ZXJfc3RvbmVfcGhhc2UpKGFmdGVyX3N0b25lX3BoYXNlKTtcclxufVxyXG5mdW5jdGlvbiBtYWluKG1vdmVzKSB7XHJcbiAgICBpZiAobW92ZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi5qOL6K2c44GM56m644Gn44GZXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZyb21fY3VzdG9tX3N0YXRlKG1vdmVzLCAoMCwgZXhwb3J0cy5nZXRfaW5pdGlhbF9zdGF0ZSkobW92ZXNbMF0ucGllY2VfcGhhc2Uuc2lkZSkpO1xyXG59XHJcbmV4cG9ydHMubWFpbiA9IG1haW47XHJcbmZ1bmN0aW9uIGZyb21fY3VzdG9tX3N0YXRlKG1vdmVzLCBpbml0aWFsX3N0YXRlKSB7XHJcbiAgICBsZXQgc3RhdGUgPSBpbml0aWFsX3N0YXRlO1xyXG4gICAgZm9yIChjb25zdCBtb3ZlIG9mIG1vdmVzKSB7XHJcbiAgICAgICAgY29uc3QgbmV4dCA9IG9uZV90dXJuKHN0YXRlLCBtb3ZlKTtcclxuICAgICAgICBpZiAobmV4dC5waGFzZSA9PT0gXCJnYW1lX2VuZFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdGF0ZSA9IG5leHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RhdGU7XHJcbn1cclxuZXhwb3J0cy5mcm9tX2N1c3RvbV9zdGF0ZSA9IGZyb21fY3VzdG9tX3N0YXRlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnRocm93c19pZl91bmNhc3RsYWJsZSA9IGV4cG9ydHMuY2FuX21vdmUgPSBleHBvcnRzLnBsYXlfcGllY2VfcGhhc2UgPSBleHBvcnRzLnRocm93c19pZl91bmt1bWFsYWJsZSA9IGV4cG9ydHMuZW50cnlfaXNfZm9yYmlkZGVuID0gdm9pZCAwO1xyXG5jb25zdCBib2FyZF8xID0gcmVxdWlyZShcIi4vYm9hcmRcIik7XHJcbmNvbnN0IHR5cGVfMSA9IHJlcXVpcmUoXCIuL3R5cGVcIik7XHJcbmNvbnN0IGNvb3JkaW5hdGVfMSA9IHJlcXVpcmUoXCIuL2Nvb3JkaW5hdGVcIik7XHJcbmNvbnN0IHNpZGVfMSA9IHJlcXVpcmUoXCIuL3NpZGVcIik7XHJcbmNvbnN0IGNhbl9zZWVfMSA9IHJlcXVpcmUoXCIuL2Nhbl9zZWVcIik7XHJcbmZ1bmN0aW9uIGVudHJ5X2lzX2ZvcmJpZGRlbihwcm9mLCBzaWRlLCB0bykge1xyXG4gICAgaWYgKHByb2YgPT09IFwi5qGCXCIpIHtcclxuICAgICAgICByZXR1cm4gKDAsIHNpZGVfMS5pc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3MpKDIsIHNpZGUsIHRvKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHByb2YgPT09IFwi6aaZXCIgfHwgcHJvZiA9PT0gXCLjg51cIikge1xyXG4gICAgICAgIHJldHVybiAoMCwgc2lkZV8xLmlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cykoMSwgc2lkZSwgdG8pO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZW50cnlfaXNfZm9yYmlkZGVuID0gZW50cnlfaXNfZm9yYmlkZGVuO1xyXG4vKiog6aeS44KS5omT44Gk44CC5omL6aeS44GL44KJ5bCG5qOL6aeS44KS55uk5LiK44Gr56e75YuV44GV44Gb44KL44CC6KGM44GN44Gp44GT44KN44Gu54Sh44GE5L2N572u44Gr5qGC6aas44Go6aaZ6LuK44KS5omT44Gj44Gf44KJ44Ko44Op44O844CCXHJcbiAqXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJhY2h1dGUob2xkLCBvKSB7XHJcbiAgICBpZiAoKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShvbGQuYm9hcmQsIG8udG8pKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3miZPjgajjga7jgZPjgajjgafjgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jg57jgrnjga/ml6Ljgavln4vjgb7jgaPjgabjgYTjgb7jgZlgKTtcclxuICAgIH1cclxuICAgIGlmIChlbnRyeV9pc19mb3JiaWRkZW4oby5wcm9mLCBvLnNpZGUsIG8udG8pKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3miZPjgajjga7jgZPjgajjgafjgZnjgYzjgIHooYzjgY3jganjgZPjgo3jga7jgarjgYQkeygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBr+aJk+OBpuOBvuOBm+OCk2ApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaGFuZCA9IG9sZFtvLnNpZGUgPT09IFwi55m9XCIgPyBcImhhbmRfb2Zfd2hpdGVcIiA6IFwiaGFuZF9vZl9ibGFja1wiXTtcclxuICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8udG8sIHsgdHlwZTogXCLjgZfjgodcIiwgc2lkZTogby5zaWRlLCBwcm9mOiBvLnByb2YsIGNhbl9rdW1hbDogZmFsc2UgfSk7XHJcbiAgICBjb25zdCBpbmRleCA9IGhhbmQuZmluZEluZGV4KHByb2YgPT4gcHJvZiA9PT0gby5wcm9mKTtcclxuICAgIGhhbmQuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcGhhc2U6IFwicGllY2VfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgaGFuZF9vZl9ibGFjazogb2xkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgaGFuZF9vZl93aGl0ZTogb2xkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgYnlfd2hvbTogb2xkLndob19nb2VzX25leHQsXHJcbiAgICAgICAgYm9hcmQ6IG9sZC5ib2FyZFxyXG4gICAgfTtcclxufVxyXG5mdW5jdGlvbiB0aHJvd3NfaWZfdW5rdW1hbGFibGUoYm9hcmQsIG8pIHtcclxuICAgIGNvbnN0IGtpbmcgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBvLmZyb20pO1xyXG4gICAgaWYgKGtpbmc/LnR5cGUgPT09IFwi546LXCIpIHtcclxuICAgICAgICBpZiAoa2luZy5uZXZlcl9tb3ZlZCkge1xyXG4gICAgICAgICAgICBjb25zdCBsYW5jZSA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIG8udG8pO1xyXG4gICAgICAgICAgICBpZiAoIWxhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOOCreODs+OCsOeOi+OBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G45YuV44GP44GP44G+44KK44KT44GQ44KSJHtraW5nLnNpZGV944GM6Kmm44G/44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944Gr44Gv6aeS44GM44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobGFuY2UudHlwZSA9PT0gXCLnooFcIikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDjgq3jg7PjgrDnjovjgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOWLleOBj+OBj+OBvuOCiuOCk+OBkOOCkiR7a2luZy5zaWRlfeOBjOippuOBv+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBq+OBguOCi+OBruOBr+mmmei7iuOBp+OBr+OBquOBj+eigeefs+OBp+OBmWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGxhbmNlLnR5cGUgIT09IFwi44GX44KHXCIgfHwgbGFuY2UucHJvZiAhPT0gXCLppplcIikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDjgq3jg7PjgrDnjovjgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOWLleOBj+OBj+OBvuOCiuOCk+OBkOOCkiR7a2luZy5zaWRlfeOBjOippuOBv+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944Gr44Gv6aaZ6LuK44Gn44Gv44Gq44GE6aeS44GM44GC44KK44G+44GZYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFsYW5jZS5jYW5fa3VtYWwpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg44Kt44Oz44Kw546L44GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjli5XjgY/jgY/jgb7jgorjgpPjgZDjgpIke2tpbmcuc2lkZX3jgYzoqabjgb/jgabjgYTjgb7jgZnjgYzjgIHjgZPjga7pppnou4rjga/miZPjgZ/jgozjgZ/pppnou4rjgarjga7jgafjgY/jgb7jgorjgpPjgZDjga7lr77osaHlpJbjgafjgZlgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChsYW5jZS5zaWRlICE9PSBraW5nLnNpZGUpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihg44Kt44Oz44Kw546L44GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjli5XjgY/jgY/jgb7jgorjgpPjgZDjgpIke2tpbmcuc2lkZX3jgYzoqabjgb/jgabjgYTjgb7jgZnjgYzjgIHjgZPjga7pppnou4rjga/nm7jmiYvjga7pppnou4rjgarjga7jgafjgY/jgb7jgorjgpPjgZDjga7lr77osaHlpJbjgafjgZlgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4geyBraW5nLCBsYW5jZSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHRocm93IG5ldyBFcnJvcihcIuOBj+OBvuOCiuOCk+OBkOOBp+OBr+OBguOCiuOBvuOBm+OCk1wiKTtcclxufVxyXG5leHBvcnRzLnRocm93c19pZl91bmt1bWFsYWJsZSA9IHRocm93c19pZl91bmt1bWFsYWJsZTtcclxuZnVuY3Rpb24ga3VtYWxpbmdfb3JfY2FzdGxpbmcob2xkLCBmcm9tLCB0bykge1xyXG4gICAgY29uc3Qga2luZyA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkob2xkLmJvYXJkLCBmcm9tKTtcclxuICAgIGlmIChraW5nPy50eXBlID09PSBcIueOi1wiKSB7XHJcbiAgICAgICAgaWYgKGtpbmcubmV2ZXJfbW92ZWQpIHtcclxuICAgICAgICAgICAgY29uc3QgeyBsYW5jZSB9ID0gdGhyb3dzX2lmX3Vua3VtYWxhYmxlKG9sZC5ib2FyZCwgeyBmcm9tLCB0byB9KTtcclxuICAgICAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgdG8sIGtpbmcpO1xyXG4gICAgICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBmcm9tLCBsYW5jZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwaGFzZTogXCJwaWVjZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICAgICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgICAgICAgICBoYW5kX29mX2JsYWNrOiBvbGQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICAgICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgICAgICAgICAgYnlfd2hvbTogb2xkLndob19nb2VzX25leHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoa2luZy5oYXNfbW92ZWRfb25seV9vbmNlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpZmYgPSAoMCwgc2lkZV8xLmNvb3JkRGlmZlNlZW5Gcm9tKShraW5nLnNpZGUsIHsgdG86IHRvLCBmcm9tIH0pO1xyXG4gICAgICAgICAgICBpZiAoZGlmZi52ID09PSAwICYmIChkaWZmLmggPT09IDIgfHwgZGlmZi5oID09PSAtMikgJiZcclxuICAgICAgICAgICAgICAgICgoa2luZy5zaWRlID09PSBcIum7klwiICYmIGZyb21bMV0gPT09IFwi5YWrXCIpIHx8IChraW5nLnNpZGUgPT09IFwi55m9XCIgJiYgZnJvbVsxXSA9PT0gXCLkuoxcIikpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FzdGxpbmcob2xkLCB7IGZyb20sIHRvOiB0bywgc2lkZToga2luZy5zaWRlIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2tpbmcuc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKSh0byl944Kt44Go44Gu44GT44Go44Gn44GZ44GM44CB44Gd44Gu44KI44GG44Gq56e75YuV44GM44Gn44GN44KLJHtraW5nLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoXCLjgq1cIil944Gv55uk5LiK44Gr44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtraW5nLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkodG8pfeOCreOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7a2luZy5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKFwi44KtXCIpfeOBr+ebpOS4iuOBq+OBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgZnVuY3Rpb24gXFxga3VtYWxpbmcyKClcXGAgY2FsbGVkIG9uIGEgbm9uLWtpbmcgcGllY2VgKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogUmVzb2x2ZWQg44Gq54q25oWL44Gr6aeS44OV44Kn44Kk44K644KS6YGp55So44CC55yB55Wl44GV44KM44Gf5oOF5aCx44KS5b6p5YWD44GX44Gq44GM44KJ6YGp55So44GX44Gq44GN44KD44GE44GR44Gq44GE44Gu44Gn44CB44GL44Gq44KK44GX44KT44Gp44GE44CCXHJcbiAqIEBwYXJhbSBvbGQg5ZG844Gz5Ye644GX5b6M44Gr56C05aOK44GV44KM44Gm44GE44KL5Y+v6IO95oCn44GM44GC44KL44Gu44Gn44CB5b6M44Gn5L2/44GE44Gf44GE44Gq44KJ44OH44Kj44O844OX44Kz44OU44O844GX44Gm44GK44GP44GT44Go44CCXHJcbiAqIEBwYXJhbSBvXHJcbiAqL1xyXG5mdW5jdGlvbiBwbGF5X3BpZWNlX3BoYXNlKG9sZCwgbykge1xyXG4gICAgLy8gVGhlIHRoaW5nIGlzIHRoYXQgd2UgaGF2ZSB0byBpbmZlciB3aGljaCBwaWVjZSBoYXMgbW92ZWQsIHNpbmNlIHRoZSB1c3VhbCBub3RhdGlvbiBkb2VzIG5vdCBzaWduaWZ5XHJcbiAgICAvLyB3aGVyZSB0aGUgcGllY2UgY29tZXMgZnJvbS5cclxuICAgIC8vIOmdouWAkuOBquOBruOBr+OAgeWFt+S9k+eahOOBq+OBqeOBrumnkuOBjOWLleOBhOOBn+OBruOBi+OCkuOAgeaji+itnOOBruaDheWgseOBi+OCieW+qeWFg+OBl+OBpuOChOOCieOBquOBhOOBqOOBhOOBkeOBquOBhOOBqOOBhOOBhueCueOBp+OBguOCi++8iOaZrumAmuWni+eCueOBr+abuOOBi+OBquOBhOOBruOBp++8ieOAglxyXG4gICAgLy8gZmlyc3QsIHVzZSB0aGUgYHNpZGVgIGZpZWxkIGFuZCB0aGUgYHByb2ZgIGZpZWxkIHRvIGxpc3QgdXAgdGhlIHBvc3NpYmxlIHBvaW50cyBvZiBvcmlnaW4gXHJcbiAgICAvLyAobm90ZSB0aGF0IFwiaW4gaGFuZFwiIGlzIGEgcG9zc2liaWxpdHkpLlxyXG4gICAgY29uc3QgcG9zc2libGVfcG9pbnRzX29mX29yaWdpbiA9ICgwLCBib2FyZF8xLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mKShvbGQuYm9hcmQsIG8uc2lkZSwgby5wcm9mKTtcclxuICAgIGNvbnN0IGhhbmQgPSBvbGRbby5zaWRlID09PSBcIueZvVwiID8gXCJoYW5kX29mX3doaXRlXCIgOiBcImhhbmRfb2ZfYmxhY2tcIl07XHJcbiAgICBjb25zdCBleGlzdHNfaW5faGFuZCA9IGhhbmQuc29tZShwcm9mID0+IHByb2YgPT09IG8ucHJvZik7XHJcbiAgICBpZiAodHlwZW9mIG8uZnJvbSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgIGlmIChvLmZyb20gPT09IFwi5omTXCIpIHtcclxuICAgICAgICAgICAgaWYgKGV4aXN0c19pbl9oYW5kKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKDAsIHR5cGVfMS5pc1VucHJvbW90ZWRTaG9naVByb2Zlc3Npb24pKG8ucHJvZikpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyYWNodXRlKG9sZCwgeyBzaWRlOiBvLnNpZGUsIHByb2Y6IG8ucHJvZiwgdG86IG8udG8gfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uIOS7peWkluOBr+aJi+mnkuOBq+WFpeOBo+OBpuOBhOOCi+OBr+OBmuOBjOOBquOBhOOBruOBp+OAgVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGV4aXN0c19pbl9oYW5kIOOBjOa6gOOBn+OBleOCjOOBpuOBhOOCi+aZgueCueOBpyBVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uIOOBp+OBguOCi+OBk+OBqOOBr+aXouOBq+eiuuWumuOBl+OBpuOBhOOCi1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInNob3VsZCBub3QgcmVhY2ggaGVyZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z95omT44Go44Gu44GT44Go44Gn44GZ44GM44CBJHtvLnNpZGV944Gu5omL6aeS44GrJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jga/jgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChvLmZyb20gPT09IFwi5Y+zXCIpIHtcclxuICAgICAgICAgICAgY29uc3QgcHJ1bmVkID0gcG9zc2libGVfcG9pbnRzX29mX29yaWdpbi5maWx0ZXIoZnJvbSA9PiBjYW5fbW92ZShvbGQuYm9hcmQsIHsgZnJvbSwgdG86IG8udG8gfSkpO1xyXG4gICAgICAgICAgICBpZiAocHJ1bmVkLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3lj7Pjgajjga7jgZPjgajjgafjgZnjgYzjgIHjgZ3jga7jgojjgYbjgarnp7vli5XjgYzjgafjgY3jgoske28uc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBr+ebpOS4iuOBq+OBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0bW9zdCA9ICgwLCBzaWRlXzEuUmlnaHRtb3N0V2hlblNlZW5Gcm9tKShvLnNpZGUsIHBydW5lZCk7XHJcbiAgICAgICAgICAgIGlmIChyaWdodG1vc3QubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbW92ZV9waWVjZShvbGQsIHsgZnJvbTogcmlnaHRtb3N0WzBdLCB0bzogby50bywgc2lkZTogby5zaWRlLCBwcm9tb3RlOiBvLnByb21vdGVzID8/IG51bGwgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7by5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944GM55uk5LiK44Gr6KSH5pWw44GC44KK44G+44GZYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoby5mcm9tID09PSBcIuW3plwiKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBydW5lZCA9IHBvc3NpYmxlX3BvaW50c19vZl9vcmlnaW4uZmlsdGVyKGZyb20gPT4gY2FuX21vdmUob2xkLmJvYXJkLCB7IGZyb20sIHRvOiBvLnRvIH0pKTtcclxuICAgICAgICAgICAgaWYgKHBydW5lZC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z95bem44Go44Gu44GT44Go44Gn44GZ44GM44CB44Gd44Gu44KI44GG44Gq56e75YuV44GM44Gn44GN44KLJHtvLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jga/nm6TkuIrjgavjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBsZWZ0bW9zdCA9ICgwLCBzaWRlXzEuTGVmdG1vc3RXaGVuU2VlbkZyb20pKG8uc2lkZSwgcHJ1bmVkKTtcclxuICAgICAgICAgICAgaWYgKGxlZnRtb3N0Lmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1vdmVfcGllY2Uob2xkLCB7IGZyb206IGxlZnRtb3N0WzBdLCB0bzogby50bywgc2lkZTogby5zaWRlLCBwcm9tb3RlOiBvLnByb21vdGVzID8/IG51bGwgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7by5wcm9mfeOBqOOBruOBk+OBqOOBp+OBmeOBjOOAgeOBneOBruOCiOOBhuOBquenu+WLleOBjOOBp+OBjeOCiyR7by5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944GM55uk5LiK44Gr6KSH5pWw44GC44KK44G+44GZYCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIuOAjOaJk+OAjeOAjOWPs+OAjeOAjOW3puOAjeOAjOaIkOOAjeOAjOS4jeaIkOOAjeS7peWkluOBruaOpeWwvui+nuOBr+acquWun+ijheOBp+OBmeOAgu+8l+WFremHke+8iO+8l+S6lO+8ieOBquOBqeOBqOabuOOBhOOBpuS4i+OBleOBhOOAglwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlb2Ygby5mcm9tID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgLy8g6aeS44GM44Gp44GT44GL44KJ5p2l44Gf44GL44GM5YiG44GL44KJ44Gq44GE44CCXHJcbiAgICAgICAgLy8g44GT44Gu44KI44GG44Gq44Go44GN44Gr44Gv44CBXHJcbiAgICAgICAgLy8g44O75omT44Gk44GX44GL44Gq44GE44Gq44KJ5omT44GkXHJcbiAgICAgICAgLy8g44O744Gd44GG44Gn44Gq44GP44Gm44CB55uu55qE5Zyw44Gr6KGM44GR44KL6aeS44GM55uk5LiK44GrIDEg56iu6aGe44GX44GL44Gq44GE44Gq44KJ44CB44Gd44KM44KS44GZ44KLXHJcbiAgICAgICAgLy8g44Go44GE44GG6Kej5rG644KS44GZ44KL44GT44Go44Gr44Gq44KL44CCXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyDjgZfjgYvjgZfjgIHjgZPjga7jgrLjg7zjg6DjgavjgYrjgYTjgabjgIHkuozjg53jga/jgIznnYDmiYvjgafjgY3jgarjgYTmiYvjgI3jgafjga/jgarjgY/jgabjgIHjgIznnYDmiYvjgZfjgZ/lvozjgavjgIHnn7Pjg5XjgqfjgqTjgrrop6PmtojlvozjgavjgoLjgZ3jgozjgYzmrovjgaPjgabjgZfjgb7jgaPjgabjgYTjgZ/jgonjgIHlj43liYfosqDjgZHjgI3jgajjgarjgovjgoLjga7jgafjgYLjgovjgIJcclxuICAgICAgICAvLyDjgZPjga7liY3mj5Djga7jgoLjgajjgafjgIHjg53jgYzmqKrkuKbjgbPjgZfjgabjgYTjgovjgajjgY3jgavjgIHniYfmlrnjga7jg53jga7liY3jgavjgYLjgovpp5LjgpLlj5bjgo3jgYbjgajjgZfjgabjgYTjgovnirbms4HjgpLogIPjgYjjgabjgbvjgZfjgYTjgIJcclxuICAgICAgICAvLyDjgZnjgovjgajjgIHluLjorZjnmoTjgavjga/jgZ3jgpPjgarjgYLjgYvjgonjgZXjgb7jgarkuozjg53jga/mjIfjgZXjgarjgYTjga7jgafjgIEx44Oe44K55YmN6YCy44GX44Gm5Y+W44KL44Gu44GM5b2T44Gf44KK5YmN44Gn44GC44KK44CBXHJcbiAgICAgICAgLy8g44Gd44KM44KS5qOL6K2c44Gr6LW344GT44GZ44Go44GN44Gr44KP44GW44KP44GW44CM55u044CN44KS5LuY44GR44KL44Gq44Gp44OQ44Kr44OQ44Kr44GX44GE44CCXHJcbiAgICAgICAgLy8g44KI44Gj44Gm44CB5Ye655m654K55o6o6KuW44Gr44GK44GE44Gm44Gv44CB5pyA5Yid44Gv5LqM44Od44Gv5o6S6Zmk44GX44Gm5o6o6KuW44GZ44KL44GT44Go44Go44GZ44KL44CCXHJcbiAgICAgICAgLy8gV2UgaGF2ZSBubyBpbmZvIG9uIHdoZXJlIHRoZSBwaWVjZSBjYW1lIGZyb20uXHJcbiAgICAgICAgLy8gSW4gc3VjaCBjYXNlcywgdGhlIHJhdGlvbmFsIHdheSBvZiBpbmZlcmVuY2UgaXNcclxuICAgICAgICAvLyAqIFBhcmFjaHV0ZSBhIHBpZWNlIGlmIHlvdSBoYXZlIHRvLlxyXG4gICAgICAgIC8vICogT3RoZXJ3aXNlLCBpZiB0aGVyZSBpcyBvbmx5IG9uZSBwaWVjZSBvbiBib2FyZCB0aGF0IGNhbiBnbyB0byB0aGUgc3BlY2lmaWVkIGRlc3RpbmF0aW9uLCB0YWtlIHRoYXQgbW92ZS5cclxuICAgICAgICAvLyBcclxuICAgICAgICAvLyBIb3dldmVyLCBpbiB0aGlzIGdhbWUsIGRvdWJsZWQgcGF3bnMgYXJlIG5vdCBhbiBpbXBvc3NpYmxlIG1vdmUsIGJ1dCByYXRoZXIgYSBtb3ZlIHRoYXQgY2F1c2UgeW91IHRvIGxvc2UgaWYgaXQgcmVtYWluZWQgZXZlbiBhZnRlciB0aGUgcmVtb3ZhbC1ieS1nby5cclxuICAgICAgICAvLyBVbmRlciBzdWNoIGFuIGFzc3VtcHRpb24sIGNvbnNpZGVyIHRoZSBzaXR1YXRpb24gd2hlcmUgdGhlcmUgYXJlIHR3byBwYXducyBuZXh0IHRvIGVhY2ggb3RoZXIgYW5kIHRoZXJlIGlzIGFuIGVuZW15IHBpZWNlIHJpZ2h0IGluIGZyb250IG9mIG9uZSBvZiBpdC5cclxuICAgICAgICAvLyBJbiBzdWNoIGEgY2FzZSwgaXQgaXMgdmVyeSBlYXN5IHRvIHNlZSB0aGF0IHRha2luZyB0aGUgcGllY2UgZGlhZ29uYWxseSByZXN1bHRzIGluIGRvdWJsZWQgcGF3bnMuXHJcbiAgICAgICAgLy8gSGVuY2UsIHdoZW4gd3JpdGluZyB0aGF0IG1vdmUgZG93biwgeW91IGRvbid0IHdhbnQgdG8gZXhwbGljaXRseSBhbm5vdGF0ZSBzdWNoIGEgY2FzZSB3aXRoIOebtC5cclxuICAgICAgICAvLyBUaGVyZWZvcmUsIHdoZW4gaW5mZXJyaW5nIHRoZSBwb2ludCBvZiBvcmlnaW4sIEkgZmlyc3QgaWdub3JlIHRoZSBkb3VibGVkIHBhd25zLlxyXG4gICAgICAgIGNvbnN0IHBydW5lZCA9IHBvc3NpYmxlX3BvaW50c19vZl9vcmlnaW4uZmlsdGVyKGZyb20gPT4gY2FuX21vdmVfYW5kX25vdF9jYXVzZV9kb3VibGVkX3Bhd25zKG9sZC5ib2FyZCwgeyBmcm9tLCB0bzogby50byB9KSk7XHJcbiAgICAgICAgaWYgKHBydW5lZC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgaWYgKG8ucHJvZiA9PT0gXCLjgq1cIikge1xyXG4gICAgICAgICAgICAgICAgLy8g44Kt44Oj44K544Oq44Oz44Kw44GK44KI44Gz44GP44G+44KK44KT44GQ44Gv44Kt44Oz44Kw546L44Gu5YuV44GN44Go44GX44Gm5pu444GP44CCXHJcbiAgICAgICAgICAgICAgICAvLyDluLjjgavjgq3jg7PjgrDjgYzpgJrluLjli5XjgZHjgarjgYTnr4Tlm7Ljgbjjga7np7vli5XjgajjgarjgovjgIJcclxuICAgICAgICAgICAgICAgIHJldHVybiBrdW1hbGluZ19vcl9jYXN0bGluZyhvbGQsIHBvc3NpYmxlX3BvaW50c19vZl9vcmlnaW5bMF0sIG8udG8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGV4aXN0c19pbl9oYW5kKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoKDAsIHR5cGVfMS5pc1VucHJvbW90ZWRTaG9naVByb2Zlc3Npb24pKG8ucHJvZikpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyYWNodXRlKG9sZCwgeyBzaWRlOiBvLnNpZGUsIHByb2Y6IG8ucHJvZiwgdG86IG8udG8gfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uIOS7peWkluOBr+aJi+mnkuOBq+WFpeOBo+OBpuOBhOOCi+OBr+OBmuOBjOOBquOBhOOBruOBp+OAgVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGV4aXN0c19pbl9oYW5kIOOBjOa6gOOBn+OBleOCjOOBpuOBhOOCi+aZgueCueOBpyBVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uIOOBp+OBguOCi+OBk+OBqOOBr+aXouOBq+eiuuWumuOBl+OBpuOBhOOCi1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInNob3VsZCBub3QgcmVhY2ggaGVyZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBydW5lZF9hbGxvd2luZ19kb3VibGVkX3Bhd25zID0gcG9zc2libGVfcG9pbnRzX29mX29yaWdpbi5maWx0ZXIoZnJvbSA9PiBjYW5fbW92ZShvbGQuYm9hcmQsIHsgZnJvbSwgdG86IG8udG8gfSkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBydW5lZF9hbGxvd2luZ19kb3VibGVkX3Bhd25zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z944Go44Gu44GT44Go44Gn44GZ44GM44CB44Gd44Gu44KI44GG44Gq56e75YuV44GM44Gn44GN44KLJHtvLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jga/nm6TkuIrjgavjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBydW5lZF9hbGxvd2luZ19kb3VibGVkX3Bhd25zLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyb20gPSBwcnVuZWRfYWxsb3dpbmdfZG91YmxlZF9wYXduc1swXTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW92ZV9waWVjZShvbGQsIHsgZnJvbSwgdG86IG8udG8sIHNpZGU6IG8uc2lkZSwgcHJvbW90ZTogby5wcm9tb3RlcyA/PyBudWxsIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke28ucHJvZn3jgajjga7jgZPjgajjgafjgZnjgYzjgIHjgZ3jga7jgojjgYbjgarnp7vli5XjgYzjgafjgY3jgoske28uc2lkZX3jga4keygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOBjOebpOS4iuOBq+ikh+aVsOOBguOCiuOAgeOBl+OBi+OCguOBqeOCjOOCkuaMh+OBl+OBpuOCguS6jOODneOBp+OBmWApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHBydW5lZC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgY29uc3QgZnJvbSA9IHBydW5lZFswXTtcclxuICAgICAgICAgICAgcmV0dXJuIG1vdmVfcGllY2Uob2xkLCB7IGZyb20sIHRvOiBvLnRvLCBzaWRlOiBvLnNpZGUsIHByb21vdGU6IG8ucHJvbW90ZXMgPz8gbnVsbCB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl9JHtvLnByb2Z944Go44Gu44GT44Go44Gn44GZ44GM44CB44Gd44Gu44KI44GG44Gq56e75YuV44GM44Gn44GN44KLJHtvLnNpZGV944GuJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jgYznm6TkuIrjgavopIfmlbDjgYLjgorjgIHjganjgozjgpLmjqHnlKjjgZnjgovjgbnjgY3jgYvliIbjgYvjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBmcm9tID0gby5mcm9tO1xyXG4gICAgICAgIGlmICghcG9zc2libGVfcG9pbnRzX29mX29yaWdpbi5zb21lKGMgPT4gKDAsIGNvb3JkaW5hdGVfMS5jb29yZEVxKShjLCBmcm9tKSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShmcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjgagkeygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShvLnByb2YpfeOCkuWLleOBi+OBneOBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGZyb20pfeOBq+OBryR7by5zaWRlfeOBriR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944Gv44GC44KK44G+44Gb44KTYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjYW5fbW92ZShvbGQuYm9hcmQsIHsgZnJvbSwgdG86IG8udG8gfSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1vdmVfcGllY2Uob2xkLCB7IGZyb20sIHRvOiBvLnRvLCBzaWRlOiBvLnNpZGUsIHByb21vdGU6IG8ucHJvbW90ZXMgPz8gbnVsbCB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoby5wcm9mID09PSBcIuOCrVwiKSB7XHJcbiAgICAgICAgICAgIC8vIOOCreODo+OCueODquODs+OCsOOBiuOCiOOBs+OBj+OBvuOCiuOCk+OBkOOBr+OCreODs+OCsOeOi+OBruWLleOBjeOBqOOBl+OBpuabuOOBj+OAglxyXG4gICAgICAgICAgICAvLyDluLjjgavjgq3jg7PjgrDjgYzpgJrluLjli5XjgZHjgarjgYTnr4Tlm7Ljgbjjga7np7vli5XjgajjgarjgovjgIJcclxuICAgICAgICAgICAgcmV0dXJuIGt1bWFsaW5nX29yX2Nhc3RsaW5nKG9sZCwgZnJvbSwgby50byk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKGZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBqCR7KDAsIHR5cGVfMS5wcm9mZXNzaW9uRnVsbE5hbWUpKG8ucHJvZil944KS5YuV44GL44Gd44GG44Go44GX44Gm44GE44G+44GZ44GM44CBJHsoMCwgdHlwZV8xLnByb2Zlc3Npb25GdWxsTmFtZSkoby5wcm9mKX3jga8keygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShmcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjli5XjgZHjgovpp5Ljgafjga/jgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5wbGF5X3BpZWNlX3BoYXNlID0gcGxheV9waWVjZV9waGFzZTtcclxuLyoqIGBvLnNpZGVgIOOBjOmnkuOCkiBgby5mcm9tYCDjgYvjgokgYG8udG9gIOOBq+WLleOBi+OBmeOAguOBneOBrumnkuOBjCBgby5mcm9tYCDjgYvjgokgYG8udG9gIOOBuOOBqCBjYW5fbW92ZSDjgafjgYLjgovjgZPjgajjgpLopoHmsYLjgZnjgovjgILjgq3jg6Pjgrnjg6rjg7PjgrDjg7vjgY/jgb7jgorjgpPjgZDjga/mibHjgo/jgarjgYTjgYzjgIHjgqLjg7Pjg5Hjg4PjgrXjg7Pjga/mibHjgYbjgIJcclxuICovXHJcbmZ1bmN0aW9uIG1vdmVfcGllY2Uob2xkLCBvKSB7XHJcbiAgICBjb25zdCBwaWVjZV90aGF0X21vdmVzID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShvbGQuYm9hcmQsIG8uZnJvbSk7XHJcbiAgICBpZiAoIXBpZWNlX3RoYXRfbW92ZXMpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Gu56e75YuV44KS6Kmm44G/44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgavjga/pp5LjgYzjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHBpZWNlX3RoYXRfbW92ZXMudHlwZSA9PT0gXCLnooFcIikge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjga7np7vli5XjgpLoqabjgb/jgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBq+OBguOCi+OBruOBr+eigeefs+OBp+OBguOCiuOAgemnkuOBp+OBr+OBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAocGllY2VfdGhhdF9tb3Zlcy5zaWRlICE9PSBvLnNpZGUpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Gu56e75YuV44KS6Kmm44G/44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgavjgYLjgovjga7jga8keygwLCBzaWRlXzEub3Bwb25lbnRPZikoby5zaWRlKX3jga7pp5LjgafjgZlgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHJlcyA9IGNhbl9tb3ZlKG9sZC5ib2FyZCwgeyBmcm9tOiBvLmZyb20sIHRvOiBvLnRvIH0pO1xyXG4gICAgaWYgKHJlcyA9PT0gXCJlbiBwYXNzYW50XCIpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiAgICAgICAgICBmcm9tWzBdIHRvWzBdXHJcbiAgICAgICAgICogICAgICAgICB8ICAuLiAgfCAgLi4gIHxcclxuICAgICAgICAgKiB0b1sxXSAgIHwgIC4uICB8ICB0byAgfFxyXG4gICAgICAgICAqIGZyb21bMV0gfCBmcm9tIHwgcGF3biB8XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3QgY29vcmRfaG9yaXpvbnRhbGx5X2FkamFjZW50ID0gW28udG9bMF0sIG8uZnJvbVsxXV07XHJcbiAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby50bywgcGllY2VfdGhhdF9tb3Zlcyk7XHJcbiAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby5mcm9tLCBudWxsKTtcclxuICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBjb29yZF9ob3Jpem9udGFsbHlfYWRqYWNlbnQsIG51bGwpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHBoYXNlOiBcInBpZWNlX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgICAgICBib2FyZDogb2xkLmJvYXJkLFxyXG4gICAgICAgICAgICBoYW5kX29mX2JsYWNrOiBvbGQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICAgICAgaGFuZF9vZl93aGl0ZTogb2xkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgICAgIGJ5X3dob206IG9sZC53aG9fZ29lc19uZXh0XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKCFyZXMpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Gu56e75YuV44KS6Kmm44G/44Gm44GE44G+44GZ44GM44CB6aeS44Gu5YuV44GN5LiK44Gd44Gu44KI44GG44Gq56e75YuV44Gv44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICB9XHJcbiAgICBpZiAoKDAsIHR5cGVfMS5pc19wcm9tb3RhYmxlKShwaWVjZV90aGF0X21vdmVzLnByb2YpXHJcbiAgICAgICAgJiYgKCgwLCBzaWRlXzEuaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzKSgzLCBvLnNpZGUsIG8uZnJvbSkgfHwgKDAsIHNpZGVfMS5pc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3MpKDMsIG8uc2lkZSwgby50bykpKSB7XHJcbiAgICAgICAgaWYgKG8ucHJvbW90ZSkge1xyXG4gICAgICAgICAgICBpZiAocGllY2VfdGhhdF9tb3Zlcy5wcm9mID09PSBcIuahglwiKSB7XHJcbiAgICAgICAgICAgICAgICBwaWVjZV90aGF0X21vdmVzLnByb2YgPSBcIuaIkOahglwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9PT0gXCLpioBcIikge1xyXG4gICAgICAgICAgICAgICAgcGllY2VfdGhhdF9tb3Zlcy5wcm9mID0gXCLmiJDpioBcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwaWVjZV90aGF0X21vdmVzLnByb2YgPT09IFwi6aaZXCIpIHtcclxuICAgICAgICAgICAgICAgIHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9IFwi5oiQ6aaZXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAocGllY2VfdGhhdF9tb3Zlcy5wcm9mID09PSBcIuOCrVwiKSB7XHJcbiAgICAgICAgICAgICAgICBwaWVjZV90aGF0X21vdmVzLnByb2YgPSBcIui2hVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHBpZWNlX3RoYXRfbW92ZXMucHJvZiA9PT0gXCLjg51cIikge1xyXG4gICAgICAgICAgICAgICAgcGllY2VfdGhhdF9tb3Zlcy5wcm9mID0gXCLjgahcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKChwaWVjZV90aGF0X21vdmVzLnByb2YgPT09IFwi5qGCXCIgJiYgKDAsIHNpZGVfMS5pc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3MpKDIsIG8uc2lkZSwgby50bykpXHJcbiAgICAgICAgICAgICAgICB8fCAocGllY2VfdGhhdF9tb3Zlcy5wcm9mID09PSBcIummmVwiICYmICgwLCBzaWRlXzEuaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzKSgxLCBvLnNpZGUsIG8udG8pKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX0ke3BpZWNlX3RoYXRfbW92ZXMucHJvZn3kuI3miJDjgajjga7jgZPjgajjgafjgZnjgYzjgIEkeygwLCB0eXBlXzEucHJvZmVzc2lvbkZ1bGxOYW1lKShwaWVjZV90aGF0X21vdmVzLnByb2YpfeOCkuS4jeaIkOOBp+ihjOOBjeOBqeOBk+OCjeOBruOBquOBhOOBqOOBk+OCjeOBq+ihjOOBi+OBm+OCi+OBk+OBqOOBr+OBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgaWYgKG8ucHJvbW90ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7by5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfSR7cGllY2VfdGhhdF9tb3Zlcy5wcm9mfSR7by5wcm9tb3RlID8gXCLmiJBcIiA6IFwi5LiN5oiQXCJ944Go44Gu44GT44Go44Gn44GZ44GM44CB44GT44Gu56e75YuV44Gv5oiQ44KK44KS55m655Sf44GV44Gb44Gq44GE44Gu44Gn44CMJHtvLnByb21vdGUgPyBcIuaIkFwiIDogXCLkuI3miJBcIn3jgI3ooajoqJjjga/jgafjgY3jgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBvY2N1cGllciA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkob2xkLmJvYXJkLCBvLnRvKTtcclxuICAgIGlmICghb2NjdXBpZXIpIHtcclxuICAgICAgICBpZiAocGllY2VfdGhhdF9tb3Zlcy5wcm9mID09PSBcIuODnVwiICYmIHBpZWNlX3RoYXRfbW92ZXMubmV2ZXJfbW92ZWQgJiYgby50b1sxXSA9PT0gXCLkupRcIikge1xyXG4gICAgICAgICAgICBwaWVjZV90aGF0X21vdmVzLnN1YmplY3RfdG9fZW5fcGFzc2FudCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8udG8sIHBpZWNlX3RoYXRfbW92ZXMpO1xyXG4gICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8uZnJvbSwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcGhhc2U6IFwicGllY2VfcGhhc2VfcGxheWVkXCIsXHJcbiAgICAgICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgICAgIGhhbmRfb2ZfYmxhY2s6IG9sZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgICAgICBoYW5kX29mX3doaXRlOiBvbGQuaGFuZF9vZl93aGl0ZSxcclxuICAgICAgICAgICAgYnlfd2hvbTogb2xkLndob19nb2VzX25leHRcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAob2NjdXBpZXIudHlwZSA9PT0gXCLnooFcIikge1xyXG4gICAgICAgIGlmIChvY2N1cGllci5zaWRlID09PSBvLnNpZGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke28uc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBruenu+WLleOCkuippuOBv+OBpuOBhOOBvuOBmeOBjOOAgSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBq+iHquWIhuOBrueigeefs+OBjOOBguOCi+OBruOBp+OAgeenu+WLleOBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby50bywgcGllY2VfdGhhdF9tb3Zlcyk7XHJcbiAgICAgICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8uZnJvbSwgbnVsbCk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwaGFzZTogXCJwaWVjZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICAgICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgICAgICAgICBoYW5kX29mX2JsYWNrOiBvbGQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICAgICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgICAgICAgICAgYnlfd2hvbTogb2xkLndob19nb2VzX25leHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBpZiAob2NjdXBpZXIuc2lkZSA9PT0gby5zaWRlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjga7np7vli5XjgpLoqabjgb/jgabjgYTjgb7jgZnjgYzjgIEkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgavoh6rliIbjga7pp5LjgYzjgYLjgovjga7jgafjgIHnp7vli5XjgafjgY3jgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAob2NjdXBpZXIudHlwZSA9PT0gXCLjgZfjgodcIikge1xyXG4gICAgICAgICAgICAoby5zaWRlID09PSBcIueZvVwiID8gb2xkLmhhbmRfb2Zfd2hpdGUgOiBvbGQuaGFuZF9vZl9ibGFjaykucHVzaCgoMCwgdHlwZV8xLnVucHJvbW90ZSkob2NjdXBpZXIucHJvZikpO1xyXG4gICAgICAgICAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLnRvLCBwaWVjZV90aGF0X21vdmVzKTtcclxuICAgICAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby5mcm9tLCBudWxsKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHBoYXNlOiBcInBpZWNlX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgICAgICAgICAgYm9hcmQ6IG9sZC5ib2FyZCxcclxuICAgICAgICAgICAgICAgIGhhbmRfb2ZfYmxhY2s6IG9sZC5oYW5kX29mX2JsYWNrLFxyXG4gICAgICAgICAgICAgICAgaGFuZF9vZl93aGl0ZTogb2xkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgICAgICAgICBieV93aG9tOiBvbGQud2hvX2dvZXNfbmV4dFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby50bywgcGllY2VfdGhhdF9tb3Zlcyk7XHJcbiAgICAgICAgICAgICgwLCBib2FyZF8xLnB1dF9lbnRpdHlfYXRfY29vcmRfYW5kX2Fsc29fYWRqdXN0X2ZsYWdzKShvbGQuYm9hcmQsIG8uZnJvbSwgbnVsbCk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBwaGFzZTogXCJwaWVjZV9waGFzZV9wbGF5ZWRcIixcclxuICAgICAgICAgICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgICAgICAgICBoYW5kX29mX2JsYWNrOiBvbGQuaGFuZF9vZl9ibGFjayxcclxuICAgICAgICAgICAgICAgIGhhbmRfb2Zfd2hpdGU6IG9sZC5oYW5kX29mX3doaXRlLFxyXG4gICAgICAgICAgICAgICAgYnlfd2hvbTogb2xkLndob19nb2VzX25leHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIGBvLmZyb21gIOOBq+mnkuOBjOOBguOBo+OBpuOBneOBrumnkuOBjCBgby50b2Ag44G444Go5YuV44GP5L2Z5Zyw44GM44GC44KL44GL44Gp44GG44GL44KS6L+U44GZ44CCYG8udG9gIOOBjOWRs+aWueOBrumnkuOBp+Wfi+OBvuOBo+OBpuOBhOOBn+OCiSBmYWxzZSDjgaDjgZfjgIHjg53jg7zjg7Pjga7mlpzjgoHliY3jgavmlbXpp5LjgYzjgarjgYTjgarjgonmlpzjgoHliY3jga8gZmFsc2Ug44Go44Gq44KL44CCXHJcbiAqICBDaGVja3Mgd2hldGhlciB0aGVyZSBpcyBhIHBpZWNlIGF0IGBvLmZyb21gIHdoaWNoIGNhbiBtb3ZlIHRvIGBvLnRvYC4gV2hlbiBgby50b2AgaXMgb2NjdXBpZWQgYnkgYW4gYWxseSwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIGZhbHNlLFxyXG4gKiAgYW5kIHdoZW4gdGhlcmUgaXMgbm8gZW5lbXkgcGllY2UgZGlhZ29uYWwgdG8gcGF3biwgdGhpcyBmdW5jdGlvbiByZXR1cm5zIGZhbHNlIGZvciB0aGUgZGlhZ29uYWwgZGlyZWN0aW9uLlxyXG4gKiBAcGFyYW0gYm9hcmRcclxuICogQHBhcmFtIG9cclxuICogQHJldHVybnNcclxuICovXHJcbmZ1bmN0aW9uIGNhbl9tb3ZlKGJvYXJkLCBvKSB7XHJcbiAgICBjb25zdCBwID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgby5mcm9tKTtcclxuICAgIGlmICghcCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChwLnR5cGUgPT09IFwi56KBXCIpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjb25zdCBwaWVjZV9hdF9kZXN0aW5hdGlvbiA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIG8udG8pO1xyXG4gICAgaWYgKHBpZWNlX2F0X2Rlc3RpbmF0aW9uPy5zaWRlID09PSBwLnNpZGUpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAocC5wcm9mICE9PSBcIuODnVwiKSB7XHJcbiAgICAgICAgcmV0dXJuICgwLCBjYW5fc2VlXzEuY2FuX3NlZSkoYm9hcmQsIG8pO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGVsdGEgPSAoMCwgc2lkZV8xLmNvb3JkRGlmZlNlZW5Gcm9tKShwLnNpZGUsIG8pO1xyXG4gICAgLy8gY2FuIGFsd2F5cyBtb3ZlIGZvcndhcmRcclxuICAgIGlmIChkZWx0YS52ID09PSAxICYmIGRlbHRhLmggPT09IDApIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIC8vIGNhbiB0YWtlIGRpYWdvbmFsbHksIGFzIGxvbmcgYXMgYW4gb3Bwb25lbnQncyBwaWVjZSBpcyBsb2NhdGVkIHRoZXJlLCBvciB3aGVuIGl0IGlzIGFuIGVuIHBhc3NhbnRcclxuICAgIGlmIChkZWx0YS52ID09PSAxICYmIChkZWx0YS5oID09PSAxIHx8IGRlbHRhLmggPT09IC0xKSkge1xyXG4gICAgICAgIGlmIChwaWVjZV9hdF9kZXN0aW5hdGlvbj8uc2lkZSA9PT0gKDAsIHNpZGVfMS5vcHBvbmVudE9mKShwLnNpZGUpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgY29vcmRfaG9yaXpvbnRhbGx5X2FkamFjZW50ID0gKDAsIHNpZGVfMS5hcHBseURlbHRhU2VlbkZyb20pKHAuc2lkZSwgby5mcm9tLCB7IHY6IDAsIGg6IGRlbHRhLmggfSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBpZWNlX2hvcml6b250YWxseV9hZGphY2VudCA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIGNvb3JkX2hvcml6b250YWxseV9hZGphY2VudCk7XHJcbiAgICAgICAgICAgIGlmIChvLmZyb21bMV0gPT09IFwi5LqUXCJcclxuICAgICAgICAgICAgICAgICYmIHBpZWNlX2hvcml6b250YWxseV9hZGphY2VudD8udHlwZSA9PT0gXCLjgrlcIlxyXG4gICAgICAgICAgICAgICAgJiYgcGllY2VfaG9yaXpvbnRhbGx5X2FkamFjZW50LnByb2YgPT09IFwi44OdXCJcclxuICAgICAgICAgICAgICAgICYmIHBpZWNlX2hvcml6b250YWxseV9hZGphY2VudC5zdWJqZWN0X3RvX2VuX3Bhc3NhbnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImVuIHBhc3NhbnRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChwLm5ldmVyX21vdmVkICYmIGRlbHRhLnYgPT09IDIgJiYgZGVsdGEuaCA9PT0gMCkge1xyXG4gICAgICAgIC8vIGNhbiBtb3ZlIHR3byBpbiB0aGUgZnJvbnQsIHVubGVzcyBibG9ja2VkXHJcbiAgICAgICAgY29uc3QgY29vcmRfaW5fZnJvbnQgPSAoMCwgc2lkZV8xLmFwcGx5RGVsdGFTZWVuRnJvbSkocC5zaWRlLCBvLmZyb20sIHsgdjogMSwgaDogMCB9KTtcclxuICAgICAgICBjb25zdCBjb29yZF90d29faW5fZnJvbnQgPSAoMCwgc2lkZV8xLmFwcGx5RGVsdGFTZWVuRnJvbSkocC5zaWRlLCBvLmZyb20sIHsgdjogMiwgaDogMCB9KTtcclxuICAgICAgICBpZiAoKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgY29vcmRfaW5fZnJvbnQpXHJcbiAgICAgICAgICAgIHx8ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIGNvb3JkX3R3b19pbl9mcm9udCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmNhbl9tb3ZlID0gY2FuX21vdmU7XHJcbmZ1bmN0aW9uIGNhbl9tb3ZlX2FuZF9ub3RfY2F1c2VfZG91YmxlZF9wYXducyhib2FyZCwgbykge1xyXG4gICAgaWYgKCFjYW5fbW92ZShib2FyZCwgbykpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjb25zdCBwaWVjZSA9ICgwLCBib2FyZF8xLmdldF9lbnRpdHlfZnJvbV9jb29yZCkoYm9hcmQsIG8uZnJvbSk7XHJcbiAgICBpZiAocGllY2U/LnR5cGUgPT09IFwi44K5XCIgJiYgcGllY2UucHJvZiA9PT0gXCLjg51cIikge1xyXG4gICAgICAgIGlmIChvLmZyb21bMF0gPT09IG8udG9bMF0pIHsgLy8gbm8gcmlzayBvZiBkb3VibGVkIHBhd25zIHdoZW4gdGhlIHBhd24gbW92ZXMgc3RyYWlnaHRcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBwYXduX2Nvb3JkcyA9ICgwLCBib2FyZF8xLmxvb2t1cF9jb29yZHNfZnJvbV9zaWRlX2FuZF9wcm9mKShib2FyZCwgcGllY2Uuc2lkZSwgXCLjg51cIik7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb2JsZW1hdGljX3Bhd25zID0gcGF3bl9jb29yZHMuZmlsdGVyKChbY29sLCBfcm93XSkgPT4gY29sID09PSBvLnRvWzBdKTtcclxuICAgICAgICAgICAgLy8gaWYgdGhlcmUgYXJlIG5vIHByb2JsZW1hdGljIHBhd25zLCByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICAvLyBpZiB0aGVyZSBhcmUsIHdlIHdhbnQgdG8gYXZvaWQgc3VjaCBhIG1vdmUgaW4gdGhpcyBmdW5jdGlvbiwgc28gZmFsc2VcclxuICAgICAgICAgICAgcmV0dXJuIHByb2JsZW1hdGljX3Bhd25zLmxlbmd0aCA9PT0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB0aHJvd3NfaWZfdW5jYXN0bGFibGUoYm9hcmQsIG8pIHtcclxuICAgIGNvbnN0IGtpbmcgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKGJvYXJkLCBvLmZyb20pO1xyXG4gICAgaWYgKGtpbmc/LnR5cGUgPT09IFwi546LXCIpIHtcclxuICAgICAgICBpZiAoa2luZy5oYXNfbW92ZWRfb25seV9vbmNlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpZmYgPSAoMCwgc2lkZV8xLmNvb3JkRGlmZlNlZW5Gcm9tKShraW5nLnNpZGUsIG8pO1xyXG4gICAgICAgICAgICBpZiAoZGlmZi52ID09PSAwICYmIChkaWZmLmggPT09IDIgfHwgZGlmZi5oID09PSAtMikgJiZcclxuICAgICAgICAgICAgICAgICgoa2luZy5zaWRlID09PSBcIum7klwiICYmIG8uZnJvbVsxXSA9PT0gXCLlhatcIikgfHwgKGtpbmcuc2lkZSA9PT0gXCLnmb1cIiAmJiBvLmZyb21bMV0gPT09IFwi5LqMXCIpKSkge1xyXG4gICAgICAgICAgICAgICAgLy8g44GT44KM44GL44KJ5qSc5p+777yaXHJcbiAgICAgICAgICAgICAgICAvLyDikaEg44Kt44Oj44K544Oq44Oz44Kw5a++6LGh44Gu44Or44O844Kv77yI5Lul5LiLQe+8ieOBr+S4gOW6puOCguWLleOBhOOBpuOBiuOCieOBmlxyXG4gICAgICAgICAgICAgICAgLy8g4pGiIOebuOaJi+OBi+OCieOBrueOi+aJi++8iOODgeOCp+ODg+OCr++8ieOBjOaOm+OBi+OBo+OBpuOBiuOCieOBmuenu+WLleWFiOOBruODnuOCueOBqOmAmumBjueCueOBruODnuOCueOBq+OCguaVteOBrumnkuOBruWIqeOBjeOBr+OBquOBj1xyXG4gICAgICAgICAgICAgICAgLy8g4pGjIOOCreODs+OCsOeOi+OBqEHjga7plpPjgavpp5LvvIjjg4HjgqfjgrnjgIHlsIbmo4vvvInjgYznhKHjgYTloLTlkIjjgavkvb/nlKjjgafjgY3jgotcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZyb21fY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKG8uZnJvbVswXSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0b19jb2x1bW5faW5kZXggPSBcIu+8me+8mO+8l++8lu+8le+8lO+8k++8ku+8kVwiLmluZGV4T2Yoby50b1swXSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb29rX2Nvb3JkID0gW2Zyb21fY29sdW1uX2luZGV4IDwgdG9fY29sdW1uX2luZGV4ID8gXCLvvJFcIiA6IFwi77yZXCIsIG8uZnJvbVsxXV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb29rID0gKDAsIGJvYXJkXzEuZ2V0X2VudGl0eV9mcm9tX2Nvb3JkKShib2FyZCwgcm9va19jb29yZCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb29yZF90aGF0X2tpbmdfcGFzc2VzX3Rocm91Z2ggPSBbXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIlsoZnJvbV9jb2x1bW5faW5kZXggKyB0b19jb2x1bW5faW5kZXgpIC8gMl0sIG8uZnJvbVsxXV07XHJcbiAgICAgICAgICAgICAgICBpZiAocm9vaz8udHlwZSAhPT0gXCLjgrlcIiB8fCByb29rLnByb2YgIT09IFwi44OrXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7a2luZy5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Go44Kt44Oz44Kw546L44KS44Kt44Oj44K544Oq44Oz44Kw44GX44KI44GG44Go44GX44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkocm9va19jb29yZCl944Gr44Or44O844Kv44GM44Gq44GE44Gu44Gn44Kt44Oj44K544Oq44Oz44Kw44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXJvb2submV2ZXJfbW92ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7a2luZy5zaWRlfeOBjCR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8uZnJvbSl944GL44KJJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby50byl944G444Go44Kt44Oz44Kw546L44KS44Kt44Oj44K544Oq44Oz44Kw44GX44KI44GG44Go44GX44Gm44GE44G+44GZ44GM44CBJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkocm9va19jb29yZCl944Gr44GC44KL44Or44O844Kv44Gv5pei44Gr5YuV44GE44Gf44GT44Go44GM44GC44KL44Or44O844Kv44Gq44Gu44Gn44Kt44Oj44K544Oq44Oz44Kw44Gn44GN44G+44Gb44KTYCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoKDAsIGNhbl9zZWVfMS5kb19hbnlfb2ZfbXlfcGllY2VzX3NlZSkoYm9hcmQsIG8uZnJvbSwgKDAsIHNpZGVfMS5vcHBvbmVudE9mKShraW5nLnNpZGUpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtraW5nLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjgajjgq3jg7PjgrDnjovjgpLjgq3jg6Pjgrnjg6rjg7PjgrDjgZfjgojjgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIHnm7jmiYvjgYvjgonjga7njovmiYvvvIjjg4Hjgqfjg4Pjgq/vvInjgYzmjpvjgYvjgaPjgabjgYTjgovjga7jgafjgq3jg6Pjgrnjg6rjg7PjgrDjgafjgY3jgb7jgZvjgpNgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgoMCwgY2FuX3NlZV8xLmRvX2FueV9vZl9teV9waWVjZXNfc2VlKShib2FyZCwgY29vcmRfdGhhdF9raW5nX3Bhc3Nlc190aHJvdWdoLCAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKGtpbmcuc2lkZSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2tpbmcuc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBqOOCreODs+OCsOeOi+OCkuOCreODo+OCueODquODs+OCsOOBl+OCiOOBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgemAmumBjueCueOBruODnuOCueOBq+aVteOBrumnkuOBruWIqeOBjeOBjOOBguOCi+OBruOBp+OCreODo+OCueODquODs+OCsOOBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCgwLCBjYW5fc2VlXzEuZG9fYW55X29mX215X3BpZWNlc19zZWUpKGJvYXJkLCBvLnRvLCAoMCwgc2lkZV8xLm9wcG9uZW50T2YpKGtpbmcuc2lkZSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2tpbmcuc2lkZX3jgYwkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLmZyb20pfeOBi+OCiSR7KDAsIGNvb3JkaW5hdGVfMS5kaXNwbGF5Q29vcmQpKG8udG8pfeOBuOOBqOOCreODs+OCsOeOi+OCkuOCreODo+OCueODquODs+OCsOOBl+OCiOOBhuOBqOOBl+OBpuOBhOOBvuOBmeOBjOOAgeenu+WLleWFiOOBruODnuOCueOBq+aVteOBrumnkuOBruWIqeOBjeOBjOOBguOCi+OBruOBp+OCreODo+OCueODquODs+OCsOOBp+OBjeOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgY29vcmRfdGhhdF9raW5nX3Bhc3Nlc190aHJvdWdoLCByb29rLCByb29rX2Nvb3JkLCBraW5nIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYOOCreODo+OCueODquODs+OCsOOBp+OBr+OBguOCiuOBvuOBm+OCk2ApO1xyXG59XHJcbmV4cG9ydHMudGhyb3dzX2lmX3VuY2FzdGxhYmxlID0gdGhyb3dzX2lmX3VuY2FzdGxhYmxlO1xyXG5mdW5jdGlvbiBjYXN0bGluZyhvbGQsIG8pIHtcclxuICAgIC8vIOaknOafu+a4iO+8mlxyXG4gICAgLy8g4pGgIOOCreODs+OCsOeOi+OBjDHlm57jgaDjgZHliY3pgLLjgZfjgZ/nirbmhYvjgadcclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIC8vIOOBk+OCjOOBi+OCieaknOafu++8mlxyXG4gICAgLy8g4pGhIOOCreODo+OCueODquODs+OCsOWvvuixoeOBruODq+ODvOOCr++8iOS7peS4i0HvvInjga/kuIDluqbjgoLli5XjgYTjgabjgYrjgonjgZpcclxuICAgIC8vIOKRoiDnm7jmiYvjgYvjgonjga7njovmiYvvvIjjg4Hjgqfjg4Pjgq/vvInjgYzmjpvjgYvjgaPjgabjgYrjgonjgZrnp7vli5XlhYjjga7jg57jgrnjgajpgJrpgY7ngrnjga7jg57jgrnjgavjgoLmlbXjga7pp5Ljga7liKnjgY3jga/jgarjgY9cclxuICAgIC8vIOKRoyDjgq3jg7PjgrDnjovjgahB44Gu6ZaT44Gr6aeS77yI44OB44Kn44K544CB5bCG5qOL77yJ44GM54Sh44GE5aC05ZCI44Gr5L2/55So44Gn44GN44KLXHJcbiAgICBjb25zdCB7IGNvb3JkX3RoYXRfa2luZ19wYXNzZXNfdGhyb3VnaCwgcm9va19jb29yZCwgcm9vayB9ID0gdGhyb3dzX2lmX3VuY2FzdGxhYmxlKG9sZC5ib2FyZCwgbyk7XHJcbiAgICBjb25zdCBjb29yZHNfYmV0d2Vlbl9raW5nX2FuZF9yb29rID0gKDAsIGNvb3JkaW5hdGVfMS5jb2x1bW5zQmV0d2Vlbikoby5mcm9tWzBdLCBvLnRvWzBdKS5tYXAoY29sID0+IFtjb2wsIG8uZnJvbVsxXV0pO1xyXG4gICAgY29uc3QgaGFzX3Nob2dpX29yX2NoZXNzX3BpZWNlID0gY29vcmRzX2JldHdlZW5fa2luZ19hbmRfcm9vay5zb21lKGNvb3JkID0+IHtcclxuICAgICAgICBjb25zdCBlbnRpdHkgPSAoMCwgYm9hcmRfMS5nZXRfZW50aXR5X2Zyb21fY29vcmQpKG9sZC5ib2FyZCwgY29vcmQpO1xyXG4gICAgICAgIHJldHVybiBlbnRpdHk/LnR5cGUgPT09IFwi44GX44KHXCIgfHwgZW50aXR5Py50eXBlID09PSBcIuOCuVwiIHx8IGVudGl0eT8udHlwZSA9PT0gXCLnooFcIjtcclxuICAgIH0pO1xyXG4gICAgaWYgKGhhc19zaG9naV9vcl9jaGVzc19waWVjZSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtvLnNpZGV944GMJHsoMCwgY29vcmRpbmF0ZV8xLmRpc3BsYXlDb29yZCkoby5mcm9tKX3jgYvjgokkeygwLCBjb29yZGluYXRlXzEuZGlzcGxheUNvb3JkKShvLnRvKX3jgbjjgajjgq3jg7PjgrDnjovjgpLjgq3jg6Pjgrnjg6rjg7PjgrDjgZfjgojjgYbjgajjgZfjgabjgYTjgb7jgZnjgYzjgIHjgq3jg7PjgrDnjovjgajjg6vjg7zjgq/jga7plpPjgavpp5LjgYzjgYLjgovjga7jgafjgq3jg6Pjgrnjg6rjg7PjgrDjgafjgY3jgb7jgZvjgpNgKTtcclxuICAgIH1cclxuICAgIC8vIOKRpCDplpPjgavnooHnn7PjgYzjgYLjgozjgbDlj5bjgorpmaTjgY1cclxuICAgIGNvb3Jkc19iZXR3ZWVuX2tpbmdfYW5kX3Jvb2suZm9yRWFjaChjb29yZCA9PiAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBjb29yZCwgbnVsbCkpO1xyXG4gICAgLy8g4pGlIOOCreODs+OCsOeOi+OBryBBIOOBruaWueWQkeOBqyAyIOODnuOCueenu+WLleOBl1xyXG4gICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgby50bywge1xyXG4gICAgICAgIHByb2Y6IFwi44KtXCIsXHJcbiAgICAgICAgc2lkZTogby5zaWRlLFxyXG4gICAgICAgIHR5cGU6IFwi546LXCIsXHJcbiAgICAgICAgaGFzX21vdmVkX29ubHlfb25jZTogZmFsc2UsXHJcbiAgICAgICAgbmV2ZXJfbW92ZWQ6IGZhbHNlLFxyXG4gICAgfSk7XHJcbiAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBvLmZyb20sIG51bGwpO1xyXG4gICAgLy8g4pGmIEEg44Gv44Kt44Oz44Kw546L44KS6aOb44Gz6LaK44GX44Gf6Zqj44Gu44Oe44K544Gr56e75YuV44GZ44KLXHJcbiAgICAoMCwgYm9hcmRfMS5wdXRfZW50aXR5X2F0X2Nvb3JkX2FuZF9hbHNvX2FkanVzdF9mbGFncykob2xkLmJvYXJkLCBjb29yZF90aGF0X2tpbmdfcGFzc2VzX3Rocm91Z2gsIHJvb2spO1xyXG4gICAgKDAsIGJvYXJkXzEucHV0X2VudGl0eV9hdF9jb29yZF9hbmRfYWxzb19hZGp1c3RfZmxhZ3MpKG9sZC5ib2FyZCwgcm9va19jb29yZCwgbnVsbCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBoYXNlOiBcInBpZWNlX3BoYXNlX3BsYXllZFwiLFxyXG4gICAgICAgIGJvYXJkOiBvbGQuYm9hcmQsXHJcbiAgICAgICAgaGFuZF9vZl9ibGFjazogb2xkLmhhbmRfb2ZfYmxhY2ssXHJcbiAgICAgICAgaGFuZF9vZl93aGl0ZTogb2xkLmhhbmRfb2Zfd2hpdGUsXHJcbiAgICAgICAgYnlfd2hvbTogb2xkLndob19nb2VzX25leHRcclxuICAgIH07XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5hcHBseURlbHRhU2VlbkZyb20gPSBleHBvcnRzLmlzX3dpdGhpbl9udGhfZnVydGhlc3Rfcm93cyA9IGV4cG9ydHMuY29vcmREaWZmU2VlbkZyb20gPSBleHBvcnRzLkxlZnRtb3N0V2hlblNlZW5Gcm9tID0gZXhwb3J0cy5SaWdodG1vc3RXaGVuU2VlbkZyb20gPSBleHBvcnRzLm9wcG9uZW50T2YgPSB2b2lkIDA7XHJcbmNvbnN0IGNvb3JkaW5hdGVfMSA9IHJlcXVpcmUoXCIuL2Nvb3JkaW5hdGVcIik7XHJcbmZ1bmN0aW9uIG9wcG9uZW50T2Yoc2lkZSkge1xyXG4gICAgaWYgKHNpZGUgPT09IFwi6buSXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi55m9XCI7XHJcbiAgICBlbHNlXHJcbiAgICAgICAgcmV0dXJuIFwi6buSXCI7XHJcbn1cclxuZXhwb3J0cy5vcHBvbmVudE9mID0gb3Bwb25lbnRPZjtcclxuZnVuY3Rpb24gUmlnaHRtb3N0V2hlblNlZW5Gcm9tKHNpZGUsIGNvb3Jkcykge1xyXG4gICAgaWYgKHNpZGUgPT09IFwi6buSXCIpIHtcclxuICAgICAgICByZXR1cm4gKDAsIGNvb3JkaW5hdGVfMS5SaWdodG1vc3RXaGVuU2VlbkZyb21CbGFjaykoY29vcmRzKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAoMCwgY29vcmRpbmF0ZV8xLkxlZnRtb3N0V2hlblNlZW5Gcm9tQmxhY2spKGNvb3Jkcyk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5SaWdodG1vc3RXaGVuU2VlbkZyb20gPSBSaWdodG1vc3RXaGVuU2VlbkZyb207XHJcbmZ1bmN0aW9uIExlZnRtb3N0V2hlblNlZW5Gcm9tKHNpZGUsIGNvb3Jkcykge1xyXG4gICAgaWYgKHNpZGUgPT09IFwi6buSXCIpIHtcclxuICAgICAgICByZXR1cm4gKDAsIGNvb3JkaW5hdGVfMS5MZWZ0bW9zdFdoZW5TZWVuRnJvbUJsYWNrKShjb29yZHMpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICgwLCBjb29yZGluYXRlXzEuUmlnaHRtb3N0V2hlblNlZW5Gcm9tQmxhY2spKGNvb3Jkcyk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5MZWZ0bW9zdFdoZW5TZWVuRnJvbSA9IExlZnRtb3N0V2hlblNlZW5Gcm9tO1xyXG4vKiogdmVydGljYWwg44GMICsxID0g5YmN6YCy44CA44CAaG9yaXpvbnRhbCDjgYwgKzEgPSDlt6ZcclxuICovXHJcbmZ1bmN0aW9uIGNvb3JkRGlmZlNlZW5Gcm9tKHNpZGUsIG8pIHtcclxuICAgIGlmIChzaWRlID09PSBcIueZvVwiKSB7XHJcbiAgICAgICAgcmV0dXJuICgwLCBjb29yZGluYXRlXzEuY29vcmREaWZmKShvKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IHsgaCwgdiB9ID0gKDAsIGNvb3JkaW5hdGVfMS5jb29yZERpZmYpKG8pO1xyXG4gICAgICAgIHJldHVybiB7IGg6IC1oLCB2OiAtdiB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuY29vcmREaWZmU2VlbkZyb20gPSBjb29yZERpZmZTZWVuRnJvbTtcclxuZnVuY3Rpb24gaXNfd2l0aGluX250aF9mdXJ0aGVzdF9yb3dzKG4sIHNpZGUsIGNvb3JkKSB7XHJcbiAgICBjb25zdCByb3cgPSBjb29yZFsxXTtcclxuICAgIGlmIChzaWRlID09PSBcIum7klwiKSB7XHJcbiAgICAgICAgcmV0dXJuIFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZihyb3cpIDwgbjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBcIuS5neWFq+S4g+WFreS6lOWbm+S4ieS6jOS4gFwiLmluZGV4T2Yocm93KSA8IG47XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5pc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3MgPSBpc193aXRoaW5fbnRoX2Z1cnRoZXN0X3Jvd3M7XHJcbi8vIHNpbmNlIHRoaXMgZnVuY3Rpb24gaXMgb25seSB1c2VkIHRvIGludGVycG9sYXRlIGJldHdlZW4gdHdvIHZhbGlkIHBvaW50cywgdGhlcmUgaXMgbm8gbmVlZCB0byBwZXJmb3JtIGFuZCBvdXQtb2YtYm91bmRzIGNoZWNrLlxyXG5mdW5jdGlvbiBhcHBseURlbHRhU2VlbkZyb20oc2lkZSwgZnJvbSwgZGVsdGEpIHtcclxuICAgIGlmIChzaWRlID09PSBcIueZvVwiKSB7XHJcbiAgICAgICAgY29uc3QgW2Zyb21fY29sdW1uLCBmcm9tX3Jvd10gPSBmcm9tO1xyXG4gICAgICAgIGNvbnN0IGZyb21fcm93X2luZGV4ID0gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIi5pbmRleE9mKGZyb21fcm93KTtcclxuICAgICAgICBjb25zdCBmcm9tX2NvbHVtbl9pbmRleCA9IFwi77yZ77yY77yX77yW77yV77yU77yT77yS77yRXCIuaW5kZXhPZihmcm9tX2NvbHVtbik7XHJcbiAgICAgICAgY29uc3QgdG9fY29sdW1uX2luZGV4ID0gZnJvbV9jb2x1bW5faW5kZXggKyBkZWx0YS5oO1xyXG4gICAgICAgIGNvbnN0IHRvX3Jvd19pbmRleCA9IGZyb21fcm93X2luZGV4ICsgZGVsdGEudjtcclxuICAgICAgICBjb25zdCBjb2x1bW5zID0gW1wi77yZXCIsIFwi77yYXCIsIFwi77yXXCIsIFwi77yWXCIsIFwi77yVXCIsIFwi77yUXCIsIFwi77yTXCIsIFwi77ySXCIsIFwi77yRXCJdO1xyXG4gICAgICAgIGNvbnN0IHJvd3MgPSBbXCLkuIBcIiwgXCLkuoxcIiwgXCLkuIlcIiwgXCLlm5tcIiwgXCLkupRcIiwgXCLlha1cIiwgXCLkuINcIiwgXCLlhatcIiwgXCLkuZ1cIl07XHJcbiAgICAgICAgcmV0dXJuIFtjb2x1bW5zW3RvX2NvbHVtbl9pbmRleF0sIHJvd3NbdG9fcm93X2luZGV4XV07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBjb25zdCBbZnJvbV9jb2x1bW4sIGZyb21fcm93XSA9IGZyb207XHJcbiAgICAgICAgY29uc3QgZnJvbV9yb3dfaW5kZXggPSBcIuS4gOS6jOS4ieWbm+S6lOWFreS4g+WFq+S5nVwiLmluZGV4T2YoZnJvbV9yb3cpO1xyXG4gICAgICAgIGNvbnN0IGZyb21fY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGZyb21fY29sdW1uKTtcclxuICAgICAgICBjb25zdCB0b19jb2x1bW5faW5kZXggPSBmcm9tX2NvbHVtbl9pbmRleCAtIGRlbHRhLmg7XHJcbiAgICAgICAgY29uc3QgdG9fcm93X2luZGV4ID0gZnJvbV9yb3dfaW5kZXggLSBkZWx0YS52O1xyXG4gICAgICAgIGNvbnN0IGNvbHVtbnMgPSBbXCLvvJlcIiwgXCLvvJhcIiwgXCLvvJdcIiwgXCLvvJZcIiwgXCLvvJVcIiwgXCLvvJRcIiwgXCLvvJNcIiwgXCLvvJJcIiwgXCLvvJFcIl07XHJcbiAgICAgICAgY29uc3Qgcm93cyA9IFtcIuS4gFwiLCBcIuS6jFwiLCBcIuS4iVwiLCBcIuWbm1wiLCBcIuS6lFwiLCBcIuWFrVwiLCBcIuS4g1wiLCBcIuWFq1wiLCBcIuS5nVwiXTtcclxuICAgICAgICByZXR1cm4gW2NvbHVtbnNbdG9fY29sdW1uX2luZGV4XSwgcm93c1t0b19yb3dfaW5kZXhdXTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmFwcGx5RGVsdGFTZWVuRnJvbSA9IGFwcGx5RGVsdGFTZWVuRnJvbTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5yZW1vdmVfc3Vycm91bmRlZCA9IHZvaWQgMDtcclxuZnVuY3Rpb24gcmVtb3ZlX3N1cnJvdW5kZWQoY29sb3JfdG9fYmVfcmVtb3ZlZCwgYm9hcmQpIHtcclxuICAgIGNvbnN0IGJvYXJkXyA9IGJvYXJkLm1hcChyb3cgPT4gcm93Lm1hcChzaWRlID0+IHNpZGUgPT09IG51bGwgPyBcImVtcHR5XCIgOiB7IHNpZGUsIHZpc2l0ZWQ6IGZhbHNlLCBjb25uZWN0ZWRfY29tcG9uZW50X2luZGV4OiAtMSB9KSk7XHJcbiAgICAvLyBEZXB0aC1maXJzdCBzZWFyY2ggdG8gYXNzaWduIGEgdW5pcXVlIGluZGV4IHRvIGVhY2ggY29ubmVjdGVkIGNvbXBvbmVudFxyXG4gICAgLy8g5ZCE6YCj57WQ5oiQ5YiG44Gr5LiA5oSP44Gq44Kk44Oz44OH44OD44Kv44K544KS44G144KL44Gf44KB44Gu5rex44GV5YSq5YWI5o6i57SiXHJcbiAgICBjb25zdCBkZnNfc3RhY2sgPSBbXTtcclxuICAgIGNvbnN0IGluZGljZXNfdGhhdF9zdXJ2aXZlID0gW107XHJcbiAgICBsZXQgaW5kZXggPSAwO1xyXG4gICAgZm9yIChsZXQgSSA9IDA7IEkgPCBib2FyZF8ubGVuZ3RoOyBJKyspIHtcclxuICAgICAgICBmb3IgKGxldCBKID0gMDsgSiA8IGJvYXJkX1tJXS5sZW5ndGg7IEorKykge1xyXG4gICAgICAgICAgICBjb25zdCBzcSA9IGJvYXJkX1tJXVtKXTtcclxuICAgICAgICAgICAgaWYgKHNxICE9PSBcImVtcHR5XCIgJiYgc3Euc2lkZSA9PT0gY29sb3JfdG9fYmVfcmVtb3ZlZCAmJiAhc3EudmlzaXRlZCkge1xyXG4gICAgICAgICAgICAgICAgZGZzX3N0YWNrLnB1c2goeyBpOiBJLCBqOiBKIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdoaWxlIChkZnNfc3RhY2subGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmVydGV4X2Nvb3JkID0gZGZzX3N0YWNrLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmVydGV4ID0gYm9hcmRfW3ZlcnRleF9jb29yZC5pXVt2ZXJ0ZXhfY29vcmQual07XHJcbiAgICAgICAgICAgICAgICBpZiAodmVydGV4ID09PSBcImVtcHR5XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBgZGZzX3N0YWNrYCDjgavnqbrjga7jg57jgrnjga/jg5fjg4Pjgrfjg6XjgZXjgozjgabjgYTjgarjgYTjga/jgZpcclxuICAgICAgICAgICAgICAgICAgICAvLyBhbiBlbXB0eSBzcXVhcmUgc2hvdWxkIG5vdCBiZSBwdXNoZWQgdG8gYGRmc19zdGFja2BcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzaG91bGQgbm90IHJlYWNoIGhlcmVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXgudmlzaXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXguY29ubmVjdGVkX2NvbXBvbmVudF9pbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIHsgaTogdmVydGV4X2Nvb3JkLmksIGo6IHZlcnRleF9jb29yZC5qICsgMSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgaTogdmVydGV4X2Nvb3JkLmksIGo6IHZlcnRleF9jb29yZC5qIC0gMSB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgaTogdmVydGV4X2Nvb3JkLmkgKyAxLCBqOiB2ZXJ0ZXhfY29vcmQuaiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHsgaTogdmVydGV4X2Nvb3JkLmkgLSAxLCBqOiB2ZXJ0ZXhfY29vcmQuaiB9LFxyXG4gICAgICAgICAgICAgICAgXS5maWx0ZXIoKHsgaSwgaiB9KSA9PiB7IGNvbnN0IHJvdyA9IGJvYXJkX1tpXTsgcmV0dXJuIHJvdyAmJiAwIDw9IGogJiYgaiA8IHJvdy5sZW5ndGg7IH0pLmZvckVhY2goKHsgaSwgaiB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmVpZ2hib3IgPSBib2FyZF9baV1bal07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5laWdoYm9yID09PSBcImVtcHR5XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV4dCB0byBhbiBlbXB0eSBzcXVhcmUgKGEgbGliZXJ0eSk7IHN1cnZpdmVzLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDlkbzlkLjngrnjgYzpmqPmjqXjgZfjgabjgYTjgovjga7jgafjgIHjgZPjga4gaW5kZXgg44GM5oyv44KJ44KM44Gm44GE44KL6YCj57WQ5oiQ5YiG44Gv5Li444CF55Sf44GN5bu244Gz44KLXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGljZXNfdGhhdF9zdXJ2aXZlLnB1c2goaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChuZWlnaGJvci5zaWRlID09PSBjb2xvcl90b19iZV9yZW1vdmVkICYmICFuZWlnaGJvci52aXNpdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRmc19zdGFjay5wdXNoKHsgaSwgaiB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGluZGljZXNfdGhhdF9zdXJ2aXZlIOOBq+iomOi8ieOBruOBquOBhCBpbmRleCDjga7jgoTjgaTjgonjgpLliYrpmaTjgZfjgaYgYW5zIOOBuOOBqOi7ouiomFxyXG4gICAgLy8gQ29weSB0aGUgY29udGVudCB0byBgYW5zYCB3aGlsZSBkZWxldGluZyB0aGUgY29ubmVjdGVkIGNvbXBvbmVudHMgd2hvc2UgaW5kZXggaXMgbm90IGluIGBpbmRpY2VzX3RoYXRfc3Vydml2ZWBcclxuICAgIGNvbnN0IGFucyA9IFtdO1xyXG4gICAgZm9yIChsZXQgSSA9IDA7IEkgPCBib2FyZF8ubGVuZ3RoOyBJKyspIHtcclxuICAgICAgICBjb25zdCByb3cgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBKID0gMDsgSiA8IGJvYXJkX1tJXS5sZW5ndGg7IEorKykge1xyXG4gICAgICAgICAgICBjb25zdCBzcSA9IGJvYXJkX1tJXVtKXTtcclxuICAgICAgICAgICAgaWYgKHNxID09PSBcImVtcHR5XCIpIHtcclxuICAgICAgICAgICAgICAgIHJvdy5wdXNoKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHNxLnNpZGUgPT09IGNvbG9yX3RvX2JlX3JlbW92ZWRcclxuICAgICAgICAgICAgICAgICYmICFpbmRpY2VzX3RoYXRfc3Vydml2ZS5pbmNsdWRlcyhzcS5jb25uZWN0ZWRfY29tcG9uZW50X2luZGV4KSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZG9lcyBub3Qgc3Vydml2ZVxyXG4gICAgICAgICAgICAgICAgcm93LnB1c2gobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByb3cucHVzaChzcS5zaWRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBhbnMucHVzaChyb3cpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFucztcclxufVxyXG5leHBvcnRzLnJlbW92ZV9zdXJyb3VuZGVkID0gcmVtb3ZlX3N1cnJvdW5kZWQ7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuaXNfcHJvbW90YWJsZSA9IGV4cG9ydHMuaXNVbnByb21vdGVkU2hvZ2lQcm9mZXNzaW9uID0gZXhwb3J0cy5wcm9mZXNzaW9uRnVsbE5hbWUgPSBleHBvcnRzLnVucHJvbW90ZSA9IGV4cG9ydHMuY2xvbmVfZW50aXR5ID0gdm9pZCAwO1xyXG5mdW5jdGlvbiBjbG9uZV9lbnRpdHkoZW50aXR5KSB7XHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShlbnRpdHkpKTtcclxufVxyXG5leHBvcnRzLmNsb25lX2VudGl0eSA9IGNsb25lX2VudGl0eTtcclxuZnVuY3Rpb24gdW5wcm9tb3RlKGEpIHtcclxuICAgIGlmIChhID09PSBcIuaIkOahglwiKVxyXG4gICAgICAgIHJldHVybiBcIuahglwiO1xyXG4gICAgaWYgKGEgPT09IFwi5oiQ6YqAXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi6YqAXCI7XHJcbiAgICBpZiAoYSA9PT0gXCLmiJDppplcIilcclxuICAgICAgICByZXR1cm4gXCLppplcIjtcclxuICAgIHJldHVybiBhO1xyXG59XHJcbmV4cG9ydHMudW5wcm9tb3RlID0gdW5wcm9tb3RlO1xyXG5mdW5jdGlvbiBwcm9mZXNzaW9uRnVsbE5hbWUoYSkge1xyXG4gICAgaWYgKGEgPT09IFwi44GoXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjgajjgq/jgqPjg7zjg7NcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi44KtXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjgq3jg7PjgrDnjotcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi44KvXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjgq/jgqPjg7zjg7NcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi44OKXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjg4rjgqTjg4hcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi44OTXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjg5Pjgrfjg6fjg4Pjg5dcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi44OdXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjg53jg7zjg7PlhbVcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi44OrXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjg6vjg7zjgq9cIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi6LaFXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLjgrnjg7zjg5Hjg7zjgq3jg7PjgrDnjotcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi5qGCXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLmoYLppqxcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi6aaZXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLpppnou4pcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi6YqAXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLpioDlsIZcIjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGEgPT09IFwi6YeRXCIpIHtcclxuICAgICAgICByZXR1cm4gXCLph5HlsIZcIjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMucHJvZmVzc2lvbkZ1bGxOYW1lID0gcHJvZmVzc2lvbkZ1bGxOYW1lO1xyXG5mdW5jdGlvbiBpc1VucHJvbW90ZWRTaG9naVByb2Zlc3Npb24oYSkge1xyXG4gICAgcmV0dXJuIGEgPT09IFwi6aaZXCIgfHxcclxuICAgICAgICBhID09PSBcIuahglwiIHx8XHJcbiAgICAgICAgYSA9PT0gXCLpioBcIiB8fFxyXG4gICAgICAgIGEgPT09IFwi6YeRXCI7XHJcbn1cclxuZXhwb3J0cy5pc1VucHJvbW90ZWRTaG9naVByb2Zlc3Npb24gPSBpc1VucHJvbW90ZWRTaG9naVByb2Zlc3Npb247XHJcbmZ1bmN0aW9uIGlzX3Byb21vdGFibGUocHJvZikge1xyXG4gICAgcmV0dXJuIHByb2YgPT09IFwi5qGCXCIgfHwgcHJvZiA9PT0gXCLpioBcIiB8fCBwcm9mID09PSBcIummmVwiIHx8IHByb2YgPT09IFwi44KtXCIgfHwgcHJvZiA9PT0gXCLjg51cIjtcclxufVxyXG5leHBvcnRzLmlzX3Byb21vdGFibGUgPSBpc19wcm9tb3RhYmxlO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLmJhY2t3YXJkX2hpc3RvcnkgPSBleHBvcnRzLnRha2VfdW50aWxfZmlyc3RfY3Vyc29yID0gZXhwb3J0cy5mb3J3YXJkX2hpc3RvcnkgPSBleHBvcnRzLnBhcnNlX2N1cnNvcmVkID0gdm9pZCAwO1xyXG5jb25zdCBzaG9nb3NzX3BhcnNlcl8xID0gcmVxdWlyZShcInNob2dvc3MtcGFyc2VyXCIpO1xyXG5mdW5jdGlvbiBwYXJzZV9jdXJzb3JlZChzKSB7XHJcbiAgICBjb25zdCBhbnMgPSB7IG1haW46IFtdLCB1bmV2YWx1YXRlZDogW10gfTtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgcyA9IHMudHJpbVN0YXJ0KCk7XHJcbiAgICAgICAgaWYgKHMuc3RhcnRzV2l0aChcInt8XCIpKSB7XHJcbiAgICAgICAgICAgIHMgPSBzLnNsaWNlKEJPT0tNQVJLX0xFTkdUSCk7XHJcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBzID0gcy50cmltU3RhcnQoKTtcclxuICAgICAgICAgICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoXCJ9XCIpKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhbnM7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB7IG1vdmUsIHJlc3QgfSA9ICgwLCBzaG9nb3NzX3BhcnNlcl8xLm11bmNoX29uZSkocyk7XHJcbiAgICAgICAgICAgICAgICBzID0gcmVzdDtcclxuICAgICAgICAgICAgICAgIGFucy51bmV2YWx1YXRlZC5wdXNoKG1vdmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHMudHJpbVN0YXJ0KCkgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFucztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgeyBtb3ZlLCByZXN0IH0gPSAoMCwgc2hvZ29zc19wYXJzZXJfMS5tdW5jaF9vbmUpKHMpO1xyXG4gICAgICAgIHMgPSByZXN0O1xyXG4gICAgICAgIGFucy5tYWluLnB1c2gobW92ZSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5wYXJzZV9jdXJzb3JlZCA9IHBhcnNlX2N1cnNvcmVkO1xyXG5jb25zdCBCT09LTUFSS19MRU5HVEggPSBcInt8XCIubGVuZ3RoO1xyXG5mdW5jdGlvbiBmb3J3YXJkX2hpc3Rvcnkob3JpZ2luYWxfcykge1xyXG4gICAgbGV0IHMgPSBvcmlnaW5hbF9zO1xyXG4gICAgLy8gbiDmiYvliIbjgpLjg5Hjg7zjgrlcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgcyA9IHMudHJpbVN0YXJ0KCk7XHJcbiAgICAgICAgLy8ge3wg44Gr6YGt6YGH44GX44Gf44KJ44CBXHJcbiAgICAgICAgY29uc3QgdGlsbF9udGggPSBvcmlnaW5hbF9zLnNsaWNlKDAsIG9yaWdpbmFsX3MubGVuZ3RoIC0gcy5sZW5ndGgpO1xyXG4gICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoXCJ7fFwiKSkge1xyXG4gICAgICAgICAgICAvLyB7fCDjgpLoqq3jgb/po5vjgbDjgZfjgIFcclxuICAgICAgICAgICAgcyA9IHMuc2xpY2UoQk9PS01BUktfTEVOR1RIKTtcclxuICAgICAgICAgICAgLy8g44K544Oa44O844K544KS5L+d5YWo44GX44GmXHJcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0X29mX3NwYWNlID0gb3JpZ2luYWxfcy5sZW5ndGggLSBzLmxlbmd0aDtcclxuICAgICAgICAgICAgcyA9IHMudHJpbVN0YXJ0KCk7XHJcbiAgICAgICAgICAgIC8vICAxIOaJi+WIhuOCkuODkeODvOOCueOAgjEg5omL44KC5q6L44Gj44Gm44Gq44GE44Gq44KJ44CB44Gd44KM44Gv44Gd44KM5Lul5LiKIGZvcndhcmQg44Gn44GN44Gq44GE44Gu44GnIG51bGwg44KS6L+U44GZXHJcbiAgICAgICAgICAgIGlmIChzLnN0YXJ0c1dpdGgoXCJ9XCIpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB7IG1vdmU6IF8sIHJlc3QgfSA9ICgwLCBzaG9nb3NzX3BhcnNlcl8xLm11bmNoX29uZSkocyk7XHJcbiAgICAgICAgICAgIHMgPSByZXN0O1xyXG4gICAgICAgICAgICBjb25zdCBlbmRfb2Zfc3BhY2VfYW5kX21vdmUgPSBvcmlnaW5hbF9zLmxlbmd0aCAtIHMubGVuZ3RoO1xyXG4gICAgICAgICAgICBzID0gcy50cmltU3RhcnQoKTtcclxuICAgICAgICAgICAgY29uc3QgZW5kX29mX3NwYWNlX2FuZF9tb3ZlX2FuZF9zcGFjZSA9IG9yaWdpbmFsX3MubGVuZ3RoIC0gcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHJldHVybiB0aWxsX250aCArIG9yaWdpbmFsX3Muc2xpY2Uoc3RhcnRfb2Zfc3BhY2UsIGVuZF9vZl9zcGFjZV9hbmRfbW92ZSkgKyBvcmlnaW5hbF9zLnNsaWNlKGVuZF9vZl9zcGFjZV9hbmRfbW92ZSwgZW5kX29mX3NwYWNlX2FuZF9tb3ZlX2FuZF9zcGFjZSkgKyBcInt8XCIgKyBvcmlnaW5hbF9zLnNsaWNlKGVuZF9vZl9zcGFjZV9hbmRfbW92ZV9hbmRfc3BhY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzLnRyaW1TdGFydCgpID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsOyAvLyDjgZ3jgozku6XkuIogZm9yd2FyZCDjgafjgY3jgarjgYTjga7jgacgbnVsbCDjgpLov5TjgZlcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgeyBtb3ZlOiBfLCByZXN0IH0gPSAoMCwgc2hvZ29zc19wYXJzZXJfMS5tdW5jaF9vbmUpKHMpO1xyXG4gICAgICAgIHMgPSByZXN0O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuZm9yd2FyZF9oaXN0b3J5ID0gZm9yd2FyZF9oaXN0b3J5O1xyXG5mdW5jdGlvbiB0YWtlX3VudGlsX2ZpcnN0X2N1cnNvcihvcmlnaW5hbF9zKSB7XHJcbiAgICBsZXQgcyA9IG9yaWdpbmFsX3M7XHJcbiAgICBjb25zdCBpbmRpY2VzID0gW107XHJcbiAgICAvLyBuIOaJi+WIhuOCkuODkeODvOOCuVxyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBzID0gcy50cmltU3RhcnQoKTtcclxuICAgICAgICBpbmRpY2VzLnB1c2gob3JpZ2luYWxfcy5sZW5ndGggLSBzLmxlbmd0aCk7XHJcbiAgICAgICAgLy8ge3wg44Gr6YGt6YGH44GX44Gf44KJ44CBXHJcbiAgICAgICAgaWYgKHMuc3RhcnRzV2l0aChcInt8XCIpKSB7XHJcbiAgICAgICAgICAgIC8vIHt8IOS7pemZjeOCkumbkeOBq+WJiuOCi1xyXG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxfcy5zbGljZSgwLCBvcmlnaW5hbF9zLmxlbmd0aCAtIHMubGVuZ3RoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocy50cmltU3RhcnQoKSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxfcztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgeyBtb3ZlOiBfLCByZXN0IH0gPSAoMCwgc2hvZ29zc19wYXJzZXJfMS5tdW5jaF9vbmUpKHMpO1xyXG4gICAgICAgIHMgPSByZXN0O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMudGFrZV91bnRpbF9maXJzdF9jdXJzb3IgPSB0YWtlX3VudGlsX2ZpcnN0X2N1cnNvcjtcclxuZnVuY3Rpb24gYmFja3dhcmRfaGlzdG9yeShvcmlnaW5hbF9zKSB7XHJcbiAgICBsZXQgcyA9IG9yaWdpbmFsX3M7XHJcbiAgICBjb25zdCBpbmRpY2VzID0gW107XHJcbiAgICAvLyBuIOaJi+WIhuOCkuODkeODvOOCuVxyXG4gICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICBzID0gcy50cmltU3RhcnQoKTtcclxuICAgICAgICBpbmRpY2VzLnB1c2gob3JpZ2luYWxfcy5sZW5ndGggLSBzLmxlbmd0aCk7XHJcbiAgICAgICAgLy8ge3wg44Gr6YGt6YGH44GX44Gf44KJ44CBXHJcbiAgICAgICAgaWYgKHMuc3RhcnRzV2l0aChcInt8XCIpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5taW51czFfZW5kID0gaW5kaWNlc1tpbmRpY2VzLmxlbmd0aCAtIDJdO1xyXG4gICAgICAgICAgICBjb25zdCBuX2VuZCA9IGluZGljZXNbaW5kaWNlcy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgaWYgKG5taW51czFfZW5kID09PSB1bmRlZmluZWQgfHwgbl9lbmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7IC8vIOOBneOCjOS7peS4iiBiYWNrd2FyZCDjgafjgY3jgarjgYTjga7jgacgbnVsbCDjgpLov5TjgZlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxfcy5zbGljZSgwLCBubWludXMxX2VuZCkgKyBcInt8XCIgKyBvcmlnaW5hbF9zLnNsaWNlKG5taW51czFfZW5kLCBuX2VuZCkgKyBvcmlnaW5hbF9zLnNsaWNlKG5fZW5kICsgQk9PS01BUktfTEVOR1RIKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocy50cmltU3RhcnQoKSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAvLyDmoJ7jgYzjgarjgYTjga7jgafnlJ/jgoTjgZlcclxuICAgICAgICAgICAgY29uc3Qgbm1pbnVzMV9lbmQgPSBpbmRpY2VzW2luZGljZXMubGVuZ3RoIC0gMl07XHJcbiAgICAgICAgICAgIGNvbnN0IG5fZW5kID0gaW5kaWNlc1tpbmRpY2VzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICBpZiAobm1pbnVzMV9lbmQgPT09IHVuZGVmaW5lZCB8fCBuX2VuZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8g44Gd44KM5Lul5LiKIGJhY2t3YXJkIOOBp+OBjeOBquOBhOOBruOBpyBudWxsIOOCkui/lOOBmVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbF9zLnNsaWNlKDAsIG5taW51czFfZW5kKSArIFwie3xcIiArIG9yaWdpbmFsX3Muc2xpY2Uobm1pbnVzMV9lbmQsIG5fZW5kKSArIG9yaWdpbmFsX3Muc2xpY2Uobl9lbmQpICsgXCJ9XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHsgbW92ZTogXywgcmVzdCB9ID0gKDAsIHNob2dvc3NfcGFyc2VyXzEubXVuY2hfb25lKShzKTtcclxuICAgICAgICBzID0gcmVzdDtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLmJhY2t3YXJkX2hpc3RvcnkgPSBiYWNrd2FyZF9oaXN0b3J5O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnBhcnNlID0gZXhwb3J0cy5tdW5jaF9vbmUgPSBleHBvcnRzLnBhcnNlX29uZSA9IGV4cG9ydHMucGFyc2VfcHJvZmVzc2lvbiA9IGV4cG9ydHMucGFyc2VfY29vcmQgPSB2b2lkIDA7XHJcbmZ1bmN0aW9uIHBhcnNlX2Nvb3JkKHMpIHtcclxuICAgIGNvbnN0IGNvbHVtbiA9ICgoYykgPT4ge1xyXG4gICAgICAgIGlmIChjID09PSBcIu+8kVwiIHx8IGMgPT09IFwiMVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIu+8kVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8klwiIHx8IGMgPT09IFwiMlwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIu+8klwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8k1wiIHx8IGMgPT09IFwiM1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIu+8k1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8lFwiIHx8IGMgPT09IFwiNFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIu+8lFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8lVwiIHx8IGMgPT09IFwiNVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIu+8lVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8llwiIHx8IGMgPT09IFwiNlwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIu+8llwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8l1wiIHx8IGMgPT09IFwiN1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIu+8l1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8mFwiIHx8IGMgPT09IFwiOFwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIu+8mFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8mVwiIHx8IGMgPT09IFwiOVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIu+8mVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDmo4vorZzjga7nrYvvvIjliJfvvInjgYzjgIwke2N944CN44Gn44GC44KK44CM77yR44Cc77yZ44CN44CMMeOAnDnjgI3jga7jganjgozjgafjgoLjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICB9KShzWzBdKTtcclxuICAgIGNvbnN0IHJvdyA9ICgoYykgPT4ge1xyXG4gICAgICAgIGlmIChjID09PSBcIu+8kVwiIHx8IGMgPT09IFwiMVwiIHx8IGMgPT09IFwi5LiAXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwi5LiAXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77ySXCIgfHwgYyA9PT0gXCIyXCIgfHwgYyA9PT0gXCLkuoxcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLkuoxcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJNcIiB8fCBjID09PSBcIjNcIiB8fCBjID09PSBcIuS4iVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuS4iVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8lFwiIHx8IGMgPT09IFwiNFwiIHx8IGMgPT09IFwi5ZubXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwi5ZubXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yVXCIgfHwgYyA9PT0gXCI1XCIgfHwgYyA9PT0gXCLkupRcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLkupRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJZcIiB8fCBjID09PSBcIjZcIiB8fCBjID09PSBcIuWFrVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuWFrVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID09PSBcIu+8l1wiIHx8IGMgPT09IFwiN1wiIHx8IGMgPT09IFwi5LiDXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwi5LiDXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPT09IFwi77yYXCIgfHwgYyA9PT0gXCI4XCIgfHwgYyA9PT0gXCLlhatcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCLlhatcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA9PT0gXCLvvJlcIiB8fCBjID09PSBcIjlcIiB8fCBjID09PSBcIuS5nVwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuS5nVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDmo4vorZzjga7mrrXvvIjooYzvvInjgYzjgIwke2N944CN44Gn44GC44KK44CM77yR44Cc77yZ44CN44CMMeOAnDnjgI3jgIzkuIDjgJzkuZ3jgI3jga7jganjgozjgafjgoLjgYLjgorjgb7jgZvjgpNgKTtcclxuICAgICAgICB9XHJcbiAgICB9KShzWzFdKTtcclxuICAgIHJldHVybiBbY29sdW1uLCByb3ddO1xyXG59XHJcbmV4cG9ydHMucGFyc2VfY29vcmQgPSBwYXJzZV9jb29yZDtcclxuZnVuY3Rpb24gcGFyc2VfcHJvZmVzc2lvbihzKSB7XHJcbiAgICBpZiAocyA9PT0gXCLppplcIilcclxuICAgICAgICByZXR1cm4gXCLppplcIjtcclxuICAgIGVsc2UgaWYgKHMgPT09IFwi5qGCXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi5qGCXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIumKgFwiKVxyXG4gICAgICAgIHJldHVybiBcIumKgFwiO1xyXG4gICAgZWxzZSBpZiAocyA9PT0gXCLph5FcIilcclxuICAgICAgICByZXR1cm4gXCLph5FcIjtcclxuICAgIGVsc2UgaWYgKHMgPT09IFwi5oiQ6aaZXCIgfHwgcyA9PT0gXCLmnY9cIilcclxuICAgICAgICByZXR1cm4gXCLmiJDppplcIjtcclxuICAgIGVsc2UgaWYgKHMgPT09IFwi5oiQ5qGCXCIgfHwgcyA9PT0gXCLlnK1cIilcclxuICAgICAgICByZXR1cm4gXCLmiJDmoYJcIjtcclxuICAgIGVsc2UgaWYgKHMgPT09IFwi5oiQ6YqAXCIgfHwgcyA9PT0gXCLlhahcIilcclxuICAgICAgICByZXR1cm4gXCLmiJDpioBcIjtcclxuICAgIGVsc2UgaWYgKHMgPT09IFwi44KvXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi44KvXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuODq1wiKVxyXG4gICAgICAgIHJldHVybiBcIuODq1wiO1xyXG4gICAgZWxzZSBpZiAocyA9PT0gXCLjg4pcIilcclxuICAgICAgICByZXR1cm4gXCLjg4pcIjtcclxuICAgIGVsc2UgaWYgKHMgPT09IFwi44OTXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi44OTXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuODnVwiIHx8IHMgPT09IFwi5q2pXCIgfHwgcyA9PT0gXCLlhbVcIilcclxuICAgICAgICByZXR1cm4gXCLjg51cIjtcclxuICAgIGVsc2UgaWYgKHMgPT09IFwi44GoXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi44GoXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIuOCrVwiIHx8IHMgPT09IFwi546LXCIpXHJcbiAgICAgICAgcmV0dXJuIFwi44KtXCI7XHJcbiAgICBlbHNlIGlmIChzID09PSBcIui2hVwiKVxyXG4gICAgICAgIHJldHVybiBcIui2hVwiO1xyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDpp5Ljga7nqK7poZ7jgYzjgIwke3N944CN44Gn44GC44KK44CM6aaZ44CN44CM5qGC44CN44CM6YqA44CN44CM6YeR44CN44CM5oiQ6aaZ44CN44CM5oiQ5qGC44CN44CM5oiQ6YqA44CN44CM5p2P44CN44CM5Zyt44CN44CM5YWo44CN44CM44Kv44CN44CM44Or44CN44CM44OK44CN44CM44OT44CN44CM44Od44CN44CM5q2p44CN44CM5YW144CN44CM44Go44CN44CM44Kt44CN44CM546L44CN44CM6LaF44CN44Gu44Gp44KM44Gn44KC44GC44KK44G+44Gb44KTYCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5wYXJzZV9wcm9mZXNzaW9uID0gcGFyc2VfcHJvZmVzc2lvbjtcclxuZnVuY3Rpb24gcGFyc2Vfb25lKHMpIHtcclxuICAgIGNvbnN0IHsgbW92ZSwgcmVzdCB9ID0gbXVuY2hfb25lKHMpO1xyXG4gICAgaWYgKHJlc3QgIT09IFwiXCIpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOaJi+OAjCR7c33jgI3jga7mnKvlsL7jgavop6Pph4jkuI3og73jgarjgIwke3Jlc3R944CN44GM44GC44KK44G+44GZYCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gbW92ZTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLnBhcnNlX29uZSA9IHBhcnNlX29uZTtcclxuZnVuY3Rpb24gbXVuY2hfb25lKHMpIHtcclxuICAgIC8vIDA6ICAg4payXHJcbiAgICAvLyAxLTI6IO+8l+S6lFxyXG4gICAgLy8gMzog44OdXHJcbiAgICAvLyAoMy00IGlmIHByb21vdGVkKVxyXG4gICAgbGV0IGluZGV4ID0gMDtcclxuICAgIGNvbnN0IHNpZGUgPSBzWzBdID09PSBcIum7klwiIHx8IHNbMF0gPT09IFwi4payXCIgfHwgc1swXSA9PT0gXCLimJdcIiA/IFwi6buSXCIgOlxyXG4gICAgICAgIHNbMF0gPT09IFwi55m9XCIgfHwgc1swXSA9PT0gXCLilrNcIiB8fCBzWzBdID09PSBcIuKYllwiID8gXCLnmb1cIiA6ICgoKSA9PiB7IHRocm93IG5ldyBFcnJvcihcIuaji+itnOOBjOOAjOm7kuOAjeOAjOKWsuOAjeOAjOKYl+OAjeOAjOeZveOAjeOAjOKWs+OAjeOAjOKYluOAjeOBruOBqeOCjOOBi+OBp+Wni+OBvuOBo+OBpuOBhOOBvuOBm+OCk1wiKTsgfSkoKTtcclxuICAgIGluZGV4Kys7XHJcbiAgICBjb25zdCB0byA9IHBhcnNlX2Nvb3JkKHMuc2xpY2UoaW5kZXgsIGluZGV4ICsgMikpO1xyXG4gICAgaW5kZXggKz0gMjtcclxuICAgIGNvbnN0IHByb2Zlc3Npb25fbGVuZ3RoID0gc1szXSA9PT0gXCLmiJBcIiA/IDIgOiAxO1xyXG4gICAgY29uc3QgcHJvZiA9IHBhcnNlX3Byb2Zlc3Npb24ocy5zbGljZShpbmRleCwgaW5kZXggKyBwcm9mZXNzaW9uX2xlbmd0aCkpO1xyXG4gICAgaW5kZXggKz0gcHJvZmVzc2lvbl9sZW5ndGg7XHJcbiAgICAvLyBBbGwgdGhhdCBmb2xsb3dzIGFyZSBvcHRpb25hbC5cclxuICAgIC8vIOS7pemZjeOBr+OCquODl+OCt+ODp+ODiuODq+OAguOAjDEuIOenu+WLleWFg+aYjuiomOOAjeOAjDIuIOaIkOODu+S4jeaIkOOAjeOAjDMuIOeigeefs+OBruW6p+aomeOAjeOBjOOBk+OBrumghueVquOBp+ePvuOCjOOBquOBkeOCjOOBsOOBquOCieOBquOBhOOAglxyXG4gICAgLy8gMS4g56e75YuV5YWD5piO6KiYXHJcbiAgICAvLyDjgIzlj7PjgI3jgIzlt6bjgI3jgIzmiZPjgI3jgIHjgb7jgZ/jga/jgIzvvIg05LqU77yJ44CN44Gq44GpXHJcbiAgICBjb25zdCBmcm9tID0gKCgpID0+IHtcclxuICAgICAgICBpZiAoc1tpbmRleF0gPT09IFwi5Y+zXCIpIHtcclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgcmV0dXJuIFwi5Y+zXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHNbaW5kZXhdID09PSBcIuW3plwiKSB7XHJcbiAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgIHJldHVybiBcIuW3plwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzW2luZGV4XSA9PT0gXCLmiZNcIikge1xyXG4gICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICByZXR1cm4gXCLmiZNcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoc1tpbmRleF0gPT09IFwiKFwiIHx8IHNbaW5kZXhdID09PSBcIu+8iFwiKSB7XHJcbiAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gcGFyc2VfY29vcmQocy5zbGljZShpbmRleCwgaW5kZXggKyAyKSk7XHJcbiAgICAgICAgICAgIGluZGV4ICs9IDI7XHJcbiAgICAgICAgICAgIGlmIChzW2luZGV4XSA9PT0gXCIpXCIgfHwgc1tpbmRleF0gPT09IFwi77yJXCIpIHtcclxuICAgICAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29vcmQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYOmWi+OBjeOCq+ODg+OCs+OBqOW6p+aomeOBruW+jOOBq+mWieOBmOOCq+ODg+OCs+OBjOOBguOCiuOBvuOBm+OCk2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9KSgpO1xyXG4gICAgY29uc3QgcHJvbW90ZXMgPSAoKCkgPT4ge1xyXG4gICAgICAgIGlmIChzW2luZGV4XSA9PT0gXCLmiJBcIikge1xyXG4gICAgICAgICAgICBpbmRleCsrO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAocy5zbGljZShpbmRleCwgaW5kZXggKyAyKSA9PT0gXCLkuI3miJBcIikge1xyXG4gICAgICAgICAgICBpbmRleCArPSAyO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9KSgpO1xyXG4gICAgY29uc3QgW3N0b25lX3RvLCByZXN0XSA9ICgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYyA9IHNbaW5kZXhdO1xyXG4gICAgICAgIGlmICghYylcclxuICAgICAgICAgICAgcmV0dXJuIFtudWxsLCBcIlwiXTtcclxuICAgICAgICBpZiAoKFwiMVwiIDw9IGMgJiYgYyA8PSBcIjlcIikgfHwgKFwi77yRXCIgPD0gYyAmJiBjIDw9IFwi77yZXCIpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvb3JkID0gcGFyc2VfY29vcmQocy5zbGljZShpbmRleCwgaW5kZXggKyAyKSk7XHJcbiAgICAgICAgICAgIGluZGV4ICs9IDI7XHJcbiAgICAgICAgICAgIGlmICghc1tpbmRleF0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbY29vcmQsIFwiXCJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtjb29yZCwgcy5zbGljZShpbmRleCldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gW251bGwsIHMuc2xpY2UoaW5kZXgpXTtcclxuICAgICAgICB9XHJcbiAgICB9KSgpO1xyXG4gICAgY29uc3QgcGllY2VfcGhhc2UgPSBwcm9tb3RlcyAhPT0gbnVsbCA/IChmcm9tID8geyBzaWRlLCB0bywgcHJvZiwgcHJvbW90ZXMsIGZyb20gfSA6IHsgc2lkZSwgdG8sIHByb2YsIHByb21vdGVzIH0pXHJcbiAgICAgICAgOiAoZnJvbSA/IHsgc2lkZSwgdG8sIHByb2YsIGZyb20gfSA6IHsgc2lkZSwgdG8sIHByb2YgfSk7XHJcbiAgICBjb25zdCBtb3ZlID0gc3RvbmVfdG8gPyB7IHBpZWNlX3BoYXNlLCBzdG9uZV90byB9IDogeyBwaWVjZV9waGFzZSB9O1xyXG4gICAgcmV0dXJuIHsgbW92ZSwgcmVzdCB9O1xyXG59XHJcbmV4cG9ydHMubXVuY2hfb25lID0gbXVuY2hfb25lO1xyXG5mdW5jdGlvbiBwYXJzZShzKSB7XHJcbiAgICBzID0gcy5yZXBsYWNlKC8oW+m7kuKWsuKYl+eZveKWs+KYll0pL2csIFwiICQxXCIpO1xyXG4gICAgY29uc3QgbW92ZXMgPSBzLnNwbGl0KC9cXHMvKTtcclxuICAgIHJldHVybiBtb3Zlcy5tYXAocyA9PiBzLnRyaW0oKSkuZmlsdGVyKHMgPT4gcyAhPT0gXCJcIikubWFwKHBhcnNlX29uZSk7XHJcbn1cclxuZXhwb3J0cy5wYXJzZSA9IHBhcnNlO1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3Qgc2hvZ29zc19jb3JlXzEgPSByZXF1aXJlKFwic2hvZ29zcy1jb3JlXCIpO1xyXG5jb25zdCBzaG9nb3NzX2Zyb250ZW5kX2dhbWV0cmVlX3BhcnNlcl8xID0gcmVxdWlyZShcInNob2dvc3MtZnJvbnRlbmQtZ2FtZXRyZWUtcGFyc2VyXCIpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgcmVuZGVyKCgwLCBzaG9nb3NzX2NvcmVfMS5nZXRfaW5pdGlhbF9zdGF0ZSkoXCLpu5JcIikpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkX2hpc3RvcnlcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGxvYWRfaGlzdG9yeSk7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZvcndhcmRcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZvcndhcmQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJiYWNrd2FyZFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgYmFja3dhcmQpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoYW56aV9ibGFja193aGl0ZVwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbG9hZF9oaXN0b3J5KTtcclxufSk7XHJcbmZ1bmN0aW9uIGZvcndhcmQoKSB7XHJcbiAgICBHVUlfc3RhdGUuc2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGlzdG9yeVwiKS52YWx1ZTtcclxuICAgIGNvbnN0IG5ld19oaXN0b3J5ID0gKDAsIHNob2dvc3NfZnJvbnRlbmRfZ2FtZXRyZWVfcGFyc2VyXzEuZm9yd2FyZF9oaXN0b3J5KSh0ZXh0KTtcclxuICAgIGlmIChuZXdfaGlzdG9yeSkge1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGlzdG9yeVwiKS52YWx1ZSA9IG5ld19oaXN0b3J5O1xyXG4gICAgICAgIGxvYWRfaGlzdG9yeSgpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGJhY2t3YXJkKCkge1xyXG4gICAgR1VJX3N0YXRlLnNlbGVjdGVkID0gbnVsbDtcclxuICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpc3RvcnlcIikudmFsdWU7XHJcbiAgICBjb25zdCBuZXdfaGlzdG9yeSA9ICgwLCBzaG9nb3NzX2Zyb250ZW5kX2dhbWV0cmVlX3BhcnNlcl8xLmJhY2t3YXJkX2hpc3RvcnkpKHRleHQpO1xyXG4gICAgaWYgKG5ld19oaXN0b3J5KSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaXN0b3J5XCIpLnZhbHVlID0gbmV3X2hpc3Rvcnk7XHJcbiAgICAgICAgbG9hZF9oaXN0b3J5KCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gbWFpbl8obW92ZXMpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuICgwLCBzaG9nb3NzX2NvcmVfMS5tYWluKShtb3Zlcyk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgRXJyb3IgJiYgZS5tZXNzYWdlID09PSBcIuaji+itnOOBjOepuuOBp+OBmVwiKSB7XHJcbiAgICAgICAgICAgIC8vIOOBqeOBo+OBoeOBi+OBq+OBl+OBpuOBiuOBkeOBsOOBhOOBhFxyXG4gICAgICAgICAgICByZXR1cm4gKDAsIHNob2dvc3NfY29yZV8xLmdldF9pbml0aWFsX3N0YXRlKShcIum7klwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGxvYWRfaGlzdG9yeSgpIHtcclxuICAgIEdVSV9zdGF0ZS5zZWxlY3RlZCA9IG51bGw7XHJcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaXN0b3J5XCIpLnZhbHVlO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmb3J3YXJkXCIpLmRpc2FibGVkID0gKDAsIHNob2dvc3NfZnJvbnRlbmRfZ2FtZXRyZWVfcGFyc2VyXzEuZm9yd2FyZF9oaXN0b3J5KSh0ZXh0KSA9PT0gbnVsbDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYmFja3dhcmRcIikuZGlzYWJsZWQgPSAoMCwgc2hvZ29zc19mcm9udGVuZF9nYW1ldHJlZV9wYXJzZXJfMS5iYWNrd2FyZF9oaXN0b3J5KSh0ZXh0KSA9PT0gbnVsbDtcclxuICAgIGNvbnN0IG1vdmVzID0gKDAsIHNob2dvc3NfZnJvbnRlbmRfZ2FtZXRyZWVfcGFyc2VyXzEucGFyc2VfY3Vyc29yZWQpKHRleHQpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IG1haW5fKG1vdmVzLm1haW4pO1xyXG4gICAgICAgIGNvbnN0IHByZXZpb3VzX3N0YXRlID0gbWFpbl8obW92ZXMubWFpbi5zbGljZSgwLCAtMSkpO1xyXG4gICAgICAgIGlmIChwcmV2aW91c19zdGF0ZS5waGFzZSA9PT0gXCJnYW1lX2VuZFwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInNob3VsZCBub3QgaGFwcGVuXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3RhdGUucGhhc2UgPT09IFwiZ2FtZV9lbmRcIikge1xyXG4gICAgICAgICAgICBhbGVydChg5Yud6ICFOiAke3N0YXRlLnZpY3Rvcn3jgIHnkIbnlLE6ICR7c3RhdGUucmVhc29ufWApO1xyXG4gICAgICAgICAgICByZW5kZXIoc3RhdGUuZmluYWxfc2l0dWF0aW9uLCBwcmV2aW91c19zdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZW5kZXIoc3RhdGUsIHByZXZpb3VzX3N0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGFsZXJ0KGUpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGdldENvbnRlbnRIVE1MRnJvbUVudGl0eShlbnRpdHkpIHtcclxuICAgIGlmIChlbnRpdHkudHlwZSA9PT0gXCLnooFcIilcclxuICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgIGlmIChlbnRpdHkudHlwZSA9PT0gXCLjgrlcIiAmJiBlbnRpdHkucHJvZiAhPT0gXCLjgahcIiAmJiBlbnRpdHkucHJvZiAhPT0gXCLjg51cIikge1xyXG4gICAgICAgIHJldHVybiBgPHNwYW4gc3R5bGU9XCJmb250LXNpemU6IDIwMCVcIj4ke3sg44KtOiBcIuKZlFwiLCDjgq86IFwi4pmVXCIsIOODqzogXCLimZZcIiwg44OTOiBcIuKZl1wiLCDjg4o6IFwi4pmYXCIgfVtlbnRpdHkucHJvZl19PC9zcGFuPmA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZW50aXR5LnByb2Y7XHJcbn1cclxuZnVuY3Rpb24gc2FtZV9lbnRpdHkoZTEsIGUyKSB7XHJcbiAgICBpZiAoIWUyKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIGlmIChlMS5zaWRlICE9PSBlMi5zaWRlKVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIGlmIChlMS50eXBlID09PSBcIueigVwiKSB7XHJcbiAgICAgICAgcmV0dXJuIGUxLnR5cGUgPT09IGUyLnR5cGU7XHJcbiAgICB9XHJcbiAgICBpZiAoZTIudHlwZSA9PT0gXCLnooFcIikge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiBlMS5wcm9mID09PSBlMi5wcm9mO1xyXG59XHJcbmNvbnN0IEdVSV9zdGF0ZSA9IHtcclxuICAgIHNpdHVhdGlvbjogKDAsIHNob2dvc3NfY29yZV8xLmdldF9pbml0aWFsX3N0YXRlKShcIum7klwiKSxcclxuICAgIHNlbGVjdGVkOiBudWxsLFxyXG59O1xyXG5mdW5jdGlvbiBzZWxlY3RfcGllY2Vfb25fYm9hcmQoY29vcmQpIHtcclxuICAgIEdVSV9zdGF0ZS5zZWxlY3RlZCA9IHsgdHlwZTogXCJwaWVjZV9vbl9ib2FyZFwiLCBjb29yZCB9O1xyXG4gICAgcmVuZGVyKEdVSV9zdGF0ZS5zaXR1YXRpb24pO1xyXG59XHJcbmZ1bmN0aW9uIHNlbGVjdF9waWVjZV9pbl9oYW5kKGluZGV4LCBzaWRlKSB7XHJcbiAgICBHVUlfc3RhdGUuc2VsZWN0ZWQgPSB7IHR5cGU6IFwicGllY2VfaW5faGFuZFwiLCBpbmRleCwgc2lkZSB9O1xyXG4gICAgcmVuZGVyKEdVSV9zdGF0ZS5zaXR1YXRpb24pO1xyXG59XHJcbi8vIHByZXZpb3VzX3NpdHVhdGlvbiDjgajjga7lt67liIbjgavjga8gbmV3bHkg44KEIG5ld2x5X3ZhY2F0ZWQg44Go44GE44Gj44GfIENTUyDjgq/jg6njgrnjgpLjgaTjgZHjgabmj4/lhplcclxuLy8g44Gf44Gg44GX44CBR1VJX3N0YXRlLnNlbGVjdGVkIOOBjOOBguOCi+WgtOWQiOOBq+OBr+OAgeW3ruWIhuOBp+OBr+OBquOBj+OBpumBuOOCk+OBoOmnkuOBq+OBpOOBhOOBpuefpeOCiuOBn+OBhOOBr+OBmuOBquOBruOBp+OAgW5ld2x5IOOBruaPj+WGmeOCkuaKkeWItuOBmeOCi1xyXG5mdW5jdGlvbiByZW5kZXIoc2l0dWF0aW9uLCBwcmV2aW91c19zaXR1YXRpb24pIHtcclxuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhhbnppX2JsYWNrX3doaXRlXCIpLmNoZWNrZWQpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpc3RvcnlcIikudmFsdWUgPVxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpc3RvcnlcIikudmFsdWUucmVwbGFjZSgvW+m7kuKWsuKYl10vZywgXCLpu5JcIikucmVwbGFjZSgvW+eZveKWs+KYll0vZywgXCLnmb1cIik7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpc3RvcnlcIikudmFsdWUgPVxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpc3RvcnlcIikudmFsdWUucmVwbGFjZSgvW+m7kuKWsuKYl10vZywgXCLilrJcIikucmVwbGFjZSgvW+eZveKWs+KYll0vZywgXCLilrNcIik7XHJcbiAgICB9XHJcbiAgICBHVUlfc3RhdGUuc2l0dWF0aW9uID0gc2l0dWF0aW9uO1xyXG4gICAgY29uc3QgYm9hcmRfZG9tID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib2FyZFwiKTtcclxuICAgIGJvYXJkX2RvbS5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgY29uc3QgYW5zID0gW107XHJcbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCA5OyByb3crKykge1xyXG4gICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDk7IGNvbCsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVudGl0eSA9IHNpdHVhdGlvbi5ib2FyZFtyb3ddW2NvbF07XHJcbiAgICAgICAgICAgIGlmIChlbnRpdHkgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzX3NpdHVhdGlvbj8uYm9hcmRbcm93XVtjb2xdICYmICFHVUlfc3RhdGUuc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdseV92YWNhdGVkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBuZXdseV92YWNhdGVkLmNsYXNzTGlzdC5hZGQoXCJuZXdseV92YWNhdGVkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld2x5X3ZhY2F0ZWQuc3R5bGUuY3NzVGV4dCA9IGB0b3A6JHs1MCArIHJvdyAqIDUwfXB4OyBsZWZ0OiR7MTAwICsgY29sICogNTB9cHg7YDtcclxuICAgICAgICAgICAgICAgICAgICBhbnMucHVzaChuZXdseV92YWNhdGVkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHJvd18gPSB0b1Nob2dpUm93TmFtZShyb3cpO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xfID0gdG9TaG9naUNvbHVtbk5hbWUoY29sKTtcclxuICAgICAgICAgICAgY29uc3QgaXNfbmV3bHlfdXBkYXRlZCA9IHByZXZpb3VzX3NpdHVhdGlvbiAmJiAhR1VJX3N0YXRlLnNlbGVjdGVkID8gIXNhbWVfZW50aXR5KGVudGl0eSwgcHJldmlvdXNfc2l0dWF0aW9uLmJvYXJkW3Jvd11bY29sXSkgOiBmYWxzZTtcclxuICAgICAgICAgICAgY29uc3QgaXNfc2VsZWN0ZWQgPSBHVUlfc3RhdGUuc2VsZWN0ZWQ/LnR5cGUgPT09IFwicGllY2Vfb25fYm9hcmRcIiA/IEdVSV9zdGF0ZS5zZWxlY3RlZC5jb29yZFsxXSA9PT0gcm93XyAmJiBHVUlfc3RhdGUuc2VsZWN0ZWQuY29vcmRbMF0gPT09IGNvbF8gOiBmYWxzZTtcclxuICAgICAgICAgICAgY29uc3QgcGllY2Vfb3Jfc3RvbmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBwaWVjZV9vcl9zdG9uZS5jbGFzc0xpc3QuYWRkKGVudGl0eS5zaWRlID09PSBcIueZvVwiID8gXCJ3aGl0ZVwiIDogXCJibGFja1wiKTtcclxuICAgICAgICAgICAgaWYgKGlzX25ld2x5X3VwZGF0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHBpZWNlX29yX3N0b25lLmNsYXNzTGlzdC5hZGQoXCJuZXdseVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaXNfc2VsZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHBpZWNlX29yX3N0b25lLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwaWVjZV9vcl9zdG9uZS5zdHlsZS5jc3NUZXh0ID0gYHRvcDokezUwICsgcm93ICogNTB9cHg7IGxlZnQ6JHsxMDAgKyBjb2wgKiA1MH1weDtgO1xyXG4gICAgICAgICAgICBwaWVjZV9vcl9zdG9uZS5pbm5lckhUTUwgPSBnZXRDb250ZW50SFRNTEZyb21FbnRpdHkoZW50aXR5KTtcclxuICAgICAgICAgICAgaWYgKGVudGl0eS50eXBlICE9PSBcIueigVwiKSB7XHJcbiAgICAgICAgICAgICAgICBwaWVjZV9vcl9zdG9uZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gc2VsZWN0X3BpZWNlX29uX2JvYXJkKFtjb2xfLCByb3dfXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFucy5wdXNoKHBpZWNlX29yX3N0b25lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoR1VJX3N0YXRlLnNlbGVjdGVkPy50eXBlID09PSBcInBpZWNlX29uX2JvYXJkXCIpIHtcclxuICAgICAgICBjb25zdCBlbnRpdHlfdGhhdF9tb3ZlcyA9IGdldF9lbnRpdHlfZnJvbV9jb29yZChzaXR1YXRpb24uYm9hcmQsIEdVSV9zdGF0ZS5zZWxlY3RlZC5jb29yZCk7XHJcbiAgICAgICAgaWYgKGVudGl0eV90aGF0X21vdmVzLnR5cGUgPT09IFwi56KBXCIpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwi56KB55+z44GM5YuV44GP44Gv44Ga44GM44Gq44GEXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCA5OyByb3crKykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCA5OyBjb2wrKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgcm93XyA9IHRvU2hvZ2lSb3dOYW1lKHJvdyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xfID0gdG9TaG9naUNvbHVtbk5hbWUoY29sKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvID0gW2NvbF8sIHJvd19dO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbyA9IHsgdG8sIGZyb206IEdVSV9zdGF0ZS5zZWxlY3RlZC5jb29yZCB9O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNfY2FzdGxhYmxlID0gKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAoMCwgc2hvZ29zc19jb3JlXzEudGhyb3dzX2lmX3VuY2FzdGxhYmxlKShzaXR1YXRpb24uYm9hcmQsIG8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc19rdW1hbGFibGUgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICgwLCBzaG9nb3NzX2NvcmVfMS50aHJvd3NfaWZfdW5rdW1hbGFibGUpKHNpdHVhdGlvbi5ib2FyZCwgbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICAgICAgICAgIGlmICgoMCwgc2hvZ29zc19jb3JlXzEuY2FuX21vdmUpKHNpdHVhdGlvbi5ib2FyZCwgbykgfHwgaXNfY2FzdGxhYmxlIHx8IGlzX2t1bWFsYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc3NpYmxlX2Rlc3RpbmF0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBwb3NzaWJsZV9kZXN0aW5hdGlvbi5jbGFzc0xpc3QuYWRkKFwicG9zc2libGVfZGVzdGluYXRpb25cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zc2libGVfZGVzdGluYXRpb24uc3R5bGUuY3NzVGV4dCA9IGB0b3A6JHs1MCArIHJvdyAqIDUwfXB4OyBsZWZ0OiR7MTAwICsgY29sICogNTB9cHg7YDtcclxuICAgICAgICAgICAgICAgICAgICBwb3NzaWJsZV9kZXN0aW5hdGlvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4geyBtb3ZlX3BpZWNlKHRvLCBlbnRpdHlfdGhhdF9tb3Zlcyk7IH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGFucy5wdXNoKHBvc3NpYmxlX2Rlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKEdVSV9zdGF0ZS5zZWxlY3RlZD8udHlwZSA9PT0gXCJwaWVjZV9pbl9oYW5kXCIpIHtcclxuICAgICAgICBjb25zdCBoYW5kID0gR1VJX3N0YXRlLnNlbGVjdGVkLnNpZGUgPT09IFwi55m9XCIgPyBzaXR1YXRpb24uaGFuZF9vZl93aGl0ZSA6IHNpdHVhdGlvbi5oYW5kX29mX2JsYWNrO1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdGVkX3Byb2Zlc3Npb24gPSBoYW5kW0dVSV9zdGF0ZS5zZWxlY3RlZC5pbmRleF07XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgOTsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgOTsgY29sKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvd18gPSB0b1Nob2dpUm93TmFtZShyb3cpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29sXyA9IHRvU2hvZ2lDb2x1bW5OYW1lKGNvbCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0byA9IFtjb2xfLCByb3dfXTtcclxuICAgICAgICAgICAgICAgIGlmIChnZXRfZW50aXR5X2Zyb21fY29vcmQoc2l0dWF0aW9uLmJvYXJkLCB0bykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8g6aeS44GM44GC44KL5aC05omA44Gr44Gv5omT44Gm44Gq44GEXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoKDAsIHNob2dvc3NfY29yZV8xLmVudHJ5X2lzX2ZvcmJpZGRlbikoc2VsZWN0ZWRfcHJvZmVzc2lvbiwgR1VJX3N0YXRlLnNlbGVjdGVkLnNpZGUsIHRvKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyDmoYLppqzjgajpppnou4rjga/miZPjgabjgovloLTmiYDjgYzpmZDjgonjgozjgotcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNpZGUgPSBHVUlfc3RhdGUuc2VsZWN0ZWQuc2lkZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvc3NpYmxlX2Rlc3RpbmF0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIHBvc3NpYmxlX2Rlc3RpbmF0aW9uLmNsYXNzTGlzdC5hZGQoXCJwb3NzaWJsZV9kZXN0aW5hdGlvblwiKTtcclxuICAgICAgICAgICAgICAgIHBvc3NpYmxlX2Rlc3RpbmF0aW9uLnN0eWxlLmNzc1RleHQgPSBgdG9wOiR7NTAgKyByb3cgKiA1MH1weDsgbGVmdDokezEwMCArIGNvbCAqIDUwfXB4O2A7XHJcbiAgICAgICAgICAgICAgICBwb3NzaWJsZV9kZXN0aW5hdGlvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gcGFyYWNodXRlKHRvLCBzZWxlY3RlZF9wcm9mZXNzaW9uLCBzaWRlKSk7XHJcbiAgICAgICAgICAgICAgICBhbnMucHVzaChwb3NzaWJsZV9kZXN0aW5hdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChHVUlfc3RhdGUuc2VsZWN0ZWQ/LnR5cGUgPT09IFwic3RvbmVfaW5faGFuZFwiKSB7XHJcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgOTsgcm93KyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgOTsgY29sKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvd18gPSB0b1Nob2dpUm93TmFtZShyb3cpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29sXyA9IHRvU2hvZ2lDb2x1bW5OYW1lKGNvbCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0byA9IFtjb2xfLCByb3dfXTtcclxuICAgICAgICAgICAgICAgIGlmIChnZXRfZW50aXR5X2Zyb21fY29vcmQoc2l0dWF0aW9uLmJvYXJkLCB0bykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTsgLy8g6aeS44GM44GC44KL5aC05omA44Gr44Gv5omT44Gm44Gq44GEXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoISgwLCBzaG9nb3NzX2NvcmVfMS5jYW5fcGxhY2Vfc3RvbmUpKHNpdHVhdGlvbi5ib2FyZCwgR1VJX3N0YXRlLnNlbGVjdGVkLnNpZGUsIHRvKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyDnnYDmiYvnpoHmraLngrnjgpLpmaTlpJbjgZnjgotcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IHNpZGUgPSBHVUlfc3RhdGUuc2VsZWN0ZWQuc2lkZTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvc3NpYmxlX2Rlc3RpbmF0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIHBvc3NpYmxlX2Rlc3RpbmF0aW9uLmNsYXNzTGlzdC5hZGQoXCJwb3NzaWJsZV9kZXN0aW5hdGlvblwiKTtcclxuICAgICAgICAgICAgICAgIHBvc3NpYmxlX2Rlc3RpbmF0aW9uLnN0eWxlLmNzc1RleHQgPSBgdG9wOiR7NTAgKyByb3cgKiA1MH1weDsgbGVmdDokezEwMCArIGNvbCAqIDUwfXB4O2A7XHJcbiAgICAgICAgICAgICAgICBwb3NzaWJsZV9kZXN0aW5hdGlvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4gcGxhY2Vfc3RvbmUodG8sIHNpZGUpKTtcclxuICAgICAgICAgICAgICAgIGFucy5wdXNoKHBvc3NpYmxlX2Rlc3RpbmF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNpdHVhdGlvbi5oYW5kX29mX3doaXRlLmZvckVhY2goKHByb2YsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGllY2VfaW5faGFuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgcGllY2VfaW5faGFuZC5jbGFzc0xpc3QuYWRkKFwid2hpdGVcIik7XHJcbiAgICAgICAgcGllY2VfaW5faGFuZC5zdHlsZS5jc3NUZXh0ID0gYHRvcDokezUwICsgaW5kZXggKiA1MH1weDsgbGVmdDogNDBweDtgO1xyXG4gICAgICAgIHBpZWNlX2luX2hhbmQuaW5uZXJIVE1MID0gcHJvZjtcclxuICAgICAgICBwaWVjZV9pbl9oYW5kLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBzZWxlY3RfcGllY2VfaW5faGFuZChpbmRleCwgXCLnmb1cIikpO1xyXG4gICAgICAgIGNvbnN0IGlzX3NlbGVjdGVkID0gR1VJX3N0YXRlLnNlbGVjdGVkPy50eXBlID09PSBcInBpZWNlX2luX2hhbmRcIiAmJiBHVUlfc3RhdGUuc2VsZWN0ZWQuc2lkZSA9PT0gXCLnmb1cIiAmJiBHVUlfc3RhdGUuc2VsZWN0ZWQuaW5kZXggPT09IGluZGV4O1xyXG4gICAgICAgIGlmIChpc19zZWxlY3RlZCkge1xyXG4gICAgICAgICAgICBwaWVjZV9pbl9oYW5kLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYW5zLnB1c2gocGllY2VfaW5faGFuZCk7XHJcbiAgICB9KTtcclxuICAgIHNpdHVhdGlvbi5oYW5kX29mX2JsYWNrLmZvckVhY2goKHByb2YsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3QgcGllY2VfaW5faGFuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XHJcbiAgICAgICAgcGllY2VfaW5faGFuZC5jbGFzc0xpc3QuYWRkKFwiYmxhY2tcIik7XHJcbiAgICAgICAgcGllY2VfaW5faGFuZC5zdHlsZS5jc3NUZXh0ID0gYHRvcDokezQ1MCAtIGluZGV4ICogNTB9cHg7IGxlZnQ6IDU4NnB4O2A7XHJcbiAgICAgICAgcGllY2VfaW5faGFuZC5pbm5lckhUTUwgPSBwcm9mO1xyXG4gICAgICAgIHBpZWNlX2luX2hhbmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHNlbGVjdF9waWVjZV9pbl9oYW5kKGluZGV4LCBcIum7klwiKSk7XHJcbiAgICAgICAgY29uc3QgaXNfc2VsZWN0ZWQgPSBHVUlfc3RhdGUuc2VsZWN0ZWQ/LnR5cGUgPT09IFwicGllY2VfaW5faGFuZFwiICYmIEdVSV9zdGF0ZS5zZWxlY3RlZC5zaWRlID09PSBcIum7klwiICYmIEdVSV9zdGF0ZS5zZWxlY3RlZC5pbmRleCA9PT0gaW5kZXg7XHJcbiAgICAgICAgaWYgKGlzX3NlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgIHBpZWNlX2luX2hhbmQuY2xhc3NMaXN0LmFkZChcInNlbGVjdGVkXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhbnMucHVzaChwaWVjZV9pbl9oYW5kKTtcclxuICAgIH0pO1xyXG4gICAgLy8g5qOL6K2c44Gu5pyA5b6M44GM6Ieq5YiG44Gu5YuV44GN44Gn57WC44KP44Gj44Gm44GE44KL44Gq44KJ44CB56KB55+z44KS572u44GP44Kq44OX44K344On44Oz44KS6KGo56S644GZ44KLXHJcbiAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaXN0b3J5XCIpLnZhbHVlO1xyXG4gICAgY29uc3QgbW92ZXMgPSAoMCwgc2hvZ29zc19mcm9udGVuZF9nYW1ldHJlZV9wYXJzZXJfMS5wYXJzZV9jdXJzb3JlZCkodGV4dCk7XHJcbiAgICBjb25zdCBmaW5hbF9tb3ZlID0gbW92ZXMubWFpblttb3Zlcy5tYWluLmxlbmd0aCAtIDFdO1xyXG4gICAgaWYgKGZpbmFsX21vdmUgJiYgIWZpbmFsX21vdmUuc3RvbmVfdG8pIHtcclxuICAgICAgICBpZiAoZmluYWxfbW92ZS5waWVjZV9waGFzZS5zaWRlID09PSBcIueZvVwiKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0b25lX2luX2hhbmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBzdG9uZV9pbl9oYW5kLmNsYXNzTGlzdC5hZGQoXCJ3aGl0ZVwiKTtcclxuICAgICAgICAgICAgc3RvbmVfaW5faGFuZC5zdHlsZS5jc3NUZXh0ID0gYHRvcDokezUwIC0gMSAqIDUwfXB4OyBsZWZ0OiA1ODZweDtgO1xyXG4gICAgICAgICAgICBzdG9uZV9pbl9oYW5kLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBzZWxlY3Rfc3RvbmVfaW5faGFuZChcIueZvVwiKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzX3NlbGVjdGVkID0gR1VJX3N0YXRlLnNlbGVjdGVkPy50eXBlID09PSBcInN0b25lX2luX2hhbmRcIiAmJiBHVUlfc3RhdGUuc2VsZWN0ZWQuc2lkZSA9PT0gXCLnmb1cIjtcclxuICAgICAgICAgICAgaWYgKGlzX3NlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICBzdG9uZV9pbl9oYW5kLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhbnMucHVzaChzdG9uZV9pbl9oYW5kKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN0b25lX2luX2hhbmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBzdG9uZV9pbl9oYW5kLmNsYXNzTGlzdC5hZGQoXCJibGFja1wiKTtcclxuICAgICAgICAgICAgc3RvbmVfaW5faGFuZC5zdHlsZS5jc3NUZXh0ID0gYHRvcDokezQ1MCArIDEgKiA1MH1weDsgbGVmdDogNDBweDtgO1xyXG4gICAgICAgICAgICBzdG9uZV9pbl9oYW5kLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBzZWxlY3Rfc3RvbmVfaW5faGFuZChcIum7klwiKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzX3NlbGVjdGVkID0gR1VJX3N0YXRlLnNlbGVjdGVkPy50eXBlID09PSBcInN0b25lX2luX2hhbmRcIiAmJiBHVUlfc3RhdGUuc2VsZWN0ZWQuc2lkZSA9PT0gXCLpu5JcIjtcclxuICAgICAgICAgICAgaWYgKGlzX3NlbGVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICBzdG9uZV9pbl9oYW5kLmNsYXNzTGlzdC5hZGQoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhbnMucHVzaChzdG9uZV9pbl9oYW5kKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBib2FyZF9kb20uYXBwZW5kKC4uLmFucyk7XHJcbn1cclxuZnVuY3Rpb24gc2VsZWN0X3N0b25lX2luX2hhbmQoc2lkZSkge1xyXG4gICAgR1VJX3N0YXRlLnNlbGVjdGVkID0geyB0eXBlOiBcInN0b25lX2luX2hhbmRcIiwgc2lkZSB9O1xyXG4gICAgcmVuZGVyKEdVSV9zdGF0ZS5zaXR1YXRpb24pO1xyXG59XHJcbmZ1bmN0aW9uIGdldF9lbnRpdHlfZnJvbV9jb29yZChib2FyZCwgY29vcmQpIHtcclxuICAgIGNvbnN0IFtjb2x1bW4sIHJvd10gPSBjb29yZDtcclxuICAgIGNvbnN0IHJvd19pbmRleCA9IFwi5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdXCIuaW5kZXhPZihyb3cpO1xyXG4gICAgY29uc3QgY29sdW1uX2luZGV4ID0gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIi5pbmRleE9mKGNvbHVtbik7XHJcbiAgICBpZiAocm93X2luZGV4ID09PSAtMSB8fCBjb2x1bW5faW5kZXggPT09IC0xKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDkuI3mraPjgarluqfmqJnjgafjgZlgKTtcclxuICAgIH1cclxuICAgIHJldHVybiAoYm9hcmRbcm93X2luZGV4XT8uW2NvbHVtbl9pbmRleF0pID8/IG51bGw7XHJcbn1cclxuZnVuY3Rpb24gcGxhY2Vfc3RvbmUodG8sIHNpZGUpIHtcclxuICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJoaXN0b3J5XCIpLnZhbHVlO1xyXG4gICAgY29uc3QgbW92ZXMgPSAoMCwgc2hvZ29zc19mcm9udGVuZF9nYW1ldHJlZV9wYXJzZXJfMS5wYXJzZV9jdXJzb3JlZCkodGV4dCk7XHJcbiAgICBpZiAobW92ZXMudW5ldmFsdWF0ZWQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGlmICghY29uZmlybShcIuS7pemZjeOBruWxgOmdouOBjOegtOajhOOBleOCjOOBvuOBmeOAguOCiOOCjeOBl+OBhOOBp+OBmeOBi++8n++8iOWwhuadpeeahOOBq+OBr+OAgeWxgOmdouOCkuegtOajhOOBm+OBmuWIhuWykOOBmeOCi+apn+iDveOCkui2s+OBl+OBn+OBhOOBqOaAneOBo+OBpuOBhOOBvuOBme+8iVwiKSkge1xyXG4gICAgICAgICAgICBHVUlfc3RhdGUuc2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgICAgICAgICByZW5kZXIoR1VJX3N0YXRlLnNpdHVhdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHRleHQgPSAoMCwgc2hvZ29zc19mcm9udGVuZF9nYW1ldHJlZV9wYXJzZXJfMS50YWtlX3VudGlsX2ZpcnN0X2N1cnNvcikodGV4dCk7XHJcbiAgICB0ZXh0ID0gdGV4dC50cmltRW5kKCk7XHJcbiAgICBjb25zdCBzdG9uZV9jb29yZCA9IGAke3RvWzBdfSR7dG9bMV19YDtcclxuICAgIC8vIOeEoeeQhuOBquaJi+OCkuaMh+OBl+OBn+aZguOBq+iQveOBqOOBmVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBtYWluXygoMCwgc2hvZ29zc19mcm9udGVuZF9nYW1ldHJlZV9wYXJzZXJfMS5wYXJzZV9jdXJzb3JlZCkodGV4dCArIHN0b25lX2Nvb3JkKS5tYWluKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgYWxlcnQoZSk7XHJcbiAgICAgICAgR1VJX3N0YXRlLnNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICByZW5kZXIoR1VJX3N0YXRlLnNpdHVhdGlvbik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGV4dCA9IHRleHQudHJpbUVuZCgpO1xyXG4gICAgdGV4dCArPSBzdG9uZV9jb29yZDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGlzdG9yeVwiKS52YWx1ZSA9IHRleHQ7XHJcbiAgICBsb2FkX2hpc3RvcnkoKTtcclxuICAgIHJldHVybiB0ZXh0O1xyXG59XHJcbmZ1bmN0aW9uIHBhcmFjaHV0ZSh0bywgcHJvZiwgc2lkZSkge1xyXG4gICAgbGV0IHRleHQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpc3RvcnlcIikudmFsdWU7XHJcbiAgICBjb25zdCBtb3ZlcyA9ICgwLCBzaG9nb3NzX2Zyb250ZW5kX2dhbWV0cmVlX3BhcnNlcl8xLnBhcnNlX2N1cnNvcmVkKSh0ZXh0KTtcclxuICAgIGlmIChtb3Zlcy51bmV2YWx1YXRlZC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgaWYgKCFjb25maXJtKFwi5Lul6ZmN44Gu5bGA6Z2i44GM56C05qOE44GV44KM44G+44GZ44CC44KI44KN44GX44GE44Gn44GZ44GL77yf77yI5bCG5p2l55qE44Gr44Gv44CB5bGA6Z2i44KS56C05qOE44Gb44Ga5YiG5bKQ44GZ44KL5qmf6IO944KS6Laz44GX44Gf44GE44Go5oCd44Gj44Gm44GE44G+44GZ77yJXCIpKSB7XHJcbiAgICAgICAgICAgIEdVSV9zdGF0ZS5zZWxlY3RlZCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJlbmRlcihHVUlfc3RhdGUuc2l0dWF0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGV4dCA9ICgwLCBzaG9nb3NzX2Zyb250ZW5kX2dhbWV0cmVlX3BhcnNlcl8xLnRha2VfdW50aWxfZmlyc3RfY3Vyc29yKSh0ZXh0KTtcclxuICAgIGNvbnN0IGZyb21fdHh0ID0gXCLmiZNcIjtcclxuICAgIGNvbnN0IGZ1bGxfbm90YXRpb24gPSBgJHtzaWRlID09PSBcIum7klwiID8gXCLilrJcIiA6IFwi4pazXCJ9JHt0b1swXX0ke3RvWzFdfSR7cHJvZn0ke2Zyb21fdHh0fWA7XHJcbiAgICAvLyDnhKHnkIbjgarmiYvjgpLmjIfjgZfjgZ/mmYLjgavokL3jgajjgZlcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbWFpbl8oKDAsIHNob2dvc3NfZnJvbnRlbmRfZ2FtZXRyZWVfcGFyc2VyXzEucGFyc2VfY3Vyc29yZWQpKHRleHQgKyBmdWxsX25vdGF0aW9uKS5tYWluKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgYWxlcnQoZSk7XHJcbiAgICAgICAgR1VJX3N0YXRlLnNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICByZW5kZXIoR1VJX3N0YXRlLnNpdHVhdGlvbik7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbG9vc2Vfbm90YXRpb24gPSBgJHtzaWRlID09PSBcIum7klwiID8gXCLilrJcIiA6IFwi4pazXCJ9JHt0b1swXX0ke3RvWzFdfSR7cHJvZn1gO1xyXG4gICAgLy8g5puW5pin5oCn44GM5Ye644Gq44GE44Go44GN44Gr44GvIGZyb20g44KS5pu444GL44Ga44Gr6YCa44GZXHJcbiAgICB0cnkge1xyXG4gICAgICAgIG1haW5fKCgwLCBzaG9nb3NzX2Zyb250ZW5kX2dhbWV0cmVlX3BhcnNlcl8xLnBhcnNlX2N1cnNvcmVkKSh0ZXh0ICsgbG9vc2Vfbm90YXRpb24pLm1haW4pO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAvLyDmm5bmmKfmgKfjgYzlh7rjgZ9cclxuICAgICAgICB0ZXh0ID0gYXBwZW5kX2FuZF9sb2FkKGZ1bGxfbm90YXRpb24sIHRleHQpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIOabluaYp+aAp+OBjOeEoeOBhOOBruOBpyBmcm9tIOOCkuabuOOBi+OBmuOBq+mAmuOBmVxyXG4gICAgdGV4dCA9IGFwcGVuZF9hbmRfbG9hZChsb29zZV9ub3RhdGlvbiwgdGV4dCk7XHJcbiAgICByZXR1cm47XHJcbn1cclxuZnVuY3Rpb24gYXBwZW5kX2FuZF9sb2FkKG5vdGF0aW9uLCB0ZXh0KSB7XHJcbiAgICB0ZXh0ID0gdGV4dC50cmltRW5kKCk7XHJcbiAgICB0ZXh0ICs9ICh0ZXh0ID8gXCLjgIBcIiA6IFwiXCIpICsgbm90YXRpb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImhpc3RvcnlcIikudmFsdWUgPSB0ZXh0O1xyXG4gICAgbG9hZF9oaXN0b3J5KCk7XHJcbiAgICByZXR1cm4gdGV4dDtcclxufVxyXG5mdW5jdGlvbiBtb3ZlX3BpZWNlKHRvLCBlbnRpdHlfdGhhdF9tb3Zlcykge1xyXG4gICAgaWYgKEdVSV9zdGF0ZS5zZWxlY3RlZD8udHlwZSAhPT0gXCJwaWVjZV9vbl9ib2FyZFwiKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2hvdWxkIG5vdCBoYXBwZW5cIik7XHJcbiAgICB9XHJcbiAgICBsZXQgdGV4dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaGlzdG9yeVwiKS52YWx1ZTtcclxuICAgIGNvbnN0IG1vdmVzID0gKDAsIHNob2dvc3NfZnJvbnRlbmRfZ2FtZXRyZWVfcGFyc2VyXzEucGFyc2VfY3Vyc29yZWQpKHRleHQpO1xyXG4gICAgaWYgKG1vdmVzLnVuZXZhbHVhdGVkLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBpZiAoIWNvbmZpcm0oXCLku6XpmY3jga7lsYDpnaLjgYznoLTmo4TjgZXjgozjgb7jgZnjgILjgojjgo3jgZfjgYTjgafjgZnjgYvvvJ/vvIjlsIbmnaXnmoTjgavjga/jgIHlsYDpnaLjgpLnoLTmo4TjgZvjgZrliIblspDjgZnjgovmqZ/og73jgpLotrPjgZfjgZ/jgYTjgajmgJ3jgaPjgabjgYTjgb7jgZnvvIlcIikpIHtcclxuICAgICAgICAgICAgR1VJX3N0YXRlLnNlbGVjdGVkID0gbnVsbDtcclxuICAgICAgICAgICAgcmVuZGVyKEdVSV9zdGF0ZS5zaXR1YXRpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB0ZXh0ID0gKDAsIHNob2dvc3NfZnJvbnRlbmRfZ2FtZXRyZWVfcGFyc2VyXzEudGFrZV91bnRpbF9maXJzdF9jdXJzb3IpKHRleHQpO1xyXG4gICAgY29uc3QgZnJvbSA9IEdVSV9zdGF0ZS5zZWxlY3RlZC5jb29yZDtcclxuICAgIGNvbnN0IGZyb21fdHh0ID0gYCR7ZnJvbVswXX0ke2Zyb21bMV19YDtcclxuICAgIGNvbnN0IGZ1bGxfbm90YXRpb24gPSBgJHtlbnRpdHlfdGhhdF9tb3Zlcy5zaWRlID09PSBcIum7klwiID8gXCLilrJcIiA6IFwi4pazXCJ9JHt0b1swXX0ke3RvWzFdfSR7ZW50aXR5X3RoYXRfbW92ZXMucHJvZn0oJHtmcm9tX3R4dH0pYDtcclxuICAgIC8vIOeEoeeQhuOBquaJi+OCkuaMh+OBl+OBn+aZguOBq+iQveOBqOOBmVxyXG4gICAgdHJ5IHtcclxuICAgICAgICBtYWluXygoMCwgc2hvZ29zc19mcm9udGVuZF9nYW1ldHJlZV9wYXJzZXJfMS5wYXJzZV9jdXJzb3JlZCkodGV4dCArIGZ1bGxfbm90YXRpb24pLm1haW4pO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBhbGVydChlKTtcclxuICAgICAgICBHVUlfc3RhdGUuc2VsZWN0ZWQgPSBudWxsO1xyXG4gICAgICAgIHJlbmRlcihHVUlfc3RhdGUuc2l0dWF0aW9uKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBsb29zZV9ub3RhdGlvbiA9IGAke2VudGl0eV90aGF0X21vdmVzLnNpZGUgPT09IFwi6buSXCIgPyBcIuKWslwiIDogXCLilrNcIn0ke3RvWzBdfSR7dG9bMV19JHtlbnRpdHlfdGhhdF9tb3Zlcy5wcm9mfWA7XHJcbiAgICAvLyDmm5bmmKfmgKfjgYzlh7rjgarjgYTjgajjgY3jgavjga8gZnJvbSDjgpLmm7jjgYvjgZrjgavpgJrjgZlcclxuICAgIHRyeSB7XHJcbiAgICAgICAgbWFpbl8oKDAsIHNob2dvc3NfZnJvbnRlbmRfZ2FtZXRyZWVfcGFyc2VyXzEucGFyc2VfY3Vyc29yZWQpKHRleHQgKyBsb29zZV9ub3RhdGlvbikubWFpbik7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIC8vIOabluaYp+aAp+OBjOWHuuOBn1xyXG4gICAgICAgIHRleHQgPSBhcHBlbmRfYW5kX2xvYWQoZnVsbF9ub3RhdGlvbiwgdGV4dCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy8g5puW5pin5oCn44GM54Sh44GE44Gu44GnIGZyb20g44KS5pu444GL44Ga44Gr6YCa44GZXHJcbiAgICAvLyDjgZ/jgaDjgZfjgIHjgZPjgZPjgafjgIzkuozjg53jga7lj6/og73mgKfjga/nhKHoppbjgZfjgabmm5bmmKfmgKfjgpLogIPjgYjjgovjgI3jgajjgYTjgYbku5Xmp5jjgYzniZnjgpLjgoDjgY9cclxuICAgIGlmIChlbnRpdHlfdGhhdF9tb3Zlcy5wcm9mICE9PSBcIuODnVwiKSB7XHJcbiAgICAgICAgdGV4dCA9IGFwcGVuZF9hbmRfbG9hZChsb29zZV9ub3RhdGlvbiwgdGV4dCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbG9vc2UgPSBtYWluXygoMCwgc2hvZ29zc19mcm9udGVuZF9nYW1ldHJlZV9wYXJzZXJfMS5wYXJzZV9jdXJzb3JlZCkodGV4dCArIGxvb3NlX25vdGF0aW9uKS5tYWluKTtcclxuICAgICAgICBjb25zdCBmdWxsID0gbWFpbl8oKDAsIHNob2dvc3NfZnJvbnRlbmRfZ2FtZXRyZWVfcGFyc2VyXzEucGFyc2VfY3Vyc29yZWQpKHRleHQgKyBmdWxsX25vdGF0aW9uKS5tYWluKTtcclxuICAgICAgICAvLyBsb29zZSDjgafop6Pph4jjgZnjgovjgajkuozjg53jgYzlm57pgb/jgafjgY3jgovjgYzjgIFmdWxsIOOBp+ino+mHiOOBmeOCi+OBqOS6jOODneOBp+OBguOBo+OBpuOCsuODvOODoOOBjOe1guS6huOBmeOCi+OBqOOBjVxyXG4gICAgICAgIC8vIOOBk+OCjOOBr+OAjOS6jOODneOBp+OBmeOAjeOCkuefpeOCieOBm+OCi+OBn+OCgeOBq+Wni+eCueaYjuiomOOBjOW/heimgVxyXG4gICAgICAgIGlmIChsb29zZS5waGFzZSA9PT0gXCJyZXNvbHZlZFwiICYmIGZ1bGwucGhhc2UgPT09IFwiZ2FtZV9lbmRcIikge1xyXG4gICAgICAgICAgICB0ZXh0ID0gYXBwZW5kX2FuZF9sb2FkKGZ1bGxfbm90YXRpb24sIHRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGxvb3NlLnBoYXNlID09PSBcInJlc29sdmVkXCIgJiYgZnVsbC5waGFzZSA9PT0gXCJyZXNvbHZlZFwiKSB7XHJcbiAgICAgICAgICAgIC8vIOenu+WLleOBl+OBn+ODneODvOODs+OBjOWNs+W6p+OBq+eigeOBp+WPluOCieOCjOOBpuS6jOODneOBjOino+a2iOOBmeOCi+ODkeOCv+ODvOODs+OBruWgtOWQiOOBq+OBr+OAgeOAjOebtOmAsuOAjeOBqOOBruertuWQiOOBjOeZuueUn+OBmeOCi+OBk+OBqOOBr+OBquOBhFxyXG4gICAgICAgICAgICAvLyDjgZfjgZ/jgYzjgaPjgabjgIHjgZPjga7loLTlkIjjga/nm7TpgLLjgpLmjqHnlKjjgZfjgabllY/poYzjgarjgYTjga/jgZpcclxuICAgICAgICAgICAgdGV4dCA9IGFwcGVuZF9hbmRfbG9hZChsb29zZV9ub3RhdGlvbiwgdGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIOOCguOBhuOCiOOBj+OCj+OBi+OCk+OBquOBhOOBi+OCiSBmdWxsIG5vdGF0aW9uIOOBp+abuOOBhOOBpuOBiuOBjeOBvuOBmVxyXG4gICAgICAgICAgICB0ZXh0ID0gYXBwZW5kX2FuZF9sb2FkKGZ1bGxfbm90YXRpb24sIHRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB0b1Nob2dpUm93TmFtZShuKSB7XHJcbiAgICByZXR1cm4gXCLkuIDkuozkuInlm5vkupTlha3kuIPlhavkuZ1cIltuXTtcclxufVxyXG5mdW5jdGlvbiB0b1Nob2dpQ29sdW1uTmFtZShuKSB7XHJcbiAgICByZXR1cm4gXCLvvJnvvJjvvJfvvJbvvJXvvJTvvJPvvJLvvJFcIltuXTtcclxufVxyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=