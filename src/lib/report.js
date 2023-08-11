import apis from "@/apis/report";
import { useCookies } from "vue3-cookies";

const getAllReport = async (payload) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.getAllReport({ session_id: cookies.get("session_id"), ...payload });
    return [true, response.data];
  } catch (error) {
    return [false, error.response.data.msg];
  }
}

const getProjectReport = async (payload) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.getProjectReport({ session_id: cookies.get("session_id"), ...payload });
    return [true, response.data];
  } catch (error) {
    return [false, error.response.data.msg];
  }
}

const getUserReport = async (payload) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.getUserReport({ session_id: cookies.get("session_id"), ...payload });
    return [true, response.data];
  } catch (error) {
    return [false, error.response.data.msg];
  }
}

export {
  getAllReport,
  getProjectReport,
  getUserReport,
}
