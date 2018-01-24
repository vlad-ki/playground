/* global angular */
angular.module('InvestX').factory('DragAndDrop', DragAndDrop)

function DragAndDrop() {
    return {
        init: initDaD,
        droppable: DROPPABLE
    }
}

let DROPPABLE

function initDaD(dragContainer, dragElement, droppContainer, o) {
    let dragObject = {};
    const container = document.getElementsByClassName(dragContainer)[0];

    container.addEventListener('mousedown', event => {
        if (event.which != 1) return;
        const element = event.target.closest(dragElement);

        elementCoords = getCoords(element);
        shiftX = event.pageX - elementCoords.left;
        shiftY = event.pageY - elementCoords.top;

        dragObject.element = element;
        dragObject.shiftX = shiftX;
        dragObject.shiftY = shiftY;
        dragObject.pageX = event.PageX - shiftX;
        dragObject.pageY = event.PageY - shiftY;

        dragObject.avatar = createAvatar(dragObject.element);
        document.body.appendChild(dragObject.avatar);
        dragObject.avatar.style.position = 'absolute';
        dragObject.avatar.style.zIndex = 9999;

        document.onmousemove = event => {
            if (!dragObject.element) return;
            dragObject.avatar.style.left = event.pageX - dragObject.shiftX + 'px';
            dragObject.avatar.style.top = event.pageY - dragObject.shiftY + 'px';
        }

        document.onmouseup = event => {
            if (!dragObject.avatar) return;
            dragObject.avatar.rollback();
            const droppElement = findDroppable(event);
            // console.log(droppElement);
            o = droppElement;
            document.onmousemove = null;
            container.onmouseup = null;
            dragObject = {};
        }
    })

    function findDroppable(event) {
        dragObject.avatar.hidden = true;
        const element = document.elementsFromPoint(event.clientX, event.clientY)[0];
        dragObject.avatar.hidden = false;
        // console.log(element)
        if (element === null) return null;
        return element.closest(droppContainer);

    }
}

function getCoords(element) {
    coords = element.getBoundingClientRect();
    return {
        top: coords.top + pageYOffset,
        left: coords.left + pageXOffset
    }
}

function createAvatar(element) {
    const avatar = element;
    const old = {
        parent: avatar.parentNode,
        sibling: avatar.nextSibling,
        position: avatar.style.position || '',
        left: avatar.style.left || '',
        top: avatar.style.top || '',
        zIndex: avatar.style.zIndex || ''
    }
    avatar.rollback = () => {
        old.parent.insertBefore(avatar, old.sibling)
        avatar.style.position = old.position
        avatar.style.left = old.left
        avatar.style.top = old.top
        avatar.style.zIndex = avatar.zIndex
    }
    return avatar
}
