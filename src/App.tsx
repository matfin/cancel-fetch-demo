import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';

import Posts from './scenes/posts';
import Photos from './scenes/photos';
import Users from './scenes/users';

export const App = (): JSX.Element => (
  <Router>
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">
              Home
            </Link>
          </li>
          <li>
            <Link to="/users">
              Users
            </Link>
          </li>
          <li>
            <Link to="/photos">
              Photos
            </Link>
          </li>
        </ul>
      </nav>
    </header>
    <section>
      <Switch>
        <Route path="/" exact>
          <Posts />
        </Route>
        <Route path="/photos" exact>
          <Photos />
        </Route>
        <Route path="/users" exact>
          <Users />
        </Route>
      </Switch>
    </section>
  </Router>
);

export default App;

