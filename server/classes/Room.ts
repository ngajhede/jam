import { Peer } from "crossws";
import type { BoardElement } from "~/types";

export class Room {
  name: string;
  elements: BoardElement[];
  peers: Peer[];

  constructor(name: string) {
    this.name = name;
    this.elements = [
      {
        id: "12345",
        x: 0,
        y: 0,
        content: "Hello, world!",
      },
    ];
    this.peers = [];
  }

  addElement(element: BoardElement) {
    this.elements.push(element);
  }

  removeElement(element: BoardElement) {
    this.elements = this.elements.filter((e) => e.id !== element.id);
  }

  addPeer(peer: Peer) {
    this.peers.push(peer);
  }

  removePeer(peer: Peer) {
    this.peers = this.peers.filter((p) => p !== peer);
  }
}
