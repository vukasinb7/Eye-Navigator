let previousElement = null;
let hoverTimer = null;
let hoverTimeout = 5000;

function findClosestElementToCursor(customCursor, range) {
    const cursorRect = customCursor.getBoundingClientRect();
    const cursorCenterX = (cursorRect.left + cursorRect.right) / 2;
    const cursorCenterY = (cursorRect.top + cursorRect.bottom) / 2;

    // Select target elements
    const elements = Array.from(document.querySelectorAll('a, button, input[type="button"], input[type="submit"], [onclick]'));

    function getDistanceToRect(rect) {
        if (cursorCenterX >= rect.left && cursorCenterX <= rect.right && cursorCenterY >= rect.top && cursorCenterY <= rect.bottom) return 0;
        if (cursorCenterX >= rect.left && cursorCenterX <= rect.right) return Math.min(Math.abs(cursorCenterY - rect.top), Math.abs(cursorCenterY - rect.bottom));
        if (cursorCenterY >= rect.top && cursorCenterY <= rect.bottom) return Math.min(Math.abs(cursorCenterX - rect.left), Math.abs(cursorCenterX - rect.right));
        let left = cursorCenterX <= rect.left;
        let top = cursorCenterY <= rect.top;
        return Math.sqrt((cursorCenterX - (left ? rect.left : rect.right)) ** 2 + (cursorCenterY - (top ? rect.top : rect.bottom)) ** 2);
    }

    let closestElement = null;
    let minDistance = Infinity;

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();

        // Check if element is within the specified range of the cursor's expanded area
        if (rect.left <= cursorCenterX + range && rect.right >= cursorCenterX - range && rect.top <= cursorCenterY + range && rect.bottom >= cursorCenterY - range) {
            const distance = getDistanceToRect(rect);
            if (distance < minDistance) {
                minDistance = distance;
                closestElement = el;
            }
        }
    });

    return closestElement;
}

document.addEventListener('cursorUpdated', function () {
    const element = findClosestElementToCursor(customCursor, 50);

    if (element !== previousElement) {
        // Reset previous element border and cancel any existing timer
        if (previousElement) {
            previousElement.style.border = '';
        }
        if (hoverTimer) {
            clearTimeout(hoverTimer);
        }

        // Apply border to the new element
        if (element) {
            element.style.border = '2px solid red';
        }

        // Set a new hover timer for the current element
        if (element) {
            hoverTimer = setTimeout(() => {
                element.click();
            }, hoverTimeout);
        }

        previousElement = element;
    }
});
