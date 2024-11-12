import os

class UIElements:
    def __init__(self, driver, click_threshold):
        self.driver = driver
        self.click_threshold = click_threshold
        self.ui_scripts_folder = "UI_scripts"

    def load_ui_scripts(self):
        js_scripts_combined = ""
        for filename in os.listdir(self.ui_scripts_folder):
            if filename.endswith(".js"):
                filepath = os.path.join(self.ui_scripts_folder, filename)
                with open(filepath, "r", encoding="utf-8") as file:
                    js_scripts_combined += file.read() + "\n"
        self.driver.execute_script(js_scripts_combined)

    def get_closest_element(self, x, y):
        return self.driver.execute_script(
            "return findClosestElement(arguments[0], arguments[1], arguments[2]);", x, y, self.click_threshold)

    def toggle_border(self, state, element):
        try:
            self.driver.execute_script(f"arguments[0].style.border = '{2 if state else 0}px solid red';", element)
        except:
            pass
