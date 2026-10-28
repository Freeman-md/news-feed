import { Avatar } from "./Avatar";
import { Icon } from "./Icon";

export function ComposerForm({ author }: { author: { name: string; initials: string } }) {
  return (
    <form className="surface composer" aria-label="Create a demo post">
      <div className="composer-author">
        <Avatar initials={author.initials} />
        <div className="author-details">
          <p className="author-name">{author.name}</p>
          <p>Demo author</p>
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="caption">Caption</label>
        <textarea id="caption" name="caption" rows={6} placeholder="What caught your eye?" aria-describedby="caption-help" />
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
        <p id="publish-help" className="field-note">Publishing is unavailable. Draft text isn’t saved.</p>
      </div>
    </form>
  );
}
