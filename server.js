import https from "https"
import http from "http"
import express from "express"
import { Socket,Server } from "socket.io"
import fs from "fs"


// import { Server } from "ws"
const key = fs.readFileSync("localhost+3-key.pem");
const cert = fs.readFileSync("localhost+3.pem");
const app = express()
app.use(express.static("public"))

//const expressServer = https.createServer({key,cert},app)
const expressServer = http.createServer(app)
const io =new Server(expressServer, {
    cors: {
        origin: "*"
            // "https://localhost:8002",
            // "https://localhost:3005",
            // "https://127.0.0.1:3005",
            // "https://172.16.54.62:3008",
           
        ,
        methods: ["GET", "POST"]
    }
})
expressServer.listen(3009);

const offers = [
    // offererUserName
    // offer
    // offerIceCandidates
    // answererUserName
    // answer
    // answererIceCandidates
]

let ConnectedSockets = [
    //username , socketId
]
let userNo =0;
io.on("connection", (socket) => {
    const userName = socket.handshake.auth.userName;
    const password = socket.handshake.auth.password;
    
    console.log("user connected ",userNo++)


    if (password != "x") {
        socket.disconnect(true);
        return;
    }

    ConnectedSockets.push({
        socketId: socket.id,
        userName: userName
    })
    console.log("connected sockets details:-",ConnectedSockets)

    if (offers.length) {
        socket.emit('availableOffers', offers);
    }

    socket.on('newOffer', newOffer => {
        console.log("recieved new offer request")
      //  console.log("recieved ice candidates:-", newOffer.offerIceCandidates)
        offers.push({
            offererUserName: userName,
            offer: newOffer,
            offerIceCandidates: [],
            answererUserName: null,
            answer: null,
            answerIceCandidate: []
        })
       // console.log("new offer data :-",newOffer)
        socket.broadcast.emit('newOfferAwaiting', offers.slice(-1));
        console.log("sent new offer to peer 2")
    })

    socket.on('newAnswer', async (offerObj, ackFunction) => {
       // console.log(offerObj)
       console.log("===========answer offer recieved==========")
       //console.log(offerObj)
        // console.log("===========================Answer recieved===================================")
        const socketToAnswer =await ConnectedSockets.find(s => s.userName === offerObj.offererUserName)
        
        console.log(socketToAnswer)
        if (!socketToAnswer) {
            console.log("no matching socket!!!")
        }

         const socketIdToAnswer = socketToAnswer.socketId;

         const offerToUpdate = offers.find(o => o.offererUserName === offerObj.offererUserName)
         if(offerToUpdate){
            offerToUpdate.answererUserName = offerObj.answererUserName
            offerToUpdate.answer = offerObj.answer
            console.log("added answerer User Name to offer to local offer obj")
         }else{
            console.log("no offer found when recieved new answer request")
         }
        //  console.log("offer to update results :-",offerToUpdate)
        // if (!offerToUpdate) {
        //     console.log("No offer to update")
        // }

        // // ackFunction(offerToUpdate.offerIceCandidates);
        // offerToUpdate.answer = offerObj.answer
        // offerToUpdate.answererUserName = offerObj.userName
        //console.log("answer offer :-",offerObj)
        socket.to(socketIdToAnswer).emit('answerResponse', offerObj)
    })

    socket.on('sendIceCandidateToSignalingServer',async (iceCandidateObj,ackFunction) => {
        const didIOffer = iceCandidateObj.didIOffer
        const iceUserName = iceCandidateObj.userName
        const iceCandidate = iceCandidateObj.candidate

        if(didIOffer){
            console.log("recieved offerer ice candidates")
            const offerInOffers = offers.find(o => o.offererUserName === iceCandidateObj.userName)
            if(offerInOffers){
                  if(offerInOffers){
                console.log("offer does exist!!!")
               }
                offerInOffers.offerIceCandidates.push(iceCandidateObj.candidate)
              
                // const socketToSendTo = ConnectedSockets.find(s => s.userName === offerInOffers.answererUserName)
                
                // console.log("offer user name : -",iceCandidateObj.userName)
                
                // if(socketToSendTo){
                //     socket.to(socketToSendTo.socketId).emit("receivedIceCandidateFromServer",iceCandidateObj.candidate)
                // }else{
                //     console.log("No Answerer socket found!!!")
                // }

                // socket.emit("")            
           }else{
                console.log("No offers found!!!");
            }
        }else{
            if(didIOffer == false){
                console.log("answerer ice candidate recieved!!!")
                const offerInOffers = offers.find(o => o.answererUserName === iceCandidateObj.userName)
                if(offerInOffers){
                const offererSocketToSendTo = ConnectedSockets.find(s => s.userName === offerInOffers.offererUserName)
                ackFunction(iceCandidateObj.candidate)
                const answererSocketToSendTo = ConnectedSockets.find(s => s.userName === offerInOffers.answererUserName)
                 console.log("answer soceket name :-",answererSocketToSendTo,answererSocketToSendTo.socketId)
                offerInOffers.answerIceCandidate.push(iceCandidateObj.candidate)
                 
                  //socket.to(answererSocketToSendTo.socketId).emit("receivedFinalOfferFromServer",offerInOffers)
                // console.log("ice candidate length :-",)
                 if((offerInOffers.answerIceCandidate).length >= 3){
                     socket.to(offererSocketToSendTo.socketId).emit("finalPackage",offerInOffers)
            //     console.log("final offer package:- ",offerInOffers)
            //   socket.to(socketToSendTo.socketId).emit("receivedIceCandidateFromServer",offerInOffers)
              console.log("final offer sent!!!!!")
                }
            //     if(iceCandidateObj.candidate){
            //     if(offererSocketToSendTo){
            //         socket.to(offererSocketToSendTo.socketId).emit("receivedIceCandidateFromServer",iceCandidateObj.candidate)
            //     }else{
            //         console.log("No Offerer socket found!!!")
            //     }

            //     // socket.emit("")            
            // }
               
           }else{
                console.log("No offers found!!!");
            }
        }

//         console.log("============================================================")
//         console.log("ice received")
//         console.log(iceCandidateObj)
//         // const { didIOffer, iceUserName, iceCandidate } = iceCandidateObj
//         //  console.log("ice candidate dfdfdf :-",iceCandidateObj.offer.offererUserName)
//         const offerInOffers = offers.find(o => o.offererUserName === iceCandidateObj.userName)
//         if (iceCandidateObj.didIOffer) {
//             if (offerInOffers) {
//                 offerInOffers.offerIceCandidates.push(iceCandidateObj.candidate)
//                 offerInOffers.offerIceCandidates.push(iceCandidateObj.candidate)
//                 if(offerInOffers.offerIceCandidates.length > 0){
//                     console.log("ice candidates successfully pushed no:-",offerInOffers.offerIceCandidates.length)
//                 }

//                 if (offerInOffers.answererUserName) {
//                     const socketToSendTo = ConnectedSockets.find(s => s.userName === offerInOffers.answererUserName)
//                     if (socketToSendTo) {
//                       await socket.to(socketToSendTo.socketId).emit('receivedIceCandidateFromServer', iceCandidateObj.candidate)
//                     } else {
//                         console.log("Ice candidate recieved but could not find answerer")
//                     }
//                 }
//             }else{
//                 console.log("no offer found")
            
//             }

//         } else {
            
//         // const offerInOffers = offers.find(o => o.answererUserName === iceCandidateObj.iceUserName)
//          console.log("answerer user name:-",offerInOffers)
//          if(offerInOffers){
//          const socketToSendTo = ConnectedSockets.find(s => offerInOffers.answererUserName === s.userName)
//          }
        


//         //  if(socketToSendTo){
//         //     socket.to(socketToSendTo.socketId).emit('receivedIceCandidateFromServer',iceCandidate)
//         //  }
//         // else{
//         //     console.log("Ice Candidate recieved but could not find offerer")
//         // }
//         if(offerInOffers && socketToSendTo){
//             offerInOffers.answerIceCandidate.push(iceCandidateObj.candidate)
//             console.log("answerer ice added to the offer")
//         }

    
//     }
//     // console.log("offer aft recieving ice candidates :-",offerInOffers)
// })
        }
})
})