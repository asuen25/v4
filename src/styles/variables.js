import { css } from 'styled-components';

const variables = css`
  :root {
    /* Lab theme - white and sky blue color scheme */
    --dark-navy: #f8fafc;
    --navy: #ffffff;
    --light-navy: #f0f9ff;
    --lightest-navy: #e0f2fe;
    --navy-shadow: rgba(56, 189, 248, 0.15);
    --dark-slate: #64748b;
    --slate: #475569;
    --light-slate: #334155;
    --lightest-slate: #1e293b;
    --white: #0f172a;
    --green: #0ea5e9;
    --green-tint: rgba(14, 165, 233, 0.1);
    --pink: #ec4899;
    --blue: #3b82f6;

    --font-sans:
      'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui, sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 18px;
    --fz-xl: 20px;
    --fz-xxl: 24px;
    --fz-heading: 36px;

    --border-radius: 2px;
    --nav-height: 100px;
    --nav-scroll-height: 70px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

    --hamburger-width: 30px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active:
      bottom 0.1s ease-out, transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }
`;

export default variables;
