<script>
// @ is an alias to /src

export default {
  name: 'ServerNotification',
  data() {
    return {
      currentEmail: ''
    }
  },
  props: {
    me: Object,
    server: Object,
    translate: Function
  },
  methods: {
    errorInput(inputid, text, time) {
      document.getElementById(inputid).classList.add('error')
      document.getElementById(inputid + '-text').innerText = text
      return false;
    },
    validateContent(id, le) {
      const value = document.getElementById(id).value
      const valueLenght = value.split('').length
      const maxLenght = parseInt(le) ? parseInt(le) : 2000
      if (valueLenght > maxLenght) {
        return this.errorInput(id, `Error: too long ${le ? le : 2000 - value.split('').length} over ${le ? le : 2000}.`)
      } else {
        document.getElementById(id).classList.remove('error')
        document.getElementById(id + '-text').innerText = ''
        return true;
      }
    },
    validateUrl(id) {
      const value = document.getElementById(id).value
      try {
        let url = new URL(value)
      } catch (_) {
        return this.errorInput(id, 'Error: invalid url')
      }
      document.getElementById(id).classList.remove('error')
      document.getElementById(id + '-text').innerText = ''
    },
    deleteEmail(email) {
      for (let i = 0; i < this.server.config.notifications.email.emails.length; i++) {
        if (this.server.config.notifications.email.emails[i] == email) {
          this.server.config.notifications.email.emails.splice(i, 1)
        }
      }

    },
    addEmail() {
      //TODO: check email format
      if (this.validateContent('email-to', 390)) {
this.server.config.notifications.email.emails.push(this.currentEmail.toLowerCase());
      this.currentEmail = ''
      } 
      
    }
  },

  async beforeMount() {}
}
</script>

<style scoped>
input,
select {
  height: 38px;
  border: 2px solid black;
  width: 80%;
  background-color: #4b4a4f;
  -webkit-box-shadow: inset -1px -1px 2px 0px rgb(142 139 142);
  -moz-box-shadow: inset -1px -1px 2px 0px rgba(142, 139, 142, 1);
  box-shadow: inset -1px -1px 2px 0px rgb(142 139 142);
  outline: black;
  color: white;
  font-size: 15px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 47px;
  height: 25px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #404040;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border: 2.6px solid #000000;
}

.slider:before {
  position: absolute;
  content: '';
  height: 28px;
  width: 15px;
  left: -2.5px;
  bottom: -7px;
  background-color: #c6c6c6;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border: 2.5px solid;
  -webkit-box-shadow: inset 0.5px 1px 1px 1px rgba(249, 249, 249, 1);
  -moz-box-shadow: inset 0.5px 1px 1px 1px rgba(249, 249, 249, 1);
  box-shadow: inset 0.5px 1px 1px 1px rgba(249, 249, 249, 1);
}
input:checked + .slider::before {
  left: 2.5px;
}
input:checked + .slider {
  background-color: #7f7f7f;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider::before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
.bruh {
  padding: 5px;
}

p {
  padding: 0;
  margin: 16px 0 9px;
  line-height: 18px;
  color: white;
}

.subtitle {
  font-size: 1.2em;
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
  margin: 56.4px 1% 0;
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
input.error {
  border: 2.4px solid red !important;
}
p.error {
  color: red;
  font-size: 0.8em !important;
  padding: 0;
  margin: 0;
}
</style>
<template>
  <div class="bruh">
    <p>
      {{ translate('see our [] variables guide at') }}
      <a href="http://docs.mcstatusbot.site/variables/notifications" target="_blank">docs.mcstatusbot.site/variables/notifications</a>
    </p>

    <p class="subtitle">
      <b>{{ translate('Webhook') }}:</b>
    </p>
    <div class="bruh" style="margin-top: 0">
      <p>{{ translate('Enabled') }}:</p>
      <label class="switch">
        <input type="checkbox" v-model="server.config.notifications.webhook.enabled" />
        <span class="slider"></span>
      </label>
       <p>{{ translate('Send Status when server online') }}:</p>
      <label class="switch">
        <input type="checkbox" v-model="server.config.notifications.webhook.for.online" />
        <span class="slider"></span>
      </label>
        <p>{{ translate('Send Status when server offline') }}:</p>
      <label class="switch">
        <input type="checkbox" v-model="server.config.notifications.webhook.for.offline" />
        <span class="slider"></span>
      </label>
      <div>
        <p>{{ translate('Url') }}:</p>
        <input type="text" id="wh-url" v-model="server.config.notifications.webhook.url" @input="validateUrl('wh-url')" />
        <p class="error" id="wh-url-text"></p>
      </div>

      <div>
        <p>{{ translate('Content') }}:</p>
        <input type="text" id="wh-content" v-model="server.config.notifications.webhook.content" @input="validateContent('wh-content')" />
        <p class="error" id="wh-content-text"></p>
      </div>
    </div>

    <p class="subtitle">
      <b>{{ translate('Email') }}:</b>
    </p>
    <div class="bruh" style="margin-top: 0">
      <p>{{ translate('Enabled') }}:</p>
      <label class="switch">
        <input type="checkbox" v-model="server.config.notifications.email.enabled" />
        <span class="slider"></span>
      </label>
       <p>{{ translate('Send Status when server online') }}:</p>
      <label class="switch">
        <input type="checkbox" v-model="server.config.notifications.email.for.online" />
        <span class="slider"></span>
      </label>
        <p>{{ translate('Send Status when server offline') }}:</p>
      <label class="switch">
        <input type="checkbox" v-model="server.config.notifications.email.for.offline" />
        <span class="slider"></span>
      </label>
      <div>
        <p>{{ translate('Send to emails') }}:</p>
        <div class="emails">
          <div v-for="email of server.config.notifications.email.emails" :key="email" @click="deleteEmail(email)">{{email}}</div>
        </div>
        <input type="email" id="email-to" v-model="currentEmail" />
        <p class="error" id="email-to-text"></p>
        <div class="buttons">
        <div class="button"  @click="addEmail">{{ translate('Add email') }}</div>
        </div>
      </div>
      <div>
        <p>{{ translate('Subject') }}:</p>
        <input type="text" id="email-subject" v-model="server.config.notifications.email.subject" @input="validateContent('email-subject')" />
        <p class="error" id="email-subject-text"></p>
      </div>
      <div>
        <p>{{ translate('Content') }}:</p>
        <input type="text" id="email-content" v-model="server.config.notifications.email.content" @input="validateContent('email-content')" />
        <p class="error" id="email-content-text"></p>
      </div>
    </div>

    <a class="button-server" @click="$emit('save')">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#424242">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path
          d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6 6h9v4H6z"
        />
      </svg>
      save</a
    >
  </div>
</template>
