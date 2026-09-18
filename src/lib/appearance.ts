export type ReaderTheme = "light" | "dark" | "sepia" | "custom";
export type ReaderInterfaceTheme = "system" | "light" | "dark";
export type ReaderViewMode = "paginated" | "continuous" | "visualNovel";
export type ReaderAppearanceColorField =
  | "customBackgroundColor"
  | "customTextColor"
  | "customInfoColor"
  | "sasayakiLightTextColor"
  | "sasayakiLightBackgroundColor"
  | "sasayakiDarkTextColor"
  | "sasayakiDarkBackgroundColor";

export type ReaderAppearance = {
  theme: ReaderTheme;
  interface: ReaderInterfaceTheme;
  customBackgroundColor: string;
  customTextColor: string;
  customInfoColor: string;
  sasayakiLightTextColor: string;
  sasayakiLightBackgroundColor: string;
  sasayakiDarkTextColor: string;
  sasayakiDarkBackgroundColor: string;
  verticalWriting: boolean;
  fontSize: number;
  hideFurigana: boolean;
  viewMode: ReaderViewMode;
  horizontalPadding: number;
  verticalPadding: number;
  bottomSafeAreaDp: number;
  avoidPageBreak: boolean;
  justifyText: boolean;
  blurImages: boolean;
  layoutAdvanced: boolean;
  lineHeight: number;
  characterSpacing: number;
  paragraphSpacing: number;
  showTitle: boolean;
  showCharacters: boolean;
  showPercentage: boolean;
  alwaysShowProgress: boolean;
  showProgressTop: boolean;
  showReaderBackButton: boolean;
};

export type ReaderAppearancePalette = {
  readerBackground: string;
  readerText: string;
  readerInfo: string;
  lookupHighlight: string;
  sasayakiHighlightText: string;
  sasayakiHighlightBackground: string;
  appBackground: string;
  appText: string;
  appMuted: string;
  appSurface: string;
  appSurfaceHover: string;
  appBorder: string;
  appControl: string;
  appControlHover: string;
  appPrimary: string;
  appPrimaryHover: string;
  appError: string;
  appStatus: string;
  appShadow: string;
};

const APPEARANCE_KEY = "nine_reader_appearance";
const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
const SASAYAKI_BACKGROUND_ALPHA = 0.4;
export const READER_FONT_SIZE = { min: 10, max: 60, step: 1 } as const;
export const READER_LAYOUT_PADDING = { min: 0, max: 50, step: 1 } as const;
export const READER_BOTTOM_SAFE_AREA = { min: 18, max: 72, step: 2 } as const;
export const READER_LINE_HEIGHT = { min: 1, max: 2.5, step: 0.05 } as const;
export const READER_CHARACTER_SPACING = { min: -10, max: 10, step: 1 } as const;
export const READER_PARAGRAPH_SPACING = { min: 0, max: 3, step: 0.1 } as const;

export const readerBodyFont = "\"Yu Mincho\", \"Hiragino Mincho Pro\", \"MS Mincho\", serif";

export const defaultReaderAppearance: ReaderAppearance = {
  theme: "light",
  interface: "system",
  customBackgroundColor: "#ffffff",
  customTextColor: "#000000",
  customInfoColor: "#999999",
  sasayakiLightTextColor: "#000000",
  sasayakiLightBackgroundColor: "#87ceeb",
  sasayakiDarkTextColor: "#ffffff",
  sasayakiDarkBackgroundColor: "#87ceeb",
  verticalWriting: true,
  fontSize: 22,
  hideFurigana: false,
  viewMode: "paginated",
  horizontalPadding: 5,
  verticalPadding: 0,
  bottomSafeAreaDp: 18,
  avoidPageBreak: false,
  justifyText: false,
  blurImages: false,
  layoutAdvanced: false,
  lineHeight: 1.65,
  characterSpacing: 0,
  paragraphSpacing: 0,
  showTitle: true,
  showCharacters: true,
  showPercentage: true,
  alwaysShowProgress: true,
  showProgressTop: true,
  showReaderBackButton: true,
};

