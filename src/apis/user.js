import axios from '@/plugins/axios';

const PREFIX = '/user';

export default {
  userInfo(payload) {
    const session_id = payload.session_id;
    return axios.post(PREFIX + '/info', {}, {headers: {'SESSION-ID': session_id}});
  }
}