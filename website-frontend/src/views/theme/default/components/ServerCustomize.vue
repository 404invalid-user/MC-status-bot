<script>
// @ is an alias to /src

export default {
  name: 'ServerCustomize',
  data() {
    return {
      selected: 'uptime',
      preview: {
        request: false,
        url: ''
      },
      colours: {
        text: {
          title: '',
          time: '',
          state: ''
        },
        line: {
          fill: '',
          border: ''
        }
      }
    }
  },
  methods: {
    setupp() {
      this.preview.url = `/chart/example.png?text-title=${this.server.config.chart.graph.text.title}&text-time=${this.server.config.chart.graph.text.time}&text-state=${this.server.config.chart.graph.text.state}&line-fill=${this.server.config.chart.graph.line.fill}&line-border=${this.server.config.chart.graph.line.border}`
      this.preview.request = true
    },
    hexTorgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null
    },
    rgbToHex(rgb) {
      function componentToHex(c) {
        var hexadecimal = c.toString(16)
        return hexadecimal.length == 1 ? '0' + hexadecimal : hexadecimal
      }
      rgb = rgb.replaceAll(' ', '')
      let r = parseFloat(rgb.split(',')[0])
      let g = parseFloat(rgb.split(',')[1])
      let b = parseFloat(rgb.split(',')[2])
      console.log(`${r} ${g} ${b}`)
      return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
    },
    colourUpdate() {
      this.server.config.chart.graph.text.title = this.hexTorgb(this.colours.text.title)
      this.server.config.chart.graph.text.time = this.hexTorgb(this.colours.text.time)
      this.server.config.chart.graph.text.state = this.hexTorgb(this.colours.text.state)

      this.server.config.chart.graph.line.fill = this.hexTorgb(this.colours.line.fill)
      this.server.config.chart.graph.line.border = this.hexTorgb(this.colours.line.border)
    },
    errorInput(inputid, text, time) {
      document.getElementById(inputid).classList.add('error')
      document.getElementById(inputid + '-txt').innerText = text
      setTimeout(
        () => {
          document.getElementById(inputid).classList.remove('error')
          document.getElementById(inputid + '-text').innerText = ''
        },
        time ? parseInt(time + '000') : 32000
      )
    },
    validateContent(id, le) {
      const value = document.getElementById(id).value
      if (value.split('').length > le ? le : 2000) {
        return this.errorInput(id, 'Error: too long ' + value.split('').length + ' over ' + le ? le : 2000 + '.')
      }
      document.getElementById(id).classList.remove('error')
      document.getElementById(id + '-txt').innerText = ''
    }
  },
  props: {
    me: Object,
    server: Object,
    translate: Function
  },
  async beforeMount() {
    console.log(this.server.config.chart.embed)
    this.colours = {
      text: {
        title: this.rgbToHex(this.server.config.chart.graph.text.title),
        time: this.rgbToHex(this.server.config.chart.graph.text.time),
        state: this.rgbToHex(this.server.config.chart.graph.text.state)
      },
      line: {
        fill: this.rgbToHex(this.server.config.chart.graph.line.fill),
        border: this.rgbToHex(this.server.config.chart.graph.line.border)
      }
    }
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
input .error {
  border: 1px solid red;
}
p .error {
  color: red;
  font-size: 0.4em;
}
</style>
<template>
  <div class="bruh">
    <p>{{ translate('see our [] variables guide at') }} <a href="http://docs.mcstatusbot.site/guide/variable" target="_blank">docs.mcstatusbot.site/guide/variables</a></p>
    <p>{{ translate('Enabled') }}:</p>
    <label class="switch">
      <input type="checkbox" v-model="server.config.chart.enabled" />
      <span class="slider"></span>
    </label>
    <p>{{ translate('Embeds') }}:</p>
    <select v-model="selected">
      <option value="uptime">uptime</option>
      <option value="playersonline">playersonline</option>
      <option value="mostactive">mostactive</option>
    </select>
    <div class="bruh" style="margin-top: 0">
      <div>
        <p>{{ translate('Title') }}:</p>
        <input type="text" v-model="server.config.chart.embed[selected].title" id="chart-title" @input="validateContent('chart-title', 150)" />
        <p class="error" id="chart-title-text"></p>
      </div>
      <div>
        <p>{{ translate('Description') }}:</p>
        <input type="text" v-model="server.config.chart.embed[selected].description" id="chart-description" @input="validateContent('chart-description', 150)" />
        <p class="error" id="chart-description-text"></p>
      </div>
      <p>{{ translate('Embed Colour') }}:</p>
      <input type="color" v-model="server.config.chart.embed[selected].color" />
    </div>
    <p>{{ translate('Graph') }}:</p>
    <div class="bruh" style="margin-top: 0">
      <p>{{ translate('Title Text Colour') }}:</p>
      <input type="color" v-model="colours.text.title" @change="colourUpdate" />
      <p>{{ translate('Time Text Colour') }}:</p>
      <input type="color" v-model="colours.text.time" @change="colourUpdate" />
      <p>{{ translate('State Text Colour') }}:</p>
      <input type="color" v-model="colours.text.state" @change="colourUpdate" />
      <p>{{ translate('Graph Fill Colour') }}:</p>
      <input type="color" v-model="colours.line.fill" @change="colourUpdate" />
      <p>{{ translate('Graph Border Colour') }}:</p>
      <input type="color" v-model="colours.line.border" @change="colourUpdate" />

      <a class="button-server" @click="setupp">{{ translate('Preview Graph') }}</a>
      <div style="background-color: #2f3136; width: 90%">
        <img alt="preview image" v-if="preview.request" :src="preview.url" style="width: 100%" />
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
