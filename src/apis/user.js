import axios from '@/plugins/axios';

const PREFIX = '/user';

export default {
  userInfo(payload) {
    const session_id = payload.session_id;
    return axios.get(PREFIX + '/info', {headers: {'SESSION-ID': session_id}});
  },
  userUpdate(payload) {
    const session_id = payload.session_id;
    const user_info = payload.user_info;
    return axios.post(PREFIX + '/update', {user_info}, {headers: {'SESSION-ID': session_id}});
  },
  getUserProjects(payload) {
    const session_id = payload.session_id;
    return axios.get(PREFIX + '/projects', {headers: {'SESSION-ID': session_id}});
  },
  getAdminUserList(payload) {
    const session_id = payload.session_id;
    return axios.get(PREFIX + '/admin/list', {headers: {'SESSION-ID': session_id}});
  },
  adminActiveUser(payload) {
    const session_id = payload.session_id;
    const user_id = payload.user_id;
    return axios.post(PREFIX + '/admin/active', {user_id}, {headers: {'SESSION-ID': session_id}});
  },
  adminInactiveUser(payload) {
    const session_id = payload.session_id;
    const user_id = payload.user_id;
    return axios.post(PREFIX + '/admin/inactive', {user_id}, {headers: {'SESSION-ID': session_id}});
  },
  adminUpdateUser(payload) {
    const session_id = payload.session_id;
    const user_id = payload.user_id;
    const user_info = payload.user_info;
    return axios.post(PREFIX + '/admin/update', {user_id, user_info}, {headers: {'SESSION-ID': session_id}});
  },
}