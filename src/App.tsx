import React from 'react';
import { can_move, can_place_stone, ChessEntity, Coordinate, Entity, entry_is_forbidden, KingEntity, ShogiEntity, Side, Situation, throws_if_uncastlable, throws_if_unkumalable, UnpromotedShogiProfession } from "shogoss-core";
import { backward_history, forward_history, parse_cursored, take_until_first_cursor } from "shogoss-frontend-gametree-parser";
import { main_, toShogiColumnName, toShogiRowName, same_entity, get_entity_from_coord } from './Pure'

// import logo from './logo.svg';
import './App.css';

class Background extends React.Component {
  render() {
    const horizontal_lines = Array.from({ length: 10 }, (_, i) => <div
      style={{ top: `${45 + i * 50}px`, left: "95px", height: "2px", width: "452px", backgroundColor: "black", position: "absolute" }}>
    </div>);
    const vertical_lines = Array.from({ length: 10 }, (_, i) => <div
      style={{ top: "45px", left: `${95 + i * 50}px`, height: "452px", width: "2px", backgroundColor: "black", position: "absolute" }}>
    </div>)
    const row_labels = Array.from({ length: 10 }, (_, i) => <div
      style={{ top: `${50 + i * 50}px`, left: "555px", position: "absolute", width: "40px", lineHeight: "40px" }}>{toShogiRowName(i)}
    </div>);
    const column_labels = Array.from({ length: 10 }, (_, i) => <div
      style={{ top: "20px", left: `${100 + i * 50}px`, position: "absolute", width: "40px", textAlign: "center" }}>{toShogiColumnName(i)}
    </div>);
    return [...horizontal_lines, ...vertical_lines, ...column_labels, ...row_labels];
  }
}

interface HistoryProps {
  history: string;
}

class History extends React.Component<{}, HistoryProps> {
  constructor(props: HistoryProps) {
    super(props)
    this.state = {
      history: `{|▲７五ポ７四 
△３四ナ１四 
▲６五ポ２五 
△１一キ１五 
▲４五ポ５六 
△４二ナ１六 
▲９五ポ２四 
△２二銀２六 
▲１六ポ３六 
△３一金３四 
▲１五ポ４四 
△４四ポ３五 
▲４四ポ４五 
△４四ポ左３三 
▲６七ビ４六 
△６五ビ４一 
▲７八銀６六 
△７四ポ２六 
▲７四ポ１六 
△７四ナ４八
▲８五ポ８七 
△５五ポ７七 
▲７七桂 
△６四ポ７九 
▲６五桂５三 
△６五ポ７七 
▲２六ポ５四 
△６六ポ６五 
▲６六ポ６二 
△６六ナ９七 
▲６八ク４三 
△７八ナ８六 
▲７八ビ８九 
△５四ナ７六 
▲７六ナ４二 
△７五ナ６六 
▲４八銀７四 
△９四ポ２七 
▲９四ポ９三 
△９四ナ６七 
▲６七ビ５四
△７五ナ８八 
▲８八ル６三 
△５六ポ７九 
▲５六ビ右 
△６七ナ７八 
▲６七ビ７六 
△８七銀９八 
▲５八ク７三 
△９五ル７五 
▲８四ポ８二 
△９二香５五 
▲８三ポ成８二 
△８三ビ６四 
▲７八金９四 
△９六銀７六 
▲７七金８四 
△７四ビ９一 
▲８六金８七 
△９四香７七 
▲７六ビ８八 
△８五ル８九
▲９六金９二 
△９六香８六 
▲３二銀７二}`};
  }
  render() {
    const history = this.state.history;
    return <textarea id="history" style={{ width: "300px", height: "500px", position: "absolute", left: "660px" }}>{history}</textarea>
  }
}



interface HistoryForwardButtonProps {
  disabled: boolean
}

class HistoryForwardButton extends React.Component<{}, HistoryForwardButtonProps> {
  constructor(props: HistoryForwardButtonProps) {
    super(props);
    this.state = { disabled: false };
  }
  render(): React.ReactNode {
    return <button id="forward" disabled={this.state.disabled} style={{ left: "334px", top: "500px", position: "absolute" }}>一手進む→</button>
  }
}


interface HistoryBackwardButtonProps {
  disabled: boolean
}

