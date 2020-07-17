import axios from "axios";

const baseURL = "http://localhost:5000";

const getReturns = async (transactions, currentDate) => {
  const response = await axios.get(baseURL, {
    params: {
      frontendID: transactions.transactionID,
      currentDate: currentDate,
    },
  });

  return response;
};

export default { getReturns };
