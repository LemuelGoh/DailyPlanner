import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCbQM3aHC_WuHOHhnXQX6o24gm1wMK1oG0",
    authDomain: "planlah-567bc.firebaseapp.com",
    projectId: "planlah-567bc",
    storageBucket: "planlah-567bc.firebasestorage.app",
    messagingSenderId: "28284816915",
    appId: "1:28284816915:web:dbf814a6deda4e899f39e6",
    measurementId: "G-GFT6LV5GZT"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getCities() {
  const citiesCol = collection(db, 'user');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  console.log(cityList);
}

getCities();
