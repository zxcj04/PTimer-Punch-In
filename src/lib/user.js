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

export {
  userInfo,
  userUpdate,
}
