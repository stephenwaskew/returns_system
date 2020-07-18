const express = require("express");
const path = require("path");
const db = require("./database/db");
const cors = require("cors");
const http = require("http");
const app = express();
app.use(express.json());

// const app = express();
const db_json = require("./database/db.json");
// use cors to get rid of access control origin error
app.use(cors());

// function checks if transaciton occured in the last 30 days
function lessThanThirtyDays(dateOne, dateTwo) {
  return (
    30 >
    Math.floor(Math.abs(new Date(dateOne) - new Date(dateTwo)) / 1000 / 86400)
  );
}

// function checks if the products purchased were on sale
function isNotOnSale(currentTransactions) {
  return currentTransactions.prods.filter((product) => product.onsale !== true);
}

// function checks if items were returnable
function isReturnableProduct(notOnSaleProducts) {
  return notOnSaleProducts
    .map((product) => db.findProduct(product.id))
    .filter((canReturn) => canReturn.returnable === true);
}

app.get("/", (request, response) => {
  const id = Number(request.query.frontendID);
  const timeStampOne = request.query.currentDate;
  const currentTransactions = db.findTransaction(id);
  const timeStampTwo = currentTransactions.transaction_date;

  const withinThirtyDays = lessThanThirtyDays(
    timeStampOne.replace(" +04:00", "Z"),
    timeStampTwo.replace(" +04:00", "Z")
  );
  if (withinThirtyDays) {
    const notOnSaleProducts = isNotOnSale(currentTransactions);
    if (notOnSaleProducts.length === 0) {
      return response.status(202).send(currentTransactions);
    }
    const returnableProducts = isReturnableProduct(notOnSaleProducts);
    return response.status(200).send(returnableProducts);
  }

  response.status(202).send(currentTransactions);
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log("App is listening on port " + port);
