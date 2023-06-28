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
  checkAdmin(payload) {
    const session_id = payload.session_id;
    return axios.post(PREFIX + '/check_admin', {}, {headers: {'SESSION-ID': session_id}});
  },
  changePassword(payload) {
    const session_id = payload.session_id;
    const old_password = payload.old_password;
    const new_password = payload.new_password;
    return axios.post(PREFIX + '/change_password', {old_password, new_password}, {headers: {'SESSION-ID': session_id}});
  }
}