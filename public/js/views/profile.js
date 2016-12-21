$(document).ready(function () {

    var pc = new ProfileController();

    var logoutDialog = document.querySelector('dialog.logout-dialog');
    var editDialog = document.querySelector('dialog.edit-profile-dialog');

    var logoutBtn = document.querySelector('#logout-btn');
    var editBtn = document.querySelector('#edit-btn');
    var uploadBtn = document.querySelector('#upload-btn');

    if (!logoutDialog.showModal) {
        dialogPolyfill.registerDialog(logoutDialog);
    }
    if (!editDialog.showModal) {
        dialogPolyfill.registerDialog(editDialog);
    }
    logoutBtn.addEventListener('click', function () {
        logoutDialog.showModal();
    });
    editBtn.addEventListener('click', function () {
        editDialog.showModal();
    });
    uploadBtn.addEventListener('click', function () {

    });

    logoutDialog.querySelector('.close').addEventListener('click', function () {
        logoutDialog.close();
    });
    logoutDialog.querySelector('.accept').addEventListener('click', function () {
        pc.attemptLogout();
    });
    editDialog.querySelector('.closeEdit').addEventListener('click', function () {
        document.getElementById('profile-edit-id').close();
        //dialog.close();
    });
    editDialog.querySelector('.edit').addEventListener('click', function () {
        pc.editProfileInfo();
        document.getElementById('profile-edit-id').close();
        //dialog.closeEdit();
    })

});