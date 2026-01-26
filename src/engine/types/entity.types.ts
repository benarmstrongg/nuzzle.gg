import type { Entity } from '../core';
import type { ICollider, IContainer } from '../traits';

export type MaybeEntity = Entity | undefined | null | false;

export type ContainerEntity = Entity & IContainer;

export type ColliderEntity = Entity & ICollider;
