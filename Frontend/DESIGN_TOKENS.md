/**
 * DESIGN SYSTEM & TOKENS
 * Modern Fintech Portfolio App
 */

/**
 * COLOR PALETTE
 */

// Primary Colors
const PRIMARY = '#5b7cfa';
const PRIMARY_LIGHT = '#748ffc';
const PRIMARY_DARK = '#4c5dd4';

// Status Colors
const SUCCESS = '#16a34a';
const SUCCESS_LIGHT = '#e7f5f0';
const DANGER = '#dc2626';
const DANGER_LIGHT = '#fee2e2';
const WARNING = '#f97316';
const WARNING_LIGHT = '#fff5e7';
const INFO = '#0284c7';
const INFO_LIGHT = '#dbeafe';

// Neutral Colors
const WHITE = '#ffffff';
const GRAY_50 = '#f8f9fb';
const GRAY_100 = '#f3f5f9';
const GRAY_200 = '#e5e7eb';
const GRAY_300 = '#d1d5db';
const GRAY_400 = '#9ca3af';
const GRAY_500 = '#6b7280';
const GRAY_600 = '#4b5563';
const GRAY_700 = '#374151';
const GRAY_800 = '#1f2937';
const GRAY_900 = '#111827';
const BLACK = '#1a1a1a';

// Text Colors
const TEXT_PRIMARY = '#1a1a1a';
const TEXT_SECONDARY = '#666666';
const TEXT_TERTIARY = '#999999';
const TEXT_LIGHT = '#d1d5db';

/**
 * TYPOGRAPHY
 */

// Font Family
const FONT_FAMILY = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;

// Font Sizes
const FONT_SIZE = {
  xs: '12px',   // Small labels
  sm: '13px',   // Subtitles
  base: '14px', // Body text
  lg: '16px',   // Large text
  xl: '18px',   // Card titles
  '2xl': '20px', // Section titles
  '3xl': '24px', // Page subtitles
  '4xl': '28px', // Page titles
  '5xl': '32px', // Large page titles
  '6xl': '56px'  // Hero titles
};

// Font Weights
const FONT_WEIGHT = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800
};

// Line Heights
const LINE_HEIGHT = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75
};

/**
 * SPACING
 */

const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
  '5xl': '48px',
  '6xl': '60px'
};

/**
 * BORDER RADIUS
 */

const BORDER_RADIUS = {
  none: '0',
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '10px',
  xl: '12px',
  full: '9999px'
};

/**
 * SHADOWS
 */

const SHADOW = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 2px 8px rgba(0, 0, 0, 0.08)',
  md: '0 4px 12px rgba(0, 0, 0, 0.12)',
  lg: '0 8px 24px rgba(0, 0, 0, 0.15)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.18)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
};

/**
 * TRANSITIONS
 */

const TRANSITION = {
  fast: '0.15s',
  base: '0.3s',
  slow: '0.5s',
  timing: 'ease'
};

/**
 * LAYOUT
 */

const LAYOUT = {
  sidebarWidth: '280px',
  topbarHeight: '72px',
  pageMaxWidth: '1400px',
  containerPadding: '40px'
};

/**
 * COMPONENT TOKENS
 */

// Buttons
const BUTTON = {
  padding: {
    sm: '8px 16px',
    md: '10px 20px',
    lg: '12px 24px'
  },
  borderRadius: '8px',
  fontWeight: 600,
  transition: 'all 0.3s ease'
};

// Cards
const CARD = {
  background: WHITE,
  border: `1px solid ${GRAY_200}`,
  borderRadius: '12px',
  padding: '24px',
  shadow: SHADOW.sm,
  shadowHover: SHADOW.md
};

// Tables
const TABLE = {
  headerBackground: GRAY_50,
  headerBorder: `1px solid ${GRAY_200}`,
  rowBorder: `1px solid ${GRAY_200}`,
  cellPadding: '16px',
  hoverBackground: GRAY_50
};

// Inputs
const INPUT = {
  height: '40px',
  padding: '12px 16px',
  border: `1px solid ${GRAY_200}`,
  borderRadius: '8px',
  fontSize: FONT_SIZE.base,
  focusBorder: PRIMARY,
  focusShadow: `0 0 0 3px rgba(91, 124, 250, 0.1)`
};

// Badges
const BADGE = {
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: FONT_SIZE.xs,
  fontWeight: 600
};

/**
 * CSS-IN-JS EXAMPLE
 */

/*
import styled from 'styled-components';

export const PageTitle = styled.h1`
  font-size: ${FONT_SIZE['4xl']};
  font-weight: ${FONT_WEIGHT.bold};
  color: ${TEXT_PRIMARY};
  margin-bottom: ${SPACING['2xl']};
`;

export const Card = styled.div`
  background: ${CARD.background};
  border: ${CARD.border};
  border-radius: ${CARD.borderRadius};
  padding: ${CARD.padding};
  box-shadow: ${CARD.shadow};
  transition: box-shadow ${TRANSITION.base} ${TRANSITION.timing};

  &:hover {
    box-shadow: ${CARD.shadowHover};
  }
`;

export const PrimaryButton = styled.button`
  padding: ${BUTTON.padding.md};
  border-radius: ${BUTTON.borderRadius};
  font-weight: ${BUTTON.fontWeight};
  background: linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_LIGHT} 100%);
  color: ${WHITE};
  border: none;
  cursor: pointer;
  transition: ${BUTTON.transition};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(91, 124, 250, 0.3);
  }
`;
*/

/**
 * TAILWIND CONFIG INTEGRATION
 */

/*
module.exports = {
  theme: {
    colors: {
      primary: PRIMARY,
      'primary-light': PRIMARY_LIGHT,
      success: SUCCESS,
      danger: DANGER,
      warning: WARNING,
      gray: {
        50: GRAY_50,
        100: GRAY_100,
        200: GRAY_200,
        600: GRAY_600,
        900: GRAY_900,
      }
    },
    fontSize: FONT_SIZE,
    fontWeight: FONT_WEIGHT,
    spacing: SPACING,
    borderRadius: BORDER_RADIUS,
    boxShadow: SHADOW,
    transitionDuration: TRANSITION
  }
}
*/

/**
 * USAGE GUIDELINES
 */

/*
1. Always use CSS variables for colors
2. Use spacing tokens for consistent padding/margins
3. Use semantic color names (success, danger, warning)
4. Apply transitions to interactive elements
5. Use proper shadows for depth
6. Follow the established font hierarchy
7. Maintain consistent border radius
8. Use proper contrast ratios for accessibility
*/
