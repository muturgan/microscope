import {
	CardKind,
	CardType,
	type IEventCard,
	type IPeriodCard,
	type ISceneCard,
} from '../types/card';

interface ICardsStateFile {
	version: 1;
	settingName: string;
	cards: IPeriodCard[];
}

export interface IParsedCardsState {
	settingName: string;
	cards: IPeriodCard[];
}

interface ISavePickerOptions {
	suggestedName?: string;
	types?: Array<{
		description?: string;
		accept: Record<string, string[]>;
	}>;
}

interface IWritableFileStream {
	write(data: Blob): Promise<void>;
	close(): Promise<void>;
}

interface IFileSystemFileHandle {
	createWritable(): Promise<IWritableFileStream>;
}

interface IWindowWithSavePicker extends Window {
	showSaveFilePicker?: (
		options?: ISavePickerOptions,
	) => Promise<IFileSystemFileHandle>;
}

const DEFAULT_FILE_NAME = 'microscope-state.json';
const DEFAULT_SETTING_NAME = 'Без названия';

function getSavePickerOptions(fileName: string): ISavePickerOptions {
	return {
		suggestedName: fileName,
		types: [
			{
				description: 'JSON',
				accept: { 'application/json': ['.json'] },
			},
		],
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function readString(value: unknown, field: string, path: string): string {
	if (typeof value !== 'string' || value.trim() === '') {
		throw new Error(`${path}: поле «${field}» должно быть непустой строкой.`);
	}

	return value;
}

function readId(value: unknown, path: string, seenIds: Set<string>): string {
	const id = readString(value, 'id', path);

	if (seenIds.has(id)) {
		throw new Error(`${path}: повторяющийся id «${id}».`);
	}

	seenIds.add(id);

	return id;
}

function readKind(value: unknown, path: string): CardKind {
	if (value !== CardKind.Good && value !== CardKind.Bad) {
		throw new Error(`${path}: поле «kind» должно быть 0 или 1.`);
	}

	return value;
}

function parseScene(
	value: unknown,
	path: string,
	seenIds: Set<string>,
): ISceneCard {
	if (!isRecord(value)) {
		throw new Error(`${path}: сцена должна быть объектом.`);
	}

	if (value.type !== CardType.Scene) {
		throw new Error(`${path}: ожидается карточка типа «сцена».`);
	}

	return {
		id: readId(value.id, path, seenIds),
		title: readString(value.title, 'title', path),
		kind: readKind(value.kind, path),
		type: CardType.Scene,
	};
}

function parseEvent(
	value: unknown,
	path: string,
	seenIds: Set<string>,
): IEventCard {
	if (!isRecord(value)) {
		throw new Error(`${path}: событие должно быть объектом.`);
	}

	if (value.type !== CardType.Event) {
		throw new Error(`${path}: ожидается карточка типа «событие».`);
	}

	if (!Array.isArray(value.scenes)) {
		throw new Error(`${path}: поле «scenes» должно быть массивом.`);
	}

	return {
		id: readId(value.id, path, seenIds),
		title: readString(value.title, 'title', path),
		kind: readKind(value.kind, path),
		type: CardType.Event,
		scenes: value.scenes.map((scene, index) =>
			parseScene(scene, `${path}, сцена ${index + 1}`, seenIds),
		),
	};
}

function parsePeriod(
	value: unknown,
	path: string,
	seenIds: Set<string>,
): IPeriodCard {
	if (!isRecord(value)) {
		throw new Error(`${path}: период должен быть объектом.`);
	}

	if (value.type !== CardType.Period) {
		throw new Error(`${path}: ожидается карточка типа «период».`);
	}

	if (!Array.isArray(value.events)) {
		throw new Error(`${path}: поле «events» должно быть массивом.`);
	}

	return {
		id: readId(value.id, path, seenIds),
		title: readString(value.title, 'title', path),
		kind: readKind(value.kind, path),
		type: CardType.Period,
		events: value.events.map((event, index) =>
			parseEvent(event, `${path}, событие ${index + 1}`, seenIds),
		),
	};
}

export function createCardsStateJson(
	cards: IPeriodCard[],
	settingName: string,
): string {
	const state: ICardsStateFile = {
		version: 1,
		settingName,
		cards,
	};

	return JSON.stringify(state, null, 2);
}

export function parseCardsState(text: string): IParsedCardsState {
	let data: unknown;

	try {
		data = JSON.parse(text);
	} catch {
		throw new Error('Не удалось прочитать JSON-файл.');
	}

	if (isRecord(data) && 'version' in data && data.version !== 1) {
		throw new Error('Неподдерживаемая версия файла состояния.');
	}

	const settingName =
		isRecord(data) && typeof data.settingName === 'string'
			? data.settingName.trim()
			: DEFAULT_SETTING_NAME;

	const rawCards = Array.isArray(data)
		? data
		: isRecord(data) && Array.isArray(data.cards)
			? data.cards
			: null;

	if (!rawCards) {
		throw new Error('Файл не содержит состояние карточек.');
	}

	const seenIds = new Set<string>();
	const cards = rawCards.map((card, index) =>
		parsePeriod(card, `Период ${index + 1}`, seenIds),
	);

	if (cards.length < 2) {
		throw new Error('В состоянии должно быть минимум два периода.');
	}

	return {
		settingName: settingName || DEFAULT_SETTING_NAME,
		cards,
	};
}

function normalizeFileName(fileName: string): string {
	const safeName = fileName.replace(/[\\/:*?"<>|]+/g, '-').trim();

	if (!safeName) {
		return DEFAULT_FILE_NAME;
	}

	return safeName.toLowerCase().endsWith('.json')
		? safeName
		: `${safeName}.json`;
}

function downloadJson(json: string, suggestedFileName: string): void {
	const fileName = window.prompt('Название файла', suggestedFileName);

	if (fileName === null) {
		return;
	}

	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');

	link.href = url;
	link.download = normalizeFileName(fileName);
	document.body.append(link);
	link.click();
	link.remove();

	setTimeout(() => URL.revokeObjectURL(url), 0);
}

export async function saveCardsState(
	cards: IPeriodCard[],
	settingName: string,
): Promise<void> {
	const json = createCardsStateJson(cards, settingName);
	const suggestedFileName = normalizeFileName(
		settingName.trim() || DEFAULT_FILE_NAME,
	);
	const windowWithPicker = window as IWindowWithSavePicker;

	if (windowWithPicker.showSaveFilePicker) {
		try {
			const handle = await windowWithPicker.showSaveFilePicker(
				getSavePickerOptions(suggestedFileName),
			);
			const writable = await handle.createWritable();

			await writable.write(new Blob([json], { type: 'application/json' }));
			await writable.close();

			return;
		} catch (error) {
			if (error instanceof DOMException && error.name === 'AbortError') {
				return;
			}
		}
	}

	downloadJson(json, suggestedFileName);
}

function pickJsonFile(): Promise<File | null> {
	return new Promise((resolve) => {
		const input = document.createElement('input');

		input.type = 'file';
		input.accept = '.json,application/json';
		input.style.position = 'fixed';
		input.style.left = '-10000px';

		const finish = (file: File | null) => {
			input.remove();
			resolve(file);
		};

		input.addEventListener('change', () => finish(input.files?.[0] ?? null), {
			once: true,
		});
		input.addEventListener('cancel', () => finish(null), { once: true });

		document.body.append(input);
		input.click();
	});
}

export async function pickCardsStateFile(): Promise<IParsedCardsState | null> {
	const file = await pickJsonFile();

	if (!file) {
		return null;
	}

	return parseCardsState(await file.text());
}
