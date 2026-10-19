import { Fragment, h } from 'preact';

interface IAddButtonContentProps {
	symbol: string;
}

export function AddButtonContent({ symbol }: IAddButtonContentProps) {
	return (
		<>
			<span className="add-button__plus" aria-hidden="true">
				+
			</span>
			<span className="add-button__symbol" aria-hidden="true">
				{symbol}
			</span>
		</>
	);
}

interface IEditButtonProps {
	tooltip: string;
	onEdit: () => void;
}

export function EditButton({ tooltip, onEdit }: IEditButtonProps) {
	return (
		<button
			type="button"
			className="edit-button tooltip-bottom"
			data-tooltip={tooltip}
			aria-label={tooltip}
			onClick={(event) => {
				event.stopPropagation();
				onEdit();
			}}
		>
			<span aria-hidden="true">✏️</span>
		</button>
	);
}

interface IDeleteButtonProps {
	tooltip: string;
	onDelete: () => void;
}

export function DeleteButton({ tooltip, onDelete }: IDeleteButtonProps) {
	return (
		<button
			type="button"
			className="delete-button"
			data-tooltip={tooltip}
			aria-label={tooltip}
			onClick={(event) => {
				event.stopPropagation();
				onDelete();
			}}
		>
			<span aria-hidden="true">🗑️</span>
		</button>
	);
}
