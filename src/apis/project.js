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
  updateProject(payload) {
    const session_id = payload.session_id;
    const project_id = payload.project_id;
    const project = payload.project;
    return axios.post(PREFIX + '/update', {project_id, project}, {headers: {'SESSION-ID': session_id}});
  },
  recoverProject(payload) {
    const session_id = payload.session_id;
    const project_id = payload.project_id;
    return axios.post(PREFIX + '/recover', {project_id}, {headers: {'SESSION-ID': session_id}});
  },
  deleteProject(payload) {
    const session_id = payload.session_id;
    const project_id = payload.project_id;
    return axios.post(PREFIX + '/delete', {project_id}, {headers: {'SESSION-ID': session_id}});
  },
}