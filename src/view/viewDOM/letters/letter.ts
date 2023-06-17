export enum LetterType {
  Primary = "primary",
  Danger = "danger",
  Success = "success",
}

export class Letter {
  static getColorClass(type: LetterType) {
    switch (type) {
      case LetterType.Danger:
        return "btn-danger";
      case LetterType.Primary:
        return "btn-primary";
      case LetterType.Success:
        return "btn-success";
    }
  }

  static getHTMLElement(
    letter: string,
    letterIdx: number,
    type: LetterType,
    onClick?: (letter: string, letterIdx: number) => void
  ) {
    const button = document.createElement("button");
    button.className = `btn mx-1 ${Letter.getColorClass(type)}`;
    button.type = "button";
    button.textContent = letter;
    button.value = letter;
    button.style.width = "40px";
    button.style.height = "40px";
    button.onclick = () => onClick && onClick(letter, letterIdx);
    return button;
  }
}
