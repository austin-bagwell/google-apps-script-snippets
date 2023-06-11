/**
 * {Array[][]} data
 */

// TODO
// should Array2D extend Array?
// https://github.com/wesbos/es6-articles/blob/master/54%20-%20Extending%20Arrays%20with%20Classes%20for%20Custom%20Collections.md
// should any method return a 2D array return a new instance of Array2D?

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

    return this.dataRange[row][col];
  }

  getRow(row) {
    if (row > this.rowLen - 1) {
      throw Error("Row index out of bounds");
    }

    return this.dataRange[row];
  }

  // might work better as an array of indexes?
  // easier to cherry pick rows as needed
  // add option to include headers at the top of the 2D row array?
  getRowsRange(start, end, includeHeaders = false) {
    return this.data.slice(start, end);
  }

  // ex you want rows at indexes [1,2,5]
  getRowsByIndex() {}

  getColumn(col, includeHeader = true) {
    if (col > this.columnLen - 1) {
      throw Error("Column index out of bounds");
    }

    if (!includeHeader) {
      return this.dataRange
        .map((row) => {
          return row[col];
        })
        .slice(1);
    }

    return this.dataRange.map((row) => {
      return row[col];
    });
  }

  getColumnsRange(start, end, includeHeaders = true) {}

  // ex you want columns at indexes [0,2,5]
  getColumnsByIndex(indexes = [], includeHeaders = true) {}

  // like slice but 2D
  // different behavior if !headers ?
  slice2D({ row1, row2, col1, col2 }) {}

  // option to only convert a specific range? or just the whole array?
  // option to select only specific headers?
  // see existing convert2DArrayToArrayOfObjects for implementation details
  convertToJson(data, range = false) {}

  // is this the formula I want? do I even know? lol
  // where Array2D[0][0] = { row:0, col:0 }
  // add handling for n number of coords, I think is possible w/ that formula?
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
