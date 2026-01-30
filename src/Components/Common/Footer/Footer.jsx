import logo from "../../../assets/Logo/m247-digital-logo-white.png"
import { useLocation } from "react-router-dom";
import "./Footer.scss"

import { FaFacebook, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri"
import { navLinks } from "../../../Utils/App.util";

export default function Footer() {
    const location = useLocation();
    const currentYear = new Date().getFullYear();

    const handleNavClick = (e, path) => {
        if (path.startsWith("#")) {
            e.preventDefault();
            const element = document.querySelector(path);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    const formatLinkText = (text) => {
        // Convert "ABOUT US" to "About Us", "CONTACT US" to "Contact Us", etc.
        return text.toLowerCase().split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const services = [
        "SEO & Content",
        "PPC & SEM",
        "Programmatic Ads",
        "Social Media Marketing",
        "Media Production",
        "Website Development"
    ];

    const whyChooseUs = [
        "Our Vision",
        "Our Mission",
        "Targeted Strategies",
        "Performance Optimization",
        "Creative Excellence",
        "Data-Driven Results"
    ];

    return (
        <footer className="footer">
            <div className="footer_row">
                {/* Column 1: Logo and Description */}
                <div className="footer_col contact_us_col">
                    <div className="contact_content">
                        <img src={logo} className="company_logo" alt="Media247 Digital" />
                        <div className="contact_details_group">
                            <p className="description">
                                Media247 Digital is a leading digital marketing agency specializing in creating targeted and effective social, google & programmatic advertising as well as social media strategy & content creation to help businesses reach their maximum online potential.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div className="footer_col">
                    <h2 className="head">Quick Links</h2>
                    <ul>
                        {navLinks.map((link) => (
                            <li key={link.id}>
                                <a
                                    href={link.path}
                                    onClick={(e) => handleNavClick(e, link.path)}
                                    className="footer-link"
                                >
                                    {formatLinkText(link.name)}
                                </a>
                            </li>
                        ))}
                        <li>
                            <a
                                href="#why-choose-us"
                                onClick={(e) => handleNavClick(e, "#why-choose-us")}
                                className="footer-link"
                            >
                                Our Values
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Column 3: Our Services */}
                <div className="footer_col">
                    <h2 className="head">Our Services</h2>
                    <ul>
                        {services.map((service, index) => (
                            <li key={index}>{service}</li>
                        ))}
                    </ul>
                </div>

                {/* Column 4: Why Choose Us */}
                <div className="footer_col">
                    <h2 className="head">Why Choose Us</h2>
                    <ul>
                        {whyChooseUs.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>

            </div>

            {/* Disclaimer Section */}
            <div className="footer_disclaimer">
                <p>
                    Media247 Digital is a leading force in marketing for all businesses. Our marketing expertise makes us a trusted resource for digital, brand, media, direct marketing, strategy and event marketing, among clients looking to expand and evolve their marketing.
                </p>
            </div>

            {/* Bottom Footer Section */}
            <div className="bottom_footer">
                <div className="left_section">
                    <a href="#" className="footer-legal-link">Privacy Policy</a>
                    <span className="separator">|</span>
                    <a href="#" className="footer-legal-link">Terms & Conditions</a>
                </div>
                <div className="social_links">
                    <a href="#"><FaFacebook /></a>
                    <a href="#"><RiInstagramFill /></a>
                    <a href="#"><FaYoutube /></a>
                    <a href="#"><FaLinkedin /></a>
                    <a href="#"><FaTiktok /></a>
                </div>
                <div className="right_section">
                    <p>© {currentYear}. All Rights Reserved by Media247 Digital.</p>
                </div>
            </div>
        </footer>
    );
}