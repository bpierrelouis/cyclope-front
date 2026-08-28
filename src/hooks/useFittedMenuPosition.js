import { useLayoutEffect, useRef, useState } from 'react';

const VIEWPORT_MARGIN = 8;

export function useFittedMenuPosition(position) {
    const menuRef = useRef(null);
    const [fittedPosition, setFittedPosition] = useState(null);

    useLayoutEffect(() => {
        const menu = menuRef.current;
        if (!menu || !position) return undefined;

        const fitInViewport = () => {
            const rect = menu.getBoundingClientRect();
            const maxLeft = Math.max(
                VIEWPORT_MARGIN,
                window.innerWidth - rect.width - VIEWPORT_MARGIN,
            );
            const maxTop = Math.max(
                VIEWPORT_MARGIN,
                window.innerHeight - rect.height - VIEWPORT_MARGIN,
            );

            setFittedPosition({
                left: Math.min(Math.max(position.left, VIEWPORT_MARGIN), maxLeft),
                top: Math.min(Math.max(position.top, VIEWPORT_MARGIN), maxTop),
            });
        };

        fitInViewport();
        const resizeObserver = new ResizeObserver(fitInViewport);
        resizeObserver.observe(menu);
        window.addEventListener('resize', fitInViewport);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', fitInViewport);
        };
    }, [position]);

    return {
        menuRef,
        menuStyle: {
            left: fittedPosition?.left ?? position?.left,
            top: fittedPosition?.top ?? position?.top,
        },
    };
}
