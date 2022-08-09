
import "./style.css";
import { Game } from "./scr/game";

window.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  game.animate();
});