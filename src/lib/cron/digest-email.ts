import { Resend } from "resend";
import type { DetectedViolation } from "@/lib/schedule/violations";
import { BRAND, brandEmailFrom } from "@/lib/brand";

export async function sendWeeklyDigestEmail(options: {
  to: string[];
  circleName: string;
  violations: DetectedViolation[];
  upcomingCount: number;
}) {
  if (!process.env.RESEND_API_KEY || options.to.length === 0) {
    return { sent: false, reason: "no_resend_or_recipients" as const };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const violationLines =
    options.violations.length === 0
      ? "<p>No schedule violations detected this week.</p>"
      : `<ul>${options.violations
          .map(
            (v) =>
              `<li><strong>${v.kind}</strong>: ${v.event_title} (${new Date(v.starts_at).toLocaleString()})${v.delta_minutes ? ` (${v.delta_minutes} min late)` : ""}</li>`,
          )
          .join("")}</ul>`;

  const html = `
    <h1>${BRAND.name} weekly digest: ${options.circleName}</h1>
    <p>Here's your co-parenting summary for the past week.</p>
    <h2>Schedule violations</h2>
    ${violationLines}
    <h2>Upcoming</h2>
    <p>${options.upcomingCount} exchange or parenting-time event(s) in the next 7 days.</p>
    <p style="color:#666;font-size:12px">${BRAND.name}: tamper-evident co-parenting records. Not legal advice.</p>
  `;

  await resend.emails.send({
    from: brandEmailFrom("digest"),
    to: options.to,
    subject: `${BRAND.name} weekly digest: ${options.circleName}`,
    html,
  });

  return { sent: true as const };
}
