import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

import { CardFields } from './CardFields';
import {
	INITIAL_END_PERIOD_PLACEHOLDER,
	INITIAL_START_PERIOD_PLACEHOLDER,
	PERIOD_KIND_LABELS,
	SETTING_NAME_PLACEHOLDER,
} from '../../config/cardUi';
import { CardKind, type ICardInput } from '../../types/card';

interface IInitialPeriodsFormProps {
	onSubmit: (settingName: string, start: ICardInput, end: ICardInput) => void;
	onImport: () => void;
	importError: string | null;
}

export function InitialPeriodsForm({
	onSubmit,
	onImport,
	importError,
}: IInitialPeriodsFormProps) {
	const [settingName, setSettingName] = useState('');
	const [startTitle, setStartTitle] = useState('');
	const [startKind, setStartKind] = useState<CardKind>(CardKind.Good);
	const [endTitle, setEndTitle] = useState('');
	const [endKind, setEndKind] = useState<CardKind>(CardKind.Bad);
	const settingInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		settingInputRef.current?.focus();
	}, []);

	const normalizedSettingName = settingName.trim();
	const normalizedStartTitle = startTitle.trim();
	const normalizedEndTitle = endTitle.trim();

	return (
		<div className="modal-backdrop">
			<form
				className="period-form period-form--initial"
				onSubmit={(event) => {
					event.preventDefault();

					if (
						normalizedSettingName &&
						normalizedStartTitle &&
						normalizedEndTitle
					) {
						onSubmit(
							normalizedSettingName,
							{ title: normalizedStartTitle, kind: startKind },
							{ title: normalizedEndTitle, kind: endKind },
						);
					}
				}}
			>
				<h2 className="period-form__title">Создание сеттинга</h2>
				<p className="period-form__hint">
					Введите название сеттинга, затем задайте его временные границы.
				</p>

				<label className="period-form__field period-form__setting-name">
					<span>Название сеттинга</span>
					<input
						ref={settingInputRef}
						value={settingName}
						placeholder={SETTING_NAME_PLACEHOLDER}
						onInput={(event) => setSettingName(event.currentTarget.value)}
					/>
				</label>

				<section className="period-form__section">
					<h3 className="period-form__section-title">
						Начальный и конечный периоды
					</h3>
					<p className="period-form__section-hint">
						Задайте два периода, которые станут границами шкалы. Для
						начальных периодов правило чередования не применяется.
					</p>
				</section>

				<div className="initial-periods">
					<section className="initial-period">
						<h3 className="initial-period__title">Начальный период</h3>
						<CardFields
							name="start-period-kind"
							title={startTitle}
							kind={startKind}
							kindLegend="Тип периода"
							kindLabels={PERIOD_KIND_LABELS}
							placeholder={INITIAL_START_PERIOD_PLACEHOLDER}
							onTitleChange={setStartTitle}
							onKindChange={setStartKind}
						/>
					</section>

					<section className="initial-period">
						<h3 className="initial-period__title">Конечный период</h3>
						<CardFields
							name="end-period-kind"
							title={endTitle}
							kind={endKind}
							kindLegend="Тип периода"
							kindLabels={PERIOD_KIND_LABELS}
							placeholder={INITIAL_END_PERIOD_PLACEHOLDER}
							onTitleChange={setEndTitle}
							onKindChange={setEndKind}
						/>
					</section>
				</div>

				{importError && (
					<p className="period-form__error" role="alert">
						{importError}
					</p>
				)}

				<div className="period-form__actions">
					<button
						type="button"
						className="button button--ghost period-form__import"
						data-tooltip="Импортировать состояние из JSON-файла"
						aria-label="Импортировать состояние из JSON-файла"
						onClick={onImport}
					>
						<span aria-hidden="true">📂</span>
						<span>Импорт</span>
					</button>
					<button
						type="submit"
						className="button button--primary"
						data-tooltip="Создать сеттинг"
						aria-label="Создать сеттинг"
						disabled={
							!normalizedSettingName ||
							!normalizedStartTitle ||
							!normalizedEndTitle
						}
					>
						Создать периоды
					</button>
				</div>
			</form>
		</div>
	);
}
