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
		html.find('.warfare-config-add-item').click(this._onAddItem.bind(this));
		html.find('.warfare-config-rm-item').click(this._onRemoveItem.bind(this));
		html.find('.warfare-config-edit-item').click(this._onEditItem.bind(this));
	}

	getData () {
		const data = super.getData();
		data.warfare = this.actor.data.flags.warfare;
		data.unitCost = data.warfare?.stats?.cost == null ? '—' : data.warfare.stats.cost;
		data.warfareItems = {
			traits: [],
			actions: [],
			orders: []
		};

		for (const item of data.items) {
			const activation = item.data.activation.type;
			if (activation === 'action') {
				data.warfareItems.actions.push(item);
			} else if (activation === 'order') {
				data.warfareItems.orders.push(item);
			} else {
				data.warfareItems.traits.push(item);
			}

			item.data.description.enriched = TextEditor.enrichHTML(item.data.description.value, {
				secrets: data.owner,
				entities: true,
				links: true,
				rolls: true,
				rollData: this.actor.getRollData()
			});
		}

		return data;
	}

	_onAddItem (evt) {
		const dataset = evt.currentTarget.dataset;
		const data = {
			activation: {
				cost: dataset.cost ? Number(dataset.cost) : null,
				type: dataset.type || ""
			}
		};

		let name = 'NewTrait';
		if (dataset.type === 'action') {
			name = 'NewAction';
		}

		if (dataset.type === 'order') {
			name = 'NewOrder';
		}

		this.actor.createEmbeddedEntity('OwnedItem', {
			type: 'feat',
			name: game.i18n.localize(`WARFARE.${name}`),
			data: data
		}, {renderSheet: true});
	}

	_onEditItem (evt) {
		const item = this.actor.items.get(evt.currentTarget.parentElement.dataset.itemId);
		item.sheet.render(true);
	}

	_onRemoveItem (evt) {
		const target = evt.currentTarget;
		if (!target.classList.contains('warfare-alert')) {
			target.classList.add('warfare-alert');
			return;
		}

		this.actor.deleteEmbeddedEntity('OwnedItem', target.parentElement.dataset.itemId);
	}

	_onConfigClicked () {
		const currentStatus = !!this.actor.getFlag('warfare', 'sheet.config');
		this.actor.setFlag('warfare', 'sheet.config', !currentStatus);
	}

	_prepareItems () {

	}
}
