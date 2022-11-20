import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
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
  );
}

export default App;
