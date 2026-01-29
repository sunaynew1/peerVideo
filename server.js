// import https from "https"
// import http from "http"
// import express from "express"
// import { Socket,Server } from "socket.io"
// import fs from "fs"


// // import { Server } from "ws"
// const key = fs.readFileSync("localhost+3-key.pem");
// const cert = fs.readFileSync("localhost+3.pem");
// const app = express()
// app.use(express.static("public"))

// const expressServer = https.createServer({key,cert},app)
// //const expressServer = https.createServer(app)
// const io =new Server(expressServer, {
//     cors: {
//         origin: "*"
//             // "https://localhost:8002",
//             // "https://localhost:3005",
//             // "https://127.0.0.1:3005",
//             // "https://172.16.54.62:3008",
           
//         ,
//         methods: ["GET", "POST"]
//     }
// })
// expressServer.listen(3009);

// const offers = [
//     // offererUserName
//     // offer
//     // offerIceCandidates
//     // answererUserName
//     // answer
//     // answererIceCandidates
// ]

// let ConnectedSockets = [
//     //username , socketId
// ]
// let userNo =0;
// io.on("connection", (socket) => {
//     const userName = socket.handshake.auth.userName;
//     const password = socket.handshake.auth.password;
    
//     console.log("user connected ",userNo++)


//     if (password != "x") {
//         socket.disconnect(true);
//         return;
//     }

//     ConnectedSockets.push({
//         socketId: socket.id,
//         userName: userName
//     })
//     console.log("connected sockets details:-",ConnectedSockets)

//     if (offers.length) {
//         socket.emit('availableOffers', offers);
//     }

//     socket.on('newOffer', newOffer => {
//         console.log("recieved new offer request")
//       //  console.log("recieved ice candidates:-", newOffer.offerIceCandidates)
//         offers.push({
//             offererUserName: userName,
//             offer: newOffer,
//             offerIceCandidates: [],
//             answererUserName: null,
//             answer: null,
//             answerIceCandidate: []
//         })
//        // console.log("new offer data :-",newOffer)
//         socket.broadcast.emit('newOfferAwaiting', offers.slice(-1));
//         console.log("sent new offer to peer 2")
//     })

//     socket.on('newAnswer', async (offerObj, ackFunction) => {
//        // console.log(offerObj)
//        console.log("===========answer offer recieved==========")
//        //console.log(offerObj)
//         // console.log("===========================Answer recieved===================================")
//         const socketToAnswer =await ConnectedSockets.find(s => s.userName === offerObj.offererUserName)
        
//         console.log(socketToAnswer)
//         if (!socketToAnswer) {
//             console.log("no matching socket!!!")
//         }

//          const socketIdToAnswer = socketToAnswer.socketId;

//          const offerToUpdate = offers.find(o => o.offererUserName === offerObj.offererUserName)
//          if(offerToUpdate){
//             offerToUpdate.answererUserName = offerObj.answererUserName
//             offerToUpdate.answer = offerObj.answer
//             console.log("added answerer User Name to offer to local offer obj")
//          }else{
//             console.log("no offer found when recieved new answer request")
//          }
//         //  console.log("offer to update results :-",offerToUpdate)
//         // if (!offerToUpdate) {
//         //     console.log("No offer to update")
//         // }

//         // // ackFunction(offerToUpdate.offerIceCandidates);
//         // offerToUpdate.answer = offerObj.answer
//         // offerToUpdate.answererUserName = offerObj.userName
//         //console.log("answer offer :-",offerObj)
//         socket.to(socketIdToAnswer).emit('answerResponse', offerObj)
//     })

//     socket.on('sendIceCandidateToSignalingServer',async (iceCandidateObj,ackFunction) => {
//         const didIOffer = iceCandidateObj.didIOffer
//         const iceUserName = iceCandidateObj.userName
//         const iceCandidate = iceCandidateObj.candidate

//         if(didIOffer){
//             console.log("recieved offerer ice candidates")
//             const offerInOffers = offers.find(o => o.offererUserName === iceCandidateObj.userName)
//             if(offerInOffers){
//                   if(offerInOffers){
//                 console.log("offer does exist!!!")
//                }
//                 offerInOffers.offerIceCandidates.push(iceCandidateObj.candidate)
              
