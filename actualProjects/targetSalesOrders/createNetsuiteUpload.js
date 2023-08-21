// parses csv file downloaded from SPS Commerce and generates a new csv formatted for upload into Netsuite
// uses AAB | Sales Order Batch Import saved csv import

const uploadHeaders = [
  "Customer",
  "Item (SKU)",
  "QTY",
  "Location",
  "External ID",
  "Internal ID",
  "Line ID",
  "Date",
  "Fulfilment Date",
  "PO #",
  "Region",
];

function createUploadCsv() {
  const ss = SpreadsheetApp.getActive();

  const uploadSheet =
    ss.getSheetByName("Netsuite Import") ||
    ss.insertSheet().setName("Netsuite Import");
  uploadSheet.clearContents();

  const orders = extractOrderDetails();

  const rows = [];
  for (let order of orders) {
    const poNumber = order.poNumber;
    const dcNumber = poNumber.split("-")[1];
    const dcName = order.dcName;
    const customer = `${dcNumber}-${dcName}`;
    const location = order.roastery;
    const internalId = order.internalId;
    const region = "GROCERY";
    const date = "";
    const fulfillmentDate = "";
    const externalId = generateExternalId(poNumber);

    for (let item of order.items) {
      const sku = item.sku;
      const qty = item.qty;
      const lineId = item.lineId;
      const row = [
        customer,
        sku,
        qty,
        location,
        externalId,
        internalId,
        lineId,
        date,
        fulfillmentDate,
        poNumber,
        region,
      ];
      rows.push(row);
    }
  }
  rows.unshift(uploadHeaders);
  uploadSheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  uploadSheet.getRange(2, 1, rows.length, rows[0].length).sort([
    { column: 4, ascending: true },
    { column: 1, ascending: true },
  ]);
}

// read the SPS Commerce csv and get the good bits
// returns array of Order objects with details
function extractOrderDetails() {
  const ss = SpreadsheetApp.getActive();
  const csv = ss.getSheetByName("SPS csv");

  if (!csv) {
    throw Error(
      `No sheet named 'SPS csv' found. Did you import the csv file from SPS Commerce into a sheet named 'SPS csv'?`
    );
  }

  const dataRange = csv.getDataRange().getDisplayValues();

  const headers = dataRange[0];
  const data = dataRange.slice(1);

  const idxPoNums = headers.indexOf("PO Number");
  const idxQuantity = headers.indexOf("Qty Ordered");
  const idxLineNum = headers.indexOf("PO Line #");
  const idxUpc = headers.indexOf("UPC/EAN");

  const poColumn = getColumn(data, idxPoNums);
  const uniquePoNums = new Set(poColumn);

  const orderSlices = [];
  uniquePoNums.forEach((poNumber) => {
    // +1 because each poNumber slice has a 'header' row
    const start = poColumn.indexOf(poNumber) + 1;
    const end = poColumn.lastIndexOf(poNumber);
    orderSlices.push({ poNumber, start, end });
  });

  /**
   * @param {String[][]} slice - 2D array pulled from csv
   * @returns {Object<Order>} order - yes I know it isn't 'actually' a type but whatever I'll add details later
   * Order = { poNumber, roastery, dcName, items[]<Item> }
   * Item = { sku, qty, lineId }
   */
  function makeOrderFrom(slice) {
    const poNumber = slice[0][idxPoNums];
    const upc = slice[0][idxUpc];
    const { roastery, name, internalId } = getLocationDetails(poNumber);

    const order = {};
    order.poNumber = poNumber;
    order.roastery = roastery;
    order.dcName = name;
    order.internalId = internalId;
    order.items = [];

    // add item details to items array
    for (let row of slice) {
      // TODO maybe more error handling here
      const rawSku = upcNumbers.get(row[idxUpc]).concat("-CS") || "INVALID SKU";
      // SF SKUs must start with 'W'
      const sku = order.roastery === "SF" ? `W${rawSku}` : `${rawSku}`;
      // 6 bags per case duh
      const qty = row[idxQuantity] / 6;
      const lineId = row[idxLineNum];

      order.items.push({ sku, qty, lineId });
    }

    return order;
  }

  const orders = [];
  for (let slice of orderSlices) {
    const sliceData = data.slice(slice.start, slice.end + 1);
    const order = makeOrderFrom(sliceData);
    orders.push(order);
  }

  return orders;
}
