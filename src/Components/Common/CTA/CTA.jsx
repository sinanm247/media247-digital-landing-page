import "./CTA.scss";

export default function CTA({ title, paragraphs, buttonText = "Get Pricing & Payment Plan", buttonLink = "#contact-us", backgroundImage }) {
    return (
        <section id="cta-section" className="common-cta-section section-container">
            {/* Background Image */}
            {backgroundImage && (
                <img className="cta-bg-image" src={backgroundImage} alt="CTA Background" />
            )}
            
            {/* Overlay */}
            <div className="cta-overlay"></div>

            <div className="cta-content">
                    <h2 className="cta-title">{title}</h2>
                    
                    <div className="cta-description">
                        {paragraphs.map((paragraph, index) => (
                            <p 
                                key={index} 
                                className="cta-paragraph" 
                                dangerouslySetInnerHTML={{ __html: paragraph }}
                            ></p>
                        ))}
                    </div>

                    <a href={buttonLink} className="btn btn-glass">
                        {buttonText}
                    </a>
            </div>
        </section>
    );
}

