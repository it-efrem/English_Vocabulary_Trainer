import { LetterType } from "../view/viewDOM/letters/letter";

export interface IView {
  init(actions: IViewActions): void;

  /** Отрисовка самой игры */
  renderGame(
    totalQuestions: number,
    currentQuestion: number,
    answeredLetters: string[],
    restLetters: string[],
    isResetHash?: boolean,
    answeredLettersType?: LetterType
  ): void;

  /** Подсветка буквы при не правильном ответе */
  highlightLetter(letter: string, letterIdx?: number): void;

  /** Модальное окно с вопросом о продолжении игры */
  continueGameQuestionModal: IConfirmModal;

  /** Модальное окно с результатами игры */
  gameOverModal: IGameOverModal;
}

export interface IViewActions {
  continueGame: () => void;
  startNewGame: () => void;
  selectLetter: (letter: string, letterIdx?: number) => void;
}

export interface IGameOverModal {
  hide(): void;
  show(
    wordsCount: number,
    totalErrorCount: number,
    wordWithMaxErrorCount?: string
  ): void;
}

export interface IConfirmModal {
  hide(): void;
  show(): void;
}
