import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import TitleScreen from "./Components/TitleScreen";
import SignupPage from "./Components/SignupPage";
import LoginPage from "./Components/LoginPage";
import BattleOne from "./Components/BattleOne"

function App() {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    fetch('/me')
    .then((r) => {
      if (r.ok) {
        r.json().then((player) => setPlayer(player));
      }
    });
  }, []);

  // # Potential refactoring attempt for later

  // function routePath(path, component) {
  //   <Route path={`/${path}`}
  // }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TitleScreen player={player} setPlayer={player}/> }/>
          <Route path="/login" element={<LoginPage player={player} setPlayer={player}/> }/>
          <Route path="/signup" element={<SignupPage player={player} setPlayer={player}/> }/>
          <Route path="/battleone" element={<BattleOne player={player} setPlayer={player}/> }/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;