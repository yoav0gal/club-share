import { PolicyModal } from './policy-modal';
import { TermsOfServiceContent } from './terms-of-service-content';
import { PrivacyPolicyContent } from './privacy-policy-content';

export function PolicysFooter() {
  return (
    <div className="text-balance text-center text-xs text-muted-foreground">
      By clicking continue, you agree to our{' '}
      <PolicyModal
        title="Terms of Service"
        linkHref="/terms"
        trigger={
          <button
            className="underline underline-offset-4 hover:text-primary"
            type="button"
          >
            Terms of Service
          </button>
        }
        contentComponent={<TermsOfServiceContent />}
      />{' '}
      and{' '}
      <PolicyModal
        title="Privacy Policy"
        linkHref="/privacy"
        trigger={
          <button
            className="underline underline-offset-4 hover:text-primary"
            type="button"
          >
            Privacy Policy
          </button>
        }
        contentComponent={<PrivacyPolicyContent />}
      />
      .
    </div>
  );
}
