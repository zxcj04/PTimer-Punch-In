import apis from "@/apis/project";
import { useCookies } from "vue3-cookies";

const getProjectInfo = async (project_id) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.projectInfo({ session_id: cookies.get("session_id"), project_id });
    return [true, response.data.project_info];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const getProjectList = async () => {
  const { cookies } = useCookies();
  try {
    const response = await apis.projectList({ session_id: cookies.get("session_id") });
    return [true, response.data.projects];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const createProject = async (project) => {
  const { cookies } = useCookies();
  const payload = {
    session_id: cookies.get("session_id"),
    project,
  };
  try {
    const response = await apis.createProject(payload);
    return [true, response.data.msg];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const updateProject = async (project_id, project) => {
  const { cookies } = useCookies();
  const payload = {
    session_id: cookies.get("session_id"),
    project_id,
    project,
  };
  try {
    const response = await apis.updateProject(payload);
    return [true, response.data.msg];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const recoverProject = async (project_id) => {
  const { cookies } = useCookies();
  const payload = {
    session_id: cookies.get("session_id"),
    project_id,
  };
  try {
    const response = await apis.recoverProject(payload);
    return [true, response.data.msg];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const deleteProject = async (project_id) => {
  const { cookies } = useCookies();
  const payload = {
    session_id: cookies.get("session_id"),
    project_id,
  };
  try {
    const response = await apis.deleteProject(payload);
    return [true, response.data.msg];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

export {
  getProjectInfo,
  getProjectList,
  createProject,
  updateProject,
  recoverProject,
  deleteProject,
};
