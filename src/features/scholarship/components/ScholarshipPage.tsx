import { useEffect } from 'react';
import { useScholarshipStore } from '../../../app/store';
import { HeaderSection } from './HeaderSection';
import { InteractionSection } from './InteractionSection';
import { AboutSection } from './AboutSection';
import { Testimonials } from './Testimonials';
import { FAQSection } from './FAQSection';
import { StickyBar } from './StickyBar';

export const ScholarshipPage = () => {
  const { data, isLoading, error, fetchData } = useScholarshipStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) return <div className="loading">Loading scholarship data...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!data) return <div>No data available.</div>;

  return (
    <div className="scholarship-page">
      <HeaderSection />
      <InteractionSection />
      <AboutSection />
      <Testimonials />
      <FAQSection />
      <StickyBar />
    </div>
  );
};