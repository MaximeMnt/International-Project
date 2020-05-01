import { StorageService, IexeedEntry } from './../../Services/storage.service';
import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from "chart.js";
import { APIService, IAllDeviceData, IDeviceData } from 'src/app/Services/api.service';
import { DatePipe } from '@angular/common';
import { interval } from 'rxjs';
import { ToastController, Platform } from '@ionic/angular';


@Component({
  selector: 'app-temperature',
  templateUrl: './temperature.page.html',
  styleUrls: ['./temperature.page.scss'],
  providers: [DatePipe]
})
export class TemperaturePage implements OnInit {

  tempEntries: IexeedEntry[] = [];
  newTempEntry: IexeedEntry = <IexeedEntry>{};
  rangeCountEntry: IexeedEntry = <IexeedEntry>{};
  chartData: ChartDataSets[] = [{ data: [], label: 'Temperature', fill: false }];
  chartLabels: String[];
  tempArray: number[] = [];
  hourArray: String[];
  gemiddeldeArray: number[] = [];
  dataHours: String[] = [];
  BatLowerFlag: boolean = false;
  metric: String = "celcius";
  tempAantal: number = 0;
  totalTempValue: number = 0;
  tempRes: IDeviceData[] = [];
  newRes: IDeviceData[] = [];
  DataDevice: IAllDeviceData;
  DataDeviceArray: IAllDeviceData[];

