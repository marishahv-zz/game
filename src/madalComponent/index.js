const MODAL_CONTAINER = document.querySelector('#modalTxtContainer');
const TXT_CONTAINER = document.querySelector('#TxtContainer');
const BTN = document.querySelector('#closeBtn');

const txt = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

BTN.addEventListener('click',()=>{
  classSwitcherModal()
})

const classSwitcherModal = () =>{
  if(MODAL_CONTAINER.classList.contains("active-modal-txt")){
    MODAL_CONTAINER.classList.remove("active-modal-txt");
    MODAL_CONTAINER.classList.add("unactive-modal-txt");
  }else{
    MODAL_CONTAINER.classList.remove("unactive-modal-txt");
    MODAL_CONTAINER.classList.add("active-modal-txt");
  }
};

const fillOutTxtContainer= (text = txt) =>{
  TXT_CONTAINER.innerText = text;
};

export {classSwitcherModal, fillOutTxtContainer};
