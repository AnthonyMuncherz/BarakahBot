'use client';

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage = () => {
  const faqs = [
    {
      question: "What is Zakat?",
      answer: "Zakat is one of the Five Pillars of Islam. It's a form of obligatory charity that requires Muslims who meet the necessary criteria of wealth to donate a certain portion of their wealth to specified categories of recipients."
    },
    {
      question: "How is Zakat calculated?",
      answer: "Zakat is typically calculated at 2.5% of a Muslim's total savings and wealth above the minimum threshold (nisab) that has been held for one lunar year. BarakahBot helps you calculate this accurately based on your specific financial situation."
    },
    {
      question: "What is the Nisab threshold?",
      answer: "Nisab is the minimum amount of wealth a Muslim must possess before they become eligible to pay Zakat. It's generally equivalent to the value of 85 grams of gold or 595 grams of silver."
    },
    {
      question: "How does BarakahBot calculate Zakat?",
      answer: "BarakahBot uses current market values and Islamic principles to calculate your Zakat obligation. We consider various assets including cash, gold, silver, investments, and business wealth while applying the appropriate calculations for each type."
    },
    {
      question: "Is my financial information secure?",
      answer: "Yes, we take data security very seriously. All your financial information is encrypted and securely stored. We don't share your personal information with any third parties."
    },
    {
      question: "How often should I calculate Zakat?",
      answer: "Zakat should be calculated and paid once every lunar year on wealth that has been in your possession for a full lunar year. However, you can use BarakahBot anytime to estimate your Zakat obligation."
    },
    {
      question: "Can I save my calculations?",
      answer: "Yes, if you create an account with BarakahBot, you can save your calculations and track your Zakat history over time."
    },
    {
      question: "What if I need help with my calculation?",
      answer: "Our chatbot is designed to guide you through the calculation process. For more complex queries, you can refer to our detailed guides or contact our support team."
    }
  ];

  return (
    <div className="container max-w-screen-xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-brand-dark-green">Frequently Asked Questions</h1>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-medium text-brand-dark-green">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQPage; 