import { ColliderEntity } from 'nuzzlengine/types';

export class ActiveCollisions {
  private activeCollisions = new Map<ColliderEntity, Set<ColliderEntity>>();

  constructor() {
    this.activeCollisions = new Map();
  }

  onEnter(entity1: ColliderEntity, entity2: ColliderEntity) {
    entity1.collider.enter(entity2);
    entity2.collider.enter(entity1);

    const active1 = this.getActiveCollisions(entity1);
    active1.add(entity2);
    const active2 = this.getActiveCollisions(entity2);
    active2.add(entity1);
  }

  onExit(entity1: ColliderEntity, entity2: ColliderEntity) {
    entity1.collider.exit(entity2);
    entity2.collider.exit(entity1);

    const active1 = this.getActiveCollisions(entity1);
    active1.delete(entity2);
    const active2 = this.getActiveCollisions(entity2);
    active2.delete(entity1);
  }

  getActiveCollisions(entity: ColliderEntity) {
    if (!this.activeCollisions.has(entity)) {
      this.activeCollisions.set(entity, new Set());
    }

    return this.activeCollisions.get(entity)!;
  }

  cleanup(entity: ColliderEntity) {
    const activeCollisions = this.activeCollisions.get(entity);

    if (!activeCollisions) return;

    activeCollisions.forEach((otherEntity) => {
      const otherCollisions = this.activeCollisions.get(otherEntity);
      if (otherCollisions) {
        otherCollisions.delete(entity);
      }
      entity.collider.exit(otherEntity);
      otherEntity.collider.exit(entity);
    });
    this.activeCollisions.delete(entity);
  }
}
