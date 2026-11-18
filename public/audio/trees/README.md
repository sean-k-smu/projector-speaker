# Talking Trees audio

Recordings for each Talking Trees stop go here, one folder per language:

```
public/audio/trees/
  en/   English
  fr/   French
  mi/   Mi'kmaw
```

Name each file after the tree's `id` in `src/data/talkingTreesData.js`, as an `.mp3`:

```
public/audio/trees/en/yellow-birch.mp3
public/audio/trees/fr/yellow-birch.mp3
```

The site builds these paths automatically from the id and language, so a file with
the wrong name simply won't play. The page then offers the computer voice instead.

Guidelines from the client: a human-sounding voice that isn't sharp. Keep files small
(mono, about 64 kbps is plenty for speech) so audio starts quickly on mobile data.
