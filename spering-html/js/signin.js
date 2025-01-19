import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, query, where } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyCbQM3aHC_WuHOHhnXQX6o24gm1wMK1oG0",
authDomain: "planlah-567bc.firebaseapp.com",
projectId: "planlah-567bc",
storageBucket: "planlah-567bc.firebasestorage.app",
messagingSenderId: "28284816915",
appId: "1:28284816915:web:dbf814a6deda4e899f39e6",
measurementId: "G-GFT6LV5GZT",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


document.getElementById("login-form").addEventListener("submit", async (e) => {
e.preventDefault();

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

try {
const usersRef = collection(db, "users");
const q = query(usersRef, where("email", "==", email), where("password", "==", password));
const querySnapshot = await getDocs(q);

if (!querySnapshot.empty) {
  alert("Login successful!");
  window.location.href = "user.html"; 
} else {
  alert("Invalid email or password.");
}
} catch (error) {
console.error("Error during login:", error);
alert("Login failed: " + error.message);
}
});