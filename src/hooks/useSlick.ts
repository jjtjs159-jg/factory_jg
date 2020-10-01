import {
    useEffect,
    useReducer,
    useState,
    MutableRefObject,
    ReactNodeArray,
    useCallback,
    useMemo,
} from 'react';
import { isEqual, debounce } from 'lodash';

interface Props {
    delay: number;
    padding: number;
    length: number;
    showsPerRow: number;
    centerMode?: boolean;
    wrapperRef: MutableRefObject<Node | null>;
    // children: ReactNodeArray;
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
    | { type: 'RESET', idx: number, transform: number, duration?: string };

type ReturnValue = {
    onPrev: () => void;
    onNext: () => void;
    transform?: string;
    duration?: string;
    slotWidth: number;
}

/**
 * get rounded to the second decimal place
 * @param {number} target 
 */
const getRoundedHundredth = (target: number) => {
    return Math.round(target * 10) / 10;
};

const createReducer = (padding: number, slide: number, delay: number) => {
    const reducer = (state: State, action: Action): State => {
        switch (action.type) {
            case 'PREV':
                const prevTransform = isEqual(state.idx, 0) ? padding : -(Math.abs(state.idx) * (slide + padding * 2) - padding);
                return {
                    dir: 'PREV',
                    isAnimating: true,
                    idx: state.idx - 1,
                    transform: `translate3d(${prevTransform}px, 0px, 0px)`,
                    duration: `${delay}ms`,
                };
            case 'NEXT':
                const nextTransform = -(slide * (state.idx + 2) + state.idx * padding * 2 + padding * 3);
                return {
                    dir: 'NEXT',
                    isAnimating: true,
                    idx: state.idx + 1,
                    transform: `translate3d(${nextTransform}px, 0px, 0px)`,
                    duration: `${delay}ms`,
                };
            case 'RESET':
                return {
                    ...state,
                    isAnimating: false,
                    idx: action.idx,
                    transform: `translate3d(${action.transform}px, 0px, 0px)`,
                    duration: '0ms',
                };
            case 'RESIZE':
                return {
                    ...state,
                    transform: `translate3d(${action.transform}px, 0px, 0px)`,
                    duration: '0ms',
                };
            case 'STOP':
                return {
                    ...state,
                    isAnimating: false,
                };
            default:
                return state;
        }
    };

    return reducer;
};

// TODO 제스처, PREV, NEXT 한번의 동작에 넘어가는 slide 개수
// TODO centermode

/**
 * useSlick hook
 * 
 * @param {Props} props 
 * @return {ReturnValue}
 */
const useSlick = (props: Props): ReturnValue => {

    const { wrapperRef, centerMode, showsPerRow, padding, length, delay } = props;

    const getInitialValue = () => {

        // centermode
        if (centerMode) {
            const nextSlideWidth = 10;
            const slideWidth = getRoundedHundredth(((window.innerWidth - window.innerWidth / nextSlideWidth * 2) - (padding * 2) * (showsPerRow + 2)) / showsPerRow);
            const otherThenSlotSize = (window.innerWidth - slideWidth * showsPerRow - (showsPerRow + 1) * (padding * 2));
            const transform = -(slideWidth * showsPerRow + padding * (showsPerRow + 1) - otherThenSlotSize / 2);

            return {
                slideWidth,
                nextSlideWidth,
                initialTransform: transform,
                otherSize: otherThenSlotSize,
            };

        // !centermode
        } else {
            const nextSlideWidth = (100 / showsPerRow) - (100 / (length + showsPerRow * (showsPerRow + 2)));
            const slideWidth = getRoundedHundredth(window.innerWidth * (nextSlideWidth) / 100 - (padding * 2));
            const transform = -slideWidth - padding;

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

    const reducer = createReducer(padding, slideWidth, delay);
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
        const handleResize = debounce(() => {
            // const slideSize = getRoundedHundredth(window.innerWidth * (nextSlideWidth) / 100 - (padding * 2)); // !centermode

            const slideSize = centerMode ?
                getRoundedHundredth(((window.innerWidth - window.innerWidth / nextSlideWidth * 2) - (padding * 2) * (showsPerRow + 2)) / showsPerRow)
                : getRoundedHundredth(window.innerWidth * (nextSlideWidth) / 100 - (padding * 2));

            if (isEqual(idx, 0)) {
                // const transformX = -slideSize - padding; // !centermode
                const transformX = centerMode ? -(slideWidth * showsPerRow + padding * (showsPerRow + 1) - otherSize / 2)
                    : -slideSize - padding;

                dispatch({
                    type: 'RESIZE',
                    transform: transformX,
                });

                return;
            }

            if (isEqual(dir, 'NEXT')) {
                const transformX = -(slideSize * idx + slideSize + idx * padding * 2 + padding);

                dispatch({
                    type: 'RESIZE',
                    transform: transformX,
                });
            }

            if (isEqual(dir, 'PREV')) {
                const transformX = -(idx * slideSize + idx * padding * 2 + slideSize + padding);

                dispatch({
                    type: 'RESIZE',
                    transform: transformX,
                });
            }
        }, 50);

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
                const transformX = -(slideWidth + padding);

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
                const transformX = -(length * (slideWidth + padding * 2) - padding);

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

    // const firstFrames = children.slice(0, showsPerRow);
    // const lastframes = children.slice(children.length - showsPerRow, children.length);
    // const concatenatedList = lastframes.concat(children, firstFrames);

    return {
        onPrev: handlePrev,
        onNext: handleNext,
        transform: transform,
        duration: duration,
        slotWidth: slideWidth,
        // children: concatenatedList,
    };
};

export default useSlick;
