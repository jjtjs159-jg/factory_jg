import React, { FunctionComponent, Fragment } from 'react';

interface Props {
    data?: String[];
}

const List: FunctionComponent<Props> = ({
    data
}) => {
    return (
        <Fragment>
            {data!.map((d, i) => (
                <div key={i}>
                    {d}
                </div>
            ))}
        </Fragment>
    );
};

List.defaultProps = {
    data: ['first', 'second'],
};

export default List;