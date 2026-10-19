import {
	createCardsStateJson,
	type IParsedCardsState,
	parseCardsState,
} from './stateFile';
import type { IPeriodCard } from '../types/card';

const STORAGE_KEY = 'microscope:cards-state:v1';

export function loadCardsStateFromLocalStorage(): IParsedCardsState | null {
	if (typeof window === 'undefined') {
		return null;
	}

	try {
		const rawState = window.localStorage.getItem(STORAGE_KEY);

		if (!rawState) {
			return null;
		}

		return parseCardsState(rawState);
	} catch {
		try {
			window.localStorage.removeItem(STORAGE_KEY);
		} catch {
			// localStorage may be unavailable — ignore cleanup errors.
		}

		return null;
	}
}

export function clearCardsStateFromLocalStorage(): void {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		window.localStorage.removeItem(STORAGE_KEY);
	} catch {
		// localStorage may be unavailable — ignore cleanup errors.
	}
}

export function saveCardsStateToLocalStorage(
	cards: IPeriodCard[],
	settingName: string,
): void {
	if (typeof window === 'undefined') {
		return;
	}

	try {
		if (cards.length === 0) {
			window.localStorage.removeItem(STORAGE_KEY);
			return;
		}

		window.localStorage.setItem(
			STORAGE_KEY,
			createCardsStateJson(cards, settingName),
		);
	} catch {
		// Ignore quota and privacy-mode errors — the app can still work in memory.
	}
}
