export const gameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  pondWidth: 700,
  pondHeight: 300,
  pondTop: 150,
  maxLevel: 10,
  baseScore: 100
};

export const fishTypes = [
  {
    name: 'Common Fish',
    size: 15,
    speed: 1,
    rarity: 0.6,
    points: 10
  },
  {
    name: 'Rare Fish',
    size: 20,
    speed: 1.5,
    rarity: 0.3,
    points: 25
  },
  {
    name: 'Epic Fish',
    size: 25,
    speed: 2,
    rarity: 0.08,
    points: 50
  },
  {
    name: 'Legendary Fish',
    size: 30,
    speed: 2.5,
    rarity: 0.02,
    points: 100
  }
];

export const levelConfig = {
  fishCountBase: 3,
  fishCountIncrement: 1,
  maxFishCount: 8,
  difficultyMultiplier: 1.2,
  visibilityReduction: 0.1
};