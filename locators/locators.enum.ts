
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

export enum SignUpLocators {
  FirstNameInput = '#first_name',
  LastNameInput = '#last_name',
  EmailInput = '#email',
  CreateAccountHeading = 'h2:has-text("Create Your Account")',
  CreateAccountButton = 'button:has-text("Create Account")',
  GoogleSignUpButton = 'button:has(span:has-text("Sign up with Google"))',
  AppleSignUpButton = 'button:has(span:has-text("Sign up with Apple ID"))',
  SignInLink = 'a:has-text("Sign in")',
  HorceryLogo = 'img[alt="Horcery Logo"]',
  RequiredFieldError = 'p:has-text("This field is required.")',
  SpaceError = 'p:has-text("The name cannot begin with a space. Please start with a valid character.")',
  SpecialCharacterError = 'p:has-text("Special characters are not allowed. Please use only letters, numbers, and spaces.")',
  doubleSpaceError = 'p:has-text("Please avoid using two or more consecutive spaces.")',
  InvalidEmailError = 'p:has-text("Invalid email address.")',
  SignInLInk = 'a[href="/sign-in"]',
}

