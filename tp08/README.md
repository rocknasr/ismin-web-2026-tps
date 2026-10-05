# TP8 : une adresse par page

*Développement Web, ISMIN 3A, séance 8.*

## 🎯 Objectif

Votre catalogue n'a qu'une page, et une seule adresse. À la fin du TP, chaque modèle a sa page, avec sa propre adresse : on peut la recharger, la mettre en favori, l'envoyer à quelqu'un. Et une adresse inconnue affiche une vraie page d'erreur.

C'est le routage côté client, avec React Router : quatre étapes courtes. Les plus rapides trouveront de quoi continuer dans « Pour aller plus loin ».

On part du corrigé de la partie 3 du TP7 : le catalogue avec TanStack Query. Si vous ne l'avez pas faite, lisez `pages/CatalogPage.tsx` : `useQuery` y remplace le `useEffect` et les trois états que vous avez écrits à la main.

## 🚀 Démarrer

Trois terminaux.

```sh
git pull --no-edit upstream main

# Terminal 1 : l'API
cd tp08/api
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run start:dev          # localhost:3000, la doc sur localhost:3000/docs

# Terminal 2 : le front
cd tp08/web
cp .env.example .env
npm install
npm run dev                # localhost:5173

# Terminal 3 : les tests du front
cd tp08/web
npm run test:watch
```

Arrêtez d'abord l'API et le front du TP7 : ce sont les mêmes ports.

Ouvrez `localhost:5173` : le catalogue du TP7. Tapez `localhost:5173/models/t5-base` dans la barre d'adresse : l'adresse change, mais la page reste le catalogue. C'est l'étape 2.

C'est tout, vous pouvez coder !

## 🗺 Ce qui est fourni

```
api/                          l'API du TP7, CORS compris. Rien à écrire
web/
├── .env.example              VITE_API_URL : où tourne l'API
└── src/
    ├── main.tsx              les providers autour de <App />           ← étape 2
    ├── App.tsx               l'en-tête, puis la page de l'URL          ← étape 2
    ├── styles.css            tout le style : vous n'écrivez pas de CSS
    ├── model.ts              les types du TP7
    ├── format.ts             les nombres à la française
    ├── api.ts                ApiError, throwIfNotOk, fetchModels       ← étape 4
    ├── components/
    │   ├── Header.tsx        l'en-tête, avec un <a>                    ← étape 3
    │   ├── ModelCard.tsx     une carte, le corrigé du TP7              ← étape 3
    │   ├── ModelList.tsx     le corrigé du TP7
    │   └── TaskFilter.tsx    le corrigé du TP7
    ├── pages/
    │   ├── CatalogPage.tsx   le catalogue du TP7, partie 3
    │   ├── NotFoundPage.tsx  « Page introuvable »                      ← étapes 2 et 3
    │   └── ModelPage.tsx     la maquette de la page d'un modèle        ← étapes 2 à 4
    ├── test-utils.tsx        renderApp, fakeApi : les outils des tests
    └── *.test.tsx            le sujet, ne pas modifier
```

## 📐 Les règles

- **Une URL, une page.** Chaque page est un composant de `pages/`, et `App.tsx` dit quelle URL affiche quelle page.
- **Des `<Link>`, jamais des `<a href>`,** pour aller d'une page de l'application à une autre.
- **Le balisage est celui des maquettes.** Les tests cherchent ce que voit l'utilisateur : les titres, les liens, un `role="status"` pendant le chargement, un `role="alert"` pour les erreurs.
- **Pas de CSS à écrire.** Les classes de `styles.css` sont celles des maquettes.

## 📝 Les étapes

### Étape 1 : lancer les deux mondes

**À faire.** Les trois terminaux ci-dessus. Dans `localhost:3000/docs`, essayez `GET /models/mistral-7b-instruct-v0-3`, puis `GET /models/nimporte-quoi`.

**C'est bon quand.** Le catalogue s'affiche sur `localhost:5173`, `/docs` vous a donné un modèle puis un 404, et les tests tournent : 14 verts, 14 rouges, c'est normal.

### Étape 2 : les routes

**À faire.** Dans `main.tsx`, un `<BrowserRouter>` autour des providers : il lit l'URL dans la barre d'adresse. Dans `App.tsx`, sous le `<Header />`, un `<Routes>` avec un `<Route>` par ligne du commentaire :

```tsx
<Routes>
  <Route path="/" element={<CatalogPage />} />
  …
</Routes>
```

`/models/:id` : `:id` est un paramètre. `/models/t5-base` et `/models/whisper-large-v3` affichent la même page, avec un `id` différent. `*` attrape toutes les autres adresses.

**C'est bon quand.** Les trois tests « the routes » de `App.test.tsx` sont verts. Tapez `localhost:5173/models/t5-base` : la maquette de la page d'un modèle. Tapez `localhost:5173/nimporte-quoi` : « Page introuvable ».

**Pièges.**

- En version 8, `react-router-dom` n'existe plus : tout s'importe de `react-router`. Les tutos, et l'IA, le proposent encore.
- Le `<BrowserRouter>` va dans `main.tsx`, pas dans `App.tsx` : les tests mettent `App` dans leur propre routeur, et un routeur dans un routeur plante.
- L'ordre des `<Route>` ne compte pas : React Router choisit le chemin le plus précis, et `*` ne sert qu'en dernier recours.

### Étape 3 : des liens, pas des `<a>`

**À faire.** Dans `Header.tsx`, `NotFoundPage.tsx` et `ModelPage.tsx`, les `<a href="…">` deviennent des `<Link to="…">`. Dans `ModelCard.tsx`, le nom du modèle devient un lien vers `/models/<id>`.

