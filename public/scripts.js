// const userName = "Rob-" + Math.floor(Math.random() * 100000)
// const password = "x";
// document.querySelector('#user-name').innerHTML = userName;
// let localStream;
// let remoteStream;
// let peerConnection;
// let didIOffer;
// let offerIceCandidateArray = []
// let answerIceCandidateArray =[]

// //const socket = io.connect("https://peervideo-production.up.railway.app", {
// const socket = io.connect("https://localhost:3009", {
//     auth: {
//         userName, password
//     }
// })

// let stunServers = {
//     iceServers: [
//         {
//             urls: [
//                 'stun:stun.l.google.com:19302',
//                 'stun:stun1.l.google.com:19302'
//             ]
//         }
//     ]
// }

// const call = async () => {

//     localStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: false
//     })

//     document.getElementById("local-video").srcObject = localStream

//     await createPeerConnection();
//     console.log("created peer Connection")
//     try {
//         console.log("creating Offer!")
//         const offer = await peerConnection.createOffer()
//         console.log("Created offer......",)
//         await peerConnection.setLocalDescription(offer)

//         // offer.offerIceCandidates = offerIceCandidateArray
//         console.log("asdasdasda:-", offer.offerIceCandidates)
//         await socket.emit('newOffer', offer)
//         didIOffer = true;
//         console.log("offer sent to server")
//                 console.log("started sendIceCandidateToSignalingServer")
//      await prepareAndSendIceCandidates(userName,true);
//     console.log("eneded sendIceCandidateToSignalingServer")
       
//         console.log("peer connection offer aft ice:-", peerConnection)
//     } catch (err) {
//         console.log(err)
//     }
// }

// const answerOffer = async (offerObj) => {
//     console.log("offer recieved for to answer :-", offerObj)
//     console.log("creating answer offer")
//         localStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: false
//     })

//     document.getElementById("local-video").srcObject = localStream
//     await createPeerConnection(offerObj);
//     const answer = await peerConnection.createAnswer()
//     peerConnection.setLocalDescription(answer)
//     offerObj.answer = answer
//     offerObj.answererUserName = userName

//     // console.log("peer connection offer aft ice:-", peerConnection)
//     await prepareAndSendIceCandidates(userName,false)
//     const sendAnswerOffer = await socket.emitWithAck('newAnswer', offerObj)
//     console.log("answer offer sent :-",sendAnswerOffer)
//     // offerIceCandidates.forEach(c => {
//     //     peerConnection.addIceCandidate(c)
//     //     console.log("added ice candidate")
//     // })
//     // console.log("offer ice candidate from peer2", offerIceCandidates)
//     //document.getElementById("local-video").srcObject = localStream
// }

// const addAnswer = async (answer) => {
//     console.log("answer :-",answer)
//     await peerConnection.setRemoteDescription(answer)
// }

// const createPeerConnection = async (offerObj) => {

//     peerConnection = new RTCPeerConnection(stunServers);
//     remoteStream = new MediaStream()
//     document.getElementById("remote-video").srcObject = remoteStream

//     localStream.getTracks().forEach((track) => {
//         peerConnection.addTrack(track, localStream)
//     })
// //     peerConnection.addEventListener("track", e => {
// //   remoteVideo.srcObject = e.streams[0];
// // });

//     // peerConnection.addEventListener("RTCIceCandidate" , e => {
//     //     console.log("Ice Candidate found!")

//     //     if(e.candidate){
//     //         console.log("ice dandidate data:-",e.candidate)
//     //     }
//     // })
//     if ((offerObj)) {
//         await peerConnection.setRemoteDescription(offerObj.offer)
//         console.log("answer remote added")
        
//         //         peerConnection.onicecandidate = async (c) => {
//         //     // console.log('ice Candidate code started');
//         //     // if (c.candidate) {
//         //     //     answerIceCandidateArray.push(c.candidate)
//         //     //     // await addNewIceCandidate(c.candidate)
//         //     // }
//         // }
//         // console.log("ice candidate array :-", offerIceCandidateArray)
// }
//     // }else{
//     //       peerConnection.onicecandidate = async (c) => {
//     //         // console.log('ice Candidate code started');
//     //         if (c.candidate) {
//     //             let obj = {
//     //                 "candidate": c.candidate
//     //             }
//     //           await socket.emit("sendIceCandidateToSignalingServer",c.candidate)
//     //             // await addNewIceCandidate(c.candidate)
//     //         }
//     //     }
//     // }
//         // peerConnection.onicecandidate = async (c) => {
//         //     // console.log('ice Candidate code started');
//         //     if (c.candidate) {
//         //         console.log("new ice candidate :-", c.candidate)
//         //         offerIceCandidateArray.push(c.candidate)
//         //         await addNewIceCandidate(c.candidate)
//         //     }
//         // }
//         // console.log("ice candidate array :-", offerIceCandidateArray)
//         // const addNewIceCandidate = async (iceCandidate) => {
//         //     await peerConnection.addIceCandidate(iceCandidate);
//         //     console.log("============Added Ice Candidate===========")
//         // }



//     peerConnection.addEventListener("track", e => {
//         console.log("Got a track from the other peer")
        
//         e.streams[0].getTracks().forEach(track => {
//             console.log(e.streams)
//             console.log("LOCAL STREAM ID:", localStream.id);

//             remoteStream.addTrack(track, remoteStream)
//         })
//     })


// }

