<template>
  <td>
    <template v-if="column == 'picture'">
      <figure class="image is-32x32">
        <img src="http://bulma.io/images/placeholders/32x32.png">
      </figure>
    </template>
    <template v-else-if="column == 'title'">
      <router-link :to="getDetailLinkURL(item._id)">
        {{ item[column] }}
      </router-link>
    </template>
    <template v-else>
      {{ item[column] }}
    </template>
  </td>
</template>
<script>
export default {
  props: [ 'item', 'column' ],
  methods: {
    getDetailLinkURL(_id) {
      return '/' + this.$route.params.list + '/' + this.$route.params.filter + '/' + _id + '/detail'
    }
  }
}
</script>
