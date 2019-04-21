<template>
<div class="column">
  <h5 class = "heading-text">Facebook Images</h5>
    <div class="row wrap">
      <div class = "item-wraper" v-for="imgs in imageId" :key="imgs.id">
        <img :src="imgs.webp_images[1].source" class="responsive" width="200" height="180"/>
      </div>
    </div>
    <q-btn v-if="!isConnected" class="image-cls" color="primary" label="Facebook Login" @click="loginUsingFacebook()"/>
  </div>
</template>

<script>
import state from '../plugins/State'
import { AUTH } from '../plugins/firebase'
import firebase from 'firebase'
export default {
  // name: 'PageName',
  data () {
    return {
      isConnected: false,
      name: '',
      email: '',
      personalID: '',
      FB: undefined,
      imageId: [],
      imageURL: ''
    }
  },
  methods: {
    getUploadImages () {
      var accessToken = state.prototype.accessToken
      if (accessToken) {
        this.isConnected = true
        var id = AUTH.currentUser.providerData[0].uid
        var url = 'https://graph.facebook.com/v3.2/' + id + '/photos/uploaded?fields=picture,webp_images&access_token=' + accessToken
        this.$axios.get(url).then((response) => {
          this.imageId = response.data.data
          this.email = 'test @email'
        }).catch(() => {
          this.$q.notify({
            color: 'negative',
            position: 'top',
            message: 'Loading failed',
            icon: 'report_problem'
          })
        })
      } else {
        this.isConnected = false
      }
    },
    imageURLM (id) {
      var accessToken = state.prototype.accessToken
      var url = 'https://graph.facebook.com/v3.2/' + id + '/?fields=picture.type(large)&access_token=' + accessToken
      this.$axios.get(url).then((response) => {
        this.imageURL = response.data.picture
      }).catch(() => {
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: 'Loading failed',
          icon: 'report_problem'
        })
      })
    },
    loginUsingFacebook () {
      const provider = new firebase.auth.FacebookAuthProvider()
      provider.addScope('user_photos')
      // firebase.auth().signInWithRedirect(provider)
      firebase.auth().signInWithPopup(provider).then((result) => {
        var token = result.credential.accessToken
        state.prototype.accessToken = token
        this.getUploadImages()
      }).catch((err) => {
        alert('Oops. ' + err.message)
      })
    }
  },
  created () {
    this.getUploadImages()
  }
}
</script>

<style>
.image-cls{
  margin: 15px;
}
</style>
