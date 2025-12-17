import { Route, Routes } from "react-router";
import About from "./pages/About/About";
import Home from "./pages/Home/Home";
import Layout from "./Layout/MainLayout";
import Favorites from "./pages/Favorites/Favorites";
import Group from "./pages/Group/Group";
import Notes from "./pages/Notes/Notes";
import AISummary from "./pages/AISummary/AISummary";

export function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/chat" element={<Layout />}>
        <Route path="favorites" element={<Favorites />} />
        <Route path="groups" element={<Group />} />
        <Route path="notes" element={<Notes />} />
        <Route path="ai-summary" element={<AISummary />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}

export default App;
