<template>
  <div id="tab-detail">
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">Title</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input v-model="item.title" type="text" name="title" class="input">
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Status</label>
      </div>
      <div class="field-body">
        <div class="field is-narrow">
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="item.status">
                <option value="new">New</option>
                <option value="in progress">In progress</option>
                <option value="done">Done</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">Note</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input v-model="item.note" type="text" name="note" class="input">
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">URL</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input v-model="item.url" type="text" name="url" class="input">
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Account</label>
      </div>
      <div class="field-body">
        <div class="field is-narrow">
          <div class="select is-fullwidth">
            <select v-model="item.account">
              <option v-for="account in $store.state.accounts">
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">No padding</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox">
              Checkbox
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['item']
}
</script>
