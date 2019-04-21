const AWS = require('aws-sdk')

// Function takes an object with the file name.
// In the future you can add more query parameters here that can be considered when generating the S3 key
function getDropzone({ filename }, bucket, client) {
    // Here you decide what you want to name your S3 filename (key)
    var fileNameStr = Date.now() + filename.substr(filename.lastIndexOf('.'))
    
    const key = `images/${fileNameStr}`

    // Parmas that we use to create our signature
    const params = {
        Bucket: bucket,
        Expires: 3600,
        Conditions: [
            // This depicts the ACL the file will have when uploaded
            { 'acl': 'public-read-write' },
            { 'success_action_status': '201' },
            ['starts-with', '$Content-Type', ''],
            ['starts-with', '$key', ''],
        ],
    }

    // Use the aws-sdk method to create the signature
    const res = client.createPresignedPost(params)

    // Parameters taken straight from the example at
    // https://rowanwins.github.io/vue-dropzone/docs/dist/#/aws-s3-upload
    return {
        signature: {
            'Content-Type': '',
            'acl': 'public-read-write',
            'success_action_status': '201',
            key,
            ...res.fields, // Additional fields submitted as headers to S3
        },
        postEndpoint: res.url,
    }
}

exports.signedUrl = function signedUrl({ accessKeyId, secretAccessKey, region, bucket }) {
    // Start up a new S3 client
    const client = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        region,
    })
    return function (req, res, next) {
        // FIXME: Don't forget to lock this endpoint down with some authentication
        return res.json(getDropzone(req.query, bucket, client))
    }
}
exports.bucketItems = function getBucketItems({ accessKeyId, secretAccessKey, region, bucket }) {
    // Start up a new S3 client

    const s3client = new AWS.S3({
        accessKeyId,
        secretAccessKey,
        region,
    })
    const params = {
        Bucket: bucket,
        Prefix: 'images/'
    }

    return function(req, res, next) {

        s3client.listObjectsV2(params, function (err, data) {
            if (err) {
                res.send(err)
                console.log(err)
            } else {
                var imageItems  = []
                data.Contents.forEach(function(value){
                    var item = {
                        image:"https://s3-ap-southeast-1.amazonaws.com/quasar-test-th/" + value.Key,
                        id: value.ETag
                    }
                    imageItems.push(item)
                });
                res.json(imageItems);
                //console.log(data.Contents)
            }
        });
    }
}