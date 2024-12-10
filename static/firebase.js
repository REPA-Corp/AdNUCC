import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, onAuthStateChanged,
   signOut  } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDoc, doc  } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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



//login and reg

// const submitBTN = document.getElementById('submitBTN');


// submitBTN.addEventListener('click', (e) =>{

//     //getting the data
//     let email = document.getElementById('email').value;
//     let password = document.getElementById('password').value;
//     const confirmPassword = document.getElementById('confirmPassword').value;
//     const username = document.getElementById('username').value;

//     if(!(password == confirmPassword)){
//         alert("Password is not the same!");
//       return
//     }

//     const phoneNumber = document.getElementById('phoneNumber').value;
//     const departmentDropdown = document.getElementById('departmentDropdown').value;
//     const courseDropdown = document.getElementById('courseDropdown').value;
//     //---

//     createUserWithEmailAndPassword  (auth, email, password)
//     .then((userCredential) => {
//         alert("Registered succesfully");
//         window.location.href='/';

//         // Signed up 
//         //add data for firestore

//         addUser({
//           email: email,
//           username: username,
//           phonenumber: phoneNumber,
//           department: departmentDropdown,
//           course: courseDropdown,
//         })
         

//         const user = userCredential.user;

//         console.log(user);
//     })
//     .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;

//         if (errorCode === 'auth/email-already-in-use') {
//             alert("Email already exists!");
//         } else {
//             alert(`Error: ${errorMessage}`);
//         }
//         // ..
//     });

// })




