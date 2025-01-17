
function getCurrentYear() {
    var d = new Date();
    var currentYear = d.getFullYear()

    $("#displayDate").html(currentYear);
}

function showRegisterForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('forget-password-form').classList.add('hidden');
    document.getElementById('password-recovery-form').classList.add('hidden');
}

function showLoginForm() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('forget-password-form').classList.add('hidden');
    document.getElementById('password-recovery-form').classList.add('hidden');
}

function showForgetPasswordForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('forget-password-form').classList.remove('hidden');
    document.getElementById('password-recovery-form').classList.add('hidden');
}

function showPasswordRecoveryForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('forget-password-form').classList.add('hidden');
    document.getElementById('password-recovery-form').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
document.querySelector('.btn-register').addEventListener('click', showRegisterForm);
document.querySelectorAll('.btn-login').forEach(button => button.addEventListener('click', showLoginForm));
document.querySelector('.btn-forget-password').addEventListener('click', showForgetPasswordForm);
document.querySelector('.btn-password-recovery').addEventListener('click', showPasswordRecoveryForm);
});
  
function clearInput(inputId) {
    document.getElementById(inputId).value = '';
}
  
getCurrentYear();