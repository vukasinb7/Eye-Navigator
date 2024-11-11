from gazepoint import GazePoint

if __name__ == '__main__':
    g = GazePoint("127.0.0.1", 4242, 1920, 1080, initial_page="https://benchmark.rs/")
    # g.calibrate()
    g.control()
    # g.disconnect()
