import React, {memo} from 'react';
import PropTypes from 'prop-types';
import {Table} from "reactstrap";
function TableMain(props) {
    const {
        addAction,
        columnsTitle,
        singleRow,
        currentPage,
        perPage,
        changeOrder,
        data,
        language,
        type
    } = props;
    return (
        <Table className="table table-bordered table-hover">
            <thead style={styles.tableHead}>
            <tr>
                {addAction && <th className="text-center">!!!</th>}
                {
                    columnsTitle && columnsTitle.map((item, index) => (
                        <td
                            style={item.orderable ? styles.tableTDCursor : styles.tableTD}
                            onClick={item.orderable ? changeOrder.bind(this, index) : null}
                            key={index}
                            className={item.clName}>
                            <b>
                                {item.orderActive && (item.orderType === 'ASC' ?
                                    <i className="ti-arrow-up mr-3"/> : <i className="ti-arrow-down mr-3"/>)}
                                {item.text}
                            </b>
                        </td>
                    ))
                }
            </tr>
            </thead>
            <tbody>
            {
                (data && data.length > 0) ?
                    data.map((item, index) => (
                        singleRow(item, index + 1 + (currentPage - 1) * perPage)
                    )) :
                    <tr>
                        <td colSpan={columnsTitle.length + 1} className={'text-center'}>
                            {type === 'search' ? language.no_search_result : language.no_data}
                        </td>
                    </tr>
            }
            </tbody>
        </Table>
    );
}

const styles = {
    tableHead: {
        backgroundColor: '#F4F5F9',
        padding: '16px 10px'
    },
    tableTDCursor: {
        cursor: 'pointer',
        height: '30px',
        lineHeight: '30px'
    },
    tableTD: {
        height: '30px',
        lineHeight: '30px'
    }
};
TableMain.propTypes = {
    data: PropTypes.array.isRequired,
    addAction: PropTypes.bool,
    columnsTitle: PropTypes.array.isRequired,
    singleRow: PropTypes.func.isRequired
};
export default memo(TableMain);