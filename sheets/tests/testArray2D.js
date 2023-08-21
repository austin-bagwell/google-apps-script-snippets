import Array2D from "../models/Array2D.js";

// Array2D[0][0] === "0A"
const testData = [
  ["0A HEADER", "0B HEADER", "0C HEADER", "0D HEADER", "0E HEADER"],
  ["1A", "1B", "1C", "1D", "1E"],
  ["2A", "2B", "2C", "2D", "2E"],
  ["3A", "3B", "3C", "3D", "3E"],
  ["4A", "4B", "4C", "4D", "4E"],
  ["5A", "5B", "5C", "5D", "5E"],
];

const array2D = new Array2D(testData);
const rowIdxs = [0, 2];
const colIdxs = [0, 2];
// console.log(array2D.getCell(1, 1));

console.log(array2D.getColumn(0));
console.log(array2D.getColumnsByIndex(colIdxs));
console.log(array2D.getColumnsRange(0, 5));
