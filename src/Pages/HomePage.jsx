import { Fragment } from "react";
import Helmet from "../General/Helmet";
import HomeHero from "../Components/HomePage/HomeHero/HomeHero";
import GrowthSection from "../Components/HomePage/GrowthSection/GrowthSection";
import Clients from "../Components/HomePage/Clients/Clients";
import ContactForm from "../Components/Common/ContactForm/ContactForm";
import AboutUsSection from "../Components/HomePage/AboutUsSection/AboutUsSection";
import Services from "../Components/HomePage/Services/Services";
import Stats from "../Components/Common/Stats/Stats";
import Process from "../Components/HomePage/Process/Process";
import CTA from "../Components/Common/CTA/CTA";
import WhyChooseUs from "../Components/HomePage/WhyChooseUs/WhyChooseUs";
import ServiceTypes from "../Components/Common/ServiceTypes/ServiceTypes";
import CaseStudy from "../Components/Common/CaseStudy/CaseStudy";
import ClientSlider from "../Components/Common/ClientSlider/ClientSlider";
import Testimonials from "../Components/Common/Testimonials/Testimonials";

export default function HomePage() {
  return (
    <Fragment>
        <Helmet title="Media247 Digital | Home" />
        <HomeHero />
        <AboutUsSection />
        <ServiceTypes />
        <GrowthSection />
        <CaseStudy />
        <ClientSlider />
        <ContactForm />
        <Testimonials />
        {/* <Clients />
        <Services />
        <CTA 
          title="Ready to Find Your Perfect Mortgage Solution?"
          paragraphs={[
            "Let our expert mortgage brokers guide you through the process and find the best rates tailored to your needs.",
            "Get started today with a free consultation and discover how we can help you achieve your property goals."
          ]}
          buttonText="Get Started Now"
          buttonLink="#contact-us"
        />
        <Process />
        <Stats />
        <WhyChooseUs />
         */}
    </Fragment>
  );
}