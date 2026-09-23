# TP5 : l'audit d'une vraie API

*Développement Web, ISMIN 3A, séance 6.*

## 🎯 La mission

Cette application est complète : c'est le corrigé du TP4, avec l'authentification, les organisations, les models, et tous ses tests verts. Elle fonctionne. Elle n'est pas prête pour la production.

Votre travail, en binômes et sur un thème que vous choisissez : la lire comme un développeur qui la reçoit en héritage, trouver ce qu'il faudrait améliorer avant de la mettre devant de vrais utilisateurs, et le présenter à la salle en quatre slides.

L'assistant IA est permis, et même conseillé, pour lire et pour lister. Ce qu'il ne fera pas à votre place : choisir, classer, et répondre aux questions.

## 🚀 Démarrer

```sh
git pull --no-edit upstream main
cd tp05
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm test                   # 25 tests verts, c'est le point de départ
npm run start:dev
```

Deux comptes : `alice`, admin, et `bob`, user, mot de passe `secret`. `POST /auth/login` pour un token.

## 🧭 Les six thèmes

| Thème | Par où commencer |
|---|---|
| Sécurité de l'authentification | `src/auth/`, `src/users.ts`, `.env.example` |
| Intégrité des données | `src/models/models.service.ts`, `prisma/schema.prisma` |
| Contrat d'API et documentation | `src/models/models.controller.ts`, ce README, la réponse de chaque route, la collection Bruno du TP2 |
| Validation des entrées | `src/**/dto/`, `src/models/model.ts` |
| Configuration et démarrage | `.env.example`, `src/main.ts`, les scripts de `package.json`, `prisma/seed.ts`, le `Dockerfile` |
| Qualité et tests | `test/`, `vitest.config.ts`, ce que les tests ne couvrent pas |

Un thème est une lentille, pas une frontière : si vous trouvez quelque chose en dehors, notez-le.

Plusieurs binômes peuvent prendre le même thème, pas le même sujet : dites-moi ce que vous creusez, je veille aux doublons.

## 📝 Le livrable : quatre slides, pas une de plus

1. **Le problème.** Une faille ou un manque, selon votre thème. Votre thème en titre, le fichier et la ligne. Un scénario concret : « si quelqu'un fait X, alors Y », que ce quelqu'un soit un attaquant, un utilisateur ou le prochain développeur. Un seul problème, le plus important. Le code, vous le montrez dans VS Code, police agrandie.
2. **La solution.** Le code, ou son principe. L'effort, petit, moyen ou grand. Et le test qui prouverait que c'est réglé.
3. **Le backlog.** Un tableau classé de trois à cinq lignes : le problème, son impact, l'effort.
4. **L'IA, écartée.** Ce que l'assistant a proposé et que vous n'avez pas retenu, et pourquoi. Citez sa proposition.

Les slides se présentent depuis votre portable, entre cinq et dix minutes. Le PDF m'est envoyé par mail avant 15 h.

## ⏱ La séance

| Heure | Quoi |
|---|---|
| 13:15 | Lancement, les six thèmes, les binômes choisissent |
| 13:25 | Recherche, 1 h 20 |
| 14:45 | Pause |
| 15:00 | Présentations, cinq à dix minutes par binôme |
| Ensuite | Synthèse, l'audit complet au tableau |

## 🤖 IA

Faites-lui lire un fichier et demandez-lui ce qui cloche. Puis vérifiez chaque point dans le code : un assistant trouve des problèmes qui n'existent pas, et en rate qui existent. Ce que vous présentez, vous devez le défendre.

> ⚠️ **Règle d'or** : tout ce que vous ne savez pas expliquer, on le retire de vos slides devant tout le monde.
