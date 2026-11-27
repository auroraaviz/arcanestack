export type DeckValidationFormat = "standard" | "commander";

export type DeckValidationResult = {
  totalCards: number;
  isValid: boolean;
  message: string;
};

type CountableDeckCard = {
  quantity: number;
};

export function validateDeckSize(
  format: DeckValidationFormat,
  cards: readonly CountableDeckCard[],
): DeckValidationResult {
  const totalCards = cards.reduce((total, card) => total + card.quantity, 0);

  if (format === "standard") {
    const missingCards = Math.max(0, 60 - totalCards);
    return {
      totalCards,
      isValid: missingCards === 0,
      message:
        missingCards === 0
          ? "Mazo válido."
          : `Mazo incompleto: faltan ${missingCards} cartas para el mínimo de 60.`,
    };
  }

  if (totalCards === 100) {
    return { totalCards, isValid: true, message: "Mazo válido." };
  }

  if (totalCards < 100) {
    return {
      totalCards,
      isValid: false,
      message: `Mazo incompleto: faltan ${100 - totalCards} cartas para llegar a 100.`,
    };
  }

  return {
    totalCards,
    isValid: false,
    message: `Mazo inválido: sobran ${totalCards - 100} cartas; debe tener exactamente 100.`,
  };
}
