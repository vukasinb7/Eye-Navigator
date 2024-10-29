import socket
import xml.etree.ElementTree as ET

from pynput import keyboard
from selenium import webdriver

from record import Record
from ui_elements import UIElements


class GazePoint:
    def __init__(self, ip, port, screen_width, screen_height, initial_page):
        self.address = (ip, port)
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect(self.address)

        self.driver = webdriver.Chrome()
        self.ui_elements = UIElements(self.driver)
        self.driver.get(initial_page)
        self.driver.maximize_window()

        self.screen_width = screen_width
        self.screen_height = screen_height
        self.vertical_scroll_amount = 20
        self.horizontal_scroll_amount = 15
        self.scroll_threshold = 0.15
        self.scroll_delay = 2  # seconds
        self.scroll_direction = None
        self.scroll_start_time = None

    def calibrate(self):
        commands = [
            f'<SET ID="SCREEN_SIZE" X="0" Y="0" WIDTH="{self.screen_width}" HEIGHT="{self.screen_height}"/>\r\n',
            '<SET ID="CALIBRATE_SHOW" STATE="1" />\r\n',
            '<SET ID="CALIBRATE_START" STATE="1" />\r\n'
        ]

        for cmd in commands:
            self.socket.send(cmd.encode())

        while True:
            data = self.socket.recv(1024).decode()
            print(data)
            if '"CALIB_RESULT"' in data:
                self.socket.send('<SET ID="CALIBRATE_SHOW" STATE="0" />\r\n'.encode())
                break

    def control(self):
        control_commands = [
            '<SET ID="ENABLE_SEND_CURSOR" STATE="1" />\r\n',
            '<SET ID="ENABLE_SEND_POG_FIX" STATE="1" />\r\n',
            '<SET ID="ENABLE_SEND_TIME" STATE="1" />\r\n',
            '<SET ID="ENABLE_SEND_DATA" STATE="1" />\r\n'
        ]

        for cmd in control_commands:
            self.socket.send(cmd.encode())

        # Keyboard listener to stop on Esc press
        def on_release(key):
            if key == keyboard.Key.esc:
                return False

        with keyboard.Listener(on_release=on_release) as listener:
            self.ui_elements.add_scroll_arrow()

            while listener.running:
                rxdat = self.socket.recv(1024).decode()

                try:
                    root = ET.fromstring(rxdat)
                    if root.tag == "REC":
                        record = Record(float(root.attrib.get('FPOGX')),
                                        float(root.attrib.get('FPOGY')),
                                        float(root.attrib.get('TIME')))
                        self.scroll_detection(record)

                except ET.ParseError:
                    continue

    def disconnect(self):
        self.socket.close()

    def scroll_detection(self, record):
        directions = {
            'up': (record.y < self.scroll_threshold, 0, -self.vertical_scroll_amount),
            'down': (record.y > 1 - self.scroll_threshold, 0, self.vertical_scroll_amount),
            'left': (record.x < self.scroll_threshold, -self.horizontal_scroll_amount, 0),
            'right': (record.x > 1 - self.scroll_threshold, self.horizontal_scroll_amount, 0)
        }

        # Determine scroll direction
        direction = next((dir_name for dir_name, (cond, _, _) in directions.items() if cond), None)

        if direction:
            if direction == self.scroll_direction and (record.time - self.scroll_start_time >= self.scroll_delay):
                # Execute scrolling
                scroll_x, scroll_y = directions[direction][1], directions[direction][2]
                self.driver.execute_script(f"window.scrollBy({scroll_x}, {scroll_y});")

                # Update UI
                self.ui_elements.update_scroll_arrow_position(direction)
                self.ui_elements.show_scroll_arrow()

            elif direction != self.scroll_direction:
                # Reset scroll start time for new direction
                self.scroll_direction = direction
                self.scroll_start_time = record.time
        else:
            # Reset scrolling if not near any edge
            self.scroll_direction = None
            self.scroll_start_time = None
            self.ui_elements.hide_scroll_arrow()
