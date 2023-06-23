<template>
  <div class="clock">{{ displayTime }}</div>
</template>

<script setup>
import { ref, defineExpose } from 'vue';

const nowTime = ref(new Date());
const displayTime = ref('');

const updateTime = () => {
  nowTime.value = new Date();
  let hr = nowTime.value.getHours();
  let min = nowTime.value.getMinutes();
  let sec = nowTime.value.getSeconds();

  let session = "AM";

  if(hr == 0){
    hr = 12;
  }

  if(hr > 12){
    hr = hr - 12;
    session = "PM";
  }

  hr = (hr < 10) ? "0" + hr : hr;
  min = (min < 10) ? "0" + min : min;
  sec = (sec < 10) ? "0" + sec : sec;

  displayTime.value = hr + ":" + min + ":" + sec + " " + session;
}

defineExpose({
  updateTime,
});
</script>

<style scoped>
@font-face {
  font-family: "Orbitron";
  src: url("/fonts/Orbitron-Regular.ttf");
}
.clock {
  color: #17D4FE;
  font-family: Orbitron;
  font-size: 2.5em;
  white-space: nowrap;
  text-align: center;
}
</style>
