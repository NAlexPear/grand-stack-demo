const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello web!'))

app.listen(8080, () => console.log('Web server listening on port 8080'))
