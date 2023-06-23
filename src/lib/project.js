import apis from "@/apis/project";
import { useCookies } from "vue3-cookies";

const getProjectInfo = async (project_id) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.projectInfo({ session_id: cookies.get("session_id"), project_id });
    return [true, response.data.project];
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

const createProject = async (id, name, description) => {
  const { cookies } = useCookies();
  const payload = {
    session_id: cookies.get("session_id"),
    id,
    name,
    description,
  };
  try {
    const response = await apis.createProject(payload);
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
};
