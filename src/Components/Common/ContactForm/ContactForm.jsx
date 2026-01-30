import { useState } from "react";
import { TextField, MenuItem } from '@mui/material';
import { useNavigate } from "react-router-dom";
import "./ContactForm.scss";
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css";
import { sendContactFormEmail } from "../../../Utils/emailService";

export default function ContactForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: '',
        service: '',
        configuration: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const errors = {};

    const validateErrors = () => {
        if (formData?.name?.trim()?.length === 0) errors.name = "Name is Required";
        if (formData?.phone?.trim()?.length === 0) errors.phone = "Phone No is Required";
        if (formData?.email?.trim()?.length === 0) errors.email = "Email is Required";
        // if (formData?.service?.trim()?.length === 0) errors.service = "Please select a service";
        if (formData?.message?.trim()?.length === 0) errors.message = "Message is Required";
    };

    const handleUpdate = (field) => (event) => {
        const inputValue = event.target.value;
        setFormData((prev) => ({ ...prev, [field]: inputValue }));
    };

    const handleSendEmail = async (formData) => {
        try {
            setIsLoading(true);
            setResponse("");
            const result = await sendContactFormEmail(formData);
            if (result.success) {
                setResponse("Email sent successfully!");
                setFormData({
                    name: "",
                    phone: "",
                    email: "",
                    message: "",
                    service: "",
                    configuration: "",
                });
                setFormErrors({});
                // Navigate to thank-you page after 3 seconds
                setTimeout(() => {
                    navigate("/thank-you");
                }, 3000);
            } else {
                setResponse("Failed to send email. Please try again.");
            }
        } catch (error) {
            console.error("Email sending error:", error);
            setResponse("Failed to send email. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        validateErrors();

        if (Object.keys(errors).length === 0) {
            handleSendEmail(formData);
        } else {
            console.log(errors);
            setFormErrors(errors);
        }
    };

    return (
        <section id="contact-us">
            <div className="contact-form-section">
                {/* <img className="bg-img" src={bg} alt="" />
                <div className="overlay"></div> */}
                <div className="contact-content section-container">
                    <div className="contact-info">
                        <h1 className="main-title">Start Your Digital<br />Marketing Journey</h1>
                        <p className="description">
                            Let's discuss how we can maximize your online potential with targeted digital marketing strategies tailored to your business needs.
                        </p>

                        <div className="key-points">
                            <div className="point">
                                <div className="point-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div className="point-text">
                                    <h4>Strategic Approach</h4>
                                    <p>Tailored digital marketing strategies designed to break through your limitations and boost your potential.</p>
                                </div>
                            </div>

                            <div className="point">
                                <div className="point-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div className="point-text">
                                    <h4>Performance Optimization</h4>
                                    <p>Real-time monitoring and adjustments to optimize results and maximize your ROI.</p>
                                </div>
                            </div>

                            <div className="point">
                                <div className="point-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <div className="point-text">
                                    <h4>Expert Team</h4>
                                    <p>Trusted resource for digital, brand, media, direct marketing, strategy and event marketing.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="contact-form">
                        <h1 className="title">Get Started Today<br/> Contact Us Now!</h1>
                        {/* <p className="form-description">Fill out the form below and our mortgage experts will contact you within 24 hours to discuss your mortgage needs.</p> */}

                        <TextField label="Name" variant="outlined" value={formData.name} onChange={handleUpdate('name')} fullWidth className="form-field" required />
                        {formErrors.name && <div className="error-message">{formErrors.name}</div>}
                        
                        <PhoneInput
                            country={"ae"}
                            value={formData.phone}
                            onChange={(phone) => {
                                setFormData((prev) => ({ ...prev, phone })); // save full phone like +971xxxxxxxxx
                            }}
                            inputProps={{
                                name: "phone",
                                required: true,
                            }}
                            // ---- STYLES TO MATCH MUI TEXTFIELD ----
                            inputStyle={{
                                width: "100%",
                                height: "56px", // same as MUI default height
                                borderRadius: "20px",
                                border: "1px solid #e0e0e0",
                                backgroundColor: "#f9f9f9",
                                color: "#1a1a1a",
                                paddingLeft: "50px", // space for flag dropdown
                                fontSize: "16px",
                            }}
                            buttonStyle={{
                                border: "none",
                                backgroundColor: "#f9f9f9",
                                borderRight: "1px solid #e0e0e0",
                                borderRadius: "20px 0 0 20px",
                            }}
                            containerStyle={{
                                width: "100%",
                            }}
                            dropdownStyle={{
                                backgroundColor: "black", // dropdown background
                                color: "white", // text color
                                borderRadius: "10px",
                                border: "1px solid rgba(255,255,255,0.2)",
                            }}
                            searchStyle={{
                                backgroundColor: "black",
                                color: "white",
                                border: "1px solid rgba(255,255,255,0.2)",
                            }}
                        />

                        {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}

                        <TextField label="Email" variant="outlined" value={formData.email} onChange={handleUpdate('email')} fullWidth className="form-field" required />
                        {formErrors.email && <div className="error-message">{formErrors.email}</div>}

                        <TextField 
                            select 
                            label="Service Type" 
                            variant="outlined" 
                            value={formData.service} 
                            onChange={handleUpdate('service')} 
                            fullWidth 
                            className="form-field"
                        >
                            <MenuItem value="SEO & Content">SEO & Content</MenuItem>
                            <MenuItem value="PPC & SEM">PPC & SEM</MenuItem>
                            <MenuItem value="Programmatic Ads">Programmatic Ads</MenuItem>
                            <MenuItem value="Social Media Marketing">Social Media Marketing</MenuItem>
                            <MenuItem value="Media Production">Media Production</MenuItem>
                            <MenuItem value="Website Development">Website Development</MenuItem>
                        </TextField>
                        {formErrors.service && <div className="error-message">{formErrors.service}</div>}

                        <TextField label="Message" variant="outlined" multiline rows={4} value={formData.message} onChange={handleUpdate('message')} fullWidth className="form-field" required />
                        {formErrors.message && <div className="error-message">{formErrors.message}</div>}

                        <button type="submit" className="btn btn-glass" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Submit Inquiry"}
                        </button>
                        {response && (
                            <div className={`response-message ${response.includes("successfully") ? "success" : "error"}`}>
                                {response}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
}
