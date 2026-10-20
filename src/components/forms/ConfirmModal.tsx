import { h } from 'preact';

import { useEscapeKey } from '../../hooks/useEscapeKey';

interface IConfirmModalProps {
	heading: string;
	hint: string;
	confirmLabel: string;
	confirmTooltip?: string;
	cancelTooltip?: string;
	onCancel: () => void;
	onConfirm: () => void;
}

export function ConfirmModal({
	heading,
	hint,
	confirmLabel,
	confirmTooltip,
	cancelTooltip,
	onCancel,
	onConfirm,
}: IConfirmModalProps) {
	useEscapeKey({ onEscape: onCancel });

	return (
		<div className="modal-backdrop">
			<div
				className="period-form period-form--confirm"
				role="dialog"
				aria-modal="true"
				aria-labelledby="confirm-modal-title"
			>
				<h2 id="confirm-modal-title" className="period-form__title">
					{heading}
				</h2>
				<p className="period-form__hint">{hint}</p>
				<div className="period-form__actions">
					<button
						type="button"
						className="button button--ghost"
						data-tooltip={cancelTooltip ?? 'Отменить действие'}
						aria-label={cancelTooltip ?? 'Отменить действие'}
						onClick={onCancel}
					>
						Отмена
					</button>
					<button
						type="button"
						className="button button--danger"
						data-tooltip={confirmTooltip ?? confirmLabel}
						aria-label={confirmTooltip ?? confirmLabel}
						onClick={onConfirm}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
