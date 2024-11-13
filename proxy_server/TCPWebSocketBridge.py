import asyncio
import websockets
from asyncio import StreamReader, StreamWriter


class TCPWebSocketBridge:
    def __init__(self, tcp_host, tcp_port, ws_host, ws_port):
        self.tcp_host = tcp_host
        self.tcp_port = tcp_port
        self.ws_host = ws_host
        self.ws_port = ws_port

    async def handle_tcp_connection(self, reader: StreamReader, writer: StreamWriter, websocket):
        """
        Handles the TCP connection and forwards data to WebSocket.
        """
        try:
            buffer = b''  # Buffer to accumulate data

            while True:
                data = await reader.read(100)  # Read data in chunks
                if not data:
                    break  # Connection closed

                buffer += data  # Accumulate data into buffer

                # Check if buffer contains a complete message (end of message is assumed to be '\r\n')
                if b'\r\n' in buffer:
                    # Split the buffer into complete messages
                    messages = buffer.split(b'\r\n')
                    for message in messages[:-1]:  # Process all complete messages except the last one
                        print(f"Received {message!r} from TCP")
                        await websocket.send(message)  # Forward data to WebSocket

                    buffer = messages[-1]  # Remaining data in the buffer (incomplete message)

        except asyncio.CancelledError:
            pass
        finally:
            print("TCP connection closed")
            writer.close()

    async def handle_ws_connection(self, websocket):
        """
        Handles WebSocket connections and forwards data to TCP.
        """
        # Connect to the TCP server
        tcp_client = await asyncio.open_connection(self.tcp_host, self.tcp_port)
        tcp_reader, tcp_writer = tcp_client

        print(f"WebSocket connection opened, forwarding to TCP server {self.tcp_host}:{self.tcp_port}")

        # Start a task that listens for WebSocket data and forwards it to TCP
        async def forward_ws_to_tcp():
            try:
                async for message in websocket:
                    print(f"Received {message!r} from WebSocket")
                    tcp_writer.write(message)  # Forward message to TCP
                    await tcp_writer.drain()
            except websockets.exceptions.ConnectionClosed:
                pass
            finally:
                print("WebSocket connection closed")
                tcp_writer.close()

        # Start both the TCP to WebSocket and WebSocket to TCP forwarding tasks
        await asyncio.gather(
            self.handle_tcp_connection(tcp_reader, tcp_writer, websocket),
            forward_ws_to_tcp()
        )

    async def start_server(self):
        """
        Start both TCP and WebSocket servers.
        """
        # WebSocket server
        ws_server = await websockets.serve(self.handle_ws_connection, self.ws_host, self.ws_port)
        print(f"WebSocket server started at ws://{self.ws_host}:{self.ws_port}")

        # Start the asyncio event loop for WebSocket server
        await ws_server.wait_closed()


if __name__ == "__main__":
    tcp_host = '127.0.0.1'
    tcp_port = 4242
    ws_host = '127.0.0.1'
    ws_port = 5050

    bridge = TCPWebSocketBridge(tcp_host, tcp_port, ws_host, ws_port)
    asyncio.run(bridge.start_server())