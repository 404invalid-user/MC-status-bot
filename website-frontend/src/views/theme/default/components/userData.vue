<script>
// @ is an alias to /src

export default {
  name: 'ServerProfile',
  methods: {
    deleteData() {
      if (confirm('are you sure?')) {
        window.location.href = '/api/me/delete-account'
      }
    }
  },
  props: {
    me: Object,
    translate: Function
  }
}
</script>

<style scoped>
input[type='text'] {
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
.button-server.delete:hover {
  background-color: red;
  box-shadow: none;
}
</style>
<template>
  <div class="bruh">
    <p>
      {{
        translate(
          'mc status only stores the data that is necessary for the bot and website to function you can request your data by clicking the "Request Data" button and you can delete your account by clicking the "Delete Account" button this will delete all your account preferences such as the theme language and other things.'
        )
      }}
    </p>
    <a class="button-server" href="/api/request-data"
      ><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#424242">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
      </svg>
      {{ translate('Request Data') }}</a
    >
    <a class="button-server delete" @click="deleteData">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#424242">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path
          d="M14.12 10.47L12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"
        />
      </svg>
      {{ translate('Delete Account') }}</a
    >
  </div>
</template>
