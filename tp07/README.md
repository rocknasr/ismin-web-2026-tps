# TP7 : React, du composant à l'API

*Développement Web, ISMIN 3A, séance 7.*

## 🎯 Objectif

Votre API a enfin un visage. À la fin du TP, le catalogue ModelZoo s'affiche dans le navigateur avec les vraies données de l'API, filtré par tâche, avec un état de chargement et un message d'erreur quand l'API ne répond pas.

Deux parties : d'abord l'interface, sur des données écrites en dur ; ensuite le réseau. Et une troisième si vous avez le temps : la même chose avec TanStack Query, la bibliothèque qu'on utilise en entreprise.

## 🚀 Démarrer

Trois terminaux.

```sh
git pull --no-edit upstream main

# Terminal 1 : l'API
cd tp07/api
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run start:dev          # localhost:3000, la doc sur localhost:3000/docs

# Terminal 2 : le front
cd tp07/web
cp .env.example .env
npm install
npm run dev                # localhost:5173

# Terminal 3 : les tests du front
cd tp07/web
npm run test:watch
```

Ouvrez `localhost:5173` : c'est la maquette, une page statique. Ouvrez `localhost:3000/docs` : c'est le contrat de l'API, celui que vous allez appeler.

C'est tout, vous pouvez coder !

## 🗺 Ce qui est fourni

```
api/                          l'API du TP5, avec Swagger sur /docs. Une seule ligne à écrire, étape 7
web/
├── index.html                la page, avec une <div id="root"> que React remplit
├── .env.example              VITE_API_URL : où tourne l'API
└── src/
    ├── main.tsx              monte <App /> dans la page                ← étape 10
    ├── styles.css            tout le style : vous n'écrivez pas de CSS
    ├── model.ts              Task, TASKS, TASK_LABELS, Model : les mêmes types que l'API
    ├── format.ts             formatParameters, formatDownloads : les nombres à la française
    ├── models.mock.ts        six models écrits à la main, pour la première partie
    ├── App.tsx               la maquette, en JSX statique            ← étapes 2 à 4, 6 à 9, puis 11
    ├── api.ts                fetchModels, à écrire                   ← étape 5
    ├── components/
    │   ├── ModelCard.tsx     une carte                               ← étape 2
    │   ├── ModelList.tsx     la liste des cartes                     ← étape 3
    │   └── TaskFilter.tsx    les boutons du filtre                   ← étape 4
    └── *.test.tsx            le sujet, ne pas modifier
```

## 📐 Les règles

- **Un composant est une fonction** qui reçoit des props et renvoie du JSX. Pas de classe.
- **L'état vit en haut.** Le filtre sélectionné et la liste vivent dans `App`. `TaskFilter` et `ModelList` ne font qu'afficher ce qu'on leur donne, et remonter les clics par `onChange`.
- **Le balisage est celui de la maquette.** Les tests cherchent ce que voit l'utilisateur : un titre par model, une liste, des boutons, un `role="status"` pendant le chargement, un `role="alert"` en cas d'erreur.
- **Pas de CSS à écrire.** Les classes de `styles.css` sont celles de la maquette : recopiez-les.

## 📝 Les étapes

### Partie 1 : l'interface

### Étape 1 : lancer les deux mondes

**À faire.** Les trois terminaux ci-dessus. Dans `localhost:3000/docs`, essayez `GET /models`, puis `GET /models?task=translation`.

**C'est bon quand.** La maquette s'affiche sur `localhost:5173`, `/docs` répond, et les tests tournent : presque tous rouges, c'est normal.

### Étape 2 : `ModelCard`

**À faire.** Dans `components/ModelCard.tsx`, une carte de la maquette avec les données de `model` au lieu du texte écrit à la main. Puis, dans `App.tsx`, remplacez la première carte de la maquette par `<ModelCard model={MOCK_MODELS[0]} />`.

- Les nombres : `formatParameters` et `formatDownloads`, dans `format.ts`.
- La tâche en français : `TASK_LABELS[model.task]`.
- Pas de licence, pas de ligne « Licence ».

**C'est bon quand.** `ModelCard.test.tsx` est vert, et la carte s'affiche à l'identique dans le navigateur.

**Piège.** En JSX, c'est `className`, pas `class`.

### Étape 3 : `ModelList`

