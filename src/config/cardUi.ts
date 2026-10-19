import { CardKind, CardType } from '../types/card';

export function cardKindModifier(kind: CardKind): 'good' | 'bad' {
	return kind === CardKind.Good ? 'good' : 'bad';
}

export interface ICardKindLabels {
	good: string;
	bad: string;
	goodGenitive: string;
	badGenitive: string;
}

export const PERIOD_KIND_LABELS: ICardKindLabels = {
	good: 'Расцвет',
	bad: 'Упадок',
	goodGenitive: 'расцвета',
	badGenitive: 'упадка',
};

export const EVENT_KIND_LABELS: ICardKindLabels = {
	good: 'Удача',
	bad: 'Беда',
	goodGenitive: 'удачи',
	badGenitive: 'беды',
};

export const SCENE_KIND_LABELS: ICardKindLabels = {
	good: 'Светлая',
	bad: 'Мрачная',
	goodGenitive: 'светлой',
	badGenitive: 'мрачной',
};

export function getCardKindLabel(
	labels: ICardKindLabels,
	kind: CardKind,
): string {
	return kind === CardKind.Good ? labels.good : labels.bad;
}

export function getCardKindGenitiveLabel(
	labels: ICardKindLabels,
	kind: CardKind,
): string {
	return kind === CardKind.Good ? labels.goodGenitive : labels.badGenitive;
}

export const PERIOD_ADD_SYMBOL = '⏳';
export const EVENT_ADD_SYMBOL = '⚡';
export const SCENE_ADD_SYMBOL = '🎭';

export const SETTING_NAME_PLACEHOLDER = 'Например, Сага о Ледяном Троне';
export const INITIAL_START_PERIOD_PLACEHOLDER =
	'Например, Вторжение в Ётунхейм';
export const INITIAL_END_PERIOD_PLACEHOLDER = 'Например, Крах Асгарда';

export const PERIOD_TITLE_EXAMPLES = [
	'Завоевание Свартальфхейма',
	'Переселение к Ледяным Фьордам',
	'Великая Засуха',
	'Смута Трёх Ярлов',
] as const;

export const EVENT_TITLE_EXAMPLES = [
	'Пробуждение Морского Змея',
	'Совет ярлов',
	'Падение древнего моста',
	'Предательство у жертвенного камня',
] as const;

export const SCENE_TITLE_EXAMPLES = [
	'Поединок на обрыве',
	'Торг с вёльвой',
	'Присяга у ярла',
	'Пожар в длинном доме',
] as const;

export function getRandomPlaceholder(examples: readonly string[]): string {
	const index = Math.floor(Math.random() * examples.length);

	return `Например, ${examples[index]}`;
}

export interface ICardTypeConfig {
	heading: string;
	kindLegend: string;
	kindLabels: ICardKindLabels;
	examples: readonly string[];
}

export const CARD_TYPE_CONFIG: Record<CardType, ICardTypeConfig> = {
	[CardType.Period]: {
		heading: 'Редактирование периода',
		kindLegend: 'Тип периода',
		kindLabels: PERIOD_KIND_LABELS,
		examples: PERIOD_TITLE_EXAMPLES,
	},
	[CardType.Event]: {
		heading: 'Редактирование события',
		kindLegend: 'Тип события',
		kindLabels: EVENT_KIND_LABELS,
		examples: EVENT_TITLE_EXAMPLES,
	},
	[CardType.Scene]: {
		heading: 'Редактирование сцены',
		kindLegend: 'Тип сцены',
		kindLabels: SCENE_KIND_LABELS,
		examples: SCENE_TITLE_EXAMPLES,
	},
};

export interface IDeleteConfirmText {
	heading: string;
	description: string;
}

export const DELETE_CONFIRM_TEXT: Record<CardType, IDeleteConfirmText> = {
	[CardType.Period]: {
		heading: 'Удалить период?',
		description: 'Все вложенные события и сцены также будут удалены.',
	},
	[CardType.Event]: {
		heading: 'Удалить событие?',
		description: 'Все вложенные сцены также будут удалены.',
	},
	[CardType.Scene]: {
		heading: 'Удалить сцену?',
		description:
			'Карточка сцены будет удалена без возможности восстановления.',
	},
};
