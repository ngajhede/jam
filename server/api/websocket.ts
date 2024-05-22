import { Peer } from "crossws";

const room = "ROOM";

export default defineWebSocketHandler({
  open(peer) {
    console.log("WebSocket opened", peer);
    initPeer(peer, "Anonymous", room);
  },
  close(peer) {
    console.log("WebSocket closed", peer);
  },
  error(peer, error) {
    console.log("WebSocket error", peer, error);
  },
  message(peer, message) {
    console.log("WebSocket message", peer, message);
    const { type, data } = JSON.parse(message.text());

    if (!type || !handlers[type]) {
      console.error("Unknown message type", type);
      peer.send("Unknown message type");
      return;
    }

    const handler = handlers[type];
    handler(peer, data);
  },
});

const initPeer = (peer: Peer, name: string, room: string) => {
  setName(peer, name);
  peer.subscribe(room);
};

// Object literal with all methods mapped to message types
const handlers: { [type: string]: (peer: Peer, data: any) => void } = {
  message: (peer: Peer, message: string) => {
    peer.publish(room, { type: "message", data: message, peer: peer.ctx.name });
    peer.send({ type: "message", data: message, peer: peer.ctx.name });
  },
  setName: (peer: Peer, name: string) => {
    setName(peer, name);
  },
};

// Custom method
const setName = (peer: Peer, name: string) => {
  peer.ctx.name = name;
  peer.send({ type: "nameSet", data: peer.ctx.name });
};
