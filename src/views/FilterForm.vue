<template>
  <div class="box" id="filterFormBox">
    <a @click="toggleFilterForm" class="delete is-pulled-right"></a>
    <div class="columns">
      <div class="column field is-narrow">
        <label class="label">
          <span class="icon is-small">
            <i class="fas fa-filter"></i>
          </span>
          Filter by
        </label>
        <div class="field has-addons" v-for="(q, idx) in filter.queries">
          <p class="control">
            <span class="select is-small">
              <select v-model="q.field">
                <option value="" disabled hidden>(field)</option>
                <option v-for="field in list.fields" :value="field.field">
                  {{ field.name }}
                </option>
              </select>
            </span>
          </p>
          <p class="control">
            <span class="select is-small">
              <select v-model="q.condition">
                <option value="" disabled hidden>(condition)</option>
                <option>is equal to</option>
                <option>is not equal to</option>
                <option>contains</option>
                <option>does not contain</option>
              </select>
            </span>
          </p>
          <p class="control">
            <input v-model="q.value" class="input is-small" type="text" placeholder="Keyword">
          </p>
          <p class="control">
            <button @click="deleteQuery(idx)" class="button is-small">
              <span class="icon is-small">
                <i class="fa fa-times" aria-hidden="true"></i>
              </span>
            </button>
          </p>
        </div>
        <a @click="addQuery" class="button is-text is-small">Add filter</a>
      </div>
      <div class="column field is-narrow">
        <label class="label">
          <span class="icon is-small">
            <i class="fas fa-sort-amount-down"></i>
          </span>
          Sort by
        </label>
        <div class="field has-addons" v-for="(s, idx) in filter.sorting">
          <p class="control">
            <span class="select is-small">
              <select v-model="s.field">
                <option value="" disabled hidden>(field)</option>
                <option v-for="field in list.fields" :value="field.field">
                  {{ field.name }}
                </option>
              </select>
            </span>
          </p>
          <p class="control">
            <span class="select is-small">
              <select v-model="s.order">
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </span>
          </p>
          <p class="control">
            <button @click="deleteSorting(idx)" class="button is-small">
              <span class="icon is-small">
                <i class="fa fa-times" aria-hidden="true"></i>
              </span>
            </button>
          </p>
        </div>
        <a @click="addSorting" class="button is-text is-small">Add sorting</a>
      </div>
      <div class="column field is-narrow">
        <label class="label">
          <span class="icon is-small">
            <i class="fas fa-columns"></i>
          </span>
          Columns to display
        </label>
        <div class="field has-addons" v-for="(c, idx) in filter.columns">
          <p class="control">
            <span class="select is-small">
              <select v-model="filter.columns[idx]">
                <option value="" disabled hidden>(field)</option>
                <option v-for="field in list.fields" :value="field.field">
                  {{ field.name }}
                </option>
              </select>
            </span>
          </p>
          <p class="control">
            <button @click="deleteColumn(idx)" class="button is-small">
              <span class="icon is-small">
                <i class="fa fa-times" aria-hidden="true"></i>
              </span>
            </button>
          </p>
        </div>
        <a @click="addColumn" class="button is-text is-small">Add column</a>
      </div>
      <div class="column is-narrow">
        <label class="label">
          <span class="icon is-small">
            <i class="fas fa-sitemap"></i>
          </span>
          Drill down
        </label>
        <div class="field has-addons" v-for="(c, idx) in filter.drilldowns">
          <p class="control">
            <span class="select is-small">
              <select v-model="filter.drilldowns[idx]">
                <option value="" disabled hidden>(field)</option>
                <option v-for="field in list.fields" :value="field.field">
                  {{ field.name }}
                </option>
              </select>
            </span>
          </p>
          <p class="control">
            <button @click="deleteDrillDown(idx)" class="button is-small">
              <span class="icon is-small">
                <i class="fa fa-times" aria-hidden="true"></i>
              </span>
            </button>
          </p>
        </div>
        <a @click="addDrillDown" class="button is-text is-small">Add drill down</a>
      </div>
      <div class="column is-narrow">
        <div class="field">
          <label class="label">Filter name</label>
          <div class="control">
            <input class="input is-small" type="text" v-model="filter.name">
          </div>
        </div>
      </div>
    </div>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <button @click="saveFilter" class="button is-info is-small">
            <span class="icon is-small">
              <i class="fa fa-save" aria-hidden="true"></i>
            </span>
            <span>Save</span>
          </button>
        </div>
        <div class="level-item">
          <button @click="createFilter" class="button is-info is-small">
            <span class="icon is-small">
              <i class="fa fa-save" aria-hidden="true"></i>
            </span>
            <span>Save as a new filter</span>
          </button>
        </div>
        <div class="level-item">
          <button @click="toggleFilterForm" class="button is-light is-small">
            <span>Cancel</span>
          </button>
        </div>
        <div class="level-item">
          <a @click="deleteFilter" class="button is-text is-small">
            Delete this filter
          </a>
        </div>
        <div class="level-item">
          <a @click="restoreDefaultFilters" class="button is-text is-small">
            Restore default filters
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  
  data () {
    return {
      filter: {
        name: ''
      }
    }
  },
  
  computed: {
    list() {
      return this.$store.state.lists.find(list => list.name == this.$route.params.list)
    }
  },
  
  created () {
    this.handleRouteChange()
  },
  
  watch: {
    $route: 'handleRouteChange',
    filter: {
      handler: function () {
        this.$store.dispatch('callApi', { action: 'fetchItems',
                                          list: this.$route.params.list,
                                          filter: this.$route.params.filter,
                                          filterForm: this.filter,
                                          page: 1 })
      },
      deep: true // https://vuejs.org/v2/api/#watch
    }
  },
  
  methods: {
    
    handleRouteChange () {
      let path = this.$route.params.filter.split(',')
      let arr = path[path.length-1].split(/:/)
      let refFilter = this.list.filters.find(filter => filter.name == arr[0])
      this.filter = JSON.parse(JSON.stringify(refFilter)) // deep copy
    },
    
    saveFilter () {
      let apiData = {
        action: 'saveFilter',
        listName: this.list.name,
        filter: this.filter
      }
      this.$store.dispatch('callApi', apiData).then(r => {
        this.$store.commit('toggleFilterForm')
        this.$router.replace('/' + this.list.name + '/' + this.filter.name)
      })
    },
    
    createFilter () {
      delete this.filter._id
      let apiData = {
        action: 'saveFilter',
        listName: this.list.name,
        filter: this.filter
      }
      this.$store.dispatch('callApi', apiData).then(r => {
        this.$store.commit('toggleFilterForm')
        this.$router.replace('/' + this.list.name + '/' + this.filter.name)
      })
    },
    
    deleteFilter () {
      let apiData = {
        action: 'deleteFilter',
        listName: this.list.name,
        filter: this.filter
      }
      this.$store.dispatch('callApi', apiData).then(r => {
        this.$store.commit('toggleFilterForm')
        this.$router.replace('/' + this.list.name + '/' + this.list.filters[0].name)
      })
    },
    
    restoreDefaultFilters () {
      let apiData = {
        action: 'restoreDefaultFilters',
        listName: this.list.name
      }
      this.$store.dispatch('callApi', apiData).then(r => {
        this.$store.commit('toggleFilterForm')
        this.$router.replace('/' + this.list.name + '/' + this.list.filters[0].name)
      })
    },
    
    addQuery () {
      const idx = this.filter.queries.length
      this.$set(this.filter.queries, idx, { field: '', condition: '', value: '' })
    },
    
    addSorting () {
      const idx = this.filter.sorting.length
      this.$set(this.filter.sorting, idx, { field: '', order: 'asc' })
    },
    
    addColumn () {
      const idx = this.filter.columns.length
      this.$set(this.filter.columns, idx, '')
    },
    
    addDrillDown () {
      if (this.filter.drilldowns) {
        const idx = this.filter.drilldowns.length
        this.$set(this.filter.drilldowns, idx, '')
      } else {
        this.$set(this.filter, 'drilldowns', [ '' ])
      }
      console.log('addDrillDown()')
      console.dir(this.filter)
    },
    
    deleteQuery (idx) {
      this.$delete(this.filter.queries, idx)
    },
    
    deleteSorting (idx) {
      this.$delete(this.filter.sorting, idx)
    },
    
    deleteColumn (idx) {
      this.$delete(this.filter.columns, idx)
    },

    deleteDrillDown (idx) {
      this.$delete(this.filter.drilldowns, idx)
    },

    toggleFilterForm () {
      this.$store.commit('toggleFilterForm')
    }
  }
}
</script>
