import {
    useEffect,
    useReducer,
    CSSProperties,
    useState,
    useRef,
    ReactNode,
    MutableRefObject,
} from 'react';
import { debounce, isEqual, throttle } from 'lodash';

interface Props {
    delay: number;
    showsPerRow: number;
    padding: number;
    length: number;
    centerMode?: boolean;
    wrapperRef: MutableRefObject<Node | null>;
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

interface Gesture {
    downX: number;
    downY: number;
    upX?: number;
    upY?: number;
}

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
        wrapperRef,
        centerMode,
    } = props;

    const windowWidth = window.innerWidth;

    const nextSlideSize = (100 / showsPerRow) - (100 / (length + showsPerRow * (showsPerRow + 2)));
    const slideSize = Math.floor(windowWidth * (nextSlideSize) / 100 - (padding * 2));
    const initialTransform = -slideSize - padding;

    const initialState: State = {
        dir: 'NEXT',
        idx: 0,
        isAnimating: false,
        transform: `translate3d(${initialTransform}px, 0px, 0px)`,
        transitionDuration: `${delay}ms`,
    };

    const reducer = (state: State, action: Action): State => {
        switch (action.type) {
            case 'PREV':
                const prevTransform = isEqual(state.idx, 0) ? padding : -(Math.abs(state.idx) * (slideSize + padding * 2) - padding);
                return {
                    dir: 'PREV',
                    isAnimating: true,
                    idx: state.idx - 1,
                    transform: `translate3d(${prevTransform}px, 0px, 0px)`,
                    transitionDuration: `${delay}ms`,
                };
            case 'NEXT':
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
            console.log('next')
            dispatch({ type: 'NEXT' });
        }
    };

    const handlePrev = () => {
        if (!isAnimating) {
            console.log('prev')
            dispatch({ type: 'PREV' });
        }
    };

    // 캐러셀 범위 내에서, <버튼 범위 밖에서 일어나는 이벤트만 감지하여야 함 :: 취소>
    // 버튼은 제외시킨다 
    const [gesture, setGesture] = useState<Gesture>();
    // const slickRef = useRef(wrapper);

    useEffect(() => {
        // const handleMouseMove = (e) => {
        //     if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
        //         console.log('???')
        //     }
        // }

        const handleMouseDown = (e) => {
            if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
                if (!isAnimating) {
                    setGesture({
                        downX: e.pageX,
                        downY: e.pageY,
                    });
                }
            }
        }

        const handleMouseUp = (e) => {
            if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
                if (!isAnimating) {
                    const moveX = e.pageX;
        
                    if (gesture && (moveX - gesture.downX > 0)) {
                        dispatch({ type: 'PREV' });
                        return;
                    }
        
                    if (gesture && (moveX - gesture.downX < 0)) {
                        dispatch({ type: 'NEXT' });
                        return;
                    }
                }
            }
        }

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        // window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            // window.removeEventListener('mousemove', handleMouseMove);
        }
    }, [gesture, isAnimating]);

    useEffect(() => {
        const handleResize = () => {
            const slideSize = Math.floor(window.innerWidth * (nextSlideSize) / 100 - (padding * 2));

            if (isEqual(idx, 0)) {
                const resizeTransform = -slideSize - padding;

                dispatch({
                    type: 'RESIZE',
                    transform: `translate3d(${resizeTransform}px, 0px, 0px)`,
                    transitionDuration: '0ms',
                });

                return;
            }

            if (isEqual(state.dir, 'NEXT')) {
                const resizeTransform = -(slideSize * state.idx + slideSize + state.idx * padding * 2 + padding);

                dispatch({
                    type: 'RESIZE',
                    transform: `translate3d(${resizeTransform}px, 0px, 0px)`,
                    transitionDuration: '0ms',
                });

                return;
            }

            if (isEqual(state.dir, 'PREV')) {

                const absIdx = Math.abs(state.idx + 1);
                const prevTransform = -(absIdx * (slideSize + padding * 2) - padding);

                dispatch({
                    type: 'RESIZE',
                    transform: `translate3d(${prevTransform}px, 0px, 0px)`,
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
        if (isAnimating) {

            // NEXT RESET
            if (isEqual(dir, 'NEXT') && isEqual(idx, length)) {
                const transform = -(slideSize + padding);
                setTimeout(() => {
                    dispatch({
                        type: 'RESET',
                        idx: 0,
                        transform: `translate3d(${transform}px, 0px, 0px)`,
                        transitionDuration: '0ms',
                    });
                }, delay);

                return;
            }

            // PREV RESET
            if (isEqual(dir, 'PREV') && isEqual(idx, -1)) {
                const transform = -(length * (slideSize + padding * 2) - padding);
                setTimeout(() => {
                    dispatch({
                        type: 'RESET',
                        idx: length - 1,
                        transform: `translate3d(${transform}px, 0px, 0px)`,
                        transitionDuration: '0ms',
                    });
                }, delay);

                return;
            }
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

    return {
        onPrev: handlePrev,
        onNext: handleNext,
        transform: transform,
        duration: transitionDuration,
        slotWidth: slideSize,
    };
};

export default useSlick;
