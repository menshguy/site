export type SiteMode = 'personal' | 'professional';

const getDomainMode = (): SiteMode => {
  /** 
   * Check the domain and return the appropriate mode
   *
   * NOTE: .env file is used in Dev ONLY.
   * I could not use .env in Production as I could not set different
   * environment variables for each domain without upgrading for pro.
   */

  const hostname = window.location.hostname;
  
  // Add your domain mappings here
  const professionalDomains = [
    'fensterjs.com',
    'www.fensterjs.com'
  ];
  
  const personalDomains = [
    'menshguy.com',
    'www.menshguy.com',
    'site-pi-gilt-34.vercel.app'
  ];

  // Check if we're in development
  if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
    return (import.meta.env.VITE_SITE_MODE || 'personal').toLowerCase() as SiteMode;
  }

  // Check domain mappings
  if (professionalDomains.includes(hostname)) {
    return 'professional';
  }
  if (personalDomains.includes(hostname)) {
    return 'personal';
  }

  // Default fallback
  return 'personal';
};

export const getSiteMode = (): SiteMode => {
  return getDomainMode();
};

export const isPersonalMode = (): boolean => getSiteMode() === 'personal';
export const isProfessionalMode = (): boolean => getSiteMode() === 'professional';
