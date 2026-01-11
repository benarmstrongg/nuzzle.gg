import { Dex, Pokemon } from 'pokemon-showdown/sim';
import { ContainerObject, TextObject, SpriteObject } from '../../../../engine';
import { font } from '../../../util/font.util';
import { SummaryPage } from '../summary.types';

export class StatsPage extends ContainerObject implements SummaryPage {
  private $hp = new ContainerObject({
    sections: {
      label: new TextObject({
        text: 'HP',
        style: font({ size: 'xxlarge', color: 'white' }),
        position: { x: 286, y: 80 },
      }),
      value: new TextObject({
        style: font({ size: 'xxlarge' }),
        position: { x: 386, y: 80 },
      }),
      bar: new SpriteObject({
        position: { x: 0, y: 0 },
      }),
    },
  });
  private $stats = new ContainerObject({
    sections: {
      headerCol: new ContainerObject<{
        [K in Pokemon['storedStats']]: TextObject;
      }>({
        sections: {
          atk: new TextObject({
            text: 'Attack',
            style: font({ size: 'xxlarge', color: 'white' }),
            anchor: { x: 0.5, y: 0 },
            position: { x: 295, y: 124 },
          }),
          def: new TextObject({
            text: 'Defense',
            style: font({ size: 'xxlarge', color: 'white' }),
            anchor: { x: 0.5, y: 0 },
            position: { x: 295, y: 156 },
          }),
          spa: new TextObject({
            text: 'Sp. Atk',
            style: font({ size: 'xxlarge', color: 'white' }),
            anchor: { x: 0.5, y: 0 },
            position: { x: 295, y: 188 },
          }),
          spd: new TextObject({
            text: 'Sp. Def',
            style: font({ size: 'xxlarge', color: 'white' }),
            anchor: { x: 0.5, y: 0 },
            position: { x: 295, y: 220 },
          }),
          spe: new TextObject({
            text: 'Speed',
            style: font({ size: 'xxlarge', color: 'white' }),
            anchor: { x: 0.5, y: 0 },
            position: { x: 295, y: 252 },
          }),
        },
      }),
      dataCol: new ContainerObject<{
        [K in Pokemon['storedStats']]: TextObject;
      }>({
        sections: {
          atk: new TextObject({
            style: font({ size: 'xxlarge' }),
            anchor: { x: 0.5, y: 0 },
            position: { x: 418, y: 124 },
          }),
          def: new TextObject({
            style: font({ size: 'xxlarge' }),
            anchor: { x: 0.5, y: 0 },
            position: { x: 418, y: 156 },
          }),
          spa: new TextObject({
            style: font({ size: 'xxlarge' }),
            anchor: { x: 0.5, y: 0 },
            position: { x: 418, y: 188 },
          }),
          spd: new TextObject({
            style: font({ size: 'xxlarge' }),
            anchor: { x: 0.5, y: 0 },
            position: { x: 418, y: 220 },
          }),
          spe: new TextObject({
            style: font({ size: 'xxlarge' }),
            anchor: { x: 0.5, y: 0 },
            position: { x: 418, y: 252 },
          }),
        },
      }),
    },
  });
  private $ability = new ContainerObject({
    sections: {
      label: new TextObject({
        text: 'Ability',
        style: font({ size: 'xxlarge', color: 'white' }),
        position: { x: 258, y: 288 },
      }),
      name: new TextObject({
        style: font({ size: 'xxlarge' }),
        anchor: { x: 0.5, y: 0 },
        position: { x: 418, y: 288 },
      }),
      description: new TextObject({
        style: font({
          size: 'medium',
          wrap: true,
          wrapWidth: 292,
          lineHeight: 30,
        }),
        position: { x: 224, y: 318 },
      }),
    },
  });

  constructor() {
    super();
    this.addChild(this.$hp, this.$stats, this.$ability);
  }

  setData(pokemon: Pokemon) {
    this.$hp.sections.value.setText(`${pokemon.hp}/${pokemon.maxhp}`, this);
    Object.entries<string>(pokemon.storedStats).forEach(([key, value]) => {
      const $stat = this.$stats.sections.dataCol.sections[key];
      $stat.setText(value, this);
    });
    if (pokemon.set.nature.plus) {
      this.$stats.sections.headerCol.sections[
        pokemon.set.nature.plus
      ].style.fill = 'red';
    }
    if (pokemon.set.nature.minus) {
      this.$stats.sections.headerCol.sections[
        pokemon.set.nature.minus
      ].style.fill = 'blue';
    }
    const abilityData = Dex.abilities.get(pokemon.set.ability);
    this.$ability.sections.name.setText(abilityData.name, this);
    this.$ability.sections.description.setText(abilityData.shortDesc, this);
  }
}
