import { FaWhatsapp } from "react-icons/fa";
import "./ServiceTypes.scss"
import { TiPlus } from "react-icons/ti";

const serviceTypes = [
    {
        id: 1,
        name: "SEO & Content",
        description: "Boost your search rankings with optimized content and strategic SEO that drives organic traffic.",
    },
    {
        id: 2,
        name: "PPC & SEM",
        description: "Maximize ROI with targeted paid campaigns on Google and other search platforms.",
    },
    {
        id: 3,
        name: "Programmatic Ads",
        description: "Reach your audience at scale with automated, data-driven advertising across multiple channels.",
    },
    {
        id: 4,
        name: "Social Media Marketing",
        description: "Engage and grow your audience with strategic social media campaigns and compelling content.",
    },
    {
        id: 5,
        name: "Media Production",
        description: "Create stunning visuals, videos, and multimedia content that captivates your audience.",
    },
    {
        id: 6,
        name: "Website Development",
        description: "Build responsive, high-performing websites that convert visitors into customers.",
    },
];

export default function ServiceTypes() {
    return (
        <section id="service-types">
            <div className="common-service-section section-container">
                <div className="service-header">
                    <h2 className="section-tagline">Services</h2>
                    <h1 className="section-title">Digital Marketing Services in Dubai</h1>
                    <p className="section-description">
                        Our digital marketing agency specializes in creating targeted and effective social, google & programmatic advertising as well as social media strategy & content creation to help our clients reach their maximum online potential.
                    </p>
                </div>
                <div className="website-service-grid">
                    {serviceTypes.map((ele) => {
                        return (
                            <div key={ele.id} className="webiste-service-card">
                                <h3 className="service-title">{ele.name}</h3>
                                <p dangerouslySetInnerHTML={{ __html: ele.description }} className="service-description"></p>
                                {/* <div className="icon"><TiPlus/></div> */}
                                <a href="https://api.whatsapp.com/send/?phone=971558739884&text&type=phone_number&app_absent=0"><div  className="icon">
                                    <FaWhatsapp />
                                </div></a>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}