import socket

from selenium import webdriver
from gazepoint import GazePoint
from ui_elements import UIElements

if __name__ == '__main__':
    g=GazePoint("127.0.0.1",4242,2560,1080,initial_page="https://benchmark.rs/")
    g.calibrate()
    g.control()
    g.disconnect()


    # UI Element Test Purpose Only
    # driver = webdriver.Chrome()
    # driver.get("https://benchmark.rs/")
    # driver.maximize_window()
    # ui_elements=UIElements(driver)
    # ui_elements.add_scroll_arrow()
    # ui_elements.update_scroll_arrow_position("down")
    # ui_elements.show_scroll_arrow()
    # while True:
    #     pass








