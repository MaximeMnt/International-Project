const Data = require("../models/data.model.js");

// create new data
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }

    const data = new Data({
      DeviceId: req.body.DeviceId,
      Temperature: req.body.Temperature,
      Humidity: req.body.Humidity,
      Moisture: req.body.Moisture,
      Time: req.body.Time,
      Date: req.body.Date,
      Battery: req.body.Battery
    });
  
    // Save Data in the database
    Data.create(data, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the data."
        });
      else res.send(data);
    });
  };

// Retrieve all Data from the database.
exports.findAllData = (req, res) => {
    Data.getAllData((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving data."
        });
      else res.send(data);
    });
  };

//retrieve all data from a single device
exports.findAllDataFromOneDevice = (req, res) => {
  Data.findDataById(req.params.deviceId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found data with DeviceId ${req.params.deviceId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving data with DeviceId " + req.params.deviceId
        });
      }
    } else res.send(data);
  });
};

// Find latest data from a device with a deviceId
exports.findLatestData = (req, res) => {
  Data.findLatestById(req.params.deviceId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found latest data from davice with id ${req.params.deviceId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving latest data from device with with id " + req.params.deviceId
        });
      }
    } else res.send(data);
  })
};

// Update a devices name with the Id in the request
exports.updateDeviceName = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Data.updateNameById(
    req.params.deviceId,
    new Data(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found device with id ${req.params.deviceId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating device with id " + req.params.deviceId
          });
        }
      } else res.send(data);
    }
  );
};

// Delete all data from a specific device with the ID
exports.deleteDeviceData = (req, res) => {
  Data.removeData(req.params.deviceId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Device with id ${req.params.deviceId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Data with deviceId " + req.params.deviceId
        });
      }
    } else res.send({ message: `Data was deleted successfully!` });
  });
};
  