<template>
  <div class="container is-fluid">
    <div class="columns">
      <div v-if="$store.state.user" class="column is-narrow"
           :class="{ 'is-hidden-mobile': !$store.state.isNavBarActive }">
        
        <aside class="menu">
          <ul class="menu-list">
            <li>
              <router-link :to="createNew" class="button is-small is-fullwidth">
                <span class="icon is-small">
                  <i class="fas fa-edit" aria-hidden="true"></i>
                </span>
                <span>Create</span>
              </router-link>
            </li>
          </ul>
          <p class="menu-label">
            <span class="icon">
              <i class="fa fa-list" aria-hidden="true"></i>
            </span>
            {{ $route.params.list }}
          </p>
          <router-view name="filterTree"></router-view>
          <hr/>
          <p class="menu-label">
            <span class="icon">
              <i class="fas fa-user" aria-hidden="true"></i>
            </span>
            Account
          </p>
          <ul class="menu-list">
            <li>
              <router-link to="/settings">
                <span class="icon">
                  <i class="fa fa-cog" aria-hidden="true"></i>
                </span>
                Settings
              </router-link>
            </li>
            <li>
              <a @click="signOut" href="/">
                <span class="icon">
                  <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                </span>
                Sign Out
              </a>
            </li>
          </ul>
          <hr/>
        </aside>
      </div>
      <div class="column">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'

export default {
  
  computed: {
    createNew () {
      return '/' + this.$route.params.list + '/' + this.$route.params.filter.replace(/\//g, '%2F') + '/new/detail'
    }
  },
  
  methods: {
    
    toggleDropdown () {
      this.$store.commit('toggleDropdown')
    },
    
    signOut () {
      Auth.signOut().then(data => {
        //this.$router.go('/')
      }).catch(err => {
        console.log(err)
      })
    },
  }
}

</script>
