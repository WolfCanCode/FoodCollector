import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCB1hDVWIjFU7aikSCtnQP8lL2XPdaU_8M",
    authDomain: "foodcollector-o2f.firebaseapp.com",
    databaseURL: "https://foodcollector-o2f.firebaseio.com",
    projectId: "foodcollector-o2f",
    storageBucket: "foodcollector-o2f.appspot.com",
    messagingSenderId: "501313351376"
  };
  firebase.initializeApp(config);
  
  export default firebase;