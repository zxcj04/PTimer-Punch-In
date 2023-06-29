import apis from "@/apis/user";
import { useCookies } from "vue3-cookies";

const userInfo = async () => {
  const { cookies } = useCookies();
  try {
    const response = await apis.userInfo({ session_id: cookies.get("session_id") });
    return [true, response.data.user_info];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const userUpdate = async (user_info) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.userUpdate({ session_id: cookies.get("session_id"), user_info });
    return [true, response.data.msg];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const getUserProjects = async () => {
  const { cookies } = useCookies();
  try {
    const response = await apis.getUserProjects({ session_id: cookies.get("session_id") });
    return [true, response.data.projects];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const getAdminUserList = async () => {
  const { cookies } = useCookies();
  try {
    const response = await apis.getAdminUserList({ session_id: cookies.get("session_id") });
    return [true, response.data.users];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const adminActiveUser = async (user_id) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.adminActiveUser({ session_id: cookies.get("session_id"), user_id });
    return [true, response.data.msg];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const adminInactiveUser = async (user_id) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.adminInactiveUser({ session_id: cookies.get("session_id"), user_id });
    return [true, response.data.msg];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const adminUpdateUser = async (user_id, user_info) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.adminUpdateUser({ session_id: cookies.get("session_id"), user_id, user_info });
    return [true, response.data.msg];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

export {
  userInfo,
  userUpdate,
  getUserProjects,
  getAdminUserList,
  adminActiveUser,
  adminInactiveUser,
  adminUpdateUser,
}
