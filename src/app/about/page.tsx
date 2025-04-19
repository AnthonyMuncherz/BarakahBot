import React from 'react';

const AboutPage = () => {
  return (
    <div className="container max-w-screen-xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-brand-dark-green">About BarakahBot</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-lg mb-6">
          BarakahBot is your trusted companion for calculating and managing Zakat obligations. Our mission is to make Islamic financial obligations more accessible and easier to understand for Muslims worldwide.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-brand-dark-green">Our Mission</h2>
        <p className="mb-6">
          We strive to simplify the process of calculating Zakat while ensuring accuracy and compliance with Islamic principles. Through technology and innovation, we aim to make Islamic financial obligations more accessible to everyone.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-brand-dark-green">What We Offer</h2>
        <ul className="list-disc pl-6 mb-6">
          <li>Accurate Zakat calculations based on Islamic principles</li>
          <li>User-friendly interface for easy navigation</li>
          <li>Educational resources about Zakat and Islamic finance</li>
          <li>Secure and private handling of financial information</li>
          <li>Regular updates to ensure accuracy and compliance</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 text-brand-dark-green">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-brand-light-green/20 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Accuracy</h3>
            <p>We ensure all calculations and information are precise and reliable.</p>
          </div>
          <div className="p-6 bg-brand-light-green/20 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Transparency</h3>
            <p>We maintain clear and open communication about our processes.</p>
          </div>
          <div className="p-6 bg-brand-light-green/20 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Innovation</h3>
            <p>We continuously improve our services through technology.</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-brand-dark-green">Contact Us</h2>
        <p>
          Have questions or suggestions? We'd love to hear from you. Reach out to us through our social media channels or email us at support@barakahbot.com
        </p>
      </div>
    </div>
  );
};

export default AboutPage; 