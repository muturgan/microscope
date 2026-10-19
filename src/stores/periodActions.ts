import { createPeriodCard } from './cardFactories';
import { cardsStore } from './cardsStore';
import { CardKind, type ICardInput } from '../types/card';

export function getOppositeKind(kind: CardKind): CardKind {
	return kind === CardKind.Good ? CardKind.Bad : CardKind.Good;
}

export function updatePeriodCard(cardId: string, input: ICardInput): void {
	cardsStore.set(
		cardsStore
			.get()
			.map((card) =>
				card.id === cardId
					? { ...card, title: input.title, kind: input.kind }
					: card,
			),
	);
}

export function deletePeriodCard(cardId: string): void {
	cardsStore.set(cardsStore.get().filter((card) => card.id !== cardId));
}

export function insertPeriodCard(index: number, title: string): void {
	const cards = cardsStore.get();

	// Добавлять можно только между существующими периодами.
	if (index <= 0 || index >= cards.length) {
		return;
	}

	const next = [...cards];

	next.splice(
		index,
		0,
		createPeriodCard({
			title,
			kind: getOppositeKind(cards[index - 1].kind),
		}),
	);

	// Сохраняем чередование всех периодов после вставленного.
	for (let i = index + 1; i < next.length; i += 1) {
		next[i] = {
			...next[i],
			kind: getOppositeKind(next[i - 1].kind),
		};
	}

	cardsStore.set(next);
}
