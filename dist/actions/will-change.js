export function willChange(element, parameters) {
    const { properties, type } = parameters;
    function setWillChangeProperties() {
        element.style.willChange = properties;
    }
    function resetWillChangeProperties() {
        element.style.willChange = 'auto';
    }
    // Event-Listener functions
    function mouseEnter() {
        setWillChangeProperties();
    }
    function mouseLeave() {
        resetWillChangeProperties();
    }
    function transitionStart() {
        setWillChangeProperties();
    }
    function transitionEnd() {
        resetWillChangeProperties();
    }
    // Assign the correct event listeners to the element, depending on the type of will-change
    function assignEventListeners() {
        if (type === 'mouse') {
            element.addEventListener('mouseenter', mouseEnter);
            element.addEventListener('mouseleave', mouseLeave);
        }
        else if (type === 'transition') {
            element.addEventListener('transitionstart', transitionStart);
            element.addEventListener('transitionend', transitionEnd);
        }
        else if (type === 'page-load') {
            element.style.willChange = properties;
        }
    }
    assignEventListeners();
    return {
        update(new_parameters) {
            willChange(element, new_parameters);
        },
        destroy() {
            if (type === 'mouse') {
                element.removeEventListener('mouseenter', mouseEnter);
                element.removeEventListener('mouseleave', mouseLeave);
            }
            else if (type === 'transition') {
                element.removeEventListener('transitionstart', transitionStart);
                element.removeEventListener('transitionend', transitionEnd);
            }
            else if (type === 'page-load') {
                element.style.willChange = 'auto';
            }
        }
    };
}
