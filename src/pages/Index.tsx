import { useState } from "react";
import FundingForm from "@/components/FundingForm";
import SuccessState from "@/components/SuccessState";

const Index = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSuccess = () => {
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:py-12">
      <div className="max-w-lg mx-auto">
        <div className="bg-card rounded-xl shadow-card p-6 sm:p-8">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
                  Apply for Business Funding
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Complete the form below and our team will review your application.
                </p>
              </div>
              <FundingForm onSuccess={handleSuccess} />
            </>
          ) : (
            <SuccessState onReset={handleReset} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
