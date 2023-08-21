// If we ship to any new Target DCs they will need to be added to this mapping
// otherwise they will not be included in the output when the script runs.
// The Map key is the DC location number
const locationDetails = new Map([
  // East Coast
  ["1234", { internalId: "567890", name: "locationName", roastery: "ABC" }],

  // West Coast
  ["9876", { internalId: "420690", name: "locationNice", roastery: "XYZ" }],
]);

/**
 * @param {string} poNumber The PO # provided by Target in the format <po set #>-<location #>
 * @returns {Object} location An object with location name, default roastery, and Netsuite internal ID
 */
function getLocationDetails(poNumber) {
  const locationID = poNumber.split("-")[1];

  if (!locationDetails.has(locationID) || !locationID) {
    throw Error(
      `Could not parse PO # ${poNumber}. Make sure the location exists in locationDetails mapping and the PO # is formatted correctly.`
    );
  }

  const location = locationDetails.get(locationID);
  return location;
}

// UPC numbers as sent by Target that correspond with the SKU prefix used in Netsuite
const upcNumbers = new Map([
  ["123456789000", "SKU1"],
  ["987654321234", "SKU2"],
]);
