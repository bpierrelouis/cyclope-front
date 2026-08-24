# Spécification des résultats IA

## 1. Objet

Ce document définit la structure du fichier `AI_RESULTS.json` et les contraintes
de données applicables à chaque réponse IA.

Les mots **doit**, **devrait** et **peut** indiquent respectivement une exigence
obligatoire, une recommandation et une capacité optionnelle.

## 2. Conteneur et encodage

- Le document doit être un JSON valide encodé en UTF-8.
- La racine doit être un tableau de réponses IA.
- Chaque élément doit être un objet respectant la structure décrite ci-dessous.
- Les propriétés non documentées devraient être ignorées de façon tolérante à la
  lecture, mais ne doivent pas remplacer une propriété documentée.

## 3. Structure d'une réponse du moteur IA

| Propriété | Type | Présence | Règle |
| --- | --- | --- | --- |
| `frame_index` | entier | obligatoire | Index unique de la capture dans la collection, positif ou nul. |
| `timestamp` | chaîne | obligatoire | Format `HH:MM:SS.mmm`. |
| `timestamp_seconds` | nombre | obligatoire | Temps du `timestamp` exprimé en secondes, avec tolérance d'arrondi de 1 ms. |
| `aircraft` | objet | obligatoire | Mesures relatives à l'aéronef. |
| `target` | objet | obligatoire | Mesures relatives à la cible. |
| `objects` | tableau | obligatoire | Détections d'objets, éventuellement vide. |
| `meta_data` | objet | obligatoire | Indicateurs de qualité de l'image. |
| `s3_image_path` | chaîne | obligatoire | Chemin de l'image associée ; son nom doit être `{frame_index}.png`. |

## 4. Mesures `aircraft` et `target`

Les objets `aircraft` et `target` exposent les propriétés suivantes :

`altitude`, `speed`, `distance`, `battery`, `radio_signal`, `orientation`,
`time`, `gps`, `video`, `temperature`, `voltage`, `amperage`,
`battery_capacity`, `power`, `energy`, `duration`, `frequency`, `flow_rate`,
`image_frequency`, `percentage`, `direction` et `coordinate`.

`aircraft` expose en plus la propriété `other`.

### 4.1 Mesure simple

Une propriété de mesure autre que `coordinate` doit valoir `null` lorsqu'aucune
mesure exploitable n'est disponible, ou être un tableau non vide d'objets :

```json
{
  "value": 99.8,
  "confidence": 100,
  "unit": "km/h"
}
```

- `value` doit être un nombre, une chaîne ou `null` selon la nature de la mesure ;
- `confidence` doit être un nombre compris entre 0 et 100, ou `null` ;
- `unit` peut être absente, mais devrait être fournie pour toute grandeur
  physique afin d'éviter une interprétation implicite ;
- plusieurs candidats peuvent être présents ; leur ordre n'est pas spécifié ;
- dans `other`, la chaîne spéciale `"-"` peut être présente au maximum une fois.

### 4.2 Coordonnées

`coordinate` doit valoir `null` ou être un objet pouvant contenir `latitude` et
`longitude`. Chaque axe présent respecte la forme
`{ "value": nombre, "confidence": nombre }`.

- la latitude doit être comprise entre -90 et 90 ;
- la longitude doit être comprise entre -180 et 180 ;
- `latitude` et `longitude` sont optionnelles indépendamment dans l'objet.

## 5. Détections d'objets

Chaque élément de `objects` doit respecter le contrat suivant :

| Propriété | Type | Règle |
| --- | --- | --- |
| `box_index` | entier | Unique dans le résultat ; sa continuité est recommandée mais ne porte pas l'identité métier. |
| `type` | chaîne non vide | Libellé de la classe détectée. |
| `class_id` | entier | Identifiant de la classe. |
| `confidence` | nombre | Compris entre 0 et 100. |
| `bbox` | objet | Contient `x1`, `y1`, `x2`, `y2`, `width` et `height`. |

Pour chaque boîte, `x1 <= x2`, `y1 <= y2`, `width = x2 - x1` et
`height = y2 - y1`. Les dimensions doivent être positives ou nulles.

## 6. Métadonnées

`meta_data` doit contenir :

- `is_freezing`, booléen indiquant une image figée ;
- `degradation_image`, nombre représentant le niveau de dégradation.

L'échelle et les bornes de `degradation_image` doivent être définies par le
producteur des données.
