# Spécifications d’exigences — Cyclope frontend

## 1. Objet et périmètre

Ce document formalise le comportement observable déduit de l’implémentation actuelle. Cyclope est une interface web de gestion de missions composées de médias, de configuration de traitements et de consultation de résultats géolocalisés. Le backend, le stockage objet et le moteur d’IA sont des systèmes externes au présent périmètre.

Les mots **doit**, **devrait** et **peut** indiquent respectivement une exigence obligatoire, une recommandation et une capacité optionnelle.

## 2. Acteurs et systèmes externes

- **Opérateur** : organise les fichiers, crée ou complète une mission, configure et consulte les traitements.
- **API Cyclope** : expose les ressources de santé, fichiers, missions, médias, traitements et résultats sous `/api`.
- **Stockage objet** : reçoit les fichiers via une URL de téléversement présignée.
- **Flux d’événements** : publie les changements d’état, de progression et les résultats de traitement.
- **Fenêtres secondaires** : affichent séparément le média, le plan ou le tableau et se synchronisent avec la fenêtre maître.

## 3. Exigences fonctionnelles

### EF-01 — Navigation

- L’application doit proposer les routes `/missions`, `/new`, `/settings` et `/treatment`.
- Les vues média, plan et tableau doivent être accessibles sur `/media`, `/plan` et `/table`.
- Une route inconnue doit rediriger vers `/missions`.

### EF-02 — Santé des services

- L’interface doit interroger l’état du stockage, de la base de données et des fonctions IA.
- Elle doit rendre visible l’état global et les sous-états IA disponibles.

### EF-03 — Explorateur de fichiers

- L’opérateur doit pouvoir parcourir une arborescence de fichiers et dossiers.
- Il doit pouvoir téléverser des fichiers ou déposer un dossier dans une destination choisie.
- Chaque fichier doit être contrôlé par extension avant téléversement ; un fichier refusé doit produire un message explicite.
- Les téléversements partiellement réussis doivent conserver les succès et signaler individuellement les échecs.
- L’opérateur doit pouvoir supprimer un fichier après confirmation.

### EF-04 — Création et enrichissement d’une mission

- L’opérateur doit pouvoir sélectionner plusieurs fichiers et attribuer un nom non vide à une nouvelle mission.
- Il doit pouvoir ajouter des médias à une mission existante.
- Chaque média doit recevoir sa propre configuration de traitement.
- Après validation réussie, l’état de création doit être réinitialisé et l’utilisateur redirigé vers la liste des missions.
- Une erreur de validation doit être signalée sans perdre la sélection en cours.

### EF-05 — Configuration des traitements

- L’opérateur doit pouvoir définir le pas d’analyse des images, l’activation de la détection d’objets, le seuil de confiance et le niveau de traitement.
- Les valeurs par défaut doivent persister dans le navigateur et s’appliquer aux nouveaux médias.
- Pour une vidéo, le pas configuré ne doit pas dépasser sa durée connue.
- Les niveaux pris en charge par l’interface sont 2 « Léger », 3 « Moyen » et 5 « Lourd ».
- L’écran des paramètres doit distinguer la configuration de traitement par défaut de la gestion du catalogue de détections.

### EF-06 — Missions et états

- La liste doit permettre une recherche insensible à la casse par nom et un filtrage par état.
- Les états présentés sont `PENDING`, `RUNNING`, `DONE` et `ERROR`.
- Une mission doit afficher le nombre de médias par état et permettre de développer sa liste de médias.
- La suppression d’une mission doit demander confirmation.

### EF-07 — Sélection et traitement courant

- Les paramètres d’URL `mission`, `media` et `treatment` doivent initialiser la sélection.
- Si une sélection est incomplète, l’application doit déduire la mission du média, le média du traitement ou sélectionner le premier média disponible.
- Le dernier traitement connu d’un média doit devenir le traitement courant lorsqu’aucun autre n’est sélectionné.

### EF-08 — Lecture et synchronisation

- La vue traitement doit synchroniser le média, la lecture, le temps courant, la durée, le traitement et les résultats.
- La fenêtre principale doit être la source maîtresse ; les fenêtres secondaires doivent demander puis recevoir son état.
- La synchronisation inter-fenêtres doit utiliser des canaux dédiés et mettre fin aux abonnements lorsqu’une vue se ferme.
- La vue média doit prendre en charge les images et les vidéos ; la vidéo doit permettre lecture, pause et navigation temporelle.

