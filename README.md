# Cyclope frontend
Projet React + TailwindCSS + DaisyUI

---

## 🧱 Stack technique

* React (fonctionnel uniquement)
* TailwindCSS
* DaisyUI

---

## 📁 Structure du projet (à respecter strictement)

```
src
├── assets/          # Ressources nécessaires
│   └── icons/
├── components/      # Composants réutilisables (UI)
├── constants/       # Constantes globales
├── contexts/        # Contextes
├── hooks/           # Hooks custom
├── services/        # Appels API / logique externe
├── utils/           # Fonctions utilitaires
├── views/           # Composants d'écran et vues
├── App.jsx          # Point d'entrée
├── router.js        # Router
└── style.css        # Seul fichier CSS
```

### Règles :

* **Pas de logique métier dans les composants UI**
* **Pas de composants “fourre-tout”**
* Toujours organiser par responsabilité

---

## 🧩 Composants React

### Convention obligatoire :

```js
export default function MonComposant(props) {
  return (
        <div>...</div>
    );
}
```

### Règles :

* Un composant = une responsabilité
* Pas de logique complexe inline → extraire dans hooks ou utils
* Noms explicites

---

## 🎨 Styling (Tailwind + DaisyUI)

### Obligations :

* Prioriser les classes sémantiques **DaisyUI**
* Sinon, utiliser les classes utilitaires **Tailwind**

### Interdits :

* ❌ Couleurs hardcodées (`text-red-500`, etc.) sauf exception justifiée
* ❌ CSS custom inutile
* ❌ Inline styles

---

## 🧠 Architecture & principes

### SOLID (obligatoire)

* **Responsabilité unique (Single responsibility principle)** → Une classe, une fonction ou une méthode doit avoir une et une seule unique raison d'être. Cela favorise la modularité et facilite la maintenance en évitant les classes surchargées de responsabilités.
* **Ouvert/fermé (Open/closed principle)** → Une entité applicative (classe, fonction, module ...) doit être fermée à la modification directe mais ouverte à l'extension. L'objectif est de permettre l'ajout de nouvelles fonctionnalités sans altérer le code existant.
* **Substitution de Liskov (Liskov substitution principle)** → Une instance de type T doit pouvoir être remplacée par une instance de type G, tel que G sous-type de T, sans que cela ne modifie la cohérence du programme. Cela garantit que les sous-classes peuvent être utilisées de manière interchangeable avec leurs classes de base.
* **Ségrégation des interfaces (Interface segregation principle)** → Préférer plusieurs interfaces spécifiques pour chaque client plutôt qu'une seule interface générale. Cela évite aux classes de dépendre de méthodes dont elles n'ont pas besoin, réduisant ainsi les couplages inutiles.
* **Inversion des dépendances (Dependency inversion principle)** → Il faut dépendre des abstractions, pas des implémentations. Cela favorise la modularité, la flexibilité et la réutilisabilité en réduisant les dépendances directes entre les modules.

---

## 🔁 Gestion des états

* Favoriser :

  * `useState`, `useReducer`
  * hooks custom
* Centraliser si nécessaire (Context / Zustand / autre)

---

## 🌐 API & Services

* Tous les appels API doivent être dans `services/`
* Aucun `fetch` ou `axios` dans les composants
* Gestion des erreurs centralisée

---

## 🧹 Qualité du code

### ESLint (strict)

* ❌ Interdiction de push si erreurs ESLint
* ✔ Code doit être clean avant commit

### Bonnes pratiques :

* Pas de `console.log`
* Pas de code mort
* Imports propres (pas inutiles et surtout triés)
* Nommage explicite

---

## 🔀 Git & commits

### Règles :

* Commits clairs et atomiques
* Convention recommandée :

  * `feat:` → nouvelle fonctionnalité
  * `fix:` → correction de bug
  * `refactor:` → modification interne sans changement fonctionnel
  * `style:` → formatage (indentation, espaces...)
  * `chore:` → tout ce qui est hors code applicatif

### Interdits :

* ❌ Push direct sur `main`
* ❌ Code non testé
* ❌ Code cassé

---

## ⚙️ Performance

* Mémoisation (`useMemo`, `useCallback`) si nécessaire
* Eviter les re-renders inutiles

---

## 📏 Règles générales

* Code lisible > code clever
* Cohérence > préférence personnelle
* Simplicité > complexité
* Factoriser sans sur-abstraire
* Code en anglais

---

## ❌ Anti-patterns à éviter

* Composants de 300+ lignes
* Props drilling excessif
* Duplication de code
* Logique métier dans le JSX
* CSS custom non justifié

---

## ✅ Definition of Done

Un code est considéré comme terminé si :

* ✔ ESLint passe sans erreur
* ✔ Respect de la structure
* ✔ Composants découplés
* ✔ UI conforme DaisyUI
* ✔ Pas de code inutile
* ✔ Compréhensible sans explication orale

---

## Auteurs & Propriété

- Département Ingéniérie Logicielle
- Escadron des Systèmes d'Information Opérationnels et Cyberdéfense 62.430
- Armée de l'Air et de l'Espace
