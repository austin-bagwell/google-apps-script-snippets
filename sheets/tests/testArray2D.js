import Array2D from "../models/Array2D.js";

const testData = [
  ["0A", "1B", "2C", "3D", "4E"],
  ["0A", "1B", "2C", "3D", "4E"],
  ["0A", "1B", "2C", "3D", "4E"],
  ["0A", "1B", "2C", "3D", "4E"],
  ["0A", "1B", "2C", "3D", "4E"],
  ["0A", "1B", "2C", "3D", "4E"],
];

const array2D = new Array2D(testData);
const distance1 = array2D.getDistance({ x1: 0, y1: 0, x2: 1, y2: 1 });
console.log(distance1);
// console.table(array2D.dataRange);
