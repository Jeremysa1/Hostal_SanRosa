import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { COPYRIGHT, REDES_SOCIALES } from '../../data/hostal';
import './Footer.css';

const REDES = [
  { url: REDES_SOCIALES.instagram, nombre: 'Instagram', Icono: FaInstagram },
  { url: REDES_SOCIALES.whatsapp, nombre: 'WhatsApp', Icono: FaWhatsapp },
  { url: REDES_SOCIALES.facebook, nombre: 'Facebook', Icono: FaFacebook },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="copyright-text">{COPYRIGHT}</p>
        <div className="social-icons">
          {REDES.map(({ url, nombre, Icono }) => (
            <a key={nombre} href={url} target="_blank" rel="noopener noreferrer" aria-label={nombre}>
              <Icono />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