//                 // const socketToSendTo = ConnectedSockets.find(s => s.userName === offerInOffers.answererUserName)
                
//                 // console.log("offer user name : -",iceCandidateObj.userName)
                
//                 // if(socketToSendTo){
//                 //     socket.to(socketToSendTo.socketId).emit("receivedIceCandidateFromServer",iceCandidateObj.candidate)
//                 // }else{
//                 //     console.log("No Answerer socket found!!!")
//                 // }

//                 // socket.emit("")            
//            }else{
//                 console.log("No offers found!!!");
//             }
//         }else{
//             if(didIOffer == false){
//                 console.log("answerer ice candidate recieved!!!")
//                 const offerInOffers = offers.find(o => o.answererUserName === iceCandidateObj.userName)
//                 if(offerInOffers){
//                 const offererSocketToSendTo = ConnectedSockets.find(s => s.userName === offerInOffers.offererUserName)
//                 ackFunction(iceCandidateObj.candidate)
//                 const answererSocketToSendTo = ConnectedSockets.find(s => s.userName === offerInOffers.answererUserName)
//                  console.log("answer soceket name :-",answererSocketToSendTo,answererSocketToSendTo.socketId)
//                 offerInOffers.answerIceCandidate.push(iceCandidateObj.candidate)
                 
//                   //socket.to(answererSocketToSendTo.socketId).emit("receivedFinalOfferFromServer",offerInOffers)
//                 // console.log("ice candidate length :-",)
//                  if((offerInOffers.answerIceCandidate).length >= 3){
//                      socket.to(offererSocketToSendTo.socketId).emit("finalPackage",offerInOffers)
//             //     console.log("final offer package:- ",offerInOffers)
//             //   socket.to(socketToSendTo.socketId).emit("receivedIceCandidateFromServer",offerInOffers)
//               console.log("final offer sent!!!!!")
//                 }
//             //     if(iceCandidateObj.candidate){
//             //     if(offererSocketToSendTo){
//             //         socket.to(offererSocketToSendTo.socketId).emit("receivedIceCandidateFromServer",iceCandidateObj.candidate)
//             //     }else{
//             //         console.log("No Offerer socket found!!!")
//             //     }

//             //     // socket.emit("")            
//             // }
               
//            }else{
//                 console.log("No offers found!!!");
//             }
//         }

// //         console.log("============================================================")
// //         console.log("ice received")
// //         console.log(iceCandidateObj)
// //         // const { didIOffer, iceUserName, iceCandidate } = iceCandidateObj
// //         //  console.log("ice candidate dfdfdf :-",iceCandidateObj.offer.offererUserName)
// //         const offerInOffers = offers.find(o => o.offererUserName === iceCandidateObj.userName)
// //         if (iceCandidateObj.didIOffer) {
// //             if (offerInOffers) {
// //                 offerInOffers.offerIceCandidates.push(iceCandidateObj.candidate)
// //                 offerInOffers.offerIceCandidates.push(iceCandidateObj.candidate)
// //                 if(offerInOffers.offerIceCandidates.length > 0){
// //                     console.log("ice candidates successfully pushed no:-",offerInOffers.offerIceCandidates.length)
// //                 }

// //                 if (offerInOffers.answererUserName) {
// //                     const socketToSendTo = ConnectedSockets.find(s => s.userName === offerInOffers.answererUserName)
// //                     if (socketToSendTo) {
// //                       await socket.to(socketToSendTo.socketId).emit('receivedIceCandidateFromServer', iceCandidateObj.candidate)
// //                     } else {
// //                         console.log("Ice candidate recieved but could not find answerer")
// //                     }
// //                 }
// //             }else{
// //                 console.log("no offer found")
            
// //             }

// //         } else {
            
// //         // const offerInOffers = offers.find(o => o.answererUserName === iceCandidateObj.iceUserName)
// //          console.log("answerer user name:-",offerInOffers)
// //          if(offerInOffers){
// //          const socketToSendTo = ConnectedSockets.find(s => offerInOffers.answererUserName === s.userName)
// //          }
        


// //         //  if(socketToSendTo){
// //         //     socket.to(socketToSendTo.socketId).emit('receivedIceCandidateFromServer',iceCandidate)
// //         //  }
// //         // else{
// //         //     console.log("Ice Candidate recieved but could not find offerer")
// //         // }
// //         if(offerInOffers && socketToSendTo){
// //             offerInOffers.answerIceCandidate.push(iceCandidateObj.candidate)
// //             console.log("answerer ice added to the offer")
// //         }

    
// //     }
// //     // console.log("offer aft recieving ice candidates :-",offerInOffers)
// // })
//         }
// })
// })

