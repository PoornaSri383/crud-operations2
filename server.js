const express = require('express');
const app = express();

const admin = require('firebase-admin');
const credentials = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

app.use(express.json());

app.use(express.urlencoded({extended: true}));

const db = admin.firestore();

//create operation
app.post('/create', async(req, res) => {
    try {
        console.log(req.body);
        const id = req.body.email;
        const userJson = {
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        };
        const response = await db.collection("users").add(userJson);
        res.send(response);
    } catch(error) {
        res.send(error);
    }
})

//read operation (reading all data)
app.get('/read/all', async (req,res) => {
    try {
        const userRef = db.collection("users");
        const response = await userRef.get();
        let responseArr = [];
        response.forEach(doc => {
            responseArr.push(doc.data());
        });
        res.send(responseArr);
    } catch(error) {
        res.send(error);
    }
});

//read operation (reading data based on id)
app.get('/read/:id', async (req,res) => {
    try {
        const userRef = db.collection("users").doc(req.params.id);
        const response = await userRef.get();
        res.send(response.data());
    } catch(error) {
        res.send(error);
    }
});

//update operation
app.post('/update', async(req, res) => {
    try {
        const id = req.body.id;
        const newFirstName = "Hello World !!!";
        const userRef = await db.collection("users").doc(id)
        .update({
            firstName : newFirstName
        });
        res.send(userRef);
    } catch(error) {
        res.send(error);
    }
})

//delete operation
app.delete('/delete/:id', async (req, res) => {
    try {
        const response = await db.collection("users").doc(req.params.id).delete();
        res.send(response);
    } catch(error) {
        res.send(error);
    }
});

app.listen(3000, function(req, res){
    console.log("server is running on port 3000");
})