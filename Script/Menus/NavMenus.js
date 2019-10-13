/*------------------------------------------------------------------------------
This javaScript file will control the opening and closing of "menus",
    the overlays in the nav bar
------------------------------------------------------------------------------*/


function openMenu(element){
    /**
     * General function to open any "menu" in the page.
     * Given the element id it will set its styling to display the menu
     */
    document.getElementById(element).style.width="100%";
    document.getElementById(element).style.overflowY="scroll";
    document.getElementById("copy").style.visibility = "hidden";
    document.body.style.overflowY = 'hidden';
    console.log(element + " is now visible");
}


function closeMenu(element){
    document.getElementById(element).style.width="0%";
    document.getElementById(element).style.overflowY="hidden";
    document.getElementById("copy").style.visibility = "visible";
    document.body.style.overflowY = 'visible';
    console.log(element + "is now hidden");
}


/*------------------------------------------------------------------------------
                    Functions to display the login and register forms
------------------------------------------------------------------------------*/
function showLogin(){
    document.getElementById('login-form').style.display='block';
}
function hideLogin(){
    document.getElementById('login-form').style.display='none';
}

function showRegister(){
    hideLogin();
    document.getElementById('singup-form').style.display='block';
}
function hideRegister(){
    document.getElementById('singup-form').style.display='none';
}


/*------------------------------------------------------------------------------
                                Game Options
------------------------------------------------------------------------------*/
function closeGame(element){
    //This function is not yet used in the html file
    if(confirm("Are you sure you want to quit game? All progress will be lost")){
        closeMenu(element);
    }else
        alert("Quitted game");

}

/*------------------------------------------------------------------------------
------------------------------------------------------------------------------*/