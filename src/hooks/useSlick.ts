import { useEffect, useState, useReducer, CSSProperties, ReactChildren, Children } from 'react';
import { initial, isEqual } from 'lodash';
import { throttle, debounce } from 'lodash';

interface Props {
    delay: number;
    showsPerRow: number;
    padding: number;
    length: number;
    // windowWidth: number;
}

interface State {
    // 방향
    dir: 'NEXT' | 'PREV';
    idx: number;
    isAnimating: boolean;
    transform?: CSSProperties['transform'];
    transitionDuration?: CSSProperties['transitionDuration'];
    width?: number;
}

type Action =
    | { type: 'STOP' }
    | { type: 'PREV', transform?: CSSProperties['transform'], transitionDuration?: CSSProperties['transitionDuration']}
    | { type: 'NEXT', transform?: CSSProperties['transform'], transitionDuration?: CSSProperties['transitionDuration']}
    | { type: 'RESET', idx: number, transform?: CSSProperties['transform'], transitionDuration?: CSSProperties['transitionDuration']}
    | { type: 'RESIZE', transform?: CSSProperties['transform'], transitionDuration?: CSSProperties['transitionDuration']};

const useSlick = (props: Props) => {
    const { delay, showsPerRow, padding, length } = props;

    const windowWidth = window.innerWidth;
    
    const wid = 100 / showsPerRow;
    const moveSize = 100 / (length + (showsPerRow * (showsPerRow + 2)));
    const slideWidthPX = Math.ceil(windowWidth * (wid - moveSize) / 100 - (padding * 2));

    const initialState: State = {
        dir: 'NEXT',
        idx: 0,
        transform: `translate3d(calc(-${slideWidthPX + padding}px), 0px, 0px)`,
        transitionDuration: `${delay}ms`,
        isAnimating: false,
        width: window.innerWidth,
    };

    const reducer = (state: State, action: Action): State => {
        switch (action.type) {
            case 'PREV':
                const absIdx = Math.abs(state.idx);
                const first = -(slideWidthPX + padding);
                const prevMoveSize = (slideWidthPX + padding) * (absIdx) + (padding * (absIdx + 1)) - padding * 2;
                const test = state.idx === 0 ? Math.abs(first + (slideWidthPX + padding * 2)) : -prevMoveSize;
                return {
                    dir: 'PREV',
                    isAnimating: true,
                    idx: state.idx - 1,
                    transform: action.transform || `translate3d(${test}px, 0px, 0px)`,
                    transitionDuration: action.transitionDuration || `${delay}ms`,
                };
            case 'NEXT':
                const nextMoveSize = (slideWidthPX + padding) * (state.idx + 2) + (padding * (state.idx + 1));

                return {
                    dir: 'NEXT',
                    isAnimating: true,
                    idx: state.idx + 1,
                    transform: action.transform || `translate3d(-${nextMoveSize}px, 0px, 0px)`,
                    transitionDuration: action.transitionDuration || `${delay}ms`,
                };
            case 'RESET':
                return {
                    ...state,
                    isAnimating: true,
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
                return { ...state, isAnimating: false, };
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
        if (isAnimating) {
            return;
        }

        dispatch({
            type: 'NEXT',
        });
    };

    const handlePrev = () => {
        if (isAnimating) {
            return;
        }

        dispatch({
            type: 'PREV',
        });
    };


    useEffect(() => {

        const handleResize = () => {
            if (state.width === window.innerWidth) {
                return;
            }
    
            if (state.dir === 'NEXT' && isEqual(idx, 0)) {    
                const slideWidthPX = Math.ceil(window.innerWidth * (wid - moveSize) / 100 - (padding * 2));
    
                const size = slideWidthPX + padding
        
                dispatch({
                    type: 'RESIZE',
                    transform: `translate3d(-${size}px, 0px, 0px)`,
                    transitionDuration: '0ms',
                });
                return;
            }
        
            if (state.dir === 'NEXT' && !isEqual(idx, length)) {
                const slideWidthPX = Math.ceil(window.innerWidth * (wid - moveSize) / 100 - (padding * 2));
                const size = (slideWidthPX + padding) * (state.idx + 1) + (padding * (state.idx));
        
                dispatch({
                    type: 'RESIZE',
                    transform: `translate3d(-${size}px, 0px, 0px)`,
                    transitionDuration: '0ms',
                })
            } else if (state.dir === 'PREV' && !isEqual(idx, -1)) {
                const slideWidthPX = Math.ceil(window.innerWidth * (wid - moveSize) / 100 - (padding * 2));

                const absIdx = Math.abs(state.idx + 1);
                const first = -(slideWidthPX + padding);
                const prevMoveSize = (slideWidthPX + padding) * (absIdx) + (padding * (absIdx + 1)) - padding * 2;
                const size = state.idx === 0 ? Math.abs(first + (slideWidthPX + padding * 2)) : -prevMoveSize;
                
                dispatch({
                    type: 'RESIZE',
                    transform: `translate3d(${size}px, 0px, 0px)`,
                    transitionDuration: '0ms',
                })
            }
        };

        window.addEventListener('resize', handleResize);

        // handleResize();

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
                    transform: `translate3d(calc(-${slideWidthPX + padding}px), 0px, 0px)`,
                    transitionDuration: '0ms',
                });
            }, delay);
            return;
        }

        // PREV RESET
        if (isEqual(dir, 'PREV') && isEqual(idx, -1)) {
            const nextMoveSize = (slideWidthPX + padding) * (length + 1) + (padding * (length));
            setTimeout(() => {
                dispatch({
                    type: 'RESET',
                    idx: length - 1,
                    transform: `translate3d(calc(-${nextMoveSize - slideWidthPX - padding * 2}px), 0px, 0px)`,
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
    }, [state.idx]);

    return {
        onPrev: handlePrev,
        onNext: handleNext,
        transform: transform,
        duration: transitionDuration,
        slotWidth: slideWidthPX,
    };
};

export default useSlick;
