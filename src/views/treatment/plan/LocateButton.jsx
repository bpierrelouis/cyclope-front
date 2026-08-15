import { LocateIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useControl } from 'react-map-gl/maplibre';

import { iconSizes } from '../../../constants';

class LocateControl {
    constructor(onClick) {
        this._onClick = onClick;
        this._root = null;
        this._button = null;
        this._navGroup = null;
    }

    onAdd(map) {
        this._container = document.createElement('div');
        this._container.style.display = 'none';

        const inject = () => {
            if (this._button) return;

            this._navGroup = map
                .getContainer()
                .querySelector('.maplibregl-ctrl-top-right .maplibregl-ctrl-group');

            if (!this._navGroup) return;

            this._button = document.createElement('button');
            this._button.className = 'maplibregl-ctrl-locate';
            this._button.type = 'button';
            this._button.title = 'Recentrer';
            this._button.setAttribute('aria-label', 'Recentrer la carte');
            this._button.onclick = this._onClick;

            this._root = createRoot(this._button);
            this._root.render(<LocateIcon size={iconSizes.sm} />);

            this._navGroup.appendChild(this._button);
            this._button.onclick = () => this._onClick.current();
        };

        if (map.loaded()) {
            inject();
        } else {
            map.once('load', inject);
        }

        return this._container;
    }

    onRemove() {
        const root = this._root;
        const button = this._button;
        const container = this._container;
        this._root = null;
        this._button = null;

        queueMicrotask(() => {
            root?.unmount();
            button?.remove();
            container?.remove();
        });
    }
}

export function LocateButton({ onClick }) {
    const onClickRef = useRef(onClick);
    useEffect(() => {
        onClickRef.current = onClick;
    }, [onClick]);
    useControl(() => new LocateControl(onClickRef), { position: 'top-right' });
    return null;
}
