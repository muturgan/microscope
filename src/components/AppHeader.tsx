import { Fragment, h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';

interface IAppHeaderProps {
	settingName: string;
	cardsCount: number;
	onSave: () => void;
	onRequestReset: () => void;
	onUpdateSettingName: (settingName: string) => void;
}

export function AppHeader({
	settingName,
	cardsCount,
	onSave,
	onRequestReset,
	onUpdateSettingName,
}: IAppHeaderProps) {
	const [isEditingSettingName, setIsEditingSettingName] = useState(false);
	const [settingNameDraft, setSettingNameDraft] = useState('');
	const settingNameInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditingSettingName) {
			settingNameInputRef.current?.focus();
		}
	}, [isEditingSettingName]);

	const startEditingSettingName = () => {
		setSettingNameDraft(settingName);
		setIsEditingSettingName(true);
	};

	const cancelEditingSettingName = () => {
		setSettingNameDraft(settingName);
		setIsEditingSettingName(false);
	};

	return (
		<header className="app-header">
			<div className="app-header__heading">
				<span className="app-header__eyebrow">Создание сеттинга</span>
				<div className="app-header__title-row">
					{isEditingSettingName ? (
						<form
							className="app-header__setting-form"
							onSubmit={(event) => {
								event.preventDefault();
								const nextName = settingNameDraft.trim();

								if (nextName) {
									onUpdateSettingName(nextName);
									setIsEditingSettingName(false);
								}
							}}
						>
							<input
								ref={settingNameInputRef}
								value={settingNameDraft}
								placeholder="Название сеттинга"
								aria-label="Название сеттинга"
								onInput={(event) =>
									setSettingNameDraft(event.currentTarget.value)
								}
								onKeyDown={(event) => {
									if (event.key === 'Escape') {
										cancelEditingSettingName();
									}
								}}
							/>
							<button
								type="submit"
								className="app-header__icon-button tooltip-bottom"
								data-tooltip="Сохранить название"
								aria-label="Сохранить название"
								disabled={!settingNameDraft.trim()}
							>
								✓
							</button>
							<button
								type="button"
								className="app-header__icon-button tooltip-bottom"
								data-tooltip="Отменить редактирование"
								aria-label="Отменить редактирование"
								onClick={cancelEditingSettingName}
							>
								✕
							</button>
						</form>
					) : (
						<>
							<h1 className="app-header__title">
								{settingName || 'Новый сеттинг'}
							</h1>
							<button
								type="button"
								className="app-header__icon-button tooltip-bottom"
								data-tooltip="Редактировать название сеттинга"
								aria-label="Редактировать название сеттинга"
								onClick={startEditingSettingName}
							>
								✏️
							</button>
						</>
					)}
				</div>
				<p className="app-header__subtitle">
					Кнопки с символами:{' '}
					<span className="app-header__hint-key">+⏳</span> — новый период
					между соседними,{' '}
					<span className="app-header__hint-key">+⚡</span> — событие в
					периоде, <span className="app-header__hint-key">+🎭</span> —
					сцена в событии.
				</p>
			</div>
			<div className="app-header__actions">
				<span className="app-header__count">
					{cardsCount} {cardsCount === 1 ? 'период' : 'периодов'}
				</span>
				<button
					type="button"
					className="button button--ghost app-header__save-button tooltip-bottom"
					data-tooltip="Сбросить сеттинг и начать новый"
					aria-label="Сбросить сеттинг и начать новый"
					onClick={onRequestReset}
				>
					<span aria-hidden="true">🔄</span>
					<span>Сбросить</span>
				</button>
				<button
					type="button"
					className="button button--ghost app-header__save-button tooltip-bottom"
					data-tooltip="Сохранить состояние в JSON-файл"
					aria-label="Сохранить состояние в JSON-файл"
					disabled={cardsCount === 0}
					onClick={onSave}
				>
					<span aria-hidden="true">💾</span>
					<span>Сохранить</span>
				</button>
			</div>
		</header>
	);
}
