<template>
  <div>Websocket! Wohoo</div>
  <p>Name: {{ currentName }}</p>

  <form
    @submit.prevent="
      sendData({
        type: 'setName',
        data: newName,
      })
    "
  >
    <input v-model="newName" type="text" placeholder="Type a name..." />
    <button type="submit">Send</button>
  </form>
  <form
    @submit.prevent="
      sendData({
        type: 'message',
        data: message,
      })
    "
  >
    <input v-model="message" type="text" placeholder="Type a message..." />
    <button type="submit">Send</button>
  </form>

  <ul>
    <li v-for="msg in history" :key="msg">{{ msg }}</li>
  </ul>
</template>

<script setup lang="ts">
// In prod: check if secure or not
const { status, data, send, open, close } = useWebSocket(`ws://${location.host}/api/websocket`);

const currentName = ref("");
const newName = ref("");
const message = ref("");
const history = ref<string[]>([]);

const sendData = (data: { type: string; data: string }) => {
  send(JSON.stringify(data));
  message.value = "";
};

watch(data, (newData) => {
  if (newData) {
    console.log("newData", newData);
    const data = JSON.parse(newData);
    console.log("data", data);
    if (handlers[data.type]) {
      handlers[data.type](data);
    }
  }
});

const handlers: { [type: string]: (data: any) => void } = {
  open: (data) => {
    console.log("Connection opened", data);
  },
  close: () => {
    console.log("Connection closed");
  },
  error: () => {
    console.log("Error");
  },
  nameSet: (data) => {
    currentName.value = data.data;
  },
  message: (data) => {
    console.log(data);
    history.value.push(`${data.peer}: ${data.data}`);
  },
};
</script>