class HistoryBackwardButton extends React.Component<{}, HistoryBackwardButtonProps> {
  constructor(props: HistoryBackwardButtonProps) {
    super(props);
    this.state = { disabled: false };
  }
  render(): React.ReactNode {
    return <button id="backward" style={{ left: "228px", top: "500px", position: "absolute" }} disabled={this.state.disabled}>←一手戻る</button>
  }
}

interface BWCheckBoxProps {
  checked: boolean
}

class BWCheckBox extends React.Component<{}, BWCheckBoxProps> {
  constructor(props: HistoryBackwardButtonProps) {
    super(props);
    this.state = { checked: false };
  }
  render(): React.ReactNode {
    return <label style={{ top: "-30px", left: "720px", position: "absolute" }}><input type="checkbox" id="hanzi_black_white" checked={this.state.checked} /> 「黒」「白」で表示</label>
  }
}

interface GameProps {
  history: string;
  bw_checkbox_checked: boolean;
  forward_button_disabled: boolean;
  backward_button_disabled: boolean;
  situation: Situation,
  previous_situation: Situation | null,
  selected: null | { type: "piece_on_board", coord: Coordinate } | { type: "piece_in_hand", index: number, side: Side } | { type: "stone_in_hand", side: Side };
}


function getContentHTMLFromEntity(entity: Entity): JSX.Element {
  if (entity.type === "碁") return <span></span>;
  if (entity.type === "ス" && entity.prof !== "と" && entity.prof !== "ポ") {
    return <span style={{ fontSize: "200%" }}>{
      { キ: "♔", ク: "♕", ル: "♖", ビ: "♗", ナ: "♘" }[entity.prof]
    }</span>;
  }
  return <span>{entity.prof}</span>
}

class Game extends React.Component<{}, GameProps> {
  constructor(props: GameProps) {
    super(props);
    this.state = props;
  }

  load_history() {
    this.setState({ selected: null });
    const text = this.state.history;
    this.setState({ forward_button_disabled: forward_history(text) === null });
    this.setState({ backward_button_disabled: backward_history(text) === null });
    const moves = parse_cursored(text);
    try {
      const state = main_(moves.main);
      const previous_state = main_(moves.main.slice(0, -1));
      if (previous_state.phase === "game_end") {
        throw new Error("should not happen");
      }
      if (state.phase === "game_end") {
        alert(`勝者: ${state.victor}、理由: ${state.reason}`);
        this.setState({ situation: state.final_situation, previous_situation: previous_state });
        this.render();
      } else {
        this.setState({ situation: state, previous_situation: previous_state });
        this.render();
      }
    } catch (e: unknown) {
      alert(e);
    }
  }

  select_piece_on_board(coord: Coordinate) {
    this.setState({ selected: { type: "piece_on_board", coord } });
    this.setState({ previous_situation: null });
    this.render();
  }

  append_and_load(notation: string, text: string) {
    text = text.trimEnd();
    text += (text ? "　" : "") + notation;
    this.setState({ history: text });
    this.load_history();
    return text;
  }

  move_piece(to: Coordinate, entity_that_moves: ShogiEntity | ChessEntity | KingEntity) {
    if (this.state.selected?.type !== "piece_on_board") {
      throw new Error("should not happen");
    }

    let text = this.state.history;
    const moves = parse_cursored(text);
    if (moves.unevaluated.length > 0) {
      if (!window.confirm("以降の局面が破棄されます。よろしいですか？（将来的には、局面を破棄せず分岐する機能を足したいと思っています）")) {
        this.setState({ selected: null });
        this.setState({ previous_situation: null });
        this.render();
        return null;
      }
    }
    text = take_until_first_cursor(text);
    const from: Coordinate = this.state.selected.coord;

    const from_txt = `${from[0]}${from[1]}`;
    const full_notation = `${entity_that_moves.side === "黒" ? "▲" : "△"}${to[0]}${to[1]}${entity_that_moves.prof}(${from_txt})`;

    // 無理な手を指した時に落とす
    try {
      main_(parse_cursored(text + full_notation).main);
    } catch (e) {
      alert(e);
      this.setState({ selected: null });
      this.setState({ previous_situation: null });
      this.render();
      return;
    }

    const loose_notation = `${entity_that_moves.side === "黒" ? "▲" : "△"}${to[0]}${to[1]}${entity_that_moves.prof}`;

    // 曖昧性が出ないときには from を書かずに通す
    try {
      main_(parse_cursored(text + loose_notation).main);
    } catch (e) {
      // 曖昧性が出た
      text = this.append_and_load(full_notation, text);
      return;
    }

    // 曖昧性が無いので from を書かずに通す
    // ただし、ここで「二ポの可能性は無視して曖昧性を考える」という仕様が牙をむく
    if (entity_that_moves.prof !== "ポ") {
      text = this.append_and_load(loose_notation, text);
      return;
    } else {
      const loose = main_(parse_cursored(text + loose_notation).main);
      const full = main_(parse_cursored(text + full_notation).main);
      // loose で解釈すると二ポが回避できるが、full で解釈すると二ポであってゲームが終了するとき
      // これは「二ポです」を知らせるために始点明記が必要
      if (loose.phase === "resolved" && full.phase === "game_end") {
        text = this.append_and_load(full_notation, text);
        return;
      } else if (loose.phase === "resolved" && full.phase === "resolved") {
        // 移動したポーンが即座に碁で取られて二ポが解消するパターンの場合には、「直進」との競合が発生することはない
        // したがって、この場合は直進を採用して問題ないはず
        text = this.append_and_load(loose_notation, text);
        return;
      } else {
        // もうよくわかんないから full notation で書いておきます
        text = this.append_and_load(full_notation, text);
      }
    }
  }

