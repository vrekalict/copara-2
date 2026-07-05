import { CoparentingGuidePageContent } from "@/components/marketing/coparenting-guide-content";
import { JsonLd } from "@/components/marketing/json-ld";
import {
  GUIDE_CLOSING,
  GUIDE_HIGHLIGHTS,
  GUIDE_INTRO,
  GUIDE_MISTAKES,
  GUIDE_QUICK_WINS,
  GUIDE_SECTIONS,
} from "@/content/marketing/coparenting-guide.en";
import { pageMetadata } from "@/lib/marketing/metadata";
import { webPageSchema } from "@/lib/marketing/schema";

export const metadata = pageMetadata({
  title: "Co-parenting guide",
  description:
    "Practical guide for Canadian separated parents: shared calendars, documented messages, expense records, document vaults, exports, and habits that keep children out of conflict.",
  path: "/coparenting-guide",
});

export default function CoparentingGuidePage() {
  return (
    <>
      <JsonLd
        data={webPageSchema(
          "Co-parenting guide",
          "/coparenting-guide",
          "Practical co-parenting guide for separated parents in Canada.",
        )}
      />
      <CoparentingGuidePageContent
        intro={GUIDE_INTRO}
        highlights={GUIDE_HIGHLIGHTS}
        quickWins={GUIDE_QUICK_WINS}
        sections={GUIDE_SECTIONS}
        mistakes={GUIDE_MISTAKES}
        closing={GUIDE_CLOSING}
        langSwitch={{ label: "Version française", href: "/fr/guide-coparentalite" }}
        quickWinsTitle="Start here: five quick wins"
        mistakesTitle="Common mistakes to avoid"
        tocTitle="In this guide"
        checklistTitle="What to do"
      />
    </>
  );
}
