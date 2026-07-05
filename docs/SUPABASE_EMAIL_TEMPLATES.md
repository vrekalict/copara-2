# Copara — Supabase auth email templates

Copy **Subject** and **Message body** into Supabase Dashboard → **Authentication** → **Email Templates**.

These emails are sent by **Supabase Auth** (not Resend). Co-parent circle invites use Resend separately (`invites@copara.ca`).

### Sender addresses (@copara.ca)

| Address | Used for |
|---------|----------|
| `noreply@copara.ca` | **Supabase Auth SMTP** — magic link, confirm signup, password reset |
| `invites@copara.ca` | Co-parent circle invites (Resend, app code) |
| `digest@copara.ca` | Schedule digests (Resend, cron) |
| `hello@copara.ca` | Contact form forwards (Resend) |
| `support@copara.ca` | Human support — link in email footers only |

**Resend:** You do not create or pre-register individual sender addresses. Once `copara.ca` is verified in Resend, use any `@copara.ca` address in the `from` field (API) or Supabase SMTP sender field — e.g. `Copara <noreply@copara.ca>`. Footers still link to **support@** for human help.

---

## Before you paste templates

### 1. SMTP (required for production)

**Authentication → SMTP Settings**

| Field | Value |
|-------|--------|
| Host | `smtp.resend.com` |
| Port | `465` (SSL) or `587` (STARTTLS) |
| Username | `resend` |
| Password | Your `RESEND_API_KEY` |
| Sender email | `noreply@copara.ca` |
| Sender name | `Copara` (or use `Copara <noreply@copara.ca>` if the field accepts the combined format) |

Domain `copara.ca` must be **verified** in Resend (DNS records). No per-address setup in Resend after that.

### 2. URL settings

**Authentication → URL Configuration**

| Setting | Value |
|---------|--------|
| Site URL | `https://copara.ca` |
| Redirect URLs | `https://copara.ca/**` and `http://localhost:3000/**` (for local dev) |

Your app handles auth redirects at `/auth/callback`. Sign-up and magic-link flows already pass `emailRedirectTo` with a `next` param — keep `{{ .ConfirmationURL }}` in templates so Supabase builds the correct link.

### 3. Brand colours (reference)

| Token | Hex | Use |
|-------|-----|-----|
| Navy | `#111439` | Headings, button |
| Lilac | `#F8F8F9` | Email background |
| Accent | `#635BFF` | Links, eyebrow |
| Muted text | `#5C607A` | Body copy |
| Border | `#E4E5EB` | Dividers |

Support: `support@copara.ca`

---

## How to use this doc

1. Open the template in Supabase (e.g. **Magic link**).
2. Paste the **Subject** line.
3. Paste the full **HTML body** into the message editor (switch to source/HTML if the builder has a code view).
4. Click **Save changes**.
5. Send a test (magic link from `/sign-in`, etc.).

**Important:** Do not remove `{{ .ConfirmationURL }}` or `{{ .Token }}` where shown — Supabase replaces these at send time.

---

## Magic link or OTP

Used when someone chooses email sign-in link on `/sign-in`.

### Subject

```
Sign in to Copara
```

### Message body (HTML)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sign in to Copara</title>
</head>
<body style="margin:0;padding:0;background-color:#F8F8F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F8F8F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:#ffffff;border:1px solid #E4E5EB;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#111439;background-image:linear-gradient(135deg,rgba(99,91,255,0.42) 0%,rgba(168,85,247,0.32) 28%,rgba(255,107,157,0.28) 52%,rgba(255,178,36,0.22) 72%,rgba(34,211,238,0.26) 100%);padding:28px 32px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8B84FF;">Canadian co-parenting</p>
              <p style="margin:8px 0 0;font-size:22px;font-weight:700;line-height:1.25;color:#ffffff;">Copara</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;line-height:1.3;color:#111439;">Sign in to your account</h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#5C607A;">
                We received a request to sign in to Copara with <strong style="color:#111439;">{{ .Email }}</strong>.
                Click the button below to continue. This link expires soon and can only be used once.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 28px;">
                <tr>
                  <td style="border-radius:8px;background-color:#111439;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">Sign in to Copara</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 16px;font-size:13px;line-height:1.5;color:#5C607A;">
                Or enter this one-time code in the app:
              </p>
              <p style="margin:0 0 24px;font-size:28px;font-weight:700;letter-spacing:0.2em;color:#111439;">{{ .Token }}</p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#5C607A;">
                If you didn't request this email, you can safely ignore it. Someone may have typed your address by mistake.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #E4E5EB;background-color:#F8F8F9;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#5C607A;">
                Copara · Calmer co-parenting communication<br />
                <a href="https://copara.ca" style="color:#635BFF;text-decoration:none;">copara.ca</a>
                · Questions? <a href="mailto:support@copara.ca" style="color:#635BFF;text-decoration:none;">support@copara.ca</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Confirm sign up

