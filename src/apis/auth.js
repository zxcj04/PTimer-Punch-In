import axios from '@/plugins/axios';

const PREFIX = '/auth';

export default {
  userLogin(payload) {
    return axios.post(PREFIX + '/login', payload);
  },
  userLogout(payload) {
    const session_id = payload.session_id;
    return axios.post(PREFIX + '/logout', {}, {headers: {'SESSION-ID': session_id}});
  },
  checkSession(payload) {
    const session_id = payload.session_id;
    return axios.post(PREFIX + '/check_session', {}, {headers: {'SESSION-ID': session_id}});
  },
}