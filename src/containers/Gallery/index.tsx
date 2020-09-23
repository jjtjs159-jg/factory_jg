import React, {
    FunctionComponent,
    Fragment,
    useState,
    useEffect,
    useCallback,
    StyleHTMLAttributes,
    useReducer,
    CSSProperties
} from 'react';
import { concat, isEqual } from 'lodash';
import classNames from 'classnames/bind';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

interface Props {
    delay: number;
    showsPerRow: number;
    padding: number;
    showsNextSize: number;
}

interface State {
    // 방향
    dir: 'NEXT' | 'PREV';
    idx: number;
    isAnimating: boolean;
    transform?: CSSProperties['transform'];
    transitionDuration?: CSSProperties['transitionDuration'];
}

type Action =
    | { type: 'STOP' }
    | { type: 'PREV', transform?: CSSProperties['transform'], transitionDuration?: CSSProperties['transitionDuration']}
    | { type: 'NEXT', transform?: CSSProperties['transform'], transitionDuration?: CSSProperties['transitionDuration']}
    | { type: 'RESET', idx: number, transform?: CSSProperties['transform'], transitionDuration?: CSSProperties['transitionDuration']}
;

const itemList = [
    {
        backgroundColor: 'red',
    },
    {
        backgroundColor: 'blue',
    },
    {
        backgroundColor: 'green',
    },
    {
        backgroundColor: 'cyan',
    },
    {
        backgroundColor: 'purple',
    },
    {
        backgroundColor: 'brown',
    },
    {
        backgroundColor: 'black',
    },
];

const index: FunctionComponent<Props> = ({
    delay = 350,
    showsPerRow = 2,
    padding = 20,
    showsNextSize = 5, // percentage
}) => {

    const winX = window.innerWidth; // 1920

    // const width = `${100 / showsPerRow}%`;
    
    const wid = 100 / showsPerRow;
    const moveSize = 100 / (itemList.length + (showsPerRow * (showsPerRow + 2)));
    const slideWidthPX = Math.ceil(winX * (wid - moveSize) / 100 - (padding * 2));

    const firstFrames = itemList.slice(0, showsPerRow);
    const lastframes = itemList.slice(itemList.length - showsPerRow, itemList.length);
    const concatenatedList = lastframes.concat(itemList, firstFrames);

    const initialState: State = {
        dir: 'NEXT',
        // idx: itemList.length - 1,
        idx: 0,
        // transform: `translate3d(calc(-${width} * ${itemList.length}), 0px, 0px)`,
        transform: `translate3d(calc(-${slideWidthPX + padding}px), 0px, 0px)`,
        transitionDuration: `${delay}ms`,
        isAnimating: false,
    };

    const reducer = (state: State, action: Action): State => {
        switch (action.type) {
            case 'PREV':
                const absIdx = Math.abs(state.idx);
                const first = -(slideWidthPX + padding);
                const a = first + (slideWidthPX + padding * 2);
                // const prevMoveSize = (slideWidthPX + padding) * (absIdx) + (padding * (absIdx + 1));
                const prevMoveSize = (slideWidthPX + padding) * (absIdx) + (padding * (absIdx + 1)) - padding * 2;
                const test = state.idx === 0 ? Math.abs(first + (slideWidthPX + padding * 2)) : -prevMoveSize;
                return {
                    dir: 'PREV',
                    isAnimating: true,
                    idx: state.idx - 1,
                    // transform: action.transform || `translate3d(calc(-${width} * (${absIdx})), 0px, 0px)`,
                    transform: action.transform || `translate3d(${test}px, 0px, 0px)`,
                    transitionDuration: action.transitionDuration || `${delay}ms`,
                };
            case 'NEXT':
                const nextMoveSize = (slideWidthPX + padding) * (state.idx + 2) + (padding * (state.idx + 1));
                return {
                    dir: 'NEXT',
                    isAnimating: true,
                    idx: state.idx + 1,
                    // transform: action.transform || `translate3d(calc(-${width} * (${state.idx + 2})), 0px, 0px)`,
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
                }
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

    // 슬라이드 후 처리
    useEffect(() => {
        if (!isAnimating) {
            return;
        }

        // NEXT RESET
        if (isEqual(dir, 'NEXT') && isEqual(idx, itemList.length)) {
            console.log('NEXT RESET')
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
            setTimeout(() => {
                dispatch({
                    type: 'RESET',
                    idx: itemList.length - 1,
                    // transform: `translate3d(calc(-${slideWidthPX * (itemList.length + 1) + (padding * 2)}px), 0px, 0px)`,
                    transform: `translate3d(calc(-${slideWidthPX * (itemList.length + 1) + (padding * 2)}px), 0px, 0px)`,
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

    return (
        <Fragment>
            <div className={cx('slick')}>
                <div className={cx('slick-wrapper')} style={{ transform, transitionDuration }}>
                    {concatenatedList.map((item, i) => {
                        return (
                            <div
                                key={i}
                                className={cx('slot')}
                                style={{
                                    backgroundColor: item.backgroundColor,
                                    // minWidth: `${width}`,
                                    // minWidth: `${slideWidth}%`,
                                    minWidth: `${slideWidthPX}px`,
                                    margin: `0px ${padding}px`
                                }}
                            >
                                {i}
                            </div>
                        );
                    })}
                </div>
            </div>
            <button onClick={handlePrev}>Prev</button>
            <button onClick={handleNext}>Next</button>
        </Fragment>
    );
};

export default index;
