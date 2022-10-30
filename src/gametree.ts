import { Move } from "shogoss-core";
import { munch_one } from "shogoss-parser";

type GameTree<T> = { main: T[], unevaluated: T[] };

type Token = { type: "spaces", str: string } | { type: "move", str: string, move: Move } | { type: "{|", str: "{|" } | { type: "}", str: "}" };

export function tokenize(s: string): Token[] {
	const ans: Token[] = [];
	while (true) {
		if (s.startsWith("{|")) {
			s = s.slice("{|".length);
			ans.push({ type: "{|", str: "{|" });
		} else if (s.startsWith("}")) {
			s = s.slice("}".length);
			ans.push({ type: "}", str: "}" });
		} else if (s !== s.trimStart()) {
			ans.push({ type: "spaces", str: s.slice(0, s.length - s.trimStart().length) });
			s = s.trimStart();
		} else if (s === "") { return ans; } else {
			const { move, rest } = munch_one(s);
			ans.push({ type: "move", move, str: s.slice(0, s.length - rest.length) });
			s = rest;
		}
	}
}

export function parse_cursored(s: string): GameTree<Move> {
	const tokens = tokenize(s);
	let ind = 0;
	const ans: GameTree<Move> = { main: [], unevaluated: [] };
	while (true) {
		const tok = tokens[ind];
		if (!tok) {
			return ans;
		}
		if (tok.type === "{|") {
			ind++;
			while (true) {
				const tok = tokens[ind];
				if (!tok) {
					throw new Error("{| に対応する } がありません");
				}
				if (tok.type === "}") {
					return ans;
				} else if (tok.type === "move") {
					const move = tok.move;
					ans.unevaluated.push(move);
					ind++;
				} else if (tok.type === "spaces") {
					ind++;
					continue;
				}
			}
		} else if (tok.type === "move") {
			ind++;
			ans.main.push(tok.move)
		} else if (tok.type === "spaces") {
			ind++;
			continue;
		}
	}
}

export function forward_history(original_s: string): string | null {
	const tokens = tokenize(original_s);
	let ind = 0;
	let s = original_s;
	// n 手分をパース
	while (true) {
		const tok = tokens[ind]?.type === "spaces" ? tokens[++ind] : tokens[ind];

		// {| に遭遇したら、
		if (tok?.type === "{|") {
			const till_nth = tokens.slice(0, ind);
			// {| を読み飛ばし、
			ind++;

			// スペースを保全して
			const start_of_space = ind;
			const tok = tokens[ind]?.type === "spaces" ? tokens[++ind] : tokens[ind];

			// 1 手分をパース。1 手も残ってないなら、それはそれ以上 forward できないので null を返す
			if (tok?.type === "}") { return null; }
			ind++;
			const end_of_space_and_move = ind;
			if (tokens[ind]?.type === "spaces") ++ind;
			const end_of_space_and_move_and_space = ind;
			const new_tokens: Token[] = [
				...till_nth,
				...tokens.slice(start_of_space, end_of_space_and_move),
				...tokens.slice(end_of_space_and_move, end_of_space_and_move_and_space),
				{ type: "{|", str: "{|" },
				...tokens.slice(end_of_space_and_move_and_space)
			];
			return new_tokens.map(a => a.str).join("");
		} else if (!tok) {
			return null; // それ以上 forward できないので null を返す
		}
		ind++;
	}
}

export function backward_history(original_s: string): string | null {
	const tokens = tokenize(original_s);
	let ind = 0;
	const indices = [];
	// n 手分をパース
	while (true) {
		const tok = tokens[ind]?.type === "spaces" ? tokens[++ind] : tokens[ind];

		indices.push(ind);

		if (!tok) {
			// 栞がないので生やす
			const nminus1_end = indices[indices.length - 2];
			const n_end = indices[indices.length - 1];
			if (nminus1_end === undefined || n_end === undefined) {
				return null; // それ以上 backward できないので null を返す
			}
			const new_tokens: Token[] =
				[
					...tokens.slice(0, nminus1_end),
					{ type: "{|", str: "{|" },
					...tokens.slice(nminus1_end, n_end),
					...tokens.slice(n_end),
					{ type: "}", str: "}" }
				];
			return new_tokens.map(a => a.str).join("");
		}

		// {| に遭遇したら、
		if (tok.type === "{|") {
			const nminus1_end = indices[indices.length - 2];
			const n_end = indices[indices.length - 1];
			if (nminus1_end === undefined || n_end === undefined) {
				return null; // それ以上 backward できないので null を返す
			}
			const new_tokens: Token[] = [
				...tokens.slice(0, nminus1_end),
				{ type: "{|", str: "{|" },
				...tokens.slice(nminus1_end, n_end),
				...tokens.slice(n_end + 1)
			];
			return new_tokens.map(a => a.str).join("");
		}

		if (tok.type === "move") {
			ind++;
		}
	}
}
