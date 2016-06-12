App.info({
  id: 'uk.kuip.rosetta',
  name: 'Rosetta',
  version: "0.1.1",
  description: 'Crowdsourced translations app',
  author: 'Kuip Limited',
  email: 'kuip.ltd@gmail.com',
  website: 'http://www.kuip.co.uk/'
});

App.icons({
  'android_mdpi': 'public/mobile-icons/rosetta48.png',// (48x48)
  'android_hdpi': 'public/mobile-icons/rosetta72.png',// (72x72)
  'android_xhdpi': 'public/mobile-icons/rosetta96.png',// (96x96)
  'android_xxhdpi': 'public/mobile-icons/rosetta144.png',// (144x144)
  'android_xxxhdpi': 'public/mobile-icons/rosetta192.png'// (192x192)
});

/*App.launchScreens({
  'iphone': 'splash/Default~iphone.png',
  'iphone_2x': 'splash/Default@2x~iphone.png',
});*/

// Set PhoneGap/Cordova preferences
// App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'all', 'ios');

