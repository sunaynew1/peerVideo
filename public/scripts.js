const userName = "Rob-" + Math.floor(Math.random() * 100000)
const password = "x";
document.querySelector('#user-name').innerHTML = userName;
let localStream;
let remoteStream;
let peerConnection;
let didIOffer;
let offerIceCandidateArray = []
let answerIceCandidateArray =[]

const socket = io.connect("https://peervideo-production.up.railway.app", {
    auth: {
        userName, password
    }
})

let stunServers = {
    iceServers: [
        {
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302'
            ]
        }
    ]
}

const call = async () => {

    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    })

    document.getElementById("local-video").srcObject = localStream

    await createPeerConnection();
    console.log("created peer Connection")
    try {
        console.log("creating Offer!")
        const offer = await peerConnection.createOffer()
        console.log("Created offer......",)
        await peerConnection.setLocalDescription(offer)

        // offer.offerIceCandidates = offerIceCandidateArray
        console.log("asdasdasda:-", offer.offerIceCandidates)
        await socket.emit('newOffer', offer)
        didIOffer = true;
        console.log("offer sent to server")
                console.log("started sendIceCandidateToSignalingServer")
     await prepareAndSendIceCandidates(userName,true);
    console.log("eneded sendIceCandidateToSignalingServer")
       
        console.log("peer connection offer aft ice:-", peerConnection)
    } catch (err) {
        console.log(err)
    }
}

const answerOffer = async (offerObj) => {
    console.log("offer recieved for to answer :-", offerObj)
    console.log("creating answer offer")
        localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
    })

    document.getElementById("local-video").srcObject = localStream
    await createPeerConnection(offerObj);
    const answer = await peerConnection.createAnswer()
    peerConnection.setLocalDescription(answer)
    offerObj.answer = answer
    offerObj.answererUserName = userName

    // console.log("peer connection offer aft ice:-", peerConnection)
    await prepareAndSendIceCandidates(userName,false)
    const sendAnswerOffer = await socket.emitWithAck('newAnswer', offerObj)
    console.log("answer offer sent :-",sendAnswerOffer)
    // offerIceCandidates.forEach(c => {
    //     peerConnection.addIceCandidate(c)
    //     console.log("added ice candidate")
    // })
    // console.log("offer ice candidate from peer2", offerIceCandidates)
    //document.getElementById("local-video").srcObject = localStream
}

const addAnswer = async (answer) => {
    console.log("answer :-",answer)
    await peerConnection.setRemoteDescription(answer)
}

const createPeerConnection = async (offerObj) => {

    peerConnection = new RTCPeerConnection(stunServers);
    remoteStream = new MediaStream()
   // document.getElementById("remote-video").srcObject = remoteStream

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    })
//     peerConnection.addEventListener("track", e => {
//   remoteVideo.srcObject = e.streams[0];
// });

    // peerConnection.addEventListener("RTCIceCandidate" , e => {
    //     console.log("Ice Candidate found!")

    //     if(e.candidate){
    //         console.log("ice dandidate data:-",e.candidate)
    //     }
    // })
    if ((offerObj)) {
        await peerConnection.setRemoteDescription(offerObj.offer)
        console.log("answer remote added")
        
        //         peerConnection.onicecandidate = async (c) => {
        //     // console.log('ice Candidate code started');
        //     // if (c.candidate) {
        //     //     answerIceCandidateArray.push(c.candidate)
        //     //     // await addNewIceCandidate(c.candidate)
        //     // }
        // }
        // console.log("ice candidate array :-", offerIceCandidateArray)
}
    // }else{
    //       peerConnection.onicecandidate = async (c) => {
    //         // console.log('ice Candidate code started');
    //         if (c.candidate) {
    //             let obj = {
    //                 "candidate": c.candidate
    //             }
    //           await socket.emit("sendIceCandidateToSignalingServer",c.candidate)
    //             // await addNewIceCandidate(c.candidate)
    //         }
    //     }
    // }
        // peerConnection.onicecandidate = async (c) => {
        //     // console.log('ice Candidate code started');
        //     if (c.candidate) {
        //         console.log("new ice candidate :-", c.candidate)
        //         offerIceCandidateArray.push(c.candidate)
        //         await addNewIceCandidate(c.candidate)
        //     }
        // }
        // console.log("ice candidate array :-", offerIceCandidateArray)
        // const addNewIceCandidate = async (iceCandidate) => {
        //     await peerConnection.addIceCandidate(iceCandidate);
        //     console.log("============Added Ice Candidate===========")
        // }



    peerConnection.addEventListener("track", e => {
        console.log("Got a track from the other peer")
        e.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track, remoteStream)
        })
    })


}

const prepareAndSendIceCandidates = async (userName,status)=> {
    peerConnection.onicecandidate = (e) => {
        // console.log("fsdfsdf ",)
        if(e.candidate){
            let iceobject = {
                "candidate":e.candidate,
                "userName": userName,
                "didIOffer":status
            }
            if(status == true){
                 socket.emit("sendIceCandidateToSignalingServer" , iceobject);
            }else{
                let c = socket.emitWithAck("sendIceCandidateToSignalingServer" , iceobject);
                addNewIceCandidate(c)
            }
            
            console.log("signal emmited")
        }
    }
}
   const addNewIceCandidate = async (iceCandidate) => {
            await peerConnection.addIceCandidate(iceCandidate);
            console.log("============Added Ice Candidate===========")
            console.log(peerConnection)
        }



//addNewIceCandidate(offerIceCandidateArray);

document.getElementById("call").addEventListener("click", async () => {
    await call()
})