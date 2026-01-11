import { Container, Entity, IContainer } from '../../../../../../../engine';

const width = 320;
const height = 46;
const x = 0;

export class StoragePageHeader extends Entity implements IContainer {
  container = new Container(this);

  constructor(name: string) {
    super();

    this.transform.set({ width, height, x });
    this.container.layout.flex({ justify: 'center', align: 'center' });
    this.container.add(Entity.text(name));
  }
}