import https from "https";
import http from "http"
import express from "express";
import { Server } from "socket.io";
import fs from "fs";

// TLS certs for HTTPS
const key = fs.readFileSync("localhost+3-key.pem");
const cert = fs.readFileSync("localhost+3.pem");

const app = express();
app.use(express.static("public"));

// ✅ Create HTTPS server
// const expressServer = https.createServer({ key, cert }, app);
const expressServer = http.createServer(app);
// ✅ Setup socket.io with CORS
const io = new Server(expressServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

expressServer.listen(3009, () => console.log("Signaling server running on port 3009"));

// ======== DATA STRUCTURES ========
let offers = []; // stores offers, answers, and ICE candidates
let connectedSockets = []; // stores { socketId, userName }

// ======== SOCKET CONNECTION ========
io.on("connection", (socket) => {
    const { userName, password } = socket.handshake.auth;

    if (password !== "x") {
        socket.disconnect(true);
        return;
    }

    console.log("User connected:", userName);

    connectedSockets.push({ socketId: socket.id, userName });
    console.log("Connected sockets:", connectedSockets);

    // Send existing offers to new peer
    if (offers.length) {
        socket.emit("availableOffers", offers);
    }

    // ======== NEW OFFER ========
    socket.on("newOffer", (offer) => {
        console.log("Received new offer from:", userName);

        const offerObj = {
            offererUserName: userName,
            offer,
            offerIceCandidates: [],
            answererUserName: null,
            answer: null,
            answerIceCandidates: []
        };

        offers.push(offerObj);

        // Broadcast to all peers except sender
        socket.broadcast.emit("newOfferAwaiting", offerObj);
        console.log("Offer broadcasted to other peers");
    });

    // ======== NEW ANSWER ========
    socket.on("newAnswer", (answerObj) => {
        console.log("Answer received from:", answerObj.answererUserName);

        const offerToUpdate = offers.find(o => o.offererUserName === answerObj.offererUserName);
        if (!offerToUpdate) {
            console.log("No matching offer found!");
            return;
        }

        // Update offer with answer
        offerToUpdate.answererUserName = answerObj.answererUserName;
        offerToUpdate.answer = answerObj.answer;

        // Send answer to original offerer
        const offererSocket = connectedSockets.find(s => s.userName === offerToUpdate.offererUserName);
        if (offererSocket) {
            socket.to(offererSocket.socketId).emit("incomingAnswer", answerObj);
            console.log("Answer sent to offerer:", offerToUpdate.offererUserName);
        }
    });

    // ======== ICE CANDIDATE ========
    socket.on("sendIceCandidateToSignalingServer", (iceObj, ackFunction) => {
        const { didIOffer, userName: iceUserName, candidate } = iceObj;

        if (didIOffer) {
            // ICE from offerer → send to answerer
            const offerObj = offers.find(o => o.offererUserName === iceUserName);
            if (!offerObj || !offerObj.answererUserName) return;

            offerObj.offerIceCandidates.push(candidate);

            const answererSocket = connectedSockets.find(s => s.userName === offerObj.answererUserName);
            if (answererSocket) {
                socket.to(answererSocket.socketId).emit("incomingIceCandidate", { candidate, from: iceUserName });
            }
        } else {
            // ICE from answerer → send to offerer
            const offerObj = offers.find(o => o.answererUserName === iceUserName);
            if (!offerObj) return;

            offerObj.answerIceCandidates.push(candidate);

            const offererSocket = connectedSockets.find(s => s.userName === offerObj.offererUserName);
            if (offererSocket) {
                socket.to(offererSocket.socketId).emit("incomingIceCandidate", { candidate, from: iceUserName });
            }

            // ✅ Call ackFunction to confirm receipt
            if (ackFunction) ackFunction(candidate);
        }
    });

    // ======== HANDLE DISCONNECT ========
    socket.on("disconnect", () => {
        connectedSockets = connectedSockets.filter(s => s.socketId !== socket.id);
        console.log("User disconnected:", userName);
    });
});
