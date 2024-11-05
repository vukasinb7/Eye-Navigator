class UIElements:
    def __init__(self, driver,click_threshold):
        self.driver = driver
        self.click_threshold=click_threshold

    def get_closest_element_near_point(self, x, y):
        js_script = """
            const elements = Array.from(document.querySelectorAll('a, button, input[type="button"], input[type="submit"], [onclick]'));
            const range = arguments[2];
            const x = arguments[0];
            const y = arguments[1];

            function getDistanceToPoint(rect, x, y) {
                const centerX = (rect.left + rect.right) / 2;
                const centerY = (rect.top + rect.bottom) / 2;
                return Math.sqrt((centerX - x) ** 2 + (centerY - y) ** 2);
            }

            let closestElement = null;
            let minDistance = Infinity;

            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (
                    rect.left <= x + range &&
                    rect.right >= x - range &&
                    rect.top <= y + range &&
                    rect.bottom >= y - range
                ) {
                    const distance = getDistanceToPoint(rect, x, y);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestElement = el;
                    }
                }
            });
            
            return closestElement;
        """

        closest_element = self.driver.execute_script(js_script, x, y, self.click_threshold)


        return closest_element

    def add_scroll_arrow(self):
        script = """
        // MAIN CONTAINER CHEVRONS
        var container = document.createElement('div');
        container.className = 'custom-scroll-ui-container';
        container.style.position = 'fixed';
        container.style.left = '0';
        container.style.bottom = '0';
        container.style.width = '100%';
        container.style.height = '200px'; 
        container.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        container.style.zIndex = '10000000000000';
        container.style.display = 'flex';
        container.style.justifyContent = 'space-between';
        container.style.alignItems = 'center';
        document.body.appendChild(container);

        // CHEVRON TRACKS
        const positions = ['20%', '50%', '80%'];

        positions.forEach((position) => {
            var chevronContainer = document.createElement('div');
            chevronContainer.className = 'chevron-container';
            chevronContainer.style.position = 'absolute';
            chevronContainer.style.left = position;
            chevronContainer.style.bottom = '75%';
            chevronContainer.style.transform = 'translate(-50%, 0%)';

            // CHEVRON
            for (let i = 0; i < 3; i++) {
                var chevron = document.createElement('div');
                chevron.className = 'chevron';
                chevron.style.position = 'absolute';
                chevron.style.width = '2.8rem';
                chevron.style.height = '0.64rem';
                chevron.style.opacity = '0';
                chevron.style.transform = 'scale(0.3)';
                chevron.style.animation = `move-chevron 2s ease-out ${i * 0.5}s infinite`;

                var before = document.createElement('div');
                before.style.position = 'absolute';
                before.style.top = '0';
                before.style.height = '100%';
                before.style.width = '50%';
                before.style.left = '0';
                before.style.background = '#2c3e50';
                before.style.transform = 'skewY(30deg)';

                var after = document.createElement('div');
                after.style.position = 'absolute';
                after.style.top = '0';
                after.style.height = '100%';
                after.style.width = '50%';
                after.style.right = '0';
                after.style.background = '#2c3e50';
                after.style.transform = 'skewY(-30deg)';

                chevron.appendChild(before);
                chevron.appendChild(after);

                chevronContainer.appendChild(chevron);
            }
            container.appendChild(chevronContainer);
        });
        """
        self.driver.execute_script(script)

        self.driver.execute_script("""
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
        @keyframes move-chevron {
            25% { opacity: 1; }
            33.3% { opacity: 1; transform: translateY(3.04rem); }
            66.6% { opacity: 1; transform: translateY(4.16rem); }
            100% { opacity: 0; transform: translateY(6.4rem) scale(0.5); }
        }`;
        document.getElementsByTagName('head')[0].appendChild(style);
        """)

        # Add keyframes animation styles in JavaScript
        self.driver.execute_script("""
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
        @keyframes move-chevron {
            25% { opacity: 1; }
            33.3% { opacity: 1; transform: translateY(3.04rem); }
            66.6% { opacity: 1; transform: translateY(4.16rem); }
            100% { opacity: 0; transform: translateY(6.4rem) scale(0.5); }
        }`;
        document.getElementsByTagName('head')[0].appendChild(style);
        """)

    def update_scroll_arrow_position(self, direction):
        position_script = {
            'up': "document.querySelector('.custom-scroll-ui-container').style.top = '10%'; "
                  "document.querySelector('.custom-scroll-ui-container').style.left = '50%'; "
                  "document.querySelector('.custom-scroll-ui-container').style.transform = 'translate(-50%, -50%) rotate(180deg)';",
            'down': "document.querySelector('.custom-scroll-ui-container').style.top = '90%'; "
                    "document.querySelector('.custom-scroll-ui-container').style.left = '50%'; "
                    "document.querySelector('.custom-scroll-ui-container').style.transform = 'translate(-50%, -50%) rotate(0deg)';",
            'left': "document.querySelector('.custom-scroll-ui-container').style.left = '5%'; "
                    "document.querySelector('.custom-scroll-ui-container').style.top = '50%'; "
                    "document.querySelector('.custom-scroll-ui-container').style.transform = 'translate(-50%, -50%) rotate(90deg)';",
            'right': "document.querySelector('.custom-scroll-ui-container').style.left = '95%'; "
                     "document.querySelector('.custom-scroll-ui-container').style.top = '50%'; "
                     "document.querySelector('.custom-scroll-ui-container').style.transform = 'translate(-50%, -50%) rotate(-90deg)';"
        }
        self.driver.execute_script(position_script[direction])

    def show_scroll_arrow(self):
        js_script = """
            const element = document.querySelector('.custom-scroll-ui-container');
            if (element) {
                element.style.display = 'block';
            } else {
                console.log('Element not found when trying to show scroll arrow.');
            }
        """
        self.driver.execute_script(js_script)

    def hide_scroll_arrow(self):
        js_script = """
            const element = document.querySelector('.custom-scroll-ui-container');
            if (element) {
                element.style.display = 'none';
            } else {
                console.log('Element not found when trying to hide scroll arrow.');
            }
        """
        self.driver.execute_script(js_script)

    def toggle_border(self, state,element):
        try:
            self.driver.execute_script(f"arguments[0].style.border = '{2 if state else 0}px solid red';", element)
        except:
            pass
