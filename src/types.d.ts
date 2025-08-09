declare module 'html-to-image' {
  export function toPng(node: HTMLElement, options?: unknown): Promise<string>;
}
