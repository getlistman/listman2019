<template>
  <nav class="navbar is-fixed-top">
    <div class="navbar-brand">
      <router-link v-for="list in $store.state.lists" :key="list.name"
                   :to="'/' + list.name + (list.filters.length ? '/' + list.filters[0].name : '')"
                   class="navbar-item is-tab is-capitalized"
                   :class="{ 'is-active': isActiveTab(list.name) }">
        <span class="icon">
          <i :class="list.icon"></i>
        </span>
        <span class="is-hidden-mobile">
          {{ list.name }}
        </span>
      </router-link>
      <div class="navbar-item" v-if="notification">
        <span class="tag is-dark">{{ notification }}</span>
      </div>
      <div class="navbar-burger" @click="toggleNavBar()"
           :class="{ 'is-active': $store.state.isNavBarActive }">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    list () {
      return this.$store.state.lists.find(list => list.name == this.$route.params.list)
    },
    notification () {
      return this.$store.state.notification
    }
  },
  methods: {
    
    toggleNavBar () {
      this.$store.commit('toggleNavBar')
    },
    
    clearNotification () {
      this.$store.commit('clearNotification')
    },
    
    isActiveTab (listName) {
      return this.list && listName == this.list.name
    }
    
  }
}
</script>
