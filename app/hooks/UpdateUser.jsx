import axios from "axios";

export const updateUser = async (username) => {
  const url = "http://localhost:3001/user";
  const headers = {
    auth_token: "LASDLkoasnkdnawndkansjNKJFNKJANSKN",
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