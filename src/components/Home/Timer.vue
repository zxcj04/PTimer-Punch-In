<template>
  <v-container>
    <div class="name mb-2 text-h6 font-weight-bold">{{ props.name }}</div>
    <div class="clock">{{ displayTime }}</div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  startTime: {
    required: true,
  },
});

const nowTime = ref(new Date());
const displayTime = ref('');

const updateTime = () => {
  nowTime.value = new Date();
  const startTime = new Date(props.startTime);
  const timer = new Date(nowTime.value - startTime);
  let days = timer.getUTCDate() - 1;
  let hr = timer.getUTCHours();
  let min = timer.getUTCMinutes();
  let sec = timer.getUTCSeconds();

  if (days <= 0) {
    days = null;
  }

  hr = (hr < 10) ? "0" + hr : hr;
  min = (min < 10) ? "0" + min : min;
  sec = (sec < 10) ? "0" + sec : sec;

  displayTime.value = (days? days + "d ": "") + hr + ":" + min + ":" + sec;
};

defineExpose({
  updateTime,
});
</script>

<style scoped>
@font-face {
  font-family: "Orbitron";
  src: url("/fonts/Orbitron-Regular.ttf");
}
@font-face {
  font-family: "NotoSansTC";
  src: url("/fonts/NotoSansTC-Regular.otf");
}
.name {
  color: yellow;
  font-family: Orbitron;
  font-size: 1.5em;
  white-space: nowrap;
  text-align: center;
}
.clock {
  color: yellow;
  font-family: Orbitron;
  font-size: 2em;
  white-space: nowrap;
  text-align: center;
}
</style>
