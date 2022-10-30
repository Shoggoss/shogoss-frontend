import { Move } from "shogoss-core";
import { munch_one } from "shogoss-parser";

type GameTree<T> = { main: T[], unevaluated: T[] };

export function parse_cursored(s: string): GameTree<Move> {
	const ans: GameTree<Move> = { main: [], unevaluated: [] };
	while (true) {
		s = s.trimStart();
		if (s.startsWith("{|")) {
			s = s.slice(2);
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