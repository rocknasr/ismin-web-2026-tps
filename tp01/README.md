# TP1: Introduction to TypeScript

*Web Development, ISMIN 3A, session 1.*

## 🎯 Goal

Discover TypeScript and its ecosystem by implementing **ModelZoo**, a catalogue of AI models you will keep growing for four weeks, until it runs in production.

- `Task`: what a model can do. Four values, `text-generation`, `translation`, `image-classification`, `speech-to-text`, as a union of string literals. No `enum`.
- `Model`: a model of the catalogue. The test file builds three at the top: their values give the types, the comments give the units, and the type must accept all three. `id` is a URL-safe slug, unique in the catalogue.
- `ModelZoo`: a class storing models, with this contract:

```ts
class ModelZoo {
  addModel(model: Model): void;
  getModel(id: string): Model | undefined;
  getModelsOf(org: string): Model[];
  getAllModels(): Model[];
  getTotalNumberOfModels(): number;
  getModelsByTask(task: Task): Model[];
}
```

The spec is `src/model-zoo.test.ts`, eleven tests. Read it end to end before writing a line, and do not modify it.

## 🔀 Git

Fork the course repository from GitHub, then:

```sh
git clone https://github.com/YOUR-USERNAME/ismin-web-2026-tps.git
cd ismin-web-2026-tps
git switch -c tp01-modelzoo
git push -u origin tp01-modelzoo     # works before any commit: the branch now exists on your fork
```

## 🚀 Getting started

```sh
cd tp01
npm install
npm run test:watch     # re-runs the tests on every save, keep it open
npm run typecheck      # the compiler alone, it catches what the tests do not
```

The suite refuses to start until `src/model.ts` and `src/model-zoo.ts` exist. That is the assignment.

That's it! You can code!

## 📝 Steps

1. **The types, `src/model.ts`.** `Task` and `Model`, both exported. Course rule: `interface` for the shape of an object, `type` for everything else. Typing `"text-gen"` somewhere must be a compile error. ✅ `npm run typecheck` only complains about `./model-zoo.js`. Commit: `feat(tp01): add Model and Task types`.
2. **The class, `src/model-zoo.ts`.** First decision: an array, or a `Map` keyed by `id`? Both pass, one makes `getModel` a direct lookup. Choose, you will justify it. Whatever you pick, `private readonly`. Work test by test, top to bottom. ✅ Eleven green. Commit: `feat(tp01): implement ModelZoo`.

> 💡 Imports end in `.js` even though the files are `.ts`: the import names the file that exists after compilation.

## 🛰 Extra

Test first, in a new file such as `src/extras.test.ts`. The given test file stays untouched.

**Warm-up**, each with a constraint:

- `getTotalDownloads()`: the sum of every model's downloads. A single `reduce`, no loop.
- `getModelNamesByTask(task)`: the *names* of the models able to perform a task. One chain, `filter` then `map`, no intermediate variable.
- `getOrganisations()`: every organisation present, **each one once**. No loop.

**Then**, none of these has an obvious solution:

1. **The typed URL.** `huggingFaceUrl(model)` returns the address of the model's page, with a **return type** that rejects `"https://example.com"` at compile time.
2. **The tamper-proof catalogue.** Can a caller corrupt your catalogue from the outside, without `addModel`? Find how, write the test that proves it, then make it impossible.
3. **Grouping.** `groupByTask()` returns the models arranged by task. **A single pass**, and **no `any`** in the signature.
4. **⭐ The generic catalogue.** Turn `ModelZoo` into a `Catalogue<T>` for any entity. What must you **require** of `T` for `getModel` to still work?

## 🤖 AI

Use an assistant, [Le Chat](https://chat.mistral.ai) or any other, to **understand**, not to produce. When the compiler returns an error you do not get, ask for an explanation, then check it against the [official documentation](https://www.typescriptlang.org/docs/).

> ⚠️ **Golden rule**: any code you cannot explain, I delete.

## ✅ Wrapping up

```sh
git status                 # anything left? git add, git commit
git log --oneline          # at least two commits: the types, then the class
git push
```
