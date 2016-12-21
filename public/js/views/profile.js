$(document).ready(function () {

    var pc = new ProfileController();

    var logoutDialog = document.querySelector('dialog.logout-dialog');
    var editDialog = document.querySelector('dialog.edit-profile-dialog');
    var deleteDialog = document.querySelector('dialog.delete-profile-dialog');

    var logoutBtn = document.querySelector('#logout-btn');
    var editBtn = document.querySelector('#edit-btn');
    var deleteBtn = document.querySelector('#delete-btn');

    if (!logoutDialog.showModal) {
        dialogPolyfill.registerDialog(logoutDialog);
    }
    if (!editDialog.showModal) {
        dialogPolyfill.registerDialog(editDialog);
    }
    if (!deleteDialog.showModal) {
        dialogPolyfill.registerDialog(deleteDialog);
    }

    logoutBtn.addEventListener('click', function () {
        logoutDialog.showModal();
    });
    editBtn.addEventListener('click', function () {
        editDialog.showModal();
    });
    deleteBtn.addEventListener('click', function () {
        deleteDialog.showModal();
    });

    logoutDialog.querySelector('.close').addEventListener('click', function () {
        logoutDialog.close();
    });
    logoutDialog.querySelector('.accept').addEventListener('click', function () {
        pc.attemptLogout();
        logoutDialog.close();
    });

    deleteDialog.querySelector('.close').addEventListener('click', function () {
        deleteDialog.close();
    });
    deleteDialog.querySelector('.accept').addEventListener('click', function () {
        pc.attemptDelete();
        deleteDialog.close();
    });

    editDialog.querySelector('.close').addEventListener('click', function () {
        document.getElementById('profile-edit-dialog').close();
        //dialog.close();
    });
    editDialog.querySelector('.edit').addEventListener('click', function () {
        pc.editProfileInfo();
        document.getElementById('profile-edit-dialog').close();
        //dialog.closeEdit();
    });

    $('#upload-image-form').ajaxForm({
        success: function (responseText, status, xhr, $form) {
            //pc.showToast(responseText);
            //if (status == 'success')
            window.location.href = '/home';
        },
        error: function (e) {
            if (e) {
                pc.showToast('Error: ' + e.responseText);
            }
        }
    });
});
