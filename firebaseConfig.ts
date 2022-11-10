import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
//import {...} from "firebase/auth";
//import {...} from "firebase/database";
//import {...} from "firebase/firestore";
//import {...} from "firebase/functions";
//import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAgSNvjEDbdvbpjbQUzTg5Eo8_cE_mcgKI',
  authDomain: '393255033286-fh35jrnm1keu0jnq36fmki5u84aochf8.apps.googleusercontent.com',
  databaseURL: 'https://nlwcopamoble.firebaseio.com',
  projectId: 'nlwcopamoble',
  storageBucket: 'nlwcopamoble.appspot.com',
  messagingSenderId: 'sender-id',
  appId: '1:393255033286:android:dc700ea0f4112f20ecbac7',
  measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);