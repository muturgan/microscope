import { h } from 'preact';

import {
	AddButtonContent,
	DeleteButton,
	EditButton,
} from './CardActionButtons';
import { SceneCard } from './SceneCard';
import {
	cardKindModifier,
	EVENT_ADD_SYMBOL,
	EVENT_KIND_LABELS,
	getCardKindLabel,
	SCENE_ADD_SYMBOL,
} from '../../config/cardUi';
import {
	CardType,
	type ICardEditTarget,
	type IEventCard,
} from '../../types/card';

interface IEventCardProps {
	event: IEventCard;
	onAddEvent: () => void;
	onAddScene: () => void;
	onEdit: (target: ICardEditTarget) => void;
	onDelete: (target: ICardEditTarget) => void;
}

export function EventCard({
	event,
	onAddEvent,
	onAddScene,
	onEdit,
	onDelete,
}: IEventCardProps) {
	const kindModifier = cardKindModifier(event.kind);

	return (
		<div className="event-row">
			<div className={`event-card event-card--${kindModifier}`}>
				<EditButton
					tooltip="Редактировать событие"
					onEdit={() =>
						onEdit({
							cardType: CardType.Event,
							cardId: event.id,
							title: event.title,
							kind: event.kind,
						})
					}
				/>
				<DeleteButton
					tooltip="Удалить событие"
					onDelete={() =>
						onDelete({
							cardType: CardType.Event,
							cardId: event.id,
							title: event.title,
							kind: event.kind,
						})
					}
				/>

				<div className="event-card__body">
					<span className="event-card__title">{event.title}</span>
					<span
						className={`period-dot period-dot--${kindModifier}`}
						title={getCardKindLabel(EVENT_KIND_LABELS, event.kind)}
						aria-label={getCardKindLabel(EVENT_KIND_LABELS, event.kind)}
					/>
				</div>

				<button
					type="button"
					className="add-button event-card__add-scene nodrag nopan"
					data-tooltip="Добавить сцену в это событие"
					aria-label="Добавить сцену в это событие"
					onClick={(clickEvent) => {
						clickEvent.stopPropagation();
						onAddScene();
					}}
				>
					<AddButtonContent symbol={SCENE_ADD_SYMBOL} />
				</button>

				<button
					type="button"
					className="add-button event-card__insert nodrag nopan"
					data-tooltip="Добавить ещё одно событие в этот период"
					aria-label="Добавить ещё одно событие в этот период"
					onClick={(clickEvent) => {
						clickEvent.stopPropagation();
						onAddEvent();
					}}
				>
					<AddButtonContent symbol={EVENT_ADD_SYMBOL} />
				</button>
			</div>

			{event.scenes.length > 0 && (
				<div className="event-scenes">
					{event.scenes.map((scene) => (
						<SceneCard
							key={scene.id}
							scene={scene}
							onAddScene={onAddScene}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))}
				</div>
			)}
		</div>
	);
}
