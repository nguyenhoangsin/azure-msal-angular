import { Configuration, LogLevel, BrowserCacheLocation } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    // The 'clientId' should be replaced with the '<CLIENT_ID> from Azure AD app registration
    clientId: '<CLIENT_ID>',
    // The authority URL is the endpoint for Azure AD authentication. Replace with your <TENANT_ID> or a specific authority.
    authority: 'https://login.microsoftonline.com/<TENANT_ID>',
    // The URI where the user will be redirected after successful authentication. Typically this is the home page or dashboard.
    redirectUri: 'http://localhost:4200/home',
  },
  cache: {
    // Cache location to store the authentication state. Use 'localStorage' for long-term persistence.
    cacheLocation: BrowserCacheLocation.LocalStorage,
    // Enable this option if you need to support older browsers that don't support modern web storage.
    storeAuthStateInCookie: false, // Set to true to store the auth state in cookies for compatibility with older browsers
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string) => {
        console.log(message);
      },
      logLevel: LogLevel.Info,
      // Disable Personally Identifiable Information (PII) logging to avoid logging sensitive user information
      piiLoggingEnabled: false, // Set to true to log PII data (disable in production)
    },
  },
};
