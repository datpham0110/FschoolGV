// export const appConfig = {
//   defaultLang: "vi",
//   defaultLangName: "Việt Nam",
//   appToken: "",
//   version: "Test 1.0.6-Test",
//   Version: 99,
//   onesignalID: "34af88ab-4edd-4758-8de7-180e42aea2b9",

//   domain: "http://apibyc.bookve.com.vn/",             // Test
//   domainImage: 'http://apibyc.bookve.com.vn/',        // Test
//   domainImageChat: 'http://apiys.bookve.com.vn/'      // Test

//   // domain: "http://apibyc.yschool.vn/",             // GoLive
//   // domainImage: 'http://apiys.yschool.vn/',          // Golive
//   // domainImageChat: 'http://apiys.yschool.vn/'      // Golive
// };

import * as firebase from 'firebase';

export const appConfig = {
  apiKey: "AIzaSyD9OrfosiC9RzAyHb--heBd_3p8mWU9OG4",
  authDomain: "fshool-project.firebaseapp.com",
  databaseURL: "https://fshool-project.firebaseio.com",
  projectId: "fshool-project",
  storageBucket: "fshool-project.appspot.com",
  messagingSenderId: "775779792702",
  appId: "1:775779792702:web:ba5325e3d7ae6fd3169e6f",
  measurementId: "G-SC2EQ1BL5R"
};

export const db = firebase.initializeApp(appConfig);
