import axios from '@/plugins/axios';

const PREFIX = '/punch';

export default {
  userPunchIn(payload) {
    const session_id = payload.session_id;
    const project_id = payload.project_id;
    return axios.post(PREFIX + '/in', {project_id: project_id}, {headers: {'SESSION-ID': session_id}});
  },
  userPunchOut(payload) {
    const session_id = payload.session_id;
    return axios.post(PREFIX + '/out', {}, {headers: {'SESSION-ID': session_id}});
  },
  getPunchs(payload) {
    const session_id = payload.session_id;
    return axios.get(PREFIX + '/list', {headers: {'SESSION-ID': session_id}});
  },
  getActivePunch(payload) {
    const session_id = payload.session_id;
    return axios.get(PREFIX + '/active', {headers: {'SESSION-ID': session_id}});
  },
  getAdminAllPunchs(payload) {
    const session_id = payload.session_id;
    return axios.get(PREFIX + '/admin/list', {headers: {'SESSION-ID': session_id}});
  },
}