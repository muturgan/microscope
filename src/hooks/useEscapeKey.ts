import { useEffect, useRef } from 'preact/hooks';

interface IUseEscapeKeyOptions {
	/** Закрывать ли по Escape. По умолчанию — true. */
	enabled?: boolean;
	/** Обработчик нажатия Escape. */
	onEscape: () => void;
}

/**
 * Закрывает модальное окно по нажатию Escape.
 *
 * Слушатель `keydown` подписывается один раз при монтировании
 * компонента и корректно снимается при размонтировании.
 * Актуальный обработчик хранится в ref, поэтому перерендер
 * родителя с новыми inline-колбэками не создаёт лишних подписок.
 */
export function useEscapeKey({
	enabled = true,
	onEscape,
}: IUseEscapeKeyOptions) {
	const onEscapeRef = useRef(onEscape);

	useEffect(() => {
		onEscapeRef.current = onEscape;
	}, [onEscape]);

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onEscapeRef.current();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [enabled]);
}
