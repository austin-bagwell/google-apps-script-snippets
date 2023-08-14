const ordersSheet = SpreadsheetApp.getActive().getSheetByName('orders').getDataRange().getDisplayValues();
const ordersSheetHeaders = ordersSheet[0];
const displayNamesSheet = SpreadsheetApp.getActive().getSheetByName('displayNames').getDataRange().getDisplayValues();

class Order {
  constructor({ customerName = '', poNum = '', location = '', fillDate = '', dueDate = '', items = {}, ups = "", salesOrder = '' }) {
    this.customerName = customerName;
    this.poNum = poNum;
    this.location = location;
    this.fillDate = new Date(fillDate);
    this.dueDate = dueDate;
    this.items = items;
    this.ups = ups.toLowerCase().includes("ups") ? true : false;
    this.calendarID = '';
    this.guestList = '';
    this.sendInvites = false;
    this.salesOrder = salesOrder;
  }

  addEventToCalendar() {
    const { title, startDate, endDate, options } = this.genEventDetails();
    CalendarApp.getCalendarById(this.calendarID).createAllDayEvent(title, startDate, endDate, options);
  }

// @returns object to interface with this API
// https://developers.google.com/apps-script/reference/calendar/calendar#createAllDayEvent(String,Date,Date,Object)
  genEventDetails() {
    const title = `${this.ups ? "via UPS " : ""}${this.customerName} ${this.poNum} (${this.caseCount()} cases)`;
    const startDate = this.fillDate;
    const oneDay = 1000 * 60 * 60 * 24;
    // endDate is exclusive and needs to occur after start date
    const endDate = new Date(startDate.valueOf() + oneDay);
    const options = { description: this._eventDescription(), guests: this.guestList, sendInvites: this.sendInvites };

    return { title, startDate, endDate, options }
  }

  caseCount() {
    let count = 0;
    for (let item of this.items) {
      count += +item.quantity
    }
    return count;
  }

  _eventDescription() {
    const items = [];
    for (let item of this.items) {
      const line = `${item.quantity} x ${item.description}\n`;
      items.push(line);
    }
    let description = `${items.join("")}\n`;

    description += `\nSales Order: ${this.salesOrder}`;
    description += `\nDue Date: ${this.dueDate}`;
    description += `\nPickup #: `;
    description += `\nPRO #: `;
  
    return description;
  }
}

class WestCoastOrder extends Order {
  constructor (customerName, poNum, location, fillDate, dueDate, items, ups, salesOrder) {
    super(customerName, poNum, location, fillDate, dueDate, items, ups, salesOrder);
    this.calendarID = 'counterculturecoffee.com_i44e9bh678e8l2qjao1qliia24@group.calendar.google.com';
    this.guestList = 'wcp@counterculturecoffee.com,wcroasting@counterculturecoffee.com';
    this.sendInvites = true;
  }
}

class EastCoastOrder extends Order {
  constructor (customerName, poNum, location, fillDate, dueDate, items, ups, salesOrder) {
    super(customerName, poNum, location, fillDate, dueDate, items, ups, salesOrder);
    this.calendarID = 'counterculturecoffee.com_qeampsijjumdrdc6g0nbmfghvo@group.calendar.google.com';
    this.guestList = 'ecp@counterculturecoffee.com,ecroasting@counterculturecoffee.com,jmcarthur@counterculturecoffee.com';
    this.sendInvites = false;
  }
}

class TestOrder extends Order {
  constructor (customerName, poNum, location, fillDate, dueDate, items, ups, salesOrder) {
    super(customerName, poNum, location, fillDate, dueDate, items, ups, salesOrder);
    this.calendarID = 'abagwell@counterculturecoffee.com';
    this.guestList = '';
    this.sendInvites = false;
  }
}

// loose implementation/interpretation of Abstract Factory design pattern
// https://refactoring.guru/design-patterns/abstract-factory
function OrderFactory(order) {
  const location = order.location;

  switch(location) {
    case 'DUR': 
      return new EastCoastOrder(order);
    case 'SF':
      return new WestCoastOrder(order);
    case 'TEST':
      return new TestOrder(order);
    default:
      const name = order.customerName;
      const poNum = order.poNum;
      const location = order.location;
      const message = `Order ${name} ${poNum} has invalid location '${location}'. Location must be 'DUR', 'SF', or 'TEST'`;
      SpreadsheetApp.getUi().alert(message);
      throw new Error(message);
  }
};

function scheduleEvents() {
  const orders = buildOrderForEachPO();
  for (let order of orders) {
    order.addEventToCalendar();
  }
};

function buildOrderForEachPO() {
  const orders = [];
  const poNumbers = getUniquePoNums();
  poNumbers.forEach(po => {
    const order = buildNewOrder(po);
    orders.push(order);
  })
  return orders;
}

function getUniquePoNums() {
  const uniqueNums = [];
  ordersSheet.forEach(row => {
    if (!uniqueNums.includes(row[2]) && row[2] != 'poNumber') {
      uniqueNums.push(row[2])
    }
  }) 
  return uniqueNums;
}

// FIXME
// this relies on specific header order -- BAD
function buildNewOrder(po) {
  const poRowsArray = filterOneOrderFromOrdersSheet(po, ordersSheet);

  const displayNameMap = mapDisplayNames();
  const customerNameRaw = poRowsArray[0][1];
  const customerName = displayNameMap.get(customerNameRaw) || customerNameRaw;
  
  const poNum = poRowsArray[0][2];
  const location = poRowsArray[0][3];
  const fillDate = poRowsArray[0][7];
  const dueDate = poRowsArray[0][8];
  const ups = poRowsArray[0][9];
  const salesOrder = poRowsArray[0][10].split('#')[1] || '';
  const items = getItemsFromPO(po, ordersSheet);
  
  const order = { customerName, poNum, location, fillDate, dueDate, ups, items, salesOrder };

  return OrderFactory(order);
}

// TODO need to actually pass arr when calling this, rn it is using global ss by default
/**
 * @param {string} po - the PO number to filter by
 * @param {array} arr - the 2D array to be filtered. Requires 'poNumber' header at a minimum
 * @return {array} 2D array without headers
 */
function filterOneOrderFromOrdersSheet(po, arr) {
  const poIndex = ordersSheet[0].indexOf('poNumber');
  return arr.filter(row => row[poIndex] === po);
};

/**
 * @param {string} po - the PO number to filter by
 * @param {array} arr - the 2D array to be filtered. Requires 'item','quantity', 'description' headers  
 * @return {Array<Object>} items { item: <sku>, quantity: <string>, description: <string> }
 */
function getItemsFromPO(po, arr) {
  const order = filterOneOrderFromOrdersSheet(po, arr);
  const itemIndex = arr[0].indexOf('item');
  const quantityIndex = arr[0].indexOf('quantity');
  const descIndex = arr[0].indexOf('description')
  
  const items = [];
  for (let row of order) {
    const item = row[itemIndex];
    const quantity = row[quantityIndex];
    const description = row[descIndex];
    items.push({ item, quantity, description });
  }
  return items;
};

function mapDisplayNames() {
  const idxNetsuite = 0;
  const idxDisplay = 1;
  const namesRows = displayNamesSheet.slice(1);

  const mapping = new Map();
  
  for (let row of namesRows) {
    mapping.set(row[idxNetsuite], row[idxDisplay]);
  }
  return mapping;
}
