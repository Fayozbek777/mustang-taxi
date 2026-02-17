import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./App.css";
import "./i18n"; // Убедитесь, что i18n инициализируется

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Scooters from "./pages/Scooters";
import Drongo from "./pages/Drongo";
import Bags from "./pages/Bags";
import Velo from "./pages/Velo"; // Файл лежит в src/pages/Velo.jsx

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out",
    });
  }, []);

  return (
    <Router>
      <div className="app-wrapper">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scooters" element={<Scooters />} />
            <Route path="/drongo" element={<Drongo />} />
            <Route path="/bags" element={<Bags />} />
            <Route path="/velo" element={<Velo />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
