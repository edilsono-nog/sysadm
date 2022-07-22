function sair(){
    localStorage.removeItem('token')
    window.location.href = 'login'
    eraseCookie('JSESSIONID')
}