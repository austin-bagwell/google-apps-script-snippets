const datasetSheet = SpreadsheetApp.getActive().getSheetByName("Dataset");
const datasetData = datasetSheet.getDataRange().getDisplayValues();
const datasetHeaders = datasetData[0];

// targetHeaders become object keys
function convert2DArrayToJson(targetHeaders = [], arr = [[]]) {
  const objects = [];
  const headers = arr.slice(0, 1).flat();
  const body = arr.slice(1);

  for (let row = 0; row < body.length; row++) {
    const shipmentDetail = {};
    for (let col = 0; col < headers.length; col++) {
      const key = headers[col];
      const val = body[row][col];

      if (targetHeaders.includes(key)) {
        shipmentDetail[key] = val;
      } else {
        continue;
      }
    }
    objects.push(shipmentDetail);
  }
  return objects;
}

// TODO fancy filters that react to dropdown changes
// create filterConfig builder - date range, ship from, carrier?
const fakeDropdownSelections = ["Last 30 Days", "DUR", "ESTES"];
// tricky bit is setting the date range
// new Date(today) - 30 days (or whatever range specified)
// that val must be stored in the config
// EXCEPT as written, that filter will only check one exact param
// soooo date range filtering is a separate step
// sounds like a case for a switch... or a Map(['last week', (date) => filterstuff])

function filterByDateRange(data, range) {
  const today = new Date();
  // actually sourced from dropdown duh
  const dateRange = "Last 30 Days";

  const last30 = () => {
    // return today - 30 days
    // in mm/dd/yyyy form I think?
    // whatever I need to compare vs. display vals from sheet
  };
}

const datasetJson = convert2DArrayToJson(datasetHeaders, datasetData);
const fakeFilterConfig = {
  "Ship From": "SF",
  Carrier: "ESTES",
};
function filterByMultipleParams(data, params) {
  return data.filter((x) =>
    Object.entries(params).every((f) => x[f[0]] === f[1])
  );
}

// Logger.log(filterByMultipleParams(datasetJson, fakeFilterConfig).length)
const totalOtsDur = filterByMultipleParams(datasetJson, {
  "Ship From": "DUR",
  "Shipped On Time?": "yes",
}).length;

// Logger.log(totalOtsDur)

function getTotalNumDeliveredOnTime(roasteryFilter, carrierFilter) {
  const data = convert2DArrayToJson(datasetHeaders, datasetData);
  return data.filter((row) => row["Delivered On Time?"] === "yes").length;
}