Only sent if **Confirm email** is enabled under Authentication → Providers → Email. Your local config has it off; check production settings.

### Subject

```
Confirm your Copara account
```

### Message body (HTML)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Confirm your Copara account</title>
</head>
<body style="margin:0;padding:0;background-color:#F8F8F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F8F8F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:#ffffff;border:1px solid #E4E5EB;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#111439;background-image:linear-gradient(135deg,rgba(99,91,255,0.42) 0%,rgba(168,85,247,0.32) 28%,rgba(255,107,157,0.28) 52%,rgba(255,178,36,0.22) 72%,rgba(34,211,238,0.26) 100%);padding:28px 32px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8B84FF;">Canadian co-parenting</p>
              <p style="margin:8px 0 0;font-size:22px;font-weight:700;line-height:1.25;color:#ffffff;">Copara</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;line-height:1.3;color:#111439;">Confirm your email address</h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#5C607A;">
                Thanks for signing up for Copara. Confirm <strong style="color:#111439;">{{ .Email }}</strong> to finish creating your account and continue to setup.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 28px;">
                <tr>
                  <td style="border-radius:8px;background-color:#111439;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">Confirm email address</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#5C607A;">
                If you didn't create a Copara account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #E4E5EB;background-color:#F8F8F9;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#5C607A;">
                Copara · Calmer co-parenting communication<br />
                <a href="https://copara.ca" style="color:#635BFF;text-decoration:none;">copara.ca</a>
                · <a href="mailto:support@copara.ca" style="color:#635BFF;text-decoration:none;">support@copara.ca</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Reset password

Use when you add a forgot-password flow (or for manual resets from the dashboard).

### Subject

```
Reset your Copara password
```

### Message body (HTML)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Reset your Copara password</title>
</head>
<body style="margin:0;padding:0;background-color:#F8F8F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F8F8F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:#ffffff;border:1px solid #E4E5EB;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#111439;background-image:linear-gradient(135deg,rgba(99,91,255,0.42) 0%,rgba(168,85,247,0.32) 28%,rgba(255,107,157,0.28) 52%,rgba(255,178,36,0.22) 72%,rgba(34,211,238,0.26) 100%);padding:28px 32px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8B84FF;">Canadian co-parenting</p>
              <p style="margin:8px 0 0;font-size:22px;font-weight:700;line-height:1.25;color:#ffffff;">Copara</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;line-height:1.3;color:#111439;">Reset your password</h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#5C607A;">
                We received a request to reset the password for <strong style="color:#111439;">{{ .Email }}</strong>.
                Click below to choose a new password. This link expires soon.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 28px;">
                <tr>
                  <td style="border-radius:8px;background-color:#111439;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">Reset password</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#5C607A;">
                If you didn't request a password reset, you can safely ignore this email. Your password will not change.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #E4E5EB;background-color:#F8F8F9;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#5C607A;">
                Copara · Calmer co-parenting communication<br />
                <a href="https://copara.ca" style="color:#635BFF;text-decoration:none;">copara.ca</a>
                · <a href="mailto:support@copara.ca" style="color:#635BFF;text-decoration:none;">support@copara.ca</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Change email address

Only if users can change email in the app (not built yet — optional for later).

### Subject

```
Confirm your new email address for Copara
```

