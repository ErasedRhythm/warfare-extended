import ActorSheet5e from '../../../systems/dnd5e/module/actor/sheets/base.js';

export default class WarfareUnitSheet extends ActorSheet5e {
	static get defaultOptions () {
		return mergeObject(super.defaultOptions, {
			classes: ['warfare', 'warfare-unit'],
			scrollY: ['form'],
			width: 340,
			height: 415
		});
	}

	get template () {
		return 'modules/warfare/templates/unit-card.html';
	}

	activateListeners (html) {
		super.activateListeners(html);
		if (!this.isEditable) {
			return;
		}

		html.find('.warfare-unit-config').click(this._onConfigClicked.bind(this));
	}

	getData () {
		const data = super.getData();
		data.warfare = this.actor.data.flags.warfare;
		data.unitCost = data.warfare?.stats?.cost == null ? '—' : data.warfare.stats.cost;
		return data;
	}

	_onConfigClicked () {
		const currentStatus = !!this.actor.getFlag('warfare', 'sheet.config');
		this.actor.setFlag('warfare', 'sheet.config', !currentStatus);
	}

	_prepareItems () {

	}
}
