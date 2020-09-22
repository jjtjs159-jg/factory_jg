import React, {
    FunctionComponent,
    Fragment,
    useState,
    useEffect,
    useCallback,
    useReducer,
    CSSProperties
} from 'react';
import { concat, isEqual } from 'lodash';
import classNames from 'classnames/bind';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

interface Props {
    delay: number;
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

const index: FunctionComponent<Props> = ({ delay = 350 }) => {
    const initialState: State = {
        dir: 'NEXT',
        idx: itemList.length - 1,
        // transform: `translate3d(-100%, 0px, 0px)`,
        transform: `translate3d(calc(-100% * ${itemList.length}), 0px, 0px)`,
        transitionDuration: `${delay}ms`,
        isAnimating: false,
    };

    const reducer = (state: State, action: Action): State => {
        switch (action.type) {
            case 'PREV':
                const absIdx = Math.abs(state.idx);
                return {
                    dir: 'PREV',
                    isAnimating: true,
                    idx: state.idx - 1,
                    transform: action.transform || `translate3d(calc(-100% * (${absIdx})), 0px, 0px)`,
                    transitionDuration: action.transitionDuration || `${delay}ms`,
                };
            case 'NEXT':
                return {
                    dir: 'NEXT',
                    isAnimating: true,
                    idx: state.idx + 1,
                    transform: action.transform || `translate3d(calc(-100% * (${state.idx + 2})), 0px, 0px)`,
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

    const firstOfItemList = [itemList[0]];
    const lastOfItemList = [itemList[itemList.length - 1]];
    const concatenatedList = lastOfItemList.concat(itemList, firstOfItemList);

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
            setTimeout(() => {
                dispatch({
                    type: 'RESET',
                    idx: 0,
                    transform: `translate3d(-100%, 0px, 0px)`,
                    transitionDuration: '0ms',
                });
            }, delay);
            return;
        }

        // PREV RESET
        if (isEqual(dir, 'PREV') && isEqual(idx, -1)) {
            const last = itemList.length;
            setTimeout(() => {
                dispatch({
                    type: 'RESET',
                    idx: itemList.length - 1,
                    transform: `translate3d(calc(-100% * ${last}), 0px, 0px)`,
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
