import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SuccessStateProps {
  onReset: () => void;
}

const SuccessState = ({ onReset }: SuccessStateProps) => {
  return (
    <div className="text-center py-8 animate-fade-in">
      <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 animate-scale-in">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-8 h-8 text-primary-foreground" strokeWidth={3} />
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-foreground mb-3">
        Application Received
      </h2>
      
      <p className="text-muted-foreground mb-2 max-w-sm mx-auto">
        Thank you for applying. Our team will review your application and contact you within 1–2 business days.
      </p>
      
      <p className="text-sm text-muted-foreground/70 mb-8">
        Please check your email for confirmation.
      </p>
      
      <Button 
        variant="outline" 
        onClick={onReset}
        className="px-6"
      >
        Submit another application
      </Button>
    </div>
  );
};

export default SuccessState;
