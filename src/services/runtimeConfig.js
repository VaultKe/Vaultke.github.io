let runtimeConfig = null;
let configLoadingPromise = null;

const DEFAULT_API_BASE_URL = '/api/v1';

const loadRuntimeConfig = async () => {
  if (runtimeConfig) return runtimeConfig;
  if (configLoadingPromise) return configLoadingPromise;

  configLoadingPromise = (async () => {
    try {
      const response = await fetch('/config.json', {
        cache: 'no-cache',
      });
      if (response.ok) {
        const data = await response.json();
        runtimeConfig = data;
        return data;
      }
    } catch (e) {
      console.warn('[config] Failed to load runtime config:', e.message);
    }

    runtimeConfig = { API_BASE_URL: DEFAULT_API_BASE_URL };
    return runtimeConfig;
  })();

  return configLoadingPromise;
};

const getViteApiBaseUrl = () => {
  return import.meta.env?.VITE_API_BASE_URL || '';
};

export const getApiBaseUrl = async () => {
  const config = await loadRuntimeConfig();
  const viteUrl = getViteApiBaseUrl();

  if (viteUrl && viteUrl.trim() !== '') {
    return viteUrl.trim().replace(/\/+$/, '');
  }

  const url = config.API_BASE_URL || DEFAULT_API_BASE_URL;
  return url.trim().replace(/\/+$/, '');
};

export const ensureConfigLoaded = () => loadRuntimeConfig();

export const getRawConfig = () => runtimeConfig || { API_BASE_URL: DEFAULT_API_BASE_URL };

export default {
  getApiBaseUrl,
  ensureConfigLoaded,
  getRawConfig,
  DEFAULT_API_BASE_URL,
};
