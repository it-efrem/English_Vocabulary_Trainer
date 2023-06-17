import { ConfirmModal } from "./confirmModal";
import { IGameOverModal } from "../../../types/view";

export class GameOverModal extends ConfirmModal implements IGameOverModal {
  private readonly startNewGame: () => void;

  constructor(container: HTMLElement, startNewGame: () => void) {
    super(container);
    this.startNewGame = startNewGame;
  }

  public show(
    wordsCount: number,
    totalErrorCount: number,
    wordWithMaxErrorCount?: string
  ) {
    const body = this.getStatLayout(
      wordsCount,
      totalErrorCount,
      wordWithMaxErrorCount
    );

    super.setPropsAndShow({
      title: "Игра закончена",
      body,
      yesButtonText: "Начать заново",
      onYesButtonClick: this.startNewGame,
    });
  }

  private getStatLayout(
    wordsCount: number,
    totalErrorCount: number,
    wordWithMaxErrorCount?: string
  ): HTMLElement {
    const container = document.createElement("div");
    const wordsCountEl = document.createElement("p");
    const totalErrorCountEl = document.createElement("p");
    const wordWithMaxErrorCountEl = document.createElement("p");
    const noticeEl = document.createElement("small");

    wordsCountEl.innerHTML = `Число собранных слов без ошибок: ${wordsCount}`;
    totalErrorCountEl.innerHTML = `Число ошибок: ${totalErrorCount}`;

    container.appendChild(wordsCountEl);
    container.appendChild(totalErrorCountEl);

    if (wordWithMaxErrorCount) {
      wordWithMaxErrorCountEl.innerHTML = `Слово с самым большим числом ошибок: ${wordWithMaxErrorCount}`;
      container.appendChild(wordWithMaxErrorCountEl);
    }

    noticeEl.innerHTML =
      "(После завершения игры - переключение между словами отключено)";
    container.appendChild(noticeEl);

    return container;
  }
}
