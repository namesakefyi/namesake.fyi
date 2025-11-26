import { type MaskitoOptions, maskitoTransform } from "@maskito/core";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ComboBox, ComboBoxItem } from "@/components/react/common/ComboBox";
import { TextField } from "@/components/react/common/TextField";
import type { FieldName } from "@/constants/fields";
import { JURISDICTIONS } from "@/constants/jurisdictions";
import "./AddressField.css";

type AddressType = "residence" | "mailing";

export interface AddressFieldProps {
  children?: React.ReactNode;
  type: AddressType;
  includeCounty?: boolean;
}

export function AddressField({
  children,
  type,
  includeCounty = false,
}: AddressFieldProps) {
  const { control, watch } = useFormContext();
  const [counties, setCounties] = useState<string[]>([]);

  const names: Record<
    AddressType,
    {
      street: FieldName;
      city: FieldName;
      state: FieldName;
      zip: FieldName;
      county: FieldName;
    }
  > = {
    residence: {
      street: "residenceStreetAddress",
      city: "residenceCity",
      state: "residenceState",
      zip: "residenceZipCode",
      county: "residenceCounty",
    },
    mailing: {
      street: "mailingStreetAddress",
      city: "mailingCity",
      state: "mailingState",
      zip: "mailingZipCode",
      county: "mailingCounty",
    },
  };

  const selectedState = watch(names[type].state);

  useEffect(() => {
    if (!includeCounty || !selectedState) {
      setCounties([]);
      return;
    }

    // TODO: Add API call to get counties for the selected state

    // const state = usaStatesWithCounties.find(
    //   (state) => state.abbreviation === selectedState,
    // );
    // setCounties(state?.counties ?? []);
  }, [includeCounty, selectedState]);

  // Input mask: enforce ZIP code format of 12345-1234
  const maskitoOptions: MaskitoOptions = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
  };

  return (
    <div className="namesake-address-field">
      <Controller
        control={control}
        name={names[type].street}
        defaultValue={""}
        shouldUnregister={true}
        render={({ field, fieldState: { invalid, error } }) => (
          <TextField
            {...field}
            label="Street address"
            autoComplete="street-address"
            maxLength={40}
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name={names[type].city}
        defaultValue={""}
        shouldUnregister={true}
        render={({ field, fieldState: { invalid, error } }) => (
          <TextField
            {...field}
            label="City"
            autoComplete="address-level2"
            maxLength={40}
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name={names[type].state}
        defaultValue={""}
        shouldUnregister={true}
        render={({ field, fieldState: { invalid, error } }) => (
          <ComboBox
            {...field}
            label="State"
            placeholder="Select state"
            autoComplete="address-level1"
            selectedKey={field.value}
            onSelectionChange={(key) => {
              field.onChange(key);
            }}
            isInvalid={invalid}
            errorMessage={error?.message}
            menuTrigger="focus"
          >
            {Object.entries(JURISDICTIONS).map(([value, label]) => (
              <ComboBoxItem key={value} id={value}>
                {label}
              </ComboBoxItem>
            ))}
          </ComboBox>
        )}
      />
      {includeCounty && counties.length > 0 && (
        <Controller
          control={control}
          name={names[type].county}
          defaultValue={""}
          shouldUnregister={true}
          render={({ field, fieldState: { invalid, error } }) => (
            <ComboBox
              {...field}
              label="County"
              placeholder="Select county"
              selectedKey={field.value}
              onSelectionChange={(key) => {
                field.onChange(key);
              }}
              isInvalid={invalid}
              errorMessage={error?.message}
              menuTrigger="focus"
            >
              {counties.map((county) => (
                <ComboBoxItem key={county} id={county}>
                  {county}
                </ComboBoxItem>
              ))}
            </ComboBox>
          )}
        />
      )}
      <Controller
        control={control}
        name={names[type].zip}
        defaultValue={""}
        shouldUnregister={true}
        render={({ field, fieldState: { invalid, error } }) => (
          <TextField
            {...field}
            label="ZIP"
            autoComplete="postal-code"
            onChange={(value) => {
              const transformedValue = maskitoTransform(value, maskitoOptions);
              field.onChange(transformedValue);
            }}
            maxLength={10}
            isInvalid={invalid}
            errorMessage={error?.message}
          />
        )}
      />
      {children}
    </div>
  );
}
