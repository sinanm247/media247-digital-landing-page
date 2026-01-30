import "./AboutUsSection.scss";
import img1 from "../../../assets/Banners/Banner-3.webp";

const AboutUsSection = () => {
    return (
        <section id="about-us" className="about-us-section section-container">
            <div className="about-us-wrapper">
                {/* Image - Left Side */}
                <div className="about-image">
                    <img src={img1} alt="Media247 Digital" />
                </div>

                {/* Content - Right Side */}
                <div className="about-content">
                    <h2 className="section-tagline">About Us</h2>
                    <h1 className="section-title">
                        We Are a Digital<br/> Marketing Agency
                    </h1>
                    <div className="content-wrapper">
                        <p className="section-description">
                            Our digital marketing agency specializes in creating targeted and effective social, google & programmatic advertising as well as social media strategy & content creation to help our clients reach their maximum online potential.
                        </p>
                        <p className="section-description">
                            Our ultimate mission and drive, is to compose and conduct groundbreaking digital marketing strategies in order to break through your limitations as a company and boost your potential, minimize your risk of failing and in the end increase your turn over.
                        </p>
                        <p className="section-description">
                            Media247 Digital will be a leading force in marketing for all businesses. Our marketing expertise makes us a trusted resource for digital, brand, media, direct marketing, strategy and event marketing, among clients looking to expand and evolve their marketing.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUsSection;
