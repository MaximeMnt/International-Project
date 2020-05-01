import { StorageService, IBoolDarkMode } from 'src/app/Services/storage.service';
import { ThemeService } from './../../services/theme.service';
import { Component, OnInit } from '@angular/core';
import { FeaturetoggleService } from 'src/app/Services/featuretoggle.service';
import { APIService, IDevice, IPassword, IDeviceData } from 'src/app/Services/api.service';
import {Md5} from 'ts-md5/dist/md5';
import { Router, RouterEvent } from '@angular/router';
import { runInThisContext } from 'vm';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {
  md5 = new Md5();
  public AutoRequestToDataBase: boolean = true;
  DeviceNameChange: IDevice;
  Device: IDevice[];
  DeviceAll: IDevice[];
  Data: IDeviceData[]

  stateDarkMode: IBoolDarkMode[] = [];
  darkModeButtonState: boolean;

  SelectedDevice: number;
  SelectedDeviceName: string;
  Selected: number;
  SelectedName: string;
  deleteResult: string;
  newNameforDevice: string;
  oldPassword: string;
  oldPasswordInDB: IPassword;
  newPassword: string;
  defaultPasswordOfDevice: string = "admin";
  defaultNameOfDevice: string = "admin";
  Temperature: number = 0;
  Humidity: number = 0;
  Moisture: number = 0;
  id: number;
  pageWifi = [{
    title: 'Wifi Credentials Page',
    url: '/menu/finddevice'
  }]
  selectedPath = '';

  constructor(private APIService: APIService, 
    private ThemeService: ThemeService, 
    private _featureToggleService: FeaturetoggleService, 
    private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    })
  }

  async ngOnInit() {
    this.APIService.GetDeviceInfogeneral().subscribe(Device => {
      this.Device = Device;
    })
    this.APIService.GetDeviceDataAll().subscribe(Data => {
      this.Data = Data;
    })
  }

  GetDeviceNameFromID() {
    for (let index = 0; index < this.Device.length; index++) {
      if (this.Device[index].ID == this.SelectedDevice) {
        this.SelectedDeviceName = this.Device[index].Name;
        break;
      }
    }
    return this.SelectedDeviceName;
  }

  toggleDarkMode(e) {
    this.darkModeButtonState = e.detail.checked;
    this.ThemeService.toggleAppTheme(this.darkModeButtonState);
  }

  public checkForChanges() {
    this._featureToggleService.sendmessage(this.AutoRequestToDataBase);
  }

  GetDeviceData() {
    this.APIService.GetDeviceInfogeneral().subscribe(Device => {
      this.Device = Device;
    })
  }

  ApplyNewName() {
    console.log(this.newNameforDevice);
    this.APIService.UpdateNameDevice(this.SelectedDevice, this.newNameforDevice).subscribe(device => this.Device.push(device));
  }

  ApplyPasswordChange() {
    this.APIService.GetDevicePassword(this.SelectedDevice).subscribe(Password => {
      this.oldPasswordInDB = Password;
    })

    if (this.oldPassword == this.oldPasswordInDB.Password) {
      this.APIService.UpdatePasswordDevice(this.SelectedDevice, this.md5.appendStr(this.newPassword).end()).subscribe(device => this.Device.push(device));
      this.oldPassword = "";
      this.newPassword = "";
      alert("Password changed!");
    }
    else {
      alert("Old password is incorrect!");
    }
  }

 HardResetDeviceName(){
    console.log(this.defaultNameOfDevice);
   this.APIService.UpdateResetName(this.Selected,this.defaultNameOfDevice).subscribe(device => this.Device.push(device));
 }

 HardResetDevicePassword(){
  console.log(this.defaultPasswordOfDevice);
 this.APIService.UpdateResetPassword(this.Selected,this.defaultPasswordOfDevice).subscribe(device => this.Device.push(device));
}

 HardResetData(){
  this.APIService.DeleteAllData(this.Selected).subscribe(result => {this.deleteResult = result});
 }

 HardResetEverything(){
   this.HardResetDeviceName();
   this.HardResetDevicePassword();
   this.HardResetData();  
 }
}