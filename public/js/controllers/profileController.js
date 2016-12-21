function ProfileController() {
    // bind event listeners to button clicks //
    var that = this;

    this.attemptLogout = function () {
        $.ajax({
            url: "/logout",
            type: "POST",
            data: {logout: true},
            success: function (data) {
                window.location.href = '/';
            },
            error: function (jqXHR) {
                console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
            }
        });
    };

    this.showToast = function (message) {
        var snackbarContainer = document.querySelector('#toast');
        var data = {message: message};
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    };

    this.validateForm = function () {
        if ($('#tf-first').val() == '') {
            this.showToast('First name cannot be empty');
            return false;
        }
        if ($('#tf-last').val() == '') {
            this.showToast('Last name cannot be empty');
            return false;
        }
        if ($('#tf-email').val() == '') {
            this.showToast('Email cannot be empty');
            return false;
        }
        if ($('#tf-username').val() == '') {
            this.showToast('Username cannot be empty');
            return false;
        }
        if ($('#tf-phone').val() == '') {
            this.showToast('Phone cannot be empty');
            return false;
        }

        return true;
    };

    this.editProfileInfo = function () {
        var isValidated = this.validateForm();

        if (isValidated) {
            var first = $('#tf-first').val();
            var last = $('#tf-last').val();
            var email = $('#tf-email').val();
            var phone = $('#tf-phone').val();

            $.ajax({
                url: "/profile",
                type: "PUT",
                contentType: "application/x-www-form-urlencoded",
                data: {
                    first: first,
                    last: last,
                    email: email,
                    phone: phone
                },
                success: function (data) {
                    that.showToast('Successfully updated the profile');


                    $('#user-profile-firstlast').val(data.first + data.last);
                    $('#user-profile-email').val(data.email);
                    $('#user-profile-phone').val(data.phone);

                    document.getElementById('user-profile-firstlast').innerHTML = data.first + ", " + data.last;
                    document.getElementById('user-profile-email').innerHTML = data.email;
                    document.getElementById('user-profile-phone').innerHTML = data.phone;


                    $('#tf-first').val(data.first);
                    $('#tf-last').val(data.last);
                    $('#tf-email').val(data.email);
                    $('#tf-phone').val(data.phone);
                },
                error: function (jqXHR) {
                    console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
                    that.showToast('Error updating info');
                }
            });
        }
    };

}