# Contribution et qualité

## Principes

- Le code applicatif, les noms de modules et les commits sont rédigés en anglais.
- Un composant ou module porte une responsabilité identifiable.
- Les appels API sont implémentés dans `src/services` et exposés à React via `src/hooks`.
- Les fonctions pures réutilisables appartiennent à `src/utils` ; l’état partagé appartient à `src/stores` ou `src/contexts`.
- React Query est la source d’état serveur des vues. Le store du lecteur reste limité à l’état de lecture, au contexte de mission, à l’identité et à l’offset du segment courant, ainsi qu’à la présence des fenêtres secondaires.
- Une fenêtre secondaire résout la mission, le traitement, le média et les résultats depuis l’API. Le canal transmet `missionId` pour le contexte, `treatmentId` pour le segment courant, ou `mediaId` uniquement sans traitement, mais aucun objet métier ni collection de résultats.
- Les mises à jour inter-fenêtres des résultats sont des événements unitaires qui alimentent les caches React Query ; elles ne constituent pas un store parallèle.
- Un hook de consultation doit encapsuler une règle partagée ou agréger plusieurs sources. Pour une lecture ponctuelle sans logique, le composant accède directement au contexte afin de limiter les couches d’indirection.
- DaisyUI est privilégié pour les composants sémantiques, puis Tailwind pour la composition. Une couleur ou un style inline doit être justifié par une donnée dynamique ou une contrainte de bibliothèque.
- Toute évolution du catalogue de détections doit préserver les données déjà persistées et la synchronisation entre onglets.

## ESLint

`eslint.config.js` est la source de vérité pour JavaScript et JSX. Une règle ne doit pas être désactivée globalement pour résoudre un cas isolé. Une exception locale doit expliquer la contrainte technique qui empêche de respecter la règle.

Les erreurs ne sont pas converties en avertissements : le contrôle local et la CI doivent échouer de la même manière. `npm run lint:fix` peut corriger le style, mais ne remplace pas la revue du diff.

## Workflow recommandé

1. Créer une branche dédiée.
2. Implémenter une modification ciblée et vérifier manuellement le parcours concerné.
3. Exécuter `npm run check`.
4. Relire le diff, notamment les changements automatiques de formatage.
5. Produire un commit atomique (`feat:`, `fix:`, `refactor:`, `docs:`, `test:` ou `chore:`).

## Revue

La revue vérifie la conformité aux [spécifications](SPECIFICATIONS.md), la séparation des responsabilités, les erreurs et cas vides, l’accessibilité des interactions, ainsi que l’absence de régression sur les synchronisations SSE, inter-fenêtres et sur le catalogue persistant de détections. Elle signale aussi les abstractions sans règle propre et les états dupliqués. Pour les vues détachées, elle couvre au minimum l’ouverture, le changement de traitement depuis la fenêtre principale, la lecture, le temps courant, les modifications de résultats, les favoris, les filtres et la fermeture.
