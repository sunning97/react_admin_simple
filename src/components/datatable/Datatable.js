import React, {useState, useEffect} from 'react';
import TableTop from "./TableTop";
import TableMain from "./TableMain";
import TablePaginate from "./TablePaginate";
import Axios from "../../utils/axios";
import {fetchData} from '../../api/datatable';
import Helpers from "../../utils/helpers";
import PropTypes from 'prop-types';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

function Datatable(props) {
    const {reload, columns, language, urls, action, row} = props;
    const [defaultLanguage, setDefaultLanguage] = useState({
        loading: 'Loading...',
        no_data: 'No records found',
        search_placeholder: 'Search...',
        no_search_result: 'No matching records found',
        length_menu: 'Show: _MENU_ entries',
        footer_info: 'Showing _START_ to _END_ of _TOTAL_ entries'
    });
    const [defaultColumns, setDefaultColumns] = useState(columns);
    const [data, setData] = useState({data: []});
    const [searchKey, setSearchKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [defaultPerPage, setDefaultPerPage] = useState(10);
    const [dataPage, setDataPage] = useState(1);
    const [searchPage, setSearchPage] = useState(1);
    const [type, setType] = useState('data');
    const [reloadTime,setReloadTimes] = useState(0);
    const getActiveColumnOrder = () => defaultColumns.find(item => item.orderActive);
    const handleChangePerPage = event => {
        setLoading(true);
        event.preventDefault();
        const value = parseInt(event.target.value);
        const orderCol = getActiveColumnOrder();
        if (value !== defaultPerPage) {
            setDefaultPerPage(value);
            let url = (type === 'search') ?
                `${urls.search}?
                        k=${searchKey}&
                        per_page=${value}&
                        order_by=${orderCol.field}&
                        order_type=${orderCol.orderType}` :
                `${urls.allData}?
                        page=1&
                        per_page=${value}&
                        order_by=${orderCol.field}&
                        order_type=${orderCol.orderType}`;
            Axios.get(url)
                .then(response => {
                    setData(response.data);
                    setLoading(false);
                });
        }
    };
    const changeOrderCol = index => {
        let cols = [...defaultColumns];
        /* find & change active order col*/
        cols = cols.map((item, pos) => {
            if (pos === index) {
                if (item.orderActive && item.orderType === 'ASC') {
                    item.orderType = 'DESC';
                } else {
                    item.orderType = 'ASC';
                    item.orderActive = true;
                }
            } else {
                item.orderActive = false;
                delete item.orderType;
            }
            return item
        });
        /* update changed data to state*/
        setDefaultColumns(cols);
        return cols;
    };
    const handleChangeOrder = index => {
        setLoading(true);
        const cols = changeOrderCol(index);
        const url = (type === 'search') ?
            `${urls.search}?
                page=${searchPage}&
                k=${searchKey}&
                per_page=${defaultPerPage}&
                order_by=${cols[index].field}&
                order_type=${cols[index].orderType}` :
            `${urls.allData}?
                page=${dataPage}&
                per_page=${defaultPerPage}&
                order_by=${cols[index].field}&
                order_type=${cols[index].orderType}`;
        Axios.get(url)
            .then(response => {
                setData(response.data);
                setLoading(false);
            }).catch(error => Helpers.feedback(error));
    };
    const handlePaginate = page => {
        setLoading(true);
        if (type === 'search') setSearchPage(page); else setDataPage(page);
        const orderCol = getActiveColumnOrder();
        const k = type === 'search' ? `k=${searchKey}&` : '';
        Axios.get(`${data.path}?
                page=${page}&
                ${k}
                order_by=${orderCol.field}&
                order_type=${orderCol.orderType}&
                per_page=${defaultPerPage}`)
            .then(response => {
                setData(response.data);
                setLoading(false);
            }).catch(Helpers.feedback);
    };
    const handleReloadData = () => {
        setLoading(true);
        setReloadTimes(reloadTime+1);
        const orderCol = getActiveColumnOrder();
        Axios.get(`${data.path}?
                page=${(type === 'search') ? searchPage : dataPage}&
                ${(type === 'search') ? `k=${searchKey}&` : ''}
                order_by=${orderCol.field}&
                order_type=${orderCol.orderType}&
                per_page=${defaultPerPage}`)
            .then(({data}) => {
                setData(data);
                setLoading(false);
            }).catch(Helpers.feedback);
    };
    const handleSearch = data => {
        setLoading(true);
        if (data !== '') {
            const orderCol = getActiveColumnOrder();
            setSearchKey(data);
            setType('search');
            Axios.get(`${urls.search}?
                    k=${data}&
                    per_page=${defaultPerPage}&
                    order_by=${orderCol.field}&
                    order_type=${orderCol.orderType}`)
                .then(response => {
                    setData(response.data);
                    setLoading(false);
                }).catch(Helpers.feedback);
        } else {
            setData({data: []});
            setSearchKey('');
            setType('data');
            initData();
        }
    };
    const initData = () => {
        fetchData({baseUrl: urls.allData, perPage: defaultPerPage, page: dataPage})
            .then(response => {
                setData(response.data);
                setLoading(false);
            }).catch(error => {
            Helpers.feedback(error);
        });
    };
    useEffect(() => {
        if (language) {
            setDefaultLanguage({
                ...defaultLanguage,
                ...language
            })
        }
        initData();
    }, []);
    useEffect(() => {
        reloadTime > 0 && handleReloadData();
        setReloadTimes(reloadTime+1);
    }, [reload]);
    return (
        <BlockUi tag="div" blocking={loading} message={defaultLanguage.loading}>
            <TableTop
                language={defaultLanguage}
                perPage={defaultPerPage}
                changePerPage={handleChangePerPage}
                search={handleSearch}/>
            <TableMain
                type={type}
                language={defaultLanguage}
                data={data.data}
                currentPage={type === 'search' ? searchPage : dataPage}
                perPage={defaultPerPage}
                isLoading={loading}
                addAction={action}
                columnsTitle={columns}
                changeOrder={handleChangeOrder}
                singleRow={row}/>
            <TablePaginate
                language={defaultLanguage}
                type={type}
                data={data}
                offset={3}
                isLoading={loading}
                handle={handlePaginate}/>
        </BlockUi>
    );
}
Datatable.propTypes = {
    language: PropTypes.object,
    urls: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
        field: PropTypes.string,
        text: PropTypes.string,
        clName: PropTypes.string,
        orderable: PropTypes.bool,
        orderActive: PropTypes.bool,
        orderType: PropTypes.string
    })),
    row: PropTypes.func.isRequired,
    action: PropTypes.bool,
    reload: PropTypes.bool
};
export default Datatable;