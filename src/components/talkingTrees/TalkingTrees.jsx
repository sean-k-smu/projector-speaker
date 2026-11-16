/**
 * @file TalkingTrees.jsx
 * @authors
 *  Sean Kostlac
 *  Claude (Anthropic)
 * @description The Talking Trees home page (/talking-trees). Explains how the QR
 * codes work and lists every stop, so visitors without a code can still listen.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import talkingTrees, { DEFAULT_LANGUAGE, inLanguage } from '../../data/talkingTreesData';

const TalkingTrees = () => {
  const language = DEFAULT_LANGUAGE;

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl md:text-5xl text-gray-900 dark:text-yellow-100 mb-6">
        Talking Trees
      </h1>
      <p className="text-xl md:text-2xl leading-relaxed text-gray-900 dark:text-yellow-100 mb-10 max-w-3xl">
        Look for a Talking Trees sign with a QR code as you walk the trail. Scan it with your
        phone’s camera to hear about the tree in front of you. You can also choose a tree below.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {talkingTrees.map((tree) => (
          <li key={tree.id}>
            <Link
              to={`/talking-trees/${tree.id}`}
              className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500"
            >
              <img
                src={tree.image}
                alt={inLanguage(tree.imageAlt, language)}
                className="w-full h-48 object-cover"
              />
              <p className="text-2xl text-gray-900 dark:text-yellow-100 p-5">
                {inLanguage(tree.name, language)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default TalkingTrees;
