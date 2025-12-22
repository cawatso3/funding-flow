import { Button } from "@/components/ui/button";
import { Check, Mail } from "lucide-react";

interface SuccessStateProps {
  onReset: () => void;
}

const SuccessState = ({ onReset }: SuccessStateProps) => {
  return (
    <div className="text-center py-12 animate-fade-in">
      <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-10 h-10 text-primary-foreground" strokeWidth={3} />
        </div>
      </div>
      
      <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4">
        Application Submitted Successfully
      </h2>
      
      <div className="flex items-center justify-center gap-2 text-muted-foreground mb-3">
        <Mail className="w-5 h-5" />
        <p className="text-base">You'll receive a confirmation email shortly</p>
      </div>
      
      <p className="text-sm text-muted-foreground/70 mb-10 max-w-md mx-auto">
        Our team will review your application and contact you within 3-5 business days. 
        Please check your email for next steps.
      </p>
      
      <Button 
        variant="outline" 
        onClick={onReset}
        className="px-8"
      >
        Submit another application
      </Button>
    </div>
  );
};

export default SuccessState;
