---
theme: seriph
favicon: ./favicon-mse.png
layout: center
title: "Séance 7 : React, du composant à l’API"
info: |
  ## Développement Web · ISMIN 3A
  Full-Stack TypeScript, DevOps & AI-Assisted Coding
class: text-center
highlighter: shiki
fonts:
  sans: Roboto
  serif: Roboto
  mono: JetBrains Mono
  weights: '300,400,500,700'
drawings:
  persist: false
transition: slide-left
mdc: true
---

<CourseCover :sprint="3" :seance="7" />

# React

## Du composant à l’API

<div class="pt-4 op-75">Séance 7&nbsp;: Sprint 3, Fusion & QA</div>

<div class="pt-10 text-sm op-75">
📱 <b>gaetanmaisse.github.io/ismin-web-2026-tps</b>
</div>

---

# Le but de la journée

<div class="grid grid-cols-5 gap-6 pt-2">
<div class="col-span-3">

<BrowserFrame flush>
<img src="/medias/s07-modelzoo.png" alt="Le catalogue ModelZoo filtré sur la génération de texte" class="block w-full" />
</BrowserFrame>

</div>
<div class="col-span-2 text-sm">

**Le catalogue ModelZoo, dans le navigateur**, avec les vraies données de votre API, filtré par tâche.

<div class="pt-4">

Au départ, une maquette statique&nbsp;: trois cartes écrites à la main.

À la fin, vous aurez écrit&nbsp;:

- les **composants**&nbsp;: la carte, la liste, le filtre&nbsp;;
- l’**état**&nbsp;: la tâche choisie&nbsp;;
- l’**appel à l’API**, avec son chargement et ses erreurs.

</div>

<div class="pt-4 op-75">
Le CSS est fourni&nbsp;: vous n’écrivez pas une ligne de style.
</div>
</div>
</div>

---
layout: section
---

# 1. Le navigateur et React

---

# Ce que fait le navigateur

<div class="grid grid-cols-2 gap-8 pt-2">
<div>

```html
<ul id="models">
  <li>Mistral 7B · mistralai</li>
  <li>Whisper · openai</li>
</ul>
```

<div class="text-center text-sm op-60 py-1">↓ ce que le navigateur affiche</div>

<BrowserFrame>
<ul>
  <li>Mistral 7B · mistralai</li>
  <li>Whisper · openai</li>
</ul>
</BrowserFrame>

</div>
<div class="text-sm">

Le navigateur lit le HTML et en construit un arbre en mémoire&nbsp;: le **DOM**, pour *Document Object Model*. C’est le DOM qu’il dessine à l’écran, pas le fichier.

<div class="p-4 mt-4 border border-gray-500 border-opacity-30 rounded">

**HTML** → le texte envoyé par le serveur

**DOM** → l’arbre d’objets, un par balise

**CSS** → l’apparence&nbsp;: couleurs, tailles, marges

**JavaScript** → modifie le DOM, et l’écran suit

</div>

<div class="pt-4 op-75">
Sans CSS, une liste, ce sont des puces. Dans le TP, le CSS est fourni.
</div>
</div>
</div>

---

# Modifier le DOM à la main

```js
// Trouver l’élément dont l’id est "models" (# = id)
const list = document.querySelector('#models');

for (const model of models) {      // models : un tableau de modèles
  const item = document.createElement('li');
  item.textContent = `${model.name} · ${model.org}`;
  list.appendChild(item);          // l’ajouter à la liste, à l’écran
}
```

<v-click>

<div class="pt-4 grid grid-cols-2 gap-6 text-sm">
<div class="p-4 bg-blue-500 bg-opacity-10 rounded">

**Et quand l’utilisateur change de filtre&nbsp;?**

Tout effacer, tout refaire. Sans oublier le bouton actif, le compteur, le message «&nbsp;aucun résultat&nbsp;».

</div>
<div class="p-4 bg-blue-500 bg-opacity-10 rounded">

**Et quand les données arrivent du réseau&nbsp;?**

Un indicateur de chargement à afficher, puis à retirer. Une erreur à montrer, puis à effacer. À chaque fois, à la main.

</div>
</div>

</v-click>

---

# Une page, redessinée par JavaScript

<div class="grid grid-cols-2 gap-6 pt-2 text-sm">
<div class="p-4 border border-gray-500 border-opacity-30 rounded">

**Un site classique**

Chaque clic demande une nouvelle page HTML complète au serveur. L’écran se vide, puis se redessine.

</div>
<div class="p-4 border border-blue-500 border-opacity-50 rounded">

**Une SPA**, *single-page application*

Une seule page. JavaScript la redessine, et ne demande au serveur **que des données**, en JSON&nbsp;: votre API.

</div>
</div>

<div class="pt-6">

**Vite** sert votre application pendant le développement&nbsp;: il traduit votre code pour le navigateur, et recharge la page à chaque enregistrement.

</div>

```sh
npm run dev      # → http://localhost:5173
```

---

# React, en une phrase

<div class="grid grid-cols-2 gap-8 pt-2">
<div>

**Une bibliothèque pour construire une interface en composants**, créée par Meta en 2013. Pas un framework&nbsp;: elle ne s’occupe que de l’affichage.

<div class="pt-4 text-sm">

| Paquet npm | Son rôle |
|---|---|
| `react` | les composants, `useState`, `useEffect` |
| `react-dom` | écrire le résultat dans la page |

</div>
</div>
<div>

