import axios from "axios";

export const updateUser = async (username) => {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${process.env.NEXT_PUBLIC_API_USER}`;
  const headers = {
    auth_token: process.env.NEXT_PUBLIC_API_AUTH_TOKEN,
  };
  const data = {
    username,
  };
  try {
    await axios.put(url, data, {
      headers,
      withCredentials: true,
    });
    return { success: true, message: "Username updated" };
  } catch (error) {
    if (error.response && error.response.data) {
      console.error(error.response.data["message"]);
      if (error.response.data["code"].startsWith("ERR")) {
        return { success: false, message: error.response.data["message"] };
      }
    }
  }
};