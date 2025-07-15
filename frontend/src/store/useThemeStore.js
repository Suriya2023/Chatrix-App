
import { create } from 'zustand';
import { applyCustomTheme } from '../consonent/themeUtil';

export const useTHEME_COLORStore = create((set) => {
  const saved = localStorage.getItem('chat-theme') || 'light';
  applyCustomTheme(saved);  

  return {
    theme: saved,
    setTheme: (newTheme) => {
      localStorage.setItem('chat-theme', newTheme);
      applyCustomTheme(newTheme);
      set({ theme: newTheme });
    },
  };
});
