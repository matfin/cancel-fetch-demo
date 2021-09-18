type Endpoints = {
  [index: string]: string
}

const endpoints: Endpoints = {
  posts: `https://jsonplaceholder.typicode.com/posts`,
  photos: `https://jsonplaceholder.typicode.com/photos`,
  users: `https://jsonplaceholder.typicode.com/users`,
};

export default endpoints;
