import {
    FunctionComponent,
    Fragment,
    useState,
    useEffect,
    useCallback,
    StyleHTMLAttributes,
    useReducer,
    useRef,
    CSSProperties
} from 'react';
import { concat, isEqual } from 'lodash';
import { useSlick, useWindowSize } from 'hooks';
import { Image } from 'components/Image';
import classNames from 'classnames/bind';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

interface Props {
    delay: number;
    showsPerRow: number;
    padding: number;
    showsNextSize: number;
}

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
    showsPerRow = 3,
    padding = 5,
}) => {
    
    const wrapperRef = useRef(null);
    const windowSize = useWindowSize();

    const { onNext, onPrev, transform, duration, slotWidth } = useSlick({
        delay,
        showsPerRow,
        margin: padding,
        length: itemList.length,
        wrapperRef: wrapperRef,
        centerMode: true,
    });

    const firstFrames = itemList.slice(0, showsPerRow);
    const lastframes = itemList.slice(itemList.length - showsPerRow, itemList.length);
    const concatenatedList = lastframes.concat(itemList, firstFrames);

    return (
        <Fragment>
            <div className={cx('slick')} ref={wrapperRef}>
                <div className={cx('slick-wrapper')} style={{ transform, transitionDuration: duration }}>
                    {concatenatedList.map((item, i) => {
                        return (
                            <div
                                key={i}
                                className={cx('slot')}
                                style={{
                                    backgroundColor: item.backgroundColor,
                                    minWidth: `${slotWidth}px`,
                                    minHeight: '150px',
                                    maxHeight: '300px',
                                    margin: `0px ${padding}px`,
                                }}
                            >
                                {/* <Image src="./src/containers/Gallery/thumb-doctork-camg.jpg" /> */}
                            </div>
                        );
                    })}
                </div>
            </div>
            <button onClick={onPrev}>Prev</button>
            <button onClick={onNext}>Next</button>
        </Fragment>
    );
};

export default index;
