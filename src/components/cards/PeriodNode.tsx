import { h } from 'preact';

import { Handle, type NodeProps, Position } from '@xyflow/react';

import {
	AddButtonContent,
	DeleteButton,
	EditButton,
} from './CardActionButtons';
import { EventCard } from './EventCard';
import {
	cardKindModifier,
	EVENT_ADD_SYMBOL,
	getCardKindLabel,
	PERIOD_ADD_SYMBOL,
	PERIOD_KIND_LABELS,
} from '../../config/cardUi';
import { type CardFlowNode, CardType } from '../../types/card';

export function PeriodNode({ data }: NodeProps<CardFlowNode>) {
	const {
		card,
		index,
		canInsert,
		onInsert,
		onAddEvent,
		onAddScene,
		onEdit,
		onDelete,
	} = data;
	const kindModifier = cardKindModifier(card.kind);

	return (
		<div className="period-group">
			<div className={`period-card period-card--${kindModifier}`}>
				<EditButton
					tooltip="Редактировать период"
					onEdit={() =>
						onEdit({
							cardType: CardType.Period,
							cardId: card.id,
							title: card.title,
							kind: card.kind,
						})
					}
				/>
				<DeleteButton
					tooltip="Удалить период"
					onDelete={() =>
						onDelete({
							cardType: CardType.Period,
							cardId: card.id,
							title: card.title,
							kind: card.kind,
						})
					}
				/>

				<Handle
					type="target"
					position={Position.Left}
					className="period-handle"
				/>

				<div className="period-card__body">
					<span className="period-card__title">{card.title}</span>
					<span
						className={`period-dot period-dot--${kindModifier}`}
						title={getCardKindLabel(PERIOD_KIND_LABELS, card.kind)}
						aria-label={getCardKindLabel(PERIOD_KIND_LABELS, card.kind)}
					/>
				</div>

				{canInsert && (
					<button
						type="button"
						className="add-button period-card__insert nodrag nopan"
						data-tooltip="Вставить новый период между соседними"
						aria-label="Вставить новый период между соседними"
						onClick={(event) => {
							event.stopPropagation();
							onInsert(index + 1);
						}}
					>
						<AddButtonContent symbol={PERIOD_ADD_SYMBOL} />
					</button>
				)}

				<button
					type="button"
					className="add-button period-card__add-event nodrag nopan"
					data-tooltip="Добавить событие в этот период"
					aria-label="Добавить событие в этот период"
					onClick={(event) => {
						event.stopPropagation();
						onAddEvent(card.id);
					}}
				>
					<AddButtonContent symbol={EVENT_ADD_SYMBOL} />
				</button>

				<Handle
					type="source"
					position={Position.Right}
					className="period-handle"
				/>
			</div>

			{card.events.length > 0 && (
				<div className="period-events">
					{card.events.map((event) => (
						<EventCard
							key={event.id}
							event={event}
							onAddEvent={() => onAddEvent(card.id)}
							onAddScene={() => onAddScene(event.id)}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export const nodeTypes = {
	card: PeriodNode,
};
