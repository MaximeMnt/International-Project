import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages = [
    {
      title: 'General',
      url: '/menu/general'
    },
    {
      title: 'Temperature',
      url: '/menu/temperature'
    },
    {
      title: 'Humidity',
      url: '/menu/humidity'
    },
    {
      title: 'Moisture',
      url: '/menu/moisture'
    },
    {
      title: 'Dew Point',
      url: '/menu/dewpoint'
    },
    {
      title: 'Settings',
      url: '/menu/settings'
    }
  ];

  selectedPath = '';
  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    })
  }
  ngOnInit() {
  }
}
