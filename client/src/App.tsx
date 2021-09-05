import { Helmet } from 'react-helmet';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import TextEditor from './components/TextEditor';
import { v4 as uuidv4 } from "uuid";

function App() {

  return (
    <>
      <Helmet>
        <title>Google Docs Clone</title>
      </Helmet>
      <BrowserRouter>
        <Switch>
          <Route exact path='/'>
            <Redirect to={`/documents/${uuidv4()}`}/>
          </Route>
          <Route path='/documents/:id'>
            <TextEditor />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
