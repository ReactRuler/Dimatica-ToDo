import LogoImg from "../assets/Dimatica-logo.webp";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <a
      href="https://www.dimaticasoftware.com/en/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={LogoImg} alt="Dimatica Logo" className="w-100 h-auto" />
    </a>
  );
}

export default Logo;
