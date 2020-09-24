import { useEffect, useState } from 'react';

interface Size {
    winX?: number;
    winY?: number;
}

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<Size>();

    if (!window) {
        return windowSize;
    }

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                winX: window.innerWidth,
                winY: window.innerHeight,
            });
        };
        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return windowSize;
};

export default useWindowSize;
