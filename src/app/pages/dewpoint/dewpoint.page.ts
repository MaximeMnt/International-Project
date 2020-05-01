import { StorageService, IexeedEntry } from './../../Services/storage.service';
import { Component, OnInit } from '@angular/core';
import { ChartDataSets } from "chart.js";
import { APIService, IAllDeviceData, IDeviceData } from 'src/app/Services/api.service';
import { DatePipe } from '@angular/common';
import { interval } from 'rxjs';
import { ToastController, Platform } from '@ionic/angular';


@Component({
  selector: 'app-dewpoint',
  templateUrl: './dewpoint.page.html',
  styleUrls: ['./dewpoint.page.scss'],
  providers: [DatePipe]
})
export class DewpointPage implements OnInit {

  chartData: ChartDataSets[] = [{ data: [], label: 'Temperature', fill: false }];
  chartLabels: String[];
  metric: String = "celcius";

  tempRes: IDeviceData[] = [];
  newRes: IDeviceData[] = [];
  tempArray: number[] = [];
  hourArray: String[];
  gemiddeldeArray: number[] = [];
  dataHours: String[] = [];

  tempAantal: number = 0;
  totalTempValue: number = 0;

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
      this.GetAllInfoDevice(this.metric);
      interval(60000).subscribe(x => { //* will execute every 5 seconds
        this.GetAllInfoDevice(this.metric);
      });
     }

  ngOnInit() {
  }

  //T - ((100 - RH)/5)
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
          this.chartData[0].data.push(entry['Temperature'] - ((100 - entry.Humidity)/5));
          this.tempArray.push(entry['Temperature']);
        }
        else {
          this.chartData[0].data.push((entry['Temperature']- ((100 - entry.Humidity)/5) * 1.8) + 32);
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
  typeChanged(e) {
    const on = e.detail.checked;
    this.chartType = on ? 'line' : 'bar';
  }
  viewChanged(e) {
    this.GetAllInfoDevice(this.metric);
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
