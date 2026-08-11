import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const KEY = 'detection-catalog';
const DEFAULT_COLOR = '#3b82f6';

const normalizeName = (name) => String(name ?? '').trim();
const sameName = (left, right) =>
    normalizeName(left).localeCompare(normalizeName(right), undefined, { sensitivity: 'accent' }) === 0;

const createId = () => globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const isColor = (color) => /^#[0-9a-f]{6}$/i.test(color ?? '');

export const useDetectionCatalogStore = create(persist(
    (set, get) => ({
        addCategory: (name, color = DEFAULT_COLOR) => {
            const normalizedName = normalizeName(name);
            if (!normalizedName) return null;

            const category = {
                color: isColor(color) ? color : DEFAULT_COLOR,
                id: createId(),
                name: normalizedName,
            };
            set((state) => ({ categories: [...state.categories, category] }));
            return category.id;
        },
        addDetection: (name) => {
            const normalizedName = normalizeName(name);
            if (!normalizedName) return false;
            if (get().detections.some((detection) => sameName(detection.name, normalizedName))) {
                return false;
            }
            set((state) => ({
                detections: [...state.detections, { categoryId: null, name: normalizedName }],
            }));
            return true;
        },

        categories: [],

        detections: [],

        discoverDetections: (results) => {
            const known = get().detections;
            const discovered = (results ?? [])
                .flatMap((result) => result?.objects ?? result?.data?.objects ?? [])
                .map((object) => normalizeName(object?.type))
                .filter(Boolean)
                .reduce((names, name) => (
                    known.some((detection) => sameName(detection.name, name))
                    || names.some((candidate) => sameName(candidate, name))
                        ? names
                        : [...names, name]
                ), []);

            if (discovered.length === 0) return;
            set((state) => ({
                detections: [
                    ...state.detections,
                    ...discovered.map((name) => ({ categoryId: null, name })),
                ],
            }));
        },

        removeCategory: (id) => set((state) => ({
            categories: state.categories.filter((category) => category.id !== id),
            detections: state.detections.map((detection) => detection.categoryId === id
                ? { ...detection, categoryId: null }
                : detection),
        })),

        removeDetection: (name) => set((state) => ({
            detections: state.detections.filter((detection) => !sameName(detection.name, name)),
        })),

        setDetectionCategory: (name, categoryId) => set((state) => ({
            detections: state.detections.map((detection) => sameName(detection.name, name)
                ? { ...detection, categoryId: categoryId || null }
                : detection),
        })),

        updateCategory: (id, patch) => set((state) => ({
            categories: state.categories.map((category) => category.id === id
                ? {
                    ...category,
                    ...patch,
                    color: patch.color === undefined
                        ? category.color
                        : (isColor(patch.color) ? patch.color : category.color),
                }
                : category),
        })),
    }),
    {
        merge: (persistedState, currentState) => ({
            ...currentState,
            ...persistedState,
            categories: Array.isArray(persistedState?.categories)
                ? persistedState.categories.map((category) => ({
                    ...category,
                    color: isColor(category?.color) ? category.color : DEFAULT_COLOR,
                }))
                : currentState.categories,
            detections: Array.isArray(persistedState?.detections)
                ? persistedState.detections
                : currentState.detections,
        }),
        name: KEY,
        partialize: ({ categories, detections }) => ({ categories, detections }),
    },
));

globalThis.addEventListener('storage', (event) => {
    if (event.key === KEY) useDetectionCatalogStore.persist.rehydrate();
});
