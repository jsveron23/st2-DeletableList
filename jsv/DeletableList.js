/*
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
 *					itemTpl: Ext.create('Ext.XTemplate',
 *						.... list ....
 *						'<p class="delete" style="position: absolute; right: 5px; top: 20px; display: none;">',
 *							'<img src="resources/images/delete.png" alt="delete" />',
 *						'</p>'
 *					),						// like that
 *					store: 'MyStore'		// require
 *
 *					deletable: {
 *						storage: true,		// ajax, jsonp => false || localstorage, sessionstorage ... => true
 *						message: true,
 *						cls    : 'p.delete',
 *						title  : 'Delete Item',
 *						text   : 'Are you sure?'
 *					}
 *				}
 *			});
 *
 */

Ext.define('Ext.jsv.DeletableList', {
	extend: 'Ext.List',
	
	config: {
		deletable : null,
		scrollable: {
			directionLock: true
		}
	},
	
	initialize: function() {
		this.callParent();
		
		// store
		if(this.getStore()) {
			this.addStore = this.getStore();
		} else {
			this.warnMsg('Deletable Store', 'Please set store. Or it doesn\'t work!');
		}
				
		// setting of plugin
		if(this.getDeletable()) {
			this.setting = this.getDeletable();

			Ext.applyIf(this.setting, {
				storage: this.setting.storage || false,
				message: this.setting.message || false,
				cls    : this.setting.cls     || '.delete',
				title  : this.setting.title   || 'Delete Item',
				text   : this.setting.text    || 'Are you sure?'
			});
		} else {
			this.warnMsg('Deletable Store', 'Please set config for deletable list. Or it doesn\'t work!');
		}
		
		// event listeners
		this.on('itemswipe', this.onItemSwipeList, this);
		this.on('deleteitem', this.onDeleteItemList, this);
	},
	
	onItemSwipeList: function(list, idx, target) {
		var me  = this,
			cls = this.setting.cls;
			del = target.down(cls);
		
		// animate
		Ext.Anim.run(del, 'fade', {
			out: false,
			duration: 200
		});
		 
		// event
		del.on('tap', function() {
			me.fireEvent('deleteitem', me, del, idx, target);
		}, list, {
			single: true
		});
		
		// show or hide
		this.toogleDel(del);
	},
		
	onDeleteItemList: function(list, del, idx, target) {
		var message = this.setting.message,
			title   = this.setting.title,
			text    = this.setting.text;
			
		this.del = del;
		this.idx = idx;	
		
		if(message) {			
			Ext.Msg.confirm(title, text, this.doDeleteItem, this);
		} else {
			this.doDeleteItem('yes', del, idx);
		}
	},
	
	doDeleteItem: function(buttonId) {			
		this.del.hide();
		
		if(buttonId === 'yes') {
			var store   = this.addStore,
				storage = this.setting.storage;
							
			store.removeAt(this.idx);

			if(storage) {
				store.sync();
			}
		}
	},
	
	toogleDel: function(newDelBtn) {
		// first time or this.oldDelBtn = null;
		if(!this.oldDelBtn && this.oldDelBtn !== newDelBtn) {
			newDelBtn.show();
			this.oldDelBtn = newDelBtn;
		} else {
			// if you swipe again
			if(this.oldDelBtn === newDelBtn) {
				newDelBtn.hide();
				
				this.oldDelBtn = null;
			} 
			// old button is hide
			// new buttin is show
			else {
				newDelBtn.show();
				this.oldDelBtn.hide();
				
				this.oldDelBtn = newDelBtn;
			}
		}
	},
	
	warnMsg: function(title, text) {
		Ext.Msg.alert(title, text, Ext.emptyFn);
	}
});