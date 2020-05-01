import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';


@Component({
  selector: 'app-finddevice',
  templateUrl: './finddevice.page.html',
  styleUrls: ['./finddevice.page.scss'],
})
export class FinddevicePage implements OnInit {

  password: string;
  ssid: string;

  //bluetooth variables
  BluetoothDevice: any;
  public FoundDevices: any = [];

  pairedDevices: any;
  unpairedDevices: any;
  gettingDevices: boolean;

  constructor(private bluetoothSerial: BluetoothSerial) {
  }

  ngOnInit() {
    this.bluetoothSerial.enable();
    this.startScanning();
  }

  startScanning() {
    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.gettingDevices = true;
    const unPair = [];
    this.bluetoothSerial.discoverUnpaired().then((success) => {
      success.forEach((value, key) => {
        var exists = false;
        unPair.forEach((val2, i) => {
          if (value.id === val2.id) {
            exists = true;
          }
        });
        if (exists === false && value.id !== '') {
          unPair.push(value);
        }
      });
      this.unpairedDevices = unPair;
      this.gettingDevices = false;
    },
      (err) => {
        console.log(err);
      });

    this.bluetoothSerial.list().then((success) => {
      this.pairedDevices = success;
    },
      (err) => {

      });
  }

  success = (data) => {
    this.deviceConnected();
  }
  fail = (error) => {
    alert(error);
  }

  async selectDevice(id: any) {
    this.bluetoothSerial.connect(id).subscribe(this.success, this.fail);
  }

  private delay(ms: number){
    return new Promise(resolve => setTimeout(resolve,ms));
  }

  //connecting + sending data
   async deviceConnected() {
    this.bluetoothSerial.isConnected().then(async success => {

      if (this.password && this.ssid) {
        this.bluetoothSerial.write("ssid " + this.ssid); 
        await this.delay(2000);
        this.bluetoothSerial.write("pin " + this.password);       
        //this.bluetoothSerial.write("pin " + this.password);
        await this.delay(2000);
        this.disconnect();
      } else { alert("Ssid or password cannot be blank!"); this.disconnect(); }




    }, error => {
      alert('error' + JSON.stringify(error));
    });
  }

  async disconnect() {
    this.bluetoothSerial.disconnect();
  }

}

