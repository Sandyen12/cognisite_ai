import React, { useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import FeaturesSection from './components/FeaturesSection';
import TestimonialsSection from './components/TestimonialsSection';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';

const LandingPage = () => {
  useEffect(() => {
    // Set page title
    document.title = 'CogniSite AI - Analyze Your Website for Free | AI-Powered Content Generation';
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription?.setAttribute('content', 'Transform your website content with AI-powered analysis and generation. Get professional, engaging copy in minutes. Start your free analysis today!');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Transform your website content with AI-powered analysis and generation. Get professional, engaging copy in minutes. Start your free analysis today!';
      document.getElementsByTagName('head')?.[0]?.appendChild(meta);
    }

    // Smooth scrolling for anchor links
    const handleSmoothScroll = (e) => {
      const target = e?.target?.getAttribute('href');
      if (target && target?.startsWith('#')) {
        e?.preventDefault();
        const element = document.querySelector(target);
        if (element) {
          element?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Add event listeners for smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    links?.forEach(link => {
      link?.addEventListener('click', handleSmoothScroll);
    });

    // Cleanup
    return () => {
      links?.forEach(link => {
        link?.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section id="hero">
          <HeroSection />
        </section>

        {/* How It Works Section */}
        <section id="how-it-works">
          <HowItWorksSection />
        </section>

        {/* Features Section */}
        <section id="features">
          <FeaturesSection />
        </section>

        {/* Testimonials Section */}
        <section id="testimonials">
          <TestimonialsSection />
        </section>

        {/* Pricing Section */}
        <PricingSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;