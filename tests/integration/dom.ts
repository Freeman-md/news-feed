import { JSDOM } from "jsdom";

// Install before importing React DOM so its event system detects a DOM environment.
// No scripts or subresources are loaded; this is not a layout/image/browser test.
export const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  HTMLImageElement: dom.window.HTMLImageElement,
  Event: dom.window.Event,
  IS_REACT_ACT_ENVIRONMENT: true,
});
