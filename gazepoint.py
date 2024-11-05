import socket
import xml.etree.ElementTree as ET

import pyautogui
from pynput import keyboard
from selenium import webdriver
from selenium.webdriver import Keys

from record import Record
from ui_elements import UIElements


class GazePoint:
    def __init__(self, ip, port, screen_width, screen_height, initial_page):
        self.address = (ip, port)
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect(self.address)

        self.screen_width = screen_width
        self.screen_height = screen_height
        self.vertical_scroll_amount = 80
        self.horizontal_scroll_amount = 15
        self.scroll_threshold = 0.15
        self.scroll_delay = 2  # seconds
        self.scroll_direction = None
        self.scroll_start_time = None

        self.click_threshold = 50
        self.click_delay = 2
        self.click_element = None
        self.click_start_time = None

        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_experimental_option('excludeSwitches', ['load-extension', 'enable-automation'])
        chrome_options.add_argument("--start-fullscreen")
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.get(initial_page)

        self.ui_elements = UIElements(self.driver,self.click_threshold)


    def calibrate(self):
        commands = [
            f'<SET ID="SCREEN_SIZE" X="0" Y="0" WIDTH="{self.screen_width}" HEIGHT="{self.screen_height}"/>\r\n',
            '<SET ID="CALIBRATE_CLEAR"/>\r\n'
            '<SET ID="CALIBRATE_ADDPOINT" X="0.1" Y="0.1" />\r\n',
            '<SET ID="CALIBRATE_ADDPOINT" X="0.3" Y="0.3" />\r\n',
            '<SET ID="CALIBRATE_ADDPOINT" X="0.5" Y="0.1" />\r\n',
            '<SET ID="CALIBRATE_ADDPOINT" X="0.7" Y="0.3" />\r\n',
            '<SET ID="CALIBRATE_ADDPOINT" X="0.9" Y="0.1" />\r\n',

            '<SET ID="CALIBRATE_ADDPOINT" X="0.9" Y="0.5" />\r\n',
            '<SET ID="CALIBRATE_ADDPOINT" X="0.7" Y="0.7" />\r\n',
            '<SET ID="CALIBRATE_ADDPOINT" X="0.5" Y="0.5" />\r\n',
            '<SET ID="CALIBRATE_ADDPOINT" X="0.3" Y="0.7" />\r\n',
            '<SET ID="CALIBRATE_ADDPOINT" X="0.1" Y="0.5" />\r\n',

            '<SET ID="CALIBRATE_ADDPOINT" X="0.1" Y="0.9" />\r\n',
            '<SET ID="CALIBRATE_ADDPOINT" X="0.5" Y="0.9" />\r\n',
            '<SET ID="CALIBRATE_ADDPOINT" X="0.9" Y="0.9" />\r\n',



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
                        pyautogui.FAILSAFE=False
                        pyautogui.moveTo(record.x*self.screen_width, record.y*self.screen_height)
                        self.scroll_detection(record)
                        self.click_detection(record)

                except ET.ParseError:
                    continue


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

    def click_detection(self, record):
        closest_element=self.ui_elements.get_closest_element_near_point(record.x*self.screen_width, record.y*self.screen_height)

        if closest_element:
            if closest_element == self.click_element and (record.time - self.click_start_time >= self.click_delay):
                try:
                    closest_element.click()
                    self.ui_elements.add_scroll_arrow()
                except:
                    pass

            elif closest_element != self.click_element:
                self.ui_elements.toggle_border(True,closest_element)
                self.ui_elements.toggle_border(False,self.click_element)
                self.click_element = closest_element
                self.click_start_time = record.time
        else:
            self.ui_elements.toggle_border(False,self.click_element)
            self.click_element = None
            self.click_start_time = None


    def disconnect(self):
        self.socket.close()