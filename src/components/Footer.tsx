
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">MedicatieAI</h3>
            <p className="text-sm opacity-75">
              Revolutionaire AI-tool voor apothekers in Nederland. Voer snel en nauwkeurig medicatiebeoordelingen uit.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm opacity-75 hover:opacity-100">Home</Link></li>
              <li><Link to="/keuze" className="text-sm opacity-75 hover:opacity-100">Aan de slag</Link></li>
              <li><Link to="/pricing" className="text-sm opacity-75 hover:opacity-100">Prijzen</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm opacity-75">Email: info@medicatieai.nl</li>
              <li className="text-sm opacity-75">Telefoon: +31 20 123 4567</li>
              <li className="text-sm opacity-75">Adres: Apollolaan 123, Amsterdam</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-4 text-center text-sm opacity-75">
          <p>&copy; {new Date().getFullYear()} MedicatieAI. Alle rechten voorbehouden.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
