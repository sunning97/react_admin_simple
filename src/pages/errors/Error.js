import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { hideLoading } from '../../store/actions/MainActions';

function Error({ history }) {
    const navigateTo = path => history.push(path);
    useEffect(()=>{
        hideLoading();
    });
    return (
        <div style={styles.errorContent}>
            <span style={styles.errorIcon} />
            <div className="flex-1">
                <h1 style={styles.errorCode}>404</h1>
                <h3 className="font-strong">NOT FOUND</h3>
                <p className="mb-4">Looks Like something was wrong!.</p>
                <div>
                    <span
                        style={{ cursor: 'pointer' }}
                        className="text-primary"
                        onClick={navigateTo.bind(this, '/')}>Go back Dashboard</span>
                </div>
            </div>
        </div>
    )
}

const styles = {
    body: {
        backgroundColor: '#fff',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '80% 10px'
    },
    errorContent: {
        maxWidth: '620px',
        margin: '200px auto 0',
    },
    errorIcon: {
        height: '160px',
        width: '160px',
        backgroundSize: 'cover',
        backgroundRepeat: 'no - repeat',
        marginRight: '80px'
    },
    errorCode: {
        fontSize: '120px',
        color: '#5c6bc0',
    }
};
const mapDispatchToProps = dispatch => ({
    hideLoading: () => dispatch(hideLoading())
})
export default connect(null, mapDispatchToProps)(Error);