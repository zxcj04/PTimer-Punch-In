import apis from "@/apis/auth";
import { useCookies } from "vue3-cookies";

const userLogin = async (mail, password) => {
  try {
    const response = await apis.userLogin({
      mail,
      password,
    });

    const { cookies } = useCookies();

    cookies.set("session_id", response.data.session_id);

    return [true, response.data.msg];
  } catch (error) {
    console.log(error);

    return [false, error.response.data.msg];
  }
}

const userLogout = async () => {
  const { cookies } = useCookies();
  const response = await apis.userLogout({ session_id: cookies.get("session_id") });

  cookies.remove("session_id");

  return response.data.valid;
}


export {
  userLogin,
  userLogout,
};