  parachute(to: Coordinate, prof: UnpromotedShogiProfession, side: Side) {
    let text = this.state.history;
    const moves = parse_cursored(text);
    if (moves.unevaluated.length > 0) {
      if (!window.confirm("以降の局面が破棄されます。よろしいですか？（将来的には、局面を破棄せず分岐する機能を足したいと思っています）")) {
        this.setState({ selected: null });
        this.setState({ previous_situation: null });
        this.render();
        return null;
      }
    }
    text = take_until_first_cursor(text);

    const from_txt = "打";
    const full_notation = `${side === "黒" ? "▲" : "△"}${to[0]}${to[1]}${prof}${from_txt}`;

    // 無理な手を指した時に落とす
    try {
      main_(parse_cursored(text + full_notation).main);
    } catch (e) {
      alert(e);
      this.setState({ selected: null });
      this.setState({ previous_situation: null });
      this.render();
      return;
    }

    const loose_notation = `${side === "黒" ? "▲" : "△"}${to[0]}${to[1]}${prof}`;

    // 曖昧性が出ないときには from を書かずに通す
    try {
      main_(parse_cursored(text + loose_notation).main);
    } catch (e) {
      // 曖昧性が出た
      text = this.append_and_load(full_notation, text);
      return;
    }

    // 曖昧性が無いので from を書かずに通す
    text = this.append_and_load(loose_notation, text);
    return;
  }

  select_piece_in_hand(index: number, side: Side) {
    this.setState({ selected: { type: "piece_in_hand", index, side } });
    this.setState({ previous_situation: null })
    this.render();
  }

  place_stone(to: Coordinate, side: Side) {
    let text = this.state.history;
    const moves = parse_cursored(text);
    if (moves.unevaluated.length > 0) {
      if (!window.confirm("以降の局面が破棄されます。よろしいですか？（将来的には、局面を破棄せず分岐する機能を足したいと思っています）")) {
        this.setState({ selected: null });
        this.setState({ previous_situation: null });
        this.render();
        return null;
      }
    }
    text = take_until_first_cursor(text);
    text = text.trimEnd();

    const stone_coord = `${to[0]}${to[1]}`;

    // 無理な手を指した時に落とす
    try {
      main_(parse_cursored(text + stone_coord).main);
    } catch (e) {
      alert(e);
      this.setState({ selected: null });
      this.setState({ previous_situation: null });
      this.render();
      return;
    }

    text = text.trimEnd();
    text += stone_coord;
    this.setState({ history: text });
    this.load_history();
    return text;
  }

  select_stone_in_hand(side: Side) {
    this.setState({ selected: { type: "stone_in_hand", side } });
    this.setState({ previous_situation: null });
    this.render();
  }


