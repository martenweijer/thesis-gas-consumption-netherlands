import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { MapView } from "./pages/MapView";
import { MunicipalityDetail } from "./pages/MunicipalityDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/municipality/:slug" element={<MunicipalityDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
