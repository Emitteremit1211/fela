
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";

import Home from "./pages/Home";
import Exhibition from "./pages/Exhibition";
import Gallery from "./pages/Gallery";
import Visit from "./pages/Visit";
import WhatsOn from "./pages/WhatsOn";
import Credits from "./pages/Credits";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exhibition" element={<Exhibition />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/visit" element={<Visit />} />
          <Route path="/whats-on" element={<WhatsOn />} />
          <Route path="/credits" element={<Credits />} />
        </Routes>
      </main>

      <Footer />

      <WhatsAppButton />
    </BrowserRouter>
  );
}
