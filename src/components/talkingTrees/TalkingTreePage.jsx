/**
 * @file TalkingTreePage.jsx
 * @authors
 *  Sean Kostlac
 *  Claude (Anthropic)
 * @description The page a visitor lands on after scanning a tree's QR code
 * (/talking-trees/<id>). Shows the tree's name and photo, its audio, and the
 * transcript (SRS FR-01, FR-05).
 */

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import TreeAudioPlayer from './TreeAudioPlayer';
import {
  DEFAULT_LANGUAGE,
  getTreeAudioSrc,
  getTreeById,
  inLanguage,
} from '../../data/talkingTreesData';

const TalkingTreePage = () => {
  const { treeId } = useParams();
  const tree = getTreeById(treeId);
  // Replaced by the visitor's choice once the three-language task (T-06) adds a switcher.
  const language = DEFAULT_LANGUAGE;

  // An old or mistyped QR code address: say so plainly and offer the full list.
  if (!tree) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl text-gray-900 dark:text-yellow-100 mb-6">
          We couldn’t find that tree
        </h1>
        <p className="text-xl text-gray-900 dark:text-yellow-100 mb-8">
          The code you scanned may be out of date. You can choose a tree from the full list instead.
        </p>
        <Link
          to="/talking-trees"
          className="inline-block bg-yellow-400 text-gray-900 rounded-full px-6 py-3 text-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500"
        >
          See all Talking Trees
        </Link>
      </main>
    );
  }

  const name = inLanguage(tree.name, language);
  const transcript = inLanguage(tree.transcript, language);

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <Link
        to="/talking-trees"
        className="text-xl text-gray-900 dark:text-yellow-100 underline mb-6 w-fit"
      >
        ← All Talking Trees
      </Link>

      <h1 className="text-4xl md:text-5xl text-gray-900 dark:text-yellow-100 mb-6">{name}</h1>

      <img
        src={tree.image}
        alt={inLanguage(tree.imageAlt, language)}
        className="w-full h-72 md:h-96 object-cover rounded-lg shadow-md mb-8"
      />

      {/* key makes the player start fresh when moving from one tree to another. */}
      <TreeAudioPlayer
        key={`${tree.id}-${language}`}
        src={getTreeAudioSrc(tree.id, language)}
        transcript={transcript}
        label={`Audio: ${name}`}
      />

      <section className="mt-10">
        <h2 className="text-3xl text-gray-900 dark:text-yellow-100 mb-4">Transcript</h2>
        {transcript.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            className="text-xl md:text-2xl leading-relaxed text-gray-900 dark:text-yellow-100 mb-4"
          >
            {paragraph}
          </p>
        ))}
      </section>
    </main>
  );
};

export default TalkingTreePage;
