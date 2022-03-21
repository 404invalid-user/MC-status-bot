<script>
export default {
  name: 'Loading',
  components: {},
  props: {
    message: Object
  },
  data() {
    return {
      loadingWidth: '0%'
    }
  },
  created() {
    setTimeout(() => {
      for (let i = 0; i < 100; i++) {
        setTimeout(() => {
          if (this.message.show) {
            this.loadingWidth = '100%'
          } else {
               this.loadingWidth = i.toString() + '0%';
          }
        }, parseInt('1' + i + '00'))
      }
    }, 2000)
  }
}
</script>

<style scoped>
body {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(http://bisot.xyz/!invalid-user/AJZDrqgxG.jpg);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
}
#progressbar {
  background-color: #f6ce00;
  border-radius: 13px;
  padding: 3px;
  width: 90%;
}

#progressbar > div {
  background-color: #0058b5;
  width: 40%;
  /* Adjust with JavaScript */
  height: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}
</style>

<template>
  <body>
    <div id="progressbar">
      <div :style="{ width: loadingWidth }">loading...</div>
    </div>
  </body>
</template>

