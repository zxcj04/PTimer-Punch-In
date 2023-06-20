import axios from '@/plugins/axios';

const PREFIX = '/auth';

export default {
  userLogin(payload) {
    return axios.post(PREFIX + '/login', payload);
  },
  userLogout(payload) {
    return axios.post(PREFIX + '/logout', payload);
  },
}