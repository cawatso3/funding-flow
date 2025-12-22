import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { FORM_STEPS } from "@/types/applicationForm";

interface ProgressIndicatorProps {
  currentStep: number;
}

const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => {
  return (
    <div className="mb-8">
      {/* Mobile: Simple step counter */}
      <div className="sm:hidden text-center mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep} of {FORM_STEPS.length}
        </span>
        <h2 className="text-lg font-semibold text-foreground mt-1">
          {FORM_STEPS[currentStep - 1].title}
        </h2>
      </div>

      {/* Mobile: Progress bar */}
      <div className="sm:hidden">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / FORM_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: Step indicators */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between">
          {FORM_STEPS.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isUpcoming = stepNumber > currentStep;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200",
                      isCompleted && "bg-primary text-primary-foreground",
                      isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                      isUpcoming && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs mt-2 text-center max-w-[80px] leading-tight",
                      isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                
                {/* Connector line */}
                {index < FORM_STEPS.length - 1 && (
                  <div className="flex-1 mx-2 mt-[-24px]">
                    <div
                      className={cn(
                        "h-0.5 transition-colors duration-200",
                        stepNumber < currentStep ? "bg-primary" : "bg-muted"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
