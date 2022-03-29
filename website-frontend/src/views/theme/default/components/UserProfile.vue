<script>
import axios from 'axios'

export default {
  name: 'UserProfile',
  methods: {},
  data() {
    return {
      languages: {}
    }
  },
  props: {
    me: Object,
    translate: Function
  },
  async beforeMount() {
    axios
      .get('/api/languages')
      .then((response) => {
        this.languages = response.data.data
      })
      .catch((err) => {
        console.log('[/api/languages]: ' + err.stack || err)
      })
  }
}
</script>

<style scoped>
input[type='text'],
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
</style>
<template>
  <div class="bruh">
    <p>{{ translate('User Name') }}:</p>
    <input type="text" v-model="me.username" disabled />
    <p>{{ translate('Default IP') }}:</p>
    <input type="text" v-model="this.me.options.ip" />
    <p>{{ translate('Theme') }}:</p>
    <input type="text" v-model="this.me.options.theme" />
    <p>{{ translate('Language') }}:</p>
    <select v-model="me.lan">
      <option v-for="lan of languages" :key="lan.iso" :value="lan.iso">{{ lan.flag }} - {{ lan.iso }}</option>
    </select>
     <p>{{ translate('Dark Mode') }}:</p>
    <label class="switch">
      <input type="checkbox" v-model="me.options.darkMode" />
      <span class="slider"></span>
    </label>
    <p>{{ translate('Admin') }}:</p>
    <label class="switch">
      <input type="checkbox" v-model="me.admin" disabled />
      <span class="slider"></span>
    </label>
    <a class="button-server" @click="$emit('save-profile')">
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
