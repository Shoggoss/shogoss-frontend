import React from 'react';
import { can_move, can_place_stone, ChessEntity, Coordinate, Entity, entry_is_forbidden, get_initial_state, Hand, KingEntity, ShogiEntity, Side, Situation, throws_if_uncastlable, throws_if_unkumalable, UnpromotedShogiProfession } from "shogoss-core";
import { backward_history, forward_history, parse_cursored, take_until_first_cursor } from "shogoss-frontend-gametree-parser";
import { main_, toShogiColumnName, toShogiRowName, same_entity, get_entity_from_coord, initial_history } from './Pure'

// import logo from './logo.svg';
import './App.css';

class Background extends React.Component {
  render() {
    const horizontal_lines = Array.from({ length: 10 }, (_, i) => <div
      key={`horizontal_lines_${i}`}
      style={{ top: `${45 + i * 50}px`, left: "95px", height: "2px", width: "452px", backgroundColor: "black", position: "absolute" }}>
    </div>);
    const vertical_lines = Array.from({ length: 10 }, (_, i) => <div
      key={`vertical_lines_${i}`}
      style={{ top: "45px", left: `${95 + i * 50}px`, height: "452px", width: "2px", backgroundColor: "black", position: "absolute" }}>
    </div>)
    const row_labels = Array.from({ length: 10 }, (_, i) => <div
      key={`row_labels_${i}`}
      style={{ top: `${50 + i * 50}px`, left: "555px", position: "absolute", width: "40px", lineHeight: "40px" }}>{toShogiRowName(i)}
    </div>);
    const column_labels = Array.from({ length: 10 }, (_, i) => <div
      key={`column_labels_${i}`}
      style={{ top: "20px", left: `${100 + i * 50}px`, position: "absolute", width: "40px", textAlign: "center" }}>{toShogiColumnName(i)}
    </div>);
    return [...horizontal_lines, ...vertical_lines, ...column_labels, ...row_labels];
  }
}

interface HistoryProps {
  history: string;
  onHistoryTextChange: (s: string) => void;
}

class History extends React.Component<HistoryProps, HistoryProps> {
  constructor(props: HistoryProps) {
    super(props)
    this.handleHistoryTextChange = this.handleHistoryTextChange.bind(this);
  }

  handleHistoryTextChange(e: any) {
    this.props.onHistoryTextChange(e.target.value);
  }

  render() {
    return <textarea
      id="history"
      style={{ width: "300px", height: "500px", position: "absolute", left: "660px" }}
      value={this.props.history}
      onChange={this.handleHistoryTextChange}
    ></textarea>
  }
}

function HistoryForwardButton(props: { disabled: boolean, onClick: () => void }) {
  return <button id="forward" onClick={props.onClick} disabled={props.disabled} style={{ left: "334px", top: "500px", position: "absolute" }}>???????????????</button>
}

function HistoryBackwardButton(props: { disabled: boolean, onClick: () => void }) {
  return <button id="backward" onClick={props.onClick} style={{ left: "228px", top: "500px", position: "absolute" }} disabled={props.disabled}>???????????????</button>
}

interface BWCheckBoxProps {
  checked: boolean
  onBWChange: (checked: boolean) => void
}

class BWCheckBox extends React.Component<BWCheckBoxProps, BWCheckBoxProps> {
  constructor(props: BWCheckBoxProps) {
    super(props);
    this.handleBWChange = this.handleBWChange.bind(this);
  }
  handleBWChange(e: any) {
    this.props.onBWChange(e.target.checked);
  }
  render(): React.ReactNode {
    return <label style={{ top: "-30px", left: "720px", position: "absolute" }}>
      <input
        type="checkbox"
        id="hanzi_black_white"
        checked={this.props.checked}
        onChange={this.handleBWChange}
      /> ???????????????????????????
    </label>
  }
}

type Selection = { type: "piece_on_board", coord: Coordinate } | { type: "piece_in_hand", index: number, side: Side } | { type: "stone_in_hand", side: Side };

interface GameProps {
  history_uncommitted: string; // ?????????????????????????????????????????????????????????????????????????????????????????????
  history_committed: string; // ???????????????????????? history ??????????????????
  bw_checkbox_checked: boolean;
  forward_button_disabled: boolean;
  backward_button_disabled: boolean;
  situation: Situation,
  previous_situation: Situation | null,
  selected: Selection | null;
}


