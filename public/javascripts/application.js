// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults

var StatusBar = Behavior.create({
	onclick: function(e)
	{
		var source = Event.element(e);
		Event.stop(e);
		
		Effect.Fade(source);
	}
});

// Userbox stuff

var PopupMenu = Behavior.create({
	initialize: function()
	{
		PopupMenu.current_popup = null;
	},
	
	onclick: function(e)
	{
		var element = e.element();
		e.stop();
		
		var popup_menu = $(element.identify() + '_menu');
		if (popup_menu && (popup_menu != PopupMenu.current_popup))
		{
			var offset = Position.cumulativeOffset(element);
			offset[1] += element.offsetHeight;
			this.switch_menu(offset, popup_menu);
		}
		else
		{
			this.switch_menu(null, null);
		}
	},
	
	switch_menu: function(new_pos, new_menu)
	{
		if (PopupMenu.current_popup)
		{
			PopupMenu.current_popup.style.display = 'none';
		}
		
		PopupMenu.current_popup = new_menu;
		
		if (!new_menu)
			return;
		
		new_menu.style.left = new_pos[0] + 'px';
		new_menu.style.top = new_pos[1] + 'px';
		new_menu.style.display = 'block';
	}
});

// Login form stuff

function login_toggle_openid()
{
	var toggle_box = $('loginOpenID');
	if (toggle_box.checked)
	{
		$('openid_login').style.display = 'block';
		$('normal_login').style.display = 'none';
	}
	else
	{
		$('openid_login').style.display = 'none';
		$('normal_login').style.display = 'block';
	}
}


// Task form stuff

function task_form_show_add(id)
{
	$('addTaskForm' + id).style.display = 'block';
}

function task_form_hide_add(id)
{
	$('addTaskForm' + id).style.display = 'none';
}

function task_form_loaded_add(id)
{
}

function task_form_loading_add(id)
{
}

function task_view_edit(id, pid)
{
    Sortable.destroy('openTasksList' + id);
    $('editTaskList' + id).hide();
    $('sortTaskList' + id).show();
}

function task_view_sort(id, pid)
{
	$('sortTaskList' + id).hide();
	$('editTaskList' + id).show();
	Sortable.create('openTasksList' + id, 
	{
		onUpdate:function() 
		{ 
			new Ajax.Request('/project/' + pid + '/task/reorder_list/' + id, 
			{
			asynchronous:true, evalScripts:false,
			onComplete:function(request) {new Effect.Highlight('openTasksList' + id, {});},
			parameters:Sortable.serialize('openTasksList' + id, {name: 'list'}) + "&authenticity_token=" + AUTH_TOKEN
			})
		}, 
	ghosting: true}
	)
}

// Permissions form stuff
var permissions_form_items = [];

function permissions_form_project_select(id)
{
	$('projectPermissionsBlock' + id).style.display = $('projectPermissions' + id).checked ? 'block' : 'none';
}

function permissions_form_project_select_company(id)
{
	$('projectCompanyUsers' + id).style.display = $('projectCompany' + id).checked ? 'block' : 'none';
}

function permissions_form_project_select_all(id)
{
	var val = $('projectPermissions' + id + 'All').checked;
	
	// Select all items then!
	permissions_form_items.each(function(permission){
		$('projectPermission' + id + permission).checked = val;
	});
}

function permissions_form_project_select_item(id)
{
	var do_all = true;
	
	// Check to see if everything has been selected
	permissions_form_items.each(function(permission){
		if (!$('projectPermission' + id + permission).checked)
			do_all = false;
	});
	
	$('projectPermissions' + id + 'All').checked = do_all;
}

function permissions_form_items_set(list)
{
	permissions_form_items = list;
}

// Form form stuff

function form_form_update_action()
{
	$('projectFormActionSelectMessage').disabled = !$('projectFormActionAddComment').checked;
	$('projectFormActionSelectTaskList').disabled =  !$('projectFormActionAddTask').checked;
}

// User form stuff

function user_form_update_passwordgen()
{
	userFormPasswordInputs.style.display = $('userFormGeneratePassword').checked ? 'none' : 'block';
}

