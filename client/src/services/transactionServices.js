import axios from "axios";

const baseURL = "http://localhost:5000";

// pass transactions and currentDate to the backend to determine if return is valid.
const getReturns = async (transactions, currentDate) => {
  const response = await axios.get(baseURL, {
    params: {
      frontendID: transactions,
      currentDate: currentDate,
    },
  });

  return response;
};

export default { getReturns };
