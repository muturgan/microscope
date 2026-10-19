import { atom } from 'nanostores';

import { createPeriodCard } from './cardFactories';
import type { ICardInput, IPeriodCard } from '../types/card';
import {
	loadCardsStateFromLocalStorage,
	saveCardsStateToLocalStorage,
} from '../utils/localState';

const initialState = loadCardsStateFromLocalStorage();

/** Название текущего сеттинга. */
export const settingNameStore = atom(initialState?.settingName ?? '');

/** Верхнеуровневые карточки — периоды, внутри которых хранятся события. */
export const cardsStore = atom<IPeriodCard[]>(initialState?.cards ?? []);

function persistCurrentState(): void {
	saveCardsStateToLocalStorage(cardsStore.get(), settingNameStore.get());
}

cardsStore.listen(persistCurrentState);
settingNameStore.listen(persistCurrentState);

if (typeof window !== 'undefined') {
	window.addEventListener('beforeunload', persistCurrentState);
	window.addEventListener('pagehide', persistCurrentState);
}

export function updateSettingName(settingName: string): void {
	settingNameStore.set(settingName);
}

export function resetCardsState(): void {
	settingNameStore.set('');
	cardsStore.set([]);
}

export function initializeCards(
	settingName: string,
	start: ICardInput,
	end: ICardInput,
): void {
	settingNameStore.set(settingName);
	cardsStore.set([createPeriodCard(start), createPeriodCard(end)]);
}

export function replaceCards(settingName: string, cards: IPeriodCard[]): void {
	settingNameStore.set(settingName);
	cardsStore.set(cards);
}
