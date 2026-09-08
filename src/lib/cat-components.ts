
import {
    GingerCatIcon,
    GhostCatIcon,
    ShadowCatIcon,
    BonesCatIcon,
    IdentityCrisisCatIcon,
    AltCat,
    BreuCatIcon,
    ZumbiCatIcon,
    BlizzardCatIcon,
    VoodooCatIcon,
    SleepyCatIcon,
    HologramCatIcon,
    GravityCatIcon,
    GlitchCatIcon,
    VampyCatIcon,
    WonderCatIcon,
    AnomalyCatIcon,
    CatankhamunCatIcon,
    CloudCatIcon,
    CosmicCatIcon,
    DominoCatIcon,
    MysticCatIcon,
    ParadoxCatIcon,
    PixelCatIcon,
    SharkCatIcon,
    SneekyCatIcon,
    SnowballCatIcon,
    CursedCatIcon,
    FrankCatIcon,
    PharaohCatIcon,
    PlagueCatIcon,
    ReaperCatIcon,
    ScarecrowCatIcon,
    CheshireCatIcon,
    SchrodingerCatIcon,
    WormholeCatIcon,
} from '@/components/cats';

export const catComponentMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    'ginger': GingerCatIcon,
    'ghost': GhostCatIcon,
    'shadow': ShadowCatIcon,
    'bones': BonesCatIcon,
    'identity-crisis': IdentityCrisisCatIcon,
    'alt': AltCat,
    'breu': BreuCatIcon,
    'zumbi': ZumbiCatIcon,
    'blizzard': BlizzardCatIcon,
    'voodoo': VoodooCatIcon,
    'sleepy': SleepyCatIcon,
    'hologram': HologramCatIcon,
    'gravity': GravityCatIcon,
    'vampy': VampyCatIcon,
    'wonder': WonderCatIcon,
    'paradox': ParadoxCatIcon,
    'glitch': GlitchCatIcon,
    'anomaly': AnomalyCatIcon,
    'catankhamun': CatankhamunCatIcon,
    'cloud': CloudCatIcon,
    'cosmic': CosmicCatIcon,
    'domino': DominoCatIcon,
    'mystic': MysticCatIcon,
    'pixel': PixelCatIcon,
    'shark': SharkCatIcon,
    'sneeky': SneekyCatIcon,
    'snowball': SnowballCatIcon,
    'cursed': CursedCatIcon,
    'frank': FrankCatIcon,
    'pharaoh': PharaohCatIcon,
    'plague': PlagueCatIcon,
    'reaper': ReaperCatIcon,
    'scarecrow': ScarecrowCatIcon,
    'cheshire': CheshireCatIcon,
    'schrodinger': SchrodingerCatIcon,
    'wormhole': WormholeCatIcon,
};

/**
 * Set of cat IDs that have edge-to-edge / rectangular SVG drawings
 * (their solid body fills nearly 100% of their viewBox, without wide whisker/tail margins).
 * These need compact scaling so their body silhouette matches Domino Cat.
 */
export const COMPACT_FULL_BLEED_CAT_IDS = new Set<string>([
    'shark',
    'catankhamun',
    'glitch',
    'ghost',
    'identity-crisis',
    'bones',
    'ginger',
]);

/**
 * Set of cat IDs that share the standard viewBox or have animated frame/afterimage effects
 * that need tailored sizing/scaling to visually benchmark against Domino Cat.
 */
export const ANIMATED_FRAME_CAT_IDS = new Set<string>([
    'gravity',
    'paradox',
    'hologram',
    'voodoo',
    'blizzard',
    'zumbi',
    'breu',
    'shadow',
]);

export function isCompactFullBleedCat(catId?: string | null): boolean {
    return Boolean(catId && COMPACT_FULL_BLEED_CAT_IDS.has(catId));
}

export function isAnimatedFrameCat(catId?: string | null): boolean {
    return Boolean(catId && ANIMATED_FRAME_CAT_IDS.has(catId));
}

/**
 * Backwards-compatible union of all scaled cats.
 */
export const FULL_BLEED_CAT_IDS = new Set<string>([
    ...COMPACT_FULL_BLEED_CAT_IDS,
    ...ANIMATED_FRAME_CAT_IDS,
]);

export function isFullBleedCat(catId?: string | null): boolean {
    return Boolean(catId && FULL_BLEED_CAT_IDS.has(catId));
}

