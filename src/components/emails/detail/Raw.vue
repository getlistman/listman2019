<template>
  <div id="tab-raw" class="columns">
    <div class="column" style="max-width:1000px;">
      <pre>{{ item }}</pre>
    </div>
  </div>
</template>
<script>
export default {
  props: ['item']
}
</script>
