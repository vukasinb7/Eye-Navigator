function isOverlapping(element1, element2) {
    const element1Rect = element1.getBoundingClientRect();
    const element2Rect = element2.getBoundingClientRect();

    const expandedCursorRect = {
        horizontal: (element1Rect.left + element1Rect.right) * 0.5,
        vertical: (element1Rect.top + element1Rect.bottom) * 0.5,
    };

    return (
        expandedCursorRect.horizontal < element2Rect.right &&
        expandedCursorRect.horizontal > element2Rect.left &&
        expandedCursorRect.vertical < element2Rect.bottom &&
        expandedCursorRect.vertical > element2Rect.top
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

function createLoadableButton(type, icon, action = () => {
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


    let buttonContainer = document.createElement('a');
    buttonContainer.id = 'custom-gaze-button-' + type;
    buttonContainer.style.position = 'relative';
    buttonContainer.style.width = '100%';
    buttonContainer.style.height = '100%';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.alignItems = 'center';
    buttonContainer.appendChild(loadingFill);
    buttonContainer.appendChild(button);

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
        if (isOverlapping(customCursor, buttonContainer)) {
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
    return buttonContainer;
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

function createOverlayToggleButton(loadingDuration = 3) {
    let button = document.createElement('a');
    button.id = 'custom-gaze-button-toggle';
    button.className = 'toggle-button';
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
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '110px';
    button.style.zIndex = '100000001';
    button.innerHTML = '&#9776;';


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
                    let container = document.querySelector('.gaze-overlay-ui-container');
                    let isHidden = container.style.display === 'none';

                    toggleButton.style.left = isHidden ? '110px' : '0px';
                    container.style.display = isHidden ? 'flex' : 'none';
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

let overlayContainer = createOverlayContainer();
overlayContainer.style.display = "none";

let upButton = createNavigationArrowButton('up')
let leftButton = createNavigationArrowButton('left')
let rightButton = createNavigationArrowButton('right')
let downButton = createNavigationArrowButton('down')

let hoverTime;
getProperties((properties)=>{
    hoverTime=properties.hoverTime
})

let homeButton = createLoadableButton('home', homeIconSVG(), (e) => {
    const modal = document.querySelector('.custom-gaze-control-modal');
    modal.classList.toggle('active');
},hoverTime);
let backButton = createLoadableButton('back', backArrowSVG(), () => {
    window.history.back();
},hoverTime);
let forwardButton = createLoadableButton('forward', forwardArrowSVG(), () => {
    window.history.forward();
},hoverTime);
let refreshButton = createLoadableButton('refresh', refreshArrowSVG(), () => {
    location.reload()
},hoverTime);
let toggleButton = createOverlayToggleButton(hoverTime);
toggleButton.style.display = "none";

overlayContainer.appendChild(homeButton);
overlayContainer.appendChild(upButton);
overlayContainer.appendChild(leftButton);
overlayContainer.appendChild(rightButton);
overlayContainer.appendChild(downButton);
overlayContainer.appendChild(backButton);
overlayContainer.appendChild(forwardButton);
overlayContainer.appendChild(refreshButton);
document.body.appendChild(toggleButton);