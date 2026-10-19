import { createEventCard } from './cardFactories';
import { cardsStore } from './cardsStore';
import type { ICardInput } from '../types/card';

export function updateEventCard(cardId: string, input: ICardInput): void {
	cardsStore.set(
		cardsStore.get().map((period) => ({
			...period,
			events: period.events.map((event) =>
				event.id === cardId
					? { ...event, title: input.title, kind: input.kind }
					: event,
			),
		})),
	);
}

export function deleteEventCard(cardId: string): void {
	cardsStore.set(
		cardsStore.get().map((period) => ({
			...period,
			events: period.events.filter((event) => event.id !== cardId),
		})),
	);
}

export function addEvent(periodId: string, input: ICardInput): void {
	const cards = cardsStore.get();

	cardsStore.set(
		cards.map((card) =>
			card.id === periodId
				? { ...card, events: [...card.events, createEventCard(input)] }
				: card,
		),
	);
}
