import axios from '@/plugins/axios';

const PREFIX = '/report';

export default {
  getAllReport(payload) {
    const session_id = payload.session_id;
    const users = payload.users || null;
    const start = payload.start || null;
    const end = payload.end || null;
    const params = {
      users: users,
      start: start,
      end: end,
    };
    return axios.get(PREFIX + '/all', {headers: {'SESSION-ID': session_id}, params: params});
  },
  getProjectReport(payload) {
    const session_id = payload.session_id;
    const project = payload.project || null;
    const start = payload.start || null;
    const end = payload.end || null;
    const params = {
      project: project,
      start: start,
      end: end,
    };
    return axios.get(PREFIX + '/project', {headers: {'SESSION-ID': session_id}, params: params});
  },
  getUserReport(payload) {
    const session_id = payload.session_id;
    const user = payload.user || null;
    const start = payload.start || null;
    const end = payload.end || null;
    const params = {
      user: user,
      start: start,
      end: end,
    };
    return axios.get(PREFIX + '/user', {headers: {'SESSION-ID': session_id}, params: params});
  },
}