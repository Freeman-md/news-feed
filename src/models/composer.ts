import type { PostBody } from "./post";

export type ComposerDraft = {
  body: PostBody;
  mediaIds: string[];
  uploadState: "idle" | "uploading" | "failed";
  submitState: "idle" | "submitting" | "submitted" | "failed";
};
