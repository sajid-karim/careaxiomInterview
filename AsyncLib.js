const express = require('express')
const axios = require('axios')
const async = require('async');



let app = express();
let port = 8000


app.get('/I/want/title/', async(req, resp) => {

    console.log(req.query)
    address = req.query
    let respArray = []


    if(typeof(address['address']) === 'string'){
        reqUrl = address['address']
        await axios.get(`https://${reqUrl}`)
                .then(res =>{
                    console.log(res.data)
                })
                .catch(error =>{
                    console.log(error)
                })
    }
    else{
        let endpoints = address['address']
        let responses = []
        // get all the requests promises
        async
            .forEachOf(endpoints, (element, index, callback) => {
                axios.get(`http://${element}`)
                    // .then(res => res.json())
                    .then(res => {
                        responses[index] = res
                        callback(null)
                    })
                    .catch(err =>{
                        callback(err)
                    })
            }) // resolve all the promises return by the function
            .then(() => {
                for (let index = 0; index < responses.length; index++) {
                    let res = responses[index]
                    data = res.data
                    let title = data.substring(data.indexOf('<title>')+7, data.lastIndexOf('</title>'))
                    respArray.push(title)
                    console.log(title)
                    
                }
                resp.send(
                ` <!DOCTYPE html>
                    <html>
                    
                    <head></head>
                    
                    <body>
                        <h1> Following are the titles of given websites: </h1>
                        <ul>
                            ${respArray}
                        </ul>
                    </body>
                    
                    </html>`
                    
                )
            })
            .catch(err => console.log(err))
    }
})

// server listening
app.listen(port, () => {
    console.log(`Server is listening at ${port}`)
})