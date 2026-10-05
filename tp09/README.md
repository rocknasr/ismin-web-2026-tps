# TP9 : la connexion et le formulaire de création

*Développement Web, ISMIN 3A, séance 9.*

## 🎯 Objectif

Tout le monde peut lire le catalogue, personne ne peut y écrire. À la fin du TP, on se connecte, l'en-tête dit qui l'est, et seuls les utilisateurs connectés peuvent ajouter un modèle, avec les erreurs de l'API affichées dans le formulaire.

On part du corrigé du TP8 : les routes, la page d'un modèle, les liens. Leurs tests sont verts dès le départ, et doivent le rester.

## 🚀 Démarrer

Trois terminaux.

```sh
git pull --no-edit upstream main

# Terminal 1 : l'API
cd tp09/api
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run start:dev          # localhost:3000, la doc sur localhost:3000/docs

# Terminal 2 : le front
cd tp09/web
cp .env.example .env
npm install
npm run dev                # localhost:5173

# Terminal 3 : les tests du front
cd tp09/web
npm run test:watch
```

Arrêtez d'abord l'API et le front du TP8 : ce sont les mêmes ports.

Ouvrez `localhost:5173` : le catalogue du TP8, et deux nouveaux liens dans l'en-tête. Cliquez sur « Se connecter » : « Page introuvable ». C'est l'étape 3.

C'est tout, vous pouvez coder !

## 🗺 Ce qui est fourni

```
api/                          l'API du TP8. Rien à écrire
web/
├── .env.example              VITE_API_URL : où tourne l'API
└── src/
    ├── main.tsx              les providers autour de <App />, AuthProvider compris
    ├── App.tsx               les routes du TP8                         ← étapes 3 et 5
    ├── styles.css            tout le style : vous n'écrivez pas de CSS
    ├── model.ts              Model, et NewModel : ce qu'attend POST /models
    ├── format.ts             les nombres à la française
    ├── api.ts                ApiError, throwIfNotOk, fetchModels, fetchModel  ← étapes 2 et 6
    ├── auth/
    │   ├── jwt.ts            decodePayload : lire le payload d'un token
    │   ├── AuthProvider.tsx  l'utilisateur connecté, pour toute l'app ← étape 2
    │   └── RequireAuth.tsx   une page réservée aux connectés           ← étape 5
    ├── components/
    │   ├── Header.tsx        l'en-tête et ses liens                    ← étape 4
    │   ├── ModelCard.tsx     le corrigé du TP8
    │   ├── ModelList.tsx     le corrigé du TP7
    │   └── TaskFilter.tsx    le corrigé du TP7
    ├── pages/
    │   ├── CatalogPage.tsx   le catalogue
    │   ├── ModelPage.tsx     la page d'un modèle, le corrigé du TP8
    │   ├── NotFoundPage.tsx  « Page introuvable »
    │   ├── LoginPage.tsx     la maquette de la connexion               ← étape 3
    │   └── NewModelPage.tsx  la maquette du formulaire de création     ← étapes 6 et 7
    ├── test-utils.tsx        renderApp, makeToken, fakeApi : les outils des tests
    └── *.test.tsx            le sujet, ne pas modifier
```

## 📐 Les règles

- **Le token vit dans `AuthProvider`**, et nulle part ailleurs. Les pages et les composants le demandent à `useAuth()`.
- **Des formulaires contrôlés.** La valeur de chaque champ est dans un état React, jamais lue dans le DOM.
- **Le balisage est celui des maquettes.** Les tests cherchent ce que voit l'utilisateur : les titres, les libellés des champs, les boutons, un `role="alert"` pour les erreurs.
- **Pas de CSS à écrire.** Les classes de `styles.css` sont celles des maquettes.

## 📝 Les étapes

### Étape 1 : lancer les deux mondes

**À faire.** Les trois terminaux ci-dessus. Dans `localhost:3000/docs`, `POST /auth/login` avec alice et secret : copiez le token. Collez-le dans « Authorize », puis essayez `POST /models`.

**C'est bon quand.** Le catalogue s'affiche sur `localhost:5173`, `/docs` vous a donné un token, et les tests tournent : 30 verts, 28 rouges, c'est normal.

### Étape 2 : se connecter, côté code

**À faire.** Dans `api.ts`, `login(username, password)` : `POST /auth/login`, le corps en JSON, et renvoyer le `access_token` de la réponse. Dans `auth/AuthProvider.tsx` :

