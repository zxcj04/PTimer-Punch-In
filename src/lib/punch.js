import apis from "@/apis/punch";
import { useCookies } from "vue3-cookies";

const userPunchIn = async (payload) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.userPunchIn({ session_id: cookies.get("session_id") });
    return [true, response.data.msg];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const userPunchOut = async (payload) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.userPunchOut({ session_id: cookies.get("session_id") });
    return [true, response.data.msg];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const getPunchs = async (payload) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.getPunchs({ session_id: cookies.get("session_id") });
    const p = response.data.punches.slice(0, 5);
    const ret = p.reduce((acc, cur) => {
      const isDone = !!cur.punch_out_time;
      const startDate = new Date(cur.punch_in_time);

      if (isDone) {
        const endDate = new Date(cur.punch_out_time);
        acc.push({
          id: cur.punch_id + "-end",
          time: endDate,
          color: "green",
          text: "下班",
        })
      }

      acc.push({
        id: cur.punch_id + "-start",
        time: startDate,
        color: isDone? "blue" : "yellow",
        text: "上班",
      })

      return acc;
    }, []);
  return [true, ret];
  } catch (error) {
    console.log(error);
    return [false, []];
  }
}

const getActivePunch = async (payload) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.getActivePunch({ session_id: cookies.get("session_id") });
    return [true, response.data.punch];
  } catch (error) {
    return [false, error.response.data.msg];
  }
}

export {
  userPunchIn,
  userPunchOut,
  getPunchs,
  getActivePunch,
}