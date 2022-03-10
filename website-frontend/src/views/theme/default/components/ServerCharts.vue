<script>
// @ is an alias to /src

export default {
  name: 'ServerProfile',
  methods: {},
  props: {
    me: Object,
    translate: Function,
    server: Object
  }
}
</script>

<style scoped>
.bruh {
  display: flex;
  flex-direction: column;
  padding: 5px;
}
.chart {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  align-self: center;
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
  <div v-if="server.Logging" class="bruh">
    <p>{{ translate('Chart uptime') }}:</p>
    <img id="uptime" class="chart" alt="chart uptime" :src="'/chart/uptime.png?id=' + server._id" />
    <p>{{ translate('Players Online') }}:</p>
    <img id="playersonline" class="chart" alt="chart playersonline" :src="'/chart/playersonline.png?id=' + server._id" />
    <p>{{ translate('Most Active') }}:</p>
    <img id="mostactive" class="chart" alt="chart mostactive" :src="'/chart/mostactive.png?id=' + server._id" />
  </div>
  <div v-else class="bruh">
    <p>server loggin is off please enable it under the overview tab</p>
  </div>
</template>
