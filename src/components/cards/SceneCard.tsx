import { h } from 'preact';

import {
	AddButtonContent,
	DeleteButton,
	EditButton,
} from './CardActionButtons';
import {
	cardKindModifier,
	getCardKindLabel,
	SCENE_ADD_SYMBOL,
	SCENE_KIND_LABELS,
} from '../../config/cardUi';
import {
	CardType,
	type ICardEditTarget,
	type ISceneCard,
} from '../../types/card';

interface ISceneCardProps {
	scene: ISceneCard;
	onAddScene: () => void;
	onEdit: (target: ICardEditTarget) => void;
	onDelete: (target: ICardEditTarget) => void;
}

export function SceneCard({
	scene,
	onAddScene,
	onEdit,
	onDelete,
}: ISceneCardProps) {
	const kindModifier = cardKindModifier(scene.kind);

	return (
		<div className={`scene-card scene-card--${kindModifier}`}>
			<EditButton
				tooltip="Редактировать сцену"
				onEdit={() =>
					onEdit({
						cardType: CardType.Scene,
						cardId: scene.id,
						title: scene.title,
						kind: scene.kind,
					})
				}
			/>
			<DeleteButton
				tooltip="Удалить сцену"
				onDelete={() =>
					onDelete({
						cardType: CardType.Scene,
						cardId: scene.id,
						title: scene.title,
						kind: scene.kind,
					})
				}
			/>

			<div className="scene-card__body">
				<span className="scene-card__title">{scene.title}</span>
				<span
					className={`period-dot period-dot--${kindModifier}`}
					title={getCardKindLabel(SCENE_KIND_LABELS, scene.kind)}
					aria-label={getCardKindLabel(SCENE_KIND_LABELS, scene.kind)}
				/>
			</div>

			<button
				type="button"
				className="add-button scene-card__insert nodrag nopan"
				data-tooltip="Добавить ещё одну сцену в это событие"
				aria-label="Добавить ещё одну сцену в это событие"
				onClick={(event) => {
					event.stopPropagation();
					onAddScene();
				}}
			>
				<AddButtonContent symbol={SCENE_ADD_SYMBOL} />
			</button>
		</div>
	);
}
