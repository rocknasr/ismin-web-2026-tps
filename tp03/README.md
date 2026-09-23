# TP3 : la persistance avec Prisma et SQLite

*Développement Web, ISMIN 3A, séance 3.*

## 🎯 Objectif

Vos données survivent à un redémarrage : la `Map` en mémoire devient une vraie base de données relationnelle, **sans changer l'API**. Mêmes routes, même validation, mêmes tests qu'hier, à une exception près : créer un model dont l'id existe déjà répond 409, au lieu de le remplacer.

Si la séparation controller / service d'hier était la bonne, seul le service change. C'est le test.

## 🚀 Démarrer

```sh
git pull --no-edit upstream main
cd tp03
cp .env.example .env       # DATABASE_URL="file:./dev.db" : toute la base dans un fichier
npm install                # génère aussi le client Prisma
npm run test:watch         # les tests d'hier, dans un second terminal
```

`.env` et `*.db` sont ignorés par Git. On partage les migrations, jamais une base.

`src/models/` contient le corrigé du TP2. Comparez votre controller avec celui fourni : la seule différence aujourd'hui, c'est un `await` sur chaque route, et un cas de plus : le 409 quand l'id existe déjà. Votre `ModelZoo` prend sa retraite, plus rien ne l'importe.

C'est tout, vous pouvez coder !

## 🗺 Ce qui change depuis hier

```
prisma.config.ts           où est la base           (fourni)
prisma/
├── schema.prisma          la source de vérité      ← étapes 2 et 5
└── seed.ts                le seed                  ← étape 6
src/
├── prisma/
│   ├── prisma.service.ts  la connexion             ← étape 7
│   └── prisma.module.ts                            (fourni)
└── models/
    ├── models.service.ts  ← étapes 4 et 7
    └── models.controller.ts   async/await, rien d'autre   (fourni)
```

Rien ne compile tant que le schema n'existe pas : le service parle d'une table qui n'est pas encore là.

## 📝 Les étapes

### Étape 1 : voir le problème

**À faire.** Dans `tp02`, lancez le serveur, créez un model, redémarrez.

**C'est bon quand.** `GET /models` répond `[]`. Tout a disparu.

### Étape 2 : le schema

**À faire.** Dans `prisma/schema.prisma`, décrivez `Model` avec les champs de `src/models/model.ts`.

**Trois décisions à prendre :**

- la primary key ;
- ce que devient un type union dans une base qui n'en a pas ;
- comment se déclare un champ optionnel.

### Étape 3 : la première migration

**À faire.**

```sh
npx prisma migrate dev --name init   # la migration SQL, écrite et appliquée
npx prisma generate                  # le client TypeScript, régénéré
```

**C'est bon quand.** Trois choses existent, allez les voir :

- un fichier SQL dans `prisma/migrations/` : lisez-le ;
- la base `dev.db` : ouvrez-la avec `npm run db:studio` ;
- `prisma.model`, généré et typé : le projet compile.

### Étape 4 : le service

**À faire.** Dans `models.service.ts`, remplacez chaque `throw` par un appel Prisma.

**C'est bon quand.** Les 14 tests d'hier repassent au vert.

**Pièges.** Aucun n'est un bug de Prisma :

- `findUnique` ne renvoie pas `undefined` quand rien ne correspond. Que renvoie-t-il, et qu'attend le controller ?
- `delete` sur une row absente ne renvoie pas `false`. Lisez l'erreur.
- Un id déjà pris : regardez ce que le controller attend de vous. Le service ne connaît pas HTTP.
- Le compilateur refuse de traiter une row de la base comme un `Model`, et il a raison. Convertissez à la frontière, en un seul endroit, et faites-y passer chaque méthode.

### Étape 5 : une vraie relation

**À faire.** `org` est la même string sur chaque row. Faites-en une table :

- `Organisation` : un UUID en primary key, un `slug` unique, un `name`, un `country` optionnel ;
- un model appartient à exactement une organisation.

Migrez, régénérez le client, puis adaptez le service.

**C'est bon quand.** Les tests sont de nouveau verts, et `org` vaut toujours `"mistralai"` dans l'API. **L'API ne doit pas changer.**

**Pièges.** Deux endroits où la documentation Prisma sur les relations vaut le détour :

- filtrer par organisation ;
- créer un model dont l'organisation n'existe pas encore.

### Étape 6 : le seed

**À faire.** `npm run db:seed` charge `data/models.json`, 17 models. Le script est écrit pour le schema plat de l'étape 2 : adaptez-le.

**C'est bon quand.** Le seed passe sur le schema de l'étape 5.

**Piège.** Un model ne peut pas pointer vers une organisation qui n'existe pas encore. L'ordre compte.

### Étape 7 : traquer le N+1

**À faire.** Dans `prisma.service.ts`, activez `log: ['query']`. Appelez `GET /models` et **comptez les lignes SQL** dans le terminal.

**C'est bon quand.** Le nombre de queries ne dépend plus du nombre de models.

**Piège.** Une query par model ? Trouvez la boucle.

## 🛰 Pour aller plus loin

- **Pagination** : `GET /models?page=2&limit=10`, avec `skip` et `take`
- **Tri** : `?sort=downloads`, avec `orderBy`
- **Recherche** : `?q=mistral`, avec `contains`
- **Transaction** : créer un model et incrémenter un compteur sur son organisation, atomiquement

## 🤖 IA

Demandez à votre assistant de **générer le schema** depuis `src/models/model.ts`, puis auditez-le : les types correspondent-ils, `Float` ou `Int` ? Des champs inventés ? Un `default` que personne n'a demandé ? À l'étape 5, la relation est-elle dans le bon sens ?

> ⚠️ **Règle d'or** : tout code que vous ne savez pas expliquer, je le supprime.

## 🔧 Dépannage

| Message | Remède |
|---|---|
| `DATABASE_URL is not set` | `cp .env.example .env` |
| `Cannot find module '../generated/prisma/client.js'` | Client pas généré : `npx prisma generate` |
| `The table main.Model does not exist` | `npm run db:migrate` |
| `Property 'model' does not exist` | Schema vide, ou client pas régénéré depuis la dernière migration : `npx prisma generate` |
| Les types ne se mettent pas à jour dans l'éditeur | Redémarrez le serveur TypeScript de VS Code |
| `Prisma Studio is not supported for the "file:./dev.db" protocol` | Studio veut l'URL en `file://` : passez par `npm run db:studio` |
| Tout est cassé | `npm run db:reset` : **efface la base** et rejoue les migrations |

## ✅ Pour finir

```sh
git add . && git commit -m "feat(tp03): persist models with Prisma" && git push
```
