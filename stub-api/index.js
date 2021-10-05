const express = require('express')
const cors = require('cors')
const generatePayments = require('./generate-payments')
const multiPageResponse = require('./multi-page-response')

const app = express()
app.use(cors())

const payments = generatePayments(70)
app.get('/api/payments', multiPageResponse(payments))

app.listen(9001)