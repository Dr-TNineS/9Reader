<script lang="ts">
  import {
    READER_BOTTOM_SAFE_AREA,
    READER_CHARACTER_SPACING,
    READER_FONT_SIZE,
    READER_LAYOUT_PADDING,
    READER_LINE_HEIGHT,
    READER_PARAGRAPH_SPACING,
    readerAppearanceColorLabels,
    readerInterfaceLabels,
    type ReaderAppearance,
    type ReaderAppearanceColorField,
    type ReaderInterfaceTheme,
    type ReaderTheme,
    type ReaderViewMode,
  } from "./appearance";
  import { LOOKUP_POPUP_HEIGHT, LOOKUP_POPUP_SCALE, LOOKUP_POPUP_WIDTH, type LookupPopupSettings } from "./lookup-popup-settings";
  import UiToggleGroup from "./ui/ToggleGroup.svelte";

  let {
    appearance,
    themeLabels,
    onThemeChange,
    onInterfaceChange,
    onAppearanceColorChange,
    onAppearanceSettingsChange,
    popupSettings,
    onPopupWidthChange,
    onPopupHeightChange,
    onPopupScaleChange,
  }: {
    appearance: ReaderAppearance;
    themeLabels: Record<ReaderTheme, string>;
    onThemeChange: (theme: ReaderTheme) => void;
    onInterfaceChange: (theme: ReaderInterfaceTheme) => void;
    onAppearanceColorChange: (field: ReaderAppearanceColorField, color: string) => void;
    onAppearanceSettingsChange: (update: Partial<ReaderAppearance>) => void;
    popupSettings: LookupPopupSettings;
    onPopupWidthChange: (width: number) => void;
    onPopupHeightChange: (height: number) => void;
    onPopupScaleChange: (scale: number) => void;
  } = $props();

  const themeOptions = $derived(
    (Object.keys(themeLabels) as ReaderTheme[]).map((theme) => ({ value: theme, label: themeLabels[theme] })),
  );
  const interfaceOptions = $derived(
    (Object.keys(readerInterfaceLabels) as ReaderInterfaceTheme[]).map((theme) => ({ value: theme, label: readerInterfaceLabels[theme] })),
  );
  const textOrientationOptions = [
    { value: "vertical", label: "Vertical" },
    { value: "horizontal", label: "Horizontal 未实现", disabled: true },
  ];
  const layoutModeOptions = [
    { value: "paginated", label: "Paginated" },
    { value: "continuous", label: "Continuous 未实现", disabled: true },
    { value: "visualNovel", label: "VN 未实现", disabled: true },
  ];
  const progressPositionOptions = [
    { value: "top", label: "Top" },
    { value: "bottom", label: "Bottom" },
  ];
  const readerColorRows: { field: ReaderAppearanceColorField; label: string; ariaLabel: string }[] = [
    { field: "customBackgroundColor", label: readerAppearanceColorLabels.customBackgroundColor, ariaLabel: "Reader background" },
    { field: "customTextColor", label: readerAppearanceColorLabels.customTextColor, ariaLabel: "Reader text" },
    { field: "customInfoColor", label: readerAppearanceColorLabels.customInfoColor, ariaLabel: "Reader info" },
  ];
  const sasayakiLightColorRows: { field: ReaderAppearanceColorField; label: string; ariaLabel: string }[] = [
    { field: "sasayakiLightTextColor", label: readerAppearanceColorLabels.sasayakiLightTextColor, ariaLabel: "Sasayaki light text" },
    { field: "sasayakiLightBackgroundColor", label: readerAppearanceColorLabels.sasayakiLightBackgroundColor, ariaLabel: "Sasayaki light background" },
  ];
  const sasayakiDarkColorRows: { field: ReaderAppearanceColorField; label: string; ariaLabel: string }[] = [
    { field: "sasayakiDarkTextColor", label: readerAppearanceColorLabels.sasayakiDarkTextColor, ariaLabel: "Sasayaki dark text" },
    { field: "sasayakiDarkBackgroundColor", label: readerAppearanceColorLabels.sasayakiDarkBackgroundColor, ariaLabel: "Sasayaki dark background" },
  ];

  function setTheme(theme: string) {
    if (theme === "light" || theme === "dark" || theme === "sepia" || theme === "custom") onThemeChange(theme);
  }

  function setInterface(theme: string) {
    if (theme === "system" || theme === "light" || theme === "dark") onInterfaceChange(theme);
  }

  function commitColor(field: ReaderAppearanceColorField, color: string) {
    onAppearanceColorChange(field, color);
  }

  function setTextOrientation(value: string) {
    if (value === "vertical") onAppearanceSettingsChange({ verticalWriting: true });
  }

  function setLayoutMode(value: string) {
    if (value === "paginated") onAppearanceSettingsChange({ viewMode: value as ReaderViewMode });
  }

  function setProgressPosition(value: string) {
    if (value === "top" || value === "bottom") onAppearanceSettingsChange({ showProgressTop: value === "top" });
  }

  function numberInput(event: Event): number {
    return (event.currentTarget as HTMLInputElement).valueAsNumber;
  }
