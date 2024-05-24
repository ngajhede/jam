import { Peer } from "crossws";
import { Room } from "../classes/Room";
import { BoardElement } from "~/types";

const rooms = new Map<string, Room>();

export default defineWebSocketHandler({
  open(peer) {
    console.log("WebSocket opened", peer);
  },
  close(peer) {
    console.log("WebSocket closed", peer);
    if (peer.ctx.room) {
      const room = rooms.get(peer.ctx.room);
      if (room) {
        room.removePeer(peer);
        peer.publish(peer.ctx.room, { type: "message", data: `${peer.ctx.name} left the room` });
        updateRoom(peer, room);
      }
    }
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
  updateElement: (peer: Peer, element: any) => {
    updateElement(peer, element);
  },
  addElement: (peer: Peer, element: BoardElement) => {
    addElement(peer, element);
  },
};

const initPeer = (peer: Peer, name: string, room: string) => {
  setName(peer, name);
  joinRoom(peer, room);
};

const joinRoom = (peer: Peer, room: string) => {
  if (peer.ctx.room) {
    peer.send({ type: "error", data: "You are already in a room" });
    return;
  }

  if (!rooms.has(room)) {
    rooms.set(room, new Room(room));
  }

  const roomInstance = rooms.get(room);
  if (!roomInstance) {
    peer.send({ type: "error", data: "Room not found" });
    return;
  }

  roomInstance.addPeer(peer);
  peer.subscribe(room);
  peer.ctx.room = room;
  peer.send({
    type: "roomJoined",
    data: {
      name: roomInstance.name,
      elements: roomInstance.elements,
      peers: roomInstance.peers.map((p) => p.ctx.name),
    },
  });
  peer.publish(room, { type: "message", data: `${peer.ctx.name} joined the room` });
  updateRoom(peer, roomInstance);
};

// Custom method
const setName = (peer: Peer, name: string) => {
  peer.ctx.name = name;
  peer.send({ type: "nameSet", data: peer.ctx.name });

  const room = rooms.get(peer.ctx.room);
  if (room) {
    updateRoom(peer, room);
  }
};

const updateElement = (peer: Peer, element: BoardElement) => {
  if (!checkRoom(peer)) return;

  const room = rooms.get(peer.ctx.room);
  if (!room) {
    peer.send({ type: "error", data: "Room not found" });
    return;
  }

  const existingElement = room.elements.find((e) => e.id === element.id);
  if (!existingElement) {
    peer.send({ type: "error", data: "Element not found" });
    return;
  }

  Object.assign(existingElement, element);
  updateRoom(peer, room);
};

const addElement = (peer: Peer, element: BoardElement) => {
  if (!checkRoom(peer)) return;

  const room = rooms.get(peer.ctx.room);
  if (!room) {
    peer.send({ type: "error", data: "Room not found" });
    return;
  }

  room.elements.push({
    ...element,
    id: Math.random().toString(36).substring(7),
  });

  console.log("Added element", element, room.elements);
  updateRoom(peer, room);
};

const checkRoom = (peer: Peer) => {
  if (!peer.ctx.room) {
    peer.send({ type: "error", data: "You must join a room first" });
    return false;
  }

  return true;
};

const updateRoom = (peer: Peer, room: Room) => {
  const payload = {
    name: room.name,
    elements: room.elements,
    peers: room.peers.map((p) => p.ctx.name),
  };
  peer.publish(peer.ctx.room, {
    type: "roomUpdated",
    data: payload,
  });
  peer.send({
    type: "roomUpdated",
    data: payload,
  });
};
