import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useShallow } from 'zustand/react/shallow';

import { BOX_HANDLES, MIN_BOX_SIZE } from '../../constants';
import { useDetectionCatalogStore } from '../../stores';
import {
    clamp,
    cn,
    getDetectionBackgroundStyle,
    getDetectionColor,
    getObjectBox,
    getPointerPosition,
    rectFrom,
    sameName,
    toBoundingBox,
    toNormalizedBox,
    updateObjectBox,
} from '../../utils';

/**
 * Éditeur de rectangles de détection par-dessus la frame : tracé de nouveaux
 * rectangles à la souris, déplacement, redimensionnement, choix du type et
 * suppression. Les boîtes émises via onChange utilisent le format bbox du back.
 */
export function BoxEditor(props) {
    const {
        src, objects, onChange, dialogElement,
    } = props;
    const overlayRef = useRef(null);
    const dragRef = useRef(null);
    const [natural, setNatural] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [menuPosition, setMenuPosition] = useState(null);


    const { categories, detections } = useDetectionCatalogStore(useShallow((state) => ({
        categories: state.categories,
        detections: state.detections,
    })));



    const colorOf = (type) => getDetectionColor(type, detections, categories);

    const toPoint = (event) => getPointerPosition(event, overlayRef.current);

    const setBox = (index, box) =>
        onChange(updateObjectBox(objects, index, box, natural));

    const startDrag = (event, drag) => {
        dragRef.current = drag;
        setIsDragging(true);
        overlayRef.current.setPointerCapture(event.pointerId);
    };

    // Tracé d'un nouveau rectangle depuis le fond de l'image.
    const onDrawStart = (event) => {
        if (event.target !== event.currentTarget || event.button !== 0) return;
        const anchor = toPoint(event);
        onChange([...objects, {
            bbox: toBoundingBox({ ...anchor, height: 0, width: 0 }, natural),
            boxIndex: objects.length,
            classId: null,
            confidence: 100,
            type: null,
        }]);
        setSelectedIndex(objects.length);
        startDrag(event, {
            anchor, index: objects.length, isNew: true, mode: 'rect',
        });
    };

    const onBoxDown = (index) => (event) => {
        if (event.button !== 0) return;
        event.stopPropagation();
        const origin = toNormalizedBox(getObjectBox(objects[index]), natural);
        if (!origin) return;
        setSelectedIndex(index);
        startDrag(event, {
            index, mode: 'move', origin, start: toPoint(event),
        });
    };



    const onHandleDown = (index, handle) => (event) => {
        if (event.button !== 0) return;
        event.stopPropagation();
        const box = toNormalizedBox(getObjectBox(objects[index]), natural);
        if (!box) return;
        startDrag(event, {
            anchor: {
                x: handle.horizontal === 'left' ? box.x + box.width : box.x,
                y: handle.vertical === 'top' ? box.y + box.height : box.y,
            },
            index,
            mode: 'rect',
        });
    };

    const onPointerMove = (event) => {
        const drag = dragRef.current;
        if (!drag) return;
        const point = toPoint(event);

        if (drag.mode === 'rect') {
            setBox(drag.index, rectFrom(drag.anchor, point));
        } else {
            setBox(drag.index, {
                ...drag.origin,
                x: clamp(drag.origin.x + point.x - drag.start.x, 0, 1 - drag.origin.width),
                y: clamp(drag.origin.y + point.y - drag.start.y, 0, 1 - drag.origin.height),
            });
        }
    };

    const onPointerUp = () => {
        const drag = dragRef.current;
        dragRef.current = null;
        setIsDragging(false);
        if (!drag?.isNew) return;

        // Tracé trop petit : simple clic, le rectangle n'est pas conservé.
        const box = toNormalizedBox(getObjectBox(objects[drag.index] ?? {}), natural);
        if (!box || box.width < MIN_BOX_SIZE || box.height < MIN_BOX_SIZE) {
            onChange(objects.filter((_, index) => index !== drag.index));
            setSelectedIndex(null);
        }
    };

    const setSelectedType = (type) => onChange(objects.map(
        (object, index) => index === selectedIndex ? { ...object, type } : object,
    ));

    useEffect(() => {
        if (selectedIndex === null) return;

        const onKeyDown = (event) => {
            if (event.key === 'Delete' || event.key === 'Backspace') {
                event.preventDefault();
                onChange(objects.filter((_, index) => index !== selectedIndex));
                setSelectedIndex(null);
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [selectedIndex, objects, onChange]);


    const selected = selectedIndex === null ? null : objects[selectedIndex];
    const selectedBox = selected ? toNormalizedBox(getObjectBox(selected), natural) : null;

    const menuLeft = selectedBox ? selectedBox.x : null;
    const menuTop = selectedBox ? selectedBox.y + selectedBox.height : null;

    useLayoutEffect(() => {
        if (menuLeft === null || !overlayRef.current) {
            setMenuPosition(null);
            return;
        }
        const rect = overlayRef.current.getBoundingClientRect();
        setMenuPosition({
            left: rect.left + menuLeft * rect.width,
            top: rect.top + menuTop * rect.height + 6,
        });
    }, [menuLeft, menuTop]);

    return (
        <div className='relative w-full select-none'>
            <img
                src={src}
                alt='frame'
                draggable={false}
                className='block rounded-lg w-full max-h-[65vh] object-contain'
                onLoad={(event) => setNatural({
                    height: event.target.naturalHeight,
                    width: event.target.naturalWidth,
                })}
            />
            <div
                ref={overlayRef}
                className='absolute inset-0 cursor-crosshair touch-none'
                onPointerDown={onDrawStart}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
            >
                {objects.map((object, index) => {
                    const rawBox = getObjectBox(object);
                    if (!rawBox) return null;
                    const box = toNormalizedBox(rawBox, natural);
                    if (!box) return null;
                    const color = colorOf(object.type);

                    return (
                        <div
                            key={index}
                            className={cn('absolute border-2 cursor-move', !object.type && 'border-dashed')}
                            style={{
                                borderColor: color,
                                height: `${box.height * 100}%`,
                                left: `${box.x * 100}%`,
                                top: `${box.y * 100}%`,
                                width: `${box.width * 100}%`,
                            }}
                            onPointerDown={onBoxDown(index)}
                        >
                            <span
                                className='-top-5 -left-0.5 absolute px-1 rounded-sm text-white text-xs whitespace-nowrap'
                                style={getDetectionBackgroundStyle(color)}
                            >
                                {object.type ?? '?'}
                            </span>
                            {index === selectedIndex && BOX_HANDLES.map((handle) => (
                                <span
                                    key={handle.className}
                                    className={cn('absolute bg-base-100 border-2 rounded-full w-3 h-3', handle.className)}
                                    style={{ borderColor: color }}
                                    onPointerDown={onHandleDown(index, handle)}
                                />
                            ))}
                        </div>
                    );
                })}

                {menuPosition && !isDragging && dialogElement && createPortal (
                    <div
                        className='z-50 fixed bg-base-100 shadow-xl border border-base-300 rounded-box w-56 max-h-56 overflow-auto'
                        style={{ left: menuPosition.left, top: menuPosition.top }}
                        onPointerDown={(event) => event.stopPropagation()}
                    >
                        <div className='flex flex-col gap-1 p-2'>
                            {detections.length === 0 && (
                                <span className='p-2 opacity-60 text-xs'>Aucune détection : ajoutez-en d’abord une dans les paramètres.</span>
                            )}
                            {detections.map((detection) => {
                                return (
                                    <button
                                        key={detection.name}
                                        type='button'
                                        className={cn(
                                            'flex items-center gap-2 hover:bg-base-200 px-2 py-1.5 rounded-field text-left text-sm cursor-pointer',
                                            sameName(detection.name, selected?.type) && 'bg-base-200 font-semibold',
                                        )}
                                        onClick={() => setSelectedType(detection.name)}
                                    >
                                        <span
                                            className='rounded-full w-2.5 h-2.5 shrink-0'
                                            style={getDetectionBackgroundStyle(
                                                getDetectionColor(detection.name, detections, categories),
                                            )}
                                        />
                                        <span className='flex-1 truncate'>{detection.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>,
                    dialogElement,
                )}
            </div>
        </div>
    );
}
