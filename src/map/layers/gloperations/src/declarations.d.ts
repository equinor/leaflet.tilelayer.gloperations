// For module loading, all GLSL files expose a single default export of type string.
declare module '*.glsl' {
  const src: string;
  export default src;
}

declare module '*.fs' {
  const src: string;
  export default src;
}

declare module '*.vs' {
  const src: string;
  export default src;
}