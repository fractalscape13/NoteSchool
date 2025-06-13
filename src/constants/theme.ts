export const colors = {
  primary: '#4f46e5',
  background: '#0a0f1d',
  text: {
    primary: '#f1f5f9',
    secondary: '#64748b',
  },
  button: {
    start: {
      background: '#16a34a',
      border: '#166534',
    },
    stop: {
      background: '#dc2626',
      border: '#991b1b',
    },
  },
  tuner: {
    button: {
      background: '#1e293b',
      border: '#4f46e5',
      text: '#f1f5f9',
    },
  },
} as const;

export type AppColors = typeof colors; 