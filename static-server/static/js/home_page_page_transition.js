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
    tl.set(".loading-screen", {
        left: "-100%"
    });
}

function contentAnimation() {
    var tl = gsap.timeline();
    tl.from(".animate-this", {
        duration: 1,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        delay: 0.2
    });
}

// CREATE GRIDS ON THE PROJECTS PAGE
function getRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function generateBlock(column, title, description, language) {
    // Create grid box with random size.
    var newDiv = document.createElement("div");
    newDiv.classList.add("grid");
    newDiv.setAttribute('onclick', "location.href='https://github.com/mcrrobinson/" + title + "'");
    newDiv.style.height = getRandomBetween(220, 280) + 'px';

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
function createGrids() {
    var no_keys = 8;
    var title = ["RGB-audio-peak-visualiser", "whatmovie-php", "xor_openvpn_bash", "mouseshiver", "CSGO_SIMPLE_EXTERNAL", "photoorganiser", "ticket-collector", "whatmovie-js"]
    var description = ["A C++/C# application that loopbacks the playback output to create a visualiser with RGB strips.", "Original movie reccomendation generator written in PHP using themoviedb API.", "Creates a OXR OpenVPN server on Linux.", "Moves the mouse according to the microphone input level.", "External Code for Counter-Strike: Global Offensive.", "Organises a mass of photos into corresponding files.", "Bot to get tickets automatically.", "Old website ported and removed redundent dependencies. "]
    var language = ["Python", "PHP", "Bash", "C++/Python", "C++", "Python", "JS", "JS"]

    console.log("HEre!")
    // Rows
    // row_iter = 0
    // for (x = 0; x < (no_keys - no_keys % 4) / 4; x++) {
    //     // Columns
    //     for (col = 1; col < 5; col++) {
    //         generateBlock("column" + col.toString(), title[row_iter], description[row_iter], language[row_iter]);
    //         row_iter += 1
    //     }
    // }
}

// SLIDE THE TITLES
function slideTitle() {
    $('.page-title').velocity('transition.slideLeftBigOut')
    $('.page-subtitle').velocity('transition.slideRightBigOut')
}

function divElement(element, content, className, appendElement) {
    var descDiv = document.createElement(element);
    descDiv.innerHTML += content;
    descDiv.className = className;
    appendElement.appendChild(descDiv);
}

function getRandomBetween(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function generateBlock(column, title, description, language) {
    // Create grid box with random size.
    var baseDiv = document.createElement("div");
    baseDiv.setAttribute('onclick', "location.href='https://github.com/UP2022742/" + title + "'");
    baseDiv.classList.add("grid");
    baseDiv.style.height = getRandomBetween(220, 280) + 'px';

    divElement("div", title, "gridTitle", baseDiv);
    divElement("div", description, "gridDesc", baseDiv);
    divElement("div", language, "gridLang", baseDiv);

    // Write all contents to the grid.
    column.appendChild(baseDiv);
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
            async enter({
                next
            }) {
                contentAnimation();
                await delay(300);
                if (next.namespace === 'project-section') {
                    // send post request
                    fetch('https://api.github.com/users/UP2022742/repos', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                        .then(res => res.json())
                        .then(res => {
                            var column_row = document.getElementById('column-row');

                            var column1 = document.createElement('div');
                            column1.classList = 'deferred-animate-this column';
                            var column2 = document.createElement('div');
                            column2.classList = 'deferred-animate-this column';
                            var column3 = document.createElement('div');
                            column3.classList = 'deferred-animate-this column';
                            var column4 = document.createElement('div');
                            column4.classList = 'deferred-animate-this column';
                            for (i = 0; i < res.length; i++) {
                                switch (i % 4) {

                                    case 0:
                                        generateBlock(
                                            column1,
                                            res[i].name.replaceAll('-', ' ').replaceAll('_', ' '),
                                            res[i].description,
                                            res[i].language
                                        );
                                        break;
                                    case 1:
                                        generateBlock(
                                            column2,
                                            res[i].name.replaceAll('-', ' ').replaceAll('_', ' '),
                                            res[i].description,
                                            res[i].language
                                        );
                                        break;
                                    case 2:
                                        generateBlock(
                                            column3,
                                            res[i].name.replaceAll('-', ' ').replaceAll('_', ' '),
                                            res[i].description,
                                            res[i].language
                                        );
                                        break;
                                    default:
                                        generateBlock(
                                            column4,
                                            res[i].name.replaceAll('-', ' ').replaceAll('_', ' '),
                                            res[i].description,
                                            res[i].language
                                        );
                                }

                            }

                            column_row.appendChild(column1);
                            column_row.appendChild(column2);
                            column_row.appendChild(column3);
                            column_row.appendChild(column4);

                            var tl = gsap.timeline();
                            tl.from(".deferred-animate-this", {
                                duration: 1,
                                y: 30,
                                opacity: 0,
                                stagger: 0.2,
                                delay: 0.2
                            });
                        })
                        .catch(err => console.error(err));
                }
            },
            async once(data) {
                contentAnimation();
            },
        }, ],
    });
    barba.Pjax
});