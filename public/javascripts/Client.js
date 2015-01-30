function DeleteUser(userid)
{
	$.ajax({
    url: "/deleteuserdirectory/" + userid,
    type: 'DELETE',
    success: function(result) {
		document.location.reload();
    },
    error: function() {
     	alert('error');
  	}
  });
}
