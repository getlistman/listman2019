<template>
  <div id="tab-description">
    <div id="editor" v-html="item.description">
    </div>
  </div>
</template>
<script>
export default {
  props: ['item'],
  mounted () {
  }
}
</script>
