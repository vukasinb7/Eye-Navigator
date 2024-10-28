import socket
import xml.etree.ElementTree as ET

from pynput import keyboard
from selenium import webdriver

from ui_elements import UIElements


class GazePoint:
    def __init__(self, ip, port,  screen_width,screen_height,initial_page):
        self.address = (ip, port)
        self.screen_width = screen_width
        self.screen_height = screen_height
        self.scroll_amount=20
        self.scroll_threshold=0.15
        self.scroll_delay=2
        self.socket=socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect(self.address)
        self.driver=webdriver.Chrome()
        self.ui_elements=UIElements(self.driver)
        self.driver.get(initial_page)
        self.driver.maximize_window()
        self.scroll_direction=None
        self.scroll_start_time=None

    def calibrate(self):
        self.socket.send(str.encode(f'<SET ID="SCREEN_SIZE" X="0" Y="0" WIDTH="{self.screen_width}" HEIGHT="{self.screen_height}"/>\r\n'))
        self.socket.send(str.encode('<SET ID="CALIBRATE_SHOW" STATE="1" />\r\n'))
        self.socket.send(str.encode('<SET ID="CALIBRATE_START" STATE="1" />\r\n'))

        while True:
            data = self.socket.recv(1024)
            print(bytes.decode(data))
            if (bytes.decode(data).__contains__('"CALIB_RESULT"')):
                self.socket.send(str.encode('<SET ID="CALIBRATE_SHOW" STATE="0" />\r\n'))
                break



    def control(self):
        self.socket.send(str.encode('<SET ID="ENABLE_SEND_CURSOR" STATE="1" />\r\n'))
        self.socket.send(str.encode('<SET ID="ENABLE_SEND_POG_FIX" STATE="1" />\r\n'))
        self.socket.send(str.encode('<SET ID="ENABLE_SEND_TIME" STATE="1" />\r\n'))
        self.socket.send(str.encode('<SET ID="ENABLE_SEND_DATA" STATE="1" />\r\n'))

        work=True
        def on_release(key):
            nonlocal work
            if key == keyboard.Key.esc:
                work=False
                return False

        listener = keyboard.Listener(on_release=on_release)
        listener.start()
        self.ui_elements.add_scroll_arrow()

        while work:
            rxdat = self.socket.recv(1024)
            xml_string = bytes.decode(rxdat)
            try:
                root = ET.fromstring(xml_string)
                if root.tag == "REC":
                    time= float(root.attrib.get('TIME'))
                    fpogx = float(root.attrib.get('FPOGX'))
                    fpogy = float(root.attrib.get('FPOGY'))
                    self._scroll_detection(fpogx,fpogy,time)

            except KeyboardInterrupt:
                break
            except:
                continue
        listener.join()


    def disconnect(self):
        self.socket.close()

    def _scroll_detection(self,x,y,time):
        near_top = y < self.scroll_threshold
        near_bottom = y > 1 - self.scroll_threshold
        near_left = x < self.scroll_threshold
        near_right = x > 1 - self.scroll_threshold

        if near_top:
            direction = 'up'
        elif near_bottom:
            direction = 'down'
        elif near_left:
            direction = 'left'
        elif near_right:
            direction = 'right'
        else:
            direction = None

        current_time = time
        if direction:
            if direction == self.scroll_direction:
                if self.scroll_start_time and current_time - self.scroll_start_time >= self.scroll_delay:
                    if direction == 'up':
                        self.driver.execute_script(f"window.scrollBy(0, {-self.scroll_amount});")
                    elif direction == 'down':
                        self.driver.execute_script(f"window.scrollBy(0, {self.scroll_amount});")
                    elif direction == 'left':
                        self.driver.execute_script(f"window.scrollBy({-self.scroll_amount}, 0);")
                    elif direction == 'right':
                        self.driver.execute_script(f"window.scrollBy({self.scroll_amount}, 0);")

                    self.ui_elements.update_scroll_arrow_position(direction)
                    self.ui_elements.show_scroll_arrow()
            else:
                self.scroll_direction = direction
                self.scroll_start_time = current_time
        else:
            self.scroll_direction = None
            self.scroll_start_time = None
            self.ui_elements.hide_scroll_arrow()



