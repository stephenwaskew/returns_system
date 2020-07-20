# Starting
```
Go to: /flindeltest/task1/fldlinterviewtest-master 
Run: npm install
Run: npm run start
```
```
Go to: /flindeltest/task1/fldlinterviewtest-master/client
Run: npm install
Run: npm run start
```

Then go to localhost:3000 and enter a product id.

# Part One
## NPM Packages Added
- nodemon for auto reload of backend and cors to allow for cross origin api calls between the front and backend
- little-state-machine for state control. 
- material-ui-icons for use of different icons
- material ui and styled components for styling
- react-hooks-forms for form
- axios for api calls with backend
- react-router-dom for routing
- moved getCurrentDate function to returns table
- add react-table for displaying returns as table
- To deal with different company policies I adjusted the db.json like so in the products array:
  ``` 
  {
      "id": 0,
      "returnable": true,
      "company": [
        {
          "companyName": "AAA",
          "allowsReturns": "Yes"
        }
      ]
    } 
  ```
- now each company can state if they allowReturns (or whatever policy) and the row is highlighted (green if allowed and red if not)



## Overview

Currently this app allow user to enter a transaction id, but will not do anything.

**Task**: You need to display all the products in the transaction that are eligible for return.

Product are eligible to return if

- purchased for less than 30 days
- not on sale when purchased
- is a returnable product

### Important notes

- Explain your assumptions, decisions, code in detail to help us better understand your code
- You can add npm if you want, but please explain why
- You can use the `db` interface which provide the functions (`findTransaction(id)` and `findProduct(id)`) to access the dummy database for this excerise.
- To get the date for "today", use `getCurrentDate()` in `App.js`
- Explain why if you modify any existing code, e.g. `db` functions, the database...etc
- It is important to think about scalability, e.g. how to make your code easy to maintain and add new feature?

Absolutely feel free to make the app better, although it is not neccessary to do more than the task, doing so can help us see your skill with more confidence! The following are a few suggestions but don't let that stop your imagination :)

- Better UI
- Better hierarchy and code design
- Add new/extend features, e.g. what if different company have different policy?

## Run app for testing

1. Start backend by `npm install` and `npm start`
2. Start frontend by go to `client` then `npm install` and `npm start`
3. Go to your browser and type `localhost:3000`, now you can test your work under this domain


## Part Two


Design a database for a product return application. The application will contain many different stores, each store will have different return policy and product, but all of them require the customer to fill out a return form, which may be slightly different in every store. Your database will need to keep track of all these data, and expected to sufficiently perform the following operations:
- Notify the store about their approved return order so they can refund their customer
- Notify the customer about the status of their return order
- Display the information of a return order for approval process
You can use any type of database, such as SQL and NoSQL. Something good to consider when you design your database would be future scaling and additional operations by new features. Please provide an explanation for each of your decisions.

Note: You do not need to write any code, simply lay down the structure of your database. Write down all your assumptions. If you have any questions, you can make an assumption and write it down.

# Part 2
- for part two I placed my data model in the images directory. I followed a NoSQL approach for my design.
![Data Model](/images/data.png)
