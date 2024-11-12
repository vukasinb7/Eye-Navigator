from gazepoint import GazePoint
from screeninfo import get_monitors


if __name__ == '__main__':
    # Config
    monitor = get_monitors()[0]
    width, height = monitor.width, monitor.height
    ip = "127.0.0.1"
    port = 4242

    # Eye Navigator
    g = GazePoint(ip, port, width, height, initial_page="https://benchmark.rs/")
    # g.calibrate()
    g.control()
    # g.disconnect()
