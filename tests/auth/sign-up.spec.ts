import { test, expect } from '@playwright/test';
import { SignUpLocators, SignInLocators } from '../../locators/locators.enum';

test.describe('Sign Up flow', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://app.horcery.com/sign-up');
        await page.getByRole('button', { name: 'Accept All' }).click();
        await expect(page).toHaveURL(/sign-up/);
    });

    test('Basic UI Checks', async ({ page }) => {

        await expect(page.locator(SignUpLocators.FirstNameInput)).toBeVisible();
        await expect(page.locator(SignUpLocators.LastNameInput)).toBeVisible();
        await expect(page.locator(SignUpLocators.EmailInput)).toBeVisible();
        await expect(page.locator(SignUpLocators.CreateAccountButton)).toBeVisible();
        await expect(page.locator(SignUpLocators.CreateAccountHeading)).toBeVisible();
        // await expect(page.locator(SignUpLocators.GoogleSignUpButton)).toBeVisible();
        // await expect(page.locator(SignUpLocators.AppleSignUpButton)).toBeVisible();
        await expect(page.locator(SignUpLocators.SignInLink)).toBeVisible();
        await expect(page.locator(SignUpLocators.HorceryLogo)).toBeVisible();
    });

    test('Verify default field state', async ({ page }) => {
        await expect(page.locator(SignUpLocators.FirstNameInput)).toHaveValue('');
        await expect(page.locator(SignUpLocators.LastNameInput)).toHaveValue('');
        await expect(page.locator(SignUpLocators.EmailInput)).toHaveValue('');
        await expect(page.locator(SignUpLocators.CreateAccountButton)).toBeEnabled();
    });

    test('Positive: All Valid', async ({ page }) => {
        const randomNumber = Math.floor(Math.random() * 100000);
        const randomEmail = `qa_devtest+${randomNumber}@atlaslabs.com.au`;

        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.LastNameInput).fill('Smith');
        await page.locator(SignUpLocators.EmailInput).fill(randomEmail);

        await expect(page.locator(SignUpLocators.FirstNameInput)).toHaveValue('Jane');
        await expect(page.locator(SignUpLocators.LastNameInput)).toHaveValue('Smith');
        await expect(page.locator(SignUpLocators.EmailInput)).toHaveValue(randomEmail);

        await page.locator(SignUpLocators.CreateAccountButton).click();

        await expect(page).toHaveURL(/verify-email/);

        const toast = page.locator(SignInLocators.ToastContainer);
        await expect(toast).toHaveText(/A verification link has been sent to your email/);
    });

    test('Negative: First Name - Empty field', async ({ page }) => {
        const randomNumber = Math.floor(Math.random() * 100000);
        const randomEmail = `qa_devtest+${randomNumber}@atlaslabs.com.au`;

        await page.locator(SignUpLocators.LastNameInput).fill('Doe');
        await page.locator(SignUpLocators.EmailInput).fill(randomEmail);

        await page.locator(SignUpLocators.CreateAccountButton).click();

        const requiredFieldError = page.locator(SignUpLocators.RequiredFieldError).nth(0);
        await expect(requiredFieldError).toBeVisible();
        await expect(requiredFieldError).toHaveText('This field is required.');
    });

    test('Negative: First Name - Begins with Space', async ({ page }) => {
        await page.locator(SignUpLocators.FirstNameInput).fill(' ');
        await page.locator(SignUpLocators.LastNameInput).fill('Doe');
        await page.locator(SignUpLocators.EmailInput).fill('user@example.com');

        await page.locator(SignUpLocators.CreateAccountButton).click();

        const space = page.locator(SignUpLocators.SpaceError).nth(0);
        await expect(space).toBeVisible();
        await expect(space).toHaveText('The name cannot begin with a space. Please start with a valid character.');

    });

    test('Positive: First Name - Numbers Only', async ({ page }) => {
        const randomNumber = Math.floor(Math.random() * 100000);
        const randomEmail = `qa_devtest+${randomNumber}@atlaslabs.com.au`;

        await page.locator(SignUpLocators.FirstNameInput).fill('1234');
        await page.locator(SignUpLocators.LastNameInput).fill('Doe');
        await page.locator(SignUpLocators.EmailInput).fill(randomEmail);

        await expect(page.locator(SignUpLocators.FirstNameInput)).toHaveValue('1234');
        await expect(page.locator(SignUpLocators.LastNameInput)).toHaveValue('Doe');
        await expect(page.locator(SignUpLocators.EmailInput)).toHaveValue(randomEmail);

        await page.locator(SignUpLocators.CreateAccountButton).click();

        await expect(page.locator(SignUpLocators.SpaceError)).not.toBeVisible();

        await expect(page).toHaveURL(/verify-email/);

        const toast = page.locator(SignInLocators.ToastContainer);
        await expect(toast).toHaveText(/A verification link has been sent to your email/);
    });

    test('Negative: First Name - Special Characters', async ({ page }) => {
        await page.locator(SignUpLocators.FirstNameInput).fill('Jane@#$%');
        await page.locator(SignUpLocators.LastNameInput).fill('Doe');
        await page.locator(SignUpLocators.EmailInput).fill('user@example.com');

        await page.locator(SignUpLocators.CreateAccountButton).click();

        await expect(page.locator('text=Special characters are not allowed')).toBeVisible();
        await expect(page.locator('text=Please use only letters, numbers, and spaces')).toBeVisible();


        const specialCharacterError = page.locator(SignUpLocators.SpecialCharacterError);
        await expect(specialCharacterError).toBeVisible();
        await expect(specialCharacterError).toHaveText('Special characters are not allowed. Please use only letters, numbers, and spaces.');
    });

    test('Positive: First Name - Mixed Characters (Letters and Numbers)', async ({ page }) => {
        const randomNumber = Math.floor(Math.random() * 100000);
        const randomEmail = `qa_devtest+${randomNumber}@atlaslabs.com.au`;

        await page.locator(SignUpLocators.FirstNameInput).fill('Jane123');
        await page.locator(SignUpLocators.LastNameInput).fill('Doe');
        await page.locator(SignUpLocators.EmailInput).fill(randomEmail);

        await expect(page.locator(SignUpLocators.FirstNameInput)).toHaveValue('Jane123');
        await expect(page.locator(SignUpLocators.LastNameInput)).toHaveValue('Doe');
        await expect(page.locator(SignUpLocators.EmailInput)).toHaveValue(randomEmail);

        await page.locator(SignUpLocators.CreateAccountButton).click();

        await expect(page).toHaveURL(/verify-email/);
        const toast = page.locator(SignInLocators.ToastContainer);
        await expect(toast).toHaveText(/A verification link has been sent to your email/);
    });

    test('Negative: First Name - Two or More Consecutive Spaces', async ({ page }) => {
        // Fill with consecutive spaces - should not be allowed
        await page.locator(SignUpLocators.FirstNameInput).fill('Jane  Doe');
        await page.locator(SignUpLocators.LastNameInput).fill('Smith');
        await page.locator(SignUpLocators.EmailInput).fill('user@example.com');

        await page.locator(SignUpLocators.CreateAccountButton).click();

        const doubleSpaceError = page.locator(SignUpLocators.doubleSpaceError);
        await expect(doubleSpaceError).toBeVisible();
        await expect(doubleSpaceError).toHaveText('Please avoid using two or more consecutive spaces.');
    });

    test('Positive: First Name - Keeping one space between a name', async ({ page }) => {
        const randomNumber = Math.floor(Math.random() * 100000);
        const randomEmail = `qa_devtest+${randomNumber}@atlaslabs.com.au`;

        await page.locator(SignUpLocators.FirstNameInput).fill('Jane Doe');
        await page.locator(SignUpLocators.LastNameInput).fill('Smith');
        await page.locator(SignUpLocators.EmailInput).fill(randomEmail);

        await page.locator(SignUpLocators.CreateAccountButton).click();

        await expect(page).toHaveURL(/verify-email/);
        const toast = page.locator(SignInLocators.ToastContainer);
        await expect(toast).toHaveText(/A verification link has been sent to your email/);
    });


    test('Negative: Last Name - Empty field', async ({ page }) => {
        const randomNumber = Math.floor(Math.random() * 100000);
        const randomEmail = `qa_devtest+${randomNumber}@atlaslabs.com.au`;

        // Fill First Name and Email, leave Last Name empty
        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.EmailInput).fill(randomEmail);

        await page.locator(SignUpLocators.CreateAccountButton).click();

        const requiredFieldError = page.locator(SignUpLocators.RequiredFieldError)
        await expect(requiredFieldError).toBeVisible();
        await expect(requiredFieldError).toHaveText('This field is required.');
    });

    test('Negative: Last Name - Begins with Space', async ({ page }) => {
        await page.locator(SignUpLocators.LastNameInput).fill(' ');
        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.EmailInput).fill('user@example.com');

        await page.locator(SignUpLocators.CreateAccountButton).click();

        const spaceError = page.locator(SignUpLocators.SpaceError)
        await expect(spaceError).toBeVisible();
        await expect(spaceError).toHaveText('The name cannot begin with a space. Please start with a valid character.');
    });

    test('Positive: Last Name - Numbers Only', async ({ page }) => {
        const randomNumber = Math.floor(Math.random() * 100000);
        const randomEmail = `qa_devtest+${randomNumber}@atlaslabs.com.au`;

        await page.locator(SignUpLocators.LastNameInput).fill('1234');
        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.EmailInput).fill(randomEmail);

        await expect(page.locator(SignUpLocators.LastNameInput)).toHaveValue('1234');
        await expect(page.locator(SignUpLocators.FirstNameInput)).toHaveValue('Jane');
        await expect(page.locator(SignUpLocators.EmailInput)).toHaveValue(randomEmail);

        await page.locator(SignUpLocators.CreateAccountButton).click();

        await expect(page.locator(SignUpLocators.SpaceError)).not.toBeVisible();
        await expect(page).toHaveURL(/verify-email/);

        const toast = page.locator(SignInLocators.ToastContainer);
        await expect(toast).toHaveText(/A verification link has been sent to your email/);
    });

    test('Negative: Last Name - Special Characters', async ({ page }) => {
        await page.locator(SignUpLocators.LastNameInput).fill('Doe@#$%');
        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.EmailInput).fill('user@example.com');

        await page.locator(SignUpLocators.CreateAccountButton).click();

        const specialCharacterError = page.locator(SignUpLocators.SpecialCharacterError);
        await expect(specialCharacterError).toBeVisible();
        await expect(specialCharacterError).toHaveText('Special characters are not allowed. Please use only letters, numbers, and spaces.');
    });

    test('Positive: Last Name - Mixed Characters (Letters and Numbers)', async ({ page }) => {
        const randomNumber = Math.floor(Math.random() * 100000);
        const randomEmail = `qa_devtest+${randomNumber}@atlaslabs.com.au`;

        await page.locator(SignUpLocators.LastNameInput).fill('Doe123');
        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.EmailInput).fill(randomEmail);

        await expect(page.locator(SignUpLocators.LastNameInput)).toHaveValue('Doe123');
        await expect(page.locator(SignUpLocators.FirstNameInput)).toHaveValue('Jane');
        await expect(page.locator(SignUpLocators.EmailInput)).toHaveValue(randomEmail);

        await page.locator(SignUpLocators.CreateAccountButton).click();

        await expect(page).toHaveURL(/verify-email/);
        const toast = page.locator(SignInLocators.ToastContainer);
        await expect(toast).toHaveText(/A verification link has been sent to your email/);
    });

    test('Negative: Last Name - Two or More Consecutive Spaces', async ({ page }) => {
        await page.locator(SignUpLocators.LastNameInput).fill('Doe  Smith');
        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.EmailInput).fill('user@example.com');

        await page.locator(SignUpLocators.CreateAccountButton).click();

        const doubleSpaceError = page.locator(SignUpLocators.doubleSpaceError);
        await expect(doubleSpaceError).toBeVisible();
        await expect(doubleSpaceError).toHaveText('Please avoid using two or more consecutive spaces.');
    });

    test('Positive: Last Name - Keeping one space between names', async ({ page }) => {
        const randomNumber = Math.floor(Math.random() * 100000);
        const randomEmail = `qa_devtest+${randomNumber}@atlaslabs.com.au`;

        await page.locator(SignUpLocators.LastNameInput).fill('Doe Smith');
        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.EmailInput).fill(randomEmail);

        await page.locator(SignUpLocators.CreateAccountButton).click();

        await expect(page).toHaveURL(/verify-email/);
        const toast = page.locator(SignInLocators.ToastContainer);
        await expect(toast).toHaveText(/A verification link has been sent to your email/);
    });

    test('Negative: Email - Empty field', async ({ page }) => {
        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.LastNameInput).fill('Doe');

        await page.locator(SignUpLocators.CreateAccountButton).click();

        const requiredFieldError = page.locator(SignUpLocators.RequiredFieldError);
        await expect(requiredFieldError).toBeVisible();
        await expect(requiredFieldError).toHaveText('This field is required.');
    });

    test('Negative: Missing @ symbol in Email', async ({ page }) => {
        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.LastNameInput).fill('Doe');
        await page.locator(SignUpLocators.EmailInput).fill('userexample.com');

        await page.locator(SignUpLocators.CreateAccountButton).click();

        const emailError = page.locator(SignUpLocators.InvalidEmailError);
        await expect(emailError).toBeVisible();
        await expect(emailError).toHaveText('Invalid email address.');
    });

    test('Negative: Missing domain in Email', async ({ page }) => {
        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.LastNameInput).fill('Doe');
        await page.locator(SignUpLocators.EmailInput).fill('user@');

        await page.locator(SignUpLocators.CreateAccountButton).click();

        const emailError = page.locator(SignUpLocators.InvalidEmailError);
        await expect(emailError).toBeVisible();
        await expect(emailError).toHaveText('Invalid email address.');
    });

    test('Negative: Missing username in Email', async ({ page }) => {
        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.LastNameInput).fill('Doe');
        await page.locator(SignUpLocators.EmailInput).fill('@example.com');

        await page.locator(SignUpLocators.CreateAccountButton).click();

        const emailError = page.locator(SignUpLocators.InvalidEmailError);
        await expect(emailError).toBeVisible();
        await expect(emailError).toHaveText('Invalid email address.');
    });

    test('Negative: Special Characters in Email', async ({ page }) => {

        const randomNumber = Math.floor(Math.random() * 100000);
        const randomEmail = `user${randomNumber}#!@example.com`;

        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.LastNameInput).fill('Doe');
        await page.locator(SignUpLocators.EmailInput).fill(randomEmail);

        await page.locator(SignUpLocators.CreateAccountButton).click();

        const emailError = page.locator(SignUpLocators.InvalidEmailError);
        await expect(emailError).toBeVisible();
        await expect(emailError).toHaveText('Invalid email address.');
    });

    test('Negative: Consecutive Spaces in Email', async ({ page }) => {

        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.LastNameInput).fill('Doe');
        await page.locator(SignUpLocators.EmailInput).fill('user@'.concat('\u0020example.com'));

        await page.locator(SignUpLocators.CreateAccountButton).click();

        const emailError = page.locator(SignUpLocators.InvalidEmailError);
        await expect(emailError).toBeVisible();
        await expect(emailError).toHaveText('Invalid email address.');
    });

    test('Negative: Multiple @ Symbols in Email', async ({ page }) => {

        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.LastNameInput).fill('Doe');
        await page.locator(SignUpLocators.EmailInput).fill('user@@example.com');

        await page.locator(SignUpLocators.CreateAccountButton).click();

        const emailError = page.locator(SignUpLocators.InvalidEmailError);
        await expect(emailError).toBeVisible();
        await expect(emailError).toHaveText('Invalid email address.');
    });

    test('All Fields Empty Validation', async ({ page }) => {
        await page.locator(SignUpLocators.CreateAccountButton).click();

        const requiredFieldErrors = page.locator(SignUpLocators.RequiredFieldError);
        await expect(requiredFieldErrors).toHaveCount(3);
    });

    test('Partial Fields Filled Validation', async ({ page }) => {
        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.CreateAccountButton).click();

        const requiredFieldErrors = page.locator(SignUpLocators.RequiredFieldError);
        await expect(requiredFieldErrors).toHaveCount(2);
    });

    test('Uppercase email Validation', async ({ page }) => {
        const randomNumber = Math.floor(Math.random() * 100000);
        const randomEmail = `QA_DEVTEST+${randomNumber}@ATLASLABS.COM.AU`;

        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.LastNameInput).fill('Doe');
        await page.locator(SignUpLocators.EmailInput).fill(randomEmail);

        await page.locator(SignUpLocators.CreateAccountButton).click();
        await expect(page).toHaveURL(/verify-email/);

        const toast = page.locator(SignInLocators.ToastContainer);
        await expect(toast).toHaveText(/A verification link has been sent to your email/);
    });

    test('Mixed Case email Validation', async ({ page }) => {
        const randomNumber = Math.floor(Math.random() * 100000);
        const randomEmail = `Qa_devtest+${randomNumber}@Atlaslabs.com.au`;

        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.LastNameInput).fill('Doe');
        await page.locator(SignUpLocators.EmailInput).fill(randomEmail);

        await page.locator(SignUpLocators.CreateAccountButton).click();
        await expect(page).toHaveURL(/verify-email/);

        const toast = page.locator(SignInLocators.ToastContainer);
        await expect(toast).toHaveText(/A verification link has been sent to your email/);
    });

    test('Already registered email Validation', async ({ page }) => {
        await page.locator(SignUpLocators.FirstNameInput).fill('Jane');
        await page.locator(SignUpLocators.LastNameInput).fill('Doe');
        await page.locator(SignUpLocators.EmailInput).fill('qa_devtest+500@atlaslabs.com.au');

        await page.locator(SignUpLocators.CreateAccountButton).click();

        const toast = page.locator(SignInLocators.ToastContainer);
        await expect(toast).toHaveText(/A user account with your corresponding email may or may not already exist. Please try resetting your password or contacting support for further assistance./);
    });

    test('Navigate to Sign In Page', async ({ page }) => {
        const signInLink = page.locator(SignUpLocators.SignInLink);
        await signInLink.click({ force: true });
        await expect(page).toHaveURL(/sign-in/);
    });




});
