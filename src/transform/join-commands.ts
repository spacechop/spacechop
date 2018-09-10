/**
 * Some two commands, especially magick commands, can be reconstructed
 * as a single command to improve performance.
 *
 * This module reconstructs compatible commands
 * and joins the rest with unix pipes.
 */

const joinableCommands = {
  '[any magick] + [format]': {
    // example:
    // "magick - -resize 1000x1000 jpeg:- | convert - png:-" ->
    // "magick - -resize 1000x1000 png:-"
    commands: [
      // Any magick command
      // first group is settings and second group is output format
      /^(magick .*) ([\w]+:-)$/,

      // Format command
      // first group is output format
      /^convert - ([\w]+:-)$/,
    ],
    join: ([ first, second ]) => {
      return `${first[1]} ${second[1]}`;
    },
  },

  '[any magick] + [magickCompress]': {
    // example:
    // "magick - -resize 100x100 jpeg:- | magick -quality=92 jpeg:-" ->
    // "magick - -resize 100x100 -quality=92 jpeg:-"
    commands: [
      // Any magick command
      // first group is settings and second group is output format
      /^(?:magick|convert) (.*) ([\w]+:-)$/,

      // compress command
      // first group is quality parameter
      /^magick - (-quality=[0-9]+) [\w]+:-$/,
    ],

    join: ([ first, second ]) => {
      return `magick ${first[1]} ${second[1]} ${first[2]}`;
    },
  },
};

export default (commands: string[]): string => {
  // Run a single pass over the commands, joining two commands where possible.
  // Further optimizations could allow joining more than two commands into one,
  // but such optimizations are not done here.
  const joinedCommands = [];
  commandLoop: for (let i = 0; i < commands.length; i += 1) {
    if (i === commands.length - 1) {
      joinedCommands.push(commands[i]);
      continue;
    }
    const fst = commands[i];
    const snd = commands[i + 1];

    for (const matcherName of Object.keys(joinableCommands)) {
      const matcher = joinableCommands[matcherName];

      const fstMatch = fst.match(matcher.commands[0]);
      if (fstMatch === null) { continue; }

      const sndMatch = snd.match(matcher.commands[1]);
      if (sndMatch === null) { continue; }

      // These commands can be joined
      joinedCommands.push(matcher.join([fstMatch, sndMatch]));
      i++;
      continue commandLoop;
    }

    // The commands could not be joined
    // push them as is
    joinedCommands.push(fst);
  }

  return joinedCommands.join(' | ');

};