// const prepareAndSendIceCandidates = async (userName,status)=> {
//     peerConnection.onicecandidate = async (e) => {
//         // console.log("fsdfsdf ",)
//         if(e.candidate){
//             let iceobject = {
//                 "candidate":e.candidate,
//                 "userName": userName,
//                 "didIOffer":status
//             }
//             if(status == true){
//                  socket.emit("sendIceCandidateToSignalingServer" , iceobject);
//             }else{
//                 let c = await socket.emitWithAck("sendIceCandidateToSignalingServer" , iceobject);
//                 addNewIceCandidate(c)
//             }
            
//             console.log("signal emmited")
//         }
//     }
// }
//    const addNewIceCandidate = async (iceCandidate) => {
//             await peerConnection.addIceCandidate(iceCandidate);
//             console.log("============Added Ice Candidate===========")
//             console.log(peerConnection)
//             peerConnection.oniceconnectionstatechange = () => {
//             console.log("ICE state:", peerConnection.iceConnectionState);
// };

//         }



// //addNewIceCandidate(offerIceCandidateArray);

// document.getElementById("call").addEventListener("click", async () => {
//     await call()
// })
// Generate random username for the session
const userName = "Rob-" + Math.floor(Math.random() * 100000);
const password = "x";
document.querySelector('#user-name').innerHTML = userName;

let localStream;
let remoteStream;
let peerConnection;
let didIOffer;
let iceBuffer = []; // ✅ Changed: Buffer ICE candidates until remote description is set

// Connect to signaling server
// const socket = io.connect("https://localhost:3009", {
//     auth: { userName, password }
// });
const socket = io.connect("https://peervideo-production.up.railway.app", {
// const socket = io.connect("https://localhost:3009", {
    auth: {
        userName, password
    }
})
// STUN + TURN servers for cloud
const stunServers = {
    iceServers: [
        { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
        {
            // ✅ Added TURN server for cloud support
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject"
        }
    ]
};

// ======== CREATE PEER CONNECTION =========
const createPeerConnection = async (offerObj) => {
    peerConnection = new RTCPeerConnection(stunServers);

    // ✅ Remote stream setup: assign directly for simplicity
    remoteStream = new MediaStream();
    document.getElementById("remote-video").srcObject = remoteStream;

    // Add local tracks immediately
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // ✅ Attach ICE listener IMMEDIATELY
    peerConnection.onicecandidate = e => {
        if (e.candidate) {
            let iceObject = {
                candidate: e.candidate,
                userName,
                didIOffer
            };
            socket.emit("sendIceCandidateToSignalingServer", iceObject);
        }
    };

    // Listen for remote tracks
    peerConnection.addEventListener("track", e => {
        console.log("Got a track from remote peer:", e.streams[0].id);
        document.getElementById("remote-video").srcObject = e.streams[0];
    });

    // If answering, set remote description first
    if (offerObj) {
        await peerConnection.setRemoteDescription(offerObj.offer);
        console.log("Remote description set for answer");

        // ✅ Flush any ICE candidates that arrived early
        await flushIceCandidates();
    }
};

// ======== BUFFER & FLUSH ICE CANDIDATES =========
const addNewIceCandidate = async (iceCandidate) => {
    if (peerConnection.remoteDescription) {
        await peerConnection.addIceCandidate(iceCandidate);
        console.log("Added ICE Candidate:", iceCandidate);
    } else {
        // ✅ Changed: Buffer ICE candidates until remote description exists
        iceBuffer.push(iceCandidate);
    }
};

const flushIceCandidates = async () => {
    for (const c of iceBuffer) {
        await peerConnection.addIceCandidate(c);
        console.log("Flushed buffered ICE Candidate:", c);
    }
    iceBuffer = [];
};

// ======== CALL / OFFER FUNCTION =========
const call = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    document.getElementById("local-video").srcObject = localStream;

    await createPeerConnection();
    didIOffer = true;

    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        // Send offer to signaling server
        await socket.emit('newOffer', offer);
        console.log("Offer sent to server");
    } catch (err) {
        console.error(err);
    }
};

// ======== ANSWER FUNCTION =========
const answerOffer = async (offerObj) => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    document.getElementById("local-video").srcObject = localStream;

    await createPeerConnection(offerObj);
    didIOffer = false;

    try {
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        // Include answerer username
        offerObj.answer = answer;
        offerObj.answererUserName = userName;

        // Send answer back via signaling server
        await socket.emitWithAck('newAnswer', offerObj);
        console.log("Answer sent to server");

        // ✅ Flush any buffered ICE candidates that arrived early
        await flushIceCandidates();
    } catch (err) {
        console.error(err);
    }
};

// ======== ADD ANSWER TO OFFERER =========
const addAnswer = async (answer) => {
    await peerConnection.setRemoteDescription(answer);
    console.log("Remote description set for offerer");

    // ✅ Flush any buffered ICE candidates
    await flushIceCandidates();
};

// ======== UI EVENT =========
document.getElementById("call").addEventListener("click", async () => {
    await call();
});

// ======== SOCKET HANDLERS =========
socket.on("iceCandidate", async (candidate) => {
    console.log("Received ICE candidate from remote:", candidate);
    await addNewIceCandidate(candidate);
});

socket.on("incomingOffer", async (offerObj) => {
    console.log("Incoming offer received:", offerObj);
    await answerOffer(offerObj);
});

socket.on("incomingAnswer", async (answer) => {
    console.log("Incoming answer received:", answer);
    await addAnswer(answer);
});
