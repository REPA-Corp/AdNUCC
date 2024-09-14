const express = require('express');
const morgan = require('morgan');
const admin = require('firebase-admin');
const { CollectionGroup } = require('firebase-admin/firestore');

const app = express();
app.use(morgan('dev'));

app.use(express.static('static'));
app.use(express.json());

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // or use a service account key file: 
    credential: admin.credential.cert(require('./pkey/repa-corporation-firebase-adminsdk-ub9ct-3ddd6b939a.json'))
  });


//db
  const db = admin.firestore();

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.listen(port, ()=>{
    console.log(`Connected to port:${port}`);
})



//handle REGISTRATION
app.post('/reg', async(req,res)=>{
    console.log("body body: ", req.body);
    data = req.body;

    if(data.password != data.confirmPassword){
      res.status(500).json({
        message: 'Error creating user',
        error: "Both passwords must be the same.",
        status: 'error'
      })
      return;
    }

    try {
        // Create user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
          email: data.email,
          password: data.password
        });
    
        res.status(201).json({
          message: 'User created successfully',
          user: userRecord,
          status: 'passed',
          redirect: '/departments'
        });
      } catch (error) {

 

        res.status(500).json({
          message: 'Error creating user',
          error: error.message,
          status: 'error'
        });
      }

})



app.get('/', (req,res)=>{
    
    res.render('index', {pageTitle:'Home' });
})



app.get('/departments', async(req,res)=>{

    const departmentsData = await db.collection('departments').get();
    // docRef.forEach(e => {
    //     data = e.data();

    //     console.log(data);
        
    // });


    res.render('departments', {pageTitle: 'Departments', departmentsData });
})

app.use('/', (req,res)=>{


    res.render('404', {pageTitle: '404'});
})