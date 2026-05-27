import React, { useState } from 'react';
import PersonalDetails from './PersonalDetails.jsx';
import QualificationDetails from './QualificationDetails.jsx';
import SubjectAssign from './SubjectAssign.jsx';
import { Button } from '@/components/common';

function TeacherForm({ initialData = {}, onSubmit, onCancel, isSubmitting = false, subjects = [], classes = [] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);

  const steps = [
    { label: 'Personal Details', component: PersonalDetails },
    { label: 'Professional Profile', component: QualificationDetails },
    { label: 'Subject Assignment', component: SubjectAssign },
  ];

  const handleFieldChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep === steps.length - 1) {
      onSubmit?.(formData);
    } else {
      handleNext();
    }
  };

  const StepComponent = steps[currentStep].component;

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-between border-b border-secondary-200 pb-4">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                idx === currentStep
                  ? 'bg-primary-600 text-white'
                  : idx < currentStep
                  ? 'bg-green-100 text-green-700'
                  : 'bg-secondary-100 text-secondary-500'
              }`}
            >
              {idx + 1}
            </span>
            <span
              className={`hidden sm:inline text-xs font-medium ${
                idx === currentStep ? 'text-primary-600 font-bold' : 'text-secondary-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="min-h-[250px]">
          <StepComponent
            data={formData}
            onChange={handleFieldChange}
            subjects={subjects}
            classes={classes}
          />
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-secondary-200">
          <div>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={handlePrev}>
                Previous
              </Button>
            )}
            <Button type="submit" variant="primary" loading={isSubmitting}>
              {currentStep === steps.length - 1 ? 'Save Teacher' : 'Next'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TeacherForm;
