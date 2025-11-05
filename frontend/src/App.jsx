import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./screens/Home";
import { ResultPage } from "./screens/ResultPage";
import ChatOverlay from "./components/ChatOverlay";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<ResultPage />} />
        </Routes>
      </BrowserRouter>
      <ChatOverlay />
    </>
  );
}

export default App;