```tsx
// src/main.tsx : le seul endroit où vous touchez
// au DOM. Vous confiez la <div id="root"> à React
createRoot(document.getElementById('root')!)
  .render(<App />);
```

<div class="pt-4 text-sm op-75">
Le reste du temps, vous ne touchez plus au DOM&nbsp;: vous décrivez l’écran, React s’occupe du DOM.
</div>

<div class="pt-2 text-sm op-75">
Le <code>!</code>&nbsp;: <code>getElementById</code> peut renvoyer <code>null</code>. Le <code>!</code> dit à TypeScript «&nbsp;cet élément existe, je le sais&nbsp;».
</div>
</div>
</div>

---

# UI = f(état)

<div class="grid grid-cols-5 gap-6 pt-2">
<div class="col-span-3">

**L’état**, ce sont les données qui changent pendant que la page est ouverte. Dans ModelZoo&nbsp;: la tâche choisie, la liste des modèles, «&nbsp;en cours de chargement&nbsp;» ou non.

<v-clicks>

- Vous décrivez **à quoi ressemble l’écran** pour un état donné. Pas comment passer d’un écran à l’autre.
- L’état change&nbsp;: React **rappelle votre fonction**.
- Il **compare** le nouveau résultat à l’ancien.
- Il ne touche le DOM **que là où ça a changé**.

</v-clicks>

</div>
<div class="col-span-2 text-sm">

<div class="p-4 bg-blue-500 bg-opacity-10 rounded">

**Le vocabulaire de la séance**

**L’état**, *state*&nbsp;: les données qui changent.

**Un rendu**, *render*&nbsp;: un appel de votre fonction, qui décrit l’écran.

**Le montage**, *mount*&nbsp;: le tout premier rendu, quand le composant apparaît.

<div class="pt-2 text-xs op-75">
La doc de React et les messages d’erreur sont en anglais&nbsp;: <i>Too many re-renders</i>, c’est «&nbsp;trop de rendus&nbsp;».
</div>

</div>

<div class="pt-4 op-75">
Le filtre, le chargement, l’erreur&nbsp;: plus rien à défaire à la main.
</div>
</div>
</div>

---

# Le JavaScript de React

<div class="grid grid-cols-2 gap-6 pt-2">
<div>

```ts
// Déstructurer un objet
const { name, org } = model;

// Déstructurer un tableau
const [first, second] = ['a', 'b'];

// Une fonction fléchée
const double = (x: number) => x * 2;

// Une chaîne avec des valeurs : des backquotes
const url = `${API_URL}/models?task=${task}`;

// Une valeur par défaut, si null ou undefined
const license = model.license ?? 'Non précisée';
```

</div>
<div>

```ts
// Transformer chaque élément
const names = models.map((m) => m.name);

// Garder certains éléments
const big = models.filter((m) => m.parameters > 10);

// Choisir entre deux valeurs
const label = count > 1 ? 'modèles' : 'modèle';

// Copier un objet, en changeant un champ
const renamed = { ...model, name: 'Mistral' };
```

</div>
</div>

<div class="pt-4 text-sm op-75">
React n’a presque pas de syntaxe à lui. Ce qui surprend au début, c’est ce JavaScript-là, qu’on retrouve dans chaque composant.
</div>

---

# JSX n’est pas du HTML

<div class="grid grid-cols-5 gap-6 pt-2">
<div class="col-span-3">

```tsx
const count = 17;

const header = (
  <header className="header">
    <h1>ModelZoo</h1>
    <p>{count} modèles</p>
  </header>
);
```

<BrowserFrame>
<div style="margin: 4px 0 10px; font-size: 32px; font-weight: bold; line-height: 1.2;">ModelZoo</div>
<div style="margin: 0 0 4px; font-size: 16px; line-height: 1.4;">17 modèles</div>
</BrowserFrame>

</div>
<div class="col-span-2 text-sm">

<v-clicks>

- `className`, pas `class`&nbsp;: `class` est un mot réservé de TypeScript.
- Entre accolades, **n’importe quelle expression**&nbsp;: une variable, un calcul, un appel.
- **Un seul élément racine.** Pour renvoyer deux éléments côte à côte, un fragment les enveloppe&nbsp;:

```tsx
<>
  <h1>ModelZoo</h1>
  <p>17 modèles</p>
</>
```
- Toute balise se ferme&nbsp;: `<input />`, `<br />`.
- Les attributs s’écrivent en camelCase&nbsp;: `onClick`, `htmlFor`.
- Un commentaire&nbsp;: `{/* … */}`.

</v-clicks>

</div>
</div>

---

# `.ts` ou `.tsx`&nbsp;: où vit le JSX

<div class="grid grid-cols-2 gap-8 pt-2">
<div>

| Extension | Le langage |
|---|---|
| `.js` | JavaScript |
| `.jsx` | JavaScript **avec du JSX** |
| `.ts` | TypeScript |
| `.tsx` | TypeScript **avec du JSX** |

<div class="pt-4 text-sm">

Une balise dans un `.ts`, et le compilateur refuse. Dans le TP&nbsp;: `App.tsx` et les composants en `.tsx`&nbsp;; `api.ts`, `model.ts`, `format.ts` en `.ts`, ils n’affichent rien.

</div>
</div>
<div>

Le navigateur ne comprend pas le JSX. Vite le traduit avant de l’envoyer&nbsp;:

```tsx
// ModelCard.tsx : ce que vous écrivez
<h2 className="card-title">{model.name}</h2>
```

