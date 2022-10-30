import { Move } from "shogoss-core";
import { munch_one } from "shogoss-parser";

// 将来的には type GameTree<T> = { payload: T, cursor: boolean, children: Tree<T>[] }; とかにしたい
type GameTree<T> = { main: T[], unevaluated: T[] };

export function parse_cursored(s: string): GameTree<Move> {
	const ans: GameTree<Move> = { main: [], unevaluated: [] };
	while (true) {
		s = s.trimStart();
		if (s.startsWith("{|")) {
			s = s.slice(BOOKMARK_LENGTH);
			while (true) {
				s = s.trimStart();
				if (s.startsWith("}")) return ans;
				const { move, rest } = munch_one(s);
				s = rest;
				ans.unevaluated.push(move);
			}
		} else if (s.trimStart() === "") {
			return ans;
		}
		const { move, rest } = munch_one(s);
		s = rest;
		ans.main.push(move);
	}
}

const BOOKMARK_LENGTH = "{|".length;

export function forward_history(original_s: string): string | null {
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
			if (s.startsWith("}")) { return null; }
			const { move: _, rest } = munch_one(s);
			s = rest;
			const end_of_space_and_move = original_s.length - s.length;
			s = s.trimStart();
			const end_of_space_and_move_and_space = original_s.length - s.length;

			return till_nth + original_s.slice(start_of_space, end_of_space_and_move) + original_s.slice(end_of_space_and_move, end_of_space_and_move_and_space) + "{|" + original_s.slice(end_of_space_and_move_and_space);
		} else if (s.trimStart() === "") {
			return null; // それ以上 forward できないので null を返す
		}
		const { move: _, rest } = munch_one(s);
		s = rest;
	}
}

export function take_until_first_cursor(original_s: string): string {
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
		} else if (s.trimStart() === "") {
			return original_s;
		}
		const { move: _, rest } = munch_one(s);
		s = rest;
	}
}

export function backward_history(original_s: string): string | null {
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
		} else if (s.trimStart() === "") {
			// 栞がないので生やす
			const nminus1_end = indices[indices.length - 2];
			const n_end = indices[indices.length - 1];
			if (nminus1_end === undefined || n_end === undefined) {
				return null; // それ以上 backward できないので null を返す
			}
			return original_s.slice(0, nminus1_end) + "{|" + original_s.slice(nminus1_end, n_end) + original_s.slice(n_end) + "}";
		}
		const { move: _, rest } = munch_one(s);
		s = rest;
	}
}
