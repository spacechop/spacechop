declare module 'js-yaml' {
  interface JsYaml {
    safeLoad: (data: Buffer | string) => any;
  }
  const y: JsYaml;
  export = y;
}
