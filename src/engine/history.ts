export class History {
  private static setWordId: (setWordId: number) => void;
  private static update: () => void;

  /** Идентификатор сессии нужен чтобы после завершения игры не попадать на слова из предыдущей сессии */
  private static currentSessionId: number;

  public static init(
    update: () => void,
    setWordId: (setWordId: number) => void
  ) {
    History.update = update;
    History.setWordId = setWordId;
    window.addEventListener("popstate", (e) => {
      History.onPopState(e);
    });
    History.reset();
  }

  public static tick(currentWordId: number): void {
    const historyWordId: number | undefined = history.state?.wordId;

    if (historyWordId !== currentWordId) {
      history.pushState(
        { sessionId: History.currentSessionId, wordId: currentWordId },
        ""
      );
    }
  }

  public static reset(): void {
    History.currentSessionId = Math.random();
    history.replaceState({}, "");
    History.tick(0);
  }

  private static onPopState(event: PopStateEvent): void {
    if (
      typeof event.state?.wordId !== "undefined" &&
      event.state?.sessionId === History.currentSessionId
    ) {
      History.setWordId(event.state.wordId);
      History.update();
    }
  }
}