export const readerThemeLabels: Record<ReaderTheme, string> = {
  light: "\u6d45\u8272",
  dark: "\u6df1\u8272",
  sepia: "Sepia",
  custom: "Custom",
};

export const readerInterfaceLabels: Record<ReaderInterfaceTheme, string> = {
  system: "Follow System",
  light: "Light",
  dark: "Dark",
};

export const readerAppearanceColorLabels: Record<ReaderAppearanceColorField, string> = {
  customBackgroundColor: "Background",
  customTextColor: "Text",
  customInfoColor: "Info",
  sasayakiLightTextColor: "Text",
  sasayakiLightBackgroundColor: "Background",
  sasayakiDarkTextColor: "Text",
  sasayakiDarkBackgroundColor: "Background",
};

function isReaderTheme(theme: unknown): theme is ReaderTheme {
  return theme === "light" || theme === "dark" || theme === "sepia" || theme === "custom";
}

function isReaderInterfaceTheme(theme: unknown): theme is ReaderInterfaceTheme {
  return theme === "system" || theme === "light" || theme === "dark";
}

function normalizeBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function snapNumber(value: number, min: number, max: number, step: number): number {
  const clamped = Math.min(max, Math.max(min, value));
  const snapped = min + Math.round((clamped - min) / step) * step;
  const decimals = Math.max(0, `${step}`.split(".")[1]?.length ?? 0);
  return Number(Math.min(max, Math.max(min, snapped)).toFixed(decimals));
}

function normalizeNumber(value: unknown, fallback: number, min: number, max: number, step: number): number {
  return typeof value === "number" && Number.isFinite(value)
    ? snapNumber(value, min, max, step)
    : fallback;
}

export function normalizeHexColor(value: unknown, fallback: string): string {
  return typeof value === "string" && HEX_COLOR_PATTERN.test(value)
    ? value.toLowerCase()
    : fallback;
}

