import Actor5e from '../../../systems/dnd5e/module/actor/entity.js';

export default function extendActor () {
	Actor5e.prototype.prepareDerivedData = (function () {
		const original = Actor5e.prototype.prepareDerivedData;
		return function () {
			original.apply(this, arguments);
			const stats = this.data.flags.warfare?.stats;
			if (!stats) {
				return;
			}

			if (!stats.casualties) {
				stats.casualties = {taken: 0, max: 0};
			}

			if (typeof stats.size === 'string' && stats.size !== '') {
				const die = Number(stats.size.split('d')[1]);
				if (!isNaN(die)) {
					stats.casualties.max = die;
				}
			}

			stats.casualties.remaining = stats.casualties.max - stats.casualties.taken;
			if (stats.casualties.remaining < 0) {
				stats.casualties.remaining = 0;
			}

			stats.casualties.diminished = stats.casualties.remaining <= stats.casualties.max / 2;
		}
	})();
};
