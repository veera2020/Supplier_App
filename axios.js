import Axios from "axios";

const site = "http://3.110.142.224:3001";
//const site = "https://crm-493969272.ap-south-1.elb.amazonaws.com/";

const instance = Axios.create({
  baseURL: site,
  headers: {
    "Content-Type": "application/json",
  },
});
instance.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default instance;
