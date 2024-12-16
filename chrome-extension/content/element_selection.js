let previousElement = null;
let hoverTimer = null
let inputClickedElement = null;

function isElementVisible(element) {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        rect.width > 0 && rect.height > 0
    );
}

function getPageElements() {
    const modalContainer = document.querySelector('.custom-gaze-control-modal');
    const keyboardContainer = document.querySelector('.custom-gaze-control-keyboard-modal');

    if (keyboardContainer && keyboardContainer.classList.contains('active')) {
        const elements = Array.from(keyboardContainer.querySelectorAll('a, button, [onclick]'));
        return elements.filter(isElementVisible);
    }

    if (modalContainer && modalContainer.classList.contains('active')) {
        let elements = Array.from(modalContainer.querySelectorAll('a, button, input, [onclick], textarea'));
        const overlay = Array.from(document.querySelectorAll('.gaze-overlay-ui-container a'));
        Array.prototype.push.apply(elements, overlay);
        elements.push(document.querySelector('#custom-gaze-button-toggle'));
        return elements.filter(isElementVisible);
    }

    // Return only visible elements from the page
    const elements = Array.from(document.querySelectorAll('a, button, input, [onclick], textarea'));
    return elements.filter(isElementVisible);
}


function shouldShowVirtualKeyboard(element) {
    return (element.tagName.toLowerCase() === 'input' &&
        !['checkbox', 'radio', 'button', 'submit', 'reset'].includes(element.type)) ||
        element.tagName.toLowerCase() === 'textarea';
}

function openVirtualKeyboard(element) {
    const modal = document.querySelector('.custom-gaze-control-keyboard-modal');
    modal.classList.add('active');
    inputClickedElement = element;
    document.querySelector('.custom-gaze-keyboard .custom-gaze-input').value = element.value;

}

function findClosestElementToCursor(customCursor, cursorRange) {
    const cursorRect = customCursor.getBoundingClientRect();
    const cursorCenterX = (cursorRect.left + cursorRect.right) / 2;
    const cursorCenterY = (cursorRect.top + cursorRect.bottom) / 2;

    const elements = getPageElements();

    function getDistanceToRect(rect) {
        if (cursorCenterX >= rect.left && cursorCenterX <= rect.right && cursorCenterY >= rect.top && cursorCenterY <= rect.bottom) return 0;
        if (cursorCenterX >= rect.left && cursorCenterX <= rect.right) return Math.min(Math.abs(cursorCenterY - rect.top), Math.abs(cursorCenterY - rect.bottom));
        if (cursorCenterY >= rect.top && cursorCenterY <= rect.bottom) return Math.min(Math.abs(cursorCenterX - rect.left), Math.abs(cursorCenterX - rect.right));
        let left = cursorCenterX <= rect.left;
        let top = cursorCenterY <= rect.top;
        return Math.sqrt((cursorCenterX - (left ? rect.left : rect.right)) ** 2 + (cursorCenterY - (top ? rect.top : rect.bottom)) ** 2);
    }

    // Filter elements within the specified range
    const filteredElements = elements.filter(el => {
        const rect = el.getBoundingClientRect();
        return (
            rect.left <= cursorCenterX + cursorRange &&
            rect.right >= cursorCenterX - cursorRange &&
            rect.top <= cursorCenterY + cursorRange &&
            rect.bottom >= cursorCenterY - cursorRange
        );
    });

    // Map filtered elements to include distances
    const elementsWithDistances = filteredElements.map(el => {
        const rect = el.getBoundingClientRect();
        return {element: el, distance: getDistanceToRect(rect)};
    });

    if (elementsWithDistances.length === 0) {
        return null;
    } else {
        elementsWithDistances.sort((a, b) => a.distance - b.distance);

        const lowestDistance = elementsWithDistances[0]?.distance;
        const elementsWithLowestDistance = elementsWithDistances.filter(
            ({distance}) => distance === lowestDistance
        );

        if (elementsWithLowestDistance.length > 1) {
            const gazeControlElement = elementsWithLowestDistance.find(({element}) =>
                element.id && element.id.startsWith("custom-gaze")
            );

            if (gazeControlElement) {
                return gazeControlElement.element;
            }
        }
        return elementsWithLowestDistance[0].element;
    }
}

document.addEventListener('cursorUpdated', function () {
    const element = findClosestElementToCursor(customCursor, cursorRange);
    if (element !== previousElement) {
        // Reset previous element and clear any existing hover timer
        if (previousElement) {
            previousElement.style.border = '';
            customCursor.classList.remove('active', 'loading');
        }
        if (hoverTimer) {
            clearTimeout(hoverTimer);
        }

        // Apply border and start loading only if a new element is selected
        if (element) {
            element.style.border = '2px solid red';
             // Show cursor and start loading circle
            customCursor.classList.add('active', 'loading');
            hoverTimer = setTimeout(() => {
                if (shouldShowVirtualKeyboard(element)) {
                    openVirtualKeyboard(element);
                } else {
                    element.click();
                }
                 // Hide the cursor and loading circle after action
                customCursor.classList.remove('active', 'loading');
            }, hoverTime);
        }
        previousElement = element;
    }
});
