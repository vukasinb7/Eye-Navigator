window.findClosestElement = function(x, y, range) {
    const elements = Array.from(document.querySelectorAll('a, button, input[type="button"], input[type="submit"], [onclick]'));

    function getDistanceToPoint(rect, x, y) {
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return 0;
        if (x >= rect.left && x <= rect.right) return Math.min(Math.abs(y - rect.top), Math.abs(y - rect.bottom));
        if (y >= rect.top && y <= rect.bottom) return Math.min(Math.abs(x - rect.left), Math.abs(x - rect.right));
        let left = x <= rect.left;
        let top = y <= rect.top;
        return Math.sqrt((x - (left ? rect.left : rect.right)) ** 2 + (y - (top ? rect.top : rect.bottom)) ** 2);
    }

    let closestElement = null;
    let minDistance = Infinity;

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.left <= x + range && rect.right >= x - range && rect.top <= y + range && rect.bottom >= y - range) {
            const distance = getDistanceToPoint(rect, x, y);
            if (distance < minDistance) {
                minDistance = distance;
                closestElement = el;
            }
        }
    });
    return closestElement;
};
