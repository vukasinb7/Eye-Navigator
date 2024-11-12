function createOverlayContainer() {
    var container = document.createElement('div');
    container.className = 'gaze-overlay-ui-container';
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '100px';
    container.style.height = '100%';
    container.style.backgroundColor = 'rgba(146, 144, 195, 0.4)';
    container.style.backdropFilter = 'blur(10px)';
    container.style.zIndex = '100000000';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.justifyContent = 'space-between';
    container.style.alignItems = 'center';
    document.body.appendChild(container);
    // document.body.style.marginLeft = '100px';

    return container;
}

function createNavigationArrowButton(direction) {
    var arrow = document.createElement('div');
    arrow.className = 'scroll-arrow-' + direction;
    arrow.style.width = '50px';
    arrow.style.height = '50px';
    arrow.style.margin = '10px';
    arrow.style.backgroundColor = 'rgba(7, 15, 43, 0.8)';
    arrow.style.borderRadius='10px';
    arrow.style.cursor = 'pointer';
    arrow.style.display = 'flex';
    arrow.style.alignItems = 'center';
    arrow.style.justifyContent = 'center';
    arrow.style.color = 'white';
    arrow.style.zIndex = '100000001';
    arrow.innerHTML = direction === 'up' ?
        '<svg style="padding: 5px;" width="256px" height="256px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" fill-rule="evenodd" d="M8,5.58578 L11.7071,9.29289 C12.0976,9.68342 12.0976,10.3166 11.7071,10.7071 C11.3466385,11.0675615 10.7793793,11.0952893 10.3871027,10.7902834 L10.2929,10.7071 L9,9.41421 L9,15 C9,15.5523 8.55229,16 8,16 C7.48716857,16 7.06449347,15.613973 7.0067278,15.1166239 L7,15 L7,9.41421 L5.70711,10.7071 C5.31658,11.0976 4.68342,11.0976 4.29289,10.7071 C3.93241,10.3466385 3.90468077,9.77939633 4.20970231,9.3870988 L4.29289,9.29289 L8,5.58578 Z M8,0 C9.10457,0 10,0.895431 10,2 C10,3.10457 9.10457,4 8,4 C6.89543,4 6,3.10457 6,2 C6,0.895431 6.89543,0 8,0 Z"></path> </g></svg>'
        : direction === 'down' ? '<svg style="padding: 5px;" width="256px" height="256px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff" transform="rotate(180)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" fill-rule="evenodd" d="M8,5.58578 L11.7071,9.29289 C12.0976,9.68342 12.0976,10.3166 11.7071,10.7071 C11.3466385,11.0675615 10.7793793,11.0952893 10.3871027,10.7902834 L10.2929,10.7071 L9,9.41421 L9,15 C9,15.5523 8.55229,16 8,16 C7.48716857,16 7.06449347,15.613973 7.0067278,15.1166239 L7,15 L7,9.41421 L5.70711,10.7071 C5.31658,11.0976 4.68342,11.0976 4.29289,10.7071 C3.93241,10.3466385 3.90468077,9.77939633 4.20970231,9.3870988 L4.29289,9.29289 L8,5.58578 Z M8,0 C9.10457,0 10,0.895431 10,2 C10,3.10457 9.10457,4 8,4 C6.89543,4 6,3.10457 6,2 C6,0.895431 6.89543,0 8,0 Z"></path> </g></svg>'
            : direction === 'left' ? '<svg style="padding: 5px;" width="256px" height="256px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff" transform="rotate(270)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" fill-rule="evenodd" d="M8,5.58578 L11.7071,9.29289 C12.0976,9.68342 12.0976,10.3166 11.7071,10.7071 C11.3466385,11.0675615 10.7793793,11.0952893 10.3871027,10.7902834 L10.2929,10.7071 L9,9.41421 L9,15 C9,15.5523 8.55229,16 8,16 C7.48716857,16 7.06449347,15.613973 7.0067278,15.1166239 L7,15 L7,9.41421 L5.70711,10.7071 C5.31658,11.0976 4.68342,11.0976 4.29289,10.7071 C3.93241,10.3466385 3.90468077,9.77939633 4.20970231,9.3870988 L4.29289,9.29289 L8,5.58578 Z M8,0 C9.10457,0 10,0.895431 10,2 C10,3.10457 9.10457,4 8,4 C6.89543,4 6,3.10457 6,2 C6,0.895431 6.89543,0 8,0 Z"></path> </g></svg>' :
                '<svg style="padding: 5px;" width="256px" height="256px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff" transform="rotate(90)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" fill-rule="evenodd" d="M8,5.58578 L11.7071,9.29289 C12.0976,9.68342 12.0976,10.3166 11.7071,10.7071 C11.3466385,11.0675615 10.7793793,11.0952893 10.3871027,10.7902834 L10.2929,10.7071 L9,9.41421 L9,15 C9,15.5523 8.55229,16 8,16 C7.48716857,16 7.06449347,15.613973 7.0067278,15.1166239 L7,15 L7,9.41421 L5.70711,10.7071 C5.31658,11.0976 4.68342,11.0976 4.29289,10.7071 C3.93241,10.3466385 3.90468077,9.77939633 4.20970231,9.3870988 L4.29289,9.29289 L8,5.58578 Z M8,0 C9.10457,0 10,0.895431 10,2 C10,3.10457 9.10457,4 8,4 C6.89543,4 6,3.10457 6,2 C6,0.895431 6.89543,0 8,0 Z"></path> </g></svg>';

    var scrollInterval;
    var scrollSpeed = 10;
    var maxScrollSpeed = 150;
    var acceleration = 5;
    var hoverTime = 0;
    var scrollDelayTimeout;

    function startScrolling() {
        scrollInterval = setInterval(function () {
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

    arrow.addEventListener('mouseenter', function () {
        hoverTime = 0;
        scrollSpeed = 10;
        scrollDelayTimeout = setTimeout(function () {
            startScrolling();
        }, 1000);
    });

    arrow.addEventListener('mouseleave', function () {
        clearTimeout(scrollDelayTimeout);
        clearInterval(scrollInterval);
        hoverTime = 0;
        scrollSpeed = 10;
    });

    return arrow;
}

function createLoadableButton(type, icon, action) {
    var button = document.createElement('div');
    button.className = type + '-button';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.margin = '10px';
    button.style.backgroundColor = 'rgba(7, 15, 43, 0.8)';
    button.style.borderRadius='10px';
    button.style.overflow='hidden';
    button.style.cursor = 'pointer';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.color = 'white';
    button.style.position = 'relative';
    button.style.zIndex = '100000001';
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
    var resetTransition = function () {
        loadingFill.style.transition = 'none';
        loadingFill.style.height = '0%';
        setTimeout(function () {
            loadingFill.style.transition = 'height 3s linear';
        }, 50);
    };

    button.addEventListener('mouseenter', function () {
        loadingFill.style.height = '100%';
        timeout = setTimeout(function () {
            loadingFill.style.height = '0%';
            action();
            resetTransition();
        }, 3000);
    });

    button.addEventListener('mouseleave', function () {
        clearTimeout(timeout);
        resetTransition();
    });

    return button;
}

function createOverlayToggleButton() {
    var toggleButton = createLoadableButton('toggle', '&#9776;', function () {
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

var container = createOverlayContainer();

container.appendChild(createNavigationArrowButton('up'));
container.appendChild(createNavigationArrowButton('left'));
container.appendChild(createNavigationArrowButton('right'));
container.appendChild(createNavigationArrowButton('down'));

container.appendChild(createLoadableButton('back', '<svg style="padding: 5px" width="256px" height="256px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="1.08"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 10L3.29289 10.7071L2.58579 10L3.29289 9.29289L4 10ZM21 18C21 18.5523 20.5523 19 20 19C19.4477 19 19 18.5523 19 18L21 18ZM8.29289 15.7071L3.29289 10.7071L4.70711 9.29289L9.70711 14.2929L8.29289 15.7071ZM3.29289 9.29289L8.29289 4.29289L9.70711 5.70711L4.70711 10.7071L3.29289 9.29289ZM4 9L14 9L14 11L4 11L4 9ZM21 16L21 18L19 18L19 16L21 16ZM14 9C17.866 9 21 12.134 21 16L19 16C19 13.2386 16.7614 11 14 11L14 9Z" fill="#ffffff"></path> </g></svg>', function () {
    window.history.back();
}));

container.appendChild(createLoadableButton('forward', '<svg style="padding: 5px" width="256px" height="256px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="1.08" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 10L3.29289 10.7071L2.58579 10L3.29289 9.29289L4 10ZM21 18C21 18.5523 20.5523 19 20 19C19.4477 19 19 18.5523 19 18L21 18ZM8.29289 15.7071L3.29289 10.7071L4.70711 9.29289L9.70711 14.2929L8.29289 15.7071ZM3.29289 9.29289L8.29289 4.29289L9.70711 5.70711L4.70711 10.7071L3.29289 9.29289ZM4 9L14 9L14 11L4 11L4 9ZM21 16L21 18L19 18L19 16L21 16ZM14 9C17.866 9 21 12.134 21 16L19 16C19 13.2386 16.7614 11 14 11L14 9Z" fill="#ffffff"></path> </g></svg>', function () {
    window.history.forward();
}));

container.appendChild(createLoadableButton('refresh', '<svg style="padding: 5px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 3V8M21 8H16M21 8L18 5.29168C16.4077 3.86656 14.3051 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.2832 21 19.8675 18.008 20.777 14" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>', function () {
    location.reload();
}));

document.body.appendChild(createOverlayToggleButton());