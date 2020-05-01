//module.exports = app => {
//  const customers = require("../controllers/customer.controller.js");
//
//  // Create a new Customer
//  app.post("/customers", customers.create);
//
//  // Retrieve all Customers
//  app.get("/customers", customers.findAll);
//
//  // Retrieve a single Customer with customerId
//  app.get("/customers/:customerId", customers.findOne);
//
//  // Update a Customer with customerId
//  app.put("/customers/:customerId", customers.update);
//
//  // Delete a Customer with customerId
//  app.delete("/customers/:customerId", customers.delete);
//
//  // Create a new Customer
//  app.delete("/customers", customers.deleteAll);
//};

module.exports = app => {
  const data = require("../controllers/data.controller.js");
  const device = require("../controllers/device.controller.js");

  // Create new data
  app.post("/data", device.create);

  // Retrieve all data
  app.get("/data", data.findAllData);

  // Retrieve all devices
  app.get("/device", device.findAllDevice);

  // Retrieve a single Customer with customerId
  app.get("/device/:deviceId", device.findOneDevice);

  // Retrieve all data from a single device
  app.get("/data/:deviceId", data.findAllDataFromOneDevice);

  // Retrieve latest data from device
  app.get("/device/:deviceId/latest", data.findLatestData);

  // Update name of a device
  app.put("/device/:deviceId", device.updateDeviceName);

  // Update password of a device
  app.put("/device/:deviceId/password", device.updateDevicePass);

  // Update factory settings to a device
  app.put("/device/:deviceId", device.updateDeviceFactory);

  // delete data from device
  app.delete("/data/:deviceId", data.deleteDeviceData);

  // get password of a device
  app.get("/device/:deviceId/password", device.getDevicePass);
};