function getContentHTMLFromEntity(entity: Entity): JSX.Element {
  if (entity.type === "???") return <span></span>;
  if (entity.type === "???" && entity.prof !== "???" && entity.prof !== "???") {
    return <span style={{ fontSize: "200%" }}>{
      { ???: "???", ???: "???", ???: "???", ???: "???", ???: "???" }[entity.prof]
    }</span>;
  }
  return <span>{entity.prof}</span>
}

interface PieceInHandProps {
  index: number,
  is_selected: boolean,
  onClick: () => void,
  prof: UnpromotedShogiProfession
}

function HandPieceOfWhite(props: PieceInHandProps): JSX.Element {
  return <div
    key={`white_hand_${props.index}`}
    className={`${props.is_selected ? "selected" : ""} white`}
    style={{ top: `${50 + props.index * 50}px`, left: `40px` }}
    onClick={props.onClick}
  >{props.prof}</div>
}

function HandPieceOfBlack(props: PieceInHandProps): JSX.Element {
  return <div
    key={`black_hand_${props.index}`}
    className={`${props.is_selected ? "selected" : ""} black`}
    style={{ top: `${450 - props.index * 50}px`, left: `586px` }}
    onClick={props.onClick}
  >{props.prof}</div>
}

class Game extends React.Component<{}, GameProps> {
  constructor(props: GameProps) {
    super(props);
    this.handleHistoryTextChange = this.handleHistoryTextChange.bind(this);
    this.handleBWChange = this.handleBWChange.bind(this);
    this.load_history = this.load_history.bind(this);
    this.select_piece_on_board = this.select_piece_on_board.bind(this);
    this.select_piece_in_hand = this.select_piece_in_hand.bind(this);
    this.select_stone_in_hand = this.select_stone_in_hand.bind(this);
    this.append_and_load = this.append_and_load.bind(this);
    this.move_piece = this.move_piece.bind(this);
    this.parachute = this.parachute.bind(this);
    this.place_stone = this.place_stone.bind(this);
    this.forward = this.forward.bind(this);
    this.backward = this.backward.bind(this);
    this.state = {
      history_uncommitted: initial_history,
      history_committed: initial_history,
      bw_checkbox_checked: false,
      selected: null,
      forward_button_disabled: false,
      backward_button_disabled: true,
      situation: get_initial_state("???"),
      previous_situation: null,
    };
  }

  handleHistoryTextChange(history_uncommitted: string) {
    this.setState({ history_uncommitted });
  }

  handleBWChange(bw_checkbox_checked: boolean) {
    this.setState({ bw_checkbox_checked });
    if (bw_checkbox_checked) {
      this.setState({
        history_uncommitted: this.state.history_uncommitted.replace(/[?????????]/g, "???").replace(/[?????????]/g, "???")
      });
    } else {
      this.setState({
        history_uncommitted: this.state.history_uncommitted.replace(/[?????????]/g, "???").replace(/[?????????]/g, "???")
      });
    }
  }

  load_history() {
    const text = this.state.history_uncommitted;
    this.load_history_from_text(text);
  }

