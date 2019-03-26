<template>
  <div>
    <nav class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          <button @click="back" class="button is-small">
            <span class="icon">
              <i class="fa fa-angle-left" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div class="level-item">
          <button @click="save" class="button is-info is-small">
            <span class="icon is-small">
              <i class="fa fa-save" aria-hidden="true"></i>
            </span>
            <span>Save</span>
          </button>
        </div>
        <div class="level-item">
          <button @click="deleteItem" class="button is-info is-small">
            <span class="icon is-small">
              <i class="fa fa-trash-alt" aria-hidden="true"></i>
            </span>
            <span>Delete</span>
          </button>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          {{ $store.state.paging.position }} of {{ $store.state.paging.count }}
        </div>
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <router-link v-if="$store.state.paging.prevId"
                           :to="'/' + $route.params.list + '/' + $route.params.filter + '/' + $store.state.paging.prevId + '/' + $route.params.tab"
                           class="button is-small">
                <span class="icon is-small">
                  <i class="fa fa-angle-left"></i>
                </span>
              </router-link>
              <button v-else class="button is-small" disabled>
                <span class="icon is-small">
                  <i class="fa fa-angle-left"></i>
                </span>
              </button>
            </p>
            <p class="control">
              <router-link v-if="$store.state.paging.nextId"
                           :to="'/' + $route.params.list + '/' + $route.params.filter + '/' + $store.state.paging.nextId + '/' + $route.params.tab"
                           class="button is-small">
                <span class="icon is-small">
                  <i class="fa fa-angle-right"></i>
                </span>
              </router-link>
              <button v-else class="button is-small" disabled>
                <span class="icon is-small">
                  <i class="fa fa-angle-right"></i>
                </span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </nav>
    <div class="tabs">
      <ul>
        <li v-for="tab in tabs" :class="{ 'is-active': tab == $route.params.tab }">
          <router-link :to="tab" replace>
            <span class="is-capitalized">{{ tab }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <router-view :item.sync="item"></router-view>
  </div>
</template>

<script>
export default {
  
  asyncData ({ store, route: { params: { list, filter, id } } }) {
    if (id == 'new') {
      return
    }
    let apiData = {
      action: 'fetchItem',
      list: list,
      filter: filter,
      item_id: id
    }
    return store.dispatch('callApi', apiData)
  },
  
  beforeRouteEnter (to, from, next) {
    console.log('Detail.vue beforeRouteEnter')
    let apiData = {
      action: 'fetchItem',
      list: to.params.list,
      filter: to.params.filter,
      item_id: to.params.id
    }
    next(vm => {
      vm.$store.dispatch('callApi', apiData).then(r => {})
    })
  },
  
  // https://router.vuejs.org/en/advanced/data-fetching.html
  beforeRouteUpdate (to, from, next) {
    console.log('Detail.vue beforeRouteUpdate')
    let apiData = {
      action: 'fetchItem',
      list: to.params.list,
      filter: to.params.filter,
      item_id: to.params.id
    }
    this.$store.dispatch('callApi', apiData).then(r => {
      next()
    })
  },
   
  computed: {
    list() {
      return this.$store.state.lists.find(list => list.name == this.$route.params.list)
    },
    tabs() {
      return this.list.tabs
    },
    item() {
      // https://github.com/vuejs/vue/issues/1056
      // https://forum.vuejs.org/t/vuex-v-model-on-property-in-nested-object/6242/2
      // POINT: disconnect item from vuex
      if (this.$route.params.id == 'new') {
        return {}
      }
      let index = this.list.items.findIndex(e => e._id == this.$route.params.id)
      return Object.assign({}, this.list.items[index])
    }
  },
  
  methods: {
    save () {
      let apiData = {
        action: 'saveItem',
        list: this.$route.params.list,
        item: this.item
      }
      this.$store.dispatch('callApi', apiData).then(r => {
        this.$router.go(-1)
      })
    },
    
    deleteItem () {
      let apiData = {
        action: 'deleteItem',
        list: this.$route.params.list,
        item_id: this.item._id
      }
      this.$store.dispatch('callApi', apiData).then(r => {
        this.$router.go(-1)
      })
    },
    
    back () {
      this.$router.go(-1)
    }
  }
}
</script>
