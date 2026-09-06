import {describe, expect, it} from "vitest";
import {compileMarkdown} from "./index";

describe("markdown authoring", () => {
  it("compiles the documented architecture syntax into Storyboard IR", () => {
    const storyboard = compileMarkdown(`# How RAG Works\n\n:::architecture\nUser -> Embedding -> VectorDB -> LLM\n:::`);
    expect(storyboard.metadata.title).toBe("How RAG Works");
    expect(storyboard.scenes[0].type).toBe("architecture");
    expect(storyboard.scenes[0].elements.map((element) => element.props?.label)).toEqual(["User", "Embedding", "VectorDB", "LLM"]);
    expect(storyboard.scenes[0].timeline).toHaveLength(7);
  });

  it("supports scene attributes and produces schema-valid layout data", () => {
    const storyboard = compileMarkdown(`# Product\n\n:::product-demo id=demo layout=grid columns=2 intent=show-feature theme=product-dark\nBrowser -> Screenshot\n:::`);
    expect(storyboard.scenes[0].id).toBe("demo");
    expect(storyboard.scenes[0].layout).toEqual({type: "grid", columns: 2});
    expect(storyboard.metadata.theme).toBe("product-dark");
  });

  it("rejects malformed or unsupported blocks with useful errors", () => {
    expect(() => compileMarkdown("# Missing block")).toThrow("at least one");
    expect(() => compileMarkdown("# Broken\n\n:::architecture\nA -> B")).toThrow("missing a closing");
    expect(() => compileMarkdown("# Broken\n\n:::architecture layout=unknown\nA -> B\n:::")).toThrow("Unsupported Markdown layout");
  });
});
