import {
    useEffect,
    useState,
    useReducer,
    useCallback,
    ReactNodeArray,
    MutableRefObject,
} from 'react';
import { isEqual } from 'lodash';

interface Props {
    delay: number;
    margin: number;
    length: number;
    showsPerRow: number;
    centerMode?: boolean;
    wrapperRef: MutableRefObject<Node | null>;
    children?: ReactNodeArray;
}

interface State {
    idx: number;
    dir: 'NEXT' | 'PREV';
    isAnimating: boolean;
    transform: string;
    duration: string;
}

type Action =
    | { type: 'STOP' }
    | { type: 'PREV', transform?: number, duration?: string }
    | { type: 'NEXT', transform?: number, duration?: string }
    | { type: 'RESIZE', transform: number }
    | { type: 'RESET', idx: number, transform: number, duration?: string }

type ReturnValue = {
    onPrev: () => void;
    onNext: () => void;
    transform: string;
    duration: string;
    slotWidth: number;
    children?: ReactNodeArray;
}

type ReducerMaterial = Omit<Props, 'wrapperRef' | 'length' | 'children'> & {
    slide: number;
    otherSize: number;
}

/**
 * get rounded to the second decimal place
 * @param {number} target 
 */
const roundedNumber = (target: number) => {
    return Math.round(target * 10) / 10;
};

/**
 * get reducer
 * @param {ReducerMaterial} material 
 */
const createReducer = (material: ReducerMaterial) => {
    const { delay, margin, showsPerRow, slide, centerMode, otherSize } = material;

    const reducer = (state: State, action: Action): State => {
        switch (action.type) {
            case 'PREV': {
                const prevCenterModeTransform =
                    -(slide * showsPerRow + margin * (showsPerRow + 1) - otherSize / 2 + (slide * (state.idx - 1) + margin * 2 * state.idx));
                    
                const prevTransform = isEqual(state.idx, 0) ? margin : -(Math.abs(state.idx) * (slide + margin * 2) - margin);
                const testPrev = centerMode ? prevCenterModeTransform : prevTransform;

                return {
                    dir: 'PREV',
                    isAnimating: true,
                    idx: state.idx - 1,
                    transform: `translate3d(${testPrev}px, 0px, 0px)`,
                    duration: `${delay}ms`,
                };
            }
            case 'NEXT': {
                const nextCenterModeTransform = -(slide * showsPerRow + margin * (showsPerRow + 1) - otherSize / 2 + (slide * (state.idx + 1) + margin * 2 * state.idx));

                const nextTransform = -(slide * (state.idx + 2) + state.idx * margin * 2 + margin * 3); // !centermode

                const testNext = centerMode ? nextCenterModeTransform : nextTransform;
                return {
                    dir: 'NEXT',
                    isAnimating: true,
                    idx: state.idx + 1,
                    transform: `translate3d(${testNext}px, 0px, 0px)`,
                    duration: `${delay}ms`,
                };
            }
            case 'RESET': {
                return {
                    ...state,
                    isAnimating: false,
                    idx: action.idx,
                    transform: `translate3d(${action.transform}px, 0px, 0px)`,
                    duration: '0ms',
                };
            }
            case 'RESIZE': {
                return {
                    ...state,
                    transform: `translate3d(${action.transform}px, 0px, 0px)`,
                    duration: '0ms',
                };
            }
            case 'STOP': {
                return {
                    ...state,
                    isAnimating: false,
                };
            }
            default:
                return state;
        }
    };

    return reducer;
};

/**
 * useSlick hook
 * 
 * @param {Props} props 
 * @return {ReturnValue}
 */
