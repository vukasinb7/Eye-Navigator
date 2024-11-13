import asyncio
import random
import time


async def handle_client(reader, writer):
    """
    Handle incoming TCP client connection, print received data, and send periodic data.
    """
    addr = writer.get_extra_info('peername')
    print(f"Connection from {addr}")

    try:
        while True:
            # Simulate gaze data values
            fpox = random.uniform(0, 1)  # Random float between 0 and 1
            fpoy = random.uniform(0, 1)  # Random float between 0 and 1
            current_time = time.time()  # Current timestamp

            # Format the message in XML
            message = f'<REC FPOGX="{fpox:.5f}" FPOGY="{fpoy:.5f}" TIME="{current_time:.7f}"/>\n'.encode()

            # Send the message
            writer.write(message)
            await writer.drain()
            print(f"Sent: {message!r}")

            # Wait for 2 seconds before sending again
            await asyncio.sleep(2)

    except asyncio.CancelledError:
        pass
    finally:
        print(f"Closing connection with {addr}")
        writer.close()
        await writer.wait_closed()


async def start_server():
    """
    Start the TCP server and listen for incoming connections.
    """
    server = await asyncio.start_server(
        handle_client, '127.0.0.1', 4242)  # Change the IP and port if needed
    addr = server.sockets[0].getsockname()
    print(f"TCP server started on {addr}")

    async with server:
        await server.serve_forever()


if __name__ == "__main__":
    asyncio.run(start_server())
