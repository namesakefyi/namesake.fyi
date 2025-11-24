import { getFormComponent } from "~/forms/formRegistry";
import "./FormRenderer.css";

export interface FormRendererProps {
  componentId: string;
  title?: string;
  description?: string;
}

export function FormRenderer({
  componentId,
  title,
  description,
}: FormRendererProps) {
  const FormComponent = getFormComponent(componentId);

  if (!FormComponent) {
    return (
      <div className="form-empty-state">
        <p>
          Couldn't find form for component ID{" "}
          <code>{componentId || "unknown"}</code>
        </p>
      </div>
    );
  }

  return <FormComponent title={title} description={description} />;
}
