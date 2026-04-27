import posthog from 'posthog-js';

type EventProps = Record<string, string | number | boolean | null | undefined>;

export const ANALYTICS_EVENTS = {
  PROJECT_CLICKED: 'project_clicked',
  BLOG_POST_CLICKED: 'blog_post_clicked',
  BLOG_HIGHLIGHT_CTA_CLICKED: 'blog_highlight_cta_clicked',
  CONTACT_SUBMITTED: 'contact_submitted',
  CONTACT_CTA_CLICKED: 'contact_cta_clicked',
  LANGUAGE_TOGGLED: 'language_toggled',
  THEME_TOGGLED: 'theme_toggled',
  SOCIAL_LINK_CLICKED: 'social_link_clicked',
  CV_DOWNLOADED: 'cv_downloaded',
} as const;

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

export function trackEvent(name: AnalyticsEventName, props?: EventProps): void {
  if (typeof window === 'undefined') return;
  if (!posthog.__loaded) return;
  posthog.capture(name, props);
}