- `user` : `decodePayload(token)`, quand il y a un token ;
- `login` : demander le token à l'API, le ranger dans `localStorage` sous `TOKEN_KEY`, puis dans l'état avec `setToken` ;
- `logout` : l'inverse.

Lisez `auth/jwt.ts` : le payload d'un token se lit sans aucun secret.

**C'est bon quand.** `AuthProvider.test.tsx` et les tests `login` de `api.test.ts` sont verts.

**Pièges.**

- Sans l'en-tête `'Content-Type': 'application/json'`, NestJS ne lit pas le corps : l'API répond 400, « username should not be empty ».
- Deux fonctions s'appellent `login` : celle d'`api.ts`, et celle du contexte. `import * as api from '../api'`, puis `api.login(…)`.
- Le token dans `localStorage` survit à un rechargement, mais tout script de la page peut le lire. Une faille XSS, et le token est volé. Un cookie `httpOnly` l'éviterait, au prix d'une API modifiée : pour ce TP, on assume `localStorage`.

### Étape 3 : la page de connexion

**À faire.** Dans `App.tsx`, la route `/login`. Dans `pages/LoginPage.tsx`, un formulaire contrôlé : un état par champ, `value` et `onChange` sur chaque `<input>`. Au `onSubmit` du `<form>` : `event.preventDefault()`, puis le `login` de `useAuth()`. Une fois connecté, `useNavigate` ramène à la page demandée, `location.state?.from`, ou au catalogue. Un mauvais mot de passe : « Identifiant ou mot de passe incorrect. » dans un `role="alert"`.

**C'est bon quand.** `LoginPage.test.tsx` est vert. Connectez-vous avec alice, puis DevTools → Application → Local Storage : le token est là. Collez-le dans [jwt.io](https://jwt.io).

**Pièges.**

- Sans `preventDefault()`, le navigateur envoie le formulaire lui-même et recharge la page. L'état est perdu, et l'adresse se termine par `?username=alice&password=secret`.
- `value` sans `onChange` : le champ est figé, on ne peut plus rien taper.
- Le type de l'événement : `SubmitEvent<HTMLFormElement>`, importé de `react`. `FormEvent`, qu'on trouve partout, est déprécié.

### Étape 4 : l'en-tête

**À faire.** Dans `Header.tsx`, avec `useAuth()` : une fois connecté, le nom de l'utilisateur, dans un `<span className="app-user">`, et un bouton « Se déconnecter », avec la classe `link-button`, à la place du lien « Se connecter ».

**C'est bon quand.** `Header.test.tsx` est vert. Connectez-vous avec bob : l'en-tête dit bob. Rechargez la page : toujours connecté.

### Étape 5 : la page protégée

**À faire.** Dans `auth/RequireAuth.tsx` : sans token, `<Navigate to="/login" replace state={{ from: location.pathname }} />` ; avec un token, les `children`. Dans `App.tsx`, la route `/models/new`, qui enveloppe sa page : `<RequireAuth><NewModelPage /></RequireAuth>`.

**C'est bon quand.** `RequireAuth.test.tsx` est vert. Déconnecté, tapez `localhost:5173/models/new` : la page de connexion. Connectez-vous : retour au formulaire.

**Pièges.**

- `/models/new` correspond aussi à `/models/:id`. React Router choisit le chemin le plus précis : l'ordre des `<Route>` ne compte pas.
- Sans `replace`, le bouton Retour du navigateur ramène sur `/models/new`, qui renvoie au login, qui…
- `RequireAuth` cache une page, il ne protège rien. La protection est dans l'API, qui vérifie le token à chaque `POST`. Un front se contourne toujours : `curl` n'a pas de `RequireAuth`.

### Étape 6 : ajouter un modèle

**À faire.** Dans `api.ts`, `createModel(model, token)` : `POST /models`, le corps en JSON, et l'en-tête `Authorization: Bearer <token>`. Dans `pages/NewModelPage.tsx`, un formulaire contrôlé, avec un seul état pour tout le brouillon, un objet de chaînes, et un `onChange` par champ :

```tsx
onChange={(event) => setDraft({ ...draft, name: event.target.value })}
```

Au `onSubmit` : `createModel(…, token)`, puis `navigate` vers la page du nouveau modèle. Les erreurs de l'API, dans un `role="alert"` au-dessus du bouton :

