const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')

// We'll create this file later
const { signedUrl,bucketItems } = require('./middleware/s3')

// Pull configuration variables from the environment
const awsConfig = {
  accessKeyId: "AKIAJCGEMASJYZ5TPGLA",
  secretAccessKey: "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",
  region: "ap-southeast-1",
  bucket: "quasar-test-th",
}

// Enable CORS and process the body as JSON
app.use(cors())
app.use(bodyParser.json())

// get signed URL
// We are expecting the `filename` to be passed in the query
// http://localhost:3000/signed-url?filename=example.png
app.use('/signed-url',
  signedUrl(awsConfig),
)

app.get('/bucket-items',
  bucketItems(awsConfig),
)

const server = app.listen(3000, function () {
  console.log('Server listening on 3000')
})