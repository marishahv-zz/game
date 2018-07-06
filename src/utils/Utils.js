import floor from 'lodash/floor';

export class Utils{

    constructor(){
        this.loadImage = function(imgSrc){
            return new Promise((resolve, reject) => {
                let imgObj = new Image();
                imgObj.src = imgSrc;
                imgObj.onload = () => resolve(imgObj);
                imgObj.onerror = () => reject(new Error("The image is not loaded.")); /// TODO !!!!!!!!!
            });
        };
        this.getImages = function(imageSources){
            let imgArr = [];
            return Promise
            .all(imageSources.map(i => this.loadImage(i)));
        };
    };

    // ТОP_5 of records - player name and max count of the defeated monster for game, stored in localStorage
    updateLocalStorageData(nameStr, countInt){
        console.log(countInt);
        let recordObj = {name: nameStr, count: countInt};
        let recordArr = [recordObj];
        let storageData = {userList: recordArr};

        if("results" in localStorage){
            let resultsObj = JSON.parse(localStorage.getItem("results"));

            if(resultsObj.userList.length == 5){
                let countArr = [];

                for(let i = 0; i < resultsObj.userList.length; i++){
                    countArr.push(resultsObj.userList[i].count);
                }

                let max = Math.max(...(countArr));
                let min = Math.min(...(countArr));
                if(countInt > min){
                    let index = countArr.indexOf(min);
                    if(index !== -1){
                        resultsObj.userList[index] = recordObj;
                    }
                }
            }
            else if(resultsObj.userList.length < 5) {
                resultsObj.userList.push(recordObj);
            }
            localStorage.setItem("results", JSON.stringify(resultsObj));

        } else {
            localStorage.setItem("results", JSON.stringify(storageData));
        }
    };

    getLocalStorageData(){
        if("results" in localStorage){
            let resultsObj = JSON.parse(localStorage.getItem("results"));
            return resultsObj.userList;
        }
        else return "There are no records in localStorage."
    };
    async pause (time){
      return new Promise((resolve)=>{
        setTimeout(resolve, time);
      });
    }
}
