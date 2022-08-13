import playList from './playList.js';

const time = document.querySelector('.time');
const dayOfWeek = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const userName = document.querySelector('.name');
const body = document.querySelector('body');
const next = document.querySelector('.slide-next');
const prev = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind')
const humidity = document.querySelector('.humidity')
const cityInput = document.querySelector('.city');
const weatherError = document.querySelector('.weather-error');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
// const play = document.querySelector('.play');
// const pause = document.querySelector('.pause');
// const playPrevSongButton = document.querySelector('.play-prev');
// const playNextSongButton = document.querySelector('.play-next');

/*----------вывести время-----------*/
function showTime() {
	const date = new Date();
	const currentTime = date.toLocaleTimeString();
	time.textContent = currentTime;
	setTimeout(showTime, 1000);
	showDate();
	showGreeting();
}
showTime()

/*----------вывести дату-----------*/
function showDate() {
	const date = new Date();
	const options = { weekday: 'long', month: 'long', day: 'numeric' };
	const currentDate = date.toLocaleDateString('en-EN', options);
	dayOfWeek.textContent = currentDate;
}
showDate()

/*----------получить время суток-----------*/
function getTimeOfDay() {
	const date = new Date();
	const hours = date.getHours();
	if (hours >= 0 && hours < 6) {
		return 'Good night';
	}
	if (hours >= 6 && hours < 12) {
		return 'Good morning';
	}
	if (hours >= 12 && hours < 18) {
		return 'Good afternoon';
	}
	else {
		return 'Good evening';
	}
}

/*----------вывести приветствие-----------*/
function showGreeting() {
	const greetingText = getTimeOfDay();
	greeting.textContent = greetingText;
}
showGreeting()

/*----------сохранить в локальную переменную-----------*/
function setLocalStorage() {
	localStorage.setItem('name', userName.value);
	localStorage.setItem('cityName', cityInput.value);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorageName() {
	if (localStorage.getItem('name')) {
		userName.value = localStorage.getItem('name');
	}
}
window.addEventListener('load', getLocalStorageName);

function getLocalStorageCity() {
	if (localStorage.getItem('cityName') === null) {
		cityInput.value = 'Минск';		
	}
	else{
    cityInput.value = localStorage.getItem('cityName');
  }
}
window.addEventListener('load', getLocalStorageCity);

/*----------получить рандомное число-----------*/
function getRandomNum() {
	const numRandom = Math.ceil(Math.random() * 20);
	return numRandom;
}

/*----------сменить фон -----------*/
function setBg() {
	const timeOfDay = getTimeOfDay();
	let bgNum = (getRandomNum() + '').padStart(2, "0");
	const img = new Image();
	img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay.slice(5)}/${bgNum}.jpg`
	img.onload = () => {
		body.style.backgroundImage = `url(${img.src})`
	};
}
setBg()

const getSlideNext = () => {
	let bgNum = (getRandomNum() + '').padStart(2, "0");
	bgNum = bgNum !== 20 ? bgNum + 1 : 1;
	setBg();
}

const getSlidePrev = () => {
	let bgNum = (getRandomNum() + '').padStart(2, "0");
	bgNum = bgNum !== 0 ? bgNum - 1 : 20;
	setBg();
}

next.addEventListener('click', getSlideNext);
prev.addEventListener('click', getSlidePrev);

/*----------Получаем погоду -----------*/
cityInput.value = "Минск";
cityInput.addEventListener('change', () => {
	getWeather()
})

async function getWeather() {
	const city = cityInput.value;
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=ru&appid=e31337deadbcdc81c6a47b7792679ef8&units=metric`;

	const res = await fetch(url);
	const data = await res.json();

	const API_ERR = parseInt(data.cod)

	try {
		if (API_ERR == 404) {
			throw `Error: ${API_ERR} City Not Found`
		} else if (API_ERR == 400) {
			throw `Error: ${API_ERR} Bad Request`
		} else {
			throw ''
		}
	} catch (err) {
		weatherError.textContent = err
		humidity.textContent = null
		wind.textContent = null
		weatherDescription.textContent = null
		temperature.textContent = null
		weatherIcon.removeAttribute('class')
	}

	weatherIcon.className = 'weather-icon owf';
	weatherIcon.classList.add(`owf-${data.weather[0].id}`);
	temperature.textContent = `${data.main.temp}°C`;
	weatherDescription.textContent = data.weather[0].description;
	wind.textContent = `Скорость ветра: ${data.wind.speed} м/с`
	humidity.textContent = `Отн. влажность воздуха: ${data.main.humidity}%`
}
getWeather()

/*----------Смена цитат -----------*/
async function getQuotes() {
	const quotes = './data/data.json';
	const res = await fetch(quotes);
	const data = await res.json();

	function getRandomNumber() {
		const numRandom = Math.ceil(Math.random() * 3);
		return numRandom - 1;
	}

	quote.textContent = data[getRandomNumber()].text;
	author.textContent = data[getRandomNumber()].author;
}
getQuotes();

changeQuote.addEventListener('click', getQuotes);

/*----------Аудио -----------*/
const playSong = document.querySelector('.play');
const playPrevSongButton = document.querySelector('.play-prev');
const playNextSongButton = document.querySelector('.play-next');

console.log(playList, 'playList');

const audio = new Audio();
let timeSong = 0;
let indexSong = 0;
let isPlay = false;

function playAudio() {
	audio.src = playList[indexSong].src;
	console.log(`songSrc${indexSong}` , audio.src);
	audio.currentTime = timeSong;
	audio.play();	
}

function pauseAudio() {
	timeSong = audio.currentTime;
	audio.pause();	
}

function toggleBtn() {
	playSong.classList.toggle('pause');
}
playSong.addEventListener('click', toggleBtn);

function playAndPause() {
	if (!isPlay) {
		playAudio();			
	}
	else {
		pauseAudio();				
	}
}
playAndPause()

function playNextSong() {
	indexSong+=1;
	if (!isPlay) {
		playAudio();
	}
	else {
		pauseAudio();
	}
}
playNextSong();

function playPrevSong() {
	indexSong-=1;
	if (!isPlay) {
		playAudio();
	}
	else {
		pauseAudio();
	}
}
playPrevSong();


playSong.addEventListener('click', playAudio);
playNextSongButton.addEventListener('click', playNextSong);
playPrevSongButton.addEventListener('click', playPrevSong);

function showPlayList() {
  let i = 0;
  document.querySelectorAll('.play-item').forEach(item => {
    item.remove();
  });
  playList.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.id = 'item' + i;
    li.textContent = item.title;
    document.querySelector('.play-list').append(li);
    i++;
  });   
}
showPlayList();