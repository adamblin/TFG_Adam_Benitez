import type { ColorPalette } from './palette.types';
import { oceanPalette }   from './ocean';
import { forestPalette }  from './forest';
import { darkPalette }    from './dark';
import { monoPalette }    from './mono';
import { sunsetPalette }  from './sunset';
import { sandPalette }    from './sand';
import { warmPalette }    from './warm';
import { cosmicPalette }  from './cosmic';
import { rosePalette }    from './rose';
import { tealPalette }    from './teal';
import { amberPalette }   from './amber';
import { mintPalette }    from './mint';
import { neonPalette }    from './neon';
import { crimsonPalette } from './crimson';
import { arcticPalette }  from './arctic';
import { violetPalette }  from './violet';
import { goldPalette }    from './gold';
import { infernoPalette } from './inferno';
import { voidPalette }    from './void';
import { galaxyPalette }  from './galaxy';

export type { ColorPalette };
export { oceanPalette };

// Maps shop theme IDs → full color palette
export const PALETTE_REGISTRY: Record<string, ColorPalette> = {
  theme_blue:    oceanPalette,
  theme_dark:    darkPalette,
  theme_mono:    monoPalette,
  theme_green:   forestPalette,
  theme_orange:  sunsetPalette,
  theme_sand:    sandPalette,
  theme_warm:    warmPalette,
  theme_purple:  cosmicPalette,
  theme_rose:    rosePalette,
  theme_teal:    tealPalette,
  theme_amber:   amberPalette,
  theme_mint:    mintPalette,
  theme_neon:    neonPalette,
  theme_crimson: crimsonPalette,
  theme_arctic:  arcticPalette,
  theme_violet:  violetPalette,
  theme_gold:    goldPalette,
  theme_inferno: infernoPalette,
  theme_void:    voidPalette,
  theme_cosmic:  galaxyPalette,
};

export function resolveTheme(themeId: string): ColorPalette {
  return PALETTE_REGISTRY[themeId] ?? oceanPalette;
}
