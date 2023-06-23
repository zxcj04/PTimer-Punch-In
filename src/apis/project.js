import axios from '@/plugins/axios';

const PREFIX = '/project';

export default {
  projectInfo(payload) {
    const session_id = payload.session_id;
    const project_id = payload.project_id;
    return axios.get(PREFIX + '/info/' + project_id, {headers: {'SESSION-ID': session_id}});
  },
  projectList(payload) {
    const session_id = payload.session_id;
    return axios.get(PREFIX + '/list', {headers: {'SESSION-ID': session_id}});
  },
  createProject(payload) {
    const session_id = payload.session_id;
    const project = payload.project;
    return axios.post(PREFIX + '/create', project, {headers: {'SESSION-ID': session_id}});
  },
}