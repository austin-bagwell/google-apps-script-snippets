class NormalizationConfig {
  constructor(rawHeaders = [], nrmlHeaders = []) {
    this.rawHeaders = rawHeaders;
    this.headerMap = new Map(rawHeaders.map((val, i) => [val, nrmlHeaders[i]]));
  }
}
export { NormalizationConfig };
