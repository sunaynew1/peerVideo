
// //on connection get all available offers and call createOfferEls
// socket.on('availableOffers',offers=>{
//     console.log(offers)
//     createOfferEls(offers)
// })

// //someone just made a new offer and we're already here - call createOfferEls
// socket.on('newOfferAwaiting',offers=>{
//     createOfferEls(offers)
// })

// socket.on('answerResponse',offerObj=>{
//     console.log("answer response recieved from the server for peer 1 remote:-",offerObj)
//     addAnswer(offerObj.answer)
// })

// socket.on('receivedFinalOfferFromServer',offerInOffers=>{
//     console.log("recieving final :-",offerInOffers)
//     addNewIceCandidate(offerInOffers)
//     console.log(offerInOffers)
// })

// socket.on('finalPackage',  (offerInOffers) => {
//     console.log("recieved final package on answerer side browser :-",offerInOffers)
//     for(let i = 0 ; i< offerInOffers.answerIceCandidate.length;i++){
//         addNewIceCandidate(offerInOffers.answerIceCandidate[i])
//     }
//     // for(let i =0; i<finalOffer.offerIceCandidates.length;i++){
//     //     await addAnswer(finalOffer.offerIceCandidates[i])
//     // }
// })

// function createOfferEls(offers){
//     //make green answer button for this new offer
//     const answerEl = document.querySelector('#answer');
//     offers.forEach(o=>{
//         console.log(o);
//         const newOfferEl = document.createElement('div');
//         newOfferEl.innerHTML = `<button class="btn btn-success col-1">Answer ${o.offererUserName}</button>`
//         newOfferEl.addEventListener('click',()=>answerOffer(o))
//         answerEl.appendChild(newOfferEl);
//     })
// }

// ======= SOCKET LISTENERS =======

// 1️⃣ When client connects, get all existing offers
socket.on('availableOffers', offers => {
    console.log("Available offers on connection:", offers);
    createOfferEls(offers);
});

// 2️⃣ When a new offer is made by another peer
socket.on('newOfferAwaiting', offerObj => {
    console.log("New offer received:", offerObj);
    createOfferEls([offerObj]); // wrap single offer in array for createOfferEls
});

// 3️⃣ When answer is received by the original offerer
socket.on('incomingAnswer', offerObj => {
    console.log("Answer received from answerer:", offerObj.answererUserName);
    addAnswer(offerObj.answer);

    // ✅ Flush any buffered ICE candidates that arrived before answer
    flushIceCandidates();
});

// 4️⃣ When an ICE candidate arrives from remote peer
socket.on('incomingIceCandidate', async ({ candidate, from }) => {
    console.log("ICE candidate received from", from, candidate);
    await addNewIceCandidate(candidate);
});

// ======= CREATE OFFER ELEMENTS =======
function createOfferEls(offers) {
    const answerEl = document.querySelector('#answer');

    offers.forEach(o => {
        // Skip if already created to prevent duplicates
        if (document.querySelector(`#offer-${o.offererUserName}`)) return;

        const newOfferEl = document.createElement('div');
        newOfferEl.id = `offer-${o.offererUserName}`;
        newOfferEl.innerHTML = `<button class="btn btn-success col-1">Answer ${o.offererUserName}</button>`;

        newOfferEl.querySelector('button').addEventListener('click', () => {
            answerOffer(o);
        });

        answerEl.appendChild(newOfferEl);
    });
}
