import { IState } from "../types/state";
import { LetterClickResult } from "../types/game";
import { History } from "../engine/history";

/**
 * Бизнес-логика игры, представляем, что:
 * игра - это данные,
 * а функции - действия в игре (изменение данных)
 */
export class Game {
  private words: string[];
  private readonly maxErrorsCount: number;
  private readonly maxWordsOnClass: number;
  private state: IState;

  constructor(
    words: string[],
    maxWordsOnClass: number,
    maxErrorsCount: number
  ) {
    this.words = words;
    this.maxWordsOnClass = maxWordsOnClass;
    this.maxErrorsCount = maxErrorsCount;
  }

  public getState(): IState {
    return this.state;
  }

  public continuePreviousGame(state: IState): void {
    this.state = state;
  }

  /**
   * Начало игры - перемешиваем слова и буквы
   */
  public start(): void {
    const wordsCount = Math.min(this.words.length, this.maxWordsOnClass);
    const shuffledWords = this.words
      .slice(0, wordsCount)
      .sort(() => Math.random() - 0.5);
    const shuffledLetters = shuffledWords[0]
      .split("")
      .sort(() => Math.random() - 0.5);

    this.state = {
      words: shuffledWords,
      letters: shuffledLetters,
      renderWordIdx: 0,
      currentWordIdx: 0,
      answerIdx: 0,
      errorStats: {
        currentErrorCount: 0,
        totalErrorCount: 0,
        maxErrorCountOnWord: 0,
        wordIdxWithMaxErrors: undefined,
      },
    };
  }

  /**
   * Обработка нажатия/клика на букву
   *
   * @param state - Состояние игры
   * @param letter - выбранная буква
   * @param letterIdx - индекс буквы в массиве букв (указывается только при клике через UI, будет undefined при нажатии на клавиатуре)
   */
  public letterSelectHandler(
    letter: string,
    letterIdx?: number
  ): LetterClickResult {
    if (this.state.renderWordIdx !== this.state.currentWordIdx) {
      return LetterClickResult.Correct;
    }

    const currentWord = this.state.words[this.state.currentWordIdx];
    const expectedLetter = currentWord[this.state.answerIdx];
    const isCorrect = expectedLetter === letter;

    if (isCorrect) {
      this.state.answerIdx++;

      const indexToRemove =
        typeof letterIdx === "number"
          ? letterIdx
          : this.state.letters.indexOf(letter);

      this.state.letters.splice(indexToRemove, 1);
    } else {
      this.addError();
      return LetterClickResult.Incorrect;
    }

    if (this.state.answerIdx >= currentWord.length) {
      this.switchToNextWord();
    }

    return LetterClickResult.Correct;
  }

  public setRenderWordIdx = (idx: number): void => {
    this.state.renderWordIdx = idx;
  };

  /**
   * Логика подсчета статистики
   */
  private addError(): void {
    this.state.errorStats.currentErrorCount++;
    this.state.errorStats.totalErrorCount++;

    if (
      this.state.errorStats.currentErrorCount >
      this.state.errorStats.maxErrorCountOnWord
    ) {
      this.state.errorStats.maxErrorCountOnWord =
        this.state.errorStats.currentErrorCount;
      this.state.errorStats.wordIdxWithMaxErrors = this.state.currentWordIdx;
    }
  }

  private switchToNextWord(): void {
    /** Когда слова закончились - GameOver */
    if (this.state.currentWordIdx + 1 >= this.state.words.length) {
      return;
    }

    this.state.currentWordIdx++;
    this.state.renderWordIdx = this.state.currentWordIdx;

    const shuffledLetters = this.state.words[this.state.currentWordIdx]
      .split("")
      .sort(() => Math.random() - 0.5);

    this.state.letters = shuffledLetters;
    this.state.answerIdx = 0;
    this.state.errorStats.currentErrorCount = 0;

    History.tick(this.state.currentWordIdx);
  }

  public get isGameWon(): boolean {
    return (
      this.state.currentWordIdx + 1 === this.state.words.length &&
      this.state.letters.length === 0
    );
  }

  public get isGameLose(): boolean {
    return this.state.errorStats.currentErrorCount >= this.maxErrorsCount;
  }

  public get isGameOver(): boolean {
    return this.isGameLose || this.isGameWon;
  }

  public get stats() {
    const wordWithMaxErrorCount =
      typeof this.state.errorStats.wordIdxWithMaxErrors === "number"
        ? this.state.words[this.state.errorStats.wordIdxWithMaxErrors]
        : undefined;

    const wordsCount = this.isGameWon
      ? this.state.words.length
      : this.state.currentWordIdx;

    return {
      wordsCount,
      totalErrorCount: this.state.errorStats.totalErrorCount,
      wordWithMaxErrorCount,
    };
  }
}
