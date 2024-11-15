import axios from "axios";

export const formatDate = (dateInput) => {
  const date = new Date(dateInput);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const getKey = async () => {
  const res = await axios.get("http://joieplace.live/get-secretkey");
  return res.data;
};

export default getKey;
