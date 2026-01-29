import {WebSocketServer} from "ws"
import { randomUUID } from "crypto";
import { PassThrough } from "stream";

const wss = new WebSocketServer({port : 8007})
let userCount = 0;
let userArray = []

console.log("server Started")
wss.on('connection' , (ws) => {
    userCount = userCount +1;
    ws.id=randomUUID()
    userArray.push(ws)
    console.log("user Connected :- #",userCount)

    ws.on("error :-", console.error);

    ws.on("message" , (data) => {
        
        let parsedData = JSON.parse(data)
        // console.log("message :-",JSON.parse(data))

        if(parsedData.type == "sendCreatedOffer"){
            
            // console.log("reached here")
            // console.log(parsedData)
            let newArr = userArray.filter(u => u.id != ws.id)
            // console.log("old array :-",userArray)
            // console.log("new array :-",newArr)
           for(let i=0;i<newArr.length;i++){
            console.log(newArr[i].id)
            let s = newArr[i]
            // console.log(`user ${i} :-`,s)
            s.send(JSON.stringify(parsedData))
           }
        }

        if(parsedData.type == "answerData"){
            // console.log("recived answer data")
            // console.log(parsedData)
            ws.send(JSON.stringify(parsedData))
        }
    })
} )