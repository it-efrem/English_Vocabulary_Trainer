import { ConfirmModal } from "./confirmModal";
import { IConfirmModal } from "../../../types/view";

export class ContinueGameQuestionModal
  extends ConfirmModal
  implements IConfirmModal
{
  private readonly startNewGame: () => void;
  private readonly continueGame: () => void;

  constructor(
    container: HTMLElement,
    startNewGame: () => void,
    continueGame: () => void
  ) {
    super(container);
    this.startNewGame = startNewGame;
    this.continueGame = continueGame;
  }

  public show() {
    super.setPropsAndShow({
      title: "Вы хотите продолжить сохраненную игру?",
      yesButtonText: "Продолжить",
      noButtonText: "Начать заново",
      onYesButtonClick: this.continueGame,
      onNoButtonClick: this.startNewGame,
    });
  }
}
