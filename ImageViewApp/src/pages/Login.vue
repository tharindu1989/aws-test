<template>
  <q-layout view="lHh Lpr lFf">
    <q-page class="flex flex-center">
      <q-btn color="primary" label="Login" @click="loginUsingFacebook()"/>
    </q-page>
  </q-layout>
</template>

<script>
import firebase from 'firebase'
import state from '../plugins/State'
export default {
  // name: 'PageName',
  methods: {
    loginUsingFacebook () {
      const provider = new firebase.auth.FacebookAuthProvider()
      provider.addScope('user_photos')
      // firebase.auth().signInWithRedirect(provider)
      firebase.auth().signInWithPopup(provider).then((result) => {
        var token = result.credential.accessToken
        state.prototype.accessToken = token
        this.$router.replace('dashboard')
      }).catch((err) => {
        alert('Oops. ' + err.message)
      })
    }
  }
}
</script>

<style>
</style>
