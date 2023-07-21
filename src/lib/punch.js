import apis from "@/apis/punch";
import { useCookies } from "vue3-cookies";

const userPunchIn = async (project_id) => {
  const { cookies } = useCookies();
  const payload = {
    session_id: cookies.get("session_id"),
    project_id,
  };
  try {
    const response = await apis.userPunchIn(payload);
    return [true, response.data.msg];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const userPunchOut = async () => {
  const { cookies } = useCookies();
  try {
    const response = await apis.userPunchOut({ session_id: cookies.get("session_id") });
    return [true, response.data.msg];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const getPunchsByDates = async ({start, end}) => {
  const { cookies } = useCookies();
  const payload = {
    session_id: cookies.get("session_id"),
    start,
    end,
  };
  try {
    const response = await apis.getPunchs(payload);
    return [true, response.data.punches];
  } catch (error) {
    console.log(error);
    return [false, []];
  }
}

const getPunchs = async (split=false) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.getPunchs({ session_id: cookies.get("session_id") });
    if (!split) {
      return [true, response.data.punches];
    }
    const p = response.data.punches.slice(0, 5);
    const ret = p.reduce((acc, cur) => {
      const isDone = !!cur.punch_out_time;
      const startDate = new Date(cur.punch_in_time);
      const formattedStartDate = startDate.toLocaleString();

      if (isDone) {
        const endDate = new Date(cur.punch_out_time);
        const formattedEndDate = endDate.toLocaleString();
        acc.push({
          id: cur.punch_id + "-end",
          project_name: cur.project_name,
          time: formattedEndDate,
          color: "green",
          text: "下班",
        })
      }

      acc.push({
        id: cur.punch_id + "-start",
        project_name: cur.project_name,
        time: formattedStartDate,
        color: isDone? "blue" : "yellow",
        text: "上班",
      })

      return acc;
    }, []);
  return [true, ret];
  } catch (error) {
    console.log(error);

    if (error.response.status === 401 || error.response.status === 403) {
      cookies.remove("session_id");
      return [false, []];
    }

    return [true, []];
  }
}

const getAdminAllPunchs = async () => {
  const { cookies } = useCookies();
  try {
    const response = await apis.getAdminAllPunchs({ session_id: cookies.get("session_id") });
      return [true, response.data.punches];
  } catch (error) {
    console.log(error);
    return [false, []];
  }
}

const getAdminAllPunchsByDates = async ({user_id, start, end}) => {
  const { cookies } = useCookies();
  const payload = {
    session_id: cookies.get("session_id"),
    user_id,
    start,
    end,
  };
  try {
    const response = await apis.getAdminAllPunchs(payload);
    return [true, response.data.punches];
  } catch (error) {
    console.log(error);
    return [false, []];
  }
}

const adminCreatePunch = async (punch) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.adminCreatePunch({ session_id: cookies.get("session_id"), punch });
    return [true, response.data.msg];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const adminRecoverPunch = async (punch_id) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.adminRecoverPunch({ session_id: cookies.get("session_id"), punch_id });
    return [true, response.data.msg];
  } catch (error) {
    console.log(error);
    return [false, error.response.data.msg];
  }
}

const getActivePunch = async () => {
  const { cookies } = useCookies();
  try {
    const response = await apis.getActivePunch({ session_id: cookies.get("session_id") });
    return [true, response.data.punch];
  } catch (error) {
    return [false, error.response.data.msg];
  }
}

const updatePunch = async (punch_id, punch) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.updatePunch({ session_id: cookies.get("session_id"), punch_id, punch });
    return [true, response.data.msg];
  } catch (error) {
    return [false, error.response.data.msg];
  }
}

const deletePunch = async (punch_id) => {
  const { cookies } = useCookies();
  try {
    const response = await apis.deletePunch({ session_id: cookies.get("session_id"), punch_id });
    return [true, response.data.msg];
  } catch (error) {
    return [false, error.response.data.msg];
  }
}

export {
  userPunchIn,
  userPunchOut,
  getPunchs,
  getAdminAllPunchs,
  getAdminAllPunchsByDates,
  adminCreatePunch,
  adminRecoverPunch,
  getPunchsByDates,
  getActivePunch,
  updatePunch,
  deletePunch,
}