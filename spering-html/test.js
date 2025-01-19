const firebaseConfig = {
    apiKey: "AIzaSyBWjAORM7PQcajmL_WW2CU0DjbkycssMU4",
    authDomain: "dailyplannertest.firebaseapp.com",
    databaseURL: "https://dailyplannertest-default-rtdb.firebaseio.com",
    projectId: "dailyplannertest",
    storageBucket: "dailyplannertest.firebasestorage.app",
    messagingSenderId: "323718535688",
    appId: "1:323718535688:web:2ad12a1dcbfd1627358fbd"
  };


// INITIALIZE DATABASE
firebaseConfig.initializeApp(firebaseConfig);

// REFERENCE DATABASE
var testDB = firebase.database().ref("testDB")

document.getElementById('login-form').addEventListener('submit', submitForm)

function submitForm(e){
    e.preventDefault()
    var email = document.getElementVal('email').value
    var password = document.getElementVal('password').value

    console.log(email, password)
}

const getElementVal = (id) => {
    return document.getElementById(id).value
}
