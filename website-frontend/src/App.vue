<template>
  <router-view :bot="bot" />
</template>

<script>
export default {
  data() {
    return {
      bot: {
        id: '816747912888975362',
        github: ''
      }
    }
  }
}
</script>


<style>
html,
body {
  margin: 0;
  padding: 0;
  min-width: 100%;
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  font-family: 'Ubuntu', sans-serif;
  overflow-x: hidden;
}
body {
  height: 100%;
}
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #6d6d6d;
  background-image: url(http://bisot.xyz/!invalid-user/eSNiRZGbF.jpeg);
  background-repeat: no-repeat;
  width: 213px;
  margin: 10px;
  font-size: 23px;
  height: 52px;
  border: 3px solid black;
  font-weight: 600;
  color: #e0e0e0;
  box-shadow: inset 2px 3px 1px 1px rgb(167 167 167);
  text-shadow: 2.4px 2.4px #6f6f6f;
  cursor: -moz-grab;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  text-decoration: none;
}

.button:hover {
  border: 3px solid #ffffff;
}
.button.dark {
  border: 3px solid #ffffff;
}
.button.dark:hover {
  border: 3px solid black;
}
.button.inactive {
  background-image: url(http://bisot.xyz/!invalid-user/XIDJAFqhn.png);
  color: #adadad;
  box-shadow: inset 2px 3px 1px 1px rgb(167 167 167);
}
.button.inactive:hover {
  border: 3px solid #ffffff;
  border: 3px solid black;
}
</style>