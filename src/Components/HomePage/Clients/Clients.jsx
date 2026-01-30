import "./Clients.scss";
import { useState } from "react";
import client1 from "../../../assets/Clients/1.png";
import client2 from "../../../assets/Clients/2.png";
import client3 from "../../../assets/Clients/3.png";
import client4 from "../../../assets/Clients/4.png";
import client5 from "../../../assets/Clients/5.png";
import client6 from "../../../assets/Clients/6.png";
import client7 from "../../../assets/Clients/7.png";
import client8 from "../../../assets/Clients/8.png";

const clients = [
  { id: 1, logo: client1 },
  { id: 2, logo: client2 },
  { id: 3, logo: client3 },
  { id: 4, logo: client4 },
  { id: 5, logo: client5 },
  { id: 6, logo: client6 },
  { id: 7, logo: client7 },
  { id: 8, logo: client8 },
];

export default function Clients() {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate clients multiple times for seamless infinite loop
  const duplicatedClients = [...clients, ...clients, ...clients, ...clients];

  return (
    <section className="clients-section">
      <div className="clients-wrapper">
        {/* <h2 className="clients-title">We work with the best banks in the UAE.</h2> */}
        <div 
          className="clients-slider-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            className={`clients-slider ${isPaused ? 'paused' : ''}`}
          >
            {duplicatedClients.map((client, index) => (
              <div key={`${client.id}-${index}`} className="client-logo-wrapper">
                <img 
                  src={client.logo} 
                  alt={`Client ${client.id}`}
                  className="client-logo"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