export function normalizeReaderAppearance(value: Partial<ReaderAppearance> = {}): ReaderAppearance {
  return {
    theme: isReaderTheme(value.theme) ? value.theme : defaultReaderAppearance.theme,
    interface: isReaderInterfaceTheme(value.interface) ? value.interface : defaultReaderAppearance.interface,
    customBackgroundColor: normalizeHexColor(value.customBackgroundColor, defaultReaderAppearance.customBackgroundColor),
    customTextColor: normalizeHexColor(value.customTextColor, defaultReaderAppearance.customTextColor),
    customInfoColor: normalizeHexColor(value.customInfoColor, defaultReaderAppearance.customInfoColor),
    sasayakiLightTextColor: normalizeHexColor(value.sasayakiLightTextColor, defaultReaderAppearance.sasayakiLightTextColor),
    sasayakiLightBackgroundColor: normalizeHexColor(value.sasayakiLightBackgroundColor, defaultReaderAppearance.sasayakiLightBackgroundColor),
    sasayakiDarkTextColor: normalizeHexColor(value.sasayakiDarkTextColor, defaultReaderAppearance.sasayakiDarkTextColor),
    sasayakiDarkBackgroundColor: normalizeHexColor(value.sasayakiDarkBackgroundColor, defaultReaderAppearance.sasayakiDarkBackgroundColor),
    verticalWriting: normalizeBoolean(value.verticalWriting, defaultReaderAppearance.verticalWriting),
    fontSize: normalizeNumber(value.fontSize, defaultReaderAppearance.fontSize, READER_FONT_SIZE.min, READER_FONT_SIZE.max, READER_FONT_SIZE.step),
    hideFurigana: normalizeBoolean(value.hideFurigana, defaultReaderAppearance.hideFurigana),
    viewMode: value.viewMode === "paginated" ? value.viewMode : defaultReaderAppearance.viewMode,
    horizontalPadding: normalizeNumber(value.horizontalPadding, defaultReaderAppearance.horizontalPadding, READER_LAYOUT_PADDING.min, READER_LAYOUT_PADDING.max, READER_LAYOUT_PADDING.step),
    verticalPadding: normalizeNumber(value.verticalPadding, defaultReaderAppearance.verticalPadding, READER_LAYOUT_PADDING.min, READER_LAYOUT_PADDING.max, READER_LAYOUT_PADDING.step),
    bottomSafeAreaDp: normalizeNumber(value.bottomSafeAreaDp, defaultReaderAppearance.bottomSafeAreaDp, READER_BOTTOM_SAFE_AREA.min, READER_BOTTOM_SAFE_AREA.max, READER_BOTTOM_SAFE_AREA.step),
    avoidPageBreak: normalizeBoolean(value.avoidPageBreak, defaultReaderAppearance.avoidPageBreak),
    justifyText: normalizeBoolean(value.justifyText, defaultReaderAppearance.justifyText),
    blurImages: normalizeBoolean(value.blurImages, defaultReaderAppearance.blurImages),
    layoutAdvanced: normalizeBoolean(value.layoutAdvanced, defaultReaderAppearance.layoutAdvanced),
    lineHeight: normalizeNumber(value.lineHeight, defaultReaderAppearance.lineHeight, READER_LINE_HEIGHT.min, READER_LINE_HEIGHT.max, READER_LINE_HEIGHT.step),
    characterSpacing: normalizeNumber(value.characterSpacing, defaultReaderAppearance.characterSpacing, READER_CHARACTER_SPACING.min, READER_CHARACTER_SPACING.max, READER_CHARACTER_SPACING.step),
    paragraphSpacing: normalizeNumber(value.paragraphSpacing, defaultReaderAppearance.paragraphSpacing, READER_PARAGRAPH_SPACING.min, READER_PARAGRAPH_SPACING.max, READER_PARAGRAPH_SPACING.step),
    showTitle: normalizeBoolean(value.showTitle, defaultReaderAppearance.showTitle),
    showCharacters: normalizeBoolean(value.showCharacters, defaultReaderAppearance.showCharacters),
    showPercentage: normalizeBoolean(value.showPercentage, defaultReaderAppearance.showPercentage),
    alwaysShowProgress: normalizeBoolean(value.alwaysShowProgress, defaultReaderAppearance.alwaysShowProgress),
    showProgressTop: normalizeBoolean(value.showProgressTop, defaultReaderAppearance.showProgressTop),
    showReaderBackButton: normalizeBoolean(value.showReaderBackButton, defaultReaderAppearance.showReaderBackButton),
  };
}

export function loadReaderAppearance(): ReaderAppearance {
  try {
    const raw = localStorage.getItem(APPEARANCE_KEY);
    const parsed = raw ? JSON.parse(raw) as Partial<ReaderAppearance> : {};
    return normalizeReaderAppearance(parsed);
  } catch {
    return defaultReaderAppearance;
  }
}

export function saveReaderAppearance(appearance: ReaderAppearance) {
  localStorage.setItem(APPEARANCE_KEY, JSON.stringify(normalizeReaderAppearance(appearance)));
}

function sepiaLightAppPalette() {
  return {
    appBackground: "#f2e2c9",
    appText: "#332a1b",
    appMuted: "#5c5448",
    appSurface: "#f8f0e2",
    appSurfaceHover: "#ead9bd",
    appBorder: "#d8c5a5",
    appControl: "#f8f0e2",
    appControlHover: "#ead9bd",
    appPrimary: "#7a5d2d",
    appPrimaryHover: "#6a5026",
    appError: "#9a3412",
    appStatus: "#5f6f3a",
    appShadow: "rgba(80, 53, 22, 0.2)",
  };
}

function sepiaDarkAppPalette() {
  return {
    appBackground: "#17150f",
    appText: "#f2e2c9",
    appMuted: "#c2b5a1",
    appSurface: "#191713",
    appSurfaceHover: "#241f18",
    appBorder: "#4a4438",
    appControl: "#191713",
    appControlHover: "#241f18",
    appPrimary: "#f2e2c9",
    appPrimaryHover: "#dfcfb8",
    appError: "#ffb4ab",
    appStatus: "#dbe6b0",
    appShadow: "rgba(0, 0, 0, 0.48)",
  };
}

