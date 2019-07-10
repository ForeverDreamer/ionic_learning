import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'my-teams',
      url: '/my-teams',
      icon: 'list'
    },
    {
      title: 'tournaments',
      url: '/tournaments',
      icon: 'list'
    },
    {
      title: 'teams',
      url: '/teams',
      icon: 'list'
    },
    {
      title: 'team-detail',
      url: '/team-detail',
      icon: 'list'
    },
    {
      title: 'game',
      url: '/game',
      icon: 'list'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
