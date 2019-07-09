import React from 'react';

class CustomToggle extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();
        this.props.onClick(e);
    }

    render() {
        const {children} = this.props;
        return (
            <span style={{cursor:'pointer'}} onClick={this.handleClick}>
                {children}
            </span>
        );
    }
}
export default CustomToggle;