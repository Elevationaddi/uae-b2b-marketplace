/** Development-only credentials for seeded accounts. Never used outside development/test. */
export const DEV_PASSWORD = 'DevOnly-Passw0rd!';
/** Fixed base32 TOTP secrets for seeded admins. Development only. */
export const DEV_ADMIN_TOTP: Record<string, string> = {
  'compliance@admin.test': 'JBSWY3DPEHPK3PXPCOMPLIAN',
  'support@admin.test': 'JBSWY3DPEHPK3PXPSUPPORTA',
  'finance@admin.test': 'JBSWY3DPEHPK3PXPFINANCEA',
  'approver@admin.test': 'JBSWY3DPEHPK3PXPAPPROVER',
  'superadmin@admin.test': 'JBSWY3DPEHPK3PXPSUPERADM',
};
