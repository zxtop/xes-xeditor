import axios from 'axios';
const host1 = "http://courseware.xesv5.com/";
const host2 = "http://10.99.2.153:3000/";
const API = {
  URLS: {
    upload: host1 + "api/OnlineEdit/multiUpload", //post
    upload1: host1 + "flash/post_update_flash",
    publish: host1 + "api/OnlineEdit/pagePublish", //post
    getTemplateInfo: host1 + "api/Template/getTemplateInfo",
    getJsonByPageId: host1 + "api/Page/getDataJsonByPageId"
  },
  getFun: (src, obj, successFun, errorFun) => {
    axios.get(src, obj)
      .then(function (response) {
        successFun(response);
      })
      .catch(function (error) {
        errorFun(error)
      });
  },
  postFun: (src, obj, successFun, errorFun) => {
    axios.post(src, obj)
      .then(function (response) {
        successFun(response);
      })
      .catch(function (error) {
        errorFun(error)
      });
  },
  funRequest: (url, method, params, successCallback, failedCallback) => {
    if (method === 'post') {
      API.postFun(url, params, successCallback, failedCallback);
    } else {
      API.getFun(url, params, successCallback, failedCallback);
    }
  }
};
export { API, host1, host2 }

