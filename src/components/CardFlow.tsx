import { h } from 'preact';

import {
	Background,
	Controls,
	type Edge,
	MarkerType,
	ReactFlow,
} from '@xyflow/react';

import { nodeTypes } from './cards/PeriodNode';
import type { CardFlowNode, ICardEditTarget, IPeriodCard } from '../types/card';

// Шаг по X для React Flow: --period-card-width + 70px из styles/desktop.css.
const PERIOD_STEP = 428;

interface ICardFlowProps {
	cards: IPeriodCard[];
	onInsert: (index: number) => void;
	onAddEvent: (periodId: string) => void;
	onAddScene: (eventId: string) => void;
	onEdit: (target: ICardEditTarget) => void;
	onDelete: (target: ICardEditTarget) => void;
}

export function CardFlow({
	cards,
	onInsert,
	onAddEvent,
	onAddScene,
	onEdit,
	onDelete,
}: ICardFlowProps) {
	const nodes: CardFlowNode[] = cards.map((card, index) => ({
		id: card.id,
		type: 'card',
		position: {
			x: index * PERIOD_STEP,
			y: 0,
		},
		data: {
			card,
			index,
			canInsert: index < cards.length - 1,
			onInsert,
			onAddEvent,
			onAddScene,
			onEdit,
			onDelete,
		},
		draggable: false,
	}));

	const edges: Edge[] = cards.slice(1).map((card, index) => {
		const previous = cards[index];

		return {
			id: `edge-${previous.id}-${card.id}`,
			source: previous.id,
			target: card.id,
			type: 'smoothstep',
			markerEnd: {
				type: MarkerType.ArrowClosed,
				width: 18,
				height: 18,
				color: 'var(--edge-color)',
			},
		};
	});

	return (
		<div className="flow">
			<ReactFlow
				key={cards.length}
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				fitView
				fitViewOptions={{ padding: 0.25, maxZoom: 1.2 }}
				minZoom={0.25}
				maxZoom={1.5}
				nodesDraggable={false}
				nodesConnectable={false}
				elementsSelectable={false}
				proOptions={{ hideAttribution: true }}
			>
				<Background gap={24} size={1} />
				<Controls showInteractive={false} />
			</ReactFlow>
		</div>
	);
}
