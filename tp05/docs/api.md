# API du catalogue

*Mis à jour le 9 septembre.*

Base URL : `http://localhost:3000`. Pas d'authentification, l'API est interne.

## Models

| Méthode | Route | Body | Réponse |
|---|---|---|---|
| GET | `/models` | | 200, la liste, filtrable par `?org=` et `?task=` |
| GET | `/models/:id` | | 200, ou 404 |
| POST | `/models` | `{ id, name, org, task, parameters, downloads, license? }` | 201 |
| DELETE | `/models/:id` | | 204, ou 404 |

`org` est un texte libre, par exemple `"MistralAI"`.

`task` : `text-generation`, `translation`, `image-classification`, `speech-to-text`.

## Erreurs

- 400 : body invalide, la réponse liste les champs en cause.
- 404 : model inconnu.