const useSlick = (props: Props): ReturnValue => {

    const { wrapperRef, centerMode, showsPerRow, margin, length, delay, children } = props;

    const getInitialValue = () => {

        // centermode
        if (centerMode) {
            const nextSlideWidth = 10;
            const slideWidth = roundedNumber(((window.innerWidth - window.innerWidth / nextSlideWidth * 2) - (margin * 2) * (showsPerRow + 2)) / showsPerRow);
            const otherThenSlotSize = (window.innerWidth - slideWidth * showsPerRow - (showsPerRow + 1) * (margin * 2));
            const transform = -(slideWidth * showsPerRow + margin * (showsPerRow + 1) - margin - otherThenSlotSize / 2);

            return {
                slideWidth,
                nextSlideWidth,
                initialTransform: transform,
                otherSize: otherThenSlotSize,
            };

            // !centermode
        } else {
            const nextSlideWidth = (100 / showsPerRow) - (100 / (length + showsPerRow * (showsPerRow + 2)));
            const slideWidth = roundedNumber(window.innerWidth * (nextSlideWidth) / 100 - (margin * 2));
            const transform = -slideWidth - margin;

            return {
                slideWidth,
                nextSlideWidth,
                initialTransform: transform,
                otherSize: 0,
            };
        }
    };

    const { slideWidth, nextSlideWidth, initialTransform, otherSize } = getInitialValue();

    const initialState: State = {
        dir: 'NEXT',
        idx: 0,
        isAnimating: false,
        transform: `translate3d(${initialTransform}px, 0px, 0px)`,
        duration: `${delay}ms`,
    };

    const reducer = createReducer({
        delay,
        margin,
        showsPerRow,
        centerMode,
        otherSize,
        slide: slideWidth,
    });

    const [state, dispatch] = useReducer(reducer, initialState);
    const { dir, idx, isAnimating, transform, duration } = state;

    // Next handler
    const handleNext = useCallback(() => {
        if (!isAnimating) {
            dispatch({ type: 'NEXT' });
        }
    }, [isAnimating]);

    // Prev handler
    const handlePrev = useCallback(() => {
        if (!isAnimating) {
            dispatch({ type: 'PREV' });
        }
    }, [isAnimating]);

    // The point of x coordinate of next or previous gesture
    const [downX, setDownX] = useState<number>();

    useEffect(() => {
        // Mouse down event
        const handleMouseDown = (e: MouseEvent) => {
            if (wrapperRef.current && wrapperRef.current.contains(e.target as Node)) {
                if (!isAnimating) {
                    setDownX(e.pageX);
                }
            }
        }
        // Mouse up event
        const handleMouseUp = (e: MouseEvent) => {
            if (wrapperRef.current && wrapperRef.current.contains(e.target as Node)) {
                if (!isAnimating) {
                    const moveX = e.pageX;

                    if (downX && (moveX - downX > 0)) {
                        dispatch({ type: 'PREV' });
                        return;
                    }

                    if (downX && (moveX - downX < 0)) {
                        dispatch({ type: 'NEXT' });
                        return;
                    }
                }
            }
        }

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [downX, isAnimating]);

    // Browser resize event
    useEffect(() => {
        // After the animation is over, index must be between 0 and the item length
        const handleResize = () => {

            const slideSize = centerMode ?
                roundedNumber(((window.innerWidth - window.innerWidth / nextSlideWidth * 2) - (margin * 2) * (showsPerRow + 2)) / showsPerRow)
                : roundedNumber(window.innerWidth * (nextSlideWidth) / 100 - (margin * 2));

            if (isEqual(idx, 0)) {
                const transformX = centerMode ? -(slideWidth * showsPerRow + margin * (showsPerRow + 1) - otherSize / 2)
                    : -slideSize - margin;

                dispatch({
                    type: 'RESIZE',
                    transform: transformX,
                });

                return;
            }

            if (isEqual(dir, 'NEXT')) {
                const transformX = centerMode ? -(slideWidth * showsPerRow + margin * (showsPerRow + 1) - otherSize / 2 + (slideWidth * state.idx))
                    : -(slideSize * idx + slideSize + idx * margin * 2 + margin);

                dispatch({
                    type: 'RESIZE',
                    transform: transformX,
                });
            }

            if (isEqual(dir, 'PREV')) {
                const transformX = centerMode ?
                    -(slideWidth * showsPerRow + margin * (showsPerRow + 1) - otherSize / 2 + (slideWidth * state.idx + margin * 2 * state.idx))
                    : -(idx * slideSize + idx * margin * 2 + slideSize + margin);

                dispatch({
                    type: 'RESIZE',
                    transform: transformX,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }

    }, [window.innerWidth, idx]);

    /**
     * Animation trick
     */
    useEffect(() => {
        if (isAnimating) {

            // Reset of next action
            if (isEqual(dir, 'NEXT') && isEqual(idx, length)) {
                const transformX = centerMode ? -(slideWidth * showsPerRow + margin * (showsPerRow + 1) - (margin * 2) - otherSize / 2)
                    : -(slideWidth + margin);

                setTimeout(() => {
                    dispatch({
                        type: 'RESET',
                        idx: 0,
                        transform: transformX,
                    });
                }, delay);
            }

            // Reset of prev action
            if (isEqual(dir, 'PREV') && isEqual(idx, -1)) {
                const transformX = centerMode ?
                    -(slideWidth * showsPerRow + margin * (showsPerRow + 1) - otherSize / 2 + (slideWidth * (length - 1) + margin * 2 * length))
                    : -(length * (slideWidth + margin * 2) - margin)

                setTimeout(() => {
                    dispatch({
                        type: 'RESET',
                        idx: length - 1,
                        transform: transformX,
                    });
                }, delay);
            }
        }
    }, [state.idx]);

    /**
     * Stop animation after next or prev action
     */
    useEffect(() => {
        if (isAnimating) {
            setTimeout(() => {
                dispatch({ type: 'STOP' });
            }, delay);
        }
    }, [state]);

    const frontFrames = children?.slice(0, showsPerRow);
    const backFrames = children?.slice(children.length - showsPerRow, children.length);
    const concatenatedList = backFrames?.concat(children, frontFrames);

    return {
        onPrev: handlePrev,
        onNext: handleNext,
        transform: transform,
        duration: duration,
        slotWidth: slideWidth,
        children: concatenatedList,
    };
};

export default useSlick;
