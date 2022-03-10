<script>
// @ is an alias to /src
import axios from 'axios'
import Message from '@/views/theme/default/components/Message.vue'
import UserProfile from '@/views/theme/default/components/UserProfile.vue'
import UserData from '@/views/theme/default/components/userData.vue'

import ServerOverview from '@/views/theme/default/components/ServerOverview.vue'
import ServerCharts from '@/views/theme/default/components/ServerCharts.vue'
import ServerCustomize from '@/views/theme/default/components/ServerCustomize.vue'
import ServerChannels from '@/views/theme/default/components/ServerChannels.vue'
import Server from '@/views/Server.vue'
export default {
  name: 'HomeView',
  components: {
    Message,
    UserProfile,
    UserData,
    ServerOverview,
    ServerCharts,
    ServerCustomize,
    ServerChannels
  },
  props: {
    me: Object,
    server: Object,
    language: Object,
    message: Object
  },
  data() {
    return {
      selected: 'overview'
    }
  },
  methods: {
    translate(text) {
      if (this.me.lan == 'en') return text
      return language[text]
    },
    sendMessage(t) {
      this.message.content = t
      this.message.error = false
      this.message.show = true
      setTimeout(() => {
        this.message.show = false
      }, 5000)
    },
    sendErrorMessage(t) {
      this.message.content = t
      this.message.error = true
      this.message.show = true
      setTimeout(() => {
        this.message.show = false
      }, 5000)
    },
    save() {
      axios
        .post('/api/server', { data: this.server })
        .then((r) => {
          this.sendMessage('server saved')
        })
        .catch((e) => {
          this.sendErrorMessage('there was an error saving the server')
          console.log('[/api/server]: ' + e.stack || e)
        })
    },
    saveProfile() {
      axios
        .post('/api/me', { data: this.server })
        .then((r) => {
          this.sendMessage('Profile saved')
        })
        .catch((e) => {
          this.sendErrorMessage('there was an error saving your profile')
          console.log('[/api/server]: ' + e.stack || e)
        })
    }
  }
}
</script>

<style>
html,
body {
  max-height: 100%;
}
</style>

<style scoped>
.home {
  margin: 0;
  padding: 0;
  min-width: 100%;
  width: 100%;
  max-width: 100%;
  min-height: 100%;
  height: 100%;
  background-color: rgb(24, 19, 12);
  font-family: 'Ubuntu', sans-serif;
  background-image: url(http://bisot.xyz/!invalid-user/AJZDrqgxG.jpg);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
  overflow: hidden;
  min-height: 100vh;
  color: #333;
}
.home.dark {
  background-image: url(http://bisot.xyz/!invalid-user/EtgxHbkYG.jpg);
  color: #ffffff;
}

h1 {
  color: white;
  text-align: center;
}
.bottom {
  box-shadow: 0px -15px 40px -15px #111;
  height: 20%;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  background-color: rgb(44, 35, 22);
  bottom: 0;
  background-image: url('http://bisot.xyz/!invalid-user/ropfqInMY.png');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
}

.servers {
  margin-top: 80px;
  padding: 4%;
  overflow-y: scroll;
  max-height: 61%;
  min-height: 60%;
}

/* width */
::-webkit-scrollbar {
  width: 8px;

  border: 0.9px solid black;
}

/* Track */
::-webkit-scrollbar-track {
  background: #3b3b3b;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border: 0.5px solid black;
  -webkit-box-shadow: inset 0px 20px 5px -20px rgba(250, 251, 246, 1);
  -moz-box-shadow: inset 0px 20px 5px -20px rgba(250, 251, 246, 1);
  box-shadow: inset 0px 20px 5px -20px rgba(250, 251, 246, 1);
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
}

.wrap-wrap {
  border-radius: 8px;
  display: flex;
  /* flex-direction: column; */
  border: 2.7px solid black;
  margin: 2% 3%;
  min-height: 70vh;
  max-height: 70vh;
  overflow: hidden;
}

.display-wrap {
  display: flex;
  flex-direction: column;
  border: 13px solid #d3d3d3;
  max-width: 100%;
  width: 100%;
  overflow: hidden;
  border-top: none;
}
.top {
  background: #d3d3d3;
  height: 10%;
  /* padding-bottom: 5px; */
  /* padding-top: 10px; */
  display: flex;
  align-items: center;
}

.display {
  display: flex;
  flex-direction: row;
  min-height: 90%;
  max-height: 90%;
}

.menu {
  width: 40%;
  min-height: 100%;
  max-height: 100%;
  border-right: 12px solid #d3d3d3;
  overflow-y: scroll;
  background-color: #a0a0a0a6;
  padding-bottom: 1%;
  overflow-x: hidden;
  -webkit-box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.75);
  box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.75);
}

p {
  padding: 0;
  margin: 4px 0 0 2%;
  line-height: 18px;
  color: white;
}

