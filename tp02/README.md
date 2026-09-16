# TP2: A REST API with NestJS

*Web Development, ISMIN 3A, session 2.*

## 🎯 Goal

Expose your TP1 `ModelZoo` as a REST API:

| Method | Route | Answers |
|---|---|---|
| `GET` | `/models` | `200`, every model. `?org=` and `?task=` filter, alone or together |
| `GET` | `/models/:id` | `200`, or `404` if unknown |
| `POST` | `/models` | `201`, or `400` with the list of errors if the body is invalid |
| `DELETE` | `/models/:id` | `204` and no body, or `404` if unknown |

The spec is `test/models.e2e-spec.ts`. Do not modify it: make it pass.

## 🚀 Getting started

```sh
git remote add upstream https://github.com/gaetanmaisse/ismin-web-2026-tps.git   # once
git config --global pull.rebase false                                             # once: a pull merges
git pull --no-edit upstream main                                                  # every session

cd tp02 && npm install
npm run start:dev      # the server, http://localhost:3000
npm run test:watch     # the tests, in a second terminal
```

`src/models/model.ts` and `model-zoo.ts` are the TP1 solution. If your eleven tests pass, use yours instead:

```sh
cp ../tp01/src/model.ts ../tp01/src/model-zoo.ts src/models/
```

`bruno/` is a [Bruno](https://www.usebruno.com) collection, one request per step: **Open Collection**, environment `local`.

That's it! You can code!

## 🗺 The project

```
src/
├── main.ts                       entry point                 ← step 5
├── app.module.ts                 root module
└── models/
    ├── model.ts                  your TP1 types              ← step 5
    ├── model-zoo.ts              your TP1 catalogue          ← step 4
    ├── models.module.ts          the module, empty           ← step 1
    ├── models.service.ts         the logic, empty            ← steps 2, 3, 4, 6
    ├── models.controller.ts      the routes                  ← steps 2, 3, 4
    └── dto/create-model.dto.ts   validation, to write        ← step 5
test/
└── models.e2e-spec.ts            the spec, do not modify
```

One rule: the controller translates HTTP, the service decides. No business logic in the controller.

## 📝 Steps

1. **Read, then wire.** Open the seven files. `models.module.ts` declares nothing: fix that. ✅ The suite starts.
2. **`GET /models`.** Give the service your `ModelZoo` as a private field, then write `clear`, `create`, `findAll`, and the route. ✅ The first tests turn green.
3. **`GET /models/:id`.** Unknown id → `404`.
4. **`POST` and `DELETE`.** `201` on create. `204` and no body on delete, `404` if unknown. Your `ModelZoo` cannot remove anything yet: make it grow.
5. **Validate.** `{"name": 42}` must get a `400` with the list of errors. Write `CreateModelDto` in `src/models/dto/`, decorated with `class-validator` (see the course appendix), and make `POST` go through it. Types are erased at runtime: `task` needs its four values as a **runtime list**, typed so that a typo is a compile error. `Task` itself is only a type: import it with `import type`.
6. **Filter.** `?org=` and `?task=`, alone or together. Filtering lives in the service, not in the controller.

## 🛰 Extra

- **A. Load `data/models.json` on startup**, with `readFile` from `node:fs/promises` and `async`/`await`. Look up `OnModuleInit`.
- **B. Real data.** Replace the file with `https://huggingface.co/api/models?limit=50&sort=downloads`. Field names differ, and the file stays your fallback when the API is down.

## 🤖 AI

Ask your assistant to generate the controller from the tests, then review it line by line: logic in the controller? Right status codes? A real `404`, or an empty `200`?

> ⚠️ **Golden rule**: any code you cannot explain, I delete.

## ✅ Wrapping up

```sh
git add . && git commit -m "feat(tp02): expose ModelZoo as a REST API" && git push
```
