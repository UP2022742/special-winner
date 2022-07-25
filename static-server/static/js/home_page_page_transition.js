function delay(n) {
    n = n || 2000;
    return new Promise((done) => {
        setTimeout(() => {
            done();
        }, n);
    });
}

// CREATE PAGE TRANSITIONS
function pageTransition() {
    var tl = gsap.timeline();
    tl.to(".loading-screen", {
        duration: 0.5,
        width: "100%",
        left: "0%",
        ease: "Expo.easeInOut",
    });
    tl.to(".loading-screen", {
        duration: 0.5,
        width: "100%",
        left: "100%",
        ease: "Expo.easeInOut",
        delay: 0.3,
    });
    tl.set(".loading-screen", { left: "-100%" });
}

function contentAnimation() {
    var tl = gsap.timeline();
    tl.from(".animate-this", { duration: 1, y: 30, opacity: 0, stagger: 0.2, delay: 0.2 });
}

// CREATE GRIDS ON THE PROJECTS PAGE
function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function generateBlock(column, title, description, language) {
    // Create grid box with random size.
    var newDiv = document.createElement("div");
    newDiv.classList.add("grid");
    newDiv.setAttribute('onclick',"location.href='https://github.com/mcrrobinson/" + title + "'");
    newDiv.style.height=getRandomBetween(220, 280) + 'px';

    // Contents
    var titleDiv = document.createElement("div");
    titleDiv.innerHTML += title
    titleDiv.className = "gridTitle";
    newDiv.appendChild(titleDiv)

    var descDiv = document.createElement("div");
    descDiv.innerHTML += description
    descDiv.className = "gridDesc";
    newDiv.appendChild(descDiv)

    var langDiv = document.createElement("div");
    langDiv.innerHTML += language
    langDiv.className = "gridLang";
    newDiv.appendChild(langDiv)

    // Write all contents to the grid.
    document.getElementById(column).appendChild(newDiv);
}

// This function is intended for a scraper in the future.
function createGrids(){
    var no_keys = 8;
    var title = ["RGB-audio-peak-visualiser","whatmovie-php","xor_openvpn_bash","mouseshiver","CSGO_SIMPLE_EXTERNAL","photoorganiser","ticket-collector","whatmovie-js"]
    var description = ["A C++/C# application that loopbacks the playback output to create a visualiser with RGB strips.","Original movie reccomendation generator written in PHP using themoviedb API.","Creates a OXR OpenVPN server on Linux.","Moves the mouse according to the microphone input level.","External Code for Counter-Strike: Global Offensive.","Organises a mass of photos into corresponding files.","Bot to get tickets automatically.","Old website ported and removed redundent dependencies. "]
    var language = ["Python","PHP","Bash","C++/Python","C++","Python","JS","JS"]

    // Rows
    row_iter = 0
    for(x = 0; x < (no_keys - no_keys % 4)/4; x++){
        // Columns
        for(col=1; col < 5; col++){
            generateBlock("column"+col.toString(), title[row_iter], description[row_iter] , language[row_iter]);
            row_iter +=1
        }
    }
}

// SLIDE THE TITLES
function slideTitle() {
    $('.page-title').velocity('transition.slideLeftBigOut')
    $('.page-subtitle').velocity('transition.slideRightBigOut')
}

$(function () {
    barba.init({
        sync: true,
        transitions: [{
                async leave(data) {
                    const done = this.async();
                    pageTransition();
                    await delay(300);
                    done();
                },
                async enter({ next }) {
                    contentAnimation();
                    await delay(300);
                    if (next.namespace === 'project-section') {
                        createGrids();
                    }
                },
                async once(data) {
                    contentAnimation();
                },
            },
        ],
    });
});