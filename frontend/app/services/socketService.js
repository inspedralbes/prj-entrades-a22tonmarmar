import { io } from "socket.io-client";

let socket = null;

export function connectSockets() {
  if (socket) return socket;

  console.log(
    "[WS client] Initializing socket.io client with baseUrl:",
    window.location.origin + "/sockets",
  );

  socket = io(window.location.origin + "/sockets");

  socket.on("connect", () => {
    console.log("[WS client] Connected to sockets server with id", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error(
      "[WS client] Connection error to sockets server:",
      err?.message || err,
    );
  });

  socket.on("error", (err) => {
    console.error("[WS client] Socket error:", err?.message || err);
  });

  socket.on("disconnect", (reason) => {
    console.log("[WS client] Disconnected from sockets server:", reason);
  });

  return socket;
}

export function joinEventRoom(eventId) {
  if (!socket) return;
  console.log("[WS client] Joining event room", eventId);
  socket.emit("join_event", { eventId });
}

export function leaveEventRoom(eventId) {
  if (!socket) return;
  console.log("[WS client] Leaving event room", eventId);
  socket.emit("leave_event", { eventId });
}

export function onRoomUpdated(handler) {
  if (!socket) return;
  console.log("[WS client] Subscribing to room_updated events");
  socket.on("room_updated", handler);
}

export function offRoomUpdated(handler) {
  if (!socket) return;
  socket.off("room_updated", handler);
}

export function disconnectSockets() {
  if (!socket) return;
  console.log("[WS client] Disconnecting from sockets server");
  socket.disconnect();
  socket = null;
}
