import { h } from 'preact';
import { useState } from 'preact/hooks';

import { CardFields } from './CardFields';
import {
	getRandomPlaceholder,
	type ICardKindLabels,
} from '../../config/cardUi';
import { CardKind } from '../../types/card';

interface ICardFormProps {
	heading: string;
	hint: string;
	radioName: string;
	kindLegend: string;
	kindLabels: ICardKindLabels;
	submitLabel: string;
	examples: readonly string[];
	initialTitle?: string;
	initialKind?: CardKind;
	lockedKind?: CardKind;
	onCancel: () => void;
	onSubmit: (title: string, kind: CardKind) => void;
}

export function CardForm({
	heading,
	hint,
	radioName,
	kindLegend,
	kindLabels,
	submitLabel,
	examples,
	initialTitle,
	initialKind,
	lockedKind,
	onCancel,
	onSubmit,
}: ICardFormProps) {
	const [title, setTitle] = useState(initialTitle ?? '');
	const [kind, setKind] = useState<CardKind>(
		lockedKind ?? initialKind ?? CardKind.Good,
	);
	const [placeholder] = useState(() => getRandomPlaceholder(examples));

	const normalizedTitle = title.trim();

	return (
		<div className="modal-backdrop">
			<form
				className="period-form"
				onSubmit={(event) => {
					event.preventDefault();

					if (normalizedTitle) {
						onSubmit(normalizedTitle, kind);
					}
				}}
			>
				<h2 className="period-form__title">{heading}</h2>
				<p className="period-form__hint">{hint}</p>

				<CardFields
					name={radioName}
					title={title}
					kind={kind}
					kindLegend={kindLegend}
					kindLabels={kindLabels}
					placeholder={placeholder}
					kindLocked={lockedKind !== undefined}
					autoFocus
					onTitleChange={setTitle}
					onKindChange={setKind}
				/>

				<div className="period-form__actions">
					<button
						type="button"
						className="button button--ghost"
						data-tooltip={
							initialTitle
								? 'Отменить редактирование'
								: 'Отменить создание карточки'
						}
						aria-label={
							initialTitle
								? 'Отменить редактирование'
								: 'Отменить создание карточки'
						}
						onClick={onCancel}
					>
						Отмена
					</button>
					<button
						type="submit"
						className="button button--primary"
						data-tooltip={
							initialTitle ? 'Сохранить изменения' : submitLabel
						}
						aria-label={
							initialTitle ? 'Сохранить изменения' : submitLabel
						}
						disabled={!normalizedTitle}
					>
						{submitLabel}
					</button>
				</div>
			</form>
		</div>
	);
}
