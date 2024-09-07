const express = require('express');
const morgan = require('morgan');
const admin = require('firebase-admin')

const app = express();
app.use(morgan('dev'));

app.use(express.static('static'));
app.use(express.json());

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // or use a service account key file: 
    credential: admin.credential.cert(require('./pkey/repa-corporation-firebase-adminsdk-ub9ct-3ddd6b939a.json'))
  });


const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.listen(port, ()=>{
    console.log(`Connected to port:${port}`);
})


let curUser = null;



app.get('/', (req,res)=>{
    
    res.render('index');
})

app.use('/', (req,res)=>{
    res.render('404');
})