import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneInputField = ({
  name,
  label,
  value,
  error,
  touched,
  onChange,
  onBlur,
  isRequired = false,
  placeholder = "Enter phone number",
  ...props
}) => {
  const handleChange = (phoneValue, country) => {
    onChange(name, phoneValue);
  };

  return (
    <div className="mb-4 w-full ">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}

      <PhoneInput
        country={"ae"}
        value={value}
        onChange={handleChange}
        onBlur={() => onBlur(name, true)}
        placeholder={placeholder}
        countryCodeEditable={false}
        inputProps={{
          name,
          required: isRequired,
          className: `w-full pl-12 outline-none p-2 border rounded-md ${
            touched && error ? "border-red-500" : "border-gray-300"
          }`,
        }}
        containerClass="w-full"
        inputClass="w-full"
        buttonClass={`${touched && error ? "border-red-500" : "border-gray-300"}`}
        dropdownClass="border-gray-300"
        {...props}
      />

      {touched && error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </div>
  );
};

export default PhoneInputField;
