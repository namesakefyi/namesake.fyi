import { afterEach, describe, expect, it, vi } from "vitest";
import { getPdfForm } from "@/pdfs/utils/getPdfForm";
import cjp25PetitionToChangeNameOfMinor from ".";

describe("Petition to Change Name of Minor", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  const testData = {
    oldFirstName: "Old",
    oldMiddleName: "M",
    oldLastName: "Name",
    newFirstName: "New",
    newMiddleName: "N",
    newLastName: "Name",
    birthplaceCity: "Boston",
    birthplaceState: "MA",
    dateOfBirth: "2015-06-15",
    residenceCounty: "Suffolk",
    isMailingAddressDifferentFromResidence: true,
    mailingStreetAddress: "456 Post St",
    mailingCity: "Boston",
    mailingState: "MA",
    mailingZipCode: "02110",
    isOkayToSharePronouns: true,
    pronouns: ["She/Her"],
    // New fields for minor petition
    isPresentedByLegalMotherParent1: true,
    isPresentedByLegalFatherParent2: false,
    isPresentedByCourtAppointedGuardian: false,
    parent1FullName: "Jane Doe",
    parent1StreetAddress: "123 Parent St",
    parent1City: "Cambridge",
    parent1State: "MA",
    parent1ZipCode: "02139",
    parent1Phone: "555-111-1111",
    parent1Email: "parent1@example.com",
    parent2FullName: "John Doe",
    parent2StreetAddress: "456 Father Ave",
    parent2City: "Somerville",
    parent2State: "MA",
    parent2ZipCode: "02144",
    parent2Phone: "555-222-2222",
    parent2Email: "parent2@example.com",
    isParent1Assenting: true,
    isParent2Assenting: true,
    guardianFullName: "",
    coGuardianFullName: "",
    guardianStreetAddress: "",
    guardianCity: "",
    guardianState: "",
    guardianZipCode: "",
    coGuardianStreetAddress: "",
    coGuardianCity: "",
    coGuardianState: "",
    coGuardianZipCode: "",
    guardianPhone: "",
    coGuardianPhone: "",
    guardianEmail: "",
    coGuardianEmail: "",
    isAllGuardiansAssenting: false,
    hasNoCourtAppointedGuardian: true,
    hasCourtAppointedGuardian: false,
    reasonForChangingName: "Preferred name",
    isInterpreterNeededForChild: false,
    isInterpreterNeededForParent1: false,
    isInterpreterNeededForParent2: false,
    isInterpreterNeededForGuardian: false,
    languages: "",
    hasPreviousNameChange: false,
  };

  it("maps fields correctly to the PDF", async () => {
    vi.setSystemTime(new Date(2025, 5, 15)); // Jun 15, 2025 — child turns 10
    const form = await getPdfForm({
      pdf: cjp25PetitionToChangeNameOfMinor,
      userData: testData,
    });

    expect(form.getTextField("petitionerFirstName").getText()).toBe("Old");
    expect(form.getTextField("petitionerMiddleName").getText()).toBe("M");
    expect(form.getTextField("petitionerLastName").getText()).toBe("Name");
    expect(form.getTextField("oldFirstName").getText()).toBe("Old");
    expect(form.getTextField("oldMiddleName").getText()).toBe("M");
    expect(form.getTextField("oldLastName").getText()).toBe("Name");
    expect(form.getTextField("newFirstName").getText()).toBe("New");
    expect(form.getTextField("newMiddleName").getText()).toBe("N");
    expect(form.getTextField("newLastName").getText()).toBe("Name");
    expect(form.getTextField("birthplaceCity").getText()).toBe("Boston");
    expect(form.getTextField("birthplaceState").getText()).toBe("MA");
    expect(form.getTextField("dateOfBirth").getText()).toBe("06/15/2015");
    expect(form.getTextField("county").getText()).toBe("Suffolk");
    expect(form.getTextField("currentAge").getText()).toBe("10");
    expect(form.getTextField("mailingStreetAddress").getText()).toBe(
      "456 Post St",
    );
    expect(form.getTextField("mailingCity").getText()).toBe("Boston");
    expect(form.getTextField("mailingState").getText()).toBe("MA");
    expect(form.getTextField("mailingZipCode").getText()).toBe("02110");
    expect(
      form.getCheckBox("isPresentedByLegalMotherParent1").isChecked(),
    ).toBe(true);
    expect(
      form.getCheckBox("isPresentedByLegalFatherParent2").isChecked(),
    ).toBe(false);
    expect(
      form.getCheckBox("isPresentedByCourtAppointedGuardian").isChecked(),
    ).toBe(false);
    expect(form.getTextField("parent1FullName").getText()).toBe("Jane Doe");
    expect(form.getTextField("parent1StreetAddress").getText()).toBe(
      "123 Parent St",
    );
    expect(form.getTextField("parent1City").getText()).toBe("Cambridge");
    expect(form.getTextField("parent1State").getText()).toBe("MA");
    expect(form.getTextField("parent1ZipCode").getText()).toBe("02139");
    expect(form.getTextField("parent1Phone").getText()).toBe("555-111-1111");
    expect(form.getTextField("parent1Email").getText()).toBe(
      "parent1@example.com",
    );
    expect(form.getTextField("parent2FullName").getText()).toBe("John Doe");
    expect(form.getTextField("parent2StreetAddress").getText()).toBe(
      "456 Father Ave",
    );
    expect(form.getTextField("parent2City").getText()).toBe("Somerville");
    expect(form.getTextField("parent2State").getText()).toBe("MA");
    expect(form.getTextField("parent2ZipCode").getText()).toBe("02144");
    expect(form.getTextField("parent2Phone").getText()).toBe("555-222-2222");
    expect(form.getTextField("parent2Email").getText()).toBe(
      "parent2@example.com",
    );
    expect(form.getCheckBox("isParent1AssentingTrue").isChecked()).toBe(true);
    expect(form.getCheckBox("isParent1AssentingFalse").isChecked()).toBe(false);
    expect(form.getCheckBox("isParent2AssentingTrue").isChecked()).toBe(true);
    expect(form.getCheckBox("isParent2AssentingFalse").isChecked()).toBe(false);
    expect(form.getCheckBox("hasNoCountAppointedGuardian").isChecked()).toBe(
      true,
    );
    expect(form.getCheckBox("isChildUnder12").isChecked()).toBe(true);
    expect(form.getTextField("reasonForChangingName").getText()).toBe(
      "Preferred name",
    );
    expect(form.getCheckBox("isOkayToSharePronouns").isChecked()).toBe(true);
    expect(form.getTextField("pronouns").getText()).toBe("She/Her");
  });

  it("shows previous name change when it exists", async () => {
    vi.setSystemTime(new Date(2025, 5, 15));
    const dataWithPreviousNameChange = {
      ...testData,
      hasPreviousNameChange: true,
      previousNameFrom: "Old Name",
      previousNameTo: "New Name",
      previousNameReason: "Marriage",
    };

    const form = await getPdfForm({
      pdf: cjp25PetitionToChangeNameOfMinor,
      userData: dataWithPreviousNameChange,
    });

    expect(form.getCheckBox("hasPreviousNameChangeTrue").isChecked()).toBe(
      true,
    );
    expect(form.getCheckBox("hasPreviousNameChangeFalse").isChecked()).toBe(
      false,
    );
    expect(form.getTextField("previousNameFrom").getText()).toBe("Old Name");
    expect(form.getTextField("previousNameTo").getText()).toBe("New Name");
    expect(form.getTextField("previousNameReason").getText()).toBe("Marriage");
  });

  it("does not show mailing address when same as residence", async () => {
    vi.setSystemTime(new Date(2025, 5, 15));
    const dataWithSameAddress = {
      ...testData,
      isMailingAddressDifferentFromResidence: false,
    };

    const form = await getPdfForm({
      pdf: cjp25PetitionToChangeNameOfMinor,
      userData: dataWithSameAddress,
    });

    expect(form.getTextField("mailingStreetAddress").getText() ?? "").toBe("");
    expect(form.getTextField("mailingCity").getText() ?? "").toBe("");
  });

  it("shows parent dissent reason when parent does not assent", async () => {
    vi.setSystemTime(new Date(2025, 5, 15));
    const dataWithDissent = {
      ...testData,
      isParent1Assenting: false,
      parent1DissentReason: "Parent 1 unavailable",
    };

    const form = await getPdfForm({
      pdf: cjp25PetitionToChangeNameOfMinor,
      userData: dataWithDissent,
    });

    expect(form.getCheckBox("isParent1AssentingTrue").isChecked()).toBe(false);
    expect(form.getCheckBox("isParent1AssentingFalse").isChecked()).toBe(true);
    expect(form.getTextField("parent1DissentReason").getText()).toBe(
      "Parent 1 unavailable",
    );
  });

  it("does not show pronouns when not okay to share", async () => {
    vi.setSystemTime(new Date(2025, 5, 15));
    const dataWithoutPronouns = {
      ...testData,
      isOkayToSharePronouns: false,
      pronouns: ["She/Her"],
    };

    const form = await getPdfForm({
      pdf: cjp25PetitionToChangeNameOfMinor,
      userData: dataWithoutPronouns,
    });

    expect(form.getCheckBox("isOkayToSharePronouns").isChecked()).toBe(false);
    expect(form.getTextField("pronouns").getText() ?? "").toBe("");
  });
});
