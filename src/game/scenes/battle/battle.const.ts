export const ASSETS = {
    BG: 'sprites/ui/battle/city_bg.png',
    MESSAGE_BG: 'sprites/ui/battle/city_message_bg.png',
    BASE: 'sprites/ui/battle/city_base0.png',
    BASE_FOE: 'sprites/ui/battle/city_base1.png',
    DATABOX: 'sprites/ui/battle/databox_normal.png',
    DATABOX_FOE: 'sprites/ui/battle/databox_normal_foe.png',
    OVERLAY_COMMAND: 'sprites/ui/battle/overlay_command.png',
    OVERLAY_FIGHT: 'sprites/ui/battle/overlay_fight.png',
    LEVEL_LABEL: 'sprites/ui/common/overlay_lv.png',
} as const;

export const REQUIRED_ASSETS = [
    ASSETS.BG,
    ASSETS.BASE,
    ASSETS.BASE_FOE,
    ASSETS.DATABOX,
    ASSETS.DATABOX_FOE,
    ASSETS.OVERLAY_COMMAND,
    ASSETS.OVERLAY_FIGHT,
    ASSETS.LEVEL_LABEL,
    ASSETS.MESSAGE_BG,
] as const;

export const Z_INDEX = {
    BG: 0,
    BASE: 1,
    DATABOX: 2,
    POKEMON: 3,
    OVERLAY: 4,
    BUTTONS: 5,
} as const;
