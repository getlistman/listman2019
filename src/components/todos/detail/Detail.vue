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
      <div class="field-label">
        <label class="label">Sub Title</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input v-model="item.subtitle" type="text" name="subtitle" class="input">
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
                {{ account.emails[0].value }}
              </option>
            </select>
          </div>
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
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
                <option value="trash">Trash</option>
              </select>
            </div>
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
