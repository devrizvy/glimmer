import { Route, Routes } from "react-router";
import About from "./pages/About/About";
import Home from "./pages/Home/Home";
import { AppSidebar } from "./components/app-sidebar";

export function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route  path="/chat" element={<AppSidebar />} />
      <Route path="about" element={<About />} />
        
    </Routes>
  );
}

export default App;
