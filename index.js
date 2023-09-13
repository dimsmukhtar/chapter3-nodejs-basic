const fs = require("fs")
const http = require("http")
const url = require("url")
const path = require("path")

//////////////////////////////////////////////////////////
/// FILE FS

// blocking code execution => synchronus
// const textIn = fs.readFileSync("./txt/read-this.txt")
// console.log(textIn.toString()) // jika tidak pakai toString, bisa pakai "utf-8" di samping filenya

// const textOut = `mas Imam fasil terbaik😍, penjelasan alpukat dr mas Imam : ${textIn}`
// fs.writeFileSync("./txt/output.txt", textOut)
// console.log("file succesfully created")

// non blocking code execution => asynchronus
// fs.readFile("./txt/start.txt", "utf-8", function(err, data){
//     if(err){
//         console.log(err)
//     } else {
//         console.log(`${data}`)
//         fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data2)=>{
//             console.log(data2)
//             fs.writeFile(`./txt/gabungan.txt`, `${data}\n${data2}`, (err)=>{
//                 console.log("succesfully created file gabungan data 1 dan 2")
//                 fs.readFile(`./txt/final.txt`, "utf-8", (err, data4)=>{
//                     console.log(data4)
//                     fs.writeFile("./text/gabungan2.txt", `${data}\n${data4}`, (err, data5)=>{
//                         console.log(data5)
//                     })
//                 })
//             })
//         })
//     }
// })

////////////////////////////////////////////////////
/// SERVER dengan HTTP
const server = http.createServer((req, res)=>{
    const url = req.url
    if(url === "/text"){
        fs.readFile("./txt/read-this.txt", "utf-8", function(err, data){
            if(err){
                console.log(err)
            } else{
                res.writeHead(200, {"Content-Type": "text/txt"})
                res.write(data)
                res.end()
            }
        })
    } else if(url === "/product"){
        res.end(JSON.stringify({
            data: "Product"
        }))
    } else if(url === "/api"){
        const filePath = path.join(__dirname, "dev-data", "data.json")
        const data = fs.readFileSync(filePath)
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(data)
    } else if(url === "/overview"){
        const filePath = path.join(__dirname, "templates", "overview.html")
        const overview = fs.readFileSync(filePath)
        res.writeHead(200, {"Content-Type": "text/html"})
        res.end(overview)
    }
    else{
        res.writeHead(404, {"Content-Type": "text/html"})
        res.end("Url ini tidak ada")
    }
})

server.listen(8000, "127.0.0.1", function(){
    console.log("Server is running")
})