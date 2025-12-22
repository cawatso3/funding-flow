import { UseFormReturn } from "react-hook-form";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { FullApplicationData } from "@/types/applicationForm";
import { Upload, X, FileText } from "lucide-react";

interface StepDocumentsProps {
  form: UseFormReturn<FullApplicationData>;
}

interface FileUploadFieldProps {
  form: UseFormReturn<FullApplicationData>;
  name: keyof FullApplicationData;
  label: string;
  description?: string;
}

const ACCEPTED_FILE_TYPES = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

const FileUploadField = ({ form, name, label, description }: FileUploadFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        form.setError(name, { message: "File size must be less than 25MB" });
        return;
      }
      form.setValue(name, file as any);
      form.clearErrors(name);
    }
  };

  const handleRemove = () => {
    form.setValue(name, null as any);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const currentFile = form.watch(name) as File | null | undefined;

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {description && (
            <FormDescription>{description}</FormDescription>
          )}
          <FormControl>
            <div className="space-y-2">
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_FILE_TYPES}
                onChange={handleFileChange}
                className="hidden"
                id={`file-${name}`}
              />
              
              {!currentFile ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-20 border-dashed flex flex-col gap-1"
                  onClick={() => inputRef.current?.click()}
                >
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload (PDF, DOC, DOCX, or images)
                  </span>
                </Button>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm truncate">{currentFile.name}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemove}
                    className="flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const StepDocuments = ({ form }: StepDocumentsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Supporting Documents</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The following documents will be required throughout the process and we encourage you to submit 
          as many as you have now. All uploads are optional at this stage.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Accepted formats: PDF, DOC, DOCX, JPG, PNG • Max file size: 25MB
        </p>
      </div>

      <div className="space-y-5">
        <FileUploadField
          form={form}
          name="firm_overview"
          label="Firm overview with growth strategy"
          description="Provide an overview of your firm and its growth plans"
        />

        <FileUploadField
          form={form}
          name="one_pager"
          label="One pager on current and previous developments or projects"
          description="A summary of your development history"
        />

        <FileUploadField
          form={form}
          name="team_bios"
          label="Bios/Resumés for each team member identified above"
          description="Include relevant experience and qualifications"
        />

        <FileUploadField
          form={form}
          name="project_budget"
          label="Upcoming Project: Budget with Sources and Uses"
          description="Detailed budget breakdown for your upcoming project"
        />

        <FileUploadField
          form={form}
          name="project_timeline"
          label="Upcoming Project: Development Timeline"
          description="Expected milestones and completion dates"
        />
      </div>
    </div>
  );
};

export default StepDocuments;
