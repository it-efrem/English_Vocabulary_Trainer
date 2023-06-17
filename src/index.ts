import { ViewDOM } from "./view/viewDOM";
import { Engine } from "./engine";
import { Game } from "./game";

const words = [
  "apple",
  "function",
  "timeout",
  "task",
  "application",
  "data",
  "tragedy",
  "sun",
  "symbol",
  "button",
  "software",
];

const game = new Game(words, 6, 3);
const view = new ViewDOM();
const engine = new Engine(game, view);

engine.start();
