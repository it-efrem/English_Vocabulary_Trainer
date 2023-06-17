export interface IState {
  /** Слова, которые нужно отгадать */
  words: string[];

  /** Индекс слова, которое нужно отрендерить (History) */
  renderWordIdx: number;

  /** Индекс слова, которое нужно отгадать */
  currentWordIdx: number;

  /** Индекс буквы которую нужно отгадать в текущем слове */
  answerIdx: number;

  /** Буквы, которые осталось отгадать */
  letters: string[];

  errorStats: IErrorStats;
}

export interface IErrorStats {
  /** Количество ошибок на текущем слове */
  currentErrorCount: number;

  /** Общее количество ошибок */
  totalErrorCount: number;

  /** Максимальное количество ошибок на слове */
  maxErrorCountOnWord: number;

  /** Индекс слова с максимальным количеством ошибок */
  wordIdxWithMaxErrors?: number;
}
