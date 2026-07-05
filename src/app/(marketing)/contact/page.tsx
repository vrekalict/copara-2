import { ContactForm } from "@/components/marketing/contact-form";
import { JsonLd } from "@/components/marketing/json-ld";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/marketing/section";
import { pageMetadata } from "@/lib/marketing/metadata";
import { contactPageSchema } from "@/lib/marketing/schema";
import { SITE } from "@/lib/marketing/site";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Contact the Copara team for support, privacy requests, and professional design partner inquiries. Email ${SITE.supportEmail}.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageSchema()} />
      <PageHero
        title="Get in touch"
        description="Questions about Sign up, privacy, or the design partner program? Send a message or email us directly."
      />
      <Section variant="cream" className="pt-0 md:pb-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-medium text-slate-heading">General</dt>
                <dd className="text-muted-foreground">
                  <a href={`mailto:${SITE.contactEmail}`} className="hover:text-primary">
                    {SITE.contactEmail}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-heading">Support</dt>
                <dd className="text-muted-foreground">
                  <a href={`mailto:${SITE.supportEmail}`} className="hover:text-primary">
                    {SITE.supportEmail}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-slate-heading">Privacy</dt>
                <dd className="text-muted-foreground">
                  <a href="mailto:privacy@copara.ca" className="hover:text-primary">
                    privacy@copara.ca
                  </a>
                </dd>
              </div>
            </dl>
          </div>
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
