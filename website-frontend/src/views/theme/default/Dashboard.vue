<script>
import axios from 'axios'
// @ is an alias to /src
import Message from '@/views/theme/default/components/Message.vue'

export default {
  name: 'HomeView',
  components: {
    Message
  },
  data() {
    return {
      selected: {},
      hasSelected: false
    }
  },
  props: {
    bot: Object,
    me: Object,
    translate: Function
  },
  methods: {
    select(id) {
      console.log('select: ' + id)
      for (const guild of this.me.guilds) {
        document.getElementById(guild._id).classList.remove('server-selected')
        if (id == guild._id) {
          this.selected = guild
        }
      }
      document.getElementById(id).classList.add('server-selected')
      this.hasSelected = true
    },
    hover(id) {
      document.getElementById(id).classList.add('hover')
    },
    remHover(id) {
      document.getElementById(id).classList.remove('hover')
    },
    manageServer() {
      this.$router.push('/server/' + this.selected._id)
    },
    removeServer() {
      this.$router.push('/remove?id=' + this.selected._id)
    },
    addServer() {
      window.location.href = `https://discord.com/oauth2/authorize?client_id=${this.bot.id}&permissions=269798480&scope=bot%20applications.commands`
    }
  },
  beforeMount() {
    console.log(this.me)
  }
}
</script>

<style scoped>
.wrap {
  margin: 0;
  padding: 0;
  min-width: 100%;
  width: 100%;
  max-width: 100%;
  min-height: 100%;
  height: 100vh;
  max-height: 100%;
  background-color: rgb(24, 19, 12);
  background-image: url('http://bisot.xyz/!invalid-user/gBnlDGsOR.png');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
}
.wrap {
  overflow: hidden;
}
.top {
  height: 80px;
  position: absolute;
  width: 100%;
  max-width: 100%;
  min-width: 100%;
  background-color: rgb(44, 35, 22);
  top: 0;
  background-image: url('http://bisot.xyz/!invalid-user/ropfqInMY.png');
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
  box-shadow: 0px 15px 40px -15px #111;
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
  min-width: 100vh;
}

.servers {
  margin-top: 80px;
  padding: 4%;
  overflow-y: scroll;
  max-height: 61%;
  min-height: 60%;
}

/* width */
.servers::-webkit-scrollbar {
  width: 18px;
}

/* Track */
.servers::-webkit-scrollbar-track {
  background: #c0c0c0;
  background: transparent;
}

/* Handle */
.servers::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  -webkit-box-shadow: inset -2px -4px 2px 1px rgba(128, 128, 128, 1);
  -moz-box-shadow: inset -2px -4px 2px 1px rgba(128, 128, 128, 1);
  box-shadow: inset -2px -4px 2px 1px rgba(128, 128, 128, 1);
}

/* Handle on hover */
.servers::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.server {
  display: flex;
  flex-direction: row;
  max-height: 100px;
  color: white;
  padding: 3.5px;
  border: 3.9px solid transparent;
  min-height: 105px;
}
.server-selected {
  border: 3.9px solid white;
}

.server.hover .image {
  box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.5);
}
.image {
  max-height: 100%;
  width: 17%;
  max-width: 114px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.image img {
  width: 100%;
  height: 100%;
}
img.ping {
  width: 12px;
  margin-left: 3.3px;
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
.title .description {
}

.info {
  width: 18%;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
}

.button-content {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  padding: 10px;
}
</style>
<template>
  <body>
    <div class="wrap">
      <div class="top">
        <h1>MC-status</h1>
      </div>
      <div class="servers">
        <div
          class="server"
          v-for="server of me.guilds"
          :key="server._id"
          :id="server._id"
          :ref="'server-' + server._id"
          @click="select(server._id)"
          @mouseover="hover(server._id)"
          @mouseleave="remHover(server._id)"
        >
          <div class="image" :style="{ backgroundImage: `url(${server.icon && server.icon !== null && server.icon != undefined ? server.icon : '/down.png'})` }">
            <div class="hover"></div>
          </div>
          <div class="text">
            <div class="title">{{ server.name }}</div>
            <div class="desscription">{{ server.IP }}</div>
          </div>
          <div class="info">
            <div class="signal-top">
              <span class="online">{{ server.channel.members }}</span
              ><span class="slash">/</span><span class="max">{{ server.maxMembers }}</span
              ><img src="signal.png" class="ping" />
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="button-content">
          <a :class="[hasSelected ? '' : 'inactive', 'button']" @click="manageServer">{{ translate('Manage') }}</a>
          <a :class="[hasSelected ? '' : 'inactive', 'button']" @click="removeServer">{{ translate('Remove') }}</a>
          <a @click="addServer" class="button">{{ translate('Add Server') }}</a> <a href="/api/login" class="button" @click="removeServer">{{ translate('Refresh') }}</a>
        </div>
      </div>
    </div>
  </body>
</template>