.view {
  width: 60%;
  min-height: 100%;
  max-height: 100%;
  background-color: #a0a0a0a6;
  -webkit-box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.75);
  box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.75);
  overflow-y: scroll;
}

.text {
  display: flex;
  gap: 5px;
  margin-left: 5px;
  margin-right: 5px;
  flex-direction: column;
  margin-right: auto;
}

.text .title {
  font-weight: 500;
  font-size: 26px;
}

.info {
  width: 18%;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
}

.button-server {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d3d3d3;
  box-shadow: inset 2px 3px 1px 1px #fefefe;
  color: #424242;
  text-shadow: none;
  font-weight: 400;
  border: 3px solid black;
  width: 96%;
  margin: 1.4px 0 0 1%;
  font-size: 19px;
  height: 58px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-decoration: none;
}
.button-server:hover {
  background-color: #bbbbbb;
}
.button-server.selected {
  background-color: #bbbbbb;
}
</style>
<template>
  <body>
    <Message v-if="message.show" :message="message" :translate="translate" />
    <div :class="[me.options.darkMode ? 'dark' : '', 'home']">
      <div class="wrap-wrap">
        <div class="display-wrap">
          <div class="top">
            <div>{{ translate('Settings for') }} {{ server.name }}</div>
          </div>
          <div class="display">
            <div class="menu">
              <p>{{ translate('User') }}</p>
              <a @click="selected = 'profile'" :class="[selected == 'profile' ? 'selected' : '', 'button-server']"
                ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#424242">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path
                    d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  />
                </svg>
                {{ translate('Profile') }}</a
              >
              <a @click="selected = 'manage-data'" :class="[selected == 'manage-data' ? 'selected' : '', 'button-server']"
                ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#424242">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                </svg>
                {{ translate('Manage Data') }}</a
              >
              <p>{{ translate('Server') }}</p>
              <a @click="selected = 'overview'" :class="[selected == 'overview' ? 'selected' : '', 'button-server']"
                ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#424242">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M10 20h4V4h-4v16zm-6 0h4v-8H4v8zM16 9v11h4V9h-4z" />
                </svg>
                {{ translate('Overview') }}</a
              >
              <a @click="selected = 'charts'" :class="[selected == 'charts' ? 'selected' : '', 'button-server']">
                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#424242">
                  <rect fill="none" height="24" width="24" />
                  <g>
                    <path
                      d="M19.88,18.47c0.44-0.7,0.7-1.51,0.7-2.39c0-2.49-2.01-4.5-4.5-4.5s-4.5,2.01-4.5,4.5s2.01,4.5,4.49,4.5 c0.88,0,1.7-0.26,2.39-0.7L21.58,23L23,21.58L19.88,18.47z M16.08,18.58c-1.38,0-2.5-1.12-2.5-2.5c0-1.38,1.12-2.5,2.5-2.5 s2.5,1.12,2.5,2.5C18.58,17.46,17.46,18.58,16.08,18.58z M15.72,10.08c-0.74,0.02-1.45,0.18-2.1,0.45l-0.55-0.83l-3.8,6.18 l-3.01-3.52l-3.63,5.81L1,17l5-8l3,3.5L13,6C13,6,15.72,10.08,15.72,10.08z M18.31,10.58c-0.64-0.28-1.33-0.45-2.05-0.49 c0,0,5.12-8.09,5.12-8.09L23,3.18L18.31,10.58z"
                    />
                  </g>
                </svg>
                {{ translate('Charts') }}</a
              >
              <a @click="selected = 'customize'" :class="[selected == 'customize' ? 'selected' : '', 'button-server']">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#424242">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path
                    d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z"
                  />
                </svg>
                {{ translate('Customize') }}</a
              >
              <a @click="selected = 'channels'" :class="[selected == 'channels' ? 'selected' : '', 'button-server']">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#424242">
                  <path d="M0 0h24v24H0V0z" fill="none" />
                  <path d="M4 4h16v12H5.17L4 17.17V4m0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4zm2 10h12v2H6v-2zm0-3h12v2H6V9zm0-3h12v2H6V6z" />
                </svg>
                {{ translate('Channels') }}</a
              >
            </div>
            <UserProfile v-if="selected == 'profile'" :me="me" :translate="translate" class="view" @save-profile="saveProfile" />
            <UserData v-else-if="selected == 'manage-data'" :me="me" :translate="translate" class="view" />
            <ServerOverview v-else-if="selected == 'overview'" :me="me" :server="server" :translate="translate" class="view" @save="save" />
            <ServerCharts v-else-if="selected == 'charts'" :me="me" :server="server" :translate="translate" class="view" />
            <ServerCustomize v-else-if="selected == 'customize'" :me="me" :server="server" :translate="translate" class="view" @save="save" />
            <serverChannels v-else-if="selected == 'channels'" :me="me" :server="server" :translate="translate" class="view" @save="save" />
          </div>
        </div>
      </div>
    </div>
  </body>
</template>
