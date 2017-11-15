/*
 * 视图控制器 - 角色管理
 */

Ext.define("App.view.role.RoleController", {
	extend: "Ext.app.ViewController",
	alias: "controller.role",
	
	uses: ["App.view.role.RoleWin"],
	
	//初始化
	init: function() {
		if(!this.gr) {
			this.gr = Ext.getCmp("roleGrid");
		}
		if(!this.st) {
			//this.st = this.getView().getStore(); //通过View获取Store
			//this.st = this.getViewModel().getStore("role"); //通过ViewModel获取Store
			this.st = this.gr.getStore(); //通过Component获取Store
		}
	},
	
	//搜索
	search: function() {
		this.getViewModel().getStore("role").reload();
	},
	
	//新增
	add: function() {
		var win = Ext.create("App.view.role.RoleWin");
		win.show();
	},
	
	//编辑
	edit: function(grid, rowIndex, colIndex) {
		var rec = grid.getStore().getAt(rowIndex);		
		var win = Ext.create("App.view.role.RoleWin", {
			title: "编辑角色 - #" + rec.get("id")
		});
		win.down("form").loadRecord(rec);
		win.show();
	},
	
	//删除
	del: function(grid, rowIndex, colIndex) {
		var msg = "确认删除角色：" + grid.getStore().getAt(rowIndex).get("roleName") + " ？";
		Ext.Msg.confirm("确认", msg, function(res) {
			if(res == "yes") {
				grid.getStore().removeAt(rowIndex);
			}
		});
	},
	
	//批量删除
	batchDel: function() {
		if(this.gr.getSelectionModel().hasSelection()) {
			var st = this.gr.getStore();
			var recs = this.gr.getSelectionModel().getSelection();
			var names = "";
			for(var i=0;i<recs.length;i++) {
				names += recs[i].data.roleName+"<br />";
			}
			Ext.Msg.confirm("确认", "确认删除以下角色？<br />"+names, function(res) {
				if(res=="yes") {
					st.remove(recs);
				}
			});
		}else {
			Ext.Msg.alert("信息", "请选择要删除的角色！");
		} 
	},
	
	//保存
	save: function(btn) {
		var fr = this.lookupReference("roleForm").getForm();
		if(fr.isValid()) {
			var id = fr.findField("id").getValue();
			if(id) { //编辑
				var rec = this.st.getById(id);
				rec.set("roleName", fr.findField("roleName").getValue());
				rec.set("roleDesc", fr.findField("roleDesc").getValue());
//				this.store.rejectChanges();	//取消所有修改
				this.st.commitChanges();	//提交修改数据
			}else { //新增
				var obj = fr.getFieldValues();
				obj.id = this.st.last() ? parseInt(this.st.last().get("id"))+1 : 1;
				this.st.add(obj);
			}
			btn.up("rolewin").close();
		}
	},
	
	//取消
	cancel: function(btn) {
		btn.up("rolewin").close();
	}
});