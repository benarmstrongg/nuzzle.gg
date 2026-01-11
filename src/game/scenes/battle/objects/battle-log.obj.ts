import { ContainerOptions } from 'pixi.js';
import { MessageBox } from '../../../entities';
import { Battle } from 'pokemon-showdown/sim';
import { toID } from 'pokemon-showdown/sim/dex-data';
import { Side } from '../battle.types';

type BattleLogOptions = ContainerOptions & {
  battle: Battle;
};

type BattleEvent =
  | { type: 'move'; side: Side; move: string }
  | { type: 'switch'; side: Side; pokemon: string }
  | { type: 'damage' | 'heal'; side: Side; hp: number }
  | { type: 'status'; side: Side; hp: number; status: string };

const ASYNC_ACTIONS = new Set(['-supereffective', '-resisted']);

export class BattleLog extends MessageBox {
  private logs: string[] = [];
  private battle: Battle;
  private generalText: Record<string, Record<string, string>>;
  private moveText: Record<string, Record<string, string>>;
  private itemText: Record<string, Record<string, string>>;
  private abilityText: Record<string, Record<string, string>>;

  constructor(opts: BattleLogOptions) {
    super(opts);
    this.battle = opts.battle;
    const textData = opts.battle.dex.loadTextData();
    this.generalText = textData.Default;
    this.moveText = textData.Moves;
    this.itemText = textData.Items;
    this.abilityText = textData.Abilities;
  }

  async init() {
    this.logTurn(async () => {});
    return super.init();
  }

  async logTurn(onAction: (actionType: BattleEvent) => Promise<void>) {
    const newLogs = this.battle.log.slice(this.logs.length);
    newLogs.forEach((log) => {
      this.logs.push(log);
      const isDisplayLog = true;
      if (isDisplayLog) {
        console.log(log);
      }
    });
    for (const log of newLogs) {
      const message = this.getLogMessage(log);
      const event = this.getLogAction(log);
      if (message) {
        console.log(message);
        if (event?.type && ASYNC_ACTIONS.has(event.type)) {
          this.displayMessage(message.trim(), {
            closeAfterComplete: !event,
          });
        } else {
          await this.displayMessage(message.trim(), {
            closeAfterComplete: !event,
          });
        }
      }
      if (event) {
        await onAction(event);
      }
    }
  }

