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

  async function showUserDetails(userID) {
    const userDetails = document.getElementById("user-details");
    userDetails.innerHTML = "<p>Loading...</p>";
  
    try {
      const userDoc = await db.collection("users").doc(userID).get();
      if (userDoc.exists) {
        const user = userDoc.data();
        userDetails.innerHTML = `
        
          <p>Email: ${user.email}</p>
          <p>status: ${user.status || "N/A"}</p>
          
        `;
      } else {
        userDetails.innerHTML = "<p>User not found.</p>";
      }
    } catch (error) {
      userDetails.innerHTML = "<p>cant load data</p>";
    }
  }
  

  function showUsers() {
    
    db.collection("online_users")
      .where("isOnline", "==", true) 
      .onSnapshot((snapshot) => {
        const onlineCount = snapshot.size; 
        document.getElementById("online-users-count").innerText = onlineCount; 
      });
  }
  let feedbackData = [];

  function showEmails(data) {
    
    const userDetails = document.getElementById('user-details');
    userDetails.innerHTML = '<h3>User Emails</h3>';
    feedbackData.forEach((user) => {
      const emailItem = document.createElement('div');
      emailItem.className = 'email-item';
      emailItem.innerHTML = `<p>${user.email}</p>`;
      emailItem.addEventListener('click', () => showFeedback(user)); 
    });
  }

  async function checkFeedback() {
    const userDetails = document.getElementById("user-details");
    const feedbackButton = document.getElementById("feedback-btn");
  
    feedbackButton.addEventListener("click", async () => {
      userDetails.innerHTML = "<h3>Loading Emails...</h3>";
      feedbackData = []; 
  
      try {
        const querySnapshot = await db.collection("feedback").get();
        userDetails.innerHTML = "<h3>User Emails</h3>";
  
        querySnapshot.forEach((doc) => {
          const feedback = doc.data();
          feedbackData.push(feedback); 
  
          const emailItem = document.createElement("div");
          emailItem.className = "email-item";
          emailItem.innerHTML = `<p>${feedback.email}</p>`;
          emailItem.addEventListener("click", () => showFeedback(feedback));
          userDetails.appendChild(emailItem);
        });
      } catch (error) {
        console.error("Error loading feedback:", error);
        userDetails.innerHTML = "<p>Error loading email data.</p>";
      }
    });
  }
  
  function showFeedbackNum() {
    db.collection("feedback").onSnapshot((snapshot) => {
      const feedbackCount = snapshot.size; // get feedback
      document.getElementById("feedback-count").innerText = feedbackCount; 
    });
  }
  
  function showFeedback(feedback) {
    const userDetails = document.getElementById("user-details");
    userDetails.innerHTML = `
      <h3>User Feedback</h3>
      <p><strong>Email:</strong> ${feedback. email}</p>
      <p><strong>Feedback:</strong> ${feedback.feedback}</p>
      <p><strong>Feedback time:</strong> ${feedback.createdAt.toDate().toLocaleString()}</p>
      <button id="back-to-emails" class="back-to-emails-btn">Back to Emails</button>
    `;
  
    document
      .getElementById("back-to-emails")
      .addEventListener("click", () => {
        // show J8email
        userDetails.innerHTML = "<h3>Loading Emails...</h3>";
  
        db.collection("feedback")
          .get()
          .then((querySnapshot) => {
            userDetails.innerHTML = "<h3>User Emails</h3>";
  
            querySnapshot.forEach((doc) => {
              const feedback = doc.data();
  
              const emailItem = document.createElement("div");
              emailItem.className = "email-item";
              emailItem.innerHTML = `<p>${feedback.email}</p>`;
              emailItem.addEventListener("click", () => showFeedback(feedback));
              userDetails.appendChild(emailItem);
            });
          })
          .catch((error) => {
            console.error("Error loading feedback:", error);
            userDetails.innerHTML = "<p>Error loading email data.</p>";
          });
      });
  }

  function showPendingNum() {
    db.collection("requestrolll").onSnapshot((snapshot) => {
      const pendingCount = snapshot.size;//get num
      document.getElementById("pending-count").innerText = pendingCount; 
    });
  }
  
  async function requestRollback(userEmail) {
    try {
      await db.collection("requestrolll").add({
        email: userEmail,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        status: "Pending",
      });
      alert("Roll back request submitted!");
    } catch (error) {
      console.error("Error requesting roll back:", error);
      alert("Failed to submit roll back request.");
    }
  }
  
  async function fetchEmails() {
    const userDetails = document.getElementById("user-details");
    userDetails.innerHTML = "<p>Loading emails...</p>";
  
    try {
      const emailSnapshot = await db.collection("requestrolll").get();
      userDetails.innerHTML = "<h3>User Emails</h3>";
  
      emailSnapshot.forEach((doc) => {
        const request = doc.data();
        const emailItem = document.createElement("div");
        emailItem.className = "email-item";
        emailItem.innerHTML = `<p>${request.email}</p>`;
        emailItem.addEventListener("click", () => {
          fetchRollbackRequests(request.email); 
        });
        userDetails.appendChild(emailItem);
      });
    } catch (error) {
      console.error("Error loading user emails:", error);
      userDetails.innerHTML = "<p>Error loading emails.</p>";
    }
  }
  
  async function fetchRollbackRequests(userEmail) {
    const userDetails = document.getElementById("user-details");
    userDetails.innerHTML = "<p>Loading...</p>";
  
    try {
      const querySnapshot = await db.collection("requestrolll").where("email", "==", userEmail).get();
      userDetails.innerHTML = "<h3>Pending Requests</h3>";
  
      querySnapshot.forEach((doc) => {
        const request = doc.data();
        const requestItem = document.createElement("div");
        requestItem.className = "request-item";
        requestItem.innerHTML = `
          <p>Email: ${request.email}</p>
          <p>Status: ${request.status}</p>
          <p><strong>Request time:</strong> ${request.requestdata.toDate().toLocaleString()}</p>
          <button onclick="approveRollback('${doc.id}', '${request.email}')" class="approve-btn">Approve</button>
          <button onclick="rejectRollback('${doc.id}')" class="reject-btn">Reject</button>
          <button id="back-to-emails" class="back-to-emails-btn">Back to Emails</button>
        `;
  
        userDetails.appendChild(requestItem);
      });
  
      
      const backToEmailsButton = document.getElementById("back-to-emails");
      if (backToEmailsButton) {
        backToEmailsButton.addEventListener("click", () => {
          userDetails.innerHTML = "<h3>Loading Emails...</h3>";
          fetchEmails(); 
        });
      }
  
    } catch (error) {
      console.error("Error fetching rollback requests:", error);
      userDetails.innerHTML = "<p>Error loading requests.</p>";
    }
  }
  
  

  const showButton = document.getElementById("show");
  if (showButton) {
    showButton.addEventListener("click", fetchEmails);
  }
  
  
  
  async function approveRollback(requestId, userEmail) {
    try {
      const backupDoc = await db.collection("backup").doc(userEmail).get();
      if (!backupDoc.exists) {
        alert(`Backup data for ${userEmail} not found.`);
        return;
      }
  
      const backupData = backupDoc.data();
  
      await db.collection("profile").doc(userEmail).set(backupData);
      await db.collection("requestrolll").doc(requestId).update({
        status: "Approved",
      });
  
      alert("Rollback successful!");
    } catch (error) {
      console.error("Error during rollback:", error);
      alert("Failed to approve rollback.");
    }
  }
  
  
  async function rejectRollback(requestId) {
    try {
      await db.collection("requestrolll").doc(requestId).update({
        status: "Rejected",
      });
      alert("Rollback request rejected.");
      fetchRollbackRequests(); // 刷新列表
    } catch (error) {
      console.error("Error rejecting rollback:", error);
      alert("Failed to reject rollback.");
    }
  }
  

  fetchUsers();
  showUsers();
  showUserDetails();
  checkFeedback();
  showEmails(feedbackData);
  showFeedbackNum();
  showPendingNum();
  showFeedback();
 
