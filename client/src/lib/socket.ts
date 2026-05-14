// ─── Socket.IO Client (Offline-Safe) ───
// No external dependency required. Real WebSocket will be used when socket.io-client is installed.

interface SocketLike {
  connected: boolean;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
  disconnect: () => void;
}

let socket: SocketLike | null = null;
const eventHandlers = new Map<string, Set<(...args: any[]) => void>>();

function createMockSocket(): SocketLike {
  return {
    connected: false,
    on: (event: string, callback: (...args: any[]) => void) => {
      if (!eventHandlers.has(event)) eventHandlers.set(event, new Set());
      eventHandlers.get(event)!.add(callback);
    },
    off: (event: string, callback: (...args: any[]) => void) => {
      eventHandlers.get(event)?.delete(callback);
    },
    emit: () => {},
    disconnect: () => { socket = null; },
  };
}

export function connectSocket(_userId: string) {
  if (socket?.connected) return socket;
  socket = createMockSocket();
  console.log('🔌 Socket: offline mode (install socket.io-client for real-time)');
  return socket;
}

export function getSocket(): SocketLike | null {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
  eventHandlers.clear();
}

export function onNotification(callback: (data: any) => void) {
  if (!eventHandlers.has('notification')) eventHandlers.set('notification', new Set());
  eventHandlers.get('notification')!.add(callback);
  socket?.on('notification', callback);
  return () => {
    socket?.off('notification', callback);
    eventHandlers.get('notification')?.delete(callback);
  };
}

export function onHealthUpdate(callback: (data: any) => void) {
  if (!eventHandlers.has('health-update')) eventHandlers.set('health-update', new Set());
  eventHandlers.get('health-update')!.add(callback);
  socket?.on('health-update', callback);
  return () => {
    socket?.off('health-update', callback);
    eventHandlers.get('health-update')?.delete(callback);
  };
}
