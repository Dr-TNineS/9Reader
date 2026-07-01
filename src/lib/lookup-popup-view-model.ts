import {
  formatLookupMatch,
  frequencyGroups,
  glossaryGroups,
  pitchGroups,
  renderGlossaryContent,
  ruleTags,
  type LookupFrequencyGroup,
  type LookupPitchGroup,
  type LookupPopupRenderOptions,
} from "./lookup-popup";
import type { DictResult, GlossaryEntry } from "./types";

export interface LookupPopupGlossaryEntry extends GlossaryEntry {
  definitionTagList: string[];
  html: string;
}

export interface LookupPopupGlossaryGroup {
  dictionary: string;
  termTags: string[];
  entries: LookupPopupGlossaryEntry[];
}

export interface LookupPopupResultViewModel {
  result: DictResult;
  resultIndex: number;
  key: string;
  match: string;
  rules: string[];
  frequencies: LookupFrequencyGroup[];
  pitches: LookupPitchGroup[];
  pitchMoras: string[];
  glossaryGroups: LookupPopupGlossaryGroup[];
}

export function createLookupPopupViewModels(results: DictResult[], options: LookupPopupRenderOptions = {}): LookupPopupResultViewModel[] {
  return results.map((result, resultIndex) => ({
    result,
    resultIndex,
    key: `${resultIndex}:${result.expression}:${result.reading}`,
    match: formatLookupMatch(result),
    rules: ruleTags(result),
    frequencies: frequencyGroups(result, options),
    pitches: pitchGroups(result, options),
    pitchMoras: kanaMorae(result.reading.trim()).slice(0, 18),
    glossaryGroups: glossaryGroups(result).map((group) => ({
      dictionary: group.dictionary,
      termTags: group.termTags,
      entries: group.entries.map((entry) => ({
        ...entry,
        html: renderGlossaryContent(entry.text, group.dictionary),
      })),
    })),
  }));
}

export function popupResultDictionaries(viewModels: LookupPopupResultViewModel[]): string[] {
  const dictionaries = new Set<string>();
  for (const viewModel of viewModels) {
    for (const group of viewModel.glossaryGroups) {
      if (group.dictionary) dictionaries.add(group.dictionary);
    }
  }
  return [...dictionaries];
}

const SMALL_KANA = new Set(Array.from(
  "\u3041\u3043\u3045\u3047\u3049\u3083\u3085\u3087\u308e\u3063\u30a1\u30a3\u30a5\u30a7\u30a9\u30e3\u30e5\u30e7\u30ee\u30c3\u30f5\u30f6",
));

export function kanaMorae(text: string): string[] {
  const moras: string[] = [];
  for (const char of Array.from(text)) {
    if (SMALL_KANA.has(char) && moras.length > 0) {
      moras[moras.length - 1] += char;
    } else {
      moras.push(char);
    }
  }
  return moras;
}
