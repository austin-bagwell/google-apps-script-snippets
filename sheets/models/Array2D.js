/**
 * {Array[][]} data
 */

// different implementation if !headers ?
export default class Array2D {
  constructor(data) {
    this.dataRange = data;
    this.headers = data.slice(0, 1);
    this.bodyData = data.slice(1);
    this.rowLen = data.length;
    this.columnLen = data[0].length;
  }

  // does this go in constructor?
  // use this to keep track of the longest row deets

  // get longest row / set longest row ?
  // idk if getters and setters work in GAS
  longestRow = { idx: 0, len: 0 };

  getCell(x, y) {
    return this.data[x][y];
  }

  getRows(start, end) {
    return this.data.slice(start, end);
  }

  getColumns(column) {}

  //   is this the formula I want? do I even know? lol
  getDistance({ x1, y1, x2, y2 }) {
    // sqrt (x2 - x1)^2
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    return distance;
  }

  // like slice but 2D
  // different behavior if !headers ?
  slice2D({ x1, x2, y1, y2 }) {}

  // option to only convert a specific range? or just the whole array?
  // option to select only specific headers?
  convertToJson(data, range = false) {}

  //   use this to make sure all rows maintain the same length
  // all rows as long as the longest row
  _fillBlankCells() {}
}
