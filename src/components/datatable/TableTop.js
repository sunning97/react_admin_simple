import React, {memo} from 'react';
import {Label, Input, FormGroup, Col, Row} from "reactstrap";

function TableTop({search, changePerPage, perPage, language}) {
    let searchKey = '';
    let time = null;
    const lengthMenuLang = language.length_menu.split('_MENU_');
    const searchPlaceholderLang = language.search_placeholder;
    const handleTimeout = () => {
        search(searchKey)
    };
    const onChange = event => {
        searchKey = event.target.value;
        clearTimeout(time);
        time = setTimeout(handleTimeout, 300);;
    };
    return (
        <Row>
            <Col lg={{size: 5}}>
                <FormGroup>
                    <Row>
                        <Label className="col-lg-12 mt-2 font-13">
                            <span className="mr-1">{lengthMenuLang[0]}</span>
                            <Input
                                type="select"
                                name="perPage"
                                className="form-control form-control-solid col-lg-3 d-inline-block"
                                onChange={changePerPage}
                                defaultValue={perPage}>
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </Input>
                            <span className="ml-1">{lengthMenuLang[1]}</span>
                        </Label>
                    </Row>
                </FormGroup>
            </Col>
            <Col lg={{size: 7}}>
                <FormGroup>
                    <Row lg={{size: 3}} className="float-right mr-1">
                        <div className="input-group-icon input-group-icon-left mr-3">
                            <span className="input-icon input-icon-right font-16"><i
                                className="ti-search"/></span>
                            <Input
                                className="form-control form-control-rounded form-control-solid"
                                type="text"
                                name="searchKey"
                                onChange={onChange}
                                placeholder={searchPlaceholderLang}/>
                        </div>
                    </Row>
                    <div className="clearfix"/>
                </FormGroup>
            </Col>
        </Row>
    )
}

export default memo(TableTop);