**C'est bon quand.** `App.test.tsx` et `ModelCard.test.tsx` sont verts. Onglet Réseau ouvert, cliquez d'une page à l'autre : seulement des appels à l'API, jamais un nouveau chargement de `localhost:5173`.

**Pièges.**

- Un `<a href>` a l'air de marcher. Mais il demande une page entière au serveur : React repart de zéro, l'état et le cache de TanStack Query sont perdus. Comparez dans l'onglet Réseau.
- `to="/models/{model.id}"` : entre guillemets, les accolades restent du texte, et l'adresse contient littéralement `{model.id}`. Une adresse calculée s'écrit entre accolades, avec des backquotes : ``to={`/models/${model.id}`}``.

### Étape 4 : la page d'un modèle

**À faire.** Dans `api.ts`, `fetchModel(id)` : `GET /models/:id`, puis `throwIfNotOk`, comme `fetchModels`. Dans `pages/ModelPage.tsx`, la maquette devient la page du modèle de l'URL :

- l'`id`, avec `useParams()` ;
- le modèle, avec `useQuery` et la clé `['model', id]` ;
- les trois états, comme dans `CatalogPage`. Un 404 : « Modèle introuvable. » dans le `role="alert"` ;
- pas de licence : « Non précisée ». Pas de `createdBy` : pas de ligne « Ajouté par ».

**C'est bon quand.** Tous les tests sont verts. Ouvrez un modèle, puis rechargez la page : elle s'affiche toujours, l'adresse suffit. Tapez `localhost:5173/models/nimporte-quoi` : « Modèle introuvable. ».

**Pièges.**

- La clé : `['model', id]`, pas `['model']`. Sans l'`id`, toutes les pages partagent la même case du cache, et la page de Llama affiche Mistral.
- `error` est une `Error` pour TypeScript. Pour lire son `status`, vérifiez d'abord que c'est une `ApiError`, avec `instanceof`.
- `useParams()` donne `string | undefined`. Sur `/models/:id`, l'`id` est toujours là, mais TypeScript ne le sait pas.
- Dans le navigateur, « Modèle introuvable. » met une seconde à s'afficher : `retry: 1`, dans `main.tsx`, retente aussi un 404. Voir « Pour aller plus loin ».

## 🛰 Pour aller plus loin

- **Le filtre dans l'URL.** Aujourd'hui, choisissez « Traduction », ouvrez un modèle, revenez : le filtre est perdu. Rangez-le dans l'adresse, `/?task=translation`, avec `useSearchParams` à la place du `useState` de `CatalogPage`. Le filtre survit au bouton Retour, et le lien se partage : l'URL fait partie de l'état.
- **Un menu avec `NavLink`.** Une page « À propos », `/about`, et un `<nav className="app-nav">` dans l'en-tête, avec un `<NavLink>` vers `/` et un vers `/about`. `NavLink` sait si son lien mène à la page courante, et lui ajoute la classe `active`, déjà dans `styles.css`.
- **Pas de relance pour un 404.** `retry` accepte une fonction, `(failureCount, error) => …`. Ne relancez que ce qui peut changer, les 5xx et les pannes réseau : « Modèle introuvable. » s'affiche alors tout de suite.
- **Le titre de l'onglet.** Le nom du modèle dans l'onglet du navigateur : React 19 place un `<title>` écrit dans n'importe quel composant dans le `<head>`.
- **Revenir en arrière.** « ← Retour au catalogue » mène toujours à `/`, même quand on venait d'ailleurs. `useNavigate()`, puis `navigate(-1)` : comme le bouton Retour du navigateur.
- **Recharger une page en production.** `npm run build`, puis `npm run preview`, puis rechargez `/models/t5-base`. Ça marche, parce que Vite renvoie `index.html` pour toutes les adresses. Un serveur de fichiers ordinaire répondrait 404 : on y reviendra avec Docker.

## 🤖 IA

Demandez à votre assistant l'arborescence des routes de l'application. Mettez sa proposition à l'épreuve sur deux cas : une adresse inconnue, et un lien direct vers la page d'un modèle, collé dans un nouvel onglet. Et regardez ses imports : propose-t-il `react-router-dom` ?

> ⚠️ **Règle d'or** : tout code que vous ne savez pas expliquer, je le supprime.

## 🔧 Dépannage

| Message | Remède |
|---|---|
| `Failed to resolve import "react-router-dom"` | En version 8, tout s'importe de `react-router` |
| `useRoutes() may be used only in the context of a <Router> component` | Le `<BrowserRouter>` manque dans `main.tsx`, étape 2. Même remède pour `useHref()` |
| `You cannot render a <Router> inside another <Router>` | Un `<BrowserRouter>` dans `App.tsx` : sa place est dans `main.tsx`, les tests ont le leur |
| La page reste blanche | Une erreur JavaScript : ouvrez la console (F12), la première ligne rouge |
| La page de Llama affiche Mistral | La clé de `useQuery` ne contient pas l'`id` |
| `blocked by CORS policy` dans la console | L'API tourne-t-elle bien depuis `tp08/api` ? Son `.env` doit avoir `WEB_ORIGIN="http://localhost:5173"` |
| `Port 5173 is already in use` | Le `npm run dev` du TP7 tourne encore : fermez-le |
| `JWT_SECRET is not set` | `cp .env.example .env`, dans `api` |

## ✅ Pour finir

```sh
git add . && git commit -m "feat(tp08): one page per URL" && git push
```
