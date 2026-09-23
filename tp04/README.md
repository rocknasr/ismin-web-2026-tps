# TP4 : l'authentification avec JWT et guards

*Développement Web, ISMIN 3A, séance 4.*

## 🎯 Objectif

Votre API sait qui lui parle. Lire reste public, écrire demande un token, supprimer demande le rôle admin, et chaque model garde le nom de qui l'a créé.

D'abord, ce projet est votre playground : les huit cartes s'y préparent. Ensuite, c'est le TP.

## 🚀 Démarrer

```sh
git pull --no-edit upstream main
cd tp04
cp .env.example .env       # DATABASE_URL et JWT_SECRET
npm install
npm run db:migrate         # la base, puis le client Prisma
npm run db:seed            # 17 models
npm run test:watch         # dans un second terminal
```

`src/models/` contient le corrigé du TP3, celui de votre service et de votre controller. Comparez avec le vôtre si vous voulez, puis gardez celui-ci : les étapes s'appuient dessus.

C'est tout, vous pouvez coder !

## 🗺 Ce qui est fourni

```
src/
├── users.ts                      deux comptes : alice, admin ; bob, user. Mot de passe : secret
├── auth/
│   ├── auth.module.ts            JwtModule, le secret vient de .env        (carte 2)
│   ├── auth.controller.ts        POST /auth/login, GET /auth/whoami        (cartes 2, 4)
│   ├── auth.guard.ts             lit le Bearer, vérifie, remplit request.user   (carte 5)
│   ├── password.ts               hash et vérification avec scrypt         (carte 1)
│   └── dto/login.dto.ts
├── playground/
│   └── playground.controller.ts  votre bac à sable, monté sur /playground
└── models/                       l'API du TP3, corrigée              ← étapes 2, 3, 4
playground/                       vos scripts : npx tsx playground/nom.ts
test/
├── models.e2e-spec.ts            le sujet, ne pas modifier
└── auth.e2e-spec.ts              quatre tests à écrire              ← étape 5
```

Une règle : `src/auth/` se lit, ne se modifie pas. Ce que vous ajoutez va dans `src/models/`, dans `src/playground/`, ou dans de nouveaux fichiers.

## 📝 Les étapes

### Étape 1 : lire la fondation

**À faire.** Avec Bruno ou curl : `POST /auth/login` avec alice et secret, puis `GET /auth/whoami` avec le token, puis sans.

```sh
curl -s -X POST localhost:3000/auth/login -H 'content-type: application/json' -d '{"username":"alice","password":"secret"}'
curl -s localhost:3000/auth/whoami -H 'Authorization: Bearer <le token>'
```

**C'est bon quand.** 200 avec le token, 401 sans. Vous savez dire dans quel fichier chacun des deux cas se décide.

### Étape 2 : protéger les écritures

**À faire.** `POST /models` et `DELETE /models/:id` exigent un token. Le guard existe, carte 5 : posez-le.

**C'est bon quand.** Les tests « writing requires a token » sont verts, et « reading stays public » le reste.

**Piège.** Un guard posé sur la classe protège toutes les routes, lecture comprise.

### Étape 3 : signer ses models

**À faire.** Chaque model garde le username de qui l'a créé, dans un champ `createdBy`, renvoyé par l'API.

- Le controller lit l'utilisateur avec un decorator `@CurrentUser()` que vous écrivez, carte 6.
- Le service reçoit le username et l'enregistre. Il faut une colonne : schema, migration, `prisma generate`.
- Le client ne choisit pas `createdBy`. Regardez ce que le DTO et la validation font déjà d'un champ inconnu.

**C'est bon quand.** Les tests « the author is recorded » sont verts.

**Piège.** Le type `Model` de `src/models/model.ts` doit connaître `createdBy`, sinon rien ne compile.

### Étape 4 : réserver la suppression aux admins

**À faire.** `DELETE /models/:id` répond 403 à bob et 204 à alice. Un decorator `@Roles('admin')` et un `RolesGuard` qui le lit, carte 7.

**C'est bon quand.** Les tests « deleting is for admins » sont verts.

**Pièges.**

- L'ordre des guards compte : celui des rôles a besoin de `request.user`.
- 403 n'est pas 401. Sans token, c'est toujours 401.

### Étape 5 : tester le login

**À faire.** Dans `test/auth.e2e-spec.ts`, remplacez les quatre `it.todo` par de vrais tests, carte 8.

**C'est bon quand.** Quatre tests verts, dont celui à 401 sans token. Sans lui, le test à 200 ne prouve rien.

## 🛰 Pour aller plus loin

- **Les utilisateurs en base** : une table `User`, une route `POST /auth/register` qui hash avec `hashPassword`, et `src/users.ts` disparaît.
- **Un token qui expire vite** : `expiresIn: '10s'`, et observez ce que devient votre API.
- **Le mot de passe est faible** : refusez-le à l'inscription. Cherchez ce qu'OWASP recommande, ce n'est pas ce que vous croyez.

## 🤖 IA

Demandez à votre assistant d'expliquer la différence entre authentification et autorisation avec vos propres routes comme exemple. Puis vérifiez sur une route : un token valide de bob sur `DELETE`, qu'obtient-il, et pourquoi ce code et pas l'autre ?

> ⚠️ **Règle d'or** : tout code que vous ne savez pas expliquer, je le supprime.

## 🔧 Dépannage

| Message | Remède |
|---|---|
| `JWT_SECRET is not set` ou `DATABASE_URL is not set` | `cp .env.example .env` |
| 401 sur tout, même avec un token frais | Le secret a changé depuis la signature : refaites un login |
| `Property 'createdBy' does not exist` | Colonne ajoutée mais client pas régénéré : `npx prisma generate`, et le type `Model` |
| `Nest can't resolve dependencies of the RolesGuard` | `Reflector` vient de `@nestjs/core`, pas de `@nestjs/common` |
| Tout est cassé | `npm run db:reset` : **efface la base** et rejoue les migrations |

## ✅ Pour finir

```sh
git add . && git commit -m "feat(tp04): protect the models API with JWT" && git push
```
