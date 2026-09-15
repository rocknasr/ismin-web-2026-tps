/**
 * TP1 solution: the domain types, as you were asked to derive them
 * from the test file.
 */

/**
 * What a model is able to do.
 *
 * This is a "union" type: the value must be exactly one of these strings.
 * Neither an enum nor a free-form string. Try writing "text-gen" and see.
 */
export type Task =
  | "text-generation"
  | "translation"
  | "image-classification"
  | "speech-to-text";

/** A model in the catalogue. */
export interface Model {
  /** URL-safe slug, unique in the catalogue. E.g. "mistral-7b-instruct-v0-3" */
  id: string;
  /** Short name. E.g. "Mistral-7B-Instruct-v0.3" */
  name: string;
  /** Organisation publishing the model. E.g. "mistralai" */
  org: string;
  /** What the model can do. */
  task: Task;
  /** Number of parameters, in billions. */
  parameters: number;
  /** Downloads over the last month. */
  downloads: number;
  /**
   * License declared on the model card, when there is one.
   * Optional (`?`): one of the three fixtures does not have it.
   */
  license?: string;
}