**À faire.** Dans `components/ModelList.tsx`, la `<ul>` de la maquette : un `<li>` par model, un `ModelCard` dans chacun. Sans model, le texte « Aucun modèle pour ce filtre. » à la place de la liste. Dans `App.tsx`, toute la `<ul>` devient `<ModelList models={MOCK_MODELS} />`.

**C'est bon quand.** `ModelList.test.tsx` est vert, et les six models de `models.mock.ts` s'affichent.

**Piège.** La console du navigateur crie `Each child in a list should have a unique "key" prop` : chaque `<li>` d'un `map` a besoin d'une `key`. L'`id` du model est fait pour ça, l'index du tableau non.

### Étape 4 : `TaskFilter`, et l'état dans `App`

**À faire.** Dans `components/TaskFilter.tsx`, le `<nav>` de la maquette : « Toutes », puis un bouton par tâche de `TASKS`. Le bouton sélectionné a `aria-pressed={true}`. Un clic appelle `onChange`. Dans `App.tsx`, l'état :

```tsx
const [task, setTask] = useState<Task | undefined>(undefined);
```

`App` donne `task` et `setTask` au filtre, et filtre `MOCK_MODELS` avant de les donner à la liste.

**C'est bon quand.** `TaskFilter.test.tsx` est vert, et cliquer sur « Traduction » n'affiche plus que les deux models de traduction.

**Piège.** `TaskFilter` ne garde aucun état : s'il avait son propre `useState`, `App` ne saurait pas quoi filtrer. Un des tests le vérifie.

### Partie 2 : le réseau

### Étape 5 : `fetchModels`

**À faire.** Dans `api.ts`, `fetchModels(task?)` : `GET ${API_URL}/models`, avec `?task=…` quand une tâche est donnée. Une réponse qui n'est pas `ok`, un 404 ou un 500, lève une erreur.

**C'est bon quand.** `api.test.ts` est vert. Les tests remplacent `fetch` par un faux : aucune API ne tourne pendant les tests.

**Piège.** `fetch` ne rejette que si le réseau tombe. Un 500 est une réponse comme une autre : seul `res.ok` le dit.

### Étape 6 : les vraies données

**À faire.** Dans `App.tsx`, `MOCK_MODELS` disparaît : un `useEffect` appelle `fetchModels()` et range le résultat dans un état. Rechargez `localhost:5173`, et ouvrez la console du navigateur (F12).

**C'est bon quand.** Vous lisez dans la console une erreur qui parle de CORS. C'est l'étape suivante.

**Piège.** Un `fetch` écrit directement dans le corps du composant, hors d'un `useEffect`, se relance à chaque rendu. Et chaque réponse déclenche un rendu. Regardez l'onglet Réseau si votre ventilateur s'emballe.

### Étape 7 : le CORS, côté API

**À faire.** Dans `api/src/main.ts`, autorisez l'origine du front, lue dans `WEB_ORIGIN`. La variable est déjà dans `.env.example`. Relancez l'API si elle ne l'a pas fait seule.

**C'est bon quand.** Les models de l'API s'affichent dans le navigateur. Vérifiez qu'ils viennent bien de l'API : il y en a dix-sept, pas six.

**Piège.** `origin: '*'`, une extension « Allow CORS », désactiver la sécurité du navigateur : des pansements. Le CORS se règle sur le serveur, avec une origine explicite.

### Étape 8 : les trois états

**À faire.** Un appel réseau a trois états, trois rendus : pendant le chargement, « Chargement… » dans un élément `role="status"` ; en cas d'erreur, un message dans un élément `role="alert"` ; sinon, la liste. Les classes `status` et `error` sont dans `styles.css`.

**C'est bon quand.** Les tests de chargement et d'erreur de `App.test.tsx` sont verts. Arrêtez l'API, rechargez la page : le message d'erreur s'affiche, pas une page blanche.

### Étape 9 : le filtre, côté serveur

**À faire.** Le filtre ne trie plus une liste en mémoire : il demande à l'API. L'effet appelle `fetchModels(task)` et se relance quand `task` change.

**C'est bon quand.** Tous les tests sont verts, et l'onglet Réseau montre un `GET /models?task=translation` quand vous cliquez sur « Traduction ».

**Piège.** Oubliez `task` dans le tableau de dépendances, et le filtre ne fait plus rien. Le mettez, sans rien d'autre, et l'effet repart à chaque changement de filtre : c'est ce qu'on veut.

### Partie 3 : TanStack Query, si vous avez le temps