  render() {
    if (this.state.bw_checkbox_checked) {
      this.setState({
        history: this.state.history.replace(/[黒▲☗]/g, "黒").replace(/[白△☖]/g, "白")
      });
    } else {
      this.setState({
        history: this.state.history.replace(/[黒▲☗]/g, "▲").replace(/[白△☖]/g, "△")
      });
    }

    const board_content: JSX.Element[] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const entity = this.state.situation.board[row]![col];
        if (entity == null) {
          if (this.state.previous_situation?.board[row]![col] && !this.state.selected) {
            board_content.push(<div className="newly_vacated" style={{ top: `${50 + row * 50}px`, left: `${100 + col * 50}px` }}></div>);
          }
          continue;
        }

        const row_ = toShogiRowName(row);
        const col_ = toShogiColumnName(col);
        const is_newly_updated = this.state.previous_situation && !this.state.selected ? !same_entity(entity, this.state.previous_situation.board[row]![col]) : false;
        const is_selected = this.state.selected?.type === "piece_on_board" ? this.state.selected.coord[1] === row_ && this.state.selected.coord[0] === col_ : false;
        const piece_or_stone = <div
          className={`${entity.side === "白" ? "white" : "black"} ${is_newly_updated ? "newly" : ""} ${is_selected ? "selected" : ""}`}
          style={{ top: `${50 + row * 50}px`, left: `${100 + col * 50}px;` }}
          onClick={entity.type === "碁" ? () => { } : () => this.select_piece_on_board([col_, row_])}
        >{
            getContentHTMLFromEntity(entity)
          }
        </div>;
        board_content.push(piece_or_stone);
      }
    }

    if (this.state.selected?.type === "piece_on_board") {
      const entity_that_moves = get_entity_from_coord(this.state.situation.board, this.state.selected.coord)!;
      if (entity_that_moves.type === "碁") {
        throw new Error("碁石が動くはずがない");
      }
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const row_ = toShogiRowName(row);
          const col_ = toShogiColumnName(col);
          const to: Coordinate = [col_, row_];
          const o: { to: Coordinate, from: Coordinate } = { to, from: this.state.selected.coord };
          const is_castlable = (() => {
            try {
              throws_if_uncastlable(this.state.situation.board, o);
              return true;
            } catch (e) {
              return false;
            }
          })();

          const is_kumalable = (() => {
            try {
              throws_if_unkumalable(this.state.situation.board, o);
              return true;
            } catch (e) {
              return false;
            }
          })();

          if (can_move(this.state.situation.board, o) || is_castlable || is_kumalable) {
            const possible_destination = <div
              className="possible_destination"
              style={{ top: `${50 + row * 50}px`, left: `${100 + col * 50}px;` }}
              onClick={() => { this.move_piece(to, entity_that_moves) }}
            ></div>;
            board_content.push(possible_destination);
          }
        }
      }
    } else if (this.state.selected?.type === "piece_in_hand") {
      const hand = this.state.selected.side === "白" ? this.state.situation.hand_of_white : this.state.situation.hand_of_black;
      const selected_profession = hand[this.state.selected.index]!;
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const row_ = toShogiRowName(row);
          const col_ = toShogiColumnName(col);
          const to: Coordinate = [col_, row_];

          if (get_entity_from_coord(this.state.situation.board, to)) {
            continue; // 駒がある場所には打てない
          }

          if (entry_is_forbidden(selected_profession, this.state.selected.side, to)) {
            continue; // 桂馬と香車は打てる場所が限られる
          }
          const side = this.state.selected.side;
          const possible_destination = <div
            className="possible_destination" style={{ top: `${50 + row * 50}px`, left: `${100 + col * 50}px` }}
            onClick={() => this.parachute(to, selected_profession, side)}
          ></div>;
          board_content.push(possible_destination);
        }
      }
    } else if (this.state.selected?.type === "stone_in_hand") {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const row_ = toShogiRowName(row);
          const col_ = toShogiColumnName(col);
          const to: Coordinate = [col_, row_];

          if (get_entity_from_coord(this.state.situation.board, to)) {
            continue; // 駒がある場所には打てない
          }

          if (!can_place_stone(this.state.situation.board, this.state.selected.side, to)) {
            continue; // 着手禁止点を除外する
          }
          const side = this.state.selected.side;
          const possible_destination = <div
            className='possible_destination'
            style={{ top: `${50 + row * 50}px`, left: `${100 + col * 50}px` }}
            onClick={() => this.place_stone(to, side)}
          ></div>;
          board_content.push(possible_destination);
        }
      }
    }

    this.state.situation.hand_of_white.forEach((prof, index) => {
      const is_selected = this.state.selected?.type === "piece_in_hand" && this.state.selected.side === "白" && this.state.selected.index === index;
      const piece_in_hand = <div
        className={`${is_selected ? "selected" : ""} white`}
        style={{ top: `${50 + index * 50}px`, left: `40px` }}
        onClick={() => this.select_piece_in_hand(index, "白")}
      >{prof}</div>;
      board_content.push(piece_in_hand);
    });

    this.state.situation.hand_of_black.forEach((prof, index) => {
      const is_selected = this.state.selected?.type === "piece_in_hand" && this.state.selected.side === "黒" && this.state.selected.index === index;
      const piece_in_hand = <div
        className={`${is_selected ? "selected" : ""} black`}
        style={{ top: `${450 - index * 50}px`, left: `586px` }}
        onClick={() => this.select_piece_in_hand(index, "黒")}
      >{prof}</div>;
      board_content.push(piece_in_hand);
    });

    // 棋譜の最後が自分の動きで終わっているなら、碁石を置くオプションを表示する
    const text = this.state.history;
    const moves = parse_cursored(text);
    const final_move = moves.main[moves.main.length - 1];

    if (final_move && !final_move.stone_to) {
      if (final_move.piece_phase.side === "白") {
        const is_selected = this.state.selected?.type === "stone_in_hand" && this.state.selected.side === "白";
        const stone_in_hand = <div
          className={`${is_selected ? "selected" : ""} white`}
          style={{ top: `${50 - 1 * 50}px`, left: `586px` }}
          onClick={() => this.select_stone_in_hand("白")}
        ></div>;
        board_content.push(stone_in_hand);
      } else {
        const is_selected = this.state.selected?.type === "stone_in_hand" && this.state.selected.side === "黒";
        const stone_in_hand = <div
          className={`${is_selected ? "selected" : ""} black`}
          style={{ top: `${450 + 1 * 50}px`, left: `40px` }}
          onClick={() => this.select_stone_in_hand("黒")}
        ></div>;
        board_content.push(stone_in_hand);
      }
    }

    return (
      <div>
        <Background />
        <div id="board">{board_content}</div>
        <History />
        <button id="load_history" onClick={this.load_history} style={{ left: "660px", top: "520px", position: "absolute" }}>棋譜を読み込む</button>
        <HistoryForwardButton />
        <HistoryBackwardButton />
        <BWCheckBox />
      </div>
    )
  }
}

