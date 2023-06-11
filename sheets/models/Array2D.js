/**
 * {Array[][]} data
 */

// consider renaming class to Datarange to line up with range.getDatarange().getValues() in GAS
// different implementation if !headers ?
export default class Array2D {
  constructor(data) {
    this.dataRange = data;
    this.headers = this.dataRange.slice(0, 1);
    this.bodyData = this.dataRange.slice(1);
    this.rowLen = this.dataRange.length;
    this.columnLen = this.dataRange[0].length;
  }

  // does this go in constructor?
  // use this to keep track of the longest row deets

  // get longest row / set longest row ?
  // idk if getters and setters work in GAS
  //   longestRow = { idx: 0, len: 0 };

  getCell(row, col) {
    if (!row || !col) {
      throw Error("Parameters row & col are required");
    }

    if (!Number.parseInt(row) || !Number.parseInt(col)) {
      throw Error("Arguments to row & col must be a number");
    }

    return this.dataRange[row][col];
  }

  getRow(row) {
    if (!Number.parseInt(row)) {
      throw Error("Argument to row must be a number");
    }

    if (row > this.rowLen - 1) {
      throw Error("Row index out of bounds");
    }

    return this.dataRange[row];
  }

  getRows(start, end) {
    return this.data.slice(start, end);
  }

  getColumn(col) {}

  getColumns(col) {}

  //   ex you want a new 2D array with only column indexes [0,2,3]
  // returns new Array2D
  reduceToXColumns(headerIdx = []) {}

  // like slice but 2D
  // different behavior if !headers ?
  slice2D({ row1, row2, col1, col2 }) {}

  // option to only convert a specific range? or just the whole array?
  // option to select only specific headers?
  // see existing convert2DArrayToArrayOfObjects for implementation details
  convertToJson(data, range = false) {}

  // is this the formula I want? do I even know? lol
  // where Array2D[0][0] = { row:0, col:0 }
  getDistance({ row1, col1, row2, col2 }) {
    const distance = Math.sqrt(
      Math.pow(row2 - row1, 2) + Math.pow(col2 - col1, 2)
    );
    return distance;
  }

  //   use this to make sure all rows maintain the same length
  // all rows as long as the longest row
  _fillBlankCells() {}
}
