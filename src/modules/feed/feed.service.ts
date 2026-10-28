import { feedFixture } from "./feed.fixtures";
import { normalizeFeed } from "./feed.normalize";
import type { NormalizedFeedData } from "./feed.types";

export async function getFeed(): Promise<NormalizedFeedData> {
  return normalizeFeed(feedFixture);
}
