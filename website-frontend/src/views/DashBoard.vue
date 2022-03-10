<script>
// @ is an alias to /src
import axios from 'axios'
import Message from '@/views/theme/default/components/Message.vue'
import Loading from '@/components/Loading.vue'
import DefaultThemeDashboard from '@/views/theme/default/Dashboard.vue'

export default {
  name: 'Dashboard',
  components: {
    Message,
    DefaultThemeDashboard,
    Loading
  },
  data() {
    return {
      language: {},
      ready: false,
      me: {
        local: 'en',
        options: {
          darkMode: false,
          theme: 'default'
        }
      },
      message: {
        show: false,
        error: false,
        content: ''
      }
    }
  },
  props: {
    bot: Object
  },
  methods: {
    translate(text) {
      
      if (this.me.lan == 'en') return text
      return language[text]
    },
    getStatus(data, status) {
      const dataStr = data.toString();
      if(dataStr.startsWith("Error:")) {
        if (dataStr.endsWith(status.toString())) {
          return true;
        }
      }
      return false;
    }
  },
  beforeMount() {
    //get user
    axios
      .get('/api/me')
      .then((response) => {
        this.me = response.data.me;
        if (this.me.lan !== 'en') {
          //get users language
          axios
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
        //ready the page and stop showing load icon
        this.ready = true
      })
      .catch((e) => {
        console.log("[/api/me]: " + e.stack || e);
        console.log(e.toString())
        if(this.getStatus(e, 401)) {
          return window.location.href = '/login';
        }
        this.message.content = 'Could not fetch your data try refreshing'
        this.message.error = true
        this.message.show = true
      })
  }
}
</script>

<template>
  <body>
    <Message v-if="message.show" :message="message" :translate="(d) => {return d}"/>
    <Loading v-if="!ready" />
    <DefaultThemeDashboard v-else-if="ready && me.options.theme == 'default'" :bot="bot" :me="me" :translate="translate" />
  </body>
</template>