// File form stuff
var file_form_controls = null;

function file_form_select_revision()
{
	$('fileFormRevisionCommentBlock').style.display = $('fileFormVersionChange').checked ? 'block' : 'none';
}

function file_form_select_update()
{
	$('updateFileForm').style.display = $('fileFormUpdateFile').checked ? 'block' : 'none';	
}

function file_form_attach_update_action()
{
	$('attachFormSelectFile').disabled = !$('attachFormExistingFile').checked;
	$('attachFilesInput_1').disabled = !$('attachFormNewFile').checked;
}

function file_form_attach_init(limit)
{
	if (file_form_controls != null)
		return;
	
	file_form_controls = {'count' : 1, 'next_id' : 2, 'limit' : limit};
	
	var add_button = document.createElement('button');
    add_button.setAttribute('type', 'button');
    add_button.setAttribute('id', 'attachFilesAdd');
    add_button.className = 'add_button';
    add_button.appendChild(document.createTextNode( "Add file" ));
	
	$('attachFiles').appendChild(add_button);
	
	add_button.observe('click', function(event){
		file_form_attach_add();
	});
}

function file_form_attach_add()
{
	// Check to see if we have reached the limit
	if (file_form_controls.count >= file_form_controls.limit)
		return;
	
	var cur_id = file_form_controls.next_id;
	
	var attach_div = document.createElement('div');
	attach_div.id = 'attachFiles' + '_' + cur_id;
	
	var file_input = document.createElement('input');
	file_input.id = 'attachFilesInput_' + '_' + cur_id;
	file_input.setAttribute('type', 'file');
	file_input.setAttribute('name', 'uploaded_files[]');
	
	var remove_button = document.createElement('button');
	remove_button.setAttribute('type', 'button');
	remove_button.className = 'remove_button';
	remove_button.appendChild(document.createTextNode("Remove"));
	
	remove_button.observe('click', function(event){
		file_form_attach_remove(cur_id);
	});
	
	attach_div.appendChild(file_input);
	attach_div.appendChild(remove_button);

	$('attachFilesControls').appendChild(attach_div);
	
	if (cur_id >= file_form_controls.limit)
		$('attachFilesAdd').disabled = true;
	
	file_form_controls.next_id += 1;
	file_form_controls.count += 1;
}

function file_form_attach_remove(id)
{
	$('attachFilesControls').removeChild($('attachFiles_' + id));
	$('attachFilesAdd').disabled = false;
    file_form_controls.count -= 1;
}

// Notification form stuff (mainly for message posting)
var notify_form_companies = {};

function notify_form_select(company_id, id)
{
	var do_all = true;
	
	// Check to see if everything has been selected
	notify_form_companies['company_' + company_id].users.each(function(user_id){
		if (!$('notifyUser' + user_id).checked)
			do_all = false;
	});
	
	$('notifyCompany' + company_id).checked = do_all;
}

function notify_form_select_company(id)
{
	var val = $('notifyCompany' + id).checked;
	
	notify_form_companies['company_' + id].users.each(function(user_id){
		$('notifyUser' + user_id).checked = val;
	});
}

function notify_form_set_company(id)
{
	var count = 0;
	var users = notify_form_companies['company_' + id].users;
	
	users.each(function(user_id){
		if ($('notifyUser' + user_id).checked)
		  count += 1;
	});
	
	if (count == users.length)
	  $('notifyCompany' + id).checked = true;
}

Event.addBehavior({
	'.StatusMessage' : StatusBar(),
	'.PopupMenuWidgetAttachTo' : PopupMenu(),
	'a#messageFormAdditionalTextToggle:click': function(e) {
	  var element = e.element();
	  e.stop();
	  
	  var target_element = $('messageFormAdditionalText');
	  target_element.style.display = target_element.style.display == 'none' ? 'block' : 'none' ;
      $('messageFormAdditionalTextToggle').innerHTML = target_element.style.display == 'none' ? 'Expand' : 'Collapse';
    }
});
