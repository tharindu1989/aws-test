import AWS from 'aws-sdk'

var credentials = {
  accessKeyId: 'AKIAJCGEMASJYZ5TPGLA', secretAccessKey: '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', region: 'us-east-1'
}

AWS.config.update({ credentials: credentials, region: 'us-east-1' })

export const s3 = new AWS.S3()
export default ({ Vue }) => {
  Vue.prototype.$S3 = s3
}
