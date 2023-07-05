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
    const start = payload.start || null;
    const end = payload.end || null;
    const params = {};
    if (start) {
      params.start = start;
    }
    if (end) {
      params.end = end;
    }
    return axios.get(PREFIX + '/list', {headers: {'SESSION-ID': session_id}, params: params});
  },
  getActivePunch(payload) {
    const session_id = payload.session_id;
    return axios.get(PREFIX + '/active', {headers: {'SESSION-ID': session_id}});
  },
  updatePunch(payload) {
    const session_id = payload.session_id;
    const punch_id = payload.punch_id;
    const punch = payload.punch;
    return axios.post(PREFIX + '/update', {punch_id, punch}, {headers: {'SESSION-ID': session_id}});
  },
  deletePunch(payload) {
    const session_id = payload.session_id;
    const punch_id = payload.punch_id;
    return axios.post(PREFIX + '/delete', {punch_id}, {headers: {'SESSION-ID': session_id}});
  },
  getAdminAllPunchs(payload) {
    const session_id = payload.session_id;
    const user_id = payload.user_id || null;
    const start = payload.start || null;
    const end = payload.end || null;
    const params = {};
    if (user_id) {
      params.user_id = user_id;
    }
    if (start) {
      params.start = start;
    }
    if (end) {
      params.end = end;
    }
    return axios.get(PREFIX + '/admin/list', {headers: {'SESSION-ID': session_id}, params: params});
  },
  adminRecoverPunch(payload) {
    const session_id = payload.session_id;
    const punch_id = payload.punch_id;
    return axios.post(PREFIX + '/admin/recover', {punch_id}, {headers: {'SESSION-ID': session_id}});
  },
}