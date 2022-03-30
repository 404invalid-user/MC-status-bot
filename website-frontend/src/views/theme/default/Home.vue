<script>
import axios from 'axios'
// @ is an alias to /src

export default {
  name: 'Home',
  components: {},
  props: {
    me: Object,
    bot: Object
  },
  data() {
    return {
      languages: [
        {
          iso: 'en',
          flag: '🇬🇧'
        }
      ],
      language: { e: 'e' },
      serverip: ''
    }
  },
  methods: {
    translate(text) {
      if (this.me.lan == 'en') return text
      return this.language[text]
    },
    openLanMenu() {
      axios
        .get('/api/languages')
        .then((response) => {
          this.languages = response.data.data
        })
        .catch((err) => {
          console.log('[/api/languages]: ' + err.stack || err)
        })
      document.getElementById('lan-menu').style.display = 'inline-flex'
    },
    async selectLan(key) {
      this.me.lan = key
      await axios.post('/api/me', { data: this.me }).catch((err) => {
        console.log('[/api/me]: ' + err.stack || err)
      })

      document.getElementById('lan-menu').style.display = 'none'
      window.location.href = '/'
    },
    quickStatus() {
      this.$router.push('/status/' + this.serverip)
    }
  },
  beforeMount() {
    if (this.me.options.ip !== '') {
      this.serverip = this.me.options.ip
    }
  }
}
</script>

<style scoped>
#lan-menu {
  display: inline-flex;
  position: absolute;
  background-color: #333;
  display: none;
}
.home {
  margin: 0;
  padding: 0;
  min-width: 100%;
  width: 100%;
  max-width: 100%;
  min-height: 100%;
  background-color: wheat;
  font-family: 'Ubuntu', sans-serif;
  background-image: url('~@/../public/img/background_light.jpg');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
  min-height: 100vh;
  overflow: hidden;
  color: #333;
}
.home.dark {
  background-color: rgb(24, 19, 12);
  background-image: url('~@/../public/img/background_dark.jpg');
  color: #ffffff;
}

.title {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 26px;
}

h1 {
  margin: 0;
  padding: 0;
  font-size: 7rem;
}
h2 {
  margin: 0;
  padding: 0;
}

.buttons {
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 34px;
}
.btn-options {
  justify-content: center;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.button {
  width: 270px;
}
input {
  margin-left: 7px;
  height: 18px;
  width: 159px;
  /* background-color: #6d6d6d; */
  color: black;
  height: 70%;
}
@media screen and (max-width: 660px) {
  .button {
    max-width: 35%;
  }
}
.button-big {
  width: 571px;
  height: 48px;
  background-repeat: repeat;
  max-width: 90%;
}

.button.o {
  width: 50px;
  height: 50px;
}

.sch {
  font-size: 1.3em;
  overflow: hidden;
  color: #fff;
  background: #7964e4;
  display: inline-block;
  position: absolute;
  z-index: 1;
  right: 0;
  top: 34vh;
  border-radius: 6px;
  padding: 1.5px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* transform: translateX(210px); */
  animation-name: slideaway;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-delay: 0.9s;
  transition: all 1s;
  cursor: pointer;
}

.sch a {
  align-items: center;
  align-content: center;
  text-align: center;
  color: #ffffff;
  text-decoration: none;
}

.sch a:hover {
  color: #e9e9e9;
  text-decoration: none;
}

.sch img {
  height: 34px;
}

.sch .smowl {
  display: block;
  margin-right: 6px;
}

.sch:hover {
  animation-name: slideback;
  animation-duration: 2s;
  animation-fill-mode: forwards;
  animation-delay: 0s;
}

@keyframes slideaway {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(289px);
  }
}

@keyframes slideback {
  from {
    transform: translateX(289px);
  }
  to {
    transform: translateX(0px);
  }
}
</style>

<template>
  <body>
    <div class="sch">
      <a href="/snakecraft"> <img class="smowl" src="/img/Snakecraft-Hosting.png" alt="sch logo" /></a
      ><a href="https://www.mcstatusbot.site/snakecraft?ref=home-page">Hosted by Snakecraft Hosting</a>
    </div>
    <div :class="[me.options.darkMode ? 'dark' : '', 'home']">
      <div id="lan-menu">
        <div @click="selectLan(key)" :class="[me.options.darkMode ? 'dark' : '', 'button']" v-for="(item, key) in languages" :key="languages[key]['iso']">
          {{ languages[key]['flag'] }} - {{ languages[key]['iso'] }}
        </div>
      </div>
      <div :class="[me.options.darkMode ? 'dark' : '', 'title']">
        <h1>MC-status</h1>
        <h2>{{ translate('the only bot you will ever need for minecraft') }}</h2>
      </div>
      <div :class="[me.options.darkMode ? 'dark' : '', 'buttons']">
        <router-link to="/dashboard" :class="[me.options.darkMode ? 'dark' : '', 'button button-big']">{{ translate('Dashboard') }}</router-link>
        <a :class="[me.options.darkMode ? 'dark' : '', 'button button-big']" @click="quickStatus"
          >{{ translate('Quick status for') }} <input type="text" v-model="serverip" placeholder="snekmc.schost.us" v-on:click.stop
        /></a>
        <a href="https://www.mcstatusbot.site/discord?ref=site-home" :class="[me.options.darkMode ? 'dark' : '', 'button button-big']">{{ translate('Support Server') }}</a>
        <router-link to="/about" :class="[me.options.darkMode ? 'dark' : '', 'button button-big']">{{ translate('README (about)') }}</router-link>
        <a href="https://github.com/404invalid-user/MC-status-bot/" :class="[me.options.darkMode ? 'dark' : '', 'button button-big']">{{ translate('Github') }}</a>
        <div class="btn-options">
          <a :class="[me.options.darkMode ? 'dark' : '', 'button o']" @click="openLanMenu">🌎</a>
          <a :class="[me.options.darkMode ? 'dark' : '', 'button']">{{ translate('Options') }}</a>
          <router-link to="/bug" :class="[me.options.darkMode ? 'dark' : '', 'button']">{{ translate('Report Bug') }}</router-link>
          <a :class="[me.options.darkMode ? 'dark' : '', 'button o']" @click="me.options.darkMode = !me.options.darkMode">{{ me.options.darkMode ? '☀️' : '🌑' }}</a>
        </div>
      </div>
      <a href="https://github.com/404invalid-user/MC-status-bot/blob/master/LICENSE" style="float: left; color: white">mc-status v2.3.4</a
      ><a style="float: right; color: white">&copy; mcstatusbot.site</a>
    </div>
  </body>
</template>
