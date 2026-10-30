"use client";

import { DEMO_USER_ID } from "@/demo/config";
import { useFeedStore } from "@/modules/feed/FeedStoreProvider";
import { Avatar } from "./Avatar";
import { FeedLoadState } from "./FeedLoadState";
import { Icon } from "./Icon";

export function ComposerForm() {
  const author = useFeedStore((state) => state.usersById[DEMO_USER_ID]);
  const text = useFeedStore((state) => state.composerDraft.body.text);
  const setDraftText = useFeedStore((state) => state.setDraftText);
  const status = useFeedStore((state) => state.loadStatus);

  if (!author) return status === "success"
    ? <p role="status">Demo author is unavailable.</p>
    : <FeedLoadState />;

  return (
    <form className="surface composer" aria-label="Create a demo post">
      <div className="composer-author">
        <Avatar name={author.name} />
        <div className="author-details">
          <p className="author-name">{author.name}</p>
          <p>Demo author</p>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="caption">Caption</label>
        <textarea id="caption" name="caption" rows={6} placeholder="What caught your eye?" aria-describedby="caption-help" value={text} onChange={(event) => setDraftText(event.target.value)} />
        <p id="caption-help" className="field-note">Make a little room for your thoughts.</p>
      </div>
      <div className="form-field">
        <p className="field-label" id="image-label">Image <span className="muted">(optional)</span></p>
        <button type="button" className="upload-placeholder" disabled aria-labelledby="image-label upload-label" aria-describedby="upload-help">
          <Icon name="photo" />
          <span id="upload-label">Add an image</span>
        </button>
        <p id="upload-help" className="field-note">Image uploads are unavailable in this demo.</p>
      </div>
      <div className="publish-area">
        <button type="submit" className="publish-button" disabled aria-describedby="publish-help">Publish</button>
        <p id="publish-help" className="field-note">Publishing is unavailable. Drafts stay during navigation; refresh may clear them.</p>
      </div>
    </form>
  );
}
