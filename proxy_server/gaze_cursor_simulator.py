import asyncio
import time
from pynput import mouse

fpox, fpoy = 0.5, 0.5
screen_width, screen_height = 1920, 1080


def on_move(x, y):
    global fpox, fpoy, screen_width, screen_height

    # Normalize the mouse coordinates (0 to 1) based on screen resolution
    fpox = min(max(x / screen_width, 0), 1)
    fpoy = min(max(y / screen_height, 0), 1)


async def receive_data(reader):
    """Continuously receive data from the client and print it."""
    try:
        while True:
            data = await reader.readline()
            if data:
                print(f"Received: {data.decode().strip()}")
            else:
                # Client closed the connection
                break
    except asyncio.CancelledError:
        pass


async def send_data(writer):
    """Continuously send data with updated mouse coordinates to the client."""
    try:
        while True:
            current_time = time.time()

            # Format the message in XML with current mouse coordinates
            message = f'<REC FPOGX="{fpox:.5f}" FPOGY="{fpoy:.5f}" TIME="{current_time:.7f}"/>\r\n'.encode()

            # Send the message
            writer.write(message)
            await writer.drain()
            print(f"Sent: {message!r}")

            # Send continuously without delay
            await asyncio.sleep(0.1)

    except asyncio.CancelledError:
        pass


async def handle_client(reader, writer):
    """
    Handle incoming TCP client connection by starting separate tasks for receiving and sending data.
    """
    addr = writer.get_extra_info('peername')
    print(f"Connection from {addr}")

    # Create separate tasks for sending and receiving data
    receive_task = asyncio.create_task(receive_data(reader))
    send_task = asyncio.create_task(send_data(writer))

    # Wait for either task to complete (or be cancelled)
    done, pending = await asyncio.wait(
        [receive_task, send_task],
        return_when=asyncio.FIRST_COMPLETED,
    )

    # Cancel any remaining tasks
    for task in pending:
        task.cancel()

    print(f"Closing connection with {addr}")
    writer.close()
    await writer.wait_closed()


async def start_server():
    """
    Start the TCP server and listen for incoming connections.
    """
    server = await asyncio.start_server(
        handle_client, '127.0.0.1', 4242)
    addr = server.sockets[0].getsockname()
    print(f"TCP server started on {addr}")

    async with server:
        await server.serve_forever()


if __name__ == "__main__":
    # Start a listener to track mouse movements
    listener = mouse.Listener(on_move=on_move)
    listener.start()

    try:
        asyncio.run(start_server())
    finally:
        listener.stop()
