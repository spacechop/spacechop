import { Step } from '../../types/Step';
import hash from './../hash';

describe('.hash', () => {
  it('should return same hash for same steps', () => {
    const steps1: Step[] = [{
      $crop: {
        width: 100,
        height: 100,
      },
    }];
    const steps2: Step[] = [{
      $crop: {
        width: 100,
        height: 100,
      },
    }];

    const hash1 = hash(steps1);
    const hash2 = hash(steps2);
    expect(hash1).toBe(hash2);
  });

  it('should return same hash for same steps with object keys in different order', () => {
    const steps1: Step[] = [{
      $crop: {
        width: 100,
        height: 100,
      },
    }];
    const steps2: Step[] = [{
      $crop: {
        height: 100,
        width: 100,
      },
    }];

    const hash1 = hash(steps1);
    const hash2 = hash(steps2);
    expect(hash1).toBe(hash2);
  });

  it('should not return same hash if a new property is added', () => {
    const steps1: Step[] = [{
      $crop: {
        width: 100,
        height: 100,
        gravity: 'center',
      },
    }];
    const steps2: Step[] = [{
      $crop: {
        width: 100,
        height: 100,
      },
    }];

    const hash1 = hash(steps1);
    const hash2 = hash(steps2);
    expect(hash1).not.toBe(hash2);
  });
  it('should not return same hash if property changes value', () => {
    const steps1: Step[] = [{
      $crop: {
        width: 100,
        height: 100,
      },
    }];
    const steps2: Step[] = [{
      $crop: {
        width: 100,
        height: 150,
      },
    }];

    const hash1 = hash(steps1);
    const hash2 = hash(steps2);
    expect(hash1).not.toBe(hash2);
  });
  it('should not return same hash if property changes value', () => {
    const steps1: Step[] = [{
      $crop: {
        width: 100,
        height: 100,
      },
    }];
    const steps2: Step[] = [{
      $crop: {
        width: 100,
        height: 150,
      },
    }];

    const hash1 = hash(steps1);
    const hash2 = hash(steps2);
    expect(hash1).not.toBe(hash2);
  });

  it('should not return same hash if operations changes order', () => {
    const steps1: Step[] = [
      { $crop: {
        width: 100,
        height: 100,
      } },
      { $strip: {

      }},
    ];
    const steps2: Step[] = [
      { $strip: {

      }},
      { $crop: {
        width: 100,
        height: 100,
      } },
    ];


    const hash1 = hash(steps1);
    const hash2 = hash(steps2);
    expect(hash1).not.toBe(hash2);
  });
});
