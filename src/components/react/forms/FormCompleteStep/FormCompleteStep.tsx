import { RiDownloadLine, RiRestartLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { clearFormProgress } from "@/db/database";
import { Button } from "../../common/Button";
import { Heading } from "../../common/Content/Content";
import { DeleteFormDataModal } from "../DeleteFormDataModal";
import { FormFeedback } from "../FormFeedback/FormFeedback";
import "./FormCompleteStep.css";

export interface FormCompleteStepProps {
  title: string;
  formSlug: string;
  onRedownload: (e: React.SubmitEvent<HTMLFormElement>) => void | Promise<void>;
}

export function FormCompleteStep({
  title,
  formSlug,
  onRedownload,
}: FormCompleteStepProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const previous = document.body.dataset.color;
    document.body.dataset.color = "green";
    return () => {
      document.body.dataset.color = previous ?? "";
    };
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDownloading(true);
    try {
      await onRedownload(e);
    } catch (error) {
      console.error("Re-download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRestart = async () => {
    await clearFormProgress(formSlug);
    window.location.reload();
  };

  return (
    <section className="form-complete-step">
      <header className="form-complete-step-header">
        <Heading level={1} className="form-complete-step-heading">
          Form complete!
        </Heading>
        <p className="form-complete-step-description">
          Your <strong>{title}</strong> name change packet has downloaded.
          Review, print, and follow the steps for filing. If you have questions,
          email us at <a href="mailto:hey@namesake.fyi">hey@namesake.fyi</a>.
        </p>
      </header>
      <div className="form-complete-step-content">
        <FormFeedback formSlug={formSlug} />
        <DeleteFormDataModal />
        <div className="form-complete-actions">
          <form onSubmit={handleSubmit}>
            <Button
              type="submit"
              variant="secondary"
              icon={RiDownloadLine}
              isPending={isDownloading}
              isDisabled={isDownloading}
            >
              Redownload form
            </Button>
          </form>

          <Button
            variant="secondary"
            icon={RiRestartLine}
            onPress={handleRestart}
          >
            Restart form
          </Button>
        </div>
      </div>
    </section>
  );
}
