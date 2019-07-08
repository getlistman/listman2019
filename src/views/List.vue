<template>
  <div>
    <div>
      <div v-for="email in emails">
        <div>Subject: {{ email.subject }}</div>
        <div>From: {{ email.from }}</div>
      </div>
      <button @click="addTag">button</button>
    </div>
    <nav class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          <label class="checkbox">
            <button class="button is-small">
              <input type="checkbox" v-model="checkedAll" @click="checkAll">
            </button>
          </label>
        </div>
        <div class="level-item" v-if="!checkedItems.length">
          <label class="checkbox">
            <button @click="refreshList" class="button is-small" :class="{ 'is-loading': isSyncLoading }">
               <span class="icon is-small">
                 <i class="fa fa-sync"></i>
               </span>
            </button>
          </label>
        </div>
        <div class="level-item" v-if="checkedItems.length">
          <button @click="copyItems" class="button is-small">
            <span class="icon is-small">
              <i class="far fa-copy"></i>
            </span>
            <span>Copy</span>
          </button>
        </div>
        <div class="level-item" v-if="checkedItems.length">
          <button @click="deleteItems" class="button is-small">
            <span class="icon is-small">
              <i class="far fa-trash-alt"></i>
            </span>
            <span>Delete</span>
          </button>
        </div>
        <div class="level-item is-hidden-mobile">
          <div class="field has-addons">
            <p class="control">
              <input @keyup="fetchItems" v-model="keyword" class="input is-small"
                     type="text" placeholder="Find items">
            </p>
            <p class="control">
              <button @click="fetchItems" class="button is-small">
                Search
              </button>
            </p>
          </div>
        </div>
        <div class="level-item is-hidden-mobile">
          <button @click="toggleFilterForm" class="button is-link is-small">
            <span class="icon is-small">
              <i class="fas fa-filter"></i>
            </span>
            <span>Filter option</span>
          </button>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          {{ $store.state.paging.start }} - {{ $store.state.paging.end }}
          of {{ $store.state.paging.count }}
        </div>
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <router-link v-if="$store.state.paging.hasPrev" :to="prevPage"
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
              <router-link v-if="$store.state.paging.hasNext" :to="nextPage"
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
    
    <FilterForm v-if="$store.state.isFilterFormActive"/>
    
    <table v-if="filter" class="table is-narrow is-fullwidth">
      <thead>
        <tr>
          <th>
            
          </th>
          <th v-for="column in filter.columns"
              :class="{ 'is-hidden-mobile': column != 'subject' }">
            {{ getFieldName(column) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items">
          <td>
            <input type="checkbox" :value="item._id" v-model="checkedItems">
          </td>
          <router-view v-for="column in filter.columns" :item.sync="item" :column="column" :key="item._id + '.' + column"></router-view>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
import FilterForm from './FilterForm.vue'
import gql from 'graphql-tag'

export default {
  
  apollo: {
    emails: {
      query: gql`query emails {
          emails {
            subject
            from
          }
      }`
    }
  },
  
  data () {
    return {
      keyword: '',
      checkedItems: [],
      checkedAll: false,
      isSyncLoading: false
    }
  },
  
  asyncData ({ store, route: { params: { list, filter, page } } }) {
    let apiData = {
      action: 'fetchItems',
      list: list,
      filter: filter,
      page: page
    }
    return store.dispatch('callApi', apiData)
  },
  
  beforeRouteEnter (to, from, next) {
    let apiData = {
      action: 'fetchItems',
      list: to.params.list,
      filter: to.params.filter,
      page: to.params.page
    }
    next(vm => {
      vm.$store.dispatch('callApi', apiData).then(r => {})
    })
  },
  
  // https://router.vuejs.org/en/advanced/data-fetching.html
  beforeRouteUpdate (to, from, next) {
    let apiData = {
      action: 'fetchItems',
      list: to.params.list,
      filter: to.params.filter,
      page: to.params.page
    }
    this.$store.dispatch('callApi', apiData).then(r => {
      next()
    })
  },
    
  computed: {
    filterPath () {
      return this.$route.params.filter.split(':')
    },
    list () {
      return this.$store.state.lists.find(list => list.name == this.$route.params.list)
    },
    filter () {
      return this.list.filters.find(filter => filter.name == this.filterPath[0])
    },
    items () {
      return this.list.items
    },
    prevPage () {
      let page = this.$route.params.page ? parseInt(this.$route.params.page) : 1
      return '/' + this.$route.params.list + '/' + this.$route.params.filter.replace(/\//g, '%2F') + '/p' + (page - 1)
    },
    nextPage () {
      let page = this.$route.params.page ? parseInt(this.$route.params.page) : 1
      return '/' + this.$route.params.list + '/' + this.$route.params.filter.replace(/\//g, '%2F') + '/p' + (page + 1)
    }
  },
  
  components: {
    FilterForm: FilterForm
  },
  
  methods: {
    
    addTag() {
      this.$apollo.mutate({
        mutation: gql`mutation ($type: String!, $label: String!) {
          addTag(type: $type, label: $label) {
            id
            label
          }
        }`,
        variables: {
          type: "City",
          label: "Hino-shi"
        }
      })
    },
    
    getFieldName(field) {
      return this.list.fields.find(f => f.field == field).name
    },
    
    checkAll() {
      if (this.checkedAll) { // checkedAll is previous status before click
        this.checkedItems = []
      } else {
        this.checkedItems = Object.keys(this.items).map(i => this.items[i]._id)
      }
    },
    
    fetchItems() {
      let apiData = {
        action: 'fetchItems',
        list: this.$route.params.list,
        filter: this.$route.params.filter,
        page: this.$route.params.page
      }
      return this.$store.dispatch('callApi', apiData)
    },
    
    refreshList() {
      this.isSyncLoading = true
      let apiData = {
        action: 'refreshList',
        list: this.$route.params.list,
        filter: this.$route.params.filter,
        page: this.$route.params.page
      }
      this.$store.dispatch('callApi', apiData).then(() => {
        let apiData = {
          action: 'fetchFilterTree',
          listName: this.$route.params.list,
        }
        this.$store.dispatch('callApi', apiData).then(() => {
          this.isSyncLoading = false
        })
      })
    },
    
    copyItems() {
      let apiData = {
        action: 'copyItems',
        list: this.$route.params.list,
        item_ids: this.checkedItems
      }
      this.$store.dispatch('callApi', apiData)
    },
    
    deleteItems() {
      let apiData = {
        action: 'deleteItems',
        list: this.$route.params.list,
        item_ids: this.checkedItems
      }
      this.$store.dispatch('callApi', apiData)
    },
    
    toggleFilterForm () {
      this.$store.commit('toggleFilterForm')
    }
  }
}
</script>