```js
// ce que reçoit le navigateur
jsx("h2", {
  className: "card-title",
  children: model.name,
});
```

<div class="pt-2 text-sm op-75">
Chaque balise devient un appel de fonction, et ses attributs, un objet.
</div>
</div>
</div>

---

# Un composant, c’est une fonction

<div class="grid grid-cols-5 gap-6 pt-2">
<div class="col-span-3">

```tsx
interface ModelCardProps {
  model: Model;
}

const ModelCard = ({ model }: ModelCardProps) => {
  return (
    <article className="card">
      <h2>{model.name}</h2>
      <p>{model.org}</p>
    </article>
  );
};
```

```tsx
const mistral: Model = { id: 'mistral-7b', /* … */ };

<ModelCard model={mistral} />
```

</div>
<div class="col-span-2 text-sm">

**Les props arrivent dans un seul objet.** React appelle `ModelCard({ model: mistral })`. Les accolades de `{ model }` déstructurent cet objet.

<div class="pt-3">

**Une majuscule, toujours.** `<ModelCard />` est un composant&nbsp;; `<modelCard />` serait pris pour une balise HTML inconnue.

</div>

<div class="mt-3 p-3 bg-blue-500 bg-opacity-10 rounded">

**Pas de classe, pas d’héritage.** Une fonction qui reçoit des données et renvoie une description de l’écran. On ne spécialise pas un composant&nbsp;: on en **compose** plusieurs.

</div>
</div>
</div>

---

# Deux écritures, le même composant

<div class="grid grid-cols-2 gap-6 pt-2">
<div>

**Une déclaration de fonction**

```tsx
function ModelCard({ model }: ModelCardProps) {
  return <h2>{model.name}</h2>;
}
```

</div>
<div>

**Une fonction fléchée**, la plus répandue

```tsx
const ModelCard = ({ model }: ModelCardProps) => (
  <h2>{model.name}</h2>
);
```

</div>
</div>

<div class="grid grid-cols-2 gap-6 pt-3 text-sm">
<div>

- Des **parenthèses** après la flèche&nbsp;: le JSX est renvoyé directement, sans `return`.
- Des **accolades**&nbsp;: un corps de fonction, avec un `return`. Nécessaire dès qu’il y a un `useState` ou un `if`.
- Pour React, les deux sont identiques. **Dans le TP&nbsp;: des fonctions fléchées.**

</div>
<div class="p-3 bg-blue-500 bg-opacity-10 rounded">

**Exporter, importer**

```tsx
export const ModelCard = …   // un export nommé
import { ModelCard } from './ModelCard';

export default App;          // l’export par défaut
import App from './App';
```

Les tests importent les composants **par leur nom**, avec les accolades.

</div>
</div>

---

# Afficher, ou non

<div class="grid grid-cols-5 gap-6 pt-2">
<div class="col-span-3">

```tsx
// Une ligne, seulement s’il y a une licence
{model.license && <p>Licence {model.license}</p>}

// L’un ou l’autre
{models.length === 0
  ? <p>Aucun modèle pour ce filtre.</p>
  : <ModelList models={models} />}

// Rien d’autre à afficher : sortir tout de suite
if (models.length === 0) {
  return <p>Aucun modèle pour ce filtre.</p>;
}
```

</div>
<div class="col-span-2 text-sm">

Pas de `if` **dans** le JSX&nbsp;: seulement des expressions. D’où `&&` et le ternaire.

- `a && b`&nbsp;: si `a` est faux, rien ne s’affiche. Sinon, `b`.
- `a ? b : c`&nbsp;: `b` ou `c`, jamais les deux.
- Avant le `return`, un `if` ordinaire fonctionne.

<div class="pt-4 op-75">
Piège&nbsp;: <code>{count && …}</code> affiche <code>0</code> quand <code>count</code> vaut 0. Écrivez <code>{count > 0 && …}</code>.
</div>
</div>
</div>

---

# Des listes&nbsp;: `map` et `key`

<div class="grid grid-cols-5 gap-6 pt-2">
<div class="col-span-3">

```tsx
<ul className="model-list">
  {models.map((model) => (
    <li key={model.id}>
      <ModelCard model={model} />
    </li>
  ))}
</ul>
```

</div>
<div class="col-span-2 text-sm">

Une liste de données devient une liste d’éléments avec `map`.

**La `key`** dit à React quel élément est lequel d’un rendu à l’autre. Elle se pose sur l’élément le plus extérieur du `map`, ici le `<li>`.

Un identifiant stable&nbsp;: l’`id`. Pas l’index, si la liste peut changer d’ordre.

<div class="pt-4 op-75">
Sans <code>key</code>, la console vous le rappelle en rouge.
</div>
</div>
</div>

---

# `useState`&nbsp;: la mémoire d’un composant

<div class="grid grid-cols-5 gap-6 pt-2">
<div class="col-span-3">

```tsx
import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Cliqué {count} fois
    </button>
  );
};
```

<BrowserFrame>
<button>Cliqué 1 fois</button>
</BrowserFrame>

</div>
<div class="col-span-2 text-sm">

<v-clicks>

- `useState(0)` renvoie deux choses&nbsp;: la valeur actuelle, `count`, et la fonction qui la change, `setCount`. `0` est la valeur de départ.
- Au clic, `setCount` enregistre la nouvelle valeur, puis React rappelle `Counter`&nbsp;: un nouveau rendu, et le bouton affiche `1`.
- Pourquoi pas un simple `let count = 0`&nbsp;? `Counter` est rappelée à chaque rendu&nbsp;: la variable repartirait de zéro, et React ne saurait pas qu’il faut redessiner.

