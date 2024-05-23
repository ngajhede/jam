import type { BoardElement } from "~/types";

export const useWebsocket = () => {
  const { user } = useAuth();
  const { status, data, send, open, close } = useWebSocket(`ws://${location.host}/api/websocket`);

  const history = ref<string[]>([]);
  const currentName = ref(user.value?.username || "Anonymous");
  const currentRoom = ref<string | null>(null);

  const room = ref<{
    name: string;
    elements: BoardElement[];
    peers: string[];
  } | null>(null);

  const sendData = (data: { type: string; data: string | any }) => {
    send(JSON.stringify(data));
  };

  const initMe = (room: string) => {
    sendData({ type: "initMe", data: { name: currentName.value, room } });
  };

  const joinRoom = (room: string) => {
    sendData({ type: "roinRoom", data: room });
  };

  const updateElement = (element: BoardElement) => {
    sendData({ type: "updateElement", data: element });
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
      room.value = data.data;
    },
    roomUpdated: (data) => {
      console.log("Room updated", data.data);
      room.value = data.data;
    },
    message: (data) => {
      console.log(data);
      history.value.push(`${data.data}`);
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
    room,
    handlers,
    history,
    sendData,
    joinRoom,
    initMe,
    updateElement,
  };
};
