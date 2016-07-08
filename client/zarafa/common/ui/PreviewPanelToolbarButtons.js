Ext.namespace('Zarafa.common.ui');

/**
 * @class Zarafa.common.ui.PreviewPanelToolbarButtons
 * @extends Object
 *
 * Contains special toolbar buttons for the previewpanel.
 */
Zarafa.common.ui.PreviewPanelToolbarButtons = Ext.extend(Object, {
	/**
	 * @cfg {@link Zarafa.core.ContextModel}
	 */
	model : undefined,

	/**
	 * @constructor
	 * @param config Configuration structure
	 */
	constructor : function(config)
	{
		Ext.apply(this, config);
	},

	/**
	 * Function called when insertion point previewpanel.toolbar.right is called,
	 * Function returns configuration object for Copy/Move, Delete and Print buttons
	 * which are added on the right side of previewpanels toolbar.
	 * @param {String} insertionPoint name of the insertion point
	 * @param {Object} options (optional) optional arguments such as scope
	 * @return {Object} Configuration object containing buttons
	 * which are added in the {@link Ext.Toolbar Toolbar}.
	 */
	getToolbarButtons : function(insertionPoint, options)
	{
		// Use model that is passed as arguments for these buttons, if any.
		var model = this.model;
		if(Ext.isDefined(options.model) && options.model instanceof Zarafa.core.ContextModel) {
			model = options.model;
		}

		return [{
			xtype: 'zarafa.toolbarbutton',
			tooltip: _('Delete') + ' (DELETE)',
			overflowText: _('Delete'),
			iconCls: 'icon_delete',
			nonEmptySelectOnly: true,
			handler: this.onDelete,
			model: model
		},{
			xtype: 'splitbutton',
			cls: 'zarafa-more-options-btn',
			tooltip: _('More options'),
			overflowText: _('More options'),
			iconCls: 'icon_more',
			nonEmptySelectOnly: true,
			model: model,
			menu : this.moreMenuButtons(model),
			handler: function() {
				this.showMenu();
			}
		}];
	},

	/**
	 * The menu items of the more button.
	 *
	 * @param {Zarafa.mail.dialogs.ShowMailToolbar} scope The scope for the menu items
	 * @return {Ext.menu.Menu} the dropdown menu for the more button
	 */
	moreMenuButtons : function(model)
	{
		return {
			xtype: 'menu',
			items: [{
				tooltip: _('Copy/Move') + ' (Ctrl + M)',
				text: _('Copy/Move'),
				iconCls: 'icon_copy',
				model: model,
				handler: this.onCopyMove
			},{
				tooltip: _('Edit asNew Message') + ' (Ctrl + E)',
				text: _('Edit as New Message'),
				iconCls: 'icon_editAsNewEmail',
				model: model,
				handler: this.onEditAsNewMessage
			}]
	        };
	},

	/**
	 * Open the {@link Zarafa.common.dialogs.CopyMoveContent CopyMoveContent} for copying
	 * or moving the currently selected records.
	 * @private
	 */
	onCopyMove : function()
	{
		Zarafa.common.Actions.openCopyMoveContent(this.model.getSelectedRecords());
	},

	/**
	 * Delete the currently selected messages. If any of the records is a recurring item,
	 * then the {@link #Zarafa.common.dialogs.MessageBox.select MessageBox} will be used
	 * to select between the recurring and single appointment.
	 * @private
	 */
	onDelete : function()
	{
		Zarafa.common.Actions.deleteRecords(this.model.getSelectedRecords());
	},

	/**
	 * "Edit as New Message" menuitem of more button handler
	 * @private
	 */
	onEditAsNewMessage : function()
	{
		Zarafa.mail.Actions.openCreateMailResponseContent(this.model.getSelectedRecords(), this.model, Zarafa.mail.data.ActionTypes.EDIT_AS_NEW);
	}
});
