// convert all rows to JSON objs using headers as keys
// get a list of unique PO #s
// for length of uniquePO #'s:
// filter JSON rows by PO#
// let tempObj = Object.assign(JSON row)
// return new Order({ tempObj })

const poNus = getUniquePoNums(arr);
const rows = convertToJson(arr);

function makeOrderFromJsonRows(rows, poNum) {
  const onePoNum = rows.filter((row) => row.poNum === poNum);

  const temp = {};
  for (let row of onePoNum) {
    Object.assign(temp, row);
  }

  return new makeOrderFromJsonRows({ temp });
}
