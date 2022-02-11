const express = require('express')
const axios = require('axios')
const RSVP = require('rsvp')

let app = express();
let port = 8000

let respFromServer = (endpoint) =>{
    return axios.get(`http://${endpoint}`)
};



app.get('/I/want/title/', async(req, resp) => {

    // take out the querystring present

    address = req.query
    let respArray = []

    // checking whether multiple querystrings or not
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
        endpoints = address['address']
        // get promises for each request
        let promises = endpoints.map(element => {
            return respFromServer(element)
        });
        // resolve the promises
        RSVP.all(promises)
            .then(res =>{
                // resolve all the responses and send to client

                for (let index = 0; index < res.length; index++) {
                    let re = res[index]
                    data = re.data
                    let title = data.substring(data.indexOf('<title>')+7, data.lastIndexOf('</title>'))
                    respArray.push(title)
                    console.log(title)
                }
                resp.send(`
        <!DOCTYPE html>
<html>

<head></head>

<body>
    <h1> Following are the titles of given websites: </h1>
    <ul>
        ${respArray}
    </ul>
</body>

</html>    
        `)
            })
    }
})

// server listening
app.listen(port, () => {
    console.log(`Server is listening at ${port}`)
})