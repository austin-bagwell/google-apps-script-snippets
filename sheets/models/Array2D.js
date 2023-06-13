/**
 * Class containing utilty methods for 2D arrays with headers at index 0
 * @extends Array
 */
export default class Array2D extends Array {
  /**
   *
   * @param {Array[][]} data
   */
  constructor(data) {
    super(...data);
    this.headers = data[0];
    this.bodyData = data.slice(1);
    this.rowLength = data.length;
    this.colLength = data.length;
  }

  // use this to keep track of the longest row deets
  // get longest row / set longest row ?
  // idk if getters and setters work in GAS
  //   longestRow = { idx: 0, len: 0 };

  getCell(row, col) {
    return this[row][col];
  }

  getRow(row) {
    if (row > this.rowLen - 1) {
      throw Error("Row index out of bounds");
    }

    return this[row];
  }

  /**
   *
   * @param {number} start - start of range to extract
   * @param {number} end - exclusive end of range to extract
   * @param {boolean} includeHeaders - indclude this.headers at [0] or not
   * @returns
   */
  getRowsRange(start, end, includeHeaders = false) {
    // prevent adding headers twice if includeHeaders && starting after actual headers
    if (includeHeaders && start > 0) {
      return this.slice(start, end).unshift(this.headers);
    }
    return this.slice(start, end);
  }

  /**
   * Select only specified rows of data
   * @param {Array<number>} rowIndexes - the list of rowIndexes to retrieve
   * @param {boolean} includeHeaders - add this.headers as [0] if true
   * @returns {Array<Array<any>>}
   */
  getRowsByIndex([...rowIndexes], includeHeaders = false) {
    const rows = [];
    for (const idx of rowIndexes) {
      rows.push(this[idx]);
    }

    // prevent adding headers twice if alreaded passed in rowIndexes
    if (includeHeaders && !rowIndexes.includes(0)) {
      rows.unshift(this.headers);
    }

    return rows;
  }

  /**
   *
   * @param {number} col - index of the desired column
   * @param {boolean} includeHeader - include header or no
   * @returns {Array<any>}
   */
  getColumn(col, includeHeader = true) {
    if (col > this.columnLen - 1) {
      throw Error("Column index out of bounds");
    }

    const column = [];

    if (!includeHeader) {
      this.forEach((row) => {
        column.push(row[col]);
      });
      return column.slice(1);
    }

    this.forEach((row) => column.push(row[col]));
    return column;
  }

  /**
   * Gets a contiguous range of columns, up to and excluding end index. Includes headers by default.
   * @param {number} start - start index of range to extract
   * @param {number} end - exclusive end index of range to extract
   * @param {boolean} includeHeaders - indclude this.headers at [0] or not. Default is true
   * @returns {Array<Array<any>>} - array containing arrays
   */
  getColumnsRange(start, end, includeHeaders = true) {
    if (!includeHeaders) {
      return this.map((row) => row.slice(start, end)).slice(1);
    }
    return this.map((row) => row.slice(start, end));
  }

  // ex you want columns at indexes [0,2,5]
  getColumnsByIndex([...columnIndexes], includeHeaders = true) {
    const columns = [];

    for (const idx of columnIndexes) {
      const column = this.getColumn(idx, includeHeaders);
      columns.push(column);
    }

    return columns;
  }

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
