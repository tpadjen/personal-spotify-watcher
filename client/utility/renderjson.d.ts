declare function renderjson (json: Record<string, unknown>): HTMLElement
declare namespace renderjson {
  export function set_show_to_level(level: number): void
  export function set_sort_objects(pred: boolean): void
  export function set_icons(closed: string, open: string): void
  export function set_collapse_msg(cb: () => string): void
}

declare module 'renderjson' {
  export = renderjson
}
