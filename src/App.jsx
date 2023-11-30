import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import Flipbook from "../src/Flipbook/Flipbook";
import BookMatch from "../src/Book/BookMatch";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path={"/"} element={<Flipbook />} />
            <Route path={"/bookmatch"} element={<BookMatch />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
