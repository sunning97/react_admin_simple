import React from 'react';
import PropTypes from 'prop-types';

const BoxHead = ({title = '',children}) =>
            <div className="ibox-head">
                <div className="ibox-title"><b>{title}</b></div>
                <div className="ibox-tools">
                    <div className="ibox-collapse">
                        {children}
                    </div>
                </div>
            </div>;
BoxHead.propTypes = {
    title: PropTypes.string
};
export default BoxHead;