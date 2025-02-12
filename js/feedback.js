const firebaseConfig = {
  apiKey: "AIzaSyDvQKch6kMq9J8KffpuiogfDoaOUAk8aWo",
  authDomain: "planlah-16aef.firebaseapp.com",
  projectId: "planlah-16aef",
  storageBucket: "planlah-16aef.firebasestorage.app",
  messagingSenderId: "638721515088",
  appId: "1:638721515088:web:9f4208ac42875abcacfb55"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ Slideshow Feedback for `index.html`
document.addEventListener("DOMContentLoaded", async function () {
  const carouselInner = document.getElementById("feedback-container");

  if (carouselInner) {
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

          // Add event listener to buttons
          const checkAllButtons = document.querySelectorAll('.checkAllBtn');
          checkAllButtons.forEach(button => {
              button.addEventListener('click', () => {
                  window.location.href = 'helpdesk.html';
              });
          });

      } catch (error) {
          console.error("Feedback error: ", error);
      }
  }
});

// ✅ Improved Feedback Display for `helpdesk.html` or other pages
document.addEventListener("DOMContentLoaded", async function () {
  const allFeedbackContainer = document.getElementById("all-feedback-container");

  if (allFeedbackContainer) {
      try {
          const querySnapshot = await db.collection("feedback").get();

          querySnapshot.forEach((doc) => {
              const data = doc.data();

              const feedbackItem = document.createElement("div");
              feedbackItem.classList.add("feedback-item");

              feedbackItem.innerHTML = `
                  <div class="feedback-header">
                      <img src="images/6522516.png" class="feedback-avatar" alt="User">
                      <div class="user-info">
                          <h4>${data.email}</h4>
                          <span class="feedback-date">${new Date().toLocaleDateString()}</span>
                      </div>
                  </div>
                  <p class="feedback-text">${data.feedback}</p>
                  <div class="feedback-actions">
                      <button class="like-btn">👍 Like <span class="like-count">0</span></button>
                      <button class="reply-btn option-button">💬 Reply</button>
                  </div>
                  <div class="reply-section" style="display: none;">
                      <textarea class="reply-input" placeholder="Write a reply..."></textarea>
                      <button class="submit-reply">Send</button>
                  </div>
              `;

              allFeedbackContainer.appendChild(feedbackItem);
          });

          // Activate interactions
          activateInteraction();

      } catch (error) {
          console.error("Error loading feedback: ", error);
      }
  }
});

// ✅ Function to enable Like & Reply Features
function activateInteraction() {
  const likeButtons = document.querySelectorAll(".like-btn");
  const replyButtons = document.querySelectorAll(".reply-btn");
  const submitReplyButtons = document.querySelectorAll(".submit-reply");

  // Like Button Click Event
  likeButtons.forEach(button => {
      button.addEventListener("click", function () {
          let count = this.querySelector(".like-count");
          count.textContent = parseInt(count.textContent) + 1;
      });
  });

  // Reply Button Click Event
  replyButtons.forEach(button => {
      button.addEventListener("click", function () {
          let replySection = this.parentElement.nextElementSibling;
          replySection.style.display = replySection.style.display === "flex" ? "none" : "flex";
      });
  });

  // Submit Reply
  submitReplyButtons.forEach(button => {
      button.addEventListener("click", function () {
          let replyInput = this.previousElementSibling;
          if (replyInput.value.trim() !== "") {
              alert("Reply Sent: " + replyInput.value);
              replyInput.value = "";
          }
      });
  });
}

// ✅ Ensure "Go Back" button only works if it exists
document.addEventListener("DOMContentLoaded", function () {
  const goBackBtn = document.getElementById("goback-btn");
  if (goBackBtn) {
      goBackBtn.addEventListener('click', function () {
          window.location.href = 'index.html';
      });
  }
});
