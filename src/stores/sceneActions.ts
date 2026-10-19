import { createSceneCard } from './cardFactories';
import { cardsStore } from './cardsStore';
import type { ICardInput } from '../types/card';

export function updateSceneCard(cardId: string, input: ICardInput): void {
	cardsStore.set(
		cardsStore.get().map((period) => ({
			...period,
			events: period.events.map((event) => ({
				...event,
				scenes: event.scenes.map((scene) =>
					scene.id === cardId
						? { ...scene, title: input.title, kind: input.kind }
						: scene,
				),
			})),
		})),
	);
}

export function deleteSceneCard(cardId: string): void {
	cardsStore.set(
		cardsStore.get().map((period) => ({
			...period,
			events: period.events.map((event) => ({
				...event,
				scenes: event.scenes.filter((scene) => scene.id !== cardId),
			})),
		})),
	);
}

export function addScene(eventId: string, input: ICardInput): void {
	const cards = cardsStore.get();

	cardsStore.set(
		cards.map((period) => ({
			...period,
			events: period.events.map((event) =>
				event.id === eventId
					? { ...event, scenes: [...event.scenes, createSceneCard(input)] }
					: event,
			),
		})),
	);
}
