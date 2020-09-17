import React, { Component, createRef } from 'react';

interface Props {

}

interface State {
    isOpen: boolean;
}

class A11y extends Component<Props, State> {

    private textInputRef = createRef<HTMLInputElement>();
    private toggleContainer = createRef<any>();
    timeOutId: any;

    constructor(props: Props) {
        super(props);

        this.timeOutId = null;

        this.state = {
            isOpen: false,
        };
    }

    // setTimeout을 사용해 다음 순간에 팝오버를 닫습니다.
    // 엘리먼트의 다른 자식에 포커스가 맞춰져있는지 확인하기 위해 필요합니다.
    // 새로운 포커스 이벤트가 발생하기 전에
    // 블러(blur) 이벤트가 발생해야 하기 때문입니다.
    onBlurHandler = () => {
        this.timeOutId = setTimeout(() => {
            this.setState({
                isOpen: false
            });
        });
    }

    onClickHandler = () => {

        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    onFocusHandler = () => {
        clearTimeout(this.timeOutId);
    }

    render() {
        return (
            <div style={{ backgroundColor: 'cyan'}} onBlur={this.onBlurHandler} onFocus={this.onFocusHandler}>
                <button onClick={this.onClickHandler} aria-haspopup="true" aria-expanded={this.state.isOpen}>
                    Select an option
                </button>
                <br />
                <button>
                    Select an option1
                </button>
                {this.state.isOpen && (
                    <ul>
                        <li>Option 1</li>
                        <li>Option 2</li>
                        <li>Option 3</li>
                    </ul>
                )}
            </div>
        );
    }
}

export default A11y;