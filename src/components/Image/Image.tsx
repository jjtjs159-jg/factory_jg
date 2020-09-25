import { FunctionComponent, CSSProperties } from 'react';

interface Props {
    src: string;
    className?: string;
    style?: CSSProperties;
    alt?: string;
}

const defaultProps: Partial<Props> = {
    alt: '',
};

const Image: FunctionComponent<Props> = ({
    src,
    className,
    ...rest
}) => {
    return (
        <img src={src} className={className} {...rest} />
    );
};

Image.defaultProps = defaultProps;

export default Image;