// TODO
// add a ton of error handling/logging
function updateDataset() {
  function getCSVFromGmail(label) {
    const gmailThread = GmailApp.search(`label:${label}`, 0, 1)[0];
    const attachments = gmailThread.getMessages()[0].getAttachments();
    const attachmentNames = [];
    attachments.forEach((attachment) =>
      attachmentNames.push(attachment.getName())
    );
    const csv = attachmentNames.indexOf(
      attachmentNames.find((attach) => attach.toLowerCase().endsWith(".csv"))
    );
    const parsedCSV = Utilities.parseCsv(attachments[csv].getDataAsString());
    return parsedCSV;
  }

  class NormalizationConfig {
    constructor(rawHeaders = [], nrmlHeaders = []) {
      this.rawHeaders = rawHeaders;
      this.headerMap = new Map(
        rawHeaders.map((val, i) => [val, nrmlHeaders[i]])
      );
    }
  }
  function normalizeCSVReport(report = [[]], config = {}, cleanDataCallback) {
    const { rawHeaders, headerMap } = config;

    const getRawIndexes = () => {
      const reportHeaders = report[0];
      const indexes = [];

      for (const [i, header] of reportHeaders.entries()) {
        if (rawHeaders.includes(header)) {
          indexes.push(i);
        }
      }
      return indexes;
    };

    const rawIndexes = getRawIndexes();

    const normalizedReport = [];
    for (const row of report) {
      const normalizedRow = [];
      const iterator = rawIndexes;
      for (const i of iterator) {
        const val = row[i];
        normalizedRow.push(val);
      }
      normalizedReport.push(normalizedRow);
    }

    const reportHeaders = normalizedReport[0];
    const normalizedHeaders = reportHeaders.map(
      (header) => (header = headerMap.get(header))
    );

    normalizedReport.splice(0, 1, normalizedHeaders);
    if (cleanDataCallback) {
      return cleanDataCallback(normalizedReport);
    }
    return normalizedReport;
  }

  // 'PO_#' is the common key between target and source data
  function updateShipmentsWithNewData(target, source, key) {
    for (let existing of target) {
      for (let updated of source) {
        if (existing[key] === updated[key]) {
          Object.assign(existing, updated);
          break;
        }
      }
    }
    return target;
  }

  function make2DArrayFromArrayOfObjects(shipmentObs, headers) {
    const newRows = [];

    for (const shipment of shipmentObs) {
      const row = [];
      for (const header of headers) {
        row.push(shipment[header]);
      }
      newRows.push(row);
    }

    return newRows;
  }

  // UTILITY FUNCTIONS
  function replaceSpaces(arr) {
    return arr.map((header) => header.replaceAll(" ", "_"));
  }

  function getIndexOldestUndeliveredShipment() {
    const deliveryDate = datasetHeaders.indexOf("Delivery Date");
    let index;
    for (const [i, row] of datasetData.entries()) {
      if (row[deliveryDate] === "") {
        index = i;
        break;
      }
    }
    return index;
  }

  // DEFINE CONFIGS FOR EACH CSV REPORT
  const netsuiteReport = getCSVFromGmail("ns-ltl-report");
  const netsuiteNormalizedHeaders = replaceSpaces([
    "Ship From",
    "Scheduled Ship Date",
    "Due Date",
    "DC Name",
    "PO #",
  ]);
  const netsuiteRawHeaders = [
    "Location",
    "Fulfillment Date",
    "Memo",
    "Name",
    "Customer PO #",
  ];
  const netsuiteConfig = new NormalizationConfig(
    netsuiteRawHeaders,
    netsuiteNormalizedHeaders
  );

  // THESE ARE THE HEADERS NEEDED FOR ANY CARRIER REPORTS
  const carrierNormalizedHeaders = replaceSpaces([
    "PO #",
    "Actual Ship Date",
    "PRO Number",
    "Arrived At Carrier Yard",
    "Delivery Date",
    "Pallet Count",
    "Weight",
  ]);

  const oldDominionReport = getCSVFromGmail("odfl-ship-report");
  const oldDominonRawHeaders = [
    "Purchase Order Number",
    "Actual Pickup Date",
    "OD Pro#",
    "Arrival Date",
    "Delivery Date",
    "Pieces (skids/pallets)",
    "Weight",
  ];
  const oldDominionConfig = new NormalizationConfig(
    oldDominonRawHeaders,
    carrierNormalizedHeaders
  );

  const estesReport = getCSVFromGmail("estes-ship-report");
  const estesRawHeaders = [
    "Purchase Order #",
    "Pickup Date",
    "Pro #",
    "Arrival Date",
    "Delivery Date",
    "Pallets",
    "Weight*",
  ];
  const estesConfig = new NormalizationConfig(
    estesRawHeaders,
    carrierNormalizedHeaders
  );

  // REPORT-SPECIFIC DATA CLEANUP FUNCTIONS
  function cleanOldDominionReport(arr) {
    const poNumber = arr[0].indexOf("PO_#");
    const body = arr.slice(1);
    body.forEach((row) => {
      row[poNumber] = row[poNumber].replaceAll("#", "");
    });
    return arr;
  }

  // CREATE NORMALIZED REPORTS
  const normalizedNetsuiteReport = normalizeCSVReport(
    netsuiteReport,
    netsuiteConfig
  );
  const normalizedOldDominionReport = normalizeCSVReport(
    oldDominionReport,
    oldDominionConfig,
    cleanOldDominionReport
  );
  const normalizedEstesReport = normalizeCSVReport(estesReport, estesConfig);

  // UPDATE THE DATASET, PUSH IT BACK INTO SHEETS
  const shipmentHeaders = replaceSpaces(datasetHeaders.slice(0, 12));

  const existingUndeliveredShipmentsArray = datasetData.slice(
    getIndexOldestUndeliveredShipment()
  );
  // removes the 'right hand formula' columns from existingUndeliveredShipmentsArray
  for (row of existingUndeliveredShipmentsArray) {
    row.splice(shipmentHeaders.length);
  }
  // adds a header row which is needed for convert2DArrayToJson()
  existingUndeliveredShipmentsArray.unshift(shipmentHeaders);

  const existingUndeliveredShipments = convert2DArrayToJson(
    shipmentHeaders,
    existingUndeliveredShipmentsArray
  );
  const newNetsuiteOrders = convert2DArrayToJson(
    netsuiteNormalizedHeaders,
    normalizedNetsuiteReport
  );
  const allActiveShipments =
    existingUndeliveredShipments.concat(newNetsuiteOrders);

  // TODO - make more programtic. adding a third carrier would be a little verbose
  // create two arrays of objects that describe the shipping info provide by carrier reports
  // concat them together to create one array of carrier update data
  const odShipmentDetails = convert2DArrayToJson(
    carrierNormalizedHeaders,
    normalizedOldDominionReport
  );
  const estesShipmentDetails = convert2DArrayToJson(
    carrierNormalizedHeaders,
    normalizedEstesReport
  );
  const updatedCarrierData = odShipmentDetails.concat(estesShipmentDetails);

  const updatedShipments = updateShipmentsWithNewData(
    allActiveShipments,
    updatedCarrierData,
    "PO_#"
  );
  const updatedShipmentsArray = make2DArrayFromArrayOfObjects(
    updatedShipments,
    shipmentHeaders
  );

  const oldestActiveShipmentRow = getIndexOldestUndeliveredShipment() + 1;
  const rangeOfShipmentsToUpdate = datasetSheet.getRange(
    oldestActiveShipmentRow,
    1,
    updatedShipmentsArray.length,
    shipmentHeaders.length
  );
  rangeOfShipmentsToUpdate.setValues(updatedShipmentsArray);
}
