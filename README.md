# Instagram Application using MERN Stack

Insta Clone is a secure social media web app. 
- It resembles Instagram and utilizes React, Node.js, and MongoDB. 
- React's component-based approach and hooks enable efficient state management and reusable UI elements.
- Redux ensures consistent state modifications, while Context management simplifies data sharing.
- The back-end, built with Node.js, handles user requests and interacts with MongoDB's document-oriented storage.
- In summary, Insta Clone replicates Instagram's core features using React, Node.js, MongoDB, Redux, and Context management.

# How to run the client and the server.

## Server startup
Get into the ./server directory and run:

- `$ npm i`
- (Make sure you have nodemon setup in your local machine. Nodemon helps for live refresh for the node server)
- `$ nodemon app.js`

## Client startup
Get into the ./server/client directory and run:

- `$ npm i`
- `$ npm start`

# Backend and Authentication

(Auth.js)
- The backend code represents an Express router that handles various authentication-related routes for a web application. It provides endpoints for user signup (/signup) and user signin (/signin). In the signup route, it checks if the provided email already exists in the database, hashes the password, creates a new user object, saves it to the MongoDB, and sends a welcome email using Nodemailer. In the signin route, it verifies the user's credentials, compares the hashed password, generates a JWT token upon successful authentication, and returns the token along with user information. The code also includes the necessary dependencies, middleware, and email configuration for these functionalities.

(Middleware - requireLogin.js)
- This code exports a middleware function that is used to authenticate user requests by verifying the JSON Web Token (JWT) included in the request header. The middleware extracts the token from the authorization header, verifies it using the secret key stored in the JWT_KEY, and then retrieves the user data associated with the token's payload. If the token is valid, the user data is attached to the req object, and the middleware calls the next() function to pass control to the next middleware or route handler. If the token is invalid or missing, an error response is sent back to the client.

(Post.js)
- This code defines an Express router that handles various routes related to posts in a social media application. It includes routes for fetching all posts (/allpost), fetching posts from users the current user follows (/followedposts), creating a new post (/createpost), fetching posts created by the current user (/mypost), updating likes and dislikes on a post (/like and /dislike), adding comments to a post (/comment), and deleting a post (/deletepost/:postId). These routes use the requireLogin middleware to ensure that the user is authenticated before accessing the functionalities. The code interacts with the MongoDB database using the Mongoose library to perform database operations such as querying, saving, updating, and deleting posts.

(User.js)
- This code defines an Express router that handles routes related to user profiles and interactions. It includes routes for fetching user profiles and their associated posts (/user/:id), following and unfollowing users (/follow and /unfollow), updating user profile pictures (/updatepic), and searching for users based on email (/searchUser). 

# Client Side
  
## Signin Screen
### Client Side - 
- It uses React Router for navigation and Materialize CSS for styling. If the login is successful, it saves the received JWT token and user data in local storage, updates the user context using the dispatch function, displays a success message, and redirects the user to the home page.
  
<img width="1440" alt="Login Screen" src="https://github.com/Aashay12/Instagram_/assets/32494313/eb45a78a-3564-4b63-845a-b56ceb24dfa9">

## Signup Screen

- When the user clicks the signup button, it checks the validity of the entered name, email, and password. If the image field is filled, it uploads the profile picture to a cloud storage service (Cloudinary) and retrieves the image URL. If the server returns an error, it displays the error message. If the signup is successful, it displays a success message and redirects the user to the signin page.

<img width="1440" alt="Signup Screen" src="https://github.com/Aashay12/Instagram_/assets/32494313/ecbc1aa0-c07d-4f08-bffe-aeda7e6cae85">


## Upload Post
<img width="1440" alt="Screenshot 2023-06-14 at 10 27 48 PM" src="https://github.com/Aashay12/Instagram_/assets/32494313/779ece1d-80f9-4e9d-98d6-034876ec0bb0">

## Home Screen (Feed)

### Client Side - 

It displays the posts along with their respective details like the user who posted it, the number of likes, comments, etc. Users can like or dislike a post, add comments, and delete their own posts. The state is managed using the useState hook, and the user context is accessed through the UserContext from the App.js file.

<img width="1440" alt="Screenshot 2023-06-14 at 10 27 15 PM" src="https://github.com/Aashay12/Instagram_/assets/32494313/73cb1c0c-518d-4999-b3cb-15d41f6a0695">

## My Profile

### Client Side - 

- This code represents the Profile page component in a React application. It fetches the user's posts data from the server using the useEffect hook and displays them in a gallery format.

<img width="1440" alt="Screenshot 2023-06-14 at 10 27 27 PM" src="https://github.com/Aashay12/Instagram_/assets/32494313/d6701e56-7c46-4764-b53b-06660478e03e">

## Search User by Id

<img width="1440" alt="Screenshot 2023-06-14 at 10 28 09 PM" src="https://github.com/Aashay12/Instagram_/assets/32494313/50d69c5e-4f34-4c8d-8e1c-54ce08540ac1">

