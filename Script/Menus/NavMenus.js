/*------------------------------------------------------------------------------
This javaScript file will control the opening and closing of "menus",
    the overlays in the nav bar
------------------------------------------------------------------------------*/


function openMenu(element,zindex){
    /**
     * General function to open any "menu" in the page.
     * Given the element id it will set its styling to display the menu
     */
    document.getElementById(element).style.width="100%";
    document.getElementById(element).style.overflowY="scroll";
    document.getElementById("copy").style.visibility = "hidden";
    if(zindex != 'undefined') document.getElementById(element).style.zIndex = zindex;
    document.body.style.overflowY = 'hidden';
    console.log(element + " is now visible");
}


function closeMenu(element){
    document.getElementById(element).style.width="0%";
    document.getElementById(element).style.overflowY="hidden";
    document.getElementById("copy").style.visibility = "visible";
    document.body.style.overflowY = 'visible';
    console.log(element + " is now hidden");
    if(element == 'instruction-page'){
        if(document.getElementById("ai-page").style.width == "100%"){
            console.log("close body");
            console.log("disp |"+document.getElementById("inst-on-game").style.display+"|");
            
            if(document.getElementById("inst-on-game").style.display == 'block'){
                document.body.style.overflowY = 'hidden';
                console.log("Closing");
                
            }
        }
    }
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
function infoTakeStack(){
    document.getElementById("taking-from-stack").style.display = 'block';
    document.body.style.overflowY = 'hidden';
    
    listen();
    function listen(){
        if(document.getElementById("taking-from-stack").style.display != 'none')
            setTimeout(listen,1);
            
    }
}

function hideTakeStack(){
    document.getElementById("taking-from-stack").style.display = 'none';
    document.body.style.overflowY = 'visible';
}


function showPassTurn(){
    document.getElementById("empty-stack").style.display = 'block';
    document.body.style.overflowY = 'hidden';
    listen();
    function listen(){
        if(document.getElementById("empty-stack").style.display != 'none')
            setTimeout(listen,1);
    }
}

function passTurn(close){
    document.getElementById("empty-stack").style.display = 'none';
    document.body.style.overflowY = 'visible';
}