</v-clicks>

<v-click>

<div class="pt-3 op-75">
Piège&nbsp;: <code>setCount</code> ne change pas <code>count</code> tout de suite. Juste après, <code>console.log(count)</code> affiche encore l’ancienne valeur&nbsp;: la nouvelle arrive au rendu suivant.
</div>

</v-click>

</div>
</div>

---

# Les hooks, et leurs deux règles

<div class="grid grid-cols-2 gap-8 pt-2">
<div>

Un **hook** est une fonction de React dont le nom commence par `use`&nbsp;: `useState`, `useEffect`. Il donne à un composant ce qu’une simple fonction n’a pas, une mémoire ou des effets.

<div class="pt-4 p-4 border border-gray-500 border-opacity-30 rounded text-sm">

**Règle 1.** Toujours en haut du composant, jamais dans un `if`, une boucle ou une fonction imbriquée.

**Règle 2.** Seulement dans un composant, ou dans un autre hook.

</div>
</div>
<div>

```tsx
const App = () => {
  const [task, setTask] = useState<Task>();   // ✅

  if (task) {
    const [page, setPage] = useState(1);      // ❌
  }
  // …
};
```

<div class="pt-2 text-sm op-75">
React retrouve chaque état par son ordre d’appel. Un hook dans un <code>if</code>, et l’ordre change d’un rendu à l’autre.
</div>
</div>
</div>

---

# Les événements&nbsp;: donner une fonction

<div class="grid grid-cols-2 gap-8 pt-2">
<div>

```tsx
// ✅ une fonction, appelée au clic
<button onClick={() => setCount(count + 1)}>

// ❌ appelée tout de suite, à chaque rendu
<button onClick={setCount(count + 1)}>
```

```tsx
// ✅ setTask est déjà une fonction :
//    on la donne, sans l’appeler
<TaskFilter value={task} onChange={setTask} />
```

</div>
<div class="text-sm">

`onClick` attend **une fonction**, que React appellera au clic.

Avec `onClick={setCount(count + 1)}`, `setCount` s’exécute pendant le rendu. Ce qui déclenche un rendu, qui l’exécute à nouveau&nbsp;: React s’arrête sur *Too many re-renders*.

<div class="pt-4 op-75">
Même règle pour <code>onChange</code>, <code>onSubmit</code>, et pour <code>.then(…)</code>&nbsp;: on donne une fonction, on ne l’appelle pas.
</div>
</div>
</div>

---

# Remonter l’état

<div class="grid grid-cols-5 gap-6 pt-2">
<div class="col-span-3">

```tsx
const App = () => {
  const [task, setTask] = useState<Task | undefined>();
  const visible = task
    ? MOCK_MODELS.filter((m) => m.task === task)
    : MOCK_MODELS;

  return (
    <>
      <TaskFilter value={task} onChange={setTask} />
      <ModelList models={visible} />
    </>
  );
};
```

<div class="pt-1 text-xs op-75">
<code>useState&lt;Task | undefined&gt;()</code>&nbsp;: entre chevrons, le type de l’état. Une tâche, ou rien au départ.
</div>

</div>
<div class="col-span-2 text-sm">

Le filtre et la liste ont besoin **du même état**. Il vit donc dans leur parent commun, `App`.

```text
App           état : task
├─ TaskFilter   ↓ value={task}
│               ↑ onChange(task)
└─ ModelList    ↓ models={visible}
```

<div class="op-75">
L’état <b>descend</b> par les props. Les choix <b>remontent</b> par une fonction. <code>TaskFilter</code> annonce le choix, <code>App</code> décide.
</div>
</div>
</div>

---
layout: section
---

# 2. `fetch`, `useEffect` et CORS

---

# F12&nbsp;: les outils du navigateur

<div class="grid grid-cols-3 gap-4 pt-4 text-sm">
<div class="p-4 border border-gray-500 border-opacity-30 rounded">

**La Console**

Les erreurs JavaScript, en rouge, avec le fichier et la ligne. Et vos `console.log`.

<div class="pt-2 op-75">L’erreur CORS de l’étape 6 n’apparaît qu’ici.</div>

</div>
<div class="p-4 border border-gray-500 border-opacity-30 rounded">

**Le Réseau**, *Network*

Chaque requête&nbsp;: l’URL, le code HTTP, la réponse.

<div class="pt-2 op-75">Pour voir combien de fois votre page appelle l’API.</div>

</div>
<div class="p-4 border border-gray-500 border-opacity-30 rounded">

**React DevTools**, une extension

L’arbre de vos composants, avec leurs props et leur état, en direct. «&nbsp;React Developer Tools&nbsp;», sur le Chrome Web Store ou Firefox Add-ons.

<div class="pt-2 op-75">Pour vérifier ce que <code>App</code> a vraiment dans son état.</div>

</div>
</div>

<div class="pt-6 text-sm op-75">
Ouvrez-les avant de lancer le TP&nbsp;: F12, ou clic droit sur la page, puis «&nbsp;Inspecter&nbsp;».
</div>

---

# `fetch`, ce qu’il faut savoir

<div class="grid grid-cols-5 gap-6 pt-2">
<div class="col-span-3">

