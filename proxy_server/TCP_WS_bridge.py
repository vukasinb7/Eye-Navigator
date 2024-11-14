import asyncio
import websockets
from asyncio import StreamReader, StreamWriter


class TCPWebSocketBridge:
    def __init__(self, tcp_host, tcp_port, ws_host, ws_port):
        self.tcp_host = tcp_host
        self.tcp_port = tcp_port
        self.ws_host = ws_host
        self.ws_port = ws_port

    async def forward_tcp_to_ws(self, reader: StreamReader, websocket):
        """
        Forwards data from the TCP connection to the WebSocket.
        """
        try:
            buffer = bytearray()

            while True:
                data = await reader.read(100)
                if not data:
                    break

                buffer.extend(data)

                if b'\r\n' in buffer:
                    *messages, buffer = buffer.split(b'\r\n')
                    for message in messages:
                        print(f"Received {message!r} from TCP")
                        await websocket.send(message)

        except (asyncio.CancelledError, websockets.exceptions.ConnectionClosed):
            pass
        finally:
            print("TCP connection closed")

    async def forward_ws_to_tcp(self, websocket, writer: StreamWriter):
        """
        Forwards data from the WebSocket to the TCP connection.
        """
        try:
            async for message in websocket:
                print(f"Received {message!r} from WebSocket")
                writer.write(message)
                await writer.drain()
        except (asyncio.CancelledError, websockets.exceptions.ConnectionClosed):
            pass
        finally:
            print("WebSocket connection closed")
            writer.close()
            await writer.wait_closed()

    async def handle_ws_connection(self, websocket):
        """
        Handles WebSocket connections and starts forwarding tasks.
        """
        tcp_reader, tcp_writer = await asyncio.open_connection(self.tcp_host, self.tcp_port)
        print(f"WebSocket connection opened, forwarding to TCP server {self.tcp_host}:{self.tcp_port}")

        try:
            await asyncio.gather(
                self.forward_tcp_to_ws(tcp_reader, websocket),
                self.forward_ws_to_tcp(websocket, tcp_writer)
            )
        except asyncio.CancelledError:
            print("WebSocket connection task canceled")

    async def start_server(self):
        """
        Start the WebSocket server.
        """
        ws_server = await websockets.serve(self.handle_ws_connection, self.ws_host, self.ws_port)
        print(f"WebSocket server started at ws://{self.ws_host}:{self.ws_port}")

        try:
            await ws_server.wait_closed()
        except asyncio.CancelledError:
            print("Server shutdown")


if __name__ == "__main__":
    tcp_host = '127.0.0.1'
    tcp_port = 4242
    ws_host = '127.0.0.1'
    ws_port = 5050

    bridge = TCPWebSocketBridge(tcp_host, tcp_port, ws_host, ws_port)
    try:
        asyncio.run(bridge.start_server())
    except KeyboardInterrupt:
        print("Server stopped manually")
