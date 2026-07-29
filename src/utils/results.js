export const buildLowConfidenceZones = (results, safeDuration) => {
    const sorted = [...(results ?? [])]
        .filter((r) => r.seconds !== null)
        .sort((a, b) => a.seconds - b.seconds);

    return sorted
        .map((r, i) => ({
            id: r.id,
            isFreezing: r.isFreezing,
            start: r.seconds,
            end: sorted[i + 1]?.seconds ?? safeDuration,
        }))
        .filter((z) => z.isFreezing);
};
