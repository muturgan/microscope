import {
	CardType,
	type ICardInput,
	type IEventCard,
	type IPeriodCard,
	type ISceneCard,
} from '../types/card';

function createId(): string {
	return typeof crypto.randomUUID === 'function'
		? crypto.randomUUID()
		: `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createPeriodCard({ title, kind }: ICardInput): IPeriodCard {
	return {
		id: createId(),
		title,
		kind,
		type: CardType.Period,
		events: [],
	};
}

export function createEventCard({ title, kind }: ICardInput): IEventCard {
	return {
		id: createId(),
		title,
		kind,
		type: CardType.Event,
		scenes: [],
	};
}

export function createSceneCard({ title, kind }: ICardInput): ISceneCard {
	return {
		id: createId(),
		title,
		kind,
		type: CardType.Scene,
	};
}
