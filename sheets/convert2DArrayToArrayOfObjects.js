/**
 *Script assumes the use of 2D arrays in Apps Script as if calling SpreadsheetApp.getDataRange().getDisplayValues();
 *
 * Converts a 2D array with headers into an array of objects where key:value pairs
 * align with column:row values in the sourceArr.
 * Optionally, targetHeaders allows you to get only selected column:row values
 *
 * Sometimes an array of objects is easier to work with than a 2D array
 *
 *
 *
 * @param {2DArray} sourceArr
 * The 2D array from which you whish to convert a clunky 2D matrix into a sleek array of JSON
 *
 *@param {Array} targetHeaders
 * The list of headers you want to be included on your new object as key:value pairs
 * Items in this list must exactly match the headers in sourceArr
 * Headers with invalid JavaScript keys will be excluded and logged as errors
 *
 * @returns {ArrayOfObjects}
 * Where key:value pairs match the existing column:row relationships in your sourceArr data
 *
 *
 *
 */

// FIXME
// make targetHeaders optional
// would it be fair to this to
// convert2DArrayToJson()?
function convert2DArrayToArrayOfObjects(sourceArr = [[]], targetHeaders) {
  const json = [];
  const headers = sourceArr.slice(0, 1).flat();
  const body = sourceArr.slice(1);

  for (let row = 0; row < body.length; row++) {
    const object = {};
    for (let col = 0; col < headers.length; col++) {
      const key = headers[col];
      const val = body[row][col];

      // TODO add try-catch
      if (targetHeaders.includes(key)) {
        object[key] = val;
      } else {
        continue;
      }
      json.push(object);
    }
  }
  return json;
}
