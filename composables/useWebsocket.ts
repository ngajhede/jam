export const useWebsocket = () => {
  const { status, data, send, open, close } = useWebSocket(`ws://${location.host}/api/websocket`);

  const history = ref<string[]>([]);
  const currentName = ref("User");
  const currentRoom = ref<string | null>(null);

  const sendData = (data: { type: string; data: string | any }) => {
    send(JSON.stringify(data));
  };

  const initMe = (room: string) => {
    sendData({ type: "initMe", data: { name: currentName.value, room } });
  };

  const joinRoom = (room: string) => {
    sendData({ type: "roinRoom", data: room });
  };

  watch(data, (newData) => {
    if (newData) {
      const parsedData = JSON.parse(newData);
      if (handlers[parsedData.type]) {
        handlers[parsedData.type](parsedData);
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
    roomJoined: (data) => {
      console.log("Joined room", data.data);
    },
    message: (data) => {
      console.log(data);
      history.value.push(`${data.peer}: ${data.data}`);
    },
  };

  return {
    websocket: {
      status,
      data,
      send,
      open,
      close,
    },
    currentName,
    currentRoom,
    handlers,
    history,
    sendData,
    joinRoom,
    initMe,
  };
};