  /**
   * Gets formatted display text from pokemon-showdown sim log message
   *
   * https://github.com/smogon/pokemon-showdown/blob/master/sim/SIM-PROTOCOL.md
   * @param log pokemon-showdown sim log message
   * @returns formatted display text
   */
  private getLogMessage(log: string): string {
    const [_, logType, ...data] = log.split('|');
    switch (logType) {
      case 'move': {
        const [pokemon, move, _target] = data;
        return this.format(this.generalText.default.move, {
          pokemon,
          move,
        });
      }
      case 'switch': {
        const isDuplicate = !data.pop()?.includes('/100');
        if (isDuplicate) {
          return '';
        }
        const [pokemon] = data;
        const messageName = pokemon.includes('p1') ? 'switchInOwn' : 'switchIn';
        return this.format(this.generalText.default[messageName], {
          pokemon,
        });
      }
      case 'drag': {
        const [pokemon] = data;
        return this.format(this.generalText.default.drag, { pokemon });
      }
      case 'detailschange': {
        return 'todo';
      }
      case 'faint': {
        const [pokemon] = data;
        return this.format(this.generalText.default.faint, { pokemon });
      }
      case '-crit':
      case '-resisted': {
        return this.generalText.default[toID(logType)];
      }
      case '-supereffective': {
        return this.generalText.default.superEffective;
      }
      case '-immune': {
        const [pokemon] = data;
        return this.format(this.generalText.default.immune, {
          pokemon,
        });
      }
      case '-activate': {
        const [pokemon, effect] = data;
        const effectId = toID(effect.replace('move:', ''));
        console.log([pokemon, effectId], data);
        return this.format(this.moveText[effectId].start, {
          pokemon,
        });
      }
      case '-fail': {
        return this.generalText.default.fail;
      }
      case '-block': {
        const [pokemon, effect, move, _attacker] = data;
        console.log(move);
        const messageName = move ? 'blockMove' : 'block';
        return this.format(this.generalText[effect][messageName], {
          pokemon,
        });
      }
      case '-notarget':
      case '-miss': {
        const [_source, target] = data;
        return this.format(this.generalText.default.miss, {
          pokemon: target,
        });
      }
      case '-damage': {
        const [_pokemon, hpAndStatus] = data;
        const isDuplicate = hpAndStatus.includes('/100');
        if (isDuplicate) {
          return '';
        }
        const [_hp, status] = hpAndStatus.split(' ');
        if (!status || status === 'fnt') {
          return '';
        }
        return this.generalText[status].damage;
      }
      case '-heal': {
        const [pokemon, hpAndStatus, from] = data;
        const isDuplicate = hpAndStatus.includes('/100');
        if (isDuplicate) {
          return '';
        }
        const [_hp, status] = hpAndStatus.split(' ');
        if (status) {
          return this.generalText[status].heal;
        }
        if (from) {
          if (from.includes('item:')) {
            const item = toID(from.split('item: ').pop());
            return this.format(this.itemText[item].heal, {
              pokemon,
            });
          }
        }
        return this.format(this.generalText.default.heal, { pokemon });
      }
      case '-sethp': {
        const [_pokemon, _hp] = data;
        return '';
      }
      case '-status': {
        const [pokemon, status] = data;
        return this.format(this.generalText[status].start, { pokemon });
      }
      case '-curestatus': {
        const [pokemon, status] = data;
        return this.format(this.generalText[status].end, { pokemon });
      }
      case '-cureteam': {
        const [_pokemon] = data;
        return 'todo: cureteam';
      }
      case '-boost': {
        const [pokemon, stat, amount] = data;
        const messageName = amount === '1' ? 'boost' : `boost${amount}`;
        return this.format(this.generalText.default[messageName], {
          pokemon,
          stat,
        });
      }
      case '-unboost': {
        const [pokemon, stat, amount] = data;
        const messageName = amount === '1' ? 'unboost' : `unboost${amount}`;
        return this.format(this.generalText.default[messageName], {
          pokemon,
          stat,
        });
      }
      case '-swapboost': {
        const [source, _target, _stats] = data;
        return this.format(this.generalText.default.swapBoost, {
          pokemon: source,
        });
      }
      case '-invertboost': {
        const [pokemon] = data;
        return this.format(this.generalText.default.invertBoost, {
          pokemon,
        });
      }
      case '-clearboost': {
        const [pokemon] = data;
        return this.format(this.generalText.default.clearBoost, {
          pokemon,
        });
      }
      case '-clearallboost': {
        return this.generalText.default.clearAllBoost;
      }
      case '-clearpositiveboost': {
        const [_target, _pokemon, _effect] = data;
        return 'todo: clearpositiveboost';
      }
      case '-clearnegativeboost': {
        const [_pokemon] = data;
        return 'todo: clearnegativeboost';
      }
      case '-copyboost': {
        const [source, _target] = data;
        return this.format(this.generalText.default.copyBoost, {
          pokemon: source,
        });
      }
      case '-weather': {
        if (!data.includes('upkeep')) {
          return '';
        }
        const [weather] = data;
        return this.generalText[toID(weather)].upkeep;
      }
      case '-fieldstart': {
        const [condition] = data;
        const conditionId = toID(condition.replace('move:', ''));
        return this.generalText[toID(conditionId)].start;
      }
      case '-fieldend': {
        const [condition] = data;
        return this.generalText[toID(condition)].end;
      }
      case '-sidestart': {
        const [_side, condition] = data;
        console.log([_side, toID(condition.replace('move:', ''))], data);
        const conditionId = toID(condition.replace('move:', ''));
        return (
          this.generalText[toID(conditionId)]?.start ||
          this.moveText[toID(conditionId)]?.start
        );
      }
      case '-sideend': {
        const [_side, condition] = data;
        console.log([_side, condition], data);
        return (
          this.generalText[toID(condition)]?.end ||
          this.moveText[toID(condition)]?.end
        );
      }
      case '-swapsideconditions': {
        return this.moveText.courtchange.activate;
      }
      case '-start': {
        const [pokemon, effect] = data;
        console.log([pokemon, effect], data);
        return this.format(
          this.generalText[toID(effect)]?.start ||
            this.moveText[toID(effect)]?.start,
          { pokemon }
        );
      }
      case '-end': {
        const [pokemon, effect] = data;
        console.log([pokemon, effect], data);
        return this.format(
          this.generalText[toID(effect)]?.end ||
            this.moveText[toID(effect)]?.end,
          { pokemon }
        );
      }
      case '-item': {
        const [pokemon, item] = data;
        console.log([pokemon, item], data);
        return 'todo: item';
      }
      case '-enditem': {
        const [pokemon, item, effect] = data;
        const messageName = !!effect ? effect : 'end';
        return this.format(this.itemText[toID(item)][messageName], {
          pokemon,
        });
      }
      case '-ability': {
        const [pokemon, ability] = data;
        return this.format(this.abilityText[toID(ability)].start, {
          pokemon,
        });
      }
      case '-endability': {
        const [pokemon] = data;
        return this.format(this.moveText.gastroacid.start, { pokemon });
      }
      case '-transform': {
        const [pokemon, species] = data;
        return this.format(this.moveText.transform.transform, {
          pokemon,
          species,
        });
      }
      case '-combine': {
        return this.generalText.default.combine;
      }
      case '-prepare': {
        const [attacker, move, defender] = data;
        return this.format(this.moveText[move].prepare, {
          pokemon: attacker,
          target: defender,
        });
      }
      case '-mustrecharge': {
        const [pokemon] = data;
        return this.format(this.generalText.recharge.cant, { pokemon });
      }
      case '-hitcount': {
        const [_pokemon, num] = data;
        if (num === '1') {
          return this.generalText.default.hitCountSingular;
        }
        return this.format(this.generalText.default.hitCountSingular, {
          num,
        });
      }
      case '-singlemove':
      case '-singleturn': {
        const [pokemon, move] = data;
        console.log([pokemon, move], data);
        return this.format(this.moveText[toID(move)].activate, {
          pokemon,
        });
      }
    }
    return '';
  }

