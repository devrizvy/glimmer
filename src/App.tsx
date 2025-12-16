import { Route, Routes } from "react-router";
import About from "./pages/About/About";
import Home from "./pages/Home/Home";

export function App() {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="about" element={<About />} />
        
    </Routes>
  );
}

export default App;
