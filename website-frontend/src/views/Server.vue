<script>
import axios from 'axios'
// @ is an alias to /src
import Loading from '@/components/Loading.vue'
import DefaultThemeServer from '@/views/theme/default/Server.vue'

export default {
  name: 'HomeView',
  components: {
    DefaultThemeServer,
    Loading
  },
  data() {
    return {
      ready: true,
      me: {
        lan: 'en',
        options: {
          darkMode: false
        }
      },
      server: {},
      language: {},
      message: { content: '', error: false, show: false },
      timezones: []
    }
  },
  methods: {},
  props: {
    bot: Object
  },
  async beforeMount() {
    //get user
    await axios
      .get('/api/me')
      .then((response) => {
        this.me = response.data.me;
      })
      .catch((e) => {
        console.log('[/api/me]: ' + e.stack || e)
        console.log(e.toString())
        if (this.getStatus(e, 401)) {
          return (window.location.href = '/login')
        }
        this.message.content = 'Could not fetch your data try refreshing'
        this.message.error = true
        this.message.show = true
      })
    if (this.me.lan !== 'en') {
      //get users language
      await axios
        .get('/api/language?lan=' + this.me.lan)
        .then((res) => {
          this.language = res.data
        })
        .catch((err) => {
          console.log('[/api/language]: ' + err.stack || err)
          this.message.content = 'Could not fetch your language try refreshing'
          this.message.error = true
          this.message.show = true
        })
    }
    //get server infromation
    await axios
      .get('/api/server?id=' + this.$route.params.guildid)
      .then((res) => {
        this.server = res.data.server
      })
      .catch((err) => {
        console.log('[/api/server]: ' + err.stack || err)
        if (err.toString() == 'Error: Request failed with status code 403') {
          this.message.content = 'You do not have access to this server'
          this.message.error = true
          this.message.show = true
        } else if (err.toString() == 'Error: Request failed with status code 404') {
          this.message.content = '404: This server does not exist'
          this.message.error = true
          this.message.show = true
        } else if (err.toString() == 'Error: Request failed with status code 500') {
          this.message.content = 'Unknow error please report this'
          this.message.error = true
          this.message.show = true
        }
      })
    await axios
      .get('/api/timezones')
      .then((res) => {
        this.timezones = res.data
      })
      .catch((err) => {
        console.log('[/api/timezones]: ' + err.stack || err)
        this.message.content = 'Unknow error when getting timezones'
        this.message.error = true
        this.message.show = true
        setTimeout(() => {
          this.message.content = ''
          this.message.error = false
          this.message.show = false
        }, 25000)
      })
    //ready the page and stop showing load icon
    this.ready = true
  }
}
</script>
<template>
  <Loading v-if="!ready" :message="message" />
  <DefaultThemeServer v-else-if="ready && me.options.theme == 'default'" :me="me" :server="server" :bot="bot" :message="message" :timezones="timezones" />
</template>
