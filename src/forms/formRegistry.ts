/**
 * Central registry of all available form components.
 * Add new forms here to make them available in both the frontend and Sanity CMS.
 */

import type { ComponentType } from "react";
import { MaCourtOrderForm } from "./ma-court-order/MaCourtOrderForm";
import { SocialSecurityForm } from "./social-security/SocialSecurityForm";

export interface FormRegistryEntry {
  /** Unique identifier for the form component */
  id: string;
  /** Display name for the CMS dropdown */
  title: string;
  /** The React component (only available on the frontend) */
  component?: ComponentType<any>;
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
  // Add more forms here as you build them:
  // "ny-court-order": {
  //   id: "ny-court-order",
  //   title: "New York Court Order",
  //   component: NyCourtOrderForm,
  // },
};

/**
 * Metadata-only registry (for Sanity schema use)
 * This can be imported in Sanity config without pulling in React components
 */
export const FORM_REGISTRY_METADATA: Array<{ id: string; title: string }> =
  Object.values(FORM_REGISTRY).map(({ id, title }) => ({ id, title }));

/**
 * Get a form component by ID
 */
export function getFormComponent(id: string): ComponentType<any> | undefined {
  return FORM_REGISTRY[id]?.component;
}
