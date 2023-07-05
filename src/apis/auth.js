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
  userCreate(payload) {
    const session_id = payload.session_id;
    const mail = payload.mail;
    const password = payload.password;
    const info = payload.info;
    return axios.post(PREFIX + '/register', {mail, password, info}, {headers: {'SESSION-ID': session_id}});
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
  },
  administer(payload) {
    const session_id = payload.session_id;
    const user_id = payload.user_id;
    return axios.post(PREFIX + '/administer', {user_id}, {headers: {'SESSION-ID': session_id}});
  },
  revokeAdmin(payload) {
    const session_id = payload.session_id;
    const user_id = payload.user_id;
    return axios.post(PREFIX + '/revoke_admin', {user_id}, {headers: {'SESSION-ID': session_id}});
  },
}