```ts
// Un exemple sur une autre route de l’API
async function fetchOrganisations() {
  const res = await fetch(`${API_URL}/organisations`);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return (await res.json()) as Organisation[];
}
```

<div class="pt-2 text-xs op-75">
<code>await</code> attend la promesse&nbsp;: c’est un <code>.then</code> écrit autrement. Une fonction <code>async</code> renvoie toujours une promesse.
<br/><code>API_URL</code> est fourni dans <code>api.ts</code>&nbsp;: <code>import.meta.env.VITE_API_URL</code>, lu dans <code>.env</code>. Seules les variables qui commencent par <code>VITE_</code> arrivent jusqu’au navigateur.
</div>

<div class="pt-3 text-sm">
À l’étape 5, vous écrivez la même pour les modèles&nbsp;: <code>fetchModels(task?)</code>. Reste à savoir <b>où l’appeler</b>.
</div>

</div>
<div class="col-span-2 text-sm">

<div class="p-4 bg-blue-500 bg-opacity-10 rounded">

**`fetch` ne lève pas d’erreur sur un 404 ou un 500.** Seulement si le réseau échoue. Le code HTTP, c’est à vous de le lire&nbsp;: `res.ok`.

</div>

<div class="pt-4">

**`as Organisation[]`** est une promesse faite au compilateur, pas une vérification. Si l’API renvoie autre chose, TypeScript ne le saura jamais.

</div>
</div>
</div>

---

# Le piège&nbsp;: `fetch` dans le composant

<div class="grid grid-cols-5 gap-6 pt-2">
<div class="col-span-3">

```tsx
const App = () => {
  const [models, setModels] = useState<Model[]>([]);

  // ❌ exécuté à chaque rendu
  fetchModels().then((data) => setModels(data));

  return <ModelList models={models} />;
};
```

</div>
<div class="col-span-2 text-sm">

<v-clicks>

1. Le rendu lance `fetchModels`.
2. La réponse arrive&nbsp;: `setModels`.
3. Nouvel état, donc **nouveau rendu**.
4. Qui relance `fetchModels`. Retour en 1.

</v-clicks>

<v-click>

<div class="pt-4 op-75">
Dans l’onglet Réseau&nbsp;: des milliers de requêtes, et un ventilateur qui décolle.
</div>

</v-click>

</div>
</div>

---

# `useEffect`&nbsp;: après le rendu, quand il faut

<div class="grid grid-cols-5 gap-6 pt-2">
<div class="col-span-3">

```tsx
import { useEffect } from 'react';

useEffect(() => {
  fetchModels(task).then((data) => setModels(data));
}, [task]);
```

<div class="flex items-center gap-2 pt-6 text-xs">
<div class="px-2 py-1 border border-gray-500 border-opacity-40 rounded">rendu</div>
<span>→</span>
<div class="px-2 py-1 border border-gray-500 border-opacity-40 rounded">écran à jour</div>
<span>→</span>
<div class="px-2 py-1 border border-blue-500 border-opacity-60 rounded">effet&nbsp;: fetch</div>
<span>→</span>
<div class="px-2 py-1 border border-gray-500 border-opacity-40 rounded">setModels</div>
<span>→</span>
<div class="px-2 py-1 border border-gray-500 border-opacity-40 rounded">rendu</div>
</div>

<div class="pt-2 text-xs op-75">
Au second rendu, <code>task</code> n’a pas changé&nbsp;: l’effet ne repart pas. La boucle est cassée.
</div>

</div>
<div class="col-span-2 text-sm">

Le code d’un effet s’exécute **après** le rendu, pas pendant.

**Le tableau de dépendances** dit quand le relancer&nbsp;:

| | L’effet s’exécute |
|---|---|
| `[]` | une fois, au montage |
| `[task]` | au montage, puis quand `task` change |
| pas de tableau | après **chaque** rendu&nbsp;: la boucle revient |

</div>
</div>

---

# `useEffect`&nbsp;: trois choses à savoir

<div class="grid grid-cols-7 gap-4 pt-2 text-sm">
<div class="col-span-3">

**1. L’effet n’est pas `async`**

<div class="text-xs op-75 pb-1">Une fonction <code>async</code> renvoie une promesse. React attend rien, ou une fonction de nettoyage.</div>

```tsx
// ❌ refusé
useEffect(async () => { … });

// ✅ une promesse, et .then
useEffect(() => {
  fetchModels(task)
    .then((d) => setModels(d));
}, [task]);

// ✅ ou await, dans une fonction
useEffect(() => {
  const load = async () =>
    setModels(await fetchModels(task));
  load();
}, [task]);
```

</div>
<div class="col-span-2">

**2. Le nettoyage**

```tsx
useEffect(() => {
  // …
  return () => {
    // avant le prochain effet,
    // ou quand le composant
    // disparaît
  };
}, [task]);
```

</div>
<div class="col-span-2">

**3. Deux fois, en développement**

`StrictMode`, dans `main.tsx`, lance chaque effet **deux fois** en développement, exprès&nbsp;: pour montrer tôt les effets qui oublient de nettoyer.

<div class="pt-2 op-75">
Deux <code>GET /models</code> dans l’onglet Réseau au chargement&nbsp;: c’est normal.
</div>

</div>
</div>

---

# Les trois états d’un appel réseau

<div class="grid grid-cols-5 gap-6 pt-2">
<div class="col-span-3">

```tsx
type Status = 'loading' | 'error' | 'ready';

const [models, setModels] = useState<Model[]>([]);
const [status, setStatus] = useState<Status>('loading');
const [error, setError] = useState('');
```

