import React, {memo} from 'react';
import Pagination from "react-bootstrap/Pagination";
import Auxiliary from '../hoc/Auxiliary';

function TablePaginate(props) {
    const computePages = () => {
        const {
            current_page,
            last_page
        } = props.data;
        const {offset} = props;
        // calculate from point
        let f = current_page - offset;
        if (f < 1) f = 1;

        // calculate to point
        let t = current_page + offset;
        if (t > last_page) t = last_page;

        // generate array pages
        const arrayPages = [];
        for (let i = f; i <= t; i++) {
            arrayPages.push(i);
        }
        return arrayPages;
    };
    const {current_page, last_page, from, to, total} = props.data;
    const type = props.type;
    const {handle, isLoading, language} = props;
    const arrayPages = computePages();
    const footerInfo = language.footer_info.match(/(.*)_START_(.*)_END_(.*)_TOTAL_(.*)/i);
    return (
        <Auxiliary>
            <div className="float-left">
                <p className={'ml-3 font-13'}>
                    {footerInfo[1] ? footerInfo[1] : ''}
                    {from} {footerInfo[2] ? footerInfo[2] : ''} {to}
                    {footerInfo[3] ? footerInfo[3] : ''} {total}
                    {footerInfo[4] ? footerInfo[4] : ''}
                </p>
            </div>
            <div className="float-right">
                {
                    (last_page > 1 && !isLoading) ?
                        <Pagination>
                            {current_page > 3 ? <Pagination.First onClick={handle.bind(this, 1, type)}/> : null}
                            {current_page > 1 ?
                                <Pagination.Prev onClick={handle.bind(this, current_page - 1, type)}/> : null}
                            {current_page > 6 ? <Pagination.Ellipsis disabled/> : null}
                            {
                                arrayPages.map((pageNum, index) => (
                                    <Pagination.Item
                                        key={`${index}${pageNum}`}
                                        active={pageNum === current_page}
                                        disabled={pageNum === current_page}
                                        onClick={() => {
                                            handle(pageNum, type)
                                        }}>
                                        {pageNum}
                                    </Pagination.Item>
                                ))
                            }
                            {last_page - current_page > 6 ? <Pagination.Ellipsis disabled/> : null}
                            {current_page < last_page ?
                                <Pagination.Next onClick={handle.bind(this, current_page + 1, type)}/> : null}
                            {last_page - current_page > 3 ?
                                <Pagination.Last onClick={handle.bind(this, last_page, type)}/> : null}
                        </Pagination> : null
                }
            </div>
            <div className="clearfix"/>
        </Auxiliary>
    )
}

export default memo(TablePaginate);