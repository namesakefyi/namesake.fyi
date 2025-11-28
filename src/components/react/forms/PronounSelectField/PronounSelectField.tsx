import { Controller, useFormContext } from "react-hook-form";
import { Tag, TagGroup } from "@/components/react/common/TagGroup";
import { TextField } from "@/components/react/common/TextField";
import { ALL } from "@/constants/all";
import { COMMON_PRONOUNS } from "@/constants/fields";
import "./PronounSelectField.css";

export function PronounSelectField() {
  const { control, watch } = useFormContext();
  const pronounsValue = watch("pronouns");

  return (
    <div className="namesake-pronoun-select-field">
      <Controller
        control={control}
        name="pronouns"
        render={({ field, fieldState: { error } }) => {
          const selectedKeys = Array.isArray(field.value)
            ? new Set(field.value)
            : new Set([]);

          return (
            <TagGroup
              {...field}
              label="Pronouns"
              selectionMode="multiple"
              selectedKeys={selectedKeys}
              onSelectionChange={(selection) => {
                field.onChange(Array.from(selection));
              }}
              errorMessage={error?.message}
            >
              {COMMON_PRONOUNS.map((pronoun) => (
                <Tag key={pronoun} id={pronoun}>
                  {pronoun}
                </Tag>
              ))}
              <Tag id="other">other pronouns</Tag>
            </TagGroup>
          );
        }}
      />
      {(pronounsValue === ALL || pronounsValue?.includes("other")) && (
        <Controller
          control={control}
          defaultValue=""
          name="otherPronouns"
          render={({ field, fieldState: { invalid, error } }) => (
            <TextField
              {...field}
              label="List other pronouns"
              isInvalid={invalid}
              errorMessage={error?.message}
            />
          )}
        />
      )}
    </div>
  );
}
