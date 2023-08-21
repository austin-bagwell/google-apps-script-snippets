/**
 * {String[][]} arr - source array from which to retrieve 1 column
 * {number} colIdx - index of desired column
 * @returns {Array[]}
 */
function getColumn(arr, colIdx) {
  const column = [];
  arr.forEach((row) => column.push(row[colIdx]));
  // will exclude header cell by default
  return column;
}

// TAR + date generated + dc #
// ex TAR07022023-0551
function generateExternalId(poNumber) {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, "0");
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const year = today.getFullYear().toString();

  const dcNumber = poNumber.split("-")[1];

  const externalId = `TAR${month}${day}${year}-${dcNumber}`;
  return externalId;
}
