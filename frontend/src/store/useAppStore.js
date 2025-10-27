import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set, get) => ({
      // App initialization state
      isInitialized: null,
      initializationLoading: true,

      // User state
      user: null,
      isAuthenticated: false,

      // Setup wizard state
      setupStep: 0,
      setupData: {
        admin: null,
        household: null,
        baby: null,
      },

      // Actions
      setInitialized: (initialized) => set({ isInitialized: initialized, initializationLoading: false }),

      setInitializationLoading: (loading) => set({ initializationLoading: loading }),

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      logout: () => set({ user: null, isAuthenticated: false }),

      setSetupStep: (step) => set({ setupStep: step }),

      updateSetupData: (stepName, data) =>
        set((state) => ({
          setupData: {
            ...state.setupData,
            [stepName]: data,
          },
        })),

      resetSetup: () =>
        set({
          setupStep: 0,
          setupData: {
            admin: null,
            household: null,
            baby: null,
          },
        }),

      completeSetup: () =>
        set({
          isInitialized: true,
          setupStep: 0,
          setupData: {
            admin: null,
            household: null,
            baby: null,
          },
        }),
    }),
    {
      name: 'baby-logbook-storage',
      partialize: (state) => ({
        isInitialized: state.isInitialized,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAppStore;
