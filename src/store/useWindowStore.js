import { create } from 'zustand';
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from '#constants';

/**
 * Window State Management Store
 * Handles all window open/close states, z-index layering, minimize/maximize, and window data
 */
const useWindowStore = create((set, get) => ({
  // Window states - each window has: isOpen, isMinimized, isMaximized, zIndex, data
  windows: { ...WINDOW_CONFIG },

  // Track the highest z-index for bringing windows to front
  highestZIndex: INITIAL_Z_INDEX,

  // Currently active (focused) window
  activeWindow: null,

  /**
   * Open a window with optional data
   * @param {string} windowId - The window to open (finder, contact, safari, etc.)
   * @param {object} data - Optional data to pass to the window
   */
  openWindow: (windowId, data = null) => {
    const { highestZIndex } = get();
    const newZIndex = highestZIndex + 1;

    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          isOpen: true,
          isMinimized: false,
          isMaximized: false,
          zIndex: newZIndex,
          data: data,
        },
      },
      highestZIndex: newZIndex,
      activeWindow: windowId,
    }));
  },

  /**
   * Close a window
   * @param {string} windowId - The window to close
   */
  closeWindow: (windowId) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
          data: null,
        },
      },
      activeWindow: state.activeWindow === windowId ? null : state.activeWindow,
    }));
  },

  /**
   * Minimize a window (hide to dock)
   * @param {string} windowId - The window to minimize
   */
  minimizeWindow: (windowId) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          isMinimized: true,
        },
      },
      activeWindow: state.activeWindow === windowId ? null : state.activeWindow,
    }));
  },

  /**
   * Restore a window from minimized state
   * @param {string} windowId - The window to restore
   */
  restoreWindow: (windowId) => {
    const { highestZIndex } = get();
    const newZIndex = highestZIndex + 1;

    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          isMinimized: false,
          zIndex: newZIndex,
        },
      },
      highestZIndex: newZIndex,
      activeWindow: windowId,
    }));
  },

  /**
   * Toggle maximize state of a window
   * @param {string} windowId - The window to toggle maximize
   */
  toggleMaximize: (windowId) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          isMaximized: !state.windows[windowId].isMaximized,
        },
      },
    }));
  },

  /**
   * Bring a window to the front (highest z-index)
   * @param {string} windowId - The window to focus
   */
  bringToFront: (windowId) => {
    const { highestZIndex, windows } = get();

    // Only update if window is open and not already on top
    if (!windows[windowId]?.isOpen) return;
    if (windows[windowId]?.zIndex === highestZIndex) return;

    const newZIndex = highestZIndex + 1;

    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          zIndex: newZIndex,
        },
      },
      highestZIndex: newZIndex,
      activeWindow: windowId,
    }));
  },

  /**
   * Toggle a window open/close
   * @param {string} windowId - The window to toggle
   * @param {object} data - Optional data to pass when opening
   */
  toggleWindow: (windowId, data = null) => {
    const { windows } = get();
    if (windows[windowId]?.isOpen) {
      get().closeWindow(windowId);
    } else {
      get().openWindow(windowId, data);
    }
  },

  /**
   * Close all windows
   */
  closeAllWindows: () => {
    set((state) => ({
      windows: Object.keys(state.windows).reduce((acc, key) => ({
        ...acc,
        [key]: { ...state.windows[key], isOpen: false, data: null },
      }), {}),
      activeWindow: null,
    }));
  },

  /**
   * Check if a window is open
   * @param {string} windowId - The window to check
   * @returns {boolean}
   */
  isWindowOpen: (windowId) => {
    return get().windows[windowId]?.isOpen ?? false;
  },

  /**
   * Get window data
   * @param {string} windowId - The window to get data from
   * @returns {object|null}
   */
  getWindowData: (windowId) => {
    return get().windows[windowId]?.data ?? null;
  },

  /**
   * Update window data without changing open state
   * @param {string} windowId - The window to update
   * @param {object} data - New data
   */
  updateWindowData: (windowId, data) => {
    set((state) => ({
      windows: {
        ...state.windows,
        [windowId]: {
          ...state.windows[windowId],
          data: data,
        },
      },
    }));
  },
}));

export default useWindowStore;
