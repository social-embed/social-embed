import { type ReactNode, useState } from "react";

type AsideType = "note" | "tip" | "caution" | "danger";
type AsideVariant = "classic" | "refined" | "card" | "minimal" | "hybrid";
type AsideIconStyle = "inline" | "soft" | "solid";
type AsideIconSize = "sm" | "md" | "lg";

const icons: Record<AsideType, string> = {
  caution: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
  danger:
    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
  note: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
  tip: "M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z",
};

const defaultTitles: Record<AsideType, string> = {
  caution: "Caution",
  danger: "Danger",
  note: "Note",
  tip: "Tip",
};

const variantDefaults: Record<
  AsideVariant,
  { iconStyle: AsideIconStyle; iconSize: AsideIconSize }
> = {
  card: { iconSize: "md", iconStyle: "solid" },
  classic: { iconSize: "md", iconStyle: "inline" },
  hybrid: { iconSize: "lg", iconStyle: "solid" },
  minimal: { iconSize: "sm", iconStyle: "inline" },
  refined: { iconSize: "md", iconStyle: "soft" },
};

const variantDescriptions: Record<AsideVariant, string> = {
  card: "Full bordered card, no left accent",
  classic: "Simple left border with flat background",
  hybrid: "Gradient background with left accent (recommended)",
  minimal: "Top border only, uppercase title",
  refined: "Gradient background fading right",
};

type SelectProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  descriptions?: Record<T, string>;
};

function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  descriptions,
}: SelectProps<T>): ReactNode {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
        {label}
      </span>
      <select
        className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        onChange={(e) => onChange(e.target.value as T)}
        value={value}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
            {descriptions?.[opt] ? ` — ${descriptions[opt]}` : ""}
          </option>
        ))}
      </select>
    </label>
  );
}

// Compact segmented toggle group
type SegmentedControlProps<T extends string> = {
  label: string;
  name: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  defaultValue?: T;
  renderOption?: (opt: T, isDefault: boolean) => ReactNode;
};