  load_history_from_text(text: string) {
    this.setState({ selected: null });
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
        alert(`??????: ${state.victor}?????????: ${state.reason}`);
        this.setState({ situation: state.final_situation, previous_situation: previous_state });
      } else {
        this.setState({ situation: state, previous_situation: previous_state });
      }
      this.setState({ history_committed: text });
      this.setState(state => { this.render(); });
    } catch (e: unknown) {
      alert(e);
    }
  }

  select_piece_on_board(coord: Coordinate) {
    this.setState({ selected: { type: "piece_on_board", coord } });
    this.setState({ previous_situation: null });
    this.setState(state => { this.render(); });
  }

  append_and_load(notation: string, text: string) {
    text = text.trimEnd();
    text += (text ? "???" : "") + notation;
    this.setState({ history_uncommitted: text });
    this.setState({ history_committed: text });
    this.load_history_from_text(text);
    return text;
  }

  move_piece(to: Coordinate, entity_that_moves: ShogiEntity | ChessEntity | KingEntity) {
    if (this.state.selected?.type !== "piece_on_board") {
      throw new Error("should not happen");
    }

    let text = this.state.history_committed;
    const moves = parse_cursored(text);
    if (moves.unevaluated.length > 0) {
      if (!window.confirm("??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????")) {
        this.setState({ selected: null });
        this.setState({ previous_situation: null });
        this.setState(state => { this.render(); });
        return null;
      }
    }
    text = take_until_first_cursor(text);
    const from: Coordinate = this.state.selected.coord;

    const from_txt = `${from[0]}${from[1]}`;
    const full_notation = `${entity_that_moves.side === "???" ? "???" : "???"}${to[0]}${to[1]}${entity_that_moves.prof}(${from_txt})`;

    // ???????????????????????????????????????
    try {
      main_(parse_cursored(text + full_notation).main);
    } catch (e) {
      alert(e);
      this.setState({ selected: null });
      this.setState({ previous_situation: null });
      this.setState(state => { this.render(); });
      return;
    }

    const loose_notation = `${entity_that_moves.side === "???" ? "???" : "???"}${to[0]}${to[1]}${entity_that_moves.prof}`;

    // ????????????????????????????????? from ?????????????????????
    try {
      main_(parse_cursored(text + loose_notation).main);
    } catch (e) {
      // ??????????????????
      text = this.append_and_load(full_notation, text);
      this.setState({ history_committed: text });
      return;
    }

    // ???????????????????????? from ?????????????????????
    // ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
    if (entity_that_moves.prof !== "???") {
      text = this.append_and_load(loose_notation, text);
      this.setState({ history_committed: text });
      return;
    } else {
      const loose = main_(parse_cursored(text + loose_notation).main);
      const full = main_(parse_cursored(text + full_notation).main);
      // loose ????????????????????????????????????????????????full ??????????????????????????????????????????????????????????????????
      // ????????????????????????????????????????????????????????????????????????
      if (loose.phase === "resolved" && full.phase === "game_end") {
        text = this.append_and_load(full_notation, text);
        this.setState({ history_committed: text });
        return;
      } else if (loose.phase === "resolved" && full.phase === "resolved") {
        // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        // ????????????????????????????????????????????????????????????????????????
        text = this.append_and_load(loose_notation, text);
        this.setState({ history_committed: text });
        return;
      } else {
        // ????????????????????????????????? full notation ????????????????????????
        text = this.append_and_load(full_notation, text);
        this.setState({ history_committed: text });
      }
    }
  }

  parachute(to: Coordinate, prof: UnpromotedShogiProfession, side: Side) {
    let text = this.state.history_committed;
    const moves = parse_cursored(text);
    if (moves.unevaluated.length > 0) {
      if (!window.confirm("??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????")) {
        this.setState({ selected: null });
        this.setState({ previous_situation: null });
        this.setState(state => { this.render(); });
        return null;
      }
    }
    text = take_until_first_cursor(text);

    const from_txt = "???";
    const full_notation = `${side === "???" ? "???" : "???"}${to[0]}${to[1]}${prof}${from_txt}`;

    // ???????????????????????????????????????
    try {
      main_(parse_cursored(text + full_notation).main);
    } catch (e) {
      alert(e);
      this.setState({ selected: null });
      this.setState({ previous_situation: null });
      this.setState(state => { this.render(); });
      return;
    }

    const loose_notation = `${side === "???" ? "???" : "???"}${to[0]}${to[1]}${prof}`;

    // ????????????????????????????????? from ?????????????????????
    try {
      main_(parse_cursored(text + loose_notation).main);
    } catch (e) {
      // ??????????????????
      text = this.append_and_load(full_notation, text);
      return;
    }

    // ???????????????????????? from ?????????????????????
    text = this.append_and_load(loose_notation, text);
    return;
  }

  select_piece_in_hand(index: number, side: Side) {
    this.setState({ selected: { type: "piece_in_hand", index, side } });
    this.setState({ previous_situation: null })
    this.setState(state => { this.render(); });
  }

  place_stone(to: Coordinate, side: Side) {
    let text = this.state.history_committed;
    const moves = parse_cursored(text);
    if (moves.unevaluated.length > 0) {
      if (!window.confirm("??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????")) {
        this.setState({ selected: null });
        this.setState({ previous_situation: null });
        this.setState(state => { this.render(); });
        return null;
      }
    }
    text = take_until_first_cursor(text);
    text = text.trimEnd();

    const stone_coord = `${to[0]}${to[1]}`;

    // ???????????????????????????????????????
    try {
      main_(parse_cursored(text + stone_coord).main);
    } catch (e) {
      alert(e);
      this.setState({ selected: null });
      this.setState({ previous_situation: null });
      this.setState(state => { this.render(); });
      return;
    }

    text = text.trimEnd();
    text += stone_coord;
    this.setState({ history_committed: text });
    this.setState({ history_uncommitted: text });
    this.load_history_from_text(text);
    return text;
  }

  select_stone_in_hand(side: Side) {
    this.setState({ selected: { type: "stone_in_hand", side } });
    this.setState({ previous_situation: null });
    this.setState(state => { this.render(); });
  }

  forward() {
    this.setState({ selected: null });
    const text = this.state.history_uncommitted;
    const new_history = forward_history(text);
    if (new_history) {
      this.setState({ history_committed: new_history });
      this.setState({ history_uncommitted: new_history });
      this.load_history_from_text(new_history);
    }
  }

  backward() {
    this.setState({ selected: null });
    const text = this.state.history_uncommitted;
    const new_history = backward_history(text);
    if (new_history) {
      this.setState({ history_committed: new_history });
      this.setState({ history_uncommitted: new_history });
      this.load_history_from_text(new_history);
    }
  }


  render() {
    const board_content: JSX.Element[] = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const entity = this.state.situation.board[row]![col];
        if (entity == null) {
          if (this.state.previous_situation?.board[row]![col] && !this.state.selected) {
            board_content.push(<div key={`newly_vacated_${row}_${col}`} className="newly_vacated" style={{ top: `${50 + row * 50}px`, left: `${100 + col * 50}px` }}></div>);
          }
          continue;
        }

        const row_ = toShogiRowName(row);
        const col_ = toShogiColumnName(col);
        const is_newly_updated = this.state.previous_situation && !this.state.selected ? !same_entity(entity, this.state.previous_situation.board[row]![col]) : false;
        const is_selected = this.state.selected?.type === "piece_on_board" ? this.state.selected.coord[1] === row_ && this.state.selected.coord[0] === col_ : false;
        const piece_or_stone = <div
          key={`piece_or_stone_${row}_${col}`}
          className={`${entity.side === "???" ? "white" : "black"} ${is_newly_updated ? "newly" : ""} ${is_selected ? "selected" : ""}`}
          style={{ top: `${50 + row * 50}px`, left: `${100 + col * 50}px` }}
          onClick={entity.type === "???" ? () => { } : () => this.select_piece_on_board([col_, row_])}
        >{
            getContentHTMLFromEntity(entity)
          }
        </div>;
        board_content.push(piece_or_stone);
      }
    }

    if (this.state.selected?.type === "piece_on_board") {
      const entity_that_moves = get_entity_from_coord(this.state.situation.board, this.state.selected.coord)!;
      if (entity_that_moves.type === "???") {
        throw new Error("??????????????????????????????");
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
              key={`possible_destination_${row}_${col}`}
              className="possible_destination"
              style={{ top: `${50 + row * 50}px`, left: `${100 + col * 50}px` }}
              onClick={() => { this.move_piece(to, entity_that_moves) }}
            ></div>;
            board_content.push(possible_destination);
          }
        }
      }
    } else if (this.state.selected?.type === "piece_in_hand") {
      const hand = this.state.selected.side === "???" ? this.state.situation.hand_of_white : this.state.situation.hand_of_black;
      const selected_profession = hand[this.state.selected.index]!;
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const row_ = toShogiRowName(row);
          const col_ = toShogiColumnName(col);
          const to: Coordinate = [col_, row_];

          if (get_entity_from_coord(this.state.situation.board, to)) {
            continue; // ????????????????????????????????????
          }

          if (entry_is_forbidden(selected_profession, this.state.selected.side, to)) {
            continue; // ????????????????????????????????????????????????
          }
          const side = this.state.selected.side;
          const possible_destination = <div
            key={`possible_destination_${row}_${col}`}
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
            continue; // ????????????????????????????????????
          }

          if (!can_place_stone(this.state.situation.board, this.state.selected.side, to)) {
            continue; // ??????????????????????????????
          }
          const side = this.state.selected.side;
          const possible_destination = <div
            key={`possible_destination_${row}_${col}`}
            className='possible_destination'
            style={{ top: `${50 + row * 50}px`, left: `${100 + col * 50}px` }}
            onClick={() => this.place_stone(to, side)}
          ></div>;
          board_content.push(possible_destination);
        }
      }
    }

    // ????????????????????????????????????????????????????????????????????????????????????????????????????????????
    const text = this.state.history_committed;
    const moves = parse_cursored(text);
    const final_move = moves.main[moves.main.length - 1];

    if (final_move && !final_move.stone_to) {
      if (final_move.piece_phase.side === "???") {
        const is_selected = this.state.selected?.type === "stone_in_hand" && this.state.selected.side === "???";
        const stone_in_hand = <div
          key="white_stone_in_hand"
          className={`${is_selected ? "selected" : ""} white`}
          style={{ top: `${50 - 1 * 50}px`, left: `586px` }}
          onClick={() => this.select_stone_in_hand("???")}
        ></div>;
        board_content.push(stone_in_hand);
      } else {
        const is_selected = this.state.selected?.type === "stone_in_hand" && this.state.selected.side === "???";
        const stone_in_hand = <div
          key="black_stone_in_hand"
          className={`${is_selected ? "selected" : ""} black`}
          style={{ top: `${450 + 1 * 50}px`, left: `40px` }}
          onClick={() => this.select_stone_in_hand("???")}
        ></div>;
        board_content.push(stone_in_hand);
      }
    }

    return (
      <div>
        <Background />
        <div id="field">
          <div>{board_content}</div>
          <WhiteHand
            selected={this.state.selected}
            hand={this.state.situation.hand_of_white}
            onClick={index => this.select_piece_in_hand(index, "???")}
          />
          <BlackHand
            selected={this.state.selected}
            hand={this.state.situation.hand_of_black}
            onClick={index => this.select_piece_in_hand(index, "???")}
          />
        </div>
        <History history={this.state.history_uncommitted} onHistoryTextChange={this.handleHistoryTextChange} />
        <button id="load_history" onClick={this.load_history} style={{ left: "660px", top: "520px", position: "absolute" }}>?????????????????????</button>
        <HistoryForwardButton onClick={this.forward} disabled={this.state.forward_button_disabled} />
        <HistoryBackwardButton onClick={this.backward} disabled={this.state.backward_button_disabled} />
        <BWCheckBox checked={this.state.bw_checkbox_checked} onBWChange={this.handleBWChange} />
      </div>
    )
  }
}

