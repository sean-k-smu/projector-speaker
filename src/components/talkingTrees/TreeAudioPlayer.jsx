/**
 * @file TreeAudioPlayer.jsx
 * @authors
 *  Sean Kostlac
 *  Claude (Anthropic)
 * @description Plays a Talking Trees stop's recorded audio with the browser's built-in
 * HTML5 audio player (play, pause, volume and seeking: SRS FR-05).
 *
 * If the recording is missing or can't be played, it shows a message instead and
 * offers to read the transcript aloud with the computer voice from tts.js, so every
 * stop still has audio before the real recordings exist.
 */

import React, { useEffect, useState } from 'react';
import { IoVolumeHigh, IoStop } from 'react-icons/io5';
import tts from '../../assets/tts';

/**
 * @param {Object} props
 * @param {string} props.src - Address of the recording, e.g. /audio/trees/en/yellow-birch.mp3.
 * @param {string} props.transcript - Text read aloud if the recording isn't available.
 * @param {string} props.label - What is playing, for screen readers (e.g. "Audio: Balsam Fir").
 * @returns {JSX.Element}
 */
const TreeAudioPlayer = ({ src, transcript, label }) => {
  // True when the recording failed to load, so the computer-voice fallback is shown.
  const [recordingMissing, setRecordingMissing] = useState(!src);
  // True while the computer voice is reading, so the button can say "Stop".
  const [speaking, setSpeaking] = useState(false);

  // Stop any computer-voice reading when the visitor leaves the page.
  useEffect(() => () => tts.stop(), []);

  // tts.js has no "finished" event, so check every half second while it is reading.
  useEffect(() => {
    if (!speaking) return undefined;
    const timer = setInterval(() => {
      if (!tts.isSpeaking()) setSpeaking(false);
    }, 500);
    return () => clearInterval(timer);
  }, [speaking]);

  /** Starts or stops the computer voice reading the transcript. */
  const handleComputerVoice = () => {
    if (speaking) {
      tts.stop();
      setSpeaking(false);
    } else {
      tts.speak(transcript);
      setSpeaking(true);
    }
  };

  if (recordingMissing) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-xl text-gray-900 dark:text-yellow-100">
          The recording for this tree isn’t ready yet.
        </p>
        <button
          type="button"
          onClick={handleComputerVoice}
          className="flex items-center justify-center gap-3 bg-yellow-400 text-gray-900 rounded-full px-6 py-3 text-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 shrink-0"
        >
          {speaking ? <IoStop className="text-2xl" aria-hidden="true" /> : <IoVolumeHigh className="text-2xl" aria-hidden="true" />}
          {speaking ? 'Stop' : 'Listen with computer voice'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* preload="auto" starts downloading right away, so playback can begin within
          1.5 seconds of pressing play (SRS PR-05). */}
      <audio
        controls
        preload="auto"
        src={src}
        aria-label={label}
        className="w-full"
        onError={() => setRecordingMissing(true)}
        onPlay={() => tts.stop()}
      >
        Your browser can’t play this audio. Please read the transcript below.
      </audio>
    </div>
  );
};

export default TreeAudioPlayer;
