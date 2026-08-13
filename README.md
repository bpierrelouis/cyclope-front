# Cyclope frontend

Interface React de préparation, lancement et exploitation de traitements de médias. L’application permet d’organiser les fichiers, créer des missions, suivre leur état puis consulter les résultats dans un lecteur, un plan et un tableau synchronisés.

## Fonctionnalités principales

- exploration et téléversement de fichiers avec détection des doublons, puis création ou enrichissement de missions ;
- configuration par défaut et par média des traitements ;
- suivi temps réel des traitements et de leurs résultats ;
- consultation synchronisée dans un lecteur, un plan et un tableau ;
- catalogue local des types de détection, avec catégories et couleurs personnalisables ;
- édition des détections d’un résultat depuis le tableau à partir de ce catalogue.

## Prérequis

- Node.js 20 ou supérieur
- npm
- API accessible sur `http://localhost:8001` en développement

## Démarrage

```bash
npm install
npm run dev
```

Vite démarre l’interface et transmet les requêtes `/api` au backend. En développement, MSW fournit également les scénarios simulés déclarés dans `src/mocks`.

## Commandes

| Commande | Usage |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run lint` | Contrôle statique strict, sans modification |
| `npm run lint:fix` | Applique les corrections ESLint sûres |
| `npm run build` | Génère la version de production dans `dist` |
| `npm run check` | Exécute le lint puis le build ; commande de validation avant revue |
| `npm run preview` | Prévisualise le build localement |

## VS Code et formatage

Le dépôt recommande l’extension **ESLint** et fournit une configuration partagée dans `.vscode` : ESLint est le formateur des fichiers JavaScript/JSX, le formatage à l’enregistrement est actif et les corrections automatiques sont appliquées lors d’un enregistrement explicite.

Après ouverture du dépôt :

1. accepter l’installation de l’extension recommandée `dbaeumer.vscode-eslint` ;
2. recharger la fenêtre si VS Code utilisait déjà un autre formateur ;
3. vérifier les problèmes avec `npm run lint` avant de pousser.

Les règles couvrent notamment React et ses hooks, l’absence de code inutilisé, les comparaisons strictes, les blocs cohérents, l’interdiction d’`eval`, des `console.log` et des API à risque, ainsi que le style commun (quotes, points-virgules, virgules finales et ordre des imports nommés). Les exceptions doivent rester locales et être accompagnées d’une justification.

## Architecture

```text
src/
├── components/   composants UI réutilisables
├── constants/    routes, libellés et constantes
├── contexts/     état React partagé
├── hooks/        accès aux données et hooks transverses
├── mocks/        API simulée par MSW
├── models/       adaptation des objets de l’API
├── services/     HTTP, SSE et synchronisation inter-fenêtres
├── stores/       état Zustand persistant ou partagé
├── utils/        fonctions pures et aides transverses
└── views/        écrans et vues métier
```

Les composants restent fonctionnels. Les accès réseau résident dans `services`, leur orchestration React Query dans `hooks`, et l’état global dans les stores ou contextes. Les préférences de traitement et le catalogue de détections sont persistés localement avec Zustand. Le style utilise en priorité DaisyUI, puis Tailwind ; `src/style.css` contient les styles globaux indispensables.

## Documentation

- [Spécifications d’exigences](docs/SPECIFICATIONS.md)
- [Guide de contribution et qualité](docs/CONTRIBUTING.md)

## Definition of Done

Une modification est prête lorsque `npm run check` réussit, que les exigences concernées restent satisfaites, que les états de chargement et d’erreur sont traités, et qu’aucun appel réseau ni logique métier complexe n’a été ajouté directement dans un composant de présentation.

## Propriété

Département Ingénierie Logicielle — Escadron des Systèmes d’Information Opérationnels et Cyberdéfense 62.430 — Armée de l’Air et de l’Espace.
