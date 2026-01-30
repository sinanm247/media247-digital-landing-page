import "./HomeHero.scss";
import { useState } from "react";
import { TextField, MenuItem } from '@mui/material';
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { sendContactFormEmail } from "../../../Utils/emailService";
import bannerImage from "../../../assets/Banners/Banner-2.webp"

export default function HomeHero() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    service: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const errors = {};

  const validateErrors = () => {
    if (formData?.name?.trim()?.length === 0) errors.name = "Name is Required";
    if (formData?.phone?.trim()?.length === 0) errors.phone = "Phone No is Required";
    if (formData?.email?.trim()?.length === 0) errors.email = "Email is Required";
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
    <div className="home-hero">
      <div className="overlay"></div>
      <div className="banner-container">
        <img
          className="banner-image"
          src={bannerImage}
          alt="Media247 Digital"
        />
      </div>
      
      <div className="hero-content-wrapper">
        {/* Left Side - Content */}
        <div className="hero-content-left">
          <div className="hero-content">
            <h2 className="hero-subtitle">Media247 Digital</h2>
            <h1 className="hero-title">
              Maximizing Your Online Potential
            </h1>
            {/* <p className="hero-description">
              Our digital marketing agency specializes in creating targeted and effective social, google & programmatic advertising as well as social media strategy & content creation to help our clients reach their maximum online potential.
            </p> */}
            <a href="#about-us" className="btn btn-glass hero-cta-btn">
              Learn More About Us
            </a>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="hero-content-right">
          <form onSubmit={handleSubmit} className="contact-form">
            <h1 className="title">Start Your Digital<br />Marketing Journey</h1>
            <p className="form-description">Fill out the form below and our digital marketing experts will contact you within 24 hours to discuss how we can maximize your online potential.</p>

            <TextField label="Name" variant="outlined" value={formData.name} onChange={handleUpdate('name')} fullWidth className="form-field" required />
            {formErrors.name && <div className="error-message">{formErrors.name}</div>}
            
            <PhoneInput
              country={"ae"}
              value={formData.phone}
              onChange={(phone) => {
                setFormData((prev) => ({ ...prev, phone }));
              }}
              inputProps={{
                name: "phone",
                required: true,
              }}
              inputStyle={{
                width: "100%",
                height: "56px",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backgroundColor: "transparent",
                color: "white",
                paddingLeft: "50px",
                fontSize: "16px",
                fontFamily: '"GT-Ultra", sans-serif',
              }}
              buttonStyle={{
                border: "none",
                backgroundColor: "transparent",
                borderRight: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "20px 0 0 20px",
              }}
              containerStyle={{
                width: "100%",
              }}
              dropdownStyle={{
                backgroundColor: "black",
                color: "white",
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
    </div>
  );
}