/**
 * {Array[][]} data
 */

// different implementation if !headers ?
class Array2D {
  constructor(data) {
    this.dataRange = this.data;
    this.headers = this.data.slice(0, 1);
    this.bodyData = this.data.slice(1);
    this.rowLen = this.data.length;
    this.columnLen = this.data[0].length;
  }

  // does this go in constructor?
  // use this to keep track of the longest row deets
  longestRow = { idx: 0, len: 0 };

  getCell(x, y) {
    return this.data[x][y];
  }

  getRows(start, end) {
    return this.data.slice(start, end);
  }

  getColumns(column) {}

  //   quadratic formula here
  getDistance({ x1, y1, x2, y2 }) {}

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

module.exports = Array2D;
