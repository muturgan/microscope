import { h } from 'preact';

import { ConfirmModal } from './ConfirmModal';
import { DELETE_CONFIRM_TEXT } from '../../config/cardUi';
import type { ICardEditTarget } from '../../types/card';

interface IDeleteConfirmModalProps {
	target: ICardEditTarget;
	onCancel: () => void;
	onConfirm: () => void;
}

export function DeleteConfirmModal({
	target,
	onCancel,
	onConfirm,
}: IDeleteConfirmModalProps) {
	const text = DELETE_CONFIRM_TEXT[target.cardType];

	return (
		<ConfirmModal
			heading={text.heading}
			hint={`Вы действительно хотите удалить «${target.title}»? ${text.description}`}
			confirmLabel="Удалить"
			confirmTooltip="Подтвердить удаление"
			cancelTooltip="Отменить удаление"
			onCancel={onCancel}
			onConfirm={onConfirm}
		/>
	);
}
