export default (axiosInstance) => (resource) => ({
  get(path, payload) {
    return axiosInstance.$get(`${resource}/${path}`, payload);
  },
  post(path, payload) {
    return axiosInstance.$post(`${resource}/${path}`, payload);
  },
  put(path, payload) {
    return axiosInstance.$put(`${resource}/${path}`, payload);
  },
  patch(path, payload) {
    return axiosInstance.$patch(`${resource}/${path}`, payload);
  },
  delete(path) {
    return axiosInstance.$delete(`${resource}/${path}`);
  },
});
