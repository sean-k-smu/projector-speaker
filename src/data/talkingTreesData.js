/**
 * @file talkingTreesData.js
 * @authors
 *  Sean Kostlac
 *  Claude (Anthropic)
 * @description Data for the Talking Trees feature. Each entry is one stop on the trail.
 *
 * HOW THE PIECES CONNECT
 * - A stop's `id` becomes its page address: /talking-trees/<id>. That address is what
 *   goes into the stop's QR code, so NEVER change an id after its QR code is printed.
 * - Text is stored per language ("en" now; "fr" and "mi" to be added by the
 *   three-language task, T-06). Any language missing a value falls back to English.
 * - Audio is never typed in by hand. Its path is built from the id and the language
 *   (see getTreeAudioSrc below), so a recording can't be attached to the wrong tree.
 *   Put recordings in public/audio/trees/<language>/<id>.mp3 (see the README there).
 * - `location` is for the GPS version of Talking Trees (after the MVP). Leave it as
 *   null until someone records the tree's real coordinates on site.
 *
 * TODO (content): The text below only reuses wording already on the site
 * (Sitemap.jsx and EcosystemData.js). Replace it with the final scripts, checked
 * against the sources listed in /citations, before any audio is recorded.
 */

import YellowBirchImage from '../assets/iNaturalist/YellowBirch.jpg';
import EasternWhitePineImage from '../assets/iNaturalist/EasternWhitePine.jpg';
import BalsamFirImage from '../assets/iNaturalist/BalsamFir.jpg';

/** The language shown until the three-language task adds a language switcher. */
export const DEFAULT_LANGUAGE = 'en';

const talkingTrees = [
  {
    id: 'yellow-birch',
    name: { en: 'Coastal Yellow Birch' },
    image: YellowBirchImage,
    imageAlt: { en: 'Looking up at tall yellow birch trunks under a green canopy' },
    // From the "yellow-birch" point in src/assets/map.json. Confirm on site.
    location: { lat: 44.625528, lng: -63.922 },
    transcript: {
      en:
        'Welcome to the Coastal Yellow Birch stop. From here, the trail is full of bright ' +
        'yellow birch trees that are easy to spot because of their golden bark.\n\n' +
        'The yellow birch is a large birch tree native to northeastern North America.',
    },
  },
  {
    id: 'eastern-white-pine',
    name: { en: 'Eastern White Pine' },
    image: EasternWhitePineImage,
    imageAlt: { en: 'The top of an eastern white pine against a blue sky' },
    location: null,
    transcript: {
      en: 'This is an eastern white pine, a large pine native to eastern North America.',
    },
  },
  {
    id: 'balsam-fir',
    name: { en: 'Balsam Fir' },
    image: BalsamFirImage,
    imageAlt: { en: 'Young balsam fir branches with bright green needles' },
    location: null,
    transcript: {
      en:
        'This is a balsam fir, a North American fir native to most of eastern and ' +
        'central Canada and the northeastern United States.',
    },
  },
];

/**
 * Returns a tree's text in the requested language, or English if that language
 * has not been added yet.
 *
 * @param {Object} field - A per-language field such as tree.name or tree.transcript.
 * @param {string} language - "en", "fr" or "mi".
 * @returns {string}
 */
export function inLanguage(field, language = DEFAULT_LANGUAGE) {
  return field[language] ?? field[DEFAULT_LANGUAGE];
}

/**
 * Builds the address of a tree's recorded audio from its id and the language,
 * e.g. /audio/trees/en/yellow-birch.mp3. BASE_URL keeps it working if the site
 * is ever served from a sub-folder on ugdev.
 *
 * @param {string} treeId
 * @param {string} language
 * @returns {string}
 */
export function getTreeAudioSrc(treeId, language = DEFAULT_LANGUAGE) {
  return `${import.meta.env.BASE_URL}audio/trees/${language}/${treeId}.mp3`;
}

/**
 * Finds one tree by its id (the last part of its page address).
 *
 * @param {string} treeId
 * @returns {Object|undefined} The tree, or undefined if no tree has that id.
 */
export function getTreeById(treeId) {
  return talkingTrees.find((tree) => tree.id === treeId);
}

export default talkingTrees;