### Message body (HTML)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Confirm your new email</title>
</head>
<body style="margin:0;padding:0;background-color:#F8F8F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F8F8F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:#ffffff;border:1px solid #E4E5EB;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#111439;background-image:linear-gradient(135deg,rgba(99,91,255,0.42) 0%,rgba(168,85,247,0.32) 28%,rgba(255,107,157,0.28) 52%,rgba(255,178,36,0.22) 72%,rgba(34,211,238,0.26) 100%);padding:28px 32px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8B84FF;">Canadian co-parenting</p>
              <p style="margin:8px 0 0;font-size:22px;font-weight:700;line-height:1.25;color:#ffffff;">Copara</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;line-height:1.3;color:#111439;">Confirm your new email</h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#5C607A;">
                Confirm <strong style="color:#111439;">{{ .NewEmail }}</strong> as the new email address for your Copara account.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:0 0 28px;">
                <tr>
                  <td style="border-radius:8px;background-color:#111439;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">Confirm new email</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#5C607A;">
                If you didn't request this change, contact <a href="mailto:support@copara.ca" style="color:#635BFF;">support@copara.ca</a> immediately.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #E4E5EB;background-color:#F8F8F9;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#5C607A;">
                Copara · <a href="https://copara.ca" style="color:#635BFF;text-decoration:none;">copara.ca</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Reauthentication

Sensitive actions (rare today).

### Subject

```
Your Copara verification code
```

### Message body (HTML)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Verification code</title>
</head>
<body style="margin:0;padding:0;background-color:#F8F8F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F8F8F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:#ffffff;border:1px solid #E4E5EB;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#111439;padding:28px 32px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Copara</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#111439;">Verification code</h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#5C607A;">
                Enter this code to verify your identity. It expires shortly.
              </p>
              <p style="margin:0 0 24px;font-size:32px;font-weight:700;letter-spacing:0.25em;color:#111439;">{{ .Token }}</p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#5C607A;">
                If you didn't request this code, contact <a href="mailto:support@copara.ca" style="color:#635BFF;">support@copara.ca</a>.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Invite user (Supabase admin invite)

Copara **does not** use this for co-parent invites (those go through Resend). Only needed if you invite users from the Supabase dashboard.

### Subject

```
You're invited to Copara
```

### Message body (HTML)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>You're invited to Copara</title>
</head>
<body style="margin:0;padding:0;background-color:#F8F8F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F8F8F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:#ffffff;border:1px solid #E4E5EB;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#111439;background-image:linear-gradient(135deg,rgba(99,91,255,0.42) 0%,rgba(168,85,247,0.32) 28%,rgba(255,107,157,0.28) 52%,rgba(255,178,36,0.22) 72%,rgba(34,211,238,0.26) 100%);padding:28px 32px;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;">Copara</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#111439;">You've been invited</h1>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#5C607A;">
                You've been invited to create a Copara account. Accept the invitation to get started.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="border-radius:8px;background-color:#111439;">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">Accept invitation</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## Security notifications (optional)

Enable toggles under **Security** only when you want these sent. Use the **same branded layout** as the auth templates above (lilac outer background, gradient header, white card, footer) — not bare `<h2>` fragments.

Subjects:

| Template | Subject |
|----------|---------|
| Password changed | `Your Copara password was changed` |
| Email address changed | `Your Copara email address was changed` |
| Phone number changed | `Your Copara phone number was changed` |
| Sign-in method linked | `A sign-in method was linked to your Copara account` |
| Sign-in method removed | `A sign-in method was removed from your Copara account` |
| MFA method added | `A verification method was added to your Copara account` |
| MFA method removed | `A verification method was removed from your Copara account` |

### Password changed

**Subject:**

```
Your Copara password was changed
```