  private getLogAction(log: string): BattleEvent | null {
    const [_, logType, ...data] = log.split('|');
    switch (logType) {
      case 'move': {
        const [pokemon, move] = data;
        const side: Side = pokemon.includes('p1') ? 'user' : 'foe';
        return { type: 'move', side, move: toID(move) };
      }
      case '-damage':
      case '-heal': {
        const type = logType === '-damage' ? 'damage' : 'heal';
        const [pokemon, hp] = data;
        const [remainingHp, maxHp] = hp.split('/').map(Number);
        const side: Side = pokemon.includes('p1') ? 'user' : 'foe';
        return { type, side, hp: remainingHp / maxHp };
      }
      case '-status': {
        const [pokemon, hp, status] = data;
        const [remainingHp, maxHp] = hp.split('/').map(Number);
        const side: Side = pokemon.includes('p1') ? 'user' : 'foe';
        return {
          type: 'status',
          side,
          hp: remainingHp / maxHp,
          status,
        };
      }
    }
    return null;
  }

  private format(
    text: string,
    replacements: {
      pokemon?: string;
      move?: string;
      stat?: string;
      target?: string;
      species?: string;
      num?: string;
    }
  ): string {
    const { pokemon, move, stat, target, species, num } = replacements;
    let formattedText = text || '';
    if (pokemon) {
      const pokemonName = pokemon.split(': ').pop() || pokemon;
      formattedText = formattedText
        .replace('[POKEMON]', pokemonName)
        .replace('[FULLNAME]', pokemonName)
        .replace('[NICKNAME]', pokemonName);
    }
    if (move) {
      formattedText = formattedText
        .replace('**[MOVE]**', move)
        .replace('[MOVE]', move);
    }
    if (stat) {
      formattedText = formattedText.replace('[STAT]', stat);
    }
    if (target) {
      formattedText = formattedText.replace('[TARGET]', target);
    }
    if (species) {
      formattedText = formattedText.replace('[SPECIES]', species);
    }
    if (num) {
      formattedText = formattedText.replace('[NUMBER]', num);
    }
    return formattedText;
  }
}
