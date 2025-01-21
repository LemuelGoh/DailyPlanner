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

  
    async function fetchUsers() {
    const userList = document.getElementById("user-list");
    userList.innerHTML = "<p>Loading...</p>"; 

    try {
      const querySnapshot = await db.collection("users").get(); 
      userList.innerHTML = ""; 

      querySnapshot.forEach((doc) => {
        const user = doc.data(); 
        const userItem = document.createElement("div");
        userItem.className = "user-item";
        userItem.innerHTML = `<i class="fa fa-user-circle"></i> ${user.email}`;
        userItem.addEventListener("click", () => showUserDetails(doc.id));
        userList.appendChild(userItem); 
      });
    } catch (error) {
      console.error("erreo:", error);
      userList.innerHTML = "<p>error。</p>";
    }
  }

  async function showUserDetails(userId) {
    const userDetails = document.getElementById("user-details");
    userDetails.innerHTML = "<p>Loading...</p>";
  
    try {
      const userDoc = await db.collection("users").doc(userId).get();
      if (userDoc.exists) {
        const user = userDoc.data();
        userDetails.innerHTML = `
          <h3>${user.name || "Unknown"}</h3>
          <p>Email: ${user.email}</p>
          <p>status: ${user.status || "N/A"}</p>
          
        `;
      } else {
        userDetails.innerHTML = "<p>User not found.</p>";
      }
    } catch (error) {
      console.error(":", error);
      userDetails.innerHTML = "<p></p>";
    }
  }
  

  function showUsers() {
    
    db.collection("online_users")
      .where("isOnline", "==", true) 
      .onSnapshot((snapshot) => {
        const onlineCount = snapshot.size; 
        document.getElementById("online-users-count").innerText = onlineCount; // 更新页面状态框
  
      });
  }
  
  fetchUsers();
  showUsers();
  showUserDetails();
