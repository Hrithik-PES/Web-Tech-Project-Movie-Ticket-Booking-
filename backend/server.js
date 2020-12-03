const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
var bodyParser = require('body-parser');

app.use(bodyParser.json());

MongoClient.connect('mongodb+srv://dbHrithik:hrithikhm17@cluster0.jno3h.mongodb.net/MovieBooking?retryWrites=true&w=majority',{useUnifiedTopology:true},(err,client) =>{
    if(err) return console.log('error to coonect database');
    console.log('Connected to MovieBooking Database');
    
    const db = client.db('MovieBooking');
    
    //const seatcollection = db.collection('Seats')

    app.listen(5000,function(){
        console.log('Server listening on 5000');
    })

    app.get('/read/:id', async (req,res) => {
        //res.send('Hello Welcome To Movie Ticket Booking Website')
        var query = {theatreID: req.params.id};
        var theatreSeats = [];
        
        await getTheatreSeats(db.collection('Seats').find(query), theatreSeats);
        return res.send(theatreSeats);
    })

    async function getTheatreSeats(result, theatreSeats) {
        await result.forEach(function(myDoc) {
            theatreSeats.push({
                "theatreID":myDoc.theatreID,
                "rowID":myDoc.rowID,
                "columnID":myDoc.columnID,
                "status":myDoc.status,
                "BookedBy":myDoc.BookedBy
            });
        })
        return theatreSeats;
    }

    app.post('/insert',(req,res) =>{
        console.log(JSON.stringify(req.body));
        let seatdata = fs.readFileSync('seats.json');
        let seat = JSON.parse(seatdata);
        db.collection('Seats').insertMany(seat,function(err,doc){
                if(err) return console.log('error in insering');
                console.log("successfull insertion");
        });
        return res.send({ message: "i am sending response"});
    })

    app.post('/refresh',(req,res) => {
        db.collection('Seats').deleteMany({});
        return res.send({ message: "i am sending response"});
    })
    app.post('/update',(req,res) => {
        //console.log(JSON.stringify(req.body));
        db.collection('Seats').find().forEach(function(myDoc) {
            if(myDoc.theatreID == req.body.theatreID){
                for(var i = 0; i < req.body.seats.length; i++){
                    if(myDoc.rowID == req.body.seats[i].rowID && myDoc.columnID == req.body.seats[i].columnID){
                        db.collection('Seats').findOneAndUpdate(
                            {_id:myDoc._id},
                            {
                                $set:{
                                   BookedBy:req.body.BookedBy,
                                   status:"Booked"
                                }
                            }
                        )
                    }
                }
            }
        })
        return res.send({ message: "i am sending response"});
    })
    //client.close();
})
