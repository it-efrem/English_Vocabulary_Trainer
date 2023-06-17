export type ConfirmModalProps = {
  title: string;
  yesButtonText: string;
  onYesButtonClick: () => void;
  body?: HTMLElement;
  noButtonText?: string;
  onNoButtonClick?: () => void;
};

export abstract class ConfirmModal {
  private htmlElement: HTMLElement;
  private container: HTMLElement;

  protected constructor(container: HTMLElement) {
    this.container = container;
  }

  public hide(): void {
    if (this.htmlElement && this.container.contains(this.htmlElement)) {
      this.container.removeChild(this.htmlElement);
    }
  }

  protected setPropsAndShow(props: ConfirmModalProps): void {
    this.hide();
    this.htmlElement = this.getModalLayout(props);
    this.container.appendChild(this.htmlElement);
  }

  private getModalLayout(props: ConfirmModalProps): HTMLElement {
    const modal = document.createElement("div");
    const modalDialog = document.createElement("div");
    const modalContent = document.createElement("div");
    const modalHeader = document.createElement("div");
    const modalTitle = document.createElement("h5");
    const modalFooter = document.createElement("div");
    const yesButton = document.createElement("button");
    const noButton = document.createElement("button");

    modal.appendChild(modalDialog);
    modal.classList.add("modal");
    modal.style.display = "block";
    modal.style.background = "rgba(0, 0, 0, 0.43)";

    modalDialog.appendChild(modalContent);
    modalDialog.classList.add("modal-dialog");
    modalContent.classList.add("modal-content");
    modalContent.style.marginTop = "350px";
    modalContent.appendChild(modalHeader);

    modalHeader.appendChild(modalTitle);
    modalHeader.classList.add("modal-header");
    modalTitle.classList.add("modal-title");
    modalTitle.innerHTML = props.title;

    if (props.body) {
      const modalBody = document.createElement("div");
      modalContent.appendChild(modalBody);
      modalBody.classList.add("modal-body");
      modalBody.appendChild(props.body);
    }

    modalContent.appendChild(modalFooter);
    modalFooter.classList.add("modal-footer");

    if (props.noButtonText && props.onNoButtonClick) {
      modalFooter.appendChild(noButton);
      noButton.classList.add("btn", "btn-primary");
      noButton.innerHTML = props.noButtonText;
      noButton.onclick = props.onNoButtonClick;
    }

    modalFooter.appendChild(yesButton);
    yesButton.classList.add("btn", "btn-secondary");
    yesButton.innerHTML = props.yesButtonText;
    yesButton.onclick = props.onYesButtonClick;

    return modal;
  }
}
