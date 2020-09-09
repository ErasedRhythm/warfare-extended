import WarfareUnitSheet from './sheet.js';

Hooks.on('init', () => {
	Actors.registerSheet('dnd5e', WarfareUnitSheet, {types: ['npc'], makeDefault: false});
});

Handlebars.registerHelper('number-format', function (n, options) {
	if (n == null) {
		return '';
	}

	const places = options.hash.decimals || 0;
	const sign = !!options.hash.sign;
	n = parseFloat(n).toFixed(places);
	return sign && n >= 0 ? '+' + n : n;
});
