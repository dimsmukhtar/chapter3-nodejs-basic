const fs = require("fs")
const http = require("http")
const urll = require("url")
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
const replaceTemplate = (template, product)=>{
    let output = template.replace(/{%ProductName%}/g, product.productName)
    output = output.replace(/{%Image%}/g, product.image)
    output = output.replace(/{%Quantity%}/g, product.quantity)
    output = output.replace(/{%Price%}/g, product.price)
    output = output.replace(/{%Nutrients%}/g, product.nutrients)
    output = output.replace(/{%Description%}/g, product.description)
    output = output.replace(/{%From%}/g, product.from)
    output = output.replace(/{%id%}/g, product.id)

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not organic")
    if(product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "organic")

    return output
}
const data = fs.readFileSync(path.join(__dirname, "dev-data", "data.json"), "utf-8")
const dataObj = JSON.parse(data)

const overviewPage = fs.readFileSync(`${__dirname}/templates/overview.html`, "utf-8")
const productTemplate = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8")
const productCardTemplate = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8")
/// SERVER dengan HTTP
const server = http.createServer((req, res)=>{
    const { pathname: url, query} = urll.parse(req.url, true)

    // Hello Page
    if(url === "/hello"){
        res.end("Hello FSW 2")

    // Product Page
    } else if(url === "/productttt"){
        res.end(JSON.stringify({
            data: "Product"
        }))

    // Simple Api
    } else if(url === "/api"){
        res.writeHead(200, {"Content-Type": "application/json"})
        res.end(data)

    // Overview Page
    } else if(url === "/overview"){
        res.writeHead(200, {"Content-Type": "text/html"})

        const productCardsHtml = dataObj.map(el => replaceTemplate(productCardTemplate, el))
        const output = overviewPage.replace("{%ProductCard%}", productCardsHtml)
        res.end(output)
    } else if(url === "/product"){
        res.writeHead(200, {"Content-Type": "text/html"})
        const product = dataObj[query.id]
        const output = replaceTemplate(productTemplate, product)
        res.end(output)
    }
    else{
        res.writeHead(404, {"Content-Type": "text/html"})
        res.end("Url ini tidak ada")
    }
})

server.listen(8000, "127.0.0.1", function(){
    console.log("Server is running")
})