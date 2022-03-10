<script>
// @ is an alias to /src
import axios from 'axios'
import DefaultThemeHome from '@/views/theme/default/Home.vue'

export default {
  name: 'Home',
  components: {
    DefaultThemeHome
  },
  props: {
    bot: Object
  },
  data() {
    return {
      me: {
        local: 'en',
        options: {
          darkMode: false,
          theme: 'default',
          ip: 'snekmc.schost.us'
        }
      }
    }
  },
  methods: {},
  beforeMount() {
    axios.get('/api/me').then((response) => {
      if (response.status == 200) {
        this.me = response.data.me
      }
    })
  },
  created() {}
}
</script>

<template>
  <DefaultThemeHome v-if="me.options.theme == 'default'" :me="me" :bot="bot" />
</template>