```tsx
return (
  <main>
    {status === 'loading' && <p role="status">Chargement…</p>}
    {status === 'error' && <p role="alert">{error}</p>}
    {status === 'ready' && <ModelList models={models} />}
  </main>
);
```

<div class="text-xs">

| Dans l’effet | On appelle |
|---|---|
| au début | `setStatus('loading')` |
| dans le `.then` | `setModels(data)`, puis `setStatus('ready')` |
| dans le `.catch` | `setError(…)`, puis `setStatus('error')` |

</div>

</div>
<div class="col-span-2 text-sm">

Un appel réseau n’a pas un résultat, il en a **trois**. Chacun a son rendu.

Un seul état, `status`, plutôt que trois booléens&nbsp;: impossible d’être à la fois «&nbsp;en chargement&nbsp;» et «&nbsp;en erreur&nbsp;».

<div class="pt-4">
<code>.catch</code>, le pendant du <code>.then</code>&nbsp;: la fonction appelée quand la promesse échoue. Le réseau coupé, ou l’erreur levée sur <code>!res.ok</code>.
</div>

<div class="pt-4 op-75">
Les rôles <code>status</code> et <code>alert</code> servent aux lecteurs d’écran. Et aux tests, qui les cherchent.
</div>
</div>
</div>

---

# CORS&nbsp;: le navigateur refuse de lire la réponse

<div class="text-xs pt-1">

```text
Access to fetch at 'http://localhost:3000/models' from origin 'http://localhost:5173'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
on the requested resource.
```

</div>

<div class="flex items-center justify-center gap-3 pt-3 text-xs">
<div class="p-2 border border-gray-500 border-opacity-40 rounded text-center">Votre page<br/><code>localhost:5173</code></div>
<div class="text-center">GET /models →<br/><span class="op-60">← 200, et les modèles</span></div>
<div class="p-2 border border-gray-500 border-opacity-40 rounded text-center">L’API<br/><code>localhost:3000</code></div>
<div class="text-center op-75">→</div>
<div class="p-2 border border-red-500 border-opacity-50 rounded text-center">Le navigateur&nbsp;: origine différente,<br/>pas d’autorisation, réponse gardée</div>
</div>

<div class="grid grid-cols-2 gap-6 pt-4 text-sm">
<div>

**Une origine**, c’est le protocole (`http`, `https`), l’hôte **et le port**. `localhost:5173` et `localhost:3000` sont deux origines différentes.

</div>
<div>

Pour qu’une page lise la réponse d’une autre origine, le serveur doit l’autoriser, dans un en-tête de sa réponse.

<div class="pt-2 op-75">
curl, Bruno et <code>/docs</code> ne sont pas des pages web&nbsp;: le CORS ne les concerne pas. D’où «&nbsp;ça marche dans Bruno&nbsp;».
</div>
</div>
</div>

---

# La vraie correction, et les pansements

<div class="grid grid-cols-2 gap-6 pt-2">
<div>

<div class="p-4 border border-green-500 border-opacity-50 rounded">

**Côté serveur, une origine explicite**

```ts
// api/src/main.ts
app.enableCors({
  origin: process.env.WEB_ORIGIN
    ?? 'http://localhost:5173',
});
```

`WEB_ORIGIN` vient de `.env`&nbsp;: `localhost:5173` aujourd’hui, l’URL de production demain.

<div class="pt-2 text-sm op-75">
Le <code>??</code> n’est pas décoratif&nbsp;: sans lui, une variable oubliée donne <code>undefined</code>, et <code>cors</code> autorise alors tout le monde, sans rien dire.
</div>

</div>

<div class="pt-3 text-xs op-75">
C’était le constat «&nbsp;grave, aujourd’hui&nbsp;» de l’audit de la séance 6.
</div>
</div>
<div class="text-sm">

<div class="p-4 border border-red-500 border-opacity-40 rounded">

**À refuser**

- `origin: '*'`&nbsp;: n’importe quel site du monde pourrait lire votre API.
- Une extension «&nbsp;Allow CORS&nbsp;»&nbsp;: ça marche chez vous, et nulle part ailleurs.
- Désactiver la sécurité du navigateur&nbsp;: même chose, en pire.

</div>
</div>
</div>

---

# L’essentiel, sur une slide

<div class="grid grid-cols-4 gap-3 pt-2 text-sm">
<div class="p-3 border border-gray-500 border-opacity-30 rounded">

**Le JSX**

- `className`, pas `class`
- `{expression}` entre accolades
- un seul élément racine
- `&&` et `? :` pour afficher ou non
- `map` et une `key` pour les listes

</div>
<div class="p-3 border border-gray-500 border-opacity-30 rounded">

**Les composants**

- une fonction, une majuscule
- les props, un seul objet, déstructuré
- l’état vit dans le parent commun
- il descend par les props, les choix remontent

</div>
<div class="p-3 border border-gray-500 border-opacity-30 rounded">

**Les hooks**

- `useState`&nbsp;: `set…` redessine
- la nouvelle valeur arrive au rendu suivant
- en haut du composant, jamais dans un `if`

</div>
<div class="p-3 border border-gray-500 border-opacity-30 rounded">

**Le réseau**

- `fetch`&nbsp;: lire `res.ok`
- `useEffect`, et ses dépendances
- trois états&nbsp;: chargement, erreur, données
- le CORS se règle côté serveur

