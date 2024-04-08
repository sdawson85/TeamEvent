export const generateTenantIdFromBrowser = (): string => {
  const userAgent = navigator.userAgent;
  const language = navigator.language;
  const screenWidth = screen.width;
  const screenHeight = screen.height;

  const rawData = `${userAgent}-${language}-${screenWidth}-${screenHeight}`;
  const tenantId = btoa(rawData);
  return tenantId;
};

export const saveTenantId = (tenantId: string): void => {
  localStorage.setItem("tenantId", tenantId);
};

export const getTenantId = (): string | null => {
  return localStorage.getItem("tenantId");
};
