import joinCommands from '../join-commands';

const exampleCommands = {
  crop: 'magick - -gravity Center -crop 720x1000+0+0 -repage 720x1000+0+0 jpeg:-',
  format: 'convert - jpeg:-',
  fit: 'magick - -resize 1000x1000 jpeg:-',
  fill: 'magick -resize 1000x1000^ -gravity Center -extent 1000x1000 jpeg:-',
  magickCompress: 'magick - -quality=92 jpeg:-',
  strip: 'exiftool -all= -',
};

describe('.joinCommands', () => {
  describe('Joining two incompatible commands', () => {
    it('should pipe first command to second command', () => {
      const commands = ['format', 'strip'].map((cmd) => exampleCommands[cmd]);
      const joined = joinCommands(commands);
      expect(joined).toBe('convert - jpeg:- | exiftool -all= -');
    });
  });
  describe('Joining two magick commands', () => {
    const fixtures = {
      'crop + format': {
        cmds: ['crop', 'format'],
        expected: 'magick - -gravity Center -crop 720x1000+0+0 -repage 720x1000+0+0 jpeg:-',
      },
      'fit + format': {
        cmds: ['fit', 'format'],
        expected: 'magick - -resize 1000x1000 jpeg:-',
      },
      'fill + format': {
        cmds: ['fill', 'format'],
        expected: 'magick -resize 1000x1000^ -gravity Center -extent 1000x1000 jpeg:-',
      },
      'compress + format': {
        cmds: ['magickCompress', 'format'],
        expected: 'magick - -quality=92 jpeg:-',
      },

      'crop + compress': {
        cmds: ['crop', 'magickCompress'],
        expected: 'magick - -gravity Center -crop 720x1000+0+0 -repage 720x1000+0+0 -quality=92 jpeg:-',
      },
      'fit + compress': {
        cmds: ['fit', 'magickCompress'],
        expected: 'magick - -resize 1000x1000 -quality=92 jpeg:-',
      },
      'fill + compress': {
        cmds: ['fill', 'magickCompress'],
        expected: 'magick -resize 1000x1000^ -gravity Center -extent 1000x1000 -quality=92 jpeg:-',
      },
      'format + compress': {
        cmds: ['format', 'magickCompress'],
        expected: 'magick - -quality=92 jpeg:-',
      },
    };

    for (const fixtureName of Object.keys(fixtures)) {
      const fixture = fixtures[fixtureName];
      it(`should join ${fixtureName}`, () => {
        const commands = fixture.cmds.map((cmd) => exampleCommands[cmd]);
        const joined = joinCommands(commands);
        expect(joined).toBe(fixture.expected);
      });
    }
  });

  describe('Joining three magick commands', () => {
    // .joinCommands only join two subsequent commands
    // and thus will not join all three commands even if
    // it is possible. Only the two first commands will be joined
    const fixtures = {
      'crop + format + compress': {
        cmds: ['crop', 'format', 'magickCompress'],
        expected: 'magick - -gravity Center -crop 720x1000+0+0 -repage 720x1000+0+0 jpeg:- | ' +
         'magick - -quality=92 jpeg:-',
      },
    };

    for (const fixtureName of Object.keys(fixtures)) {
      const fixture = fixtures[fixtureName];
      it(`should join ${fixtureName}`, () => {
        const commands = fixture.cmds.map((cmd) => exampleCommands[cmd]);
        const joined = joinCommands(commands);
        expect(joined).toBe(fixture.expected);
      });
    }
  });


  describe('Joining three incompatible commands', () => {
    const fixtures = {
      'crop + strip + compress': {
        cmds: ['crop', 'strip', 'magickCompress'],
        expected: 'magick - -gravity Center -crop 720x1000+0+0 -repage 720x1000+0+0 jpeg:- | ' +
         'exiftool -all= - | magick - -quality=92 jpeg:-',
      },
    };

    for (const fixtureName of Object.keys(fixtures)) {
      const fixture = fixtures[fixtureName];
      it(`should join ${fixtureName}`, () => {
        const commands = fixture.cmds.map((cmd) => exampleCommands[cmd]);
        const joined = joinCommands(commands);
        expect(joined).toBe(fixture.expected);
      });
    }
  });

  describe('Joining arbitrary commands', () => {
    it('should not join arbitrary commands', () => {
      const commands = ['aaa', 'bbb', 'ccc', 'ddd'];
      const joined = joinCommands(commands);
      expect(joined).toBe('aaa | bbb | ccc | ddd');
    });
  });
});
