const firebaseConfig = {
    apiKey: "AIzaSyDvQKch6kMq9J8KffpuiogfDoaOUAk8aWo",
    authDomain: "planlah-16aef.firebaseapp.com",
    projectId: "planlah-16aef",
    storageBucket: "planlah-16aef.firebasestorage.app",
    messagingSenderId: "638721515088",
    appId: "1:638721515088:web:9f4208ac42875abcacfb55"
};

// INITIALIZE DATABASE
firebase.initializeApp(firebaseConfig);


// Reference Firestore Database
var db = firebase.firestore(firebase);


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
  localStorage.setItem('loggedInUser', email);
  localStorage.setItem('loginStatus', 'loggedIn');
  window.location.href = "user.html"; 
} else {
  alert("Invalid email or password.");
}
} catch (error) {
console.error("Error during login:", error);
alert("Login failed: " + error.message);
}
});