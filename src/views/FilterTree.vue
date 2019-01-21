<template>
  <ul :class="{ 'menu-list': depth == 0 }">
    <template v-for="menuItem in menuItems">
      <li>
        <router-link :to="getFilterUrl(menuItem.name)" :class="{ 'is-active': isActive(menuItem.name) }">
          {{ menuItem.name }}
          <span class="tag is-rounded is-pulled-right">
            {{ menuItem.count }}
          </span>
        </router-link>
        <FilterTree v-if="menuItem.kids && menuItem.name == path[depth]"
                    :arrKids="menuItem.kids"
                    :arrPath="[...arrPath, menuItem.name]"/>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  
  name: 'FilterTree', // required for recursive components
  
  // https://vuejs.org/v2/guide/components.html#Prop-Validation
  props: {
    arrKids: {
      type: Array
    },
    arrPath: {
      type: Array,
      default: () => []
    }
  },
  
  asyncData ({ store, route: { params: { list, filter } } }) {
    let apiData = {
      action: 'fetchFilterTree',
      listName: list
    }
    return store.dispatch('callApi', apiData)
  },
  
  computed: {
    depth () {
      return this.arrPath.length
    },
    list () {
      return this.$store.state.lists.find(list => list.name == this.$route.params.list)
    },
    menuItems () {
      if (this.depth == 0) {
        return this.list.filterTree
      } else {
        return this.arrKids
      }
    },
    path () {
      return this.$route.params.filter.split(':')
    }
  },
  
  methods: {
    getFilterUrl(menuItem) {
      // todo: should use encodeURIComponent but ugly
      let filterPath = [ ...this.arrPath, menuItem ].join(':').replace(/\//g, '%2F')
      return '/' + this.$route.params.list + '/' + filterPath
    },
    hasDrillDowns(menuItem) {
      let filter = null
      if (this.depth == 0) {
        filter = this.list.filters.find(filter => filter.name == menuItem)
      } else {
        filter = this.list.filters.find(filter => filter.name == this.arrPath[0])
      }
      return filter.drilldowns && filter.drilldowns.length > this.depth
    },
    isActive(menuItem) {
      return [ ...this.arrPath, menuItem ].join(':') == this.$route.params.filter
    }
  }
}
</script>
