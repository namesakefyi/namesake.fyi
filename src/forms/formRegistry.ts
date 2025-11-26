/**
 * Central registry of all available form components.
 * Add new forms here to make them available in both the frontend and Sanity CMS.
 */

import type { ComponentType } from "react";
import { MaCourtOrderForm } from "../pages/forms/ma-court-order/_Form";
import { SocialSecurityForm } from "../pages/forms/social-security/_Form";

export interface FormRegistryEntry {
  /** Unique identifier for the form component */
  id: string;
  /** Display name for the CMS dropdown */
  title: string;
  /** The React component */
  component: ComponentType<any>;
}

/**
 * Full registry with components (for frontend use)
 */
export const FORM_REGISTRY: Record<string, FormRegistryEntry> = {
  "ma-court-order": {
    id: "ma-court-order",
    title: "Massachusetts Court Order",
    component: MaCourtOrderForm,
  },
  "social-security": {
    id: "social-security",
    title: "Social Security",
    component: SocialSecurityForm,
  },
};

/**
 * Metadata-only registry (for Sanity schema use)
 * This can be imported in Sanity config without pulling in React components
 */
export const FORM_REGISTRY_METADATA: Array<{ id: string; title: string }> =
  Object.values(FORM_REGISTRY).map(({ id, title }) => ({ id, title }));