</script>

<section class="appearance-panel" aria-label="Reader appearance">
  <div class="appearance-head">
    <h2>Appearance</h2>
    <p class="appearance-summary">HSA reader themes with optional custom reader and Sasayaki colors.</p>
  </div>
  <UiToggleGroup value={appearance.theme} items={themeOptions} ariaLabel="Theme" onValueChange={setTheme} />
  {#if appearance.theme === "custom"}
    <div class="custom-settings" aria-label="Custom reader appearance">
      <div class="setting-row">
        <span class="setting-label">Interface</span>
        <UiToggleGroup value={appearance.interface} items={interfaceOptions} ariaLabel="Interface" onValueChange={setInterface} />
      </div>
      <div class="color-section">
        <h3>Reader</h3>
        {#each readerColorRows as row}
          <label class="color-row">
            <span>{row.label}</span>
            <span class="color-controls">
              <span class="color-swatch" style={`background:${appearance[row.field]}`} aria-hidden="true"></span>
              <input aria-label={`${row.ariaLabel} picker`} class="native-color" type="color" value={appearance[row.field]} oninput={(event) => commitColor(row.field, event.currentTarget.value)} />
              <input aria-label={`${row.ariaLabel} color`} class="hex-input" value={appearance[row.field]} maxlength="7" pattern="#[0-9a-fA-F]{6}" onchange={(event) => commitColor(row.field, event.currentTarget.value)} />
            </span>
          </label>
        {/each}
      </div>
      <div class="color-section">
        <h3>Sasayaki Light</h3>
        {#each sasayakiLightColorRows as row}
          <label class="color-row">
            <span>{row.label}</span>
            <span class="color-controls">
              <span class="color-swatch" style={`background:${appearance[row.field]}`} aria-hidden="true"></span>
              <input aria-label={`${row.ariaLabel} picker`} class="native-color" type="color" value={appearance[row.field]} oninput={(event) => commitColor(row.field, event.currentTarget.value)} />
              <input aria-label={`${row.ariaLabel} color`} class="hex-input" value={appearance[row.field]} maxlength="7" pattern="#[0-9a-fA-F]{6}" onchange={(event) => commitColor(row.field, event.currentTarget.value)} />
            </span>
          </label>
        {/each}
      </div>
      <div class="color-section">
        <h3>Sasayaki Dark</h3>
        {#each sasayakiDarkColorRows as row}
          <label class="color-row">
            <span>{row.label}</span>
            <span class="color-controls">
              <span class="color-swatch" style={`background:${appearance[row.field]}`} aria-hidden="true"></span>
              <input aria-label={`${row.ariaLabel} picker`} class="native-color" type="color" value={appearance[row.field]} oninput={(event) => commitColor(row.field, event.currentTarget.value)} />
              <input aria-label={`${row.ariaLabel} color`} class="hex-input" value={appearance[row.field]} maxlength="7" pattern="#[0-9a-fA-F]{6}" onchange={(event) => commitColor(row.field, event.currentTarget.value)} />
            </span>
          </label>
        {/each}
      </div>
    </div>
  {/if}
  <div class="appearance-section text-settings" aria-label="Text settings">
    <h3>Text</h3>
    <div class="setting-row">
      <span class="setting-label">Text Orientation</span>
      <UiToggleGroup
        value={appearance.verticalWriting ? "vertical" : "horizontal"}
        items={textOrientationOptions}
        ariaLabel="Text orientation"
        onValueChange={setTextOrientation}
      />
    </div>
    <div class="placeholder-row">
      <span>Font</span>
      <button type="button" disabled>Publisher / imported font 未实现</button>
    </div>
    <label>
      <span>Font Size <strong>{appearance.fontSize}</strong></span>
      <input
        aria-label="Font size"
        type="range"
        min={READER_FONT_SIZE.min}
        max={READER_FONT_SIZE.max}
        step={READER_FONT_SIZE.step}
        value={appearance.fontSize}
        oninput={(event) => onAppearanceSettingsChange({ fontSize: numberInput(event) })}
      />
    </label>
    <label class="switch-row">
      <span>Hide Furigana</span>
      <input
        aria-label="Hide furigana"
        type="checkbox"
        checked={appearance.hideFurigana}
        onchange={(event) => onAppearanceSettingsChange({ hideFurigana: event.currentTarget.checked })}
      />
    </label>
  </div>
  <div class="appearance-section layout-settings" aria-label="Layout settings">
    <h3>Layout</h3>
    <div class="setting-row wide-toggle">
      <span class="setting-label">Mode</span>
      <UiToggleGroup
        value={appearance.viewMode}
        items={layoutModeOptions}
        ariaLabel="Layout mode"
        onValueChange={setLayoutMode}
      />
    </div>
    <div class="placeholder-grid" aria-label="Visual novel settings">
      <button type="button" disabled>Text Reveal Speed 未实现</button>
      <button type="button" disabled>Screen Content 未实现</button>
      <button type="button" disabled>Sentences per Screen 未实现</button>
    </div>
    <label>
      <span>Horizontal Padding <strong>{appearance.horizontalPadding}%</strong></span>
      <input
        aria-label="Horizontal padding"
        type="range"
        min={READER_LAYOUT_PADDING.min}
        max={READER_LAYOUT_PADDING.max}
        step={READER_LAYOUT_PADDING.step}
        value={appearance.horizontalPadding}
        oninput={(event) => onAppearanceSettingsChange({ horizontalPadding: numberInput(event) })}
      />
    </label>
    <label>
      <span>Vertical Padding <strong>{appearance.verticalPadding}%</strong></span>
      <input
        aria-label="Vertical padding"
        type="range"
        min={READER_LAYOUT_PADDING.min}
        max={READER_LAYOUT_PADDING.max}
        step={READER_LAYOUT_PADDING.step}
        value={appearance.verticalPadding}
        oninput={(event) => onAppearanceSettingsChange({ verticalPadding: numberInput(event) })}
      />
    </label>
    <label>
      <span>Bottom Safe Area <strong>{appearance.bottomSafeAreaDp}px</strong></span>
      <input
        aria-label="Bottom safe area"
        type="range"
        min={READER_BOTTOM_SAFE_AREA.min}
        max={READER_BOTTOM_SAFE_AREA.max}
        step={READER_BOTTOM_SAFE_AREA.step}
        value={appearance.bottomSafeAreaDp}
        oninput={(event) => onAppearanceSettingsChange({ bottomSafeAreaDp: numberInput(event) })}
      />
    </label>
    <label class="switch-row">
      <span>Avoid Page Break</span>
      <input
        aria-label="Avoid page break"
        type="checkbox"
        checked={appearance.avoidPageBreak}
        onchange={(event) => onAppearanceSettingsChange({ avoidPageBreak: event.currentTarget.checked })}
      />
    </label>
    <label class="switch-row">
      <span>Justify Text</span>
      <input
        aria-label="Justify text"
        type="checkbox"
        checked={appearance.justifyText}
        onchange={(event) => onAppearanceSettingsChange({ justifyText: event.currentTarget.checked })}
      />
    </label>
    <label class="switch-row">
      <span>Blur Images</span>
      <input
        aria-label="Blur images"
        type="checkbox"
        checked={appearance.blurImages}
        onchange={(event) => onAppearanceSettingsChange({ blurImages: event.currentTarget.checked })}
      />
    </label>
    <label class="switch-row">
      <span>Advanced</span>
      <input
        aria-label="Advanced layout"
        type="checkbox"
        checked={appearance.layoutAdvanced}
        onchange={(event) => onAppearanceSettingsChange({ layoutAdvanced: event.currentTarget.checked })}
      />
    </label>
    {#if appearance.layoutAdvanced}
      <label>
        <span>Line Height <strong>{appearance.lineHeight.toFixed(2)}</strong></span>
        <input
          aria-label="Line height"
          type="range"
          min={READER_LINE_HEIGHT.min}
          max={READER_LINE_HEIGHT.max}
          step={READER_LINE_HEIGHT.step}
          value={appearance.lineHeight}
          oninput={(event) => onAppearanceSettingsChange({ lineHeight: numberInput(event) })}
        />
      </label>
      <label>
        <span>Character Spacing <strong>{appearance.characterSpacing}%</strong></span>
        <input
          aria-label="Character spacing"
          type="range"
          min={READER_CHARACTER_SPACING.min}
          max={READER_CHARACTER_SPACING.max}
          step={READER_CHARACTER_SPACING.step}
          value={appearance.characterSpacing}
          oninput={(event) => onAppearanceSettingsChange({ characterSpacing: numberInput(event) })}
        />
      </label>
      <label>
        <span>Paragraph Spacing <strong>{appearance.paragraphSpacing.toFixed(1)}em</strong></span>
        <input
          aria-label="Paragraph spacing"
          type="range"
          min={READER_PARAGRAPH_SPACING.min}
          max={READER_PARAGRAPH_SPACING.max}
          step={READER_PARAGRAPH_SPACING.step}
          value={appearance.paragraphSpacing}
          oninput={(event) => onAppearanceSettingsChange({ paragraphSpacing: numberInput(event) })}
        />
      </label>
    {/if}
  </div>
  <div class="appearance-section display-settings" aria-label="Display settings">
    <h3>Display</h3>
    <label class="switch-row">
      <span>Show Title</span>
      <input
        aria-label="Show title"
        type="checkbox"
        checked={appearance.showTitle}
        onchange={(event) => onAppearanceSettingsChange({ showTitle: event.currentTarget.checked })}
      />
    </label>
    <label class="switch-row">
      <span>Show Character Count</span>
      <input
        aria-label="Show character count"
        type="checkbox"
        checked={appearance.showCharacters}
        onchange={(event) => onAppearanceSettingsChange({ showCharacters: event.currentTarget.checked })}
      />
    </label>
    <label class="switch-row">
      <span>Show Percentage</span>
      <input
        aria-label="Show percentage"
        type="checkbox"
        checked={appearance.showPercentage}
        onchange={(event) => onAppearanceSettingsChange({ showPercentage: event.currentTarget.checked })}
      />
    </label>
    {#if appearance.showCharacters || appearance.showPercentage}
      <label class="switch-row">
        <span>Always Show Progress</span>
        <input
          aria-label="Always show progress"
          type="checkbox"
          checked={appearance.alwaysShowProgress}
          onchange={(event) => onAppearanceSettingsChange({ alwaysShowProgress: event.currentTarget.checked })}
        />
      </label>
    {/if}
    {#if (appearance.showCharacters || appearance.showPercentage) && !appearance.alwaysShowProgress}
      <div class="setting-row">
        <span class="setting-label">Progress Position</span>
        <UiToggleGroup
          value={appearance.showProgressTop ? "top" : "bottom"}
          items={progressPositionOptions}
          ariaLabel="Progress position"
          onValueChange={setProgressPosition}
        />
      </div>
    {/if}
    <label class="switch-row">
      <span>Show Back Button</span>
      <input
        aria-label="Show back button"
        type="checkbox"
        checked={appearance.showReaderBackButton}
        onchange={(event) => onAppearanceSettingsChange({ showReaderBackButton: event.currentTarget.checked })}
      />
    </label>
    <label class="switch-row disabled-setting">
      <span>Show Sasayaki Toggle 未实现</span>
      <input aria-label="Show Sasayaki toggle not implemented" type="checkbox" disabled />
    </label>
  </div>
  <div class="popup-settings" aria-label="Dictionary popup settings">
    <h3>Dictionary Popup</h3>
    <label>
      <span>Width <strong>{popupSettings.width}</strong></span>
      <input aria-label="Popup width" type="range" min={LOOKUP_POPUP_WIDTH.min} max={LOOKUP_POPUP_WIDTH.max} step={LOOKUP_POPUP_WIDTH.step} value={popupSettings.width} oninput={(event) => onPopupWidthChange(event.currentTarget.valueAsNumber)} />
    </label>
    <label>
      <span>Height <strong>{popupSettings.height}</strong></span>
      <input aria-label="Popup height" type="range" min={LOOKUP_POPUP_HEIGHT.min} max={LOOKUP_POPUP_HEIGHT.max} step={LOOKUP_POPUP_HEIGHT.step} value={popupSettings.height} oninput={(event) => onPopupHeightChange(event.currentTarget.valueAsNumber)} />
    </label>
    <label>
      <span>Scale <strong>{popupSettings.scale.toFixed(2)}</strong></span>
      <input aria-label="Popup scale" type="range" min={LOOKUP_POPUP_SCALE.min} max={LOOKUP_POPUP_SCALE.max} step={LOOKUP_POPUP_SCALE.step} value={popupSettings.scale} oninput={(event) => onPopupScaleChange(event.currentTarget.valueAsNumber)} />
    </label>
  </div>
</section>

<style>
  h2 { font-size: 13px; font-weight: 600; color: var(--app-muted); text-transform: uppercase; }
  .appearance-panel { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 16px; padding: 12px; background: var(--app-surface); border: 1px solid var(--app-border); border-radius: 6px; }
  .appearance-summary { margin-top: 4px; color: var(--app-muted); font-size: 12px; line-height: 1.35; }
  .custom-settings { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; padding-top: 12px; border-top: 1px solid var(--app-border); }
  .setting-row { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .setting-label { color: var(--app-text); font-size: 12px; font-weight: 600; }
  .color-section { min-width: 0; display: flex; flex-direction: column; gap: 8px; padding: 10px; background: var(--app-bg); border: 1px solid var(--app-border); border-radius: 6px; }
  .color-row { display: flex; flex-direction: row; align-items: center; justify-content: space-between; gap: 10px; color: var(--app-text); font-size: 12px; }
  .color-controls { display: grid; grid-template-columns: 18px 28px 82px; align-items: center; gap: 6px; }
  .color-swatch { width: 18px; height: 18px; border: 1px solid var(--app-border); border-radius: 50%; }
  .native-color { width: 28px; height: 24px; padding: 0; background: transparent; border: none; cursor: pointer; }
  .hex-input { width: 82px; min-width: 0; padding: 4px 6px; background: var(--app-control); color: var(--app-text); border: 1px solid var(--app-border); border-radius: 4px; font: inherit; font-variant-numeric: tabular-nums; }
  .hex-input:focus-visible { outline: var(--ui-focus-ring-width) solid var(--ui-focus-ring-color); outline-offset: var(--ui-focus-ring-offset); }
  .appearance-section { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: start; gap: 12px; padding-top: 12px; border-top: 1px solid var(--app-border); }
  .appearance-section .setting-row { grid-column: 1 / -1; }
  .wide-toggle { align-items: flex-start; }
  .placeholder-row { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; gap: 12px; color: var(--app-text); font-size: 12px; }
  .placeholder-grid { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .placeholder-row button, .placeholder-grid button { min-height: 30px; padding: 0 8px; background: var(--app-control); color: var(--app-muted); border: 1px solid var(--app-border); border-radius: 4px; font: inherit; font-size: 12px; text-align: left; }
  .switch-row { min-height: 30px; flex-direction: row; align-items: center; justify-content: space-between; padding: 4px 0; }
  .switch-row input[type="checkbox"] { width: 18px; height: 18px; flex: 0 0 auto; accent-color: var(--app-primary); }
  .disabled-setting { color: var(--app-muted); }
  .popup-settings { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; padding-top: 12px; border-top: 1px solid var(--app-border); }
  h3 { grid-column: 1 / -1; color: var(--app-muted); font-size: 11px; font-weight: 600; text-transform: uppercase; }
  label { display: flex; flex-direction: column; gap: 6px; color: var(--app-text); font-size: 12px; }
  label span { display: flex; justify-content: space-between; gap: 8px; }
  label strong { font-variant-numeric: tabular-nums; }
  input[type="range"] { width: 100%; accent-color: var(--app-primary); }
  @media (max-width: 640px) {
    .appearance-panel { grid-template-columns: 1fr; align-items: stretch; }
    .custom-settings { grid-template-columns: 1fr; }
    .setting-row { flex-direction: column; align-items: stretch; }
    .appearance-section, .placeholder-grid { grid-template-columns: 1fr; }
    .placeholder-row { flex-direction: column; align-items: stretch; }
    .popup-settings { grid-template-columns: 1fr; }
  }
</style>