</div>
</div>

<div class="pt-4 text-sm op-75">
Gardez cette slide ouverte pendant le TP&nbsp;: les slides sont sur <b>gaetanmaisse.github.io/ismin-web-2026-tps</b>
</div>

---
layout: section
---

# 3. Le TP

<div class="op-75 pt-2"><code>tp07/README.md</code>, étapes 1 à 9</div>

---

# Démarrer, trois terminaux

<div class="grid grid-cols-3 gap-4 pt-2 text-sm">
<div>

**1 · L’API**

```sh
git pull --no-edit upstream main
cd tp07/api
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run start:dev
```

</div>
<div>

**2 · Le front**

```sh
cd tp07/web
cp .env.example .env
npm install
npm run dev
```

</div>
<div>

**3 · Les tests**

```sh
cd tp07/web
npm run test:watch
```

</div>
</div>

<div class="pt-4 text-sm op-75">
<code>localhost:5173</code>&nbsp;: la maquette. <code>localhost:3000/docs</code>&nbsp;: le contrat de l’API. Les tests sont presque tous rouges au départ, c’est normal.
</div>

---

# La maquette, puis l’arbre de composants

<div class="grid grid-cols-2 gap-8 pt-4">
<div class="text-sm">

La maquette fournie est **un seul gros `App.tsx`**, en JSX brut, avec trois cartes écrites en dur.

Votre première tâche&nbsp;: la découper.

<div class="pt-4 op-75">
Une règle simple&nbsp;: un morceau qui se répète, ou qui a un rôle qu’on sait nommer, devient un composant.
</div>
</div>
<div>

```text
App                  ← l’état : la tâche choisie
├── TaskFilter       ← value, onChange
└── ModelList        ← models
    └── ModelCard    ← model, un par élément
```

</div>
</div>

---

# Le TP, en neuf étapes

<div class="grid grid-cols-2 gap-8 pt-2 text-sm">
<div>

**Partie 1&nbsp;: l’interface**, sur des données en dur

1. Lancer l’API et le front&nbsp;: `/docs` d’un côté, la maquette sur `localhost:5173` de l’autre
2. `ModelCard`&nbsp;: extraire une carte de la maquette, props `{ model: Model }`
3. `ModelList`&nbsp;: une `<ul>`, un `ModelCard` par modèle, une `key`, et «&nbsp;Aucun modèle pour ce filtre.&nbsp;» si la liste est vide
4. `TaskFilter` et `useState` dans `App`&nbsp;: `value` et `onChange`, filtrer `MOCK_MODELS`

</div>
<div>

**Partie 2&nbsp;: le réseau**

5. `fetchModels(task?)` dans `src/api.ts`&nbsp;: `VITE_API_URL`, `?task=` si un filtre, une erreur si `!res.ok`
6. Dans `App`, `useEffect` et `fetchModels` à la place de `MOCK_MODELS`&nbsp;: l’erreur CORS apparaît dans la console
7. Côté API, `app.enableCors` avec l’origine lue dans `WEB_ORIGIN`
8. Les trois états&nbsp;: `role="status"`, `role="alert"`, les données. Arrêtez l’API pour voir l’erreur
9. Le filtre côté serveur&nbsp;: l’effet dépend de `task`

</div>
</div>

<div class="pt-4 text-sm op-75">
Fini&nbsp;? <b>Étapes 10 à 12&nbsp;: la même chose avec TanStack Query</b>, dans le README. Puis les bonus. 🖐 Bloqué&nbsp;? Levez la main.
</div>

---
layout: section
---

# 4. La correction

<div class="op-75 pt-2">Les étapes 6 à 9, et ce qui a coincé</div>

---

# L’effet final

<div class="grid grid-cols-5 gap-6 pt-2">
<div class="col-span-3">

```tsx
useEffect(() => {
  let ignore = false;        // la réponse est-elle périmée ?
  setStatus('loading');
  fetchModels(task)
    .then((data) => {
      if (ignore) return;
      setModels(data);
      setStatus('ready');
    })
    .catch((err: unknown) => {
      if (ignore) return;
      setError(err instanceof Error ? err.message : String(err));
      setStatus('error');
    });
  return () => { ignore = true; };  // le nettoyage
}, [task]);
```

</div>
<div class="col-span-2 text-sm">

**Le nettoyage** s’exécute avant le prochain effet.

Vous cliquez sur «&nbsp;Traduction&nbsp;» puis tout de suite sur «&nbsp;Génération de texte&nbsp;»&nbsp;: la première réponse peut arriver **après** la seconde. Sans `ignore`, elle écrase le bon résultat.

<div class="pt-4 op-75">
Avec <code>AbortController</code>, on va plus loin&nbsp;: la requête périmée est annulée, pas seulement ignorée.
</div>

<div class="pt-3 op-75">
<code>err: unknown</code>&nbsp;: rien ne garantit qu’on a reçu une <code>Error</code>. On vérifie avec <code>instanceof</code> avant de lire <code>message</code>.
</div>
</div>
</div>

---

# Les erreurs les plus vues

<div class="grid grid-cols-3 gap-4 pt-2 text-sm">
<div class="p-3 border border-gray-500 border-opacity-30 rounded">

**La boucle infinie**

`fetch` dans le corps du composant, un `useEffect` sans tableau de dépendances, ou `onClick={f()}` au lieu de `onClick={() => f()}`.

</div>
<div class="p-3 border border-gray-500 border-opacity-30 rounded">

