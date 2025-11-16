import React, { useMemo } from "react";

/**
 * A React component that wraps an input.
 * It takes a `label` string and dynamically splits it into animated <span> tags.
 */
export function AnimatedInput({
  label,
  value,
  onChange,
  id,
  required = false,
}) {
  const labelChars = useMemo(() => label.split(""), [label]);

  return (
    <div className="animated-form-control">
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        required={required}
      />
      <label htmlFor={id}>
        {labelChars.map((char, index) => (
          <span key={index} style={{ transitionDelay: `${index * 50}ms` }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </label>
    </div>
  );
}
