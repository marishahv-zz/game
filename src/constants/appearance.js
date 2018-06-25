
export const HEROES = {
    monster: {
        name: [
            ["Terrible", "Spiteful", "Snotty"],
            ["Ogre", "Gnome", "Goblin"],
            ["Tom", "Max", "Ted"]
        ],
        head: [
            "images/monster/enemy_14.png",
            "images/monster/enemy_15.png",
            "images/monster/enemy_16.png"
        ],
        body: [
            "images/monster/enemy_22.png",
            "images/monster/enemy_19.png", 
            "images/monster/enemy_12.png"
        ],
        feet: [
            "images/monster/enemy_3.png",
            "images/monster/enemy_4.png",
            "images/monster/enemy_5.png"
        ], 
        width: {
            head: 210,
            body: 215,
            feet: 220
        },
        height: {
            head: 190,
            body: 215,
            feet: 220
        },
        bodyPartPositionX: {
            head: 39,
            body: 5,
            feet: 2
        },
        bodyPartPositionY: {
            head: 0,
            body: 72,
            feet: 158
        }        
    }
};

export const COORDINATES = {
    monster: {
        x: (window.innerWidth - (window.innerWidth / 5)),
        y: window.innerHeight - 420,
        xShift: -3,
        xStop: 7
    }
}
