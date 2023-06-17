import { Game } from "../game";
import { IView } from "../types/view";
import { IState } from "../types/state";
import { LetterClickResult } from "../types/game";
import { History } from "./history";
import { LetterType } from "../view/viewDOM/letters/letter";

const storageKey = "state";

/**
 * Прекомпиляция регулярки
 */
const keyRegex = new RegExp(/^[a-zA-Zа-яА-Я]$/);

/**
 * Движок игры - связующее звено между бизнес-логикой и представлением
 */
export class Engine {
  private game: Game;
  private view: IView;

  constructor(game: Game, view: IView) {
    this.game = game;
    this.view = view;
    History.init(this.tick.bind(this), this.game.setRenderWordIdx.bind(this));

    this.view.init({
      continueGame: this.continueGameHandler.bind(this),
      startNewGame: this.startNewGameHandler.bind(this),
      selectLetter: this.selectLetterHandler.bind(this),
    });

    document.addEventListener("keypress", (e) =>
      this.selectLetterHandler(e.key)
    );

    /** Т.к. ошибка может возникнуть только при неправильных данных - при ошибке очищаем localStorage
     * по сути в данном задании это сделано вместо валидации данных в LS
     * */
    window.onerror = (e) => {
      localStorage.clear();
    };
  }

  public continueGameHandler(): void {
    this.view.continueGameQuestionModal.hide();
  }

  public startNewGameHandler(): void {
    this.view.continueGameQuestionModal.hide();
    this.view.gameOverModal.hide();
    localStorage.clear();
    this.start();
  }

  public selectLetterHandler(symbol: string, idx?: number): void {
    const letter = symbol.toLowerCase();

    if (keyRegex.test(letter) && !this.game.isGameOver) {
      const result = this.game.letterSelectHandler(letter, idx);

      if (result === LetterClickResult.Incorrect) {
        this.view.highlightLetter(letter, idx);
      }

      this.tick();
    }
  }

  public start(): void {
    const prevState = JSON.parse(
      localStorage.getItem(storageKey) || "null"
    ) as IState | null;

    /** По хорошему сюда нужно добавить валидацию, но я не стал делать это в рамках тестового задания */
    if (prevState && prevState?.words) {
      /** Устанавливаем предыдущий стейт, чтобы пользователь мог видеть на чем он остановился */
      this.game.continuePreviousGame(prevState);
      this.view.continueGameQuestionModal.show();
    } else {
      this.game.start();
    }

    this.tick();
  }

  public tick(): void {
    const state = this.game.getState();

    if (this.game.isGameOver) {
      this.view.gameOverModal.show(
        this.game.stats.wordsCount,
        this.game.stats.totalErrorCount,
        this.game.stats.wordWithMaxErrorCount
      );
      History.reset();
    }

    if (this.game.isGameLose) {
      const currentWord = state.words[state.currentWordIdx];
      const answeredLetters = currentWord.split("");

      this.view.renderGame(
        state.words.length,
        state.renderWordIdx + 1,
        answeredLetters,
        [],
        true,
        LetterType.Danger
      );
    } else {
      const isRenderPrev = state.currentWordIdx !== state.renderWordIdx;

      const currentWord = state.words[state.renderWordIdx];
      const answeredLetterIdx = !isRenderPrev
        ? state.answerIdx
        : currentWord.length;
      const answeredLetters = currentWord.slice(0, answeredLetterIdx).split("");
      const restLetters = !isRenderPrev ? state.letters : [];

      this.view.renderGame(
        state.words.length,
        state.renderWordIdx + 1,
        answeredLetters,
        restLetters,
        isRenderPrev || this.game.isGameOver
      );
    }

    /** В реальной игре нужно было бы сохранять данные полностью асинхронно, а не на каждый тик */
    window.requestAnimationFrame(() =>
      localStorage.setItem(storageKey, JSON.stringify(state))
    );
  }
}
