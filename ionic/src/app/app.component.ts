import { Component, ViewChild, Renderer, ChangeDetectorRef,NgModule } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LiveUpdateProvider } from "../providers/live-update/live-update";

@Component({
  templateUrl: 'app.html'
})

@NgModule({
  providers: [
      LiveUpdateProvider
  ]
})


export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private renderer: Renderer, private cdr: ChangeDetectorRef,private liveUpdateService:LiveUpdateProvider) {
    renderer.listenGlobal('document', 'mfpjsloaded', () => {
      this.initializeApp(renderer, cdr);
    });

    
    renderer.listenGlobal('document', 'mfpjsloaded', () => {
      this.initializeLiveUpdate();
    });
    
    renderer.listenGlobal('document', 'mfpjsloaded', () => {
      WL.Analytics.enable();
    });
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }
    ];

  }

  initializeApp(renderer, cdr) {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.rootPage = HomePage;
      cdr.detectChanges();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initializePush();
    });
  }

  initializeLiveUpdate() {
    LiveUpdateManager.obtainConfiguration( { useClientCache: false }, function(configuration) {
        var liveUpdateText = 'LiveUpdate schema: ' + JSON.stringify({
          ...configuration.properties,
          ...configuration.features
        });
        var statusElement = <HTMLElement>(
          document.querySelector('[studio-id="home_Label_1150"]')
        );        
        statusElement.textContent = liveUpdateText;
      }, function(error) {
        var statusElement = <HTMLElement>(
          document.querySelector('[studio-id="home_Label_1150"]')
        );           
        statusElement.textContent = 'Failed to obtain live update configuration';
      }            
    );
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  initializePush() {
    if (this.platform.is("ios") || this.platform.is("android")) {
      MFPPush.initialize(
        function(successResponse) {
          MFPPush.registerNotificationsCallback(notificationReceived);
          WLAuthorizationManager.obtainAccessToken("push.mobileclient").then(
            function(accessToken) {
              MFPPush.registerDevice(null, successCallback, failureCallback);
            });
        },
        function(failureResponse) {
          var statusElement = <HTMLElement>(
            document.querySelector('[studio-id="home_Label_1150"]')
          );            
          statusElement.textContent = 'Failed to initialize Push';
        }
      );
    }
  }
}
declare let MFPPush: any;
let notificationReceived = function(message) {
  var statusElement = <HTMLElement>(
    document.querySelector('[studio-id="home_Label_1150"]')
  );    
  if (message.alert.body !== undefined) {
    statusElement.textContent = 'Received notification: ' + message.alert.body;
  } else {
    statusElement.textContent = 'Received notification: ' + message.alert;
  }
};
let successCallback = function(response) {
  var statusElement = <HTMLElement>(
    document.querySelector('[studio-id="home_Label_1150"]')
  );            
  statusElement.textContent = 'Device successfully registered for push';    
};
let failureCallback = function(response) {
  var statusElement = <HTMLElement>(
    document.querySelector('[studio-id="home_Label_1150"]')
  );            
  statusElement.textContent = 'Failed to register the device for push'; 
};
