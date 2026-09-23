---
theme: seriph
favicon: ./favicon-mse.png
layout: center
title: "Séance 4 : L’authentification : JWT & guards"
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

<CourseCover :sprint="1" :seance="3" />

<CourseCover :sprint="2" :seance="4" />

# L’authentification

## JWT & guards

<div class="pt-4 op-75">Séance 4&nbsp;: Sprint 2, Sécurité & UI</div>

<div class="pt-10 text-sm op-75">
📱 <b>gaetanmaisse.github.io/ismin-web-2026-tps</b>
</div>

---

# Votre API est grande ouverte

<v-clicks>

- Depuis mercredi, n’importe qui peut faire `DELETE /models/mistral-7b-instruct-v0-3`. Pas de compte, pas de mot de passe, pas de trace.
- Un serveur doit poser deux questions à chaque request&nbsp;: **qui êtes-vous&nbsp;?** C’est l’authentification. **Avez-vous le droit&nbsp;?** C’est l’autorisation.
- Ce soir&nbsp;: lire reste public, écrire demande un token, supprimer demande le rôle admin, et chaque model garde le nom de qui l’a créé.

</v-clicks>

---

# Le chemin d’une request protégée

```mermaid {scale: 0.85}
%%{init: {'theme':'base','themeVariables':{'fontFamily':'Roboto, ui-sans-serif, sans-serif','fontSize':'14px','lineColor':'#94a3b8','primaryTextColor':'#0f172a'}}}%%
flowchart LR
  C["🖥️ Client"] -->|"① mot de passe"| L["POST /auth/login"]
  L -->|"② token signé"| C
  C -->|"④ Authorization: Bearer"| G["⑤ AuthGuard<br/>③ vérifie le token"]
  G -->|"⑥ request.user"| R["⑦ RolesGuard"]
  R --> H["la route"]
  classDef box fill:#eff6ff,stroke:#2563eb,stroke-width:2px,color:#1e3a5f
  class C,L,G,R,H box
```

<v-click>

<div class="pt-4 text-lg">
Huit cartes, huit étapes de ce chemin. La huitième, les tests, prouve que chaque porte se ferme.
</div>

</v-click>

---

# Aujourd’hui, le cours, c’est vous

<div class="pt-4 text-lg">

<v-clicks>

- **Une carte par binôme**&nbsp;: un concept, et une question à laquelle votre exemple répond
- **Trente minutes de préparation**, à deux, avec la documentation
- **Cinq minutes** au vidéoprojecteur, minuteur visible
- **Deux rôles**&nbsp;: l’un explique, l’autre tape. Vous choisissez qui fait quoi
- **Le tableau** se remplit d’un mot par carte&nbsp;: après les huit passages, c’est votre cours
- **Le TP** qui suit utilise les huit cartes, dans le même ordre

</v-clicks>

</div>

---

# Les règles

<v-clicks>

1. **Préparation à deux, 30 minutes**, avec les sources de la carte. L’assistant IA est permis pour préparer, pas pour présenter.
2. **Deux rôles**, à décider entre vous&nbsp;: l’un explique, l’autre tape l’exemple en commentant chaque ligne.
3. **On annonce sa source**, on tape, on ne colle pas. À 5:00, c’est fini, terminé ou pas.
4. **Votre carte dépend d’une autre&nbsp;?** Le playground contient déjà la brique. Le binôme d’amont peut être consulté, cinq minutes au plus.

</v-clicks>

---

# Les huit cartes

<div class="text-sm">

