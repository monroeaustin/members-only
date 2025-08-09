function showHomePage (req,res) {
    res.render('home');
}

function showSignUp(req,res){
    res.render('sign-up');
}

function showLogin(req,res){
    res.render('login')
}

function showMessages (req,res) {
    res.render('messages')
}
function showNewMessages (req,res) {
    res.render('newmessage')
}

function showAccess(req,res){
    res.render('admin');
}
function showProfle(req,res){
    res.render('profile');
}


module.exports =  {
    showHomePage,
    showSignUp,
    showLogin,
    showMessages,
    showAccess,
    showNewMessages,
    showProfle
}