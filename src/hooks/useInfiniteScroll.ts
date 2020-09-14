import {
    useEffect,
    useState,
    useReducer,
} from 'react';
import {
    isEmpty,
    isEqual,
    debounce,
} from 'lodash';

interface Props {
    // If the scroll base is window or container
    isWindow?: boolean;
    // The base container when `isWindow` is false
    container?: React.RefObject<any>;
    // The next data loader which is called when `fetching`
    loader: () => Promise<any[]>;
    // A callback which is called when `fetching`
    callback?: () => void;
    // Number of data to fetch
    length: number;
}

interface State {
    // The number of data loaded
    items: any[];
    // The number of data you want to load
    currentLength: number;
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

type Action =
    | { type: 'LOAD'; items: any[]; currentLength: number }
    | { type: 'STOP'; hasMore: boolean }
    | { type: 'SET_BARHEIGHT'; barHeight: number }
    | { type: 'SET_VIEWPORT';
        viewport: {
            active: number;
            inactive: number;
        };
    };

const initialState: State = {
    items: [],
    currentLength: 0,
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
                currentLength: action.currentLength,
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
const useInfiniteScroll = (props: Props) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const [isFetching, setIsFetching] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const {
        container,
        isWindow,
        loader,
        callback,
        length,
    } = props;

    const {
        currentLength,
        hasMore,
        items,
        barHeight,
        viewport,
    } = state;

    /**
     * The next data load which is called when fetching
     * @param {number} endpoint
     */
    const dataLoader = async (endpoint: number) => {
        await loader().then((response: any[]) => {
            if (isEmpty(response)) {
                onStop(false);
            }

            if (!isEmpty(response)) {
                onLoad({
                    items: state.items.concat(response),
                    currentLength: response.length + endpoint,
                });
            }
        }).catch((error: any) => {
            console.log(error);
        }).finally(() => {
            setIsFetching(false);
            callback && callback();
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleViewResize, true);

        dataLoader(length);

        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleViewResize, true);
        };
    }, [barHeight, hasMore]);

    // When there is data that can be loaded and fetching
    useEffect(() => {
        if (!isFetching) return;
        hasMore && dataLoader(currentLength);
    }, [isFetching, hasMore]);

    const onLoad = (
        param: {
            items: any[];
            currentLength: number;
        },
    ) => {
        dispatch({
            type: 'LOAD',
            currentLength: param.currentLength,
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
            if (scrollTop + clientHeight >= scrollHeight - barHeight) {
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
