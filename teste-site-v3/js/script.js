const navBar = document.querySelector("nav"),
            menuBtns = document.querySelectorAll("#btn-exp"),
            overlay = document.querySelector(".overlay"),

            // --------------------------------------- //
            expandir = document.querySelector('#btn-exp'),
            menuLateral = document.querySelector('.menu-lateral');  
            
            // --------------------------------------- //
            menuBtns.forEach((menuBtn) => {
                menuBtn.addEventListener("click", () =>{
                    navBar.classList.toggle("open");
                });
            });
            
            overlay.addEventListener("click", () => {
                navBar.classList.remove("open", "expandir");
            })
            
            // --------------------------------------- //
            expandir.addEventListener('click', function(){
                menuLateral.classList.toggle('expandir')
            })

// -----------------SELECT----------------- //

let menuItem = document.querySelectorAll('.item-menu')

function select(){
    menuItem.forEach((item) => {
        item.classList.remove('ativo')
    })
    this.classList.add('ativo')
}

menuItem.forEach((item) => {
    item.addEventListener('click', select)
});