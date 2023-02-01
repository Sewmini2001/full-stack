const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const http =require('http').createServer(app);
const cors = require('cors');
const path = require('path');
const Pusher = require('pusher-js');
const port = process.env.port || 8080  //this is use for server port (login,register,profile)
const authRoute = require('./routes/authentication-route');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const ImageModel = require("./images/image.model");
const profilesRoutes = require('./routes/profiles');

// Polling Web Socket

app.use(express.static("client"));

const server = app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
var io = require("socket.io")(server);

app.get('/', (req, res) => {
    res.sendfile(__dirname +'/Francy_Botique/src/app/socket/votefeedback/votefeedback.component.html');
});

const candidates = {
    "0": { votes: 0, label: "Chocolate Cake", color: randomRGB() },
    "1": { votes: 0, label: "Birthday Cake", color: randomRGB() },
    "2": { votes: 0, label: "Dreamcatchers", color: randomRGB() },
    "3": { votes: 0, label: "Chilli Bites", color: randomRGB() },
    "4": { votes: 0, label: "Jar Cakes", color: randomRGB() },
    "5": { votes: 0, label: "Hand Made Items", color: randomRGB() },
    "6": { votes: 0, label: "Gift Boxes", color: randomRGB() },
    "7": { votes: 0, label: "Hair Bands", color: randomRGB() },
    "8": { votes: 0, label: "Pots", color: randomRGB() }
};


io.on("connection", (socket) => {
    io.emit("update", candidates);

    socket.on("vote", (index) => {

            if (candidates[index]) {
                candidates[index].votes = 1;
            }

            console.log(candidates);


            io.emit("update", candidates);
    });
});

function randomRGB() {
    const r = () => Math.random() * 256 >> 0;
    return `rgb(${r()}, ${r()}, ${r()})`;
}

// Card Payment Method

const stripe = require("stripe")("sk_test_51MTfg1HFFW4Dmq21H3CReXRS98XoJK443vWq2oSSaRIx7kVNWBSYOoAm9IcqtdLeHF1Kt4M36GwZTatQ88VIRTIa00I8LiKsDo");
app.use(bodyParser.urlencoded({ extended:false }))

app.use(bodyParser.json())

app.post('/checkout', async (req, res) => {
    console.log(req.body)

    try {
        token = res.body.token; 
        const customer = stripe.customers
        .create({
            email: "vindyasewmini10@gmail.com",
            source: token.id,
        })
        .then((customer) => {
            console.log(customer);
            return stripe.charges.create({
                amount: 1000,
                description: "Full Stack Project",
                currency: "LKR",
                customer: customer.id,
            }); 
        })
        .then((charge) => {
            console.log(charge);
            res.json({
                data: "success",
            });
        })
        .catch((err) => {
            res.json({
                data: "failure",
            });
        });
        return true;
    } catch (error) {
        return false;
    }
})

// MongoDB Database Connection (Mongodb Compass)

mongoose.connect('mongodb://localhost:27017/francy_botique', (err)=>{
    if(err){
        console.log("Database is not connected..!");
    }else{
        console.log("DB is connected Successfully..");
    }
});

app.use(bodyParser.urlencoded({ extended: false}))

app.use(bodyParser.json())
app.use(cors())

app.use('/auth', authRoute);

// QA & Feedback

var QaController = require('./controllers/QAController');
const imageModel = require('./images/image.model');
app.use('/qafeedback', QaController);


// Listing items

http.listen(3000, ()=>{
    console.log('Server is Running: ',3000)
});

app.use('/images', express.static(path.join('images')));

app.use('/api/profiles', profilesRoutes);

app.post('/', (req, res) =>{
    res.send('Welcome to Sewmini Server')
})

app.post('/', (req, res) => {
    res.sendfile(__dirname +'/Francy_Botique/src/app/components/create-profile/create-profile.component.html');
});