### Message body (HTML)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Your Copara password was changed</title>
</head>
<body style="margin:0;padding:0;background-color:#F8F8F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F8F8F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:#ffffff;border:1px solid #E4E5EB;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#111439;background-image:linear-gradient(135deg,rgba(99,91,255,0.42) 0%,rgba(168,85,247,0.32) 28%,rgba(255,107,157,0.28) 52%,rgba(255,178,36,0.22) 72%,rgba(34,211,238,0.26) 100%);padding:28px 32px;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8B84FF;">Security notice</p>
              <p style="margin:8px 0 0;font-size:22px;font-weight:700;line-height:1.25;color:#ffffff;">Copara</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;line-height:1.3;color:#111439;">Your password was changed</h1>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#5C607A;">
                The password for your Copara account (<strong style="color:#111439;">{{ .Email }}</strong>) was recently changed.
              </p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#5C607A;">
                If you didn't make this change, reset your password immediately and contact
                <a href="mailto:support@copara.ca" style="color:#635BFF;text-decoration:none;">support@copara.ca</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #E4E5EB;background-color:#F8F8F9;">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#5C607A;">
                Copara · Calmer co-parenting communication<br />
                <a href="https://copara.ca" style="color:#635BFF;text-decoration:none;">copara.ca</a>
                · <a href="mailto:support@copara.ca" style="color:#635BFF;text-decoration:none;">support@copara.ca</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### Other security templates

Copy the **Password changed** HTML above and only replace the `<h1>` and body `<p>` block. Keep the header, footer, and table structure identical.

| Template | `<h1>` text | Body copy (use Supabase variables) |
|----------|-------------|-------------------------------------|
| Email address changed | Your email address was changed | The email for your Copara account was changed from **{{ .OldEmail }}** to **{{ .Email }}**. If you didn't make this change, contact support@copara.ca immediately. |
| Phone number changed | Your phone number was changed | The phone number for your Copara account was changed from **{{ .OldPhone }}** to **{{ .Phone }}**. If you didn't make this change, contact support@copara.ca immediately. |
| Sign-in method linked | A sign-in method was linked | Your **{{ .Provider }}** account was linked as a sign-in method for **{{ .Email }}**. If you didn't make this change, contact support@copara.ca immediately. |
| Sign-in method removed | A sign-in method was removed | Your **{{ .Provider }}** account was removed as a sign-in method for **{{ .Email }}**. If you didn't make this change, contact support@copara.ca immediately. |
| MFA method added | A verification method was added | Sign-in verification method **{{ .FactorType }}** was added to your Copara account. If you didn't make this change, contact support@copara.ca immediately. |
| MFA method removed | A verification method was removed | Sign-in verification method **{{ .FactorType }}** was removed from your Copara account. If you didn't make this change, contact support@copara.ca immediately. |

For the header eyebrow on security emails, use `Security notice` instead of `Canadian co-parenting`.

---

## French versions (optional)

For Quebec users you may eventually want French templates. Supabase does not auto-localize — you would need separate copy or conditional logic via `{{ .Data }}` metadata if you pass `locale` in `user_metadata` at signup.

Example subject lines:

| English | French |
|---------|--------|
| Sign in to Copara | Connectez-vous à Copara |
| Confirm your Copara account | Confirmez votre compte Copara |
| Reset your Copara password | Réinitialisez votre mot de passe Copara |

---

## Testing checklist

- [ ] Resend domain `copara.ca` verified (SPF/DKIM) — any `@copara.ca` sender works after that
- [ ] Supabase SMTP saved with sender `noreply@copara.ca` (or `Copara <noreply@copara.ca>`)
- [ ] Site URL = `https://copara.ca`
- [ ] Magic link from `/sign-in` arrives, button works, lands in app
- [ ] Link opens in incognito (not prefetched/expired)
- [ ] If confirm-email is on: signup → confirm → redirects to `/subscribe` or `/join/...` as expected

---

## Not covered here (app emails via Resend)

These are sent by the Next.js app, not Supabase templates:

| Email | From address | Config |
|-------|--------------|--------|
| Co-parent circle invite | `invites@copara.ca` | `RESEND_API_KEY` in Vercel |
| Weekly digest | `digest@copara.ca` | Cron + Resend |
| Contact form | `hello@copara.ca` | Resend |

To brand those, edit the HTML in `src/actions/circles.ts`, `src/lib/cron/digest-email.ts`, etc., or extract a shared email layout later.
