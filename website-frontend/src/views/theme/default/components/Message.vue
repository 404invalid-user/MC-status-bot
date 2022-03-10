
<script>
// @ is an alias to /src

export default {
  name: 'Message',
  methods: {
  },
  props: {
    message: Object,
    language: Object,
    translate: Function
  }
}
</script>

<style scoped>
.message-wrap {
  display: flex;
  justify-content: center;
}
.message {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  position: absolute;
  top: 15px;
}
.message.ok {
  background-color: rgb(0, 255, 0);
  color: black;
}
.message.error {
  background-color: rgb(255, 0, 0);
  color: white;
}
</style>
<template>
    <div class="message-wrap">
      <div :class="[message.error ? 'error' : 'ok', 'message']">
        {{ translate(message.content) }}
      </div>
    </div>
</template>
