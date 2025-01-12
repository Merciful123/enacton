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

For more information, refer to the [JSON Server Documentation](https://github.com/typicode/json-server/tree/v0?tab=readme-ov-file).

### Requirements

1. **Project Setup**: Ensure the project is set up correctly according to the provided instructions.

2. **Sidebar Categories**: Display a list of available categories in the sidebar.

3. **Main Section**: Show a paginated list of stores in the main section, loading only the first page initially.

4. **Infinite Scroll**: Implement infinite scroll to load more stores dynamically as the user scrolls, similar to Instagram feeds.

5. **Category Filter**: Filter stores based on the selected category and highlight the selected category in the sidebar.

6. **Store Sorting**: Provide options to sort stores by name, featured, popularity, and cashback.

7. **Store Filters**: Allow filtering by category, status (active, coming soon, discontinued), alphabet, and boolean attributes such as cashback enabled, promoted, and share & earn enabled.

8. **Store Search**: Enable searching stores by name.

9. **Bookmark Stores**: Allow users to favorite stores, with the favorite status stored locally and indicated by a red heart icon in the UI.

10. **URL Parameters**: Store filter, search, and sort options in the URL parameters to replicate the user's browsing state when sharing URLs.

### Store Card Rendering


- **Cashback Display Logic**:
  - If `cashback_enabled` is `0`, display "No cashback available".
  - If `cashback_enabled` is `1`, construct the cashback string as follows:
    - Start with the `rate_type` attribute, which can be either "upto" or "flat".
    - Check the `amount_type`:
      - If it is "fixed", prefix the `cashback_amount` with "$".
      - If it is "percent", suffix the `cashback_amount` with "%".
    - Ensure the `cashback_amount` is formatted to two decimal places.

- **Favourite Button heart icon**:  Clicking this button, user marks the store as a favourite.

- **Store Card Interaction**: Clicking on the store card user gets redirected to the store's home page.


