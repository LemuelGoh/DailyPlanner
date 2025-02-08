const firebaseConfig = {
    apiKey: "AIzaSyDvQKch6kMq9J8KffpuiogfDoaOUAk8aWo",
    authDomain: "planlah-16aef.firebaseapp.com",
    projectId: "planlah-16aef",
    storageBucket: "planlah-16aef.firebasestorage.app",
    messagingSenderId: "638721515088",
    appId: "1:638721515088:web:9f4208ac42875abcacfb55"
};

  // 初始化 Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  document.addEventListener("DOMContentLoaded", async function () {
    const carouselInner = document.getElementById("feedback-container");
  
    try {
      const querySnapshot = await db.collection("feedback").get();
      let isFirst = true;
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
  
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");
        if (isFirst) {
          carouselItem.classList.add("active");
          isFirst = false;
        }
  
        carouselItem.innerHTML = `
          <div class="detail-box">
            <h4>${data.email}</h4>
            <p>${data.feedback}</p>
            <button class="option-button checkAllBtn">Check All</button>
          </div>
        `;
  
        carouselInner.appendChild(carouselItem);
      });
  
      const checkAllButtons = document.querySelectorAll('.checkAllBtn');
      checkAllButtons.forEach(button => {
        button.addEventListener('click', () => {
          window.location.href = 'helpdesk.html';
        });
      });
  
    } catch (error) {
      console.error("feedback error: ", error);
    }
  });

  document.addEventListener("DOMContentLoaded", async function () {
    const allFeedbackContainer = document.getElementById("all-feedback-container");
  
    try {
      const querySnapshot = await db.collection("feedback").get();
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
  
        const feedbackItem = document.createElement("div");
        feedbackItem.classList.add("feedback-item");
  
        feedbackItem.innerHTML = `
          <div class="detail-box">
            <h4>${data.email}</h4>
            <p>${data.feedback}</p>
          </div>
        `;
  
        allFeedbackContainer.appendChild(feedbackItem);
      });
  
    } catch (error) {
      console.error("Error loading feedback: ", error);
    }
  });


  document.getElementById("goback-btn").addEventListener('click', function() {
    window.location.href = 'index.html';
  });


