/**
 *
 * @class    Ext.jsv.DeletableList
 * @author   Ip Myung, Jin
 * @blog     http://blog.werconnected.info/
 * @twitter  https://twitter.com/#!/jsveron23
 * @facebook http://www.facebook.com/jsveron23
 * @email    jsveron23@gmail.com
 * @license  GPL v3
 *
 *			Ext.Loader.setPath({
 *				'Ext.jsv': 'jsv'
 *			});
 *
 *			Ext.application({
 *				requires: [
 *					'Ext.jsv.DeletableList'
 *			    ]
 *			});
 *
 *			Ext.define('MyApp.view.List', {
 *				extend: 'Ext.ux.DeletableList',
 *				
 *				config: {
 *					// localstage, sessionstorage ... => true
 *					// ajax, jsonp => false
 *					storage: true or fase, 
 *					itemTpl: Ext.create('Ext.XTemplate',
 *						.... list ....
 *						'<p class="delete" style="position: absolute; right: 5px; top: 20px; display: none;">',
 *							'<img src="resources/images/delete.png" alt="delete" />',
 *						'</p>'
 *					),						// like that
 *					store: 'MyStore'		// require
 *					deleteItemCls: 'p.delete',
 *					deleteItemTitle: 'Delete Item',
 *					deleteItemText: 'Are you sure?'
 *				}
 *			});
 *
 */

Ext.define('Ext.jsv.DeletableList', {
	extend: 'Ext.List',
	
	initialize: function() {
		this.callParent();
		
		// set store
		this.addStore = this.getStore();
		
		// event listeners
		this.on('itemswipe', this.onItemSwipeList, this);
		this.on('deleteitem', this.onDeleteItemList, this);
	},
	
	onItemSwipeList: function(list, idx, target) {
		var me  = this,
			cls = this.getDeleteItemCls();
			newDelBtn = target.down(cls);
		
		// animate
		Ext.Anim.run(newDelBtn, 'fade', {
			out: false,
			duration: 200
		});
		 
		newDelBtn.on('tap', function() {
			me.fireEvent('deleteitem', me, newDelBtn, idx, target);
		}, list, {
			single: true
		});
		
		this.toogleDel(newDelBtn);
	},
		
	onDeleteItemList: function(list, del, idx, target) {
		var store   = this.addStore,
			// true or false
			storage = this.getStorage(),
			title   = this.getDeleteItemTitle(),
			text    = this.getDeleteItemText();
		
		Ext.Msg.confirm(title, text, function(buttonId) {
			if(buttonId === 'yes') {				
				store.removeAt(idx);
				
				if(storage) {
					store.sync();
				}
			}
			
			if(del) {
				del.hide();
			}
		});
	},
	
	toogleDel: function(newDelBtn) {
		if(!this.oldDelBtn && this.oldDelBtn !== newDelBtn) {
			newDelBtn.show();
			this.oldDelBtn = newDelBtn;
		} else {
			if(this.oldDelBtn === newDelBtn) {
				newDelBtn.hide();
				
				this.oldDelBtn = null;
			} else {
				newDelBtn.show();
				this.oldDelBtn.hide();
				
				this.oldDelBtn = newDelBtn;
			}
		}
	},
});