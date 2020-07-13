import { Component, Renderer, NgZone } from "@angular/core";
import { NavController, ModalController } from "ionic-angular";
import { DataStore } from "../../app/dataStore";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  constructor(public navCtrl: NavController,public renderer:Renderer, public dataStore: DataStore) {
  }

  ionViewDidLoad() {
    this.mfConnect();
    this.mfAnalyticsInit();
  }

  changeStatusText(message) {
    var statusElement = (<HTMLElement>(document.querySelector('[studio-id="home_Label_1150"]')));
    statusElement.textContent = message;
  }

  mfConnect() {
    WLAuthorizationManager.obtainAccessToken('').then(this.connectSuccess, this.connectFailed);
  }

  connectSuccess = (accessToken) => {
    this.changeStatusText("Connected to MobileFirst Server");
  }

  connectFailed = (error) => {
    this.changeStatusText("Failed to connect to MobileFirst Server");
  }


  mfAnalyticsInit () {
    WL.Analytics.log('App started successfully...', 'SampleAppIonic');
    WL.Analytics.send();

    var logger = WL.Logger.create({ pkg: 'com.demo.push.d' });
    logger.debug('App started successfully...');
    WL.Logger.send();
  }
}
