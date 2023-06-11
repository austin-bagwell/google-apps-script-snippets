import Array2D from "../models/Array2D";

const testData = [
  ["0A", "1B", "2C", "3D", "4E"],
  ["0A", "1B", "2C", "3D", "4E"],
  ["0A", "1B", "2C", "3D", "4E"],
  ["0A", "1B", "2C", "3D", "4E"],
  ["0A", "1B", "2C", "3D", "4E"],
  ["0A", "1B", "2C", "3D", "4E"],
];

const array2D = new Array2D(testData);

console.table(array2D.dataRange);