| N° | Carte | La question à laquelle l’exemple répond |
|---|---|---|
| 1 | Le mot de passe | Que voit un attaquant qui vole la base, et pourquoi ça ne lui sert à rien&nbsp;? |
| 2 | Le JWT | Comment le serveur se souvient de qui vous êtes sans rien stocker&nbsp;? |
| 3 | Vérifier un JWT | Que se passe-t-il à la seconde où le token expire, et si le secret change&nbsp;? |
| 4 | Faire voyager le token | Où voyage le token, et pourquoi jamais dans l’URL&nbsp;? |
| 5 | Le guard | Comment une route sait-elle qui l’appelle, avant même d’être exécutée&nbsp;? |
| 6 | `@CurrentUser()` et 401 ou 403 | Comment éviter `req.user` partout, et quelle différence entre 401 et 403&nbsp;? |
| 7 | Les rôles | Comment un guard lit-il ce que la route déclare sur elle-même&nbsp;? |
| 8 | Tester une route protégée | Comment un test obtient-il un token, et prouve-t-il qu’une route est fermée&nbsp;? |

</div>

<div class="pt-3 text-sm op-75">
L’ordre de passage est celui des cartes&nbsp;: du mot de passe au test. Chaque carte a sa slide, juste après&nbsp;: ouvrez le deck sur votre machine.
</div>

---

# Carte 1&nbsp;· Le mot de passe

<div class="text-base op-75 italic -mt-2 mb-3">Que voit un attaquant qui vole la base, et pourquoi ça ne lui sert à rien&nbsp;?</div>

<div class="text-base">

1. Un script dans `playground/` qui hash le mot de passe `secret` avec `crypto.scrypt` et un salt aléatoire, et stocke `salt:hash`.
2. Le même mot de passe hashé deux fois donne deux résultats différents&nbsp;: montrez-le.
3. Une fonction `verify(password, stored)` qui recalcule le hash et compare avec `timingSafeEqual`, testée avec le bon et un mauvais mot de passe.

</div>

<div class="grid grid-cols-3 gap-5 pt-5 mt-4 border-t border-gray-200 text-xs">
<div>

**Déjà dans le playground**

- Rien à lire d’abord&nbsp;: la carte est autonome.

</div>
<div>

**Sources**, cliquables