| L'API répond | L'utilisateur lit |
|---|---|
| 400 | « Le formulaire contient des erreurs : », puis les `details` de l'`ApiError`, en liste |
| 409 | « Un modèle avec cet identifiant existe déjà. » |
| 422 | « Organisation inconnue : créez-la d'abord. » |

Le bouton est désactivé tant que l'API n'a pas répondu.

**C'est bon quand.** `NewModelPage.test.tsx`, sauf le dernier test, et les tests `createModel` de `api.test.ts` sont verts. Ajoutez un modèle : sa page s'affiche, avec « Ajouté par alice », et il est dans le catalogue. Ajoutez-le une deuxième fois : le 409.

**Pièges.**

- Un `<input type="number">` donne une chaîne, `"12.2"`. L'API veut un nombre : `Number(…)` avant l'envoi, sinon un 400, « parameters must be a number… ».
- Une licence vide ne s'envoie pas : `license: draft.license || undefined`, et `JSON.stringify` laisse la clé de côté.
- Un double clic envoie deux `POST`, et le second reçoit un 409. D'où le bouton désactivé.
- Pour TypeScript, `token` peut valoir `null`, même si `RequireAuth` garantit le contraire : un `if (!token) return;` en tête de la fonction.

### Étape 7 : le token expiré

**À faire.** Le token ne vit qu'une heure. Dans `NewModelPage`, une `ApiError` 401 appelle `logout()` : `RequireAuth` renvoie alors à la page de connexion, qui ramène au formulaire.

**C'est bon quand.** Tous les tests sont verts. Pour le voir sans attendre une heure : DevTools → Application → Local Storage, changez le dernier caractère du token, puis ajoutez un modèle. La signature ne correspond plus, l'API répond 401, et vous voilà sur la page de connexion.

## 🛰 Pour aller plus loin

- **Supprimer un modèle**, depuis sa page : `DELETE /models/:id`. Seule alice, admin, en a le droit : bob reçoit un 403, à afficher. Cachez le bouton pour bob, puis vérifiez que l'API refuse quand même.
- **`useMutation`** de TanStack Query pour la création, et `invalidateQueries({ queryKey: ['models'] })` : le catalogue est à jour dès le retour.
- **Les organisations dans un `<select>`**, chargées depuis `GET /organisations` : plus de 422 possible.
- **Un token déjà expiré au démarrage.** Le champ `exp` du payload dit quand il expire : `AuthProvider` peut l'oublier tout de suite, sans attendre le premier 401.

## 🤖 IA

Demandez à votre assistant l'arborescence des routes de l'application, avec la page protégée. Mettez sa proposition à l'épreuve sur deux cas : un token expiré, et un lien direct vers `/models/new` sans être connecté. Où range-t-il le token, et le dit-il ?

> ⚠️ **Règle d'or** : tout code que vous ne savez pas expliquer, je le supprime.

## 🔧 Dépannage

| Message | Remède |
|---|---|
| `useAuth must be used inside <AuthProvider>` | Un composant appelle `useAuth()` hors de l'`<AuthProvider>` : il entoure `<App />` dans `main.tsx` |
| « Page introuvable » sur `/login` ou `/models/new` | La route manque dans `App.tsx`, étapes 3 et 5 |
| La page reste blanche | Une erreur JavaScript : ouvrez la console (F12), la première ligne rouge |
| 400 sur `POST /auth/login`, « username should not be empty » | L'en-tête `'Content-Type': 'application/json'` manque |
| 401 sur `POST /models` | Le token manque, ou il a expiré. L'en-tête : `Authorization: Bearer <token>`, avec l'espace |
| L'adresse finit par `?username=alice&password=secret` | `event.preventDefault()` manque au début du `onSubmit` |
| On ne peut rien taper dans un champ | Un `value` sans `onChange` |
| `blocked by CORS policy` dans la console | L'API tourne-t-elle bien depuis `tp09/api` ? Son `.env` doit avoir `WEB_ORIGIN="http://localhost:5173"` |
| `Port 5173 is already in use` | Le `npm run dev` du TP8 tourne encore : fermez-le |
| `JWT_SECRET is not set` | `cp .env.example .env`, dans `api` |

## ✅ Pour finir

```sh
git add . && git commit -m "feat(tp09): the login and the creation form" && git push
```
