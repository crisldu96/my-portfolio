import type { CSSObject } from '@mui/system';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    customInput: CSSObject;
    mainContent: CSSObject;
    menuCaption: CSSObject;
    subMenuCaption: CSSObject;
    commonAvatar: CSSObject;
    smallAvatar: CSSObject;
    mediumAvatar: CSSObject;
    largeAvatar: CSSObject;
    sectionLabel: CSSObject;
    heroHeading: CSSObject;
    sectionHeading: CSSObject;
    mono: CSSObject;
  }

  interface TypographyVariantsOptions {
    customInput?: CSSObject;
    mainContent?: CSSObject;
    menuCaption?: CSSObject;
    subMenuCaption?: CSSObject;
    commonAvatar?: CSSObject;
    smallAvatar?: CSSObject;
    mediumAvatar?: CSSObject;
    largeAvatar?: CSSObject;
    sectionLabel?: CSSObject;
    heroHeading?: CSSObject;
    sectionHeading?: CSSObject;
    mono?: CSSObject;
  }
}
