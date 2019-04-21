<template>
  <div class="column">
    <h5 class = "heading-text">Uploaded Images</h5>
    <div class="row wrap">
      <div class = "item-wraper" v-for="item in imageList" :key="item.id">
        <img :src="item.image" class="responsive" width="100" height="80"/>
      </div>
    </div>
    <div class="upload-wrapper">
      <q-uploader method="PUT" :upload-factory="fetchSignatureAndPolicy" url="" color="tertiary" inverted float-label="Select Image to upload"
          :send-raw="true" :headers="{ 'x-amz-acl': 'public-read-write', 'content-type': 'binary/octet-stream' }"/>
    </div>
  </div>
</template>
<script>
import ObjectToFormData from 'object-to-formdata'
export default {
  // name: 'PageName',
  data () {
    return {
      imageList: []
    }
  },
  methods: {
    fileUpload (formData, updateProgress) {
      var headers = {
        'Content-Type': 'application/json'
      }
      updateProgress(0.5)
      this.$axios.post('https://s3-ap-southeast-1.amazonaws.com/quasar-test-th', formData, headers)
        .then(function (response) {
          updateProgress(1)
        })
        .catch((error) => {
          if (error) {
            console.log(error)
          }
        })
        .finally(() => {
          updateProgress(1)
          this.getUploadedImages()
        })
    },
    fetchSignatureAndPolicy (file, updateProgress) {
      updateProgress(0.1)
      this.$axios.post('http://localhost:3000/signed-url?filename=' + file.name).then((response) => {
        console.log(response)
        updateProgress(0.3)
        var responseData = response.data.signature
        var formData = ObjectToFormData(responseData)
        formData.append('file', file)
        this.fileUpload(formData, updateProgress)
      }).catch(function (response) {
        console.log(response)
      })
    },
    getUploadedImages () {
      this.$axios.get('http://localhost:3000/bucket-items').then((response) => {
        this.imageList = response.data
        console.log(response)
      }).catch(function (response) {
        console.log(response)
      })
    }
  },
  created () {
    this.getUploadedImages()
  }
}
</script>

<style>
  .upload-wrapper{
    margin: 10px;
  }
  .item-wraper{
    margin: 15px
  }
  .heading-text{
    margin-left: 10px;
    margin-top: 10px;
    margin-bottom: 15px;
  }
</style>
