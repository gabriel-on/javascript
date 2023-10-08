import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/Header";
import { Feed } from "./pages/Feed";
import { Router } from "./Router";

import './style.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <div className="app">
          <Router/>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
