/**
 * rawHeaders = the headers as sent on the report
 * normalizedHeaders = the corresponding headers in your main dataset
 * rawHeaders and normalizedHeaders must line up 1:1 in their respective arrays
 *
 * rawHeaders[0] = ['badly formated report header'];
 * normalizedHeaders[0] = ['nicely_formated_dataset_header'];
 *
 *
 */
class NormalizationConfig {
  constructor(rawHeaders = [], normalizedHeaders = []) {
    this.rawHeaders = rawHeaders;
    this.headerMap = new Map(
      rawHeaders.map((val, i) => [val, normalizedHeaders[i]])
    );
  }
}
export { NormalizationConfig };

// TODO
// make variable names more generic
/**
 * Upon second inpsection, this has a log going on!
 * is it all necessary? I'm not in a state to tell TBH
 *
 * I think I'm using a hashmap type thing here... am I?
 * my thinking is that using the iterator over only the indices
 * that I want is faster than having to go through every single
 * column to check if the header is one that I want
 * thus reducing (in a best case) the total number of iterations
 * that need to happen.
 *
 * I can't be the only one who has to compile various CSVs into
 * a single spreadsheet based dataset, right?
 * Surely not the only one who has limited control over what the
 * formatting of those CSVs is like also, right?
 *
 *
 * USECASE:
 * You receive multiple CSV reports that need to be normalized before
 * being dumped into a dataset. Since this is for Google Sheets automation,
 * you might be pulling multiple reports in via email.
 *
 * The reports do not have matching header names. One may contain
 * 'customer name' vs. 'name of customer', for example
 *
 * Using the config with this function,
 * you can rename the headers as sent in the report to match the
 * header that exists in your main dataset. Additionally, you can
 * also remove any extraneous columns that you do not need
 *
 * Finally, if the data requires any report specific cleanup,
 * you can pass in a callback funtion written to clean the data
 * as needed.
 *
 *
 * @param {*} report
 * @param {*} config
 * @param {*} cleanDataCallback
 * @returns 2DArray
 *
 *
 * takes in a 2D array, a config object, and optionally a callback function
 * returns a 2D array with only the columns specified in the config
 *
 * optional callback function exists in the event that you need to
 * apply any additional data cleanup to the returned 2D array
 *
 *
 */
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
