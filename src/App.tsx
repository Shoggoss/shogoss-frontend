import React from 'react';
// import logo from './logo.svg';
import './App.css';

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
        <div id="background">
          <div
            style={{ top: "45px", left: "95px", height: "2px", width: "452px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "95px", left: "95px", height: "2px", width: "452px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "145px", left: "95px", height: "2px", width: "452px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "195px", left: "95px", height: "2px", width: "452px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "245px", left: "95px", height: "2px", width: "452px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "295px", left: "95px", height: "2px", width: "452px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "345px", left: "95px", height: "2px", width: "452px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "395px", left: "95px", height: "2px", width: "452px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "445px", left: "95px", height: "2px", width: "452px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "495px", left: "95px", height: "2px", width: "452px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "45px", left: "95px", height: "452px", width: "2px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "45px", left: "145px", height: "452px", width: "2px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "45px", left: "195px", height: "452px", width: "2px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "45px", left: "245px", height: "452px", width: "2px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "45px", left: "295px", height: "452px", width: "2px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "45px", left: "345px", height: "452px", width: "2px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "45px", left: "395px", height: "452px", width: "2px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "45px", left: "445px", height: "452px", width: "2px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "45px", left: "495px", height: "452px", width: "2px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div
            style={{ top: "45px", left: "545px", height: "452px", width: "2px", backgroundColor: "black", position: "absolute" }}>
          </div>
          <div style={{ top: "50px", left: "555px", position: "absolute", width: "40px", lineHeight: "40px" }}>一</div>
          <div style={{ top: "100px", left: "555px", position: "absolute", width: "40px", lineHeight: "40px" }}>二</div>
          <div style={{ top: "150px", left: "555px", position: "absolute", width: "40px", lineHeight: "40px" }}>三</div>
          <div style={{ top: "200px", left: "555px", position: "absolute", width: "40px", lineHeight: "40px" }}>四</div>
          <div style={{ top: "250px", left: "555px", position: "absolute", width: "40px", lineHeight: "40px" }}>五</div>
          <div style={{ top: "300px", left: "555px", position: "absolute", width: "40px", lineHeight: "40px" }}>六</div>
          <div style={{ top: "350px", left: "555px", position: "absolute", width: "40px", lineHeight: "40px" }}>七</div>
          <div style={{ top: "400px", left: "555px", position: "absolute", width: "40px", lineHeight: "40px" }}>八</div>
          <div style={{ top: "450px", left: "555px", position: "absolute", width: "40px", lineHeight: "40px" }}>九</div>
          <div style={{ top: "20px", left: "100px", position: "absolute", width: "40px", textAlign: "center" }}>９</div>
          <div style={{ top: "20px", left: "150px", position: "absolute", width: "40px", textAlign: "center" }}>８</div>
          <div style={{ top: "20px", left: "200px", position: "absolute", width: "40px", textAlign: "center" }}>７</div>
          <div style={{ top: "20px", left: "250px", position: "absolute", width: "40px", textAlign: "center" }}>６</div>
          <div style={{ top: "20px", left: "300px", position: "absolute", width: "40px", textAlign: "center" }}>５</div>
          <div style={{ top: "20px", left: "350px", position: "absolute", width: "40px", textAlign: "center" }}>４</div>
          <div style={{ top: "20px", left: "400px", position: "absolute", width: "40px", textAlign: "center" }}>３</div>
          <div style={{ top: "20px", left: "450px", position: "absolute", width: "40px", textAlign: "center" }}>２</div>
          <div style={{ top: "20px", left: "500px", position: "absolute", width: "40px", textAlign: "center" }}>１</div>
        </div>
        <div id="board"></div>
        <textarea id="history" style={{ width: "300px", height: "500px", position: "absolute", left: "660px" }}>{`{|▲７五ポ７四 
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
▲３二銀７二}`}</textarea>
        <button id="load_history" style={{ left: "660px", top: "520px", position: "absolute" }}>棋譜を読み込む</button>
        <button id="forward" style={{ left: "334px", top: "500px", position: "absolute" }}>一手進む→</button>
        <button id="backward" style={{ left: "228px", top: "500px", position: "absolute" }} disabled>←一手戻る</button>
        <label style={{ top: "-30px", left: "720px", position: "absolute" }}><input type="checkbox" id="hanzi_black_white" /> 「黒」「白」で表示</label>
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
