<template>
  <div class="container is-fluid">
    <div class="columns">
      <div class="column is-narrow">
        <aside class="menu">
          <p class="menu-label">
            User Setting
          </p>
        </aside>
      </div>
      <div class="column">
        <div>
          <h1 class="title is-5">Settings</h1>
          <hr/>
          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label">Username</label>
            </div>
            <div class="field-body">
              <div class="field">
                {{ username }}
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label">Time zone</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="select">
                  <select name="timezone">
                    <option v-for="name in timezones">{{ name }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label">Accounts</label>
            </div>
            <div class="field-body">
              <table class="table is-narrow">
                <thead>
                  <th>Account type</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th></th>
                </thead>
                <tbody>
                  <tr v-for="account in $store.state.accounts">
                    <td class="is-capitalized">
                      {{ account.tokens.refresh_token ? 'yes' : 'no' }}
                    </td>
                    <td>
                    </td>
                    <td>
                      {{ account.profile.emailAddress }}
                    </td>
                    <td>
                      <button @click="deleteAccount" class="button is-small">
                        <span>Remove</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <a href="/auth/auth0">Auth0</a>
          / <a href="/auth/google">Google</a>
          / <a href="/auth/twitter">Twitter</a>
          / <a href="/auth/facebook">Facebook</a>
          <hr/>
          <div class="field is-horizontal">
            <div class="field-label">
              <label class="label">Delete account</label>
            </div>
            <div class="field-body">
              <div class="field">
                <button @click="deleteUser" class="button is-danger">Delete account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'

export default {
  
  computed: {
    username () {
      return this.$store.state.user.username
    },
    timezone () {
      return moment.tz.guess()
    },
    timezones () {
      return moment.tz.names()
    }
  },
  
  asyncData ({ store }) {
    let apiData = {
      action: 'fetchAccounts'
    }
    return store.dispatch('callApi', apiData)
  },
  
  methods: {
    deleteUser () {
      let apiData = {
        action: 'deleteUser'
      }
      this.$store.dispatch('callApi', apiData).then(r => {
        this.$router.push('/')
      })
    },
    deleteAccount (provider, id) {
      
    },
    googleList () {
      this.$store.dispatch('callApi', { action: 'googleList' })
    }
  }
}
</script>
