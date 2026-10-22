import React from "react";
import { Input } from "./Input";

export default {
  title: "Components/Input",
  component: Input,
  argTypes: {
    size: { control: "inline-radio", options: ["small", "medium", "large"] },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    showLabel: { control: "boolean" },
    showHelper: { control: "boolean" },
    label: { control: "text" },
    placeholder: { control: "text" },
    helperText: { control: "text" },
    errorMessage: { control: "text" },
  },
};

export const Default = { args: { size: "small" } };
export const Filled = { args: { size: "small", defaultValue: "alex@company.com" } };
export const ErrorState = { name: "Error", args: { size: "small", error: true, defaultValue: "alex@company" } };
export const Disabled = { args: { size: "small", disabled: true } };

export const AllSizes = {
  render: (args) => (
    <div style={{ display: "flex", gap: "var(--spacing-lg)", alignItems: "flex-start" }}>
      <Input {...args} size="small" />
      <Input {...args} size="medium" />
      <Input {...args} size="large" />
    </div>
  ),
};

export const AllStates = {
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 320px)", gap: "var(--spacing-lg)" }}>
      {["small", "medium", "large"].map((s) => (
        <React.Fragment key={s}>
          <Input size={s} />
        </React.Fragment>
      ))}
      {["small", "medium", "large"].map((s) => (
        <Input key={`f-${s}`} size={s} defaultValue="alex@company.com" />
      ))}
      {["small", "medium", "large"].map((s) => (
        <Input key={`e-${s}`} size={s} error defaultValue="alex@company" />
      ))}
      {["small", "medium", "large"].map((s) => (
        <Input key={`d-${s}`} size={s} disabled />
      ))}
    </div>
  ),
};
