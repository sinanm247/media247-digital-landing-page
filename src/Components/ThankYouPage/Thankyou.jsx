import React, { useEffect } from "react";
import "./ThankYou.css";

import Helmet from "../../General/Helmet";
import banner1 from "../../assets/Banners/Banner-1.webp";

export default function Thankyou() {    
    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Helmet title="Indeed Mortgage Broker | Thank You" />
            <div className="thankyou-hero">
                <div className="overlay"></div>
                <div className="banner-container">
                    <img
                        className="banner-image active"
                        src={banner1}
                        alt="Thank You Banner"
                    />
                </div>
                
                {/* Content Text - Left Bottom */}
                <div className="hero-content-left">
                    <h1 className="content-title">THANK YOU</h1>
                    <p className="content-description">We'll get back to you soon</p>
                    <a href="/">
                        <button className="btn btn-glass content-button">
                            Back To Home
                        </button>
                    </a>
                </div>
            </div>
        </>
    );
} 