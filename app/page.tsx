import Hero from "@/components/Hero";
import WhyKedil from "@/components/WhyKedil";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import DesignedFor from "@/components/DesignedFor";
import Security from "@/components/Security";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Hero />
      <WhyKedil />
      <HowItWorks />
      <Features />
      <DesignedFor />
      <Security />
      <Testimonials />
      <CTA />
      <FAQ />
      <ContactForm />
      <Footer />
    </main>
  );
}