- [OWASP, Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [Node, crypto.scrypt et crypto.timingSafeEqual](https://nodejs.org/api/crypto.html)

</div>
<div>

**Indice**

Pourquoi comparer « à temps constant »&nbsp;? Cherchez « timing attack »&nbsp;: c’est la question que la salle vous posera.

</div>
</div>
---

# Carte 2&nbsp;· Le JWT

<div class="text-base op-75 italic -mt-2 mb-3">Comment le serveur se souvient de qui vous êtes sans rien stocker&nbsp;?</div>

<div class="text-base">

<div class="op-80">

Signer, c’est produire une empreinte du payload avec le secret. Sans le secret, on peut lire le token, pas le fabriquer.

</div>

1. En deux phrases&nbsp;: session côté serveur ou token côté client, et ce que ça change quand on a deux serveurs.
2. Avec `JwtService.sign({ sub: 'alice', role: 'admin' })`, un token signé avec un secret lu dans `process.env.JWT_SECRET`. Jamais dans le code.
3. Collez le token sur jwt.io&nbsp;: les trois parties, ce qui est lisible par tous, et ce que la signature garantit.

</div>

<div class="grid grid-cols-3 gap-5 pt-5 mt-4 border-t border-gray-200 text-xs">
<div>

**Déjà dans le playground**

- `JwtModule` est configuré dans `src/auth/auth.module.ts` avec `JWT_SECRET` lu dans `.env`&nbsp;: injectez `JwtService`, ou instanciez `new JwtService({ secret })` dans un script.

</div>
<div>

**Sources**, cliquables

- [jwt.io, Introduction](https://jwt.io/introduction)
- [NestJS, Authentication, section JWT](https://docs.nestjs.com/security/authentication)
- [MDN, Authentification HTTP](https://developer.mozilla.org/fr/docs/Web/HTTP/Authentication)

</div>
<div>

**Indice**

Le payload n’est pas chiffré, il est encodé. Un mot de passe dans un JWT est un mot de passe public.

</div>
</div>
---

# Carte 3&nbsp;· Vérifier un JWT <span class="text-base font-normal op-60">dépend des cartes 2</span>

<div class="text-base op-75 italic -mt-2 mb-3">Que se passe-t-il à la seconde où le token expire, et si le secret change&nbsp;?</div>

<div class="text-base">

<div class="op-80">

Un token = payload signé, voir carte 2. Vérifier, c’est recalculer la signature et comparer, puis regarder la date `exp`.

</div>

1. `JwtService.verify(token)` sur un token valide&nbsp;: le payload revient.
2. Un token signé avec `expiresIn: '2s'`, vérifié après trois secondes&nbsp;: montrez l’erreur, son nom, son message.
3. Le même token vérifié avec un autre secret&nbsp;: montrez cette erreur-là aussi. Ce sont les deux pannes que tout le monde rencontrera en TP.

</div>

<div class="grid grid-cols-3 gap-5 pt-5 mt-4 border-t border-gray-200 text-xs">
<div>

**Déjà dans le playground**

- `JwtService` configuré, voir carte 2. Signez vous-même le token de la démo, avec `expiresIn: '2s'`.

</div>
<div>

**Sources**, cliquables

- [@nestjs/jwt, README](https://github.com/nestjs/jwt)
- [jsonwebtoken, les erreurs TokenExpiredError et JsonWebTokenError](https://github.com/auth0/node-jsonwebtoken#errors--codes)

</div>
<div>

**Indice**

Un token expiré n’est pas « faux », il est périmé&nbsp;: deux erreurs différentes, deux messages différents.

</div>
</div>
---

# Carte 4&nbsp;· Faire voyager le token <span class="text-base font-normal op-60">dépend des cartes 2</span>

<div class="text-base op-75 italic -mt-2 mb-3">Où voyage le token entre le client et le serveur, et pourquoi jamais dans l’URL&nbsp;?</div>

<div class="text-base">

<div class="op-80">

Le token est une chaîne opaque pour le client&nbsp;: il la stocke et la renvoie telle quelle à chaque request.

</div>

1. Une request avec Bruno ou curl portant `Authorization: Bearer <token>`.
2. Une route Nest qui lit ce header avec `@Headers('authorization')` et renvoie la partie après `Bearer`.
3. Deux raisons pour lesquelles `?token=…` dans l’URL est une mauvaise idée&nbsp;: pensez aux logs et à l’historique du navigateur.

</div>

<div class="grid grid-cols-3 gap-5 pt-5 mt-4 border-t border-gray-200 text-xs">
<div>

**Déjà dans le playground**

- `POST /auth/login` avec `{ "username": "alice", "password": "secret" }` renvoie `{ access_token }`. Prenez ce token, ne le fabriquez pas.

</div>
<div>

**Sources**, cliquables

- [MDN, l'en-tête Authorization](https://developer.mozilla.org/fr/docs/Web/HTTP/Headers/Authorization)
- [NestJS, Controllers, section Request object](https://docs.nestjs.com/controllers#request-object)

</div>
<div>

**Indice**

Aucun&nbsp;: la carte se suffit.

</div>
</div>
---

# Carte 5&nbsp;· Le guard <span class="text-base font-normal op-60">dépend des cartes 2, 4</span>

<div class="text-base op-75 italic -mt-2 mb-3">Comment une route sait-elle qui l’appelle, avant même d’être exécutée&nbsp;?</div>

<div class="text-base">

<div class="op-80">

Le token arrive dans le header `Authorization: Bearer …`, voir carte 4. Le guard le vérifie avec `JwtService.verify` et range le payload dans `request.user`.

</div>

1. Une classe `@Injectable()` qui implémente `CanActivate`, posée sur une route avec `@UseGuards()`.
2. Le guard lit le header, vérifie le token, et attache le payload à `request.user`. Sans token&nbsp;: `false`, et montrez ce que le client reçoit.
3. Un `console.log` dans le guard et un dans la route&nbsp;: lequel s’affiche en premier, et pourquoi c’est le point.

</div>

<div class="grid grid-cols-3 gap-5 pt-5 mt-4 border-t border-gray-200 text-xs">
<div>

**Déjà dans le playground**

- `src/auth/auth.guard.ts` existe et fonctionne&nbsp;: lisez-le, expliquez-le ligne à ligne, ajoutez vos `console.log`. Ne le réécrivez pas.
- `GET /auth/whoami` est protégée par ce guard&nbsp;: c’est votre route de démonstration.

</div>
<div>

**Sources**, cliquables

- [NestJS, Guards](https://docs.nestjs.com/guards)
- [NestJS, Authentication, section Implementing the authentication guard](https://docs.nestjs.com/security/authentication#implementing-the-authentication-guard)

</div>
<div>

**Indice**

Carte dense&nbsp;: préparez d’abord le guard qui renvoie `false`, puis seulement le token. Le guard s’exécute avant les pipes et le handler, jamais après.

</div>
</div>
---

# Carte 6&nbsp;· @CurrentUser() et 401 ou 403 <span class="text-base font-normal op-60">dépend des cartes 5</span>

<div class="text-base op-75 italic -mt-2 mb-3">Comment éviter `req.user` dans chaque route, et quelle différence entre 401 et 403&nbsp;?</div>

<div class="text-base">

<div class="op-80">

`request.user` n’existe que si un guard l’a rempli avant le handler. Votre decorator ne fait que le lire.

</div>

1. Un decorator maison avec `createParamDecorator` qui renvoie `request.user`, utilisé dans une route `GET /me`.
2. Deux routes&nbsp;: l’une lève `UnauthorizedException`, l’autre `ForbiddenException`. Montrez les deux réponses côte à côte.
3. En une phrase chacune&nbsp;: 401, « je ne sais pas qui vous êtes »&nbsp;; 403, « je sais, et c’est non ».

</div>

<div class="grid grid-cols-3 gap-5 pt-5 mt-4 border-t border-gray-200 text-xs">
<div>

**Déjà dans le playground**

- Le guard de la carte 5 remplit `request.user` avec le payload du token&nbsp;: `{ sub, role }`. Posez-le sur votre route avec `@UseGuards(AuthGuard)`.

</div>
<div>

**Sources**, cliquables

- [NestJS, Custom decorators](https://docs.nestjs.com/custom-decorators)
- [MDN, 401 Unauthorized](https://developer.mozilla.org/fr/docs/Web/HTTP/Status/401)
- [MDN, 403 Forbidden](https://developer.mozilla.org/fr/docs/Web/HTTP/Status/403)

</div>
<div>

**Indice**

Aucun&nbsp;: la carte se suffit.

</div>
</div>
---

# Carte 7&nbsp;· Les rôles <span class="text-base font-normal op-60">dépend des cartes 5, 6</span>

<div class="text-base op-75 italic -mt-2 mb-3">Comment un guard lit-il ce que la route déclare sur elle-même&nbsp;?</div>

<div class="text-base">

<div class="op-80">

Un guard s’exécute avant le handler et peut lire la request, voir carte 5. `SetMetadata` attache une donnée à la route, `Reflector` la relit depuis un guard.

</div>

1. Un decorator `@Roles('admin')` construit avec `SetMetadata`, posé sur `DELETE /models/:id`.
2. Un `RolesGuard` qui lit cette métadonnée avec `Reflector` et la compare au rôle de `request.user`.
3. Un utilisateur sans le rôle&nbsp;: 403, pas 401. Dites pourquoi.

</div>

<div class="grid grid-cols-3 gap-5 pt-5 mt-4 border-t border-gray-200 text-xs">
<div>

**Déjà dans le playground**

- `request.user.role` vaut `'admin'` pour alice et `'user'` pour bob, les deux comptes du playground. Le guard d’authentification existe, vous ajoutez celui des rôles, après lui.

</div>
<div>

**Sources**, cliquables

- [NestJS, Guards, section Role-based authentication](https://docs.nestjs.com/guards#role-based-authentication)
- [NestJS, Execution context, section Reflection and metadata](https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata)

</div>
<div>

**Indice**

Carte dense&nbsp;: la métadonnée est posée à la déclaration de la route, et lue à chaque request. Deux moments différents, c’est tout le mécanisme.

</div>
</div>
---

# Carte 8&nbsp;· Tester une route protégée <span class="text-base font-normal op-60">dépend des cartes 4, 5</span>

<div class="text-base op-75 italic -mt-2 mb-3">Comment un test e2e obtient-il un token, et comment prouve-t-il qu’une route est fermée&nbsp;?</div>

<div class="text-base">

<div class="op-80">

Une route protégée répond 401 sans token, voir carte 5, et 200 avec un token obtenu par login, voir carte 4. Votre test prouve les deux.

</div>

1. Dans `beforeAll`, un `POST /auth/login` avec supertest, et le token gardé dans une variable.
2. Un test qui appelle une route protégée avec `.set('Authorization', 'Bearer ' + token)` et attend `200`.
3. Le même appel sans header, qui attend `401`. Sans ce second test, le premier ne prouve rien.

</div>

<div class="grid grid-cols-3 gap-5 pt-5 mt-4 border-t border-gray-200 text-xs">
<div>

**Déjà dans le playground**

- `POST /auth/login` et `GET /auth/whoami`, protégée, existent. Le fichier `test/auth.e2e-spec.ts` contient déjà le `beforeAll` qui démarre l’application.

</div>
<div>

**Sources**, cliquables

- [NestJS, Testing, section End-to-end testing](https://docs.nestjs.com/fundamentals/testing#end-to-end-testing)
- [supertest, README](https://github.com/ladjs/supertest)

</div>
<div>

**Indice**

Carte dense&nbsp;: le token obtenu dans `beforeAll` doit servir à tous les tests du fichier, donc une variable déclarée au niveau du `describe`. Et le test à 401 est celui que tout le monde oublie.

</div>
</div>

---

# Préparation&nbsp;: 30 minutes

<div class="grid grid-cols-2 gap-6 pt-2">
<div>

```sh
git pull --no-edit upstream main
cd tp04
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run start:dev
```

<div class="pt-2 text-sm op-75">
Scripts hors Nest&nbsp;: <code>npx tsx playground/nom.ts</code>.<br/>
Routes de démonstration&nbsp;: <code>src/playground/</code>, jamais <code>src/auth/</code>.
</div>

</div>
<div>

### Déjà dans le playground

<div class="text-sm">

- Deux comptes, `alice` admin et `bob` user, mot de passe `secret`
- `POST /auth/login` qui renvoie un token
- Un guard qui vérifie le token et remplit `request.user`
- `GET /auth/whoami`, protégée par ce guard
- Le squelette du test `test/auth.e2e-spec.ts`

</div>

<div class="pt-4 text-sm op-75">
1 et 2 sont autonomes. 3 et 4 s’appuient sur 2. 5 sur 2 et 4. 6 et 7 sur 5. 8 sur 4 et 5.
</div>

</div>
</div>

---
layout: center
---

# Présentations

<div class="pt-6 text-sm op-60">Cinq minutes sur chaque carte, au minuteur.</div>

---
layout: section
---

# TP

<div class="op-75 pt-2"><code>tp04/README.md</code>, étapes 1 à 5</div>

<div class="pt-8 text-sm inline-block text-left">

1. Lire la fondation&nbsp;: login, puis `whoami` avec et sans token
2. Protéger les écritures avec le guard, carte 5
3. Signer ses models&nbsp;: `@CurrentUser()`, une colonne `createdBy`, cartes 6 et 3
4. Réserver la suppression aux admins&nbsp;: `@Roles`, `RolesGuard`, carte 7
5. Écrire les quatre tests du login, carte 8

</div>

<div class="pt-8 text-sm op-75">
🖐 Bloqué&nbsp;? Levez la main. Le binôme de la carte concernée est aussi une ressource.
</div>

---
layout: center
---

# Demain

## Séance 5&nbsp;: React, composants & JSX

<div class="pt-6 op-75">
Votre API a un cadenas. Demain, elle a un visage.
</div>

<div class="pt-10 text-sm op-60">
Slides&nbsp;: gaetanmaisse.github.io/ismin-web-2026-tps
</div>
