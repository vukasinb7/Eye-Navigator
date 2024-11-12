class UIElements:
    def __init__(self, driver, click_threshold):
        self.driver = driver
        self.click_threshold = click_threshold

    def get_closest_element_to_point(self, x, y):
        js_script = """
            const elements = Array.from(document.querySelectorAll('a, button, input[type="button"], input[type="submit"], [onclick]'));
            const range = arguments[2];
            const x = arguments[0];
            const y = arguments[1];

            function getDistanceToPoint(rect, x, y) {
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom)
                    return 0;
                if (x >= rect.left && x <= rect.right)
                    return Math.min(Math.abs(y-rect.top), Math.abs(y-rect.bottom));
                if (y >= rect.top && y <= rect.bottom)
                    return Math.min(Math.abs(x-rect.left), Math.abs(y-rect.right));
                let left = x <= rect.left;
                let top = y <= rect.top;
                return Math.sqrt((x - left ? rect.left : rect.right) ** 2 + (y - top ? rect.top : rect.bottom) ** 2);
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
                    const distance = getDistanceToPoint(rect, x, y)
                    
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

    def add_overlay(self):
        script = """
        function createContainer() {
            var container = document.createElement('div');
            container.className = 'gaze-overlay-ui-container';
            container.style.position = 'fixed';
            container.style.left = '0';
            container.style.top = '0%';
            container.style.width = '100px';
            container.style.height = '100%';
            container.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            container.style.zIndex = '100000000'; // Lower z-index for the container
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.justifyContent = 'space-between';
            container.style.alignItems = 'center';
            document.body.appendChild(container);
            return container;
        }

        function createArrowButton(direction) {
            var arrow = document.createElement('div');
            arrow.className = 'scroll-arrow-' + direction;
            arrow.style.width = '50px';
            arrow.style.height = '50px';
            arrow.style.margin = '10px';
            arrow.style.backgroundColor = 'rgba(44, 62, 80, 0.8)';
            arrow.style.cursor = 'pointer';
            arrow.style.display = 'flex';
            arrow.style.alignItems = 'center';
            arrow.style.justifyContent = 'center';
            arrow.style.color = 'white';
            arrow.innerHTML = direction === 'up' ? '▲' : direction === 'down' ? '▼' : direction === 'left' ? '◀' : '▶';

            var scrollInterval;
            var scrollSpeed = 10;
            var maxScrollSpeed = 150;
            var acceleration = 5;
            var hoverTime = 0;
            var scrollDelayTimeout;

            function startScrolling() {
                scrollInterval = setInterval(function() {
                    var scrollAmountX = direction === 'left' ? -scrollSpeed : direction === 'right' ? scrollSpeed : 0;
                    var scrollAmountY = direction === 'up' ? -scrollSpeed : direction === 'down' ? scrollSpeed : 0;
                    window.scrollBy(scrollAmountX, scrollAmountY);

                    hoverTime += 50;
                    if (hoverTime > 2000) {
                        if (scrollSpeed < maxScrollSpeed) {
                            scrollSpeed += acceleration;
                        }
                    }
                }, 50);
            }

            arrow.addEventListener('mouseenter', function() {
                hoverTime = 0;
                scrollSpeed = 10;
                scrollDelayTimeout = setTimeout(function() {
                    startScrolling();
                }, 1000);
            });

            arrow.addEventListener('mouseleave', function() {
                clearTimeout(scrollDelayTimeout);
                clearInterval(scrollInterval);
                hoverTime = 0;
                scrollSpeed = 10;
            });

            return arrow;
        }

        function createButton(type, icon, action) {
            var button = document.createElement('div');
            button.className = type + '-button';
            button.style.width = '50px';
            button.style.height = '50px';
            button.style.margin = '10px';
            button.style.backgroundColor = 'rgba(44, 62, 80, 0.8)';
            button.style.cursor = 'pointer';
            button.style.display = 'flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            button.style.color = 'white';
            button.style.position = 'relative';
            button.innerHTML = icon;

            var loadingFill = document.createElement('div');
            loadingFill.className = 'loading-fill';
            loadingFill.style.position = 'absolute';
            loadingFill.style.bottom = '0';
            loadingFill.style.left = '0';
            loadingFill.style.width = '100%';
            loadingFill.style.height = '0%';
            loadingFill.style.backgroundColor = 'rgba(0, 128, 0, 0.5)';
            loadingFill.style.transition = 'height 3s linear';
            button.appendChild(loadingFill);

            var timeout;
            var resetTransition = function() {
                loadingFill.style.transition = 'none';
                loadingFill.style.height = '0%';
                setTimeout(function() {
                    loadingFill.style.transition = 'height 3s linear';
                }, 50);
            };

            button.addEventListener('mouseenter', function() {
                loadingFill.style.height = '100%';
                timeout = setTimeout(function() {
                    loadingFill.style.height = '0%';
                    action();
                    resetTransition();
                }, 3000);
            });

            button.addEventListener('mouseleave', function() {
                clearTimeout(timeout);
                resetTransition();
            });

            return button;
        }

        function createToggleButton() {
            var toggleButton = createButton('toggle', '&#9776;', function() {
                var container = document.querySelector('.gaze-overlay-ui-container');
                var isHidden = container.style.display === 'none';

                toggleButton.style.left = isHidden ? '110px' : '0px';
                container.style.display = isHidden ? 'flex' : 'none';
            });

            toggleButton.style.position = 'fixed';
            toggleButton.style.top = '10px';
            toggleButton.style.left = '110px';
            toggleButton.style.zIndex = '100000001';
            return toggleButton;
        }

        var container = createContainer();

        container.appendChild(createArrowButton('up'));
        container.appendChild(createArrowButton('left'));
        container.appendChild(createArrowButton('right'));
        container.appendChild(createArrowButton('down'));

        container.appendChild(createButton('back', '←', function() {
            window.history.back();
        }));

        container.appendChild(createButton('forward', '→', function() {
            window.history.forward();
        }));

        container.appendChild(createButton('refresh', '🔄', function() {
            location.reload();
        }));

        document.body.appendChild(createToggleButton());
        """

        self.driver.execute_script(script)

    def toggle_border(self, state, element):
        try:
            self.driver.execute_script(f"arguments[0].style.border = '{2 if state else 0}px solid red';", element)
        except:
            pass
