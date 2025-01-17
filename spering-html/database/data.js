// Import Firebase functions (if using modules, skip for CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// 替换为您的 Firebase 配置信息
const firebaseConfig = {
    apiKey: "AIzaSyCbQM3aHC_WuHOHhnXQX6o24gm1wMK1oG0",
    authDomain: "planlah-567bc.firebaseapp.com",
    projectId: "planlah-567bc",
    storageBucket: "planlah-567bc.firebasestorage.app",
    messagingSenderId: "28284816915",
    appId: "1:28284816915:web:dbf814a6deda4e899f39e6",
    measurementId: "G-GFT6LV5GZT"
  };

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 示例：从 Firestore 获取数据
async function getCities() {
  const citiesCol = collection(db, 'user');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  console.log(cityList); // 打印数据到控制台
}

// 调用函数
getCities();
