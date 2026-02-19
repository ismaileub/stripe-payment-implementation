import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import CheckoutPage from "./components/CheckoutPage";
import FailedPage from "./components/FailedPage";
import SuccessPage from "./components/SuccessPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CheckoutPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/failed" element={<FailedPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
