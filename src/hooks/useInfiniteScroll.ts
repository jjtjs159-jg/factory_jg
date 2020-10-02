import {
    useEffect,
    useState,
    useReducer,
    Dispatch,
    SetStateAction,
} from 'react';
import {
    isEmpty,
    isEqual,
    debounce,
} from 'lodash';

interface Props<T> {
    // If the scroll base is window or container
    isWindow?: boolean;
    // The base container when `isWindow` is false
    container?: React.RefObject<any>;
    // The next data loader which is called when `fetching`
    loader: () => Promise<T[] | undefined>;
    // A callback which is called when `fetching`
    callback?: () => void;
    // Initial Items
    initialItems?: any[];
}

interface State {
    // The number of data loaded
    items: any[];
    // True if there is data to be loaded otherwise false
    hasMore: boolean;
    // Mobile url bar height (diff active viewport and inactive viewport)
    barHeight: number;
    // Mobile viewport
    viewport: {
        active: number;
        inactive: number;
    };
}

interface Return<T> {
    isFetching: boolean;
    setIsFetching: Dispatch<SetStateAction<boolean>>;
    items: T[];
    hasMore: boolean;
}

type Action =
    | { type: 'LOAD'; items: any[]; currentLength?: number }
    | { type: 'STOP'; hasMore: boolean }
    | { type: 'SET_BARHEIGHT'; barHeight: number }
    | {
        type: 'SET_VIEWPORT';
        viewport: {
            active: number;
            inactive: number;
        };
    };

const initialState: State = {
    items: [],
    hasMore: true,
    barHeight: 0,
    viewport: {
        active: 0,
        inactive: 0,
    },
};

const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'LOAD': {
            return {
                ...state,
                items: action.items,
            };
        }
        case 'STOP': {
            return {
                ...state,
                hasMore: action.hasMore,
            };
        }
        case 'SET_VIEWPORT': {
            return {
                ...state,
                viewport: {
                    active: action.viewport.active,
                    inactive: action.viewport.inactive,
                },
            };
        }
        case 'SET_BARHEIGHT': {
            return {
                ...state,
                barHeight: action.barHeight,
            };
        }
        default: {
            throw new Error('unexpected action type');
        }
    }
};

/**
 * An infinite scroll is triggered when you scroll to the bottom of the page(or container).
 * @param {object} props
 * @returns {Return} The type of items is generic received as props generic
 *
 * Example when parent element is not window
 * you need parent container and code to run during fetching(ex. loader / spinner)
 * @example
 * ```es6
 * const getContainer = () => {
 *      const [container, setContainer] = useState(() => createRef<HTMLDivElement>());
 *      return container;
 * }
 * const container = getContainer();`
 * ```
 */
const useInfiniteScroll = <T>(props: Props<T>): Return<T> => {

    const injectedState = {
        ...initialState,
        items: props.initialItems || [],
    };

    const [state, dispatch] = useReducer(reducer, injectedState);

    const [isFetching, setIsFetching] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const {
        container,
        isWindow,
        loader,
        callback,
    } = props;

    const {
        hasMore,
        items,
        barHeight,
        viewport,
    } = state;

    useEffect(() => {
        setIsFetching(false);

        setIsResizing(false);

        onStop(false);

        onLoad({
            items: props.initialItems as T[],
        });
    }, [props.initialItems]);

    /**
     * The next data load which is called when fetching
     * @param {number} endpoint
     */
    const dataLoader = async () => {
        await loader().then((response) => {
            if (isEmpty(response)) {
                onStop(true);
            }

            if (!isEmpty(response)) {
                onLoad({
                    items: state.items.concat(response),
                });
            }
        }).catch((error) => {
            console.log(error);
        }).finally(() => {
            setIsFetching(false);
            callback && callback();
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleViewResize, true);

        hasMore && dataLoader();

        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleViewResize, true);
        };
    }, [barHeight, hasMore]);

    // When there is data that can be loaded and fetching
    useEffect(() => {
        if (!isFetching) return;
        hasMore && dataLoader();
    }, [isFetching, hasMore]);

    const onLoad = (
        param: {
            items: T[];
        },
    ) => {
        dispatch({
            type: 'LOAD',
            items: param.items,
        });
    };

    const onStop = (stop: boolean) => {
        dispatch({
            type: 'STOP',
            hasMore: !stop,
        });
    };

    const onSetViewport = (
        param: {
            active: number;
            inactive: number
        },
    ) => {
        dispatch({
            type: 'SET_VIEWPORT',
            viewport: {
                ...param,
            },
        });
    };

    const onSetBarHeight = (height: number) => {
        dispatch({
            type: 'SET_BARHEIGHT',
            barHeight: height,
        });
    };

    useEffect(() => {
        // first, save the inactive viewport as active and inactive
        if (!viewport.active || !viewport.inactive) {
            onSetViewport({
                active: window.innerHeight,
                inactive: window.innerHeight,
            });

            setIsResizing(false);
            return;
        }

        // save the active viewport
        if (window.innerHeight > viewport.active) {
            onSetViewport({
                active: window.innerHeight,
                inactive: viewport.inactive,
            });

            setIsResizing(false);
            return;
        }

        // diff between active viewport height and inactive viewport height
        if (!isEqual(viewport.active, viewport.inactive) && isEqual(barHeight, 0)) {
            onSetBarHeight(viewport.active - viewport.inactive);

            setIsResizing(false);
            return;
        }
    }, [isResizing]);

    /**
     * Browser resize & Mobile resize Method, run every 200ms
     */
    const handleViewResize = debounce(() => setIsResizing(true), 200);

    /**
     * Scroll Method, run every 200ms
     *
     * scrollTop: The height of the scroll.
     * scrollHeight: Total height up to invisible on client screen.
     * clientHeight: The height visible by the current scroll.
     * barHeight: URL bar of mobile browser.
     */
    const handleScroll = debounce(() => {
        if (!hasMore) return;

        if (isWindow) {
            const scrollHeight = Math.max(
                document.documentElement.scrollHeight,
                document.body.scrollHeight,
            );

            const scrollTop = Math.ceil(
                Math.max(
                    document.documentElement.scrollTop,
                    document.body.scrollTop,
                ),
            );

            const clientHeight = document.documentElement.clientHeight;
            if (scrollTop + clientHeight >= scrollHeight - barHeight - 10) {
                setIsFetching(true);
            } else {
                setIsFetching(false);
            }
        }

        // scrolling in containers
        // if (!isWindow && container && container.current) {
        //     const containerScrollHeight = container.current.scrollHeight;
        //     const containerScrollTop = container.current.scrollTop;

        //     const scrollHeight = Math.max(document.body.scrollHeight, containerScrollHeight);
        //     const scrollTop = Math.max(document.body.scrollTop, containerScrollTop);
        //     const clientHeight = container.current.clientHeight;

        //     if (scrollTop + clientHeight === scrollHeight) {
        //         setIsFetching(true);
        //     } else {
        //         setIsFetching(false);
        //     }
        // }
    }, 200);

    return {
        isFetching,
        setIsFetching,
        items,
        hasMore,
    };
};

export default useInfiniteScroll;
