import { Letter, LetterType } from "./letter";

export class Letters {
  private highlightLetterTimeout = 500;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render(
    letters: string[],
    type: LetterType,
    onClick?: (letter: string, letterIdx: number) => void
  ) {
    const lettersElements = letters.map((letter, idx) =>
      Letter.getHTMLElement(letter, idx, type, onClick)
    );
    this.container.innerHTML = "";
    this.container.append(...lettersElements);
  }

  highlightLetter(letter: string, letterIdx?: number) {
    let letterElement: HTMLElement | undefined;

    if (typeof letterIdx === "number") {
      letterElement = this.container.children[letterIdx] as HTMLElement;
    } else {
      letterElement = this.container.querySelector(`button[value="${letter}"]`);
    }

    letterElement?.classList?.remove("btn-primary");
    letterElement?.classList?.add("btn-danger");

    setTimeout(() => {
      if (letterElement) {
        letterElement.classList.remove("btn-danger");
        letterElement?.classList?.add("btn-primary");
      }
    }, this.highlightLetterTimeout);
  }
}