**La `key` oubliée**, ou l’index à sa place

Un avertissement rouge dans la console, et des éléments mélangés quand la liste change.

</div>
<div class="p-3 border border-gray-500 border-opacity-30 rounded">

**`res.ok` oublié**

Un 500 de l’API passe pour une réussite, et `models.map` plante sur un objet d’erreur.

</div>
<div class="p-3 border border-gray-500 border-opacity-30 rounded">

**`origin: '*'`**

Ça marche, et ça marche pour tout le monde. Une origine explicite, lue dans `.env`, avec une valeur de repli.

</div>
<div class="p-3 border border-gray-500 border-opacity-30 rounded">

**`.env` modifié, rien ne change**

Vite et l’API lisent `.env` au démarrage. Relancez `npm run dev`, ou `npm run start:dev`.

</div>
<div class="p-3 border border-gray-500 border-opacity-30 rounded">

**`console.log` juste après `set…`**

Il affiche l’ancienne valeur&nbsp;: la nouvelle arrive au rendu suivant. Regardez plutôt les React DevTools.

</div>
</div>

---
layout: section
---

# 5. TanStack Query

<div class="op-75 pt-2">Pour aller plus loin&nbsp;: les étapes 10 à 12, si on a le temps. Et pour le projet</div>

---

# Ce que vous avez écrit à la main

<div class="text-sm pt-2">

| Le problème | À la main, avec `useEffect` | Avec TanStack Query |
|---|---|---|
| Les trois états | trois `useState`, ou un `status` | `isPending`, `isError`, `data` |
| La réponse périmée | le drapeau `ignore`, le nettoyage | géré |
| Deux appels en développement | tolérés | un seul, les appels identiques sont fusionnés |
| Revenir sur un filtre déjà vu | une nouvelle requête, un nouveau chargement | affiché tout de suite depuis le cache, puis rafraîchi |
| Une erreur passagère | affichée | relancée automatiquement |

</div>

<div class="pt-4 text-sm op-75">
TanStack Query est la bibliothèque de requêtes la plus utilisée avec React. Elle fait ce que vous venez de coder, et un peu plus. Vous l’avez codé d’abord pour savoir ce qu’elle fait à votre place.
</div>

---

# `useQuery` à la place de l’effet

<div class="grid grid-cols-2 gap-6 pt-2">
<div>

**Une fois&nbsp;: le client**, dans `main.tsx`

```tsx
import { QueryClient, QueryClientProvider }
  from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

<div class="pt-2 text-sm op-75">
Le client garde le cache de toute l’application. <code>retry: 1</code>&nbsp;: par défaut, une requête qui échoue est retentée trois fois, et l’erreur met plusieurs secondes à s’afficher.
</div>

</div>
<div>

**Dans `App`&nbsp;: la requête**

```tsx
import { useQuery } from '@tanstack/react-query';

const { data, error, isPending, isError } =
  useQuery({
    queryKey: ['models', task],
    queryFn: () => fetchModels(task),
  });
```

<div class="pt-2 text-sm">

- `queryFn`&nbsp;: la même `fetchModels` que dans le TP.
- `queryKey`&nbsp;: le rôle du tableau de dépendances. Une nouvelle tâche, une nouvelle requête, et une case de plus dans le cache.

</div>
</div>
</div>

---

# Les trois états, avec `useQuery`

<div class="grid grid-cols-5 gap-6 pt-2">
<div class="col-span-3">

```tsx
return (
  <main>
    {isPending && <p role="status">Chargement…</p>}
    {isError && <p role="alert">{error.message}</p>}
    {data && <ModelList models={data} />}
  </main>
);
```

</div>
<div class="col-span-2 text-sm">

- `isPending`, `isError` et `data` remplacent `status`, `error` et `models`.
- **`data` vaut `undefined`** tant que la réponse n’est pas arrivée. `<ModelList models={data} />` seul ne compile pas&nbsp;: `{data && …}`.
- `error` est une `Error`&nbsp;: `error.message` se lit directement.

<div class="pt-4 op-75">
<code>fetchModels</code> ne change pas&nbsp;: c’est toujours elle qui lève l’erreur sur <code>!res.ok</code>.
</div>
</div>
</div>

---

# Les étapes 10 à 12

<div class="op-75 pt-2">Avant de commencer, un commit de la version <code>useEffect</code>&nbsp;: c’est elle que vous devez savoir expliquer.</div>

<div class="pt-6 pl-4 text-sm">

10. Dans `main.tsx`, un `QueryClient` et le `QueryClientProvider` autour de `<App />`&nbsp;: rien ne change à l’écran
11. Dans `App`, `useQuery` à la place du `useEffect` et des trois états&nbsp;: les tests restent verts, un seul `GET` au chargement
12. Les devtools de TanStack Query&nbsp;: voir le cache se remplir, une entrée par clé

</div>

<div class="pt-6 text-sm op-75">
Dans le projet, les deux sont acceptés&nbsp;: le <code>fetch</code> à la main, ou TanStack Query si vous savez expliquer ce qu’il fait à votre place.
</div>

---
layout: center
---

# Demain

## Séance 8&nbsp;: le routage

<div class="pt-6 op-75">
Votre catalogue n’a qu’une page.<br/>
Demain, chaque modèle aura la sienne, avec son adresse.
</div>

<div class="pt-10 text-sm op-60">
Slides&nbsp;: gaetanmaisse.github.io/ismin-web-2026-tps
</div>
