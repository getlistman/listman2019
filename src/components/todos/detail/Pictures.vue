<template>
  <div id="tab-picture">
    <div class="columns">
      <div class="column is-2" v-for="image in images">
        <div class="card">
          <div class="card-image has-text-centered">
            <figure class="image is-1by1">
              <img :src="image">
            </figure>
          </div>
          <footer class="card-footer">
            <a class="card-footer-item">a</a>
            <a class="card-footer-item">a</a>
            <a class="card-footer-item">a</a>
          </footer>
        </div>
      </div>
    </div>
    <input type="file" @change="upload($event)">
  </div>
</template>

<script>
// https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
function _arrayBufferToBase64( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}

export default {
  data () {
    return {
      images: []
    }
  },
  props: ['item'],
  methods: {
    upload (event) {
      const store = this.$store
      const images = this.images
      const file = event.target.files[0] 
      console.dir(file)
      const reader = new FileReader()
      reader.onloadend = function(reader_event) {
        store.dispatch('callApi', { action: 'uploadImage',
                                    name: file.name,
                                    file: _arrayBufferToBase64(reader.result) }).then(r => {
                                      images.push(r.path)
                                    })
      }
      reader.readAsArrayBuffer(file)
    },
  }
}
</script>
