$(document).ready(function() {
    $('#registerForm').submit(function(event) {
        event.preventDefault();
        const username = $('#username').val();
        const email = $('#email').val();
        const password = $('#password').val();

        if (!username || !email || !password) {
            return;
        }

        // Fetch request
        fetch('http://localhost:8000/api/v1/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        console.error('Error:', err);
                        throw new Error(err.error || 'Registration failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                showBootstrapAlert('Registered successfully! Redirecting...', 'success');
                window.location.href = 'login.html';
            })
            .catch(error => {
                showBootstrapAlert('Invalid Registration', 'danger');
            });
    });




    $('#loginForm').submit(function(event) {
        event.preventDefault();

        const email = $('#loginEmail').val();
        const password = $('#loginPassword').val();

        axios.post('http://localhost:8000/api/v1/login', {
            email: email,
            password: password
        })
            .then(response => {
                console.log("The response is ", response);

                if (response.status !== 200) {
                    throw new Error('Login failed');
                }

                const data = response.data;
                const expireDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                document.cookie = `accessToken=${data.accessToken}; path=/; expires=${expireDate.toUTCString()};`;

                // Show success alert using Bootstrap
                showBootstrapAlert('Login successful! Redirecting...', 'success');

                // Redirect to users page
                window.location.href = 'users.html';
            })
            .catch(error => {
                console.error("Login error: ", error);

                // Show error alert using Bootstrap
                showBootstrapAlert('Invalid Credentials', 'danger');
            });

    });

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);

        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    }


    if (window.location.pathname.includes('users.html')) {
        fetchUsers();
    }

    function showBootstrapAlert(message, type = 'success') {
        const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    `;

        $('#alertContainer').html(alertHtml);

        $('.alert').on('closed.bs.alert', function () {
            console.log('Alert has been closed.');
        });
    }


    $('#resetpassword').click(function (){
        window.location.href='restpassword.html'
    })

    $('#logoutButton').click(function() {
        document.cookie = `accessToken=; path=/; expires=${ new Date(Date.now())};`;
        window.location.href = 'login.html';
    });

    $('#resetForm').submit(function(event) {
        event.preventDefault();

        const oldPassword = $('#oldPassword').val();
        const newPassword = $('#newPassword').val();

        const accessToken = getCookie('accessToken');
        if (accessToken) {
            axios.put('http://localhost:8000/api/v1/resetpassword', {
                oldPassword: oldPassword,
                newPassword: newPassword,
                token: accessToken
            })
                .then(response => {
                    console.log("The response is ", response);

                    if (response.status !== 200) {
                        throw new Error('Login failed');
                    }


                    // Show success alert using Bootstrap
                    showBootstrapAlert('Password Reset successfully! Redirecting...', 'success');

                    // Redirect to users page
                    window.location.href = 'users.html';
                })
                .catch(error => {
                    console.error("Login error: ", error);
                    showBootstrapAlert('Incorrect Current Password', 'danger');
                });
        }
        else {
            showBootstrapAlert('Login first to reset password', 'danger');
        }
    })

    function fetchUsers() {
        const accessToken = getCookie('accessToken');
        if (accessToken) {
            axios.get('http://localhost:8000/api/v1/users', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    const data = response.data;
                    let userCount = 0;

                    // Clear the existing table rows if necessary
                    $('#userTable tbody').empty();

                    data.forEach(user => {
                        userCount++;
                        const newRow = `
                    <tr class="user-row" data-username="${user.username}" data-email="${user.email}">
                        <td>${userCount}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                    </tr>
                `;
                        $('#userTable tbody').append(newRow);
                    });

                    // Add click event listener to the rows
                    $('.user-row').click(function() {
                        const username = $(this).data('username');
                        const email = $(this).data('email');

                        // Set the modal content
                        $('#modalUsername').text(username);
                        $('#modalEmail').text(email);

                        // Show the modal
                        $('#userModal').modal('show');
                    });
                })
                .catch(error => {
                    console.error('Failed to fetch users:', error);
                    showBootstrapAlert('Failed to fetch users: ' + error.message, 'danger');
                });
        } else {
            showBootstrapAlert('Login first to see the content', 'danger');
            console.log('Access Token not found');
        }
    }
});
