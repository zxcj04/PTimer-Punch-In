import axios from '@/plugins/axios';

const PREFIX = '/user';

export default {
  userInfo(payload) {
    const session_id = payload.session_id;
    return axios.post(PREFIX + '/info', {}, {headers: {'SESSION-ID': session_id}});
  },
  userUpdate(payload) {
    const session_id = payload.session_id;
    const user_info = payload.user_info;
    return axios.post(PREFIX + '/update', {user_info}, {headers: {'SESSION-ID': session_id}});
  },
}