  // Options the chart - Visualisation
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    responsiveAnimationDuration: 1500,
    aspectRatio: 3,
    layout: {
      padding: {
        left: 0,
        right: 35,
        top: 0,
        bottom: 0
      }
    },
    title: {
      display: true,
      text: 'Temperature for Device 1'
    },
    pan: {
      enabled: true,
      mode: 'xy'
    },
    zoom: {
      enabled: true,
      mode: 'xy'
    }
  };
  chartType = 'line';
  showLegend = false;
  showHourView = false;

  constructor(public toastController: ToastController,
    private plt: Platform,
    private APIService: APIService,
    private storage: StorageService,
    public datepipe: DatePipe) {
    this.plt.ready().then(() => {
      this.loadTempEntries();
    })

    this.GetLatestData();
    this.GetAllInfoDevice(this.metric);
    interval(60000).subscribe(x => { //* will execute every 5 seconds
      this.GetLatestData();
      this.GetAllInfoDevice(this.metric);
    });
  }

  async ngOnInit() { 
    this.APIService.GetLatestSingleDeviceInfo(1).subscribe(DataDevice => { 
      this.DataDevice = DataDevice;
    })
  }

  //* ADD Entry
  addTempEntry(tempEntry: IexeedEntry) {
    this.newTempEntry.id = Date.now();
    this.storage.addEntry(tempEntry).then(entry => {
      this.newTempEntry = <IexeedEntry>{};
      this.showToast('Temperature Entry Added');
      this.loadTempEntries();
    })
  }

  GetAllInfoDevice(metric: String) {
    this.APIService.GetDeviceDataSingle(1).subscribe(res => {
      this.newRes = [];
      for (let d = 0; d < 40; d++) {
        this.tempRes.push(res.pop());
      }
      for (let d = 0; d < 40; d++) {
        this.newRes.push(this.tempRes.pop());
      }
      this.chartData[0].data = [];
      this.chartLabels = [];
      
      for (let entry of this.newRes) {
        //If user does not choose for 24h view
        //console.log(entry.Time);
        if (!this.showHourView) {
          this.chartLabels.push(this.datepipe.transform(entry.Date, 'd/MM/y'));
          //gets double digit hour out of time object
          this.hourArray = (entry.Time.toString().split(":", 1));
          this.dataHours.push(this.hourArray[0]);
          //console.log(this.hourArray[0]);
        }
        
        if (metric == "celcius") {
          this.chartData[0].data.push(entry['Temperature']);
          this.tempArray.push(entry['Temperature']);
        }
        else {
          this.chartData[0].data.push((entry['Temperature'] * 1.8) + 32);
        }
        
      }
      
      //If user chooses for 24h view
      if (this.showHourView) {
        //removes zero's before single digit hours
        for (let i = 0; i < this.dataHours.length; i++) {
          if(this.dataHours[i].slice(0,1) == "0"){
          this.dataHours[i] = this.dataHours[i].slice(1,2);
          }
        }

      this.gemiddeldeArray = [];
      for (let i = 0; i < 24; i++) {
        for (let y = 0; y < this.tempArray.length; y++) {
          if (this.dataHours[y] == i.toString()) {
            this.tempAantal++;
            this.totalTempValue += this.tempArray[y];
          }
          
        }
        this.gemiddeldeArray.push(this.totalTempValue / this.tempAantal);
          this.tempAantal = 0;
          this.totalTempValue = 0;
        
      }
      console.log(this.gemiddeldeArray);
      
      this.chartData[0].data = [];
      this.chartLabels = [];
    for (let i = 0; i < this.gemiddeldeArray.length; i++) {
      this.chartData[0].data.push(this.gemiddeldeArray[i]);
      
      this.chartLabels.push(i + "h")
      }
      
    }

    });
  }

  // Load Entries
  loadTempEntries() {
    this.storage.getEntries().then(tempEntries => {
      this.tempEntries = tempEntries;
    })
  }

  // Remove Entry
  removeTempEntry(ID: number) {
    this.storage.deleteEntry(ID);
  }

  // Remove All Entries
  removeAllTempEntries() {
    this.storage.deleteAllEntries();
  }

  //instellen van een limiet: 
  public rangeCount: number = 50;
  public packetNumber: number = 100;
  private lastSavedDate: Date;

  GetLatestData() {
    this.APIService.GetLatestSingleDeviceInfo(1).subscribe(DataDevice => {
      this.DataDevice = DataDevice;
      if (this.DataDevice.Temperature > this.rangeCount && this.DataDevice.Date != this.lastSavedDate
      ) {

        this.newTempEntry.temperature = this.DataDevice.Temperature;
        this.newTempEntry.date = this.DataDevice.Date;
        this.newTempEntry.time = this.DataDevice.Time;
        this.lastSavedDate = this.DataDevice.Date;
        this.addTempEntry(this.newTempEntry)

        //* Notification
        var message = {
          app_id: "b16686d2-04a8-468a-8658-7b411f0a777b",
          contents: { "en": "The temperature of '" + DataDevice.Name + "' has reached the limit! The temperature value is now " + DataDevice.Temperature + "." },
          included_segments: ["All"]
        };

        this.APIService.SendNotification(message).subscribe(data => {
          console.log('Notification sent');
          console.log(data);
        },
          err => {
            alert(err);
          });
      }
      if (DataDevice.Battery > 20) {
        this.BatLowerFlag = false;
      }
      if (DataDevice.Battery < 20 && this.BatLowerFlag == false) {
        this.BatLowerFlag = true;
                //* Notification
                var message = {
                  app_id: "b16686d2-04a8-468a-8658-7b411f0a777b",
                  contents: { "en": "The Battery level of '" + DataDevice.Name + "' is under 20%" },
                  included_segments: ["All"]
                };
        
                this.APIService.SendNotification(message).subscribe(data => {
                  console.log('Notification sent');
                  console.log(data);
                },
                  err => {
                    alert(err);
                  });
        
      }
    });
  }

  typeChanged(e) {
    const on = e.detail.checked;
    this.chartType = on ? 'line' : 'bar';
  }

  viewChanged(e) {
    this.GetAllInfoDevice(this.metric);
  }

  //* Helper
  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  TempSegmentChanged(event: any) {
    if (event.target.value == "celcius") {
      this.metric = "celcius";
      this.GetAllInfoDevice(this.metric);
    }
    else if (event.target.value == "fahrenheit") {
      this.metric = "fahrenheit"
      this.GetAllInfoDevice(this.metric);
    }
  }
}