import { Fragment, h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

import {
	cardKindModifier,
	getCardKindLabel,
	type ICardKindLabels,
} from '../../config/cardUi';
import { CardKind } from '../../types/card';

interface ICardFieldsProps {
	name: string;
	title: string;
	kind: CardKind;
	kindLegend: string;
	kindLabels: ICardKindLabels;
	placeholder: string;
	kindLocked?: boolean;
	autoFocus?: boolean;
	onTitleChange: (title: string) => void;
	onKindChange: (kind: CardKind) => void;
}

export function CardFields({
	name,
	title,
	kind,
	kindLegend,
	kindLabels,
	placeholder,
	kindLocked = false,
	autoFocus,
	onTitleChange,
	onKindChange,
}: ICardFieldsProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (autoFocus) {
			inputRef.current?.focus();
		}
	}, [autoFocus]);

	return (
		<>
			<label className="period-form__field">
				<span>Название</span>
				<input
					ref={inputRef}
					value={title}
					placeholder={placeholder}
					onInput={(event) => onTitleChange(event.currentTarget.value)}
				/>
			</label>

			{kindLocked ? (
				<div className="period-form__locked-kind">
					<span
						className={`period-dot period-dot--${cardKindModifier(kind)}`}
						aria-hidden="true"
					/>
					<span>
						{kindLegend}: {getCardKindLabel(kindLabels, kind)}
					</span>
				</div>
			) : (
				<fieldset className="period-form__types">
					<legend>{kindLegend}</legend>

					<label
						className={`type-option ${kind === CardKind.Good ? 'type-option--active' : ''}`}
					>
						<input
							type="radio"
							name={name}
							value={CardKind.Good}
							checked={kind === CardKind.Good}
							onChange={() => onKindChange(CardKind.Good)}
						/>
						<span
							className="period-dot period-dot--good"
							aria-hidden="true"
						/>
						<span>{kindLabels.good}</span>
					</label>

					<label
						className={`type-option ${kind === CardKind.Bad ? 'type-option--active' : ''}`}
					>
						<input
							type="radio"
							name={name}
							value={CardKind.Bad}
							checked={kind === CardKind.Bad}
							onChange={() => onKindChange(CardKind.Bad)}
						/>
						<span
							className="period-dot period-dot--bad"
							aria-hidden="true"
						/>
						<span>{kindLabels.bad}</span>
					</label>
				</fieldset>
			)}
		</>
	);
}
