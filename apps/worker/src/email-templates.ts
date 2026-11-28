import type { EmailTemplate } from '@app/db';

type Vars = Record<string, string>;
type Render = (v: Vars, appName: string) => { subject: string; text: string };

const decisionEn: Record<string, string> = {
  APPROVED: 'approved',
  NEEDS_INFO: 'returned for more information',
  REJECTED: 'rejected',
};
const decisionAr: Record<string, string> = {
  APPROVED: 'تمت الموافقة على',
  NEEDS_INFO: 'أعيد لطلب معلومات إضافية بشأن',
  REJECTED: 'تم رفض',
};

/**
 * Localised transactional email templates. No sensitive documents or details are included
 * (docs/11-integrations.md); links require authentication or carry a single-use token.
 */
export const TEMPLATES: Record<EmailTemplate, { en: Render; ar: Render }> = {
  verify_email: {
    en: (v, app) => ({
      subject: `${app}: verify your email address`,
      text: `Hello ${v.name},\n\nConfirm your email address to continue setting up your business account:\n${v.verify_url}\n\nThe link expires in 24 hours. If you did not create an account, ignore this email.`,
    }),
    ar: (v, app) => ({
      subject: `${app}: تأكيد بريدك الإلكتروني`,
      text: `مرحباً ${v.name}،\n\nيرجى تأكيد بريدك الإلكتروني لمتابعة إعداد حساب شركتك:\n${v.verify_url}\n\nتنتهي صلاحية الرابط خلال 24 ساعة. إذا لم تقم بإنشاء حساب، تجاهل هذه الرسالة.`,
    }),
  },
  account_exists: {
    en: (v, app) => ({
      subject: `${app}: sign-up attempt`,
      text: `Someone tried to register with this email address, which already has an account.\nIf this was you, sign in instead: ${v.login_url}\nYou can reset your password from the sign-in page.`,
    }),
    ar: (v, app) => ({
      subject: `${app}: محاولة تسجيل`,
      text: `حاول شخص ما التسجيل باستخدام هذا البريد الإلكتروني المرتبط بحساب قائم.\nإذا كنت أنت، سجّل الدخول: ${v.login_url}\nيمكنك إعادة تعيين كلمة المرور من صفحة تسجيل الدخول.`,
    }),
  },
  password_reset: {
    en: (v, app) => ({
      subject: `${app}: reset your password`,
      text: `Hello ${v.name},\n\nUse this link to choose a new password:\n${v.reset_url}\n\nThe link expires in 1 hour and can be used once. If you did not request this, ignore this email.`,
    }),
    ar: (v, app) => ({
      subject: `${app}: إعادة تعيين كلمة المرور`,
      text: `مرحباً ${v.name}،\n\nاستخدم هذا الرابط لاختيار كلمة مرور جديدة:\n${v.reset_url}\n\nتنتهي صلاحية الرابط خلال ساعة ويمكن استخدامه مرة واحدة. إذا لم تطلب ذلك، تجاهل هذه الرسالة.`,
    }),
  },
  password_changed: {
    en: (v, app) => ({
      subject: `${app}: your password was changed`,
      text: `Hello ${v.name},\n\nYour password was changed and other sessions were signed out. If this was not you, reset your password immediately and contact support.`,
    }),
    ar: (v, app) => ({
      subject: `${app}: تم تغيير كلمة المرور`,
      text: `مرحباً ${v.name}،\n\nتم تغيير كلمة المرور وتسجيل الخروج من الجلسات الأخرى. إذا لم تقم بذلك، أعد تعيين كلمة المرور فوراً وتواصل مع الدعم.`,
    }),
  },
  invitation: {
    en: (v, app) => ({
      subject: `${app}: invitation to join ${v.company}`,
      text: `${v.inviter} invited you to the ${v.workspace_kind === 'BUYER' ? 'buyer' : 'seller'} workspace of ${v.company} with the role ${v.role}.\n\nAccept the invitation (expires in 7 days):\n${v.accept_url}\n\nYou need to sign in or register with this email address.`,
    }),
    ar: (v, app) => ({
      subject: `${app}: دعوة للانضمام إلى ${v.company}`,
      text: `دعاك ${v.inviter} إلى مساحة ${v.workspace_kind === 'BUYER' ? 'المشتري' : 'البائع'} لشركة ${v.company} بدور ${v.role}.\n\nاقبل الدعوة (تنتهي خلال 7 أيام):\n${v.accept_url}\n\nيجب تسجيل الدخول أو التسجيل بهذا البريد الإلكتروني.`,
    }),
  },
  verification_submitted: {
    en: (v, app) => ({
      subject: `${app}: verification submitted for ${v.company}`,
      text: `We received the verification request for ${v.company}. Our compliance team will review it and notify you of the outcome.`,
    }),
    ar: (v, app) => ({
      subject: `${app}: تم إرسال طلب التحقق لشركة ${v.company}`,
      text: `استلمنا طلب التحقق لشركة ${v.company}. سيقوم فريق الامتثال بمراجعته وإبلاغك بالنتيجة.`,
    }),
  },
  verification_decided: {
    en: (v, app) => ({
      subject: `${app}: verification ${decisionEn[v.decision ?? ''] ?? 'updated'} for ${v.company}`,
      text: `The verification for ${v.company} was ${decisionEn[v.decision ?? ''] ?? 'updated'}.${v.reason ? `\n\nReason: ${v.reason}` : ''}\n\nSign in to see details: ${v.company_url}`,
    }),
    ar: (v, app) => ({
      subject: `${app}: تحديث التحقق لشركة ${v.company}`,
      text: `${decisionAr[v.decision ?? ''] ?? 'تم تحديث'} طلب التحقق لشركة ${v.company}.${v.reason ? `\n\nالسبب: ${v.reason}` : ''}\n\nسجّل الدخول للاطلاع على التفاصيل: ${(v.company_url ?? '').replace('/en/', '/ar/')}`,
    }),
  },
  licence_expiring: {
    en: (v, app) => ({
      subject: `${app}: trade licence for ${v.company} expires on ${v.expiry}`,
      text: `The trade licence on file for ${v.company} expires on ${v.expiry}. Submit a renewal before then to avoid trading restrictions.`,
    }),
    ar: (v, app) => ({
      subject: `${app}: الرخصة التجارية لشركة ${v.company} تنتهي في ${v.expiry}`,
      text: `تنتهي الرخصة التجارية المسجلة لشركة ${v.company} في ${v.expiry}. قدّم طلب تجديد قبل ذلك لتجنب تقييد التداول.`,
    }),
  },
  licence_expired: {
    en: (v, app) => ({
      subject: `${app}: trading restricted for ${v.company}`,
      text: `The trade licence for ${v.company} expired on ${v.expiry}. New trading is restricted until a renewal is approved. Existing records remain accessible.`,
    }),
    ar: (v, app) => ({
      subject: `${app}: تقييد التداول لشركة ${v.company}`,
      text: `انتهت الرخصة التجارية لشركة ${v.company} في ${v.expiry}. تم تقييد التداول الجديد حتى الموافقة على التجديد. تبقى السجلات الحالية متاحة.`,
    }),
  },
  company_suspended: {
    en: (v, app) => ({
      subject: `${app}: ${v.company} suspended`,
      text: `${v.company} has been suspended by compliance. New trading is restricted; existing records and support remain accessible.\n\nReason: ${v.reason}`,
    }),
    ar: (v, app) => ({
      subject: `${app}: تعليق ${v.company}`,
      text: `تم تعليق ${v.company} من قبل فريق الامتثال. تم تقييد التداول الجديد، وتبقى السجلات الحالية والدعم متاحة.\n\nالسبب: ${v.reason}`,
    }),
  },
  company_reactivated: {
    en: (v, app) => ({
      subject: `${app}: ${v.company} reactivated`,
      text: `${v.company} has been reactivated.`,
    }),
    ar: (v, app) => ({
      subject: `${app}: إعادة تفعيل ${v.company}`,
      text: `تمت إعادة تفعيل ${v.company}.`,
    }),
  },
  catalog_decision: {
    en: (v, app) => {
      const d =
        { APPROVED: 'approved', REJECTED: 'rejected', CHANGES_REQUESTED: 'returned for changes' }[
          v.decision ?? ''
        ] ?? 'reviewed';
      return {
        subject: `${app}: listing ${d} - ${v.product}`,
        text: `Your listing "${v.product}" (${v.company}) was ${d}.${v.reason ? `\n\nReason: ${v.reason}` : ''}\n\nOpen your seller dashboard to see details.`,
      };
    },
    ar: (v, app) => {
      const d =
        {
          APPROVED: 'تمت الموافقة على',
          REJECTED: 'تم رفض',
          CHANGES_REQUESTED: 'طُلبت تعديلات على',
        }[v.decision ?? ''] ?? 'تمت مراجعة';
      return {
        subject: `${app}: ${d} المنتج - ${v.product}`,
        text: `${d} منتجك "${v.product}" (${v.company}).${v.reason ? `\n\nالسبب: ${v.reason}` : ''}\n\nافتح لوحة البائع لمعرفة التفاصيل.`,
      };
    },
  },
  listing_enforcement: {
    en: (v, app) => {
      const d =
        { suspend: 'suspended', restore: 'restored', remove: 'removed' }[v.action ?? ''] ??
        'updated';
      return {
        subject: `${app}: listing ${d} - ${v.product}`,
        text: `Your listing "${v.product}" (${v.company}) was ${d} by the marketplace team.\n\nReason: ${v.reason}`,
      };
    },
    ar: (v, app) => {
      const d =
        { suspend: 'تم إيقاف', restore: 'تمت استعادة', remove: 'تمت إزالة' }[v.action ?? ''] ??
        'تم تحديث';
      return {
        subject: `${app}: ${d} المنتج - ${v.product}`,
        text: `${d} منتجك "${v.product}" (${v.company}) من قبل فريق السوق.\n\nالسبب: ${v.reason}`,
      };
    },
  },
  storefront_enforcement: {
    en: (v, app) => {
      const d = v.action === 'hide' ? 'hidden' : 'restored';
      return {
        subject: `${app}: storefront ${d} - ${v.company}`,
        text: `The storefront of ${v.company} was ${d} by the marketplace team.\n\nReason: ${v.reason}`,
      };
    },
    ar: (v, app) => {
      const d = v.action === 'hide' ? 'إخفاء' : 'استعادة';
      return {
        subject: `${app}: ${d} واجهة المتجر - ${v.company}`,
        text: `تم ${d} واجهة متجر ${v.company} من قبل فريق السوق.\n\nالسبب: ${v.reason}`,
      };
    },
  },
  activity: {
    en: (v, app) => ({
      subject: `${app}: ${v.summary}`,
      text: `${v.summary}\n\nSign in to see the details:\n${v.url}\n\nYou can change email notifications in your account settings.`,
    }),
    ar: (v, app) => ({
      subject: `${app}: ${v.summary}`,
      text: `${v.summary}\n\nسجّل الدخول للاطلاع على التفاصيل:\n${v.url}\n\nيمكنك تغيير إشعارات البريد الإلكتروني من إعدادات حسابك.`,
    }),
  },
};
