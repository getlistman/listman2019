<template>
  <div class="columns is-vcentered">
    <div class="column is-4 is-offset-4">
      <div class="box">
        <form v-on:submit.prevent>
          <div class="field">
            <label class="label">Username:</label>
            <p class="control">
              <input class="input" placeholder="Username" type="text" name="username" v-model="username">
            </p>
          </div>
          <div class="field">
            <label class="label">Password:</label>
            <p class="control">
              <input class="input" placeholder="Password" type="password" name="password" v-model="password" autocomplete="current-password">
            </p>
          </div>
          <div class="field is-grouped">
            <p class="control">
              <button @click="signIn" class="button is-primary" :class="{ 'is-loading': isLoading }">Sign in</button>
            </p>
            <p class="control">
              <router-link to="/" class="button">Cancel</router-link>
            </p>
          </div>
        </form>
      </div>
      <article v-if="message" class="message is-danger">
        <div class="message-body">
          {{ message }}
        </div>
      </article>
    </div>
  </div>
</template>

<script>
//import { Auth } from 'aws-amplify'
import Auth from '@aws-amplify/auth'

export default {
  
  data () {
    return {
      username: '',
      password: '',
      isLoading: false,
      message: ''
    }
  },
  
  methods: {
    signIn () {
      this.isLoading = true
      this.message = ''
      
      Auth.signIn(this.username, this.password).then(user => {
        this.$router.go('/')
      }).catch(err => {
        this.isLoading = false
        this.message = err.message ? err.message : err
      })
    }
  }
  
}
</script>
