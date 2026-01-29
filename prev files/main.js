let localStream;
let remoteStream;

let socket = new WebSocket("ws://localhost:8007")

socket.addEventListener('open', (event) => {
    console.log('Connected to the WebSocket server', event);
    // You can send a message immediately after the connection is open
    // socket.send('Hello Server!'); 
});

socket.addEventListener("message", async (e) => {

 
let data = JSON.parse(e.data)
    if(data.type == "sendCreatedOffer"){
        let d = JSON.parse(data.createOfferData)
        //console.log("offer received :", d )
        let createAnswerData = await createAnswer(d)
        console.log("Sdasdasdasd",createAnswerData)
        let answerObject =  {
            "type" : "answerData",
            "data" : JSON.stringify(createAnswerData)
        }
        socket.send(JSON.stringify(answerObject))
        
    }


    if(data.type == "answerData"){
        console.log("tyrtyrtyrtyrty")
        let d = JSON.parse(data.data)
        let ans = await addAnswer(d)
        console.log("add answer :-" , ans)
    }

})


let createAndSendOfferBtn = document.getElementById("createOfferAndSend")
createAndSendOfferBtn.addEventListener("click", async () => {
    console.log("btn clicked")
    let offer = await createOffer()
    let object = {
        "type":"sendCreatedOffer",
        "createOfferData" : JSON.stringify(offer) 
    }
    socket.send(JSON.stringify(object));
    console.log("sent object:-",object)
    console.log("data sent")


})

//STUN Server that we are contacting in order to get our Public IP  
const server = {
    iceServers : [
        {
            urls:['stun:stun1.l.google.com:19302','stun:stun2.l.google.com:19302']
        }
    ]
}

let peerConnection = new RTCPeerConnection(server);

let init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({video : true , audio : false})
    remoteStream = new MediaStream()
    document.getElementById("user-2-video").srcObject = remoteStream
    document.getElementById("user-1-video").srcObject = localStream
   
    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track);
    });
}

let createOffer = async () => {
    // peerConnection = new RTCPeerConnection() //new RTCPeerConnection() creates a WebRTC call manager inside the browser. It does not start a call or send any data; it simply prepares everything needed for a future real-time connection. This object knows how to handle video/audio tracks, discover network paths, negotiate call details with the other peer, and keep the communication secure. Think of it as setting up the phone and network rules before dialing—nothing happens yet, but without this step, a WebRTC call is impossible.
    // console.log("Creating new peer Connection :-",peerConnection)
   let iceCandidateArray = []
    peerConnection.onicecandidate = async (event) => {
        if(event.candidate){
            iceCandidateArray.push(event)
            console.log("new Ice candidate :-" , event) 
        }
    }

   const offer = await peerConnection.createOffer();
   console.log("created offer :-",offer)
   await peerConnection.setLocalDescription(offer)
   return peerConnection.localDescription;

}

let createAnswer = async (d) => {
    console.log("creating answer from 2nd peer side")
    let remotePeerOffer = d;
    let iceCandiadteArray = []
    peerConnection.onicecandidate = async (event) => {
           if(event.candidate){
              iceCandiadteArray.push(event.candidate)
              console.log("new ice candidate :-",event.candidate)
           }
    }
    await peerConnection.setRemoteDescription(remotePeerOffer)

    let answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    return answer;
}

let addAnswer = async () => {
    console.log("add answer triggered")
    let answer = null;
    console.log("Current Remote Description :- ".peerConnection.currentRemoteDescription)
    if(!peerConnection.currentRemoteDescription){
        peerConnection.setRemoteDescription(answer)
    }
}
init()