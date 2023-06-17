import { IView, IViewActions } from "../../types/view";
import { ContinueGameQuestionModal } from "./modals/continueGameQuestionModal";
import { GameOverModal } from "./modals/gameOverModal";
import { LetterType } from "./letters/letter";
import { Letters } from "./letters/letters";

/** Рендеринг игры в DOM */
export class ViewDOM implements IView {
  private currentQuestionEl: HTMLElement;
  private totalQuestionsEl: HTMLElement;
  private containerEl: HTMLElement;
  private actions: IViewActions;
  private answer: Letters;
  private letters: Letters;

  /** Сохраняем предыдущее значение для оптимизации рендеринга */
  private prevRestLettersHash: number;

  public continueGameQuestionModal: ContinueGameQuestionModal;
  public gameOverModal: GameOverModal;

  constructor() {
    this.containerEl = document.getElementsByClassName(
      "container"
    )[0] as HTMLElement;
    this.currentQuestionEl = document.getElementById("current_question");
    this.totalQuestionsEl = document.getElementById("total_questions");
    this.answer = new Letters(document.getElementById("answer"));
    this.letters = new Letters(document.getElementById("letters"));
  }

  public init(actions: IViewActions): void {
    this.actions = actions;

    this.continueGameQuestionModal = new ContinueGameQuestionModal(
      document.body,
      this.actions.startNewGame,
      this.actions.continueGame
    );

    this.gameOverModal = new GameOverModal(
      document.body,
      this.actions.startNewGame
    );
  }

  /** Сейчас View рендерит игру полностью - это сознательное решение продиктовоное 2-мя причинами:
   * 1. View - должен сам решать что и когда рендерить, мы управляем только состоянием (декларативное программирование)
   * 2. В таком не большом приложении это не влияет на производительность
   *
   * В реальном приложении нужно было бы реализовать частичный рендеринг только меняющихся частей
   * (как в React или как в реальных игровых движках) */
  public renderGame(
    totalQuestions: number,
    currentQuestion: number,
    answeredLetters: string[],
    restLetters: string[],
    isResetHash?: boolean,
    answeredLettersType: LetterType = LetterType.Success
  ): void {
    if (isResetHash) {
      this.prevRestLettersHash = -1;
    }

    /** Рендерим только реальные изменения */
    if (restLetters.length === this.prevRestLettersHash) {
      return;
    }

    this.prevRestLettersHash = restLetters.length;

    this.currentQuestionEl.innerHTML = currentQuestion.toString();
    this.totalQuestionsEl.innerHTML = totalQuestions.toString();

    this.answer.render(answeredLetters, answeredLettersType);
    this.letters.render(
      restLetters,
      LetterType.Primary,
      this.actions.selectLetter
    );
  }

  highlightLetter(letter: string, letterIdx?: number): void {
    this.letters.highlightLetter(letter, letterIdx);
  }
}
