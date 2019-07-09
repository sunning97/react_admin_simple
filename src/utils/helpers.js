import $ from 'jquery';
import 'toastr/build/toastr.css';
import toastr from 'toastr';
import Swal from 'sweetalert2';
import getPageTitle from './app-title';

const Helpers = {
    MILLISECONDS: 1,
    SECONDS: 2,
    storeMenu: (instance,{parent,api_path}) => {
        const {
            storeActiveMenu,
            storeActiveParentMenu,
        } = instance.props;
        storeActiveMenu(api_path);
        const tmp = parent ? parent.api_path : null;
        storeActiveParentMenu(tmp);
    },
    showLoading: () => {
        const loader = $('.preloader-backdrop');
        loader.fadeIn(200);
    },
    hideLoading: () => {
        const loader = $('.preloader-backdrop');
        loader.fadeOut(200);
    },
    lclStore: (key, value) => {
        localStorage.setItem(key, value);
    },
    lclGet: (key) => {
        return localStorage.getItem(key) ? localStorage.getItem(key) : '{}';
    },
    getCurrentTime: (type,timeZone) => {
        const date = new Date();
        const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
        const tmpTime = new Date(utc + (3600000*timeZone));
        return type === Helpers.MILLISECONDS ? tmpTime : Math.floor(tmpTime/1000);
    },
    lclRemove: (key) => {
        localStorage.removeItem(key);
    },
    scrollToTop: (x = 0, y = 0) => {
        window.scrollTo(x, y);
    },
    clearAllToast: ()=>{
        toastr.clear();
    },
    showToast: (type, message, time = 3000) => {
        Helpers.clearAllToast();
        toastr.options = {
            positionClass: 'toast-top-right',
            hideDuration: 300,
            timeOut: time,
            closeButton: true,
            progressBar: true,
        };

        switch (type) {
            case 'success': {
                toastr.success(message);
                break;
            }
            case 'error': {
                toastr.error(message);
                break;
            }
            case 'warning': {
                toastr.warning(message);
                break;
            }
            default:{

            }
        }
    },
    swalConfirm: (dataSwal = {}, callback = () => {}) => {
        const {
            title,
            text,
            confirmBtbColor,
            cancelBtbColor,
            confirmBtnText,
            cancelBtnText,
            showCancelButton,
            isHtml
        } = dataSwal;

        const setting = {
            title: title ? title : 'Default title swal',
            type: 'warning',
            showCancelButton: showCancelButton ? showCancelButton : true,
            confirmButtonColor: confirmBtbColor ? confirmBtbColor : '#3085d6',
            cancelButtonColor: cancelBtbColor ? cancelBtbColor : '#d33',
            confirmButtonText: confirmBtnText ? confirmBtnText : 'OK',
            cancelButtonText: cancelBtnText ? cancelBtnText : 'Cancel'
        };
        isHtml ? setting.html = text : setting.text = text;

        Swal.fire(setting).then((result) => {
            if (result.value) {
                callback();
            }
        })
    },
    swalError: (title = 'Oops...', text = 'Default error message', isHtml = false, footer = '') => {
        const setting = {
            type: 'error',
            title: title,
            footer: footer
        };
        isHtml ? setting.html = text : setting.text = text;
        Swal.fire(setting);
    },
    feedback: function (error, callback = () => {}) {
        if(error && error.status){
            const status = error.status;
            switch (status) {
                case 403:{
                    let errors = error.data.data;
                    let message = Object.keys(errors).reduce((current, next)=>{
                        return [...current,errors[next].join(', ')];
                    },[]).join('<br>');
                    Helpers.showToast('error', message,1500);
                    break;
                }
                case 404: {
                    let message = error.data.exception;
                    message = message.replace(/\\/g, '-');
                    Helpers.showToast('error', message,1500);
                    break;
                }
                case 401: {
                    Helpers.showToast('error', error.data.message,1500);
                    break;
                }
                case 500: {
                    Helpers.showToast('error', error.data.message,1500);
                    break;
                }
                default : {
                    Helpers.showToast('error','Lỗi không xác định',1500);
                }
            }
        }
        callback();
    },
    changeAppTitle: title => {
        document.title = getPageTitle(title);
    },
};

export default Helpers;