import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { MsalService, MSAL_INSTANCE } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { appConfig } from './app/app.config';
import { msalConfig } from './app/auth-config';
import { AppComponent } from './app/app.component';

// Function to initialize MSAL before bootstrapping the Angular app
async function initializeApp() {
  const msalInstance = new PublicClientApplication(msalConfig);
  // Wait for the MSAL instance to be initialized (only needs to be done once for the app)
  await msalInstance.initialize();
  return msalInstance;
}

// Initialize MSAL and then bootstrap the Angular app
initializeApp().then((msalInstance) => {
  // Bootstrap the Angular app with the provided AppComponent and configurations
  bootstrapApplication(AppComponent, {
    providers: [
      ...appConfig.providers, // Include additional providers from the appConfig
      // Provide the MSAL instance for the app to use
      { provide: MSAL_INSTANCE, useValue: msalInstance },
      MsalService,
    ],
  }).catch((err) => console.error(err));
});
