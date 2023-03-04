"use strict";

// GETTING FILES FROM GMAIL

/**
 *
 * @param {label: string} label
 * gmail label
 *
 * TODO - double check return value
 * @returns { parsedCsv: string } returns a CSV as a string... as 2D array?
 */

// gets a CSV file from the most recent email thread that matches the label passed as an argument
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

export { getCSVFromGmail };
