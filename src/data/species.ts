import type { PlantSpecies } from '../types';
import pothosImg from '../assets/plants/pothos.png';
import goldenSnakeImg from '../assets/plants/golden-snake-plant.png';
import zzPlantImg from '../assets/plants/zz-plant.png';
import spiderPlantImg from '../assets/plants/spider-plant.png';
import jadePlantImg from '../assets/plants/jade-plant.png';
import monsteraImg from '../assets/plants/monstera.png';
import echeveriaImg from '../assets/plants/echeveria.png';
import parlorPalmImg from '../assets/plants/parlor-palm.png';

/**
 * Preset species catalog for Library Add Plant.
 * Visual assets are original Leafnote illustrations.
 */
export const SPECIES: PlantSpecies[] = [
  {
    id: 'pothos',
    nameEn: 'Pothos',
    nameZh: '绿萝',
    imageSrc: pothosImg,
  },
  {
    id: 'golden-snake-plant',
    nameEn: 'Golden snake plant',
    nameZh: '金边虎尾兰',
    imageSrc: goldenSnakeImg,
  },
  {
    id: 'zz-plant',
    nameEn: 'ZZ plant',
    nameZh: '金钱树',
    imageSrc: zzPlantImg,
  },
  {
    id: 'spider-plant',
    nameEn: 'Spider plant',
    nameZh: '吊兰',
    imageSrc: spiderPlantImg,
  },
  {
    id: 'jade-plant',
    nameEn: 'Jade plant',
    nameZh: '玉树',
    imageSrc: jadePlantImg,
  },
  {
    id: 'monstera',
    nameEn: 'Monstera',
    nameZh: '龟背竹',
    imageSrc: monsteraImg,
  },
  {
    id: 'echeveria',
    nameEn: 'Echeveria',
    nameZh: '莲座多肉',
    imageSrc: echeveriaImg,
  },
  {
    id: 'parlor-palm',
    nameEn: 'Parlor palm',
    nameZh: '袖珍椰子',
    imageSrc: parlorPalmImg,
  },
];

export function getSpecies(speciesId: string): PlantSpecies | undefined {
  return SPECIES.find((species) => species.id === speciesId);
}
