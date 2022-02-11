const express = require('express')
const axios = require('axios')


let app = express();
let port = 8000

app.get('/I/want/title/', async(req, resp) => {

    address = req.query
    let titles = []
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
        endpoints.map(element => {
            titles.push(axios.get(`http://${element}`))
        })
    }
    let respArray = []
    Promise.all(titles).then((result)=>{
        result.forEach((res)=>{
            data = res.data
            let title = data.substring(data.indexOf('<title>')+7, data.lastIndexOf('</title>'))
            respArray.push(title)
            console.log(title)
        })
        respArray.forEach((element,index)=>{
            respArray.splice(index,`<li>${element}</li><br>`)
        })
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
    
})

app.listen(port, () => {
    console.log(`Server is listening at ${port}`)
})