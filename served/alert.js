function showAlert(message, type) {
    const toast = document.createElement('div');
    toast.classList.add('toast', 'toast-top', 'toast-end');
    const alert = document.createElement('div');
    alert.classList.add('alert', `alert-${type}`);
    const span = document.createElement('span');
    span.innerText = message;
    alert.appendChild(span);
    toast.appendChild(alert);
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 2000);
}