import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';

import { useStore } from '@nanostores/preact';

import { AppHeader } from './components/AppHeader';
import { CardFlow } from './components/CardFlow';
import { CardForm } from './components/forms/CardForm';
import { ConfirmModal } from './components/forms/ConfirmModal';
import { DeleteConfirmModal } from './components/forms/DeleteConfirmModal';
import { InitialPeriodsForm } from './components/forms/InitialPeriodsForm';
import {
	CARD_TYPE_CONFIG,
	EVENT_KIND_LABELS,
	EVENT_TITLE_EXAMPLES,
	getCardKindGenitiveLabel,
	getCardKindLabel,
	PERIOD_KIND_LABELS,
	PERIOD_TITLE_EXAMPLES,
	SCENE_KIND_LABELS,
	SCENE_TITLE_EXAMPLES,
} from './config/cardUi';
import {
	addEvent,
	addScene,
	cardsStore,
	deleteEventCard,
	deletePeriodCard,
	deleteSceneCard,
	getOppositeKind,
	initializeCards,
	insertPeriodCard,
	replaceCards,
	resetCardsState,
	settingNameStore,
	updateEventCard,
	updatePeriodCard,
	updateSceneCard,
	updateSettingName,
} from './stores/cards';
import {
	CardKind,
	CardType,
	type ICardEditTarget,
	type ICardInput,
} from './types/card';
import { clearCardsStateFromLocalStorage } from './utils/localState';
import { pickCardsStateFile, saveCardsState } from './utils/stateFile';

