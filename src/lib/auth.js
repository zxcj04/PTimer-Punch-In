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
  try {
    await apis.userLogout({ session_id: cookies.get("session_id") });
    cookies.remove("session_id");
    return true;
  } catch (error) {
    console.log(error);
    cookies.remove("session_id");
    return false;
  }
}

const checkLogin = async () => {
  const { cookies } = useCookies();
  try {
    await apis.checkSession({ session_id: cookies.get("session_id") });
    return true;
  } catch (error) {
    console.log(error);
    cookies.remove("session_id");
    return false;
  }
}

const checkAdmin = async () => {
  const { cookies } = useCookies();
  try {
    await apis.checkAdmin({ session_id: cookies.get("session_id") });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const changePassword = async (old_password, new_password) => {
  const { cookies } = useCookies();
  try {
    await apis.changePassword({
      session_id: cookies.get("session_id"),
      old_password,
      new_password,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const administer = async (user_id) => {
  const { cookies } = useCookies();
  try {
    await apis.administer({
      session_id: cookies.get("session_id"),
      user_id,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const revokeAdmin = async (user_id) => {
  const { cookies } = useCookies();
  try {
    await apis.revokeAdmin({
      session_id: cookies.get("session_id"),
      user_id,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export {
  userLogin,
  userLogout,
  checkLogin,
  checkAdmin,
  changePassword,
  administer,
  revokeAdmin,
};