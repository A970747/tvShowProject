import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDgcuF0Mp4iC3JyE0MMsm2P1MpcCwmKZAg",
  authDomain: "tvshowproject-aa1f7.firebaseapp.com",
  databaseURL: "https://tvshowproject-aa1f7.firebaseio.com",
  projectId: "tvshowproject-aa1f7",
  storageBucket: "tvshowproject-aa1f7.appspot.com",
  messagingSenderId: "427924246136",
  appId: "1:427924246136:web:b1950431e8829e72d0678d"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
