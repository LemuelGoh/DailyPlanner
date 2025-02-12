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
                const fbID = doc.id; // 获取反馈文档的唯一 ID

                const feedbackItem = document.createElement("div");
                feedbackItem.classList.add("feedback-item");

                feedbackItem.innerHTML = `
                <div class="feedback-header">
                    <h4>${data.email}</h4>
                    <span class="feedback-date">${new Date().toLocaleDateString()}</span>
                </div>
                <p class="feedback-text">${data.feedback}</p>
                <div class="feedback-actions">
                    <button class="like-btn">👍 Like <span class="like-count">0</span></button>
                    <button class="reply-btn option-button">💬 Reply</button>
                </div>
                <div class="reply-section" style="display: none;">
                    <textarea class="reply-input" placeholder="Write a reply..."></textarea>
                    <button class="submit-reply" fbID="${doc.id}">Send</button>
                </div>
                <button class="show-btn" data-fbID="${doc.id}">Show Replies</button>
                <div id="replies-container-${doc.id}" class="replies-container" style="display: none;"></div>
            `;



                allFeedbackContainer.appendChild(feedbackItem);
            });

            activateInteraction();

        } catch (error) {
            console.error("Error loading feedback: ", error);
        }
    }
});

function activateInteraction() {
    document.querySelectorAll(".reply-btn").forEach(button => {
        button.addEventListener("click", function () {
            let replySection = this.parentElement.nextElementSibling;
            replySection.style.display = replySection.style.display === "flex" ? "none" : "flex";
        });
    });

    document.querySelectorAll(".submit-reply").forEach(button => {
        button.addEventListener("click", async function () {
            let replyInput = this.previousElementSibling;
            let feedbackId = this.getAttribute("fbID");

            if (replyInput.value.trim() !== "") {
                let replyText = replyInput.value;

                try {
                    // 将回复添加到单独的 `replies` 集合
                    await db.collection("replies").add({
                        feedbackId: feedbackId,
                        replyText: replyText,
                        repliedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        email: localStorage.getItem("loggedInUser")
                    });

                    // 更新 `feedback` 文档中的 `repliesCount`
                    await db.collection("feedback").doc(feedbackId).update({
                        repliesCount: firebase.firestore.FieldValue.increment(1)
                    });

                    alert("Reply Sent: " + replyText);
                    replyInput.value = ""; // 清空输入框
                } catch (error) {
                    console.error("Error sending reply: ", error);
                    alert("Error submitting reply.");
                }
            } else {
                alert("Reply cannot be empty!");
            }
        });
    });

    document.querySelectorAll(".show-btn").forEach(button => {
        button.addEventListener("click", function () {
            let fbID = this.getAttribute("data-fbID");
            let repliesContainer = document.getElementById(`replies-container-${fbID}`);
            repliesContainer.style.display = "block";  
            displayReplies(fbID); 
        });
    });
}


async function displayReplies(fbID) {
    const repliesContainer = document.getElementById(`replies-container-${fbID}`);
    repliesContainer.innerHTML = ""; 

    console.log("Fetching replies for feedback ID:", fbID);

    try {
        const repliesSnapshot = await db.collection("replies")
            .where("feedbackId", "==", fbID)
            .orderBy("repliedAt", "asc")
            .get();

        console.log("Replies found:", repliesSnapshot.size);

        repliesSnapshot.forEach((doc) => {
            const replyData = doc.data();
            const replyText = replyData.replyText;
            const repliedAt = new Date(replyData.repliedAt.seconds * 1000).toLocaleString();

            console.log("Reply:", replyText, "Replied at:", repliedAt);

            repliesContainer.innerHTML += `
                <div class="reply-item">
                    <p><strong>${replyText}</strong></p>
                    <p><em>Replied at: ${repliedAt}</em></p>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching replies:", error);
    }
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

