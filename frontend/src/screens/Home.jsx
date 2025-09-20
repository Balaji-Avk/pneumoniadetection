import { ImgForm } from "../components/imgForm";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ChatOverlay from "../components/ChatOverlay";
import { v4 as uuidv4 } from "uuid";
import { useEffect } from "react";

export function Home() {
  
  useEffect(() => {
    let existingId = sessionStorage.getItem("session_id");
    if (!existingId) {
      existingId = uuidv4();
      sessionStorage.setItem("session_id", existingId);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <Hero />
      <ImgForm />
      <ChatOverlay />
    </div>
  );
}