Tout ce que vous venez d'écrire à la main, les trois états, la réponse périmée, le double appel du `StrictMode`, une bibliothèque le fait pour vous : [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview). Elle est déjà installée. Faites un commit de la version `useEffect` avant de commencer : c'est elle que vous devez savoir expliquer.

### Étape 10 : le client et son provider

**À faire.** Dans `main.tsx`, créez un `QueryClient` et enveloppez `<App />` dans un `<QueryClientProvider client={…}>`. Le client garde le cache de toutes les requêtes de l'application.

**C'est bon quand.** Rien n'a changé à l'écran, et les tests sont toujours verts.

### Étape 11 : `useQuery` à la place de l'effet

**À faire.** Dans `App.tsx`, le `useEffect` et les états `models`, `status` et `error` disparaissent :

```tsx
const { data, error, isPending, isError } = useQuery({
  queryKey: ['models', task],
  queryFn: () => fetchModels(task),
});
```

`isPending`, `isError` et `data` remplacent les trois états. `fetchModels` ne change pas.

**C'est bon quand.** Tous les tests restent verts. Dans l'onglet Réseau, un seul `GET /models` au chargement, malgré le `StrictMode`. Et en revenant sur « Toutes », la liste s'affiche tout de suite, depuis le cache, puis se rafraîchit.

**Pièges.**

- La clé joue le rôle du tableau de dépendances : sans `task` dedans, le filtre ne fait plus rien.
- Par défaut, une requête qui échoue est relancée trois fois. Arrêtez l'API : l'erreur met plusieurs secondes à apparaître. `defaultOptions: { queries: { retry: 1 } }` dans le `QueryClient`.

### Étape 12 : voir le cache

**À faire.** `npm install @tanstack/react-query-devtools`, puis `<ReactQueryDevtools />` à l'intérieur du provider. Cliquez sur les filtres, et regardez les requêtes apparaître dans le cache, une par clé.

**C'est bon quand.** Vous savez dire pourquoi « Traduction » ne recharge rien la deuxième fois.

## 🛰 Pour aller plus loin

- **Un bouton « Réessayer »** dans le message d'erreur, qui relance l'appel. La classe `retry` est prête.
- **La réponse périmée.** Cliquez très vite sur deux filtres : la première réponse peut arriver après la seconde et l'écraser. Un `AbortController`, ou un drapeau `ignore` dans le nettoyage de l'effet.
- **Les types générés.** `npx openapi-typescript http://localhost:3000/docs-json -o src/api-types.ts` : les types viennent du contrat de l'API au lieu d'être recopiés. Comparez avec `model.ts`.
- **Filtrer par organisation**, avec `?org=` : l'API le sait déjà.

## 🤖 IA

Donnez la maquette `App.tsx` à votre assistant et demandez-lui de la découper en composants. Comparez avec votre découpage : combien de composants propose-t-il, et où met-il l'état ?

Puis collez-lui l'erreur CORS de l'étape 6. Triez ses propositions : lesquelles corrigent le serveur, lesquelles contournent le navigateur ?

> ⚠️ **Règle d'or** : tout code que vous ne savez pas expliquer, je le supprime.

## 🔧 Dépannage

| Message | Remède |
|---|---|
| `blocked by CORS policy` dans la console | C'est l'étape 7 : `enableCors` dans `api/src/main.ts`, avec `WEB_ORIGIN` |
| `Failed to fetch`, sans parler de CORS | L'API ne tourne pas : terminal 1, `npm run start:dev` |
| La page reste blanche | Une erreur JavaScript : ouvrez la console (F12), la première ligne rouge |
| `Each child in a list should have a unique "key" prop` | Une `key` sur chaque élément d'un `map`, étape 3 |
| Des centaines de `GET /models` dans l'onglet Réseau | Un `fetch` hors d'un `useEffect`, ou un effet sans tableau de dépendances |
| Deux `GET /models` au chargement | Normal en développement : `StrictMode` lance chaque effet deux fois, exprès |
| `Port 5173 is already in use` | Un autre `npm run dev` tourne encore : fermez-le |
| `No QueryClient set, use QueryClientProvider to set one` | Étape 10 : le `QueryClientProvider` manque autour de `<App />`, dans `main.tsx` |
| `JWT_SECRET is not set` | `cp .env.example .env`, dans `api` |

## ✅ Pour finir

```sh
git add . && git commit -m "feat(tp07): the React catalogue, on the real API" && git push
```
