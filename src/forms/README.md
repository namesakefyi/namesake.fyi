# Forms

This directory contains all the React components and multi-step guided forms that help users fill out name change documents.

## Naming and organization

Form directories should use lowercase `kebab-case`. Directory names should typically match the state or jurisdiction prefix followed by a brief descriptor. For example, the Massachusetts court order form is in `/ma-court-order`.

Each form directory should contain:
- A main form component file (e.g., `MaCourtOrderForm.tsx`)
- A `/steps` subdirectory containing all step components

## Creating a new form

### 1. Create the form directory structure

Create a new directory for your form with the main component and steps folder:

```
src/forms/
  my-new-form/
    MyNewForm.tsx
    steps/
      Step1.tsx
      Step2.tsx
      ...
```

### 2. Build individual step components

Each step should export a single component that accepts `StepComponentProps`:

```tsx
// steps/NameStep.tsx
import { FormStep } from "../../../components/react/forms/FormStep";
import type { StepComponentProps } from "../../../components/react/forms/FormContainer";

export function NameStep(_props: StepComponentProps) {
  return (
    <FormStep
      title="What is your current name?"
      description="Type it exactly as it appears on your ID."
    >
      {/* Add form fields here using react-hook-form's useFormContext */}
      <TextField name="currentName" label="Full Name" />
    </FormStep>
  );
}
```

The `FormStep` component provides consistent layout, handles the continue button, and manages navigation. The `StepComponentProps` interface includes `onNext` and `onBack` callbacks, though these are typically not needed directly since `FormStep` handles them.

### 3. Create the main form component

The main form component should:
- Accept optional `title` and `description` props (passed from Sanity)
- Initialize a form using `react-hook-form`'s `useForm` hook
- Define a `STEPS` array with step IDs and components
- Render a `FormContainer` with the form configuration

```tsx
// MyNewForm.tsx
import { useForm } from "react-hook-form";
import {
  FormContainer,
  type Step,
} from "../../components/react/forms/FormContainer";
import { NameStep } from "./steps/NameStep";
import { AddressStep } from "./steps/AddressStep";

const STEPS: readonly Step[] = [
  { id: "name", component: NameStep },
  { id: "address", component: AddressStep },
];

export interface MyNewFormProps {
  /** Form title from Sanity (optional, falls back to default) */
  title?: string;
  /** Form description from Sanity (optional, falls back to default) */
  description?: string;
}

export function MyNewForm({
  title = "My Default Title",
  description = "Default description for this form.",
}: MyNewFormProps = {}) {
  const form = useForm({
    defaultValues: {
      currentName: "",
      address: "",
      // Add all form fields with defaults
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted!");
    console.log("Form data:", form.getValues());
    // TODO: Handle form submission (save to database, generate PDFs, etc.)
  };

  return (
    <FormContainer
      title={title}
      description={description}
      steps={STEPS}
      form={form}
      onSubmit={handleSubmit}
    />
  );
}
```

### 4. Register the form

Add your new form to `formRegistry.ts` to make it available throughout the application:

```ts
// formRegistry.ts
import { MyNewForm } from "./my-new-form/MyNewForm";

export const FORM_REGISTRY: Record<string, FormRegistryEntry> = {
  "my-new-form": {
    id: "my-new-form",
    title: "My New Form",
    component: MyNewForm,
  },
  // ... other forms
};
```

The registry serves two purposes:
1. **Frontend**: Maps form IDs to React components via `getFormComponent()`
2. **Sanity CMS**: Provides dropdown options for the form component picker

## Attaching a form to a Sanity entry

Once your form is registered, you can create a Sanity entry to make it accessible at a URL:

1. **Open Sanity Studio** at your Sanity workspace URL (`/studio`)

2. **Create a new Form document**:
   - Click the "Create" button or navigate to "Form" in Sanity Studio
   - Fill in the required fields:
     - **Title**: Display title (e.g., "Court Order: Massachusetts")
     - **Description**: Brief summary of the form's purpose
     - **Form Component**: Select your registered form from the dropdown (e.g., "My New Form")
     - **State**: (Optional) Link to a state reference if applicable
     - **Category**: Select the appropriate category (e.g., "Legal Documents")
     - **Slug**: URL-friendly identifier (e.g., `my-new-form`)

3. **Publish the document**

4. **Access the form** at `/forms/[slug]` (e.g., `/forms/my-new-form`)

The form will automatically:
- Use the title and description from Sanity (overriding defaults)
- Render using the selected form component
- Display the last updated timestamp
- Be included in the forms listing page at `/forms`

