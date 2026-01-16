import { toID } from '@pkmn/sim';
import { ItemId, TypeId } from '../types';

export function toTypeId(type: string): TypeId {
  return toID(type) as TypeId;
}

export function toItemId(item: string): ItemId {
  return toID(item) as ItemId;
}
