import React, { FunctionComponent, Fragment, useState, useEffect, useCallback } from 'react';
import classNames from 'classnames/bind';
import { throttle } from 'lodash';
import styles from './index.module.scss';

const cx = classNames.bind(styles);

interface Props {

}

const index: FunctionComponent<Props> = ({

}) => {
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
        }
    ];

    const [idx, setIdx] = useState(0);
    // const [isLast, setIsLast] = useState(false);
    const list = [itemList[itemList.length - 1]].concat(itemList).concat([itemList[0]]); 
    // console.log(idx);
    

    const add = () => setIdx(idx + 1);

    const [animation, setAnimation] = useState({
        transform: `translate3d(calc(-100% * ${idx + 1}), 0px, 0px)`,
        transitionDuration: '350ms',
    });

    const [isAnimating, setIsAnimating] = useState(false);

    let returnflag = false;

    const handleClick = () => {
        // if (idx === itemList.length - 1) {
            
        //     return;
        // }
        if (returnflag) {
            console.log('returnflag > ' + returnflag)
            return;
        }

        if (idx === itemList.length - 1) {
            // console.log('same > ' + idx)
            // setIdx(0);
            // setIsLast(true);
            // return;
            setAnimation({
                ...animation,
                transitionDuration: '0ms'
            })
        }

        if (idx === itemList.length) {
            return;
        }
        setAnimation({
            transform: `translate3d(calc(-100% * ${idx + 2}), 0px, 0px)`,
            transitionDuration: '350ms'
        })
        add();
    };

    useEffect(() => {
        returnflag = true;

        if (idx === 0) {
            // console.log('reset')
            setAnimation({
                transform: `translate3d(calc(-100% * ${idx + 1}), 0px, 0px)`,
                transitionDuration: '0ms'
            })
        }
        
        if (idx === itemList.length) {
            console.log('왓')
            console.log(returnflag);
            
            setAnimation({
                transform: `translate3d(calc(-100% * ${idx + 1}), 0px, 0px)`,
                transitionDuration: '350ms'
            })
            // setIsLast(true);
            setTimeout(() => {
                setIdx(0);

            }, 350);
        } else {
            setTimeout(() => {
                returnflag = false;
            }, 350);
        }
        
    }, [idx]);

    // useEffect(() => {
    //     if (isLast) {
    //         // setIsLast(false);
    //         setIdx(0);
    //     }
    // }, [isLast]);


    return (
        <Fragment>
            <div className={cx('slick')}>
                <div className={cx('slick-wrapper')} style={{ ...animation }}>
                {list.map((item, i) => {
                    return (
                        <div className={cx('slot')} style={{ backgroundColor: item.backgroundColor }}>
                            sadsad
                        </div>
                    )
                })}
                </div> 
            </div>
            <button onClick={handleClick}>
                Next
            </button>
        </Fragment>
    );
};

export default index;