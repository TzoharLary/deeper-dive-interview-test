import { Response } from 'express';

let clients: Response[] = [];

// Register a listening browser client
export function addClient(res: Response) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  clients.push(res);
}

// Broadcast a refresh command to all connected clients
export function triggerRefresh() {
  clients.forEach(res => res.write('data: refresh\n\n'));
}
