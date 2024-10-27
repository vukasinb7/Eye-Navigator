from selenium import webdriver
import time

# Initialize WebDriver
driver = webdriver.Edge()
driver.get("http://www.polovniautomobili.rs")

def scroll_based_on_gaze(gaze_x, gaze_y, screen_height, screen_width):
    scroll_amount = 200

    # Vertical scrolling
    if gaze_y < screen_height * 0.1:
        driver.execute_script(f"window.scrollBy(0, {-scroll_amount});")
    elif gaze_y > screen_height * 0.9:
        driver.execute_script(f"window.scrollBy(0, {scroll_amount});")

    # Horizontal scrolling
    if gaze_x < screen_width * 0.1:
        driver.execute_script("window.scrollBy(-50, 0);")
    elif gaze_x > screen_width * 0.9:
        driver.execute_script("window.scrollBy(50, 0);")

while True:
    gaze_x, gaze_y = 1290, 1000
    screen_width, screen_height = 2560, 1080

    scroll_based_on_gaze(gaze_x, gaze_y, screen_height, screen_width)
