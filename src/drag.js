import { fromEvent } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";

function drag(element) {
    const box = element;
    const mouseDown$ = fromEvent(box, "mousedown");
    const mouseMove$ = fromEvent(document, "mousemove");
    const mouseUp$ = fromEvent(document, "mouseup");
    mouseDown$
        .pipe(
            map(event => ({
                pos: getTranslate(box),
                event
            }))
        )
        .pipe(
            switchMap(initialState => {
                const initialPos = initialState.pos;
                const { clientX, clientY } = initialState.event;
                box.classList.add("blink");
                return mouseMove$
                    .pipe(
                        map(moveEvent => ({
                            x: moveEvent.clientX - clientX + initialPos.x,
                            y: moveEvent.clientY - clientY + initialPos.y
                        }))
                    )
                    .pipe(takeUntil(mouseUp$));
            })
        )
        .subscribe(pos => {
            setTranslate(box, pos);
        });
    function setTranslate(element, pos) {
        element.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
    }
    function getTranslate(element) {
        const style = getComputedStyle(element);
        const regExp = /matrix\((\d+,\s){4}(\d+),\s(\d+)/i;
        const result = style.transform.match(regExp);
        if (result) {
            return {
                x: parseInt(result[2], 10),
                y: parseInt(result[3], 10)
            };
        } else {
            return {
                x: 0,
                y: 0
            };
        }
    }
}
