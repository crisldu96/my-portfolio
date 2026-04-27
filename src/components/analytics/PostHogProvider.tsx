'use client';

import * as React from 'react';
import posthog from 'posthog-js';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    if (!POSTHOG_KEY) return;
    if (posthog.__loaded) return;

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: true,
      capture_pageleave: true,
      person_profiles: 'identified_only',
      autocapture: true,
      disable_session_recording: false,
    });
  }, []);

  return <>{children}</>;
}
