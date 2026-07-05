export function parseLegalFromForm(formData: FormData) {
  const province = String(formData.get("province") ?? "").trim();
  const acceptedLegal = formData.get("acceptedLegal") === "true";
  const confirmedFrenchAccess = formData.get("confirmedFrenchAccess") === "true";

  return {
    province,
    acceptedTerms: acceptedLegal,
    acceptedPrivacy: acceptedLegal,
    confirmedFrenchAccess,
  };
}

export function validateLegalForm(legal: ReturnType<typeof parseLegalFromForm>) {
  if (!legal.province) {
    return "Please select your province or territory.";
  }
  if (!legal.acceptedTerms || !legal.acceptedPrivacy) {
    return "You must agree to the Terms and Privacy Policy.";
  }
  if (legal.province.trim().toLowerCase() === "quebec" && !legal.confirmedFrenchAccess) {
    return "Quebec users must confirm access to the French legal documents before continuing in English.";
  }
  return null;
}
