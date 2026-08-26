import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { MIN_BOX_SIZE } from '../../../constants';
import { useDetectionCatalogStore } from '../../../stores';
import {
    clamp,
    getDetectionColor,
    getObjectBox,
    getPointerPosition,
    rectFrom,
    toBoundingBox,
    toNormalizedBox,
    updateObjectBox,
} from '../../../utils';
import { DetectionBox } from './DetectionBox';
import { DetectionTypeMenu } from './DetectionTypeMenu';

/**
 * Éditeur de rectangles de détection par-dessus la frame : tracé de nouveaux
 * rectangles à la souris, déplacement, redimensionnement, choix du type et
 * suppression. Les boîtes émises via onChange utilisent le format bbox du back.
 */
export function BoxEditor(props) {
    const {
        src, objects, onChange, onCommit, dialogElement,
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
        if (!drag?.isNew) {
            if (drag && objects.every((object) => object.type)) onCommit?.(objects);
            return;
        }

        // Tracé trop petit : simple clic, le rectangle n'est pas conservé.
        const box = toNormalizedBox(getObjectBox(objects[drag.index] ?? {}), natural);
        if (!box || box.width < MIN_BOX_SIZE || box.height < MIN_BOX_SIZE) {
            onChange(objects.filter((_, index) => index !== drag.index));
            setSelectedIndex(null);
        }
    };

    const setSelectedType = (type) => {
        const nextObjects = objects.map(
            (object, index) => index === selectedIndex ? { ...object, type } : object,
        );
        onChange(nextObjects);
        onCommit?.(nextObjects);
        setSelectedIndex(null);
    };

    useEffect(() => {
        if (selectedIndex === null) return;

        const onKeyDown = (event) => {
            if (event.target instanceof HTMLInputElement) return;
            if (event.key === 'Delete' || event.key === 'Backspace') {
                event.preventDefault();
                const nextObjects = objects.filter((_, index) => index !== selectedIndex);
                onChange(nextObjects);
                onCommit?.(nextObjects);
                setSelectedIndex(null);
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [selectedIndex, objects, onChange, onCommit]);


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
                        <DetectionBox
                            key={index}
                            box={box}
                            color={color}
                            isSelected={index === selectedIndex}
                            object={object}
                            onBoxDown={onBoxDown(index)}
                            onHandleDown={(handle) => onHandleDown(index, handle)}
                        />
                    );
                })}

                {!isDragging && (
                    <DetectionTypeMenu
                        dialogElement={dialogElement}
                        onSelect={setSelectedType}
                        position={menuPosition}
                        selectedType={selected?.type}
                    />
                )}
            </div>
        </div>
    );
}
