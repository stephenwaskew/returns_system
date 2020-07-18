import axios from "axios";

const baseURL = "http://localhost:5000";

// pass the frontendID and currentdate to the backend at localhost:5000.
// based on this we can tell if the product will be eligible for return.
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