//login
try{
  const log = document.getElementById('log').addEventListener('submit', async (e)=>{
    e.preventDefault();

    const email = document.getElementById('Lemail').value;
     const password = document.getElementById('Lpassword').value;
  
     if(password.length == 0){
      alert("Password missing please try again");
      return;
     }
  
      console.log(email, password);
     signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) =>  {
      // Signed in 
      const user = userCredential.user; 
      const token =  await user.getIdToken();
      

      await  fetch('/login', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({token:token})
        })
        .then(res => res.json())
        .then(res => {
          console.log(res);
          window.location.href= res.redirect;
        })
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
}catch(err){
  console.log(err);
}



try{
  onAuthStateChanged(auth, async(user) => {
    const uNotLogged = document.getElementById('uNotLogged');
    const uLogged = document.getElementById('uLogged')




    if (user) {
        // User is signed in, you can get their details
        const uid = user.uid;
      const token = await user.getIdToken(true);  // Wait for token to be ready
      const path =  window.location.href;
      const pathFiltering =  window.location.href;
      console.log("ASDSADAS: " ,  pathFiltering);

      const parts = pathFiltering.split('/');
      const course = parts[6]; // 'BSCS'
      console.log("AAAA", course);


      // Fetch the document
              try {
                // Reference to the document
                const docRefFiltering = doc(db, 'subjects', course);

                // Fetch the document
                const docSnap = await getDoc(docRefFiltering);
                console.log("SDADSAFGK", docSnap.data());
                if (docSnap.exists()) {
                  const collegeList = docSnap.data().collegeList;
                    console.log("Document qweqweqwewqeqwewqeqw:", docSnap.data());
                    console.log('DSADSA', collegeList);

              // Getting a specific document using its UID
              const docRef = doc(db, "users", user.uid); // Reference to the document
              getDoc(docRef).then((docSnap) => {
                if (docSnap.exists()) {
                  console.log("Document data:", docSnap.data());
                  const data = docSnap.data();
                                try{
                                  console.log('ASDJIDJSAIODSJAOIDSA', data.courseAbbr);
                                  if(!collegeList.includes(data.courseAbbr)){
                                    const rateBoxDiv = document.getElementById('rate-box-div');

                                    // Hide the #rate-box and replace it with an <h1>
                                    const rateBox = document.getElementById('rate-box');
                                    rateBox.style.display = 'none'; // Hide the rate-box
                                
                                    const newHeading = document.createElement('h1');
                                    newHeading.textContent = 'You cannot rate this subject';
                                    newHeading.style.textAlign = 'center'; // Optional: For text alignment
                                    rateBoxDiv.appendChild(newHeading);
                                  }else{
                                    console.log("The SAME");
                                  }
                                }catch(err){
                                  console.log("ERROR IN FILTERING");
                                }
                              } else {
                                console.log("No such document!");
                              }
                    }).catch((error) => {
                      console.error("Error fetching document:", error);
                    });

            
          } else {
            console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
      
      try{
        fetch(path, {
          method:'GET',
          headers: {
            'authorization': `Bearer ${token}`,  // Send the token in the headers
            'Content-Type': 'application/json'
          }
        })
        .then(res => res.json)
        .then(console.log('GET FETCHED SUCCESSFULLY'))
      }catch(err){
        console.log('Error in fetch', err);
      }
    
        //temp
  const namehere = document.getElementById('namehere').innerHTML =  user.email ;
  console.log("ASDSADSADAS", user.course)
  uLogged.style.display = 'block';
  uNotLogged.style.display = 'none';
    } else {
        // No user is signed in
        console.log("No user is signed in.");
        uLogged.style.display = 'none';
      uNotLogged.style.display = 'block';

      const rateBox = document.getElementById('rate-box');
      rateBox.style.display='none';

    }
});
}catch(err){
  console.log("error in Auth", err);
}

 

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


try{


  const modal = document.getElementById('ratingModal').addEventListener('submit', (e)=>{
    e.preventDefault();
    const comment = document.getElementById('reviewTXT').value;

    onAuthStateChanged(auth, (user) => {
      if (user) {
          // User is signed in, you can get their details
          const uid = user.uid;
          const token = user.accessToken;

          const path = window.location.pathname;


          const segments = path.split('/').filter(Boolean);
          const course = segments[3]; 
          console.log(course);

          const reviewData = {rating,comment,token,course}

          console.log(reviewData);


          fetch('/reviews', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewData)
          })
          .then(res => res.json())
          .then(res => {
            window.location.reload();
          })


          
      } else {
          // No user is signed in
          console.log("No user is signed in.");
      }
  });


})
}catch(err){
  console.log('Error in subjects ejs -- fetching data', err);
}


//for departments
try{
  const path = window.location.pathname;
  console.log(path);
  const home = document.getElementById('sideHome');
  const sideDept = document.getElementById('sideDept');


  if(path == '/'){
    home.style.backgroundColor= '#29398C';
    home.style.borderRadius= '10px';
    home.style.color= 'white';

    
  }else{
    sideDept.style.backgroundColor= '#29398C';
    sideDept.style.borderRadius= '10px';
    sideDept.style.color= 'white';

  }
}catch(err){

}

try{
  const windowID = window.location.pathname;
  const goBackBtn = document.getElementById('go-back-btn');

  if(windowID == '/'){
    goBackBtn.style.display ='none';
  }

  
  goBackBtn.addEventListener('click', (e) =>{
      history.back();
  })

}catch(err){
  console.log("Error in go-back-button");
}

//for breacrumbs
try{
  const breadCrumbs = document.getElementById('breadCrumbs');
  const path = window.location.pathname;
  const segments = path.split('/').filter(Boolean);

  let breadcrumbs = [];
  let currentPath = "";
  const pathSpecific = path.split('/').filter(Boolean);

console.log('disoadjsoaisdjiao', pathSpecific[0]);
  // Construct breadcrumb paths incrementally
  segments.forEach(segment => {
      currentPath += `/${segment}`;
      breadcrumbs.push(currentPath);
  });
  
  console.log(breadcrumbs);
  console.log(`${breadcrumbs[1]} hi there ${breadcrumbs[2]}`);
  console.log('hello there' , window.location.pathname);
  console.log("SIZEE", breadcrumbs.length);
  let bcSize = breadcrumbs.length;
  switch(bcSize){
    case 1: 
  breadCrumbs.innerHTML += `<a href=${breadcrumbs[0]}>Departments</a> </a>`
    break;
    case 2:
  breadCrumbs.innerHTML += `<a href=${breadcrumbs[0]}>Departments</a>  <i class="fa fa-chevron-right fa-xs"></i> <a href=${breadcrumbs[1]}> ${pathSpecific[1]} </a> `
    break;
    case 3:
  breadCrumbs.innerHTML += `<a href=${breadcrumbs[0]}>Departments</a>  <i class="fa fa-chevron-right fa-xs"></i> <a href=${breadcrumbs[1]}> ${pathSpecific[1]} </a> <i class="fa fa-chevron-right fa-xs"></i> <a href=${breadcrumbs[2]}> ${pathSpecific[2]} </a>`
    break;
    case 4:
  breadCrumbs.innerHTML += `<a href=${breadcrumbs[0]}>Departments</a>  <i class="fa fa-chevron-right fa-xs"></i> <a href=${breadcrumbs[1]}> ${pathSpecific[1]} </a> <i class="fa fa-chevron-right fa-xs"></i> <a href=${breadcrumbs[2]}> ${pathSpecific[2]} </a> <i class="fa fa-chevron-right fa-xs"></i> <a href=${breadcrumbs[3]}> ${pathSpecific[3]} </a>`
    break;
  }
}catch(err){
  console.log("Error in breadcrumbs: ", err);
}