function App() {
  return (
    <div id="App">
      <span id="forkongithub"><a target="_blank" rel="noopener noreferrer" href="https://github.com/Shoggoss">Fork me on
        GitHub</a></span>
      <h2>ShoGoSs 棋譜検証・解釈機</h2>
      <ul style={{ fontSize: "80%" }}>
        <li>ゲーム作者: <a target="_blank" rel="noopener noreferrer"
          href="https://twitter.com/oga_pleconia">@oga_pleconia</a></li>
        <li><a target="_blank" rel="noopener noreferrer"
          href="https://shogos-app.web.app">手動オンライン対戦盤</a>（ルールもここから参照できます）</li>
        <li>このサイトを実装した人: <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/hsjoihs">@hsjoihs</a>
        </li>
        <li><a target="_blank" rel="noopener noreferrer"
          href="https://github.com/Shoggoss/shogoss-parser/blob/main/README.md">棋譜の書き方の細則</a></li>
      </ul>
      <div id="main" style={{ position: "relative" }}>
        <Game />
        <div
          style={{ position: "absolute", top: "550px", border: "1px solid black", backgroundColor: "#dfeed2", width: "900px", padding: "5px" }}>
          <p>このサイトを実装した人は以下のボドゲも実装しています：</p>
          <a target="_blank" rel="noopener noreferrer"
            href="http://jurliyuuri.github.io/cerke_online_alpha/index.html"><img style={{ border: "1px solid black" }}
              src="https://cdn.discordapp.com/attachments/668577426149867553/1034886204207943751/Capture_decran_2022-10-27_a_2.47.34_AM.png"
              alt="机戦を遊ぶ" height="300" /></a>
          <a target="_blank" rel="noopener noreferrer" href="http://keserima.com/play/index.html"><img
            style={{ border: "1px solid black" }} src="http://keserima.com/imgs/keserima.png" height="300" alt="ケセリマを遊ぶ" /></a>
        </div>
      </div>
    </div >
  );
}

export default App;
