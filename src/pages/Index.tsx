import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import GetInvolvedSection from "@/components/GetInvolvedSection";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <AboutSection />
        <ProjectsSection />
        <GetInvolvedSection />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;