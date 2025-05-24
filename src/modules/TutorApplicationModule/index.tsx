import React from 'react';
import { ApplicationFormSection } from './sections/ApplicationFormSection';

export const TutorApplicationModule = () => {
  return (
    <main>
      <ApplicationFormSection />
    </main>
  );
};

// Export for status page
export { ApplicationStatusSection } from './sections/ApplicationStatusSection';