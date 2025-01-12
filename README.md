## Project Overview

This is a React.js application that displays a list of stores with sorting, filtering, and search functionalities. The app uses React js, React Router, and React-Query.



## Github Repo:
https://github.com/Merciful123/enacton



### Setting Up the Project

To set up the project locally, follow these steps:

1. Clone the repository and navigate to the project folder.
2. Run `npm install`.
3. Start the project using `npm run start`.
4. Access the React website at http://localhost:3000 and the API at http://localhost:3001.

### API Consumption

#### Store List API:
- **Get List of Stores**: Retrieve a list of stores. 
   Example: http://localhost:3001/stores

#### Category List API:
- **Get List of Categories**: Retrieve a list of categories. 
   Example: http://localhost:3001/categories

#### Store Filter:
- **cats**: Filter stores by category. 
   Example: http://localhost:3001/stores?cats=1

- **cashback_enabled**: Filter stores with cashback enabled. 
   Example: http://localhost:3001/stores?cashback_enabled=1

- **is_promoted**: Filter stores that are promoted. 
   Example: http://localhost:3001/stores?is_promoted=1

- **is_sharable**: Filter stores that allow sharing. 
   Example: http://localhost:3001/stores?is_sharable=1

- **status**: Filter stores by status (publish|draft|trash). 
   Example: http://localhost:3001/stores?status=draft

- **alphabet**: Filter stores by starting alphabet character. 
   Example: http://localhost:3001/stores?name_like=^a

- **multiple filters**: Filter stores using multiple criteria. 
   Example: http://localhost:3001/stores?name_like=^a&cashback_enabled=1&status=publish

#### Search:
- **store search by name**: Search stores by name. 
   Example: http://localhost:3001/stores?name_like=ali

#### Store Sort:
- **name**: Sort stores by name. 
   Example: http://localhost:3001/stores?_sort=name

- **featured**: Sort stores by featured status in descending order. 
   Example: http://localhost:3001/stores?_sort=featured&order=desc

- **popularity**: Sort stores by popularity based on clicks in descending order. 
   Example: http://localhost:3001/stores?_sort=clicks&_order=desc

- **cashback**: Sort stores by cashback amount. 
   Example: http://localhost:3001/stores?_sort=amount_type,cashback_amount&_order=asc,desc

#### Pagination:
- Paginate the results with page number and limit parameters. 
   Example: http://localhost:3001/stores?_page=1&_limit=20


- **Favourite Button heart icon**:  Clicking this button, user marks the store as a favourite.

- **Store Card Interaction**: Clicking on the store card user gets redirected to the store's home page.