interface HandProps {
  hand: Hand
  onClick: (index: number) => void,
  selected: Selection | null
}

function WhiteHand(props: HandProps): JSX.Element {
  const white_hand_content = props.hand.map((prof, index) =>
    <HandPieceOfWhite
      index={index}
      is_selected={props.selected?.type === "piece_in_hand"
        && props.selected.side === "???"
        && props.selected.index === index
      }
      onClick={() => props.onClick(index)}
      prof={prof}
    />
  );
  return <div id="white_hand">{white_hand_content}</div>
}

function BlackHand(props: HandProps): JSX.Element {
  const black_hand_content = props.hand.map((prof, index) =>
    <HandPieceOfBlack
      index={index}
      is_selected={props.selected?.type === "piece_in_hand"
        && props.selected.side === "???"
        && props.selected.index === index
      }
      onClick={() => props.onClick(index)}
      prof={prof}
    />
  );
  return <div id="black_hand">{black_hand_content}</div>
}

function App() {
  return (
    <div id="App">
      <span id="forkongithub"><a target="_blank" rel="noopener noreferrer" href="https://github.com/Shoggoss">Fork me on
        GitHub</a></span>
      <h2>ShoGoSs ????????????????????????</h2>
      <ul style={{ fontSize: "80%" }}>
        <li>???????????????: <a target="_blank" rel="noopener noreferrer"
          href="https://twitter.com/oga_pleconia">@oga_pleconia</a></li>
        <li><a target="_blank" rel="noopener noreferrer"
          href="https://shogos-app.web.app">??????????????????????????????</a>????????????????????????????????????????????????</li>
        <li>?????????????????????????????????: <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/hsjoihs">@hsjoihs</a>
        </li>
        <li><a target="_blank" rel="noopener noreferrer"
          href="https://github.com/Shoggoss/shogoss-parser/blob/main/README.md">???????????????????????????</a></li>
      </ul>
      <div id="main" style={{ position: "relative" }}>
        <Game />
        <div
          style={{ position: "absolute", top: "550px", border: "1px solid black", backgroundColor: "#dfeed2", width: "900px", padding: "5px" }}>
          <p>?????????????????????????????????????????????????????????????????????????????????</p>
          <a target="_blank" rel="noopener noreferrer"
            href="http://jurliyuuri.github.io/cerke_online_alpha/index.html"><img style={{ border: "1px solid black" }}
              src="https://cdn.discordapp.com/attachments/668577426149867553/1034886204207943751/Capture_decran_2022-10-27_a_2.47.34_AM.png"
              alt="???????????????" height="300" /></a>
          <a target="_blank" rel="noopener noreferrer" href="http://keserima.com/play/index.html"><img
            style={{ border: "1px solid black" }} src="http://keserima.com/imgs/keserima.png" height="300" alt="?????????????????????" /></a>
        </div>
      </div>
    </div >
  );
}

export default App;