function resolvedInterfaceIsDark(appearance: ReaderAppearance, systemDark: boolean): boolean {
  if (appearance.theme === "dark") return true;
  if (appearance.theme === "light") return false;
  if (appearance.theme === "sepia") return systemDark;
  if (appearance.interface === "dark") return true;
  if (appearance.interface === "light") return false;
  return systemDark;
}

function sasayakiBackground(color: string): string {
  const red = Number.parseInt(color.slice(1, 3), 16);
  const green = Number.parseInt(color.slice(3, 5), 16);
  const blue = Number.parseInt(color.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${SASAYAKI_BACKGROUND_ALPHA})`;
}

export function readerAppearancePalette(
  appearance: ReaderAppearance,
  systemDark = false,
): ReaderAppearancePalette {
  const normalized = normalizeReaderAppearance(appearance);
  const interfaceDark = resolvedInterfaceIsDark(normalized, systemDark);
  const appPalette = interfaceDark ? sepiaDarkAppPalette() : sepiaLightAppPalette();
  const sasayakiHighlightText = interfaceDark ? normalized.sasayakiDarkTextColor : normalized.sasayakiLightTextColor;
  const sasayakiHighlightBackground = sasayakiBackground(
    interfaceDark ? normalized.sasayakiDarkBackgroundColor : normalized.sasayakiLightBackgroundColor,
  );

  if (normalized.theme === "custom") {
    return {
      readerBackground: normalized.customBackgroundColor,
      readerText: normalized.customTextColor,
      readerInfo: normalized.customInfoColor,
      lookupHighlight: interfaceDark ? "rgba(255, 255, 255, 0.32)" : "rgba(160, 160, 160, 0.32)",
      sasayakiHighlightText,
      sasayakiHighlightBackground,
      ...appPalette,
    };
  }

  if (normalized.theme === "dark") {
    return {
      readerBackground: "#000",
      readerText: "#fff",
      readerInfo: "#999999",
      lookupHighlight: "rgba(255, 255, 255, 0.32)",
      sasayakiHighlightText,
      sasayakiHighlightBackground,
      ...appPalette,
    };
  }

  if (normalized.theme === "sepia") {
    return {
      readerBackground: systemDark ? "#17150f" : "#f2e2c9",
      readerText: systemDark ? "#f2e2c9" : "#332a1b",
      readerInfo: systemDark ? "#c2b5a1" : "#5c5448",
      lookupHighlight: systemDark ? "rgba(255, 255, 255, 0.32)" : "rgba(160, 160, 160, 0.32)",
      sasayakiHighlightText,
      sasayakiHighlightBackground,
      ...appPalette,
    };
  }

  return {
    readerBackground: "#fff",
    readerText: "#000",
    readerInfo: "#999999",
    lookupHighlight: "rgba(160, 160, 160, 0.32)",
    sasayakiHighlightText,
    sasayakiHighlightBackground,
    ...appPalette,
  };
}

export function readerAppearanceCssVars(palette: ReaderAppearancePalette): string {
  return [
    `--reader-bg:${palette.readerBackground}`,
    `--reader-body-font:${readerBodyFont}`,
    `--reader-text:${palette.readerText}`,
    `--reader-info:${palette.readerInfo}`,
    `--lookup-highlight-color:${palette.lookupHighlight}`,
    `--sasayaki-highlight-text:${palette.sasayakiHighlightText}`,
    `--sasayaki-highlight-background:${palette.sasayakiHighlightBackground}`,
    `--app-bg:${palette.appBackground}`,
    `--app-text:${palette.appText}`,
    `--app-muted:${palette.appMuted}`,
    `--app-surface:${palette.appSurface}`,
    `--app-surface-hover:${palette.appSurfaceHover}`,
    `--app-border:${palette.appBorder}`,
    `--app-control:${palette.appControl}`,
    `--app-control-hover:${palette.appControlHover}`,
    `--app-primary:${palette.appPrimary}`,
    `--app-primary-hover:${palette.appPrimaryHover}`,
    `--app-error:${palette.appError}`,
    `--app-status:${palette.appStatus}`,
    `--app-shadow:${palette.appShadow}`,
  ].join(";");
}
