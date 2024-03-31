# findMe

A mobile social media guessing game app

## Setup

- First install dependenies using `npm install`
- Install the Ionic plugin for vscode

### Dev

#### Web view

- Run the app with `ionic serve` to view the app in the browser
- Alternatively you can run the web build via the ionic plugin: Run > Web
- Navigate inside your browser to [http://localhost:8100](http://localhost:8100)

#### REMARK: CURRENTLY THE AUTHENTICATION ONLY WORKS IN THE PROGRESSIV WEB APP

-> Use the mobile screen setting provided by chrome dev tools
-> More information about PWA: [https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DAndroid&oco=0](https://support.google.com/chrome/answer/9658361?hl=en&co=GENIE.Platform%3DAndroid&oco=0)

#### Editor Emulator

- Install a mobile emulator plugin to open the app inside an emulator (pass localhost link to emulator)
- Alternatively you can run the Web build inside the editor which will also trigger a mobile preview (navigate to the ... next to the Web Run and select open in editor)

#### Native app with capacitor (Android/IOS)

- Run `ng build`
- Sync ionic with `ionic cap sync` or via the plugin
- To use the native Run commands of the ionic plugin (Android/IOS) it is necessary to install Android Studio and XCode
  - It is possible that your SDK is not defined. Find a help here: [https://stackoverflow.com/questions/27620262/sdk-location-not-found-define-location-with-sdk-dir-in-the-local-properties-fil](https://stackoverflow.com/questions/27620262/sdk-location-not-found-define-location-with-sdk-dir-in-the-local-properties-fil)
