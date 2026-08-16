type ImageNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: ImageNode[];
};

function getPositiveInteger(value: string | null): number | undefined {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : undefined;
}

function getImageDimensions(src: string) {
  try {
    const url = new URL(src, "https://example.invalid");
    const queryWidth = getPositiveInteger(url.searchParams.get("w"));
    const queryHeight = getPositiveInteger(url.searchParams.get("h"));

    if (queryWidth && queryHeight) {
      return { width: queryWidth, height: queryHeight };
    }

    const pathMatch = url.pathname.match(/\/(\d+)\/(\d+)\/?$/);
    const pathWidth = getPositiveInteger(pathMatch?.[1] ?? null);
    const pathHeight = getPositiveInteger(pathMatch?.[2] ?? null);

    return pathWidth && pathHeight
      ? { width: pathWidth, height: pathHeight }
      : undefined;
  } catch {
    return undefined;
  }
}

export default function rehypeImageDimensions() {
  return (tree: ImageNode) => {
    function visit(node: ImageNode) {
      if (node.type === "element" && node.tagName === "img") {
        const properties = node.properties ?? {};
        const src = typeof properties.src === "string" ? properties.src : "";

        if (!properties.width && !properties.height && src) {
          const dimensions = getImageDimensions(src);
          if (dimensions) {
            properties.width = dimensions.width;
            properties.height = dimensions.height;
            node.properties = properties;
          }
        }
      }

      node.children?.forEach(visit);
    }

    visit(tree);
  };
}
