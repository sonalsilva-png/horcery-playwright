
export enum SignInLocators {
  EmailInput = '#email',
  PasswordInput = '#password',
  SignInButton = 'button:has-text("Sign In")',
  ForgotPasswordLink = 'a[href="/forgot-password"]',
  SignUpLink = 'a[href="/sign-up"]',
  ToastContainer = '[data-testid="flowbite-toast"]',
  PasswordToggleIcon = 'button:has(svg)',
  RememberMeCheckbox = '#remember_me',
}

export enum ForgotPasswordLocators {
  EmailInput = '#email',
  ResetButton = 'button:has-text("Submit")',
  BackToSignInLink = 'a:has-text("Sign in")',
}

export enum ForgotPasswordConfirmationLocators {
  SuccessMessage = 'div.whitespace-pre-wrap',
  ReturnToSignInLink = 'a.text-primary-500[href="/"]',
}
