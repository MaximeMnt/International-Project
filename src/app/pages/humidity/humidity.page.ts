import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from "chart.js";
import { APIService, IAllDeviceData, IDeviceData } from 'src/app/Services/api.service';
import { ToastController, Platform } from '@ionic/angular';
import { interval } from 'rxjs';
import { DatePipe } from '@angular/common';
import { IexeedEntry, StorageService } from 'src/app/Services/storage.service';


@Component({
  selector: 'app-humidity',
  templateUrl: './humidity.page.html',
  styleUrls: ['./humidity.page.scss'],
  providers: [DatePipe]
})
export class HumidityPage implements OnInit {

  humidEntries: IexeedEntry[] = [];
  newHumidEntry: IexeedEntry = <IexeedEntry>{};
  rangeCountEntry: IexeedEntry = <IexeedEntry>{};
  chartData: ChartDataSets[] = [{ data: [], label: 'Humidity', fill: false }];
  chartLabels: String[];
  metric: String = "celcius";

  humRes: IDeviceData[] = [];
  newRes: IDeviceData[] = [];
  DataDevice: IAllDeviceData;
  DataDeviceArray: IAllDeviceData[];
  hourArray: String[];
  gemiddeldeArray: number[] = [];
  dataHours: String[] = [];
  humArray: number[] = [];

  humAantal: number = 0;
  totalHumValue: number = 0;

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
      text: 'Humidity for Device 1'
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
      this.loadHumidEntries();
    })

    this.GetLatestData();
    this.GetAllInfoDevice(this.metric);
    interval(60000).subscribe(x => { // will execute every minute
      this.GetLatestData();
      this.GetAllInfoDevice(this.metric);
    });
  }

  async ngOnInit() {
    //limiet instellen
    this.APIService.GetLatestSingleDeviceInfo(1).subscribe(DataDevice => { //device ID moet een variabele zijn in de toekomst.
      this.DataDevice = DataDevice;
    })
  }

  //Add Entry
  addHumidEntry(humidEntry: IexeedEntry) {
    this.newHumidEntry.id = Date.now();
    this.storage.addEntry(humidEntry).then(entry => {
      this.newHumidEntry = <IexeedEntry>{};
      this.showToast('Humidity Entry Added');
      this.loadHumidEntries();
    })
  }

  //Load Entries
  loadHumidEntries() {
    this.storage.getEntries().then(humidEntries => {
      this.humidEntries = humidEntries;
    })
  }

  //Remove Entry
  removeHumidEntry(ID: number) {
    this.storage.deleteEntry(ID);
  }

  //Remove All Entries
  removeAllHumidEntries() {
    this.storage.deleteAllEntries();
  }

  GetAllInfoDevice(metric: String) {
    this.APIService.GetDeviceDataSingle(1).subscribe(res => {
      //console.log('Res: ', res)

      this.newRes = [];
      for (let d = 0; d < 40; d++) {
        this.humRes.push(res.pop());
      }
      for (let d = 0; d < 40; d++) {
        this.newRes.push(this.humRes.pop());
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
          this.chartData[0].data.push(entry['Humidity']);
          this.humArray.push(entry['Humidity']);
        }
        else {
          this.chartData[0].data.push((entry['Humidity'] * 1.8) + 32);
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
        for (let y = 0; y < this.humArray.length; y++) {
          if (this.dataHours[y] == i.toString()) {
            this.humAantal++;
            this.totalHumValue += this.humArray[y];
          }
          
        }
        this.gemiddeldeArray.push(this.totalHumValue / this.humAantal);
          this.humAantal = 0;
          this.totalHumValue = 0;
        
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

  typeChanged(e) {
    const on = e.detail.checked;
    this.chartType = on ? 'line' : 'bar';
  }

  //instellen van een limiet: 
  public rangeCount: number = 80;
  public packetNumber: number = 100;
  private lastSavedDate: Date;

  GetLatestData() {
    this.APIService.GetLatestSingleDeviceInfo(1).subscribe(DataDevice => {
      this.DataDevice = DataDevice;
      if (this.DataDevice.Humidity > this.rangeCount && this.DataDevice.Date != this.lastSavedDate
      ) {

        this.newHumidEntry.humidity = this.DataDevice.Humidity;
        this.newHumidEntry.date = this.DataDevice.Date;
        this.newHumidEntry.time = this.DataDevice.Time;
        this.lastSavedDate = this.DataDevice.Date;
        this.addHumidEntry(this.newHumidEntry)

        //* Notification
        var message = {
          app_id: "b16686d2-04a8-468a-8658-7b411f0a777b",
          contents: { "en": "The humidity level of '" + DataDevice.Name + "' has reached the limit! The humidity level is now " + DataDevice.Humidity + "." },
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
  viewChanged(e) {
    this.GetAllInfoDevice(this.metric);
  }

  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 200
    });
    toast.present();
  }
}
