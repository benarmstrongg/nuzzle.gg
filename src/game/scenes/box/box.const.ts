export const ASSETS = {
    BG: 'sprites/ui/box/bg.png',
    CURSOR_FIST: 'sprites/ui/box/cursor_fist.png',
    CURSOR_GRAB: 'sprites/ui/box/cursor_grab.png',
    MAIN_OVERLAY: 'sprites/ui/box/overlay_main.png',
    PARTY_OVERLAY: 'sprites/ui/box/overlay_party.png',
    PAGE_ART: [
        'sprites/ui/box/box_0.png',
        'sprites/ui/box/box_1.png',
        'sprites/ui/box/box_2.png',
        'sprites/ui/box/box_3.png',
        'sprites/ui/box/box_4.png',
        'sprites/ui/box/box_5.png',
        'sprites/ui/box/box_6.png',
        'sprites/ui/box/box_7.png',
        'sprites/ui/box/box_8.png',
        'sprites/ui/box/box_9.png',
        'sprites/ui/box/box_10.png',
        'sprites/ui/box/box_11.png',
        'sprites/ui/box/box_12.png',
        'sprites/ui/box/box_13.png',
        'sprites/ui/box/box_14.png',
        'sprites/ui/box/box_15.png',
        'sprites/ui/box/box_16.png',
        'sprites/ui/box/box_17.png',
        'sprites/ui/box/box_18.png',
        'sprites/ui/box/box_19.png',
        'sprites/ui/box/box_20.png',
        'sprites/ui/box/box_21.png',
        'sprites/ui/box/box_22.png',
        'sprites/ui/box/box_23.png',
        'sprites/ui/box/box_24.png',
        'sprites/ui/box/box_25.png',
        'sprites/ui/box/box_26.png',
        'sprites/ui/box/box_27.png',
        'sprites/ui/box/box_28.png',
        'sprites/ui/box/box_29.png',
        'sprites/ui/box/box_30.png',
        'sprites/ui/box/box_31.png',
        'sprites/ui/box/box_32.png',
        'sprites/ui/box/box_33.png',
        'sprites/ui/box/box_34.png',
        'sprites/ui/box/box_35.png',
        'sprites/ui/box/box_36.png',
        'sprites/ui/box/box_37.png',
        'sprites/ui/box/box_38.png',
        'sprites/ui/box/box_39.png',
    ],
} as const;

export const REQUIRED_ASSETS = [
    ASSETS.BG,
    ASSETS.CURSOR_FIST,
    ASSETS.CURSOR_GRAB,
    ASSETS.MAIN_OVERLAY,
    ASSETS.PARTY_OVERLAY,
];

export const STORAGE = {
    NUM_COLS: 6,
    NUM_ROWS: 5,
    ICON_WIDTH: 52,
    ICON_HEIGHT: 48,
    ICON_GAP: 2,
    CURSOR_OFFSET_X: 5,
    CURSOR_OFFSET_Y: -24,
    PAGE_SIZE: 30,
    PAGE_WIDTH: 324,
    PAGE_X: 507,
    PAGE_Y: 15,
} as const;

export const PREVIEW_PANEL = {
    NAME_POSITION: { x: 5, y: 4 },
    LEVEL_POSITION: { x: 5, y: 24 },
    TYPE_ANCHOR: { x: 1, y: 0 },
    TYPE_SCALE: 0.55,
    TYPE_1_POSITION: { x: 168, y: 7 },
    TYPE_2_POSITION: { x: 168, y: 23 },
    ABILITY_POSITION: { x: 12, y: 54 },
    NATURE_PLUS_POSITION: { x: 138, y: 54 },
    NATURE_MINUS_POSITION: { x: 138, y: 67 },
    SPRITE_ANCHOR: { x: 0.5, y: 0.5 },
    SPRITE_POSITION: { x: 90, y: 130 },
    SPRITE_SCALE: 1.3,
    ITEM_ANCHOR: { x: 0, y: 1 },
    ITEM_ICON_POSITION: { x: 10, y: 218 },
    ITEM_NAME_POSITION: { x: 37, y: 215 },
    MOVE_NAME_POSITION_X: 9,
    MOVE_TYPE_PP_ANCHOR: { x: 1, y: 0 },
    MOVE_TYPE_PP_POSITION_X: 166,
    MOVE_GAP_Y: 36,
    MOVE_1_NAME_POSITION_Y: 240,
    MOVE_1_TYPE_POSITION_Y: 234,
    MOVE_1_PP_POSITION_Y: 250,
} as const;

export const PARTY_BUTTON = {
    POSITION: { x: 241, y: 328 },
    TEXT: 'PARTY',
};
export const BUTTONS = {
    PARTY: {
        POSITION: { x: 241, y: 328 },
        TEXT: 'PARTY',
    },
    START: {
        POSITION: { x: 415, y: 328 },
        TEXT: 'START',
    },
};

export const MENU_ITEMS = {
    POKEMON_STORAGE: ['WITHDRAW', 'SUMMARY', 'ITEM', 'BACK'] as const,
    ITEM: ['TAKE', 'GIVE', 'BACK'] as const,
} as const;

export const PARTY_TRAY = {
    OPEN_POSITION: { x: 338, y: 32 },
    CLOSED_POSITION: { x: 338, y: 388 },
    FIRST_SLOT_GLOBAL_POSITION: { x: 355, y: 45 },
    FIRST_SLOT_LOCAL_POSITION: { x: 15, y: 5 },
    ROW_GAP: 65,
    COL_GAP: 70,
    START_BUTTON_POSITION: { x: 45, y: 215 },
} as const;

export const Z_INDEX = {
    OVERLAY: 0,
    PAGE: 2,
    DATA: 3,
    CURSOR: 4,
};
