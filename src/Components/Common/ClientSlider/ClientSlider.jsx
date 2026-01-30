import "./ClientSlider.scss";
import clientImage from "../../../assets/Clients/image-1.png";

export default function ClientSlider() {
    // Create array of duplicated images for seamless infinite scrolling
    // We duplicate them multiple times to ensure smooth infinite loop
    const clientImages = Array(20).fill(clientImage);

    return (
        <section className="client-slider-section">
            <div className="client-slider-wrapper">
                <div className="client-slider-track" onMouseEnter={(e) => e.currentTarget.classList.add('paused')} onMouseLeave={(e) => e.currentTarget.classList.remove('paused')}>
                    {clientImages.map((image, index) => (
                        <div key={index} className="client-image-wrapper">
                            <img 
                                src={image} 
                                alt={`Client ${index + 1}`}
                                className="client-image"
                            />
                        </div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {clientImages.map((image, index) => (
                        <div key={`duplicate-${index}`} className="client-image-wrapper">
                            <img 
                                src={image} 
                                alt={`Client ${index + 1}`}
                                className="client-image"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

