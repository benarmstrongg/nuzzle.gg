import type { Entity } from '../core';
import type { ICollider } from '../traits';

export type MaybeEntity = Entity | undefined | null | false;

export type ColliderEntity = Entity & ICollider;
