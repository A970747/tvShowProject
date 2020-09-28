import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBtt_2ViryDprk5dNwiZzqWYaV8fHTd_K0",
  authDomain: "tvshowsuperlatives.firebaseapp.com",
  databaseURL: "https://tvshowsuperlatives.firebaseio.com",
  projectId: "tvshowsuperlatives",
  storageBucket: "tvshowsuperlatives.appspot.com",
  messagingSenderId: "737126203732",
  appId: "1:737126203732:web:6d32c3814e4e2de65f08c1",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