### EF-09 — Résultats

- Les résultats du traitement courant doivent arriver par flux et être ordonnés par index.
- Un résultat reçu avec un identifiant existant doit remplacer sa version précédente.
- L’opérateur doit pouvoir consulter une capture avec son index, ses coordonnées, son altitude, sa vitesse et ses détections.
- Il doit pouvoir modifier les informations éditables et marquer un résultat comme favori ; un échec d’enregistrement doit être signalé.
- Les types rencontrés dans les résultats doivent être découverts automatiquement et ajoutés au catalogue local sans doublon de nom.
- Les badges de détection associés à une catégorie doivent reprendre la couleur de cette catégorie.

### EF-10 — Plan et tableau

- Le plan doit afficher la trace et les résultats géolocalisés, suivre la position courante et permettre une resynchronisation avec le lecteur.
- Le tableau doit présenter les résultats, permettre la sélection, le filtrage des détections et le choix des colonnes visibles.
- L’opérateur doit pouvoir éditer les détections d’un résultat en les sélectionnant dans le catalogue, regroupées visuellement par catégorie.
- Une détection ajoutée depuis l’éditeur doit recevoir une confiance initiale de 100 %, tandis qu’une détection déjà présente doit conserver sa confiance.
- Une édition qui ne change pas la liste des types et confiances ne doit pas déclencher d’enregistrement.
- Les préférences de colonnes et filtres doivent persister ou se synchroniser entre fenêtres selon leur nature.

### EF-11 — Catalogue et catégories de détection

- L’opérateur doit pouvoir créer, renommer et supprimer une catégorie, ainsi que choisir sa couleur.
- La suppression d’une catégorie doit conserver ses détections en les replaçant dans l’état « non catégorisée ».
- L’opérateur doit pouvoir ajouter ou retirer manuellement un type de détection et l’affecter à une catégorie.
- Les noms de détection vides ou déjà présents, après normalisation et comparaison insensible à la casse, doivent être refusés.
- L’interface doit afficher le nombre de détections restant à catégoriser et le nombre associé à chaque catégorie.
- Le catalogue et ses affectations doivent persister dans le navigateur et se resynchroniser entre les onglets.

## 4. Exigences d’interface et d’accessibilité

- EI-01 : l’interface doit rester exploitable lorsque les listes sont vides ou en chargement.
- EI-02 : une action destructive doit être précédée d’une confirmation explicite.
- EI-03 : les contrôles doivent utiliser des éléments HTML interactifs adaptés (`button`, `input`, `dialog`).
- EI-04 : le thème clair ou sombre choisi doit persister dans le navigateur.

## 5. Exigences techniques et qualité

- ET-01 : l’application doit utiliser des composants React fonctionnels et React Query pour l’état serveur.
- ET-02 : les échanges HTTP doivent convertir les clés camelCase/snake_case aux frontières de l’API.
- ET-03 : les réponses non réussies doivent produire une erreur exploitable par la couche appelante ; une réponse vide doit être acceptée.
- ET-04 : les événements temps réel doivent être fermés lors du démontage ou du changement de traitement.
- ET-05 : les données persistantes locales doivent rester limitées aux préférences, valeurs par défaut et au catalogue de détections.
- ET-06 : une couleur de catégorie persistée doit respecter le format hexadécimal `#RRGGBB` ; une valeur invalide doit être remplacée ou ignorée au profit d’une couleur valide.
- EQ-01 : `npm run lint` et `npm run build` doivent réussir avant intégration.
- EQ-02 : aucun `console.log`, `eval`, appel dynamique au constructeur `Function`, code inutilisé ou comparaison à coercition implicite n’est admis.
- EQ-03 : une exception ESLint doit être locale, motivée et réévaluée lorsque l’architecture concernée évolue.

## 6. Interfaces backend déduites

| Ressource | Opérations utilisées |
| --- | --- |
| `/api/health` | lecture de l’état des services |
| `/api/files`, `/api/files/tree` | création, suppression et lecture de l’arborescence |
| `/api/files/upload`, `/api/files/download` | obtention d’URL présignées |
| `/api/missions` | liste, lecture, création, modification et suppression |
| `/api/missions/{id}/medias` | ajout de médias |
| `/api/medias`, `/api/treatments`, `/api/results` | lecture et opérations CRUD selon les écrans |
| `/api/event` | événements SSE d’état et de progression |
| `/api/treatments/{id}/results/stream` | résultats SSE d’un traitement |
