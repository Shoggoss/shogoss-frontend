import { forward_history, parse_cursored } from "./gametree";

test('parse_cursored', () => {
	expect(parse_cursored(`{|▲７五ポ７四 △３四ナ１四 ▲６五ポ２五 △１一キ１五}`)).toEqual(
		{
			main: [],
			unevaluated: [
				{ "piece_phase": { "side": "黒", "to": ["７", "五"], "prof": "ポ" }, "stone_to": ["７", "四"] },
				{ "piece_phase": { "side": "白", "to": ["３", "四"], "prof": "ナ" }, "stone_to": ["１", "四"] },
				{ "piece_phase": { "side": "黒", "to": ["６", "五"], "prof": "ポ" }, "stone_to": ["２", "五"] },
				{ "piece_phase": { "side": "白", "to": ["１", "一"], "prof": "キ" }, "stone_to": ["１", "五"] },
			]
		}
	);
});

test('parse_cursored', () => {
	expect(parse_cursored(`▲７五ポ７四 △３四ナ１四 ▲６五ポ２五 △１一キ１五`)).toEqual(
		{
			unevaluated: [],
			main: [
				{ "piece_phase": { "side": "黒", "to": ["７", "五"], "prof": "ポ" }, "stone_to": ["７", "四"] },
				{ "piece_phase": { "side": "白", "to": ["３", "四"], "prof": "ナ" }, "stone_to": ["１", "四"] },
				{ "piece_phase": { "side": "黒", "to": ["６", "五"], "prof": "ポ" }, "stone_to": ["２", "五"] },
				{ "piece_phase": { "side": "白", "to": ["１", "一"], "prof": "キ" }, "stone_to": ["１", "五"] },
			]
		}
	);
});

test('forward_history', () => {
	expect(forward_history(`{|▲７五ポ７四 
△３四ナ１四 ▲６五ポ２五 △１一キ１五}`)).toEqual(`▲７五ポ７四 
{|△３四ナ１四 ▲６五ポ２五 △１一キ１五}`);
});

test('forward_history', () => {
	expect(forward_history(`▲７五ポ７四 
{|△３四ナ１四 ▲６五ポ２五 △１一キ１五}`)).toEqual(`▲７五ポ７四 
△３四ナ１四 {|▲６五ポ２五 △１一キ１五}`);
});

test('forward_history', () => {
	expect(forward_history(`▲７五ポ７四 
△３四ナ１四 ▲６五ポ２五 △１一キ１五{|}`)).toEqual(null);
});

test('forward_history', () => {
	expect(forward_history(`▲７五ポ７四 
△３四ナ１四 ▲６五ポ２五 △１一キ１五`)).toEqual(null);
});