export function App() {
	const cards = useStore(cardsStore);
	const settingName = useStore(settingNameStore);
	const [insertAt, setInsertAt] = useState<number | null>(null);
	const [eventPeriodId, setEventPeriodId] = useState<string | null>(null);
	const [sceneEventId, setSceneEventId] = useState<string | null>(null);
	const [editTarget, setEditTarget] = useState<ICardEditTarget | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<ICardEditTarget | null>(
		null,
	);
	const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
	const [importError, setImportError] = useState<string | null>(null);

	const isInitial = cards.length === 0;
	const editConfig = editTarget
		? CARD_TYPE_CONFIG[editTarget.cardType]
		: undefined;
	const previousPeriod = insertAt !== null ? cards[insertAt - 1] : undefined;
	const lockedPeriodKind = previousPeriod
		? getOppositeKind(previousPeriod.kind)
		: undefined;

	const handleInsert = (title: string) => {
		if (insertAt !== null) {
			insertPeriodCard(insertAt, title);
		}

		setInsertAt(null);
	};

	const handleAddEvent = (title: string, kind: CardKind) => {
		if (eventPeriodId !== null) {
			addEvent(eventPeriodId, { title, kind });
		}

		setEventPeriodId(null);
	};

	const handleAddScene = (title: string, kind: CardKind) => {
		if (sceneEventId !== null) {
			addScene(sceneEventId, { title, kind });
		}

		setSceneEventId(null);
	};

	const handleEdit = (title: string, kind: CardKind) => {
		if (!editTarget) {
			return;
		}

		const input = { title, kind };

		if (editTarget.cardType === CardType.Period) {
			updatePeriodCard(editTarget.cardId, input);
		} else if (editTarget.cardType === CardType.Event) {
			updateEventCard(editTarget.cardId, input);
		} else {
			updateSceneCard(editTarget.cardId, input);
		}

		setEditTarget(null);
	};

	const handleDelete = () => {
		if (!deleteTarget) {
			return;
		}

		if (deleteTarget.cardType === CardType.Period) {
			deletePeriodCard(deleteTarget.cardId);
		} else if (deleteTarget.cardType === CardType.Event) {
			deleteEventCard(deleteTarget.cardId);
		} else {
			deleteSceneCard(deleteTarget.cardId);
		}

		setDeleteTarget(null);
	};

	const handleReset = () => {
		resetCardsState();
		clearCardsStateFromLocalStorage();
		setInsertAt(null);
		setEventPeriodId(null);
		setSceneEventId(null);
		setEditTarget(null);
		setDeleteTarget(null);
		setImportError(null);
		setIsResetConfirmOpen(false);
	};

	const handleInitialize = (
		nextSettingName: string,
		start: ICardInput,
		end: ICardInput,
	) => {
		initializeCards(nextSettingName, start, end);
	};

	const handleSave = async () => {
		try {
			await saveCardsState(cards, settingName);
		} catch (error) {
			window.alert(
				error instanceof Error
					? error.message
					: 'Не удалось сохранить состояние.',
			);
		}
	};

	const handleImport = async () => {
		try {
			const importedState = await pickCardsStateFile();

			if (importedState) {
				replaceCards(importedState.settingName, importedState.cards);
				setImportError(null);
			}
		} catch (error) {
			setImportError(
				error instanceof Error
					? error.message
					: 'Не удалось импортировать состояние.',
			);
		}
	};

	return (
		<Fragment>
			<AppHeader
				settingName={settingName}
				cardsCount={cards.length}
				onSave={handleSave}
				onRequestReset={() => setIsResetConfirmOpen(true)}
				onUpdateSettingName={updateSettingName}
			/>

			<CardFlow
				cards={cards}
				onInsert={setInsertAt}
				onAddEvent={setEventPeriodId}
				onAddScene={setSceneEventId}
				onEdit={setEditTarget}
				onDelete={setDeleteTarget}
			/>

			{isInitial ? (
				<InitialPeriodsForm
					onSubmit={handleInitialize}
					onImport={handleImport}
					importError={importError}
				/>
			) : insertAt !== null &&
			  previousPeriod !== undefined &&
			  lockedPeriodKind !== undefined ? (
				<CardForm
					key={`insert-${insertAt}`}
					heading="Новый период"
					hint={`Периоды чередуются: после ${getCardKindGenitiveLabel(PERIOD_KIND_LABELS, previousPeriod.kind)} идёт ${getCardKindLabel(PERIOD_KIND_LABELS, lockedPeriodKind).toLowerCase()}. Тип нового периода зафиксирован.`}
					radioName="insert-period-kind"
					kindLegend="Тип периода"
					kindLabels={PERIOD_KIND_LABELS}
					submitLabel="Добавить период"
					examples={PERIOD_TITLE_EXAMPLES}
					lockedKind={lockedPeriodKind}
					onCancel={() => setInsertAt(null)}
					onSubmit={handleInsert}
				/>
			) : eventPeriodId !== null ? (
				<CardForm
					key={`event-${eventPeriodId}`}
					heading="Новое событие"
					hint="Событие будет добавлено в выбранный период."
					radioName="insert-event-kind"
					kindLegend="Тип события"
					kindLabels={EVENT_KIND_LABELS}
					submitLabel="Добавить событие"
					examples={EVENT_TITLE_EXAMPLES}
					onCancel={() => setEventPeriodId(null)}
					onSubmit={handleAddEvent}
				/>
			) : sceneEventId !== null ? (
				<CardForm
					key={`scene-${sceneEventId}`}
					heading="Новая сцена"
					hint="Сцена будет добавлена в выбранное событие."
					radioName="insert-scene-kind"
					kindLegend="Тип сцены"
					kindLabels={SCENE_KIND_LABELS}
					submitLabel="Добавить сцену"
					examples={SCENE_TITLE_EXAMPLES}
					onCancel={() => setSceneEventId(null)}
					onSubmit={handleAddScene}
				/>
			) : editTarget !== null && editConfig !== undefined ? (
				<CardForm
					key={`edit-${editTarget.cardType}-${editTarget.cardId}`}
					heading={editConfig.heading}
					hint="Измените название и тип карточки."
					radioName={`edit-${editTarget.cardId}-kind`}
					kindLegend={editConfig.kindLegend}
					kindLabels={editConfig.kindLabels}
					submitLabel="Сохранить"
					examples={editConfig.examples}
					initialTitle={editTarget.title}
					initialKind={editTarget.kind}
					onCancel={() => setEditTarget(null)}
					onSubmit={handleEdit}
				/>
			) : deleteTarget !== null ? (
				<DeleteConfirmModal
					target={deleteTarget}
					onCancel={() => setDeleteTarget(null)}
					onConfirm={handleDelete}
				/>
			) : isResetConfirmOpen ? (
				<ConfirmModal
					heading="Сбросить сеттинг?"
					hint="Вы действительно хотите сбросить текущий сеттинг и начать новый? Все периоды, события, сцены и сохранённое состояние будут удалены."
					confirmLabel="Сбросить"
					confirmTooltip="Подтвердить сброс"
					cancelTooltip="Отменить сброс"
					onCancel={() => setIsResetConfirmOpen(false)}
					onConfirm={handleReset}
				/>
			) : null}
		</Fragment>
	);
}
