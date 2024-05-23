import { Peer } from "crossws";

export default defineWebSocketHandler({
  open(peer) {
    console.log("WebSocket opened", peer);
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

// Object literal with all methods mapped to message types
const handlers: { [type: string]: (peer: Peer, data: any) => void } = {
  message: (peer: Peer, message: string) => {
    if (!checkRoom(peer)) return;

    const msg = `${peer.ctx.name}: ${message}`;
    peer.publish(peer.ctx.room, { type: "message", data: msg, peer: peer.ctx.name });
    peer.send({ type: "message", data: msg, peer: peer.ctx.name });
  },
  joinRoom: (peer: Peer, room: string) => {
    joinRoom(peer, room);
  },
  setName: (peer: Peer, name: string) => {
    setName(peer, name);
  },
  initMe: (peer: Peer, { name, room }: { name: string; room: string }) => {
    initPeer(peer, name, room);
  },
};

const initPeer = (peer: Peer, name: string, room: string) => {
  setName(peer, name);
  joinRoom(peer, room);
};

const joinRoom = (peer: Peer, room: string) => {
  peer.subscribe(room);
  peer.ctx.room = room;
  peer.send({ type: "roomJoined", data: room });
  peer.publish(room, { type: "message", data: `${peer.ctx.name} joined the room` });
};

// Custom method
const setName = (peer: Peer, name: string) => {
  peer.ctx.name = name;
  peer.send({ type: "nameSet", data: peer.ctx.name });
};

const checkRoom = (peer: Peer) => {
  if (!peer.ctx.room) {
    peer.send({ type: "error", data: "You must join a room first" });
    return false;
  }

  return true;
};