function SegmentedControl<T extends string>({
  label,
  name,
  value,
  options,
  onChange,
  defaultValue,
  renderOption,
}: SegmentedControlProps<T>): ReactNode {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="text-xs font-medium text-slate-600 dark:text-slate-400">
        {label}
      </legend>
      <div className="flex gap-0.5 rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-600 dark:bg-slate-800">
        {options.map((opt) => {
          const isSelected = value === opt;
          const isDefault = defaultValue === opt;
          return (
            <label
              className={`relative flex-1 px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer select-none text-center ${
                isSelected
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-slate-100"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
              key={opt}
            >
              <input
                checked={isSelected}
                className="sr-only"
                name={name}
                onChange={() => onChange(opt)}
                type="radio"
                value={opt}
              />
              {renderOption ? renderOption(opt, isDefault) : opt}
              {isDefault && !isSelected && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// Type picker with icons
function TypePicker({
  value,
  onChange,
}: {
  value: AsideType;
  onChange: (value: AsideType) => void;
}): ReactNode {
  const options = ["note", "tip", "caution", "danger"] as const;
  return (
    <SegmentedControl
      label="Type"
      name="aside-type"
      onChange={onChange}
      options={options}
      renderOption={(opt) => (
        <span className="flex items-center justify-center gap-1">
          <svg
            aria-hidden="true"
            fill="currentColor"
            height="12"
            viewBox="0 0 24 24"
            width="12"
          >
            <path d={icons[opt]} />
          </svg>
          {opt}
        </span>
      )}
      value={value}
    />
  );
}

// Icon style picker - visual preview of each style
function IconStylePicker({
  value,
  onChange,
  defaultStyle,
}: {
  value: AsideIconStyle | "auto";
  onChange: (value: AsideIconStyle | "auto") => void;
  defaultStyle: AsideIconStyle;
}): ReactNode {
  const options = ["auto", "inline", "soft", "solid"] as const;
  const previewIcon = icons.note;

  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="text-xs font-medium text-slate-600 dark:text-slate-400">
        Icon Style
      </legend>
      <div className="inline-flex gap-0.5 rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-600 dark:bg-slate-800">
        {options.map((opt) => {
          const isSelected = value === opt;
          const isDefault = opt !== "auto" && opt === defaultStyle;

          return (
            <label
              className={`relative flex items-center justify-center w-8 h-8 rounded-md transition-colors cursor-pointer select-none ${
                isSelected
                  ? "bg-white shadow-sm dark:bg-slate-700"
                  : "hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              key={opt}
              title={opt}
            >
              <input
                checked={isSelected}
                className="sr-only"
                name="icon-style"
                onChange={() => onChange(opt)}
                type="radio"
                value={opt}
              />
              {opt === "auto" ? (
                <span className="text-sm leading-none">✨</span>
              ) : (
                <span
                  className={`inline-flex items-center justify-center ${
                    opt === "inline"
                      ? "text-blue-600 dark:text-blue-400"
                      : opt === "soft"
                        ? "p-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                        : "p-0.5 rounded bg-blue-600 dark:bg-blue-500 text-white"
                  }`}
                >
                  <svg
                    aria-hidden="true"
                    fill="currentColor"
                    height="14"
                    viewBox="0 0 24 24"
                    width="14"
                  >
                    <path d={previewIcon} />
                  </svg>
                </span>
              )}
              {isDefault && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// Icon size picker - shows actual sizes
function IconSizePicker({
  value,
  onChange,
  defaultSize,
}: {
  value: AsideIconSize | "auto";
  onChange: (value: AsideIconSize | "auto") => void;
  defaultSize: AsideIconSize;
}): ReactNode {
  const options = ["auto", "sm", "md", "lg"] as const;
  const sizes: Record<AsideIconSize, number> = { lg: 20, md: 16, sm: 12 };
  const previewIcon = icons.note;

  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="text-xs font-medium text-slate-600 dark:text-slate-400">
        Icon Size
      </legend>
      <div className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-600 dark:bg-slate-800">
        {options.map((opt) => {
          const isSelected = value === opt;
          const sizeToShow = opt === "auto" ? defaultSize : opt;
          const iconSize = sizes[sizeToShow];
          const isDefault = opt !== "auto" && opt === defaultSize;

          return (
            <label
              className={`relative flex items-center justify-center w-8 h-8 rounded-md transition-colors cursor-pointer select-none ${
                isSelected
                  ? "bg-white shadow-sm dark:bg-slate-700"
                  : "hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              key={opt}
              title={opt}
            >
              <input
                checked={isSelected}
                className="sr-only"
                name="icon-size"
                onChange={() => onChange(opt)}
                type="radio"
                value={opt}
              />
              {opt === "auto" ? (
                <span className="text-sm leading-none">✨</span>
              ) : (
                <svg
                  aria-hidden="true"
                  className="text-blue-600 dark:text-blue-400"
                  fill="currentColor"
                  height={iconSize}
                  viewBox="0 0 24 24"
                  width={iconSize}
                >
                  <path d={previewIcon} />
                </svg>
              )}
              {isDefault && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function AsidePlayground(): ReactNode {
  const [variant, setVariant] = useState<AsideVariant>("hybrid");
  const [type, setType] = useState<AsideType>("note");
  const [iconStyleOverride, setIconStyleOverride] = useState<
    AsideIconStyle | "auto"
  >("auto");
  const [iconSizeOverride, setIconSizeOverride] = useState<
    AsideIconSize | "auto"
  >("auto");

  const effectiveIconStyle =
    iconStyleOverride === "auto"
      ? variantDefaults[variant].iconStyle
      : iconStyleOverride;
  const effectiveIconSize =
    iconSizeOverride === "auto"
      ? variantDefaults[variant].iconSize
      : iconSizeOverride;

  const asideClasses = ["aside", `aside-${type}`, `aside-${variant}`].join(" ");

  const iconClasses = [
    "aside-icon",
    `aside-icon-${effectiveIconStyle}`,
    `aside-icon-${effectiveIconSize}`,
  ].join(" ");

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
      {/* Controls */}
      <div className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50 lg:w-80">
        <div className="flex flex-col gap-2.5">
          <Select
            descriptions={variantDescriptions}
            label="Variant"
            onChange={setVariant}
            options={["classic", "refined", "card", "minimal", "hybrid"]}
            value={variant}
          />
          <TypePicker onChange={setType} value={type} />
          <div className="flex gap-3">
            <IconStylePicker
              defaultStyle={variantDefaults[variant].iconStyle}
              onChange={setIconStyleOverride}
              value={iconStyleOverride}
            />
            <IconSizePicker
              defaultSize={variantDefaults[variant].iconSize}
              onChange={setIconSizeOverride}
              value={iconSizeOverride}
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="aside-preview min-w-0 flex-1">
        {/* Code pills above preview */}
        <div className="mb-2 flex flex-wrap gap-1.5 text-[11px]">
          <code className="rounded bg-slate-200 px-1.5 py-0.5 dark:bg-slate-700">
            variant="{variant}"
          </code>
          <code className="rounded bg-slate-200 px-1.5 py-0.5 dark:bg-slate-700">
            type="{type}"
          </code>
          {iconStyleOverride !== "auto" && (
            <code className="rounded bg-blue-100 px-1.5 py-0.5 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              iconStyle="{iconStyleOverride}"
            </code>
          )}
          {iconSizeOverride !== "auto" && (
            <code className="rounded bg-blue-100 px-1.5 py-0.5 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
              iconSize="{iconSizeOverride}"
            </code>
          )}
        </div>
        <aside className={asideClasses} role="note">
          <p className="aside-title">
            <span className={iconClasses}>
              <svg
                aria-hidden="true"
                fill="currentColor"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d={icons[type]} />
              </svg>
            </span>
            <span>{defaultTitles[type]}</span>
          </p>
          <div className="aside-content">
            <p>
              This is a <strong>{type}</strong> message. It provides important
              information to the reader with appropriate visual styling for the
              content type.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
