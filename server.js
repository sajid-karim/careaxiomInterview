const express = require('express')
const request = require('request')

let app = express();
let port = 8000


app.get('/I/want/title/', (req, resp) => {

    address = req.query
    let respArray = []
    if (typeof (address['address']) === 'string') {
        reqUrl = address['address']
        request(`http://${reqUrl}`, (err, res, body) => {
            if (err) {
                console.log(`${err}`)
            }

            let title = body.substring(body.indexOf('<title>') + 7, body.lastIndexOf('</title>'))
            resp.send(`
                                    <!DOCTYPE html>
                                    <html>
                                        
                                        <head></head>
                                        
                                        <body>
                                            <h1> Following are the titles of given websites: </h1>
                                            <ul>
                                                ${title}
                                            </ul>
                                        </body>
                                        
                                    </html>    
                    `)

        })
    }
    else {
        endpoints = address['address']
        len = endpoints.length
        respArray = [len]
        responses = endpoints.map((endpoint) => {
            request(`http://${endpoint}`, (err,res,body)=>{
            if(err)
            {
                console.log(err)
                resp.send(err)
            }

            if(body)
            {
                let title = body.substring(body.indexOf('<title>') + 7, body.lastIndexOf('</title>'))
                respArray.push(title)
                if(respArray.length === respArray[0])
                {
                    respArray.splice(0, 1)
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
                }
            }
                
            });
        })
    }
})

app.listen(port, () => {
    console.log(`Server is listening at ${port}`)
})
