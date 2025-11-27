import { createTheme, alpha } from '@mui/material/styles';

// Premium Color Palette
const palette = {
  primary: {
    main: '#0F172A', // Slate 900
    light: '#334155', // Slate 700
    dark: '#020617', // Slate 950
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#6366F1', // Indigo 500
    light: '#818CF8', // Indigo 400
    dark: '#4F46E5', // Indigo 600
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#10B981', // Emerald 500
    light: '#34D399',
    dark: '#059669',
  },
  warning: {
    main: '#F59E0B', // Amber 500
    light: '#FBBF24',
    dark: '#D97706',
  },
  error: {
    main: '#EF4444', // Red 500
    light: '#F87171',
    dark: '#DC2626',
  },
  background: {
    default: '#F8FAFC', // Slate 50
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1E293B', // Slate 800
    secondary: '#64748B', // Slate 500
  },
  divider: alpha('#94A3B8', 0.12), // Slate 400
};

// Typography
const typography = {
  fontFamily: '"Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
  h1: {
    fontWeight: 700,
    fontSize: '2.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.01562em',
  },
  h2: {
    fontWeight: 700,
    fontSize: '2rem',
    lineHeight: 1.2,
    letterSpacing: '-0.00833em',
  },
  h3: {
    fontWeight: 600,
    fontSize: '1.75rem',
    lineHeight: 1.2,
    letterSpacing: '0em',
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.2,
    letterSpacing: '0.00735em',
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.2,
    letterSpacing: '0em',
  },
  h6: {
    fontWeight: 600,
    fontSize: '1rem',
    lineHeight: 1.2,
    letterSpacing: '0.0075em',
  },
  button: {
    fontWeight: 600,
    textTransform: 'none',
    letterSpacing: '0.025em',
  },
};

// Component Overrides
const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '8px 16px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
      containedPrimary: {
        background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.light} 100%)`,
      },
      containedSecondary: {
        background: `linear-gradient(135deg, ${palette.secondary.main} 0%, ${palette.secondary.light} 100%)`,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        backgroundImage: 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
      elevation1: {
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          transition: 'all 0.2s',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.primary.light,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: palette.primary.main,
            borderWidth: 2,
          },
        },
      },
    },
  },
};

const theme = createTheme({
  palette,
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
});

export default theme;
