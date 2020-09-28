import {
    useEffect,
    useReducer,
    CSSProperties,
} from 'react';
import { debounce, isEqual, throttle } from 'lodash';

interface Props {
    delay: number;
    showsPerRow: number;
    padding: number;
    length: number;
    centerMode?: boolean;
}

interface State {
    dir: 'NEXT' | 'PREV';
    idx: number;
    isAnimating: boolean;
    transform?: string;
    transitionDuration?: string;
}

type Action =
    | { type: 'STOP' }
    | { type: 'PREV', transform?: string, transitionDuration?: string }
    | { type: 'NEXT', transform?: string, transitionDuration?: string }
    | { type: 'RESIZE', transform?: string, transitionDuration?: string }
    | { type: 'RESET', idx: number, transform?: string, transitionDuration?: string };

/** 
 *  const firstFrames = itemList.slice(0, showsPerRow);
 *  const lastframes = itemList.slice(itemList.length - showsPerRow, itemList.length);
 *  const concatenatedList = lastframes.concat(itemList, firstFrames);
 */
const useSlick = (props: Props) => {
    const {
        delay,
        showsPerRow,
        padding,
        length,
        centerMode,
    } = props;

    const windowWidth = window.innerWidth;

    const nextSlideSize = (100 / showsPerRow) - (100 / (length + showsPerRow * (showsPerRow + 2)));
    const slideSize = Math.floor(windowWidth * (nextSlideSize) / 100 - (padding * 2));

    const initialState: State = {
        dir: 'NEXT',
        idx: 0,
        isAnimating: false,
        transform: `translate3d(calc(-${slideSize + padding}px), 0px, 0px)`,
        transitionDuration: `${delay}ms`,
    };

    const reducer = (state: State, action: Action): State => {
        switch (action.type) {
            case 'PREV':
                const absIdx = Math.abs(state.idx);
                const prevTransform = isEqual(state.idx, 0) ? padding : -(absIdx * (slideSize + padding * 2) + padding);
                return {
                    dir: 'PREV',
                    isAnimating: true,
                    idx: state.idx - 1,
                    transform: `translate3d(${prevTransform}px, 0px, 0px)`,
                    transitionDuration: `${delay}ms`,
                };
            case 'NEXT':
                // const nextTransform = (slideSize + padding) * (state.idx + 2) + (padding * (state.idx + 1));
                const nextTransform = -(slideSize * (state.idx + 2) + state.idx * padding * 2 + padding * 3);
                return {
                    dir: 'NEXT',
                    isAnimating: true,
                    idx: state.idx + 1,
                    transform: `translate3d(${nextTransform}px, 0px, 0px)`,
                    transitionDuration: `${delay}ms`,
                };
            case 'RESET':
                return {
                    ...state,
                    isAnimating: false,
                    idx: action.idx,
                    transform: action.transform,
                    transitionDuration: action.transitionDuration,
                };
            case 'RESIZE':
                return {
                    ...state,
                    transform: action.transform,
                    transitionDuration: '0ms',
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

    const [state, dispatch] = useReducer(reducer, initialState);

    const {
        dir,
        idx,
        isAnimating,
        transform,
        transitionDuration,
    } = state;

    const handleNext = () => {
        if (!isAnimating) { 
            dispatch({ type: 'NEXT' });
        }
    };

    const handlePrev = () => {
        if (!isAnimating) {
            dispatch({ type: 'PREV' });
        }
    };

    useEffect(() => {
        const handleResize = () => {    
            if (isEqual(state.dir, 'NEXT') && isEqual(idx, 0)) {    
                const slideSize = Math.floor(window.innerWidth * (nextSlideSize) / 100 - (padding * 2));
                const size = slideSize + padding;
        
                dispatch({
                    type: 'RESIZE',
                    transform: `translate3d(-${size}px, 0px, 0px)`,
                    transitionDuration: '0ms',
                });

                return;
            }

            if (isEqual(state.dir, 'NEXT') && !isEqual(idx, length)) {
                const slideSize = Math.floor(window.innerWidth * (nextSlideSize) / 100 - (padding * 2));
                const size = (slideSize + padding) * (state.idx + 1) + (padding * (state.idx));
        
                dispatch({
                    type: 'RESIZE',
                    transform: `translate3d(-${size}px, 0px, 0px)`,
                    transitionDuration: '0ms',
                });

                return;
            }

            if (isEqual(state.dir, 'PREV') && !isEqual(idx, -1)) {
                const slideSize = Math.floor(window.innerWidth * (nextSlideSize) / 100 - (padding * 2));

                const absIdx = Math.abs(state.idx + 1);
                const first = -(slideSize + padding);
                const prevMoveSize = (slideSize + padding) * (absIdx) + (padding * (absIdx + 1)) - padding * 2;
                const size = state.idx === 0 ? Math.abs(first + (slideSize + padding * 2)) : -prevMoveSize;
                
                dispatch({
                    type: 'RESIZE',
                    transform: `translate3d(${size}px, 0px, 0px)`,
                    transitionDuration: '0ms',
                });

                return;
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
        
    }, [window.innerWidth, state.idx]);

    // 슬라이드 후 처리
    useEffect(() => {
        if (!isAnimating) {
            return;
        }

        // NEXT RESET
        if (isEqual(dir, 'NEXT') && isEqual(idx, length)) {
            setTimeout(() => {
                dispatch({
                    type: 'RESET',
                    idx: 0,
                    transform: `translate3d(calc(-${slideSize + padding}px), 0px, 0px)`,
                    transitionDuration: '0ms',
                });
            }, delay);
            return;
        }

        // PREV RESET
        if (isEqual(dir, 'PREV') && isEqual(idx, -1)) {
            console.log('??')
            const nextMoveSize = (slideSize + padding) * (length + 1) + (padding * (length));
            setTimeout(() => {
                dispatch({
                    type: 'RESET',
                    idx: length - 1,
                    transform: `translate3d(calc(-${nextMoveSize - slideSize - padding * 2}px), 0px, 0px)`,
                    transitionDuration: '0ms',
                });
            }, delay);
            return;
        }

    }, [state.idx]);

    useEffect(() => {
        if (isAnimating) {
            setTimeout(() => {
                dispatch({
                    type: 'STOP',
                });
            }, delay);
        }
    }, [state]);

    console.log(isAnimating)
    return {
        onPrev: isAnimating ? () => {} : handlePrev,
        onNext: isAnimating ? () => {} : handleNext,
        transform: transform,
        duration: transitionDuration,
        slotWidth: slideSize,
    };
};

export default useSlick;
