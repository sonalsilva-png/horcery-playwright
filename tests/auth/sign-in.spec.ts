
import { test, expect } from '@playwright/test';
import { SignInLocators, ForgotPasswordLocators, ForgotPasswordConfirmationLocators } from '../../locators/locators.enum';

test('Access the initial page', async ({ page }) => {
    await page.goto('https://app.horcery.com/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Accept All' }).click();
    const pageUrl = page.url();
    await page.waitForTimeout(3000);
    expect(pageUrl).toContain('https://app.horcery.com/');
});

test('Sign in with valid credentials', async ({ page }) => {
    await page.goto('https://app.horcery.com/sign-in', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Accept All' }).click();

    await page.locator(SignInLocators.EmailInput).fill('sonal.silva@atlaslabs.com.au');
    await page.locator(SignInLocators.PasswordInput).fill('testsonal123@');
    await page.locator(SignInLocators.SignInButton).click();

    await page.waitForTimeout(5000);
    await expect(page).toHaveURL(/welcome/);
});

test('Navigate to Sign Up Page', async ({ page }) => {
    await page.goto('https://app.horcery.com/sign-in', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Accept All' }).click();

    const signUpLink = page.locator(SignInLocators.SignUpLink);
    await page.waitForTimeout(2000);
    await signUpLink.click({ force: true });
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/sign-up/);
});

test('Sign In - Empty Email and Password Validation', async ({ page }) => {
    await page.goto('https://app.horcery.com/sign-in', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Accept All' }).click();

    await page.locator(SignInLocators.SignInButton).click({ force: true });

    await page.waitForTimeout(3000);

    const errorMessages = page.getByText('This field is required.');
    await expect(errorMessages).toHaveCount(2);
});

test('Sign In - Incorrect Password Validation', async ({ page }) => {
    await page.goto('https://app.horcery.com/sign-in', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Accept All' }).click();

    await page.locator(SignInLocators.EmailInput).fill('sonal.silva@atlaslabs.com.au');
    await page.locator(SignInLocators.PasswordInput).fill('wrongPassword123@');
    await page.locator(SignInLocators.SignInButton).click({ force: true });

    const toast = page.locator(SignInLocators.ToastContainer);
    await page.waitForTimeout(3000);
    await expect(toast).toHaveText(/Invalid email or password/);
});

test('Sign In - Incorrect Email Validation', async ({ page }) => {
    await page.goto('https://app.horcery.com/sign-in', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Accept All' }).click();

    await page.locator(SignInLocators.EmailInput).fill('invlaid.silva@atlaslabs.com.au');
    await page.locator(SignInLocators.PasswordInput).fill('testsonal123@');
    await page.locator(SignInLocators.SignInButton).click({ force: true });

    const toast = page.locator(SignInLocators.ToastContainer);
    await page.waitForTimeout(3000);
    await expect(toast).toHaveText(/Invalid email or password/);
});

test('Sign In - Password Input Mask and Visibility Toggle', async ({ page }) => {
    await page.goto('https://app.horcery.com/sign-in', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Accept All' }).click();

    const passwordField = page.locator(SignInLocators.PasswordInput);
    await passwordField.fill('TestPassword123!');

    await page.locator(SignInLocators.PasswordToggleIcon).click();
    await page.waitForTimeout(3000);
    await expect(passwordField).toHaveAttribute('type', 'text');

    await page.locator(SignInLocators.PasswordToggleIcon).click();
    await page.waitForTimeout(3000);
    await expect(passwordField).toHaveAttribute('type', 'password');
});

test('Sign In - Remember Me Checkbox Select/Deselect', async ({ page }) => {
    await page.goto('https://app.horcery.com/sign-in', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Accept All' }).click();

    const rememberMeCheckbox = page.locator(SignInLocators.RememberMeCheckbox);
    await expect(rememberMeCheckbox).not.toBeChecked();

    await rememberMeCheckbox.check();
    await page.waitForTimeout(3000);
    await expect(rememberMeCheckbox).toBeChecked();

    await rememberMeCheckbox.uncheck();
    await page.waitForTimeout(3000);
    await expect(rememberMeCheckbox).not.toBeChecked();
});


test.describe('Forgot Password Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://app.horcery.com/sign-in', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Accept All' }).click();

    await page.locator(SignInLocators.ForgotPasswordLink).click();
    await expect(page).toHaveURL(/forgot-password/);
  });

  test('Verify Forgot Password UI', async ({ page }) => {

    const emailInput = page.locator(ForgotPasswordLocators.EmailInput);
    const submitButton = page.locator(ForgotPasswordLocators.ResetButton);
    const backToSignInLink = page.locator(ForgotPasswordLocators.BackToSignInLink);

    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();
    await expect(backToSignInLink).toBeVisible();
  });

  test('Submit Email and Verify Success', async ({ page }) => {
    await page.locator(ForgotPasswordLocators.EmailInput).fill('sonal.silva@atlaslabs.com.au');
    await page.locator(ForgotPasswordLocators.ResetButton).click();

    const successMessage = page.locator(ForgotPasswordConfirmationLocators.SuccessMessage);
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toHaveText(/A reset password link has been sent/);

    await page.locator(ForgotPasswordConfirmationLocators.ReturnToSignInLink).click();
    await expect(page).toHaveURL('https://app.horcery.com/sign-in');
  });

});

