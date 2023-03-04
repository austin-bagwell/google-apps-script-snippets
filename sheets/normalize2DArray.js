// import { NormalizationConfig } from "./models/normalizationConfig.js";

// TODO
// make variable names more generic

function normalize2DArray(report = [[]], config = {}, cleanDataCallback) {
  const { rawHeaders, headerMap } = config;

  const getRawIndexes = () => {
    const reportHeaders = report[0];
    const indexes = [];

    for (const [i, header] of reportHeaders.entries()) {
      if (rawHeaders.includes(header)) {
        indexes.push(i);
      }
    }
    return indexes;
  };

  const rawIndexes = getRawIndexes();

  const normalizedReport = [];
  for (const row of report) {
    const normalizedRow = [];
    const iterator = rawIndexes;
    for (const i of iterator) {
      const val = row[i];
      normalizedRow.push(val);
    }
    normalizedReport.push(normalizedRow);
  }

  const reportHeaders = normalizedReport[0];
  const normalizedHeaders = reportHeaders.map(
    (header) => (header = headerMap.get(header))
  );

  normalizedReport.splice(0, 1, normalizedHeaders);
  if (cleanDataCallback) {
    return cleanDataCallback(normalizedReport);
  }
  return normalizedReport;
}

export { normalize2DArray };
