import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, setPersistence, 
  browserSessionPersistence, onAuthStateChanged,
   signOut, inMemoryPersistence, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc  } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyB0niTxx_m8nXbtgIX4ge_YTssyoTr7-88",
  authDomain: "repa-corporation.firebaseapp.com",
  projectId: "repa-corporation",
  storageBucket: "repa-corporation.appspot.com",
  messagingSenderId: "1091853088098",
  appId: "1:1091853088098:web:f852af6d7e5c07e059283b",
  measurementId: "G-NZ06DH4BT7"
};

// Providers
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);
auth.languageCode = 'en';
//--------




const submitBTN = document.getElementById('submitBTN');

async function addUser(data) {
  try {
    // Add a new document with data to the "users" collection
    const docRef = await addDoc(collection(db, "users"), data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

submitBTN.addEventListener('click', (e) =>{

    //getting the data
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const username = document.getElementById('username').value;

    if(!(password == confirmPassword)){
        alert("Password is not the same!");
      return
    }

    const phoneNumber = document.getElementById('phoneNumber').value;
    const departmentDropdown = document.getElementById('departmentDropdown').value;
    const courseDropdown = document.getElementById('courseDropdown').value;
    //---

console.log("MEMEMEMEMEMEL: ", departmentDropdown, " ", courseDropdown);

    createUserWithEmailAndPassword  (auth, email, password)
    .then((userCredential) => {
        alert("Registered succesfully");
        window.location.href='/';

        // Signed up 
        //add data for firestore

        addUser({
          email: email,
          username: username,
          phonenumber: phoneNumber,
          department: departmentDropdown,
          course: courseDropdown,
        })
         

        const user = userCredential.user;
        // email = email;
        // password = password;
        // ...
        console.log(user);
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === 'auth/email-already-in-use') {
            alert("Email already exists!");
        } else {
            alert(`Error: ${errorMessage}`);
        }
        // ..
    });

})




//login
const LsubmitBTN = document.getElementById('LsubmitBTN');
LsubmitBTN.addEventListener('click', (e)=>{
  const email = document.getElementById('Lemail').value;
   const password = document.getElementById('Lpassword').value;

   if(password.length == 0){
    alert("Password missing please try again");
    return;
   }

    console.log(email, password);
   signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user; 
    alert('logged in successfully');
    window.location.href='/'

    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

    if(errorCode === 'auth/invalid-login-credentials'){
        alert(errorMessage)
    }else{
        if(errorCode === 'auth/invalid-email'){
          alert("Invalid Email pulease try again");
        }else{
          alert(errorMessage);
        }
    }
    
  });
})



  onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, you can get their details
        const uid = user.uid;
        const token = user.accessToken;

        //temp
  const namehere = document.getElementById('namehere').innerHTML = user.email ;
    } else {
        // No user is signed in
        console.log("No user is signed in.");
    }
});

//Memory persistence


const logout = document.getElementById('signOut');

logout.addEventListener('click', (e) =>{
    window.location.href='/';
    signOut(auth).then(() => {
      alert("SIGNED OUT")
    }).catch((error) => {
      // An error happened.
      console.log(err);
    });
})




