import type { Node } from '@xyflow/react';

export const enum CardKind {
	Good,
	Bad,
}

export const enum CardType {
	Period,
	Event,
	Scene,
}

export interface ICard {
	id: string;
	title: string;
	kind: CardKind;
	type: CardType;
}

export interface IEventCard extends ICard {
	type: CardType.Event;
	scenes: ISceneCard[];
}

export interface ISceneCard extends ICard {
	type: CardType.Scene;
}

export interface IPeriodCard extends ICard {
	type: CardType.Period;
	events: IEventCard[];
}

export interface ICardInput {
	title: string;
	kind: CardKind;
}

export interface ICardEditTarget {
	cardType: CardType;
	cardId: string;
	title: string;
	kind: CardKind;
}

export interface ICardNodeData extends Record<string, unknown> {
	card: IPeriodCard;
	index: number;
	canInsert: boolean;
	onInsert: (index: number) => void;
	onAddEvent: (periodId: string) => void;
	onAddScene: (eventId: string) => void;
	onEdit: (target: ICardEditTarget) => void;
	onDelete: (target: ICardEditTarget) => void;
}

export type CardFlowNode = Node<ICardNodeData, 'card'>;
