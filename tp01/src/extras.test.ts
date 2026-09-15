import { beforeEach, describe, expect, it } from "vitest";
import { Model } from "./model.js";
import { ModelZoo, huggingFaceUrl } from "./model-zoo.js";
import { Catalogue } from "./catalogue.js";

const mistral: Model = {
  id: "mistral-7b-instruct-v0-3",
  name: "Mistral-7B-Instruct-v0.3",
  org: "mistralai",
  task: "text-generation",
  parameters: 7.2,
  downloads: 1_420_000,
  license: "apache-2.0",
};

const devstral: Model = {
  id: "devstral-small",
  name: "Devstral-Small",
  org: "mistralai",
  task: "text-generation",
  parameters: 24,
  downloads: 310_000,
};

const whisper: Model = {
  id: "whisper-large-v3",
  name: "whisper-large-v3",
  org: "openai",
  task: "speech-to-text",
  parameters: 1.55,
  downloads: 4_100_000,
  license: "apache-2.0",
};

describe("ModelZoo extras", () => {
  let zoo: ModelZoo;

  beforeEach(() => {
    zoo = new ModelZoo();
  });

  describe("getTotalDownloads", () => {
    it("returns 0 for an empty catalogue", () => {
      expect(zoo.getTotalDownloads()).toBe(0);
    });

    it("sums the downloads of every model", () => {
      zoo.addModel(mistral);
      zoo.addModel(devstral);
      zoo.addModel(whisper);

      expect(zoo.getTotalDownloads()).toBe(1_420_000 + 310_000 + 4_100_000);
    });
  });

  describe("getModelNamesByTask", () => {
    beforeEach(() => {
      zoo.addModel(mistral);
      zoo.addModel(devstral);
      zoo.addModel(whisper);
    });

    it("returns the names of the models able to perform a task", () => {
      expect(zoo.getModelNamesByTask("text-generation")).toEqual(
        expect.arrayContaining([mistral.name, devstral.name]),
      );
      expect(zoo.getModelNamesByTask("speech-to-text")).toEqual([whisper.name]);
    });

    it("returns an empty array when no model performs the task", () => {
      expect(zoo.getModelNamesByTask("translation")).toEqual([]);
    });
  });

  describe("getOrganisations", () => {
    it("returns an empty array for an empty catalogue", () => {
      expect(zoo.getOrganisations()).toEqual([]);
    });

    it("returns every organisation once", () => {
      zoo.addModel(mistral);
      zoo.addModel(devstral);
      zoo.addModel(whisper);

      expect(zoo.getOrganisations()).toEqual(
        expect.arrayContaining(["mistralai", "openai"]),
      );
      expect(zoo.getOrganisations()).toHaveLength(2);
    });
  });

  describe("tamper-proof catalogue", () => {
    it("is not corrupted by mutating a returned model", () => {
      zoo.addModel(mistral);
      const [model] = zoo.getAllModels();

      expect(() => {
        (model as { downloads: number }).downloads = 0;
      }).toThrow();
      expect(zoo.getModel(mistral.id)?.downloads).toBe(mistral.downloads);
    });

    it("is not corrupted by mutating the model passed to addModel", () => {
      const original = { ...mistral };
      zoo.addModel(original);
      original.downloads = 0;

      expect(zoo.getModel(mistral.id)?.downloads).toBe(mistral.downloads);
    });
  });

  describe("groupByTask", () => {
    it("arranges the models by task", () => {
      zoo.addModel(mistral);
      zoo.addModel(devstral);
      zoo.addModel(whisper);

      const groups = zoo.groupByTask();

      expect(groups["text-generation"]).toEqual(
        expect.arrayContaining([mistral, devstral]),
      );
      expect(groups["speech-to-text"]).toEqual([whisper]);
      expect(groups["translation"]).toBeUndefined();
    });
  });

  describe("huggingFaceUrl", () => {
    it("builds the model's page address on Hugging Face", () => {
      expect(huggingFaceUrl(mistral)).toBe(
        "https://huggingface.co/mistralai/mistral-7b-instruct-v0-3",
      );
    });
  });

  describe("Catalogue<T>", () => {
    interface Book {
      id: string;
      title: string;
    }

    it("is reusable for any entity with a string id", () => {
      const books = new Catalogue<Book>();
      books.addItem({ id: "1984", title: "Nineteen Eighty-Four" });

      expect(books.getTotalNumberOfItems()).toBe(1);
      expect(books.getItem("1984")?.title).toBe("Nineteen Eighty-Four");
      expect(books.getItem("unknown")).toBeUndefined();
    });
  });
});
