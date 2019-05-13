<template>
  <nav class="navbar is-fixed-top">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item is-tab is-capitalized">
        <span class="icon">
          <i class="fas fa-home"></i>
        </span>
        <span class="is-hidden-mobile">
          Home
        </span>
      </router-link>
      <router-link to="/signup" id="signup" class="navbar-item is-tab is-capitalized">
        <span class="icon">
          <i class="fas fa-user-plus"></i>
        </span>
        <span class="is-hidden-mobile">
          Sign Up
        </span>
      </router-link>
      <router-link to="/signin" id="signin" class="navbar-item is-tab is-capitalized">
        <span class="icon">
          <i class="fas fa-sign-in-alt"></i>
        </span>
        <span class="is-hidden-mobile">
          Sign In
        </span>
      </router-link>
    </div>
  </nav>
</template>
