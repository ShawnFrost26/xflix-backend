
import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import VideoGallery from "./components/VideoGallery";
import VideoDetailsCard from "./components/VideoDetailsCard";

export const config = {
  endpoint: `https://336c6731-e4d0-48b7-9be5-28dcc32675ff.mock.pstmn.io/v1`,
};

function App() {

  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={VideoGallery}/>
        <Route exact path="/video/:id" component={VideoDetailsCard}/>
      </Switch>
    </div>
  );
}

export default App;