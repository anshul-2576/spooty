console.log("here is our javaSript")
let currentsong = new Audio();
let currentfolder;
let songUl;

function secondsToMinutesSecond(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";

    }
    const minutes = Math.floor(seconds / 60);
    const remainingseconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingseconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currentfolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li> <div class="libcard">
                        <img src="svg/music.svg" alt="">
                        <div class="info">
                            <div>${song.replace("%20", " ")}</div>
                            <div>Anshul</div>
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                            <img src="svg/play.svg" alt="">
                        </div>
                    </div> </li>` ;


    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs;
}
const playmusic = (track, pause = false) => {
    currentsong.src = (`/${currentfolder}/` + track);
    if (!pause) {
        currentsong.play();
        play.src = "svg/pausecircle.svg"
    }
    document.querySelector(".songName").innerHTML = decodeURI(track)
    document.querySelector(".songduration").innerHTML = "00:00 / 00:00"

}
//harry code


// my code
async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    console.log(div)
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-1)[0]
            console.log(e.href.split("/").slice(-1)[1])
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json()
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="#3be477"
                                    d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" />
                            </svg>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h3>${response.title}</h3>
                        <p>${response.description}</p>
                    </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])
        })
    })

}


async function main() {
    await getSongs("songs/music")

    playmusic(songs[0], true)

    //display all the albums
    displayAlbums()

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "svg/pausecircle.svg"

        }
        else {
            currentsong.pause()
            play.src = "svg/playcircle.svg"

        }
 })
    currentsong.addEventListener("timeupdate", () => {
     
        document.querySelector(".songduration").innerHTML = `${secondsToMinutesSecond(currentsong.currentTime)}/${secondsToMinutesSecond(currentsong.duration)}`
        document.querySelector(".circle").style.left = ((currentsong.currentTime / currentsong.duration) * 100 - 1) + "%"



    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let persent = (e.offsetX / document.querySelector(".seekbar").offsetWidth) * 100
        document.querySelector(".circle").style.left = persent + "%";
        currentsong.currentTime = ((currentsong.duration) * persent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })

    previous.addEventListener("click", () => {
        console.log("previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {

            playmusic(songs[index - 1])
        }
        else {
            playmusic(songs[length - index])
        }
    })


    next.addEventListener("click", () => {
        console.log("next clicked");
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
        else {
            playmusic(songs[0])
        }
    })
  
    

}
main()