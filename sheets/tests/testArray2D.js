import Array2D from "../models/Array2D.js";

// Array2D[0][0] === "0A"
const testData = [
  ["0A", "0B", "0C", "0D", "0E"],
  ["1A", "1B", "1C", "1D", "1E"],
  ["2A", "2B", "2C", "2D", "2E"],
  ["3A", "3B", "3C", "3D", "3E"],
  ["4A", "4B", "4C", "4D", "4E"],
  ["5A", "5B", "5C", "5D", "5E"],
];

const array2D = new Array2D(testData);
// console.log(array2D.rowLen);

const row1 = array2D.getRow(6);

console.log(row1);
