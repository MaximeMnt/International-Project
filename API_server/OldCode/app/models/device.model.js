const sql = require("../db.js");

// constructor
const Device = function(device) {
  this.ID = device.ID;
  this.Password = device.Password;
  this.Name = device.Name;
  this.Status = device.Status;
};


//Create new data
Device.create = (newData, result) => {
  sql.query("INSERT INTO Data SET ?", newData, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created data: ", { id: res.insertId, ...newData });
    result(null, { id: res.insertId, ...newData });
  });
};

//Retrieve all devices
Device.getAllDevices = result => {
  sql.query("SELECT * FROM vmdDB1.Device;", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("DeviceTable: ", res);
    result(null, res);
  });
};

//retrieve single device with id
Device.findDeviceById = (deviceId, result) => {
  sql.query(`SELECT * FROM vmdDB1.Device where ID = ${deviceId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found device: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found device with the id
    result({ kind: "not_found" }, null);
  });
};

Device.updateNameById = (deviceId, device, result) => {
  sql.query(`UPDATE vmdDB1.Device SET Name = '${device.Name}' WHERE (ID = '${deviceId}');`,(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Device with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated Device: ", { id: deviceId, ...device.Name });
      console.log(device.Name);
      result(null, { id: deviceId, ...device.Name });
    }
  );
};

Device.updatePasswordById = (deviceId, device, result) => {
    sql.query(`UPDATE vmdDB1.Device SET Password = '${device.Password}' WHERE (ID = '${deviceId}');`,(err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found Device with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated Device: ", { id: deviceId, ...device.Password });
        console.log(device.Password);
        result(null, { id: deviceId, ...device.Password });
      }
    );
  };

Device.updateFactorySettings = (deviceId, device, result) => {
  sql.query(`UPDATE vmdDB1.Device SET Password = '${device.Password}', Name ='${device.Name}' WHERE (ID = '${deviceId}');`,(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Device with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated Device: ", { id: deviceId, ...device.Password, ...device.Name });
      console.log(device.Password && device.Name);
      result(null, { id: deviceId, ...device.Password, ...device.Name });
    }
  );
};

//retrieve password from specifi device with id
Device.findPassById = (deviceId, result) => {
  sql.query(`SELECT Device.Password FROM vmdDB1.Device WHERE ID = ${deviceId};`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found device: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found device with the id
    result({ kind: "not_found" }, null);
  });
};
  module.exports = Device;