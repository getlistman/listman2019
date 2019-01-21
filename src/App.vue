<template>
  <div id="app">
    <Navbar v-if="$store.state.user"/>
    <NavbarGuest v-else/>
    <section class="section">
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import Navbar from './views/Navbar.vue'
import NavbarGuest from './views/NavbarGuest.vue'

export default {
  components: {
    Navbar: Navbar,
    NavbarGuest: NavbarGuest
  }
}
</script>
