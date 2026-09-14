export type Task =
  | "text-generation"
  | "translation"
  | "image-classification"
  | "speech-to-text";

export interface Model {
  id: string;
  name: string;
  org: string;
  task: Task;
  parameters: number; // in billions, as on the Hugging Face model card
  downloads: number; // over the last month
  license?: string;
}
