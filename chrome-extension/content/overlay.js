function isOverlapping(element1, element2) {
    const element1Rect = element1.getBoundingClientRect();
    const element2Rect = element2.getBoundingClientRect();

    const expandedCursorRect = {
        left: element1Rect.left,
        right: element1Rect.right,
        top: element1Rect.top,
        bottom: element1Rect.bottom
    };

    return (
        expandedCursorRect.left < element2Rect.right &&
        expandedCursorRect.right > element2Rect.left &&
        expandedCursorRect.top < element2Rect.bottom &&
        expandedCursorRect.bottom > element2Rect.top
    );
}

function createOverlayContainer() {
    let container = document.createElement('div');
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
    return container;
}

function createLoadableButton(type, icon, action = function () {
}, loadingDuration = 3) {
    let button = document.createElement('div');
    button.className = type + '-button';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.margin = '10px';
    button.style.backgroundColor = 'rgba(7, 15, 43, 0.8)';
    button.style.borderRadius = '10px';
    button.style.overflow = 'hidden';
    button.style.cursor = 'pointer';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.color = 'white';
    button.style.position = 'relative';
    button.style.zIndex = '100000001';
    button.innerHTML = icon;

    let loadingFill = document.createElement('div');
    loadingFill.className = 'loading-fill';
    loadingFill.style.position = 'absolute';
    loadingFill.style.bottom = '0';
    loadingFill.style.left = '0';
    loadingFill.style.width = '100%';
    loadingFill.style.height = '0%';
    loadingFill.style.backgroundColor = 'rgba(0, 128, 0, 0.5)';
    loadingFill.style.transition = `height ${loadingDuration}s linear`;
    button.appendChild(loadingFill);

    let timeout;
    let isLoading = false;

    let resetTransition = function () {
        loadingFill.style.transition = 'none';
        loadingFill.style.height = '0%';
        setTimeout(function () {
            loadingFill.style.transition = `height ${loadingDuration}s linear`;
        }, 50);
    };

    document.addEventListener('cursorUpdated', function (event) {
        if (isOverlapping(customCursor, button)) {
            if (!isLoading) {
                loadingFill.style.height = '100%';
                isLoading = true
                timeout = setTimeout(function () {
                    loadingFill.style.height = '0%';
                    action();
                    resetTransition();
                }, loadingDuration * 1000);
            }
        } else {
            clearTimeout(timeout);
            resetTransition();
            isLoading = false
        }
    });
    return button;
}

function createNavigationArrowButton(direction) {
    let arrowButton = createLoadableButton(direction, directionArrowSVG(direction), function () {
    }, 1);

    let scrollSpeed = 10;
    let maxScrollSpeed = 100;
    let acceleration = 5;
    let hoverTime = 0;
    let scrollDelayTimeout;
    let scrollInterval;
    let isScrolling = false;

    function startScrolling() {
        scrollInterval = setInterval(function () {
            let scrollAmountX = direction === 'left' ? -scrollSpeed : direction === 'right' ? scrollSpeed : 0;
            let scrollAmountY = direction === 'up' ? -scrollSpeed : direction === 'down' ? scrollSpeed : 0;
            window.scrollBy(scrollAmountX, scrollAmountY);

            hoverTime += 50;
            if (hoverTime > 2000) {
                if (scrollSpeed < maxScrollSpeed) {
                    scrollSpeed += acceleration;
                }
            }
        }, 50);
    }

    document.addEventListener('cursorUpdated', function (event) {
        if (isOverlapping(customCursor, arrowButton)) {
            if (!isScrolling) {
                isScrolling = true;
                scrollDelayTimeout = setTimeout(function () {
                    startScrolling();
                }, 1000);
            }
        } else {
            clearTimeout(scrollDelayTimeout);
            clearInterval(scrollInterval);
            hoverTime = 0;
            scrollSpeed = 10;
            isScrolling = false;
        }
    });
    return arrowButton;
}

function createOverlayToggleButton() {
    let toggleButton = createLoadableButton('toggle', '&#9776;', function () {
        let container = document.querySelector('.gaze-overlay-ui-container');
        let isHidden = container.style.display === 'none';

        toggleButton.style.left = isHidden ? '110px' : '0px';
        container.style.display = isHidden ? 'flex' : 'none';
    });

    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.left = '110px';
    toggleButton.style.zIndex = '100000001';
    return toggleButton;
}

let container = createOverlayContainer();

let upButton = createNavigationArrowButton('up')
let leftButton = createNavigationArrowButton('left')
let rightButton = createNavigationArrowButton('right')
let downButton = createNavigationArrowButton('down')

let backButton = createLoadableButton('back', backArrowSVG(), function () {
    window.history.back();
});
let forwardButton = createLoadableButton('forward', forwardArrowSVG(), function () {
    window.history.forward();
});
let refreshButton = createLoadableButton('refresh', refreshArrowSVG(), function () {
    location.reload();
});
let toggleButton = createOverlayToggleButton();

container.appendChild(upButton);
container.appendChild(leftButton);
container.appendChild(rightButton);
container.appendChild(downButton);
container.appendChild(backButton);
container.appendChild(forwardButton);
container.appendChild(refreshButton);
document.body.appendChild(toggleButton);