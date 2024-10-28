class UIElements:
    def __init__(self, driver):
        self.driver = driver

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
        self.driver.execute_script("document.querySelector('.custom-scroll-ui-container').style.display = 'block';")

    def hide_scroll_arrow(self):
        self.driver.execute_script("document.querySelector('.custom-scroll-ui-container').style.display = 'none';")