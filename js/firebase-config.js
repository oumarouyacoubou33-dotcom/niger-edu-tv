// Shirya Firebase Configuration
// Bayan ka ƙirƙiri Project a console.firebase.google.com, zaka iya sanya ainihin Keys ɗinka anan.
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "niger-edu-tv.firebaseapp.com",
    projectId: "niger-edu-tv",
    storageBucket: "niger-edu-tv.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef123456"
};

// Fara Firebase
firebase.initializeApp(firebaseConfig);

// Kira Firestore Database
const db = firebase.firestore();
