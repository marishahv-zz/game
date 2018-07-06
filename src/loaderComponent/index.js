
const LOADING_CONTAINER = document.querySelector('#loaderContainer');
const TXT_LOADIN = document.querySelector('#loaderTxtLoading');
const TXT_DONE = document.querySelector('#loaderTxtDone');
const CLOSE_CONTAINER_PAUSE = 2000;
const CLOSE_TXT_PAUSE = 1000;

const pause = async (time) =>{
  return new Promise((resolve)=>{
    setTimeout(resolve, time);
  });
};

const classSwitcherContainer = () =>{
  if(LOADING_CONTAINER.classList.contains("active-container")){
    LOADING_CONTAINER.classList.remove("active-container");
    LOADING_CONTAINER.classList.add("unactive-container");
  }else{
    LOADING_CONTAINER.classList.remove("unactive-container");
    LOADING_CONTAINER.classList.add("active-container");
  }
};

const classSwitcherTxt = (elem) =>{
  if(elem.classList.contains("active-txt")){
    elem.classList.remove("active-txt");
    elem.classList.add("unactive-txt");
  }else{
    elem.classList.remove("unactive-txt");
    elem.classList.add("active-txt");
  }
};

const showLoader = () =>{
  classSwitcherContainer();
}
const hideLoader =  async () =>{
  await pause(CLOSE_TXT_PAUSE);
  classSwitcherTxt(TXT_LOADIN);
  classSwitcherTxt(TXT_DONE);
  await pause(CLOSE_CONTAINER_PAUSE);
  classSwitcherContainer();
  classSwitcherTxt(TXT_LOADIN);
  classSwitcherTxt(TXT_DONE);
}

export {showLoader , hideLoader};
