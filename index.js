function load(key, fallback) {
  try {
    var data = localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return fallback;
  } catch (e) {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

function $(selector) {
  return document.querySelector(selector);
}

function safe(text) {
  var div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}


var dests = [
  {
    id: 1, city: 'Maldives', country: 'Maldives', cat: 'Island',
    transport: 650, hotel: 180, daily: 90,
    img: 'maldives.jpg',
    photos: ['maldives1.jpg', 'maldives2.jpg', 'maldives3.jpg']
  },
  {
    id: 2, city: 'Phuket', country: 'Thailand', cat: 'Beach',
    transport: 600, hotel: 50, daily: 30,
    img: 'phuket.jpg',
    photos: ['phuket1.jpg', 'phuket2.jpg', 'phuket3.jpg']
  },
  {
    id: 3, city: 'Málaga', country: 'Spain', cat: 'City',
    transport: 120, hotel: 70, daily: 50,
    img: 'malaga.jpg',
    photos: ['malaga1.jpg', 'malaga2.jpg', 'malaga3.jpg']
  },
  {
    id: 4, city: 'Canary Islands', country: 'Spain', cat: 'Island',
    transport: 150, hotel: 80, daily: 55,
    img: 'canary.jpg',
    photos: ['canary1.jpg', 'canary2.jpg', 'canary3.jpg']
  },
  {
    id: 5, city: 'Zambia', country: 'Zambia', cat: 'Nature',
    transport: 700, hotel: 90, daily: 60,
    img: 'zambia.jpg',
    photos: ['zambia1.jpg', 'zambia2.jpg', 'zambia3.jpg']
  }
];

var social = load('social', {});

// blog posts
var posts = [
  {
    title: '10 things you must see in Phuket',
    img: 'phuket.jpg',
    text: 'Phuket is the biggest island in Thailand and there is a lot to do.',
    list: ['Patong Beach', 'Big Buddha', 'Old Phuket Town', 'Phi Phi Islands trip', 'Kata Beach',
           'Wat Chalong temple', 'Promthep Cape sunset', 'Karon viewpoint', 'Night market', 'Thai cooking class']
  },
  {
    title: '10 things you must see in the Maldives',
    img: 'maldives.jpg',
    text: 'Crystal clear water and white sand, just bring sunscreen.',
    list: ['Snorkeling at a house reef', 'Sandbank picnic', 'Male city', 'Sunset dolphin cruise', 'Whale shark watching',
           'Overwater villa', 'Night fishing', 'Hulhumale beach', 'Local island visit', 'Sunrise at the beach']
  },
];


function showPage(name) {
  var pages = document.querySelectorAll('.page');
  for (var i = 0; i < pages.length; i++) {
    pages[i].classList.remove('show');
  }
  $('#' + name).classList.add('show');

  var buttons = document.querySelectorAll('#nav button');
  for (var j = 0; j < buttons.length; j++) {
    if (buttons[j].dataset.page === name) {
      buttons[j].classList.add('active');
    } else {
      buttons[j].classList.remove('active');
    }
  }

  if (name === 'gallery') {
    showGalleryList();
  }
}

$('#nav').addEventListener('click', function (e) {
  if (e.target.dataset.page) {
    showPage(e.target.dataset.page);
  }
});


var user = load('user', null);

function showUser() {
  if (user) {
    $('#who').textContent = user;
    $('#loginBtn').textContent = 'Log out';
  } else {
    $('#who').textContent = 'Guest';
    $('#loginBtn').textContent = 'Log in';
  }
}

$('#loginBtn').addEventListener('click', function () {
  if (user) {
    user = null;
    save('user', null);
    showUser();
  } else {
    $('#loginDlg').showModal();
  }
});

$('#loginDlg').addEventListener('close', function () {
  var name = $('#lUser').value.trim();
  if ($('#loginDlg').returnValue === 'ok' && name) {
    user = name;
    save('user', user);
    showUser();
  }
  $('#lPass').value = '';
});

showUser();


function getDays() {
  var d = Number($('#fDays').value);
  if (d < 1) {
    d = 1;
  }
  return d;
}

function totalCost(place) {
  return place.transport + getDays() * (place.hotel + place.daily);
}


function pictureHtml(src, name, extraClass) {
  var cls = 'pic ' + (extraClass || '');
  if (src) {
    return '<div class="' + cls + '"><img src="' + safe(src) + '" alt="' + safe(name) + '"></div>';
  }
  return '<div class="' + cls + '">Add image: ' + safe(name) + '</div>';
}


function showHomeCities() {
  var html = '';
  for (var i = 0; i < dests.length; i++) {
    var d = dests[i];
    html += '<div class="card">' + pictureHtml(d.img, d.city) +
      '<div class="info"><h3>' + safe(d.city) + '</h3>' +
      '<p class="small-text">' + safe(d.country) + '</p>' +
      '<span class="tag">' + safe(d.cat) + '</span></div></div>';
  }
  $('#homeCities').innerHTML = html;
}


function fillCategories() {
  var selected = $('#fCat').value;
  var cats = [];
  for (var i = 0; i < dests.length; i++) {
    if (cats.indexOf(dests[i].cat) === -1) {
      cats.push(dests[i].cat);
    }
  }
  var html = '<option value="">All</option>';
  for (var j = 0; j < cats.length; j++) {
    var sel = cats[j] === selected ? ' selected' : '';
    html += '<option' + sel + '>' + safe(cats[j]) + '</option>';
  }
  $('#fCat').innerHTML = html;
}


function showDestinations() {
  var cat = $('#fCat').value;
  var maxBudget = $('#fBudget').value;
  var html = '';
  var count = 0;

  for (var i = 0; i < dests.length; i++) {
    var d = dests[i];
    if (cat && d.cat !== cat) continue;
    if (maxBudget && totalCost(d) > Number(maxBudget)) continue;

    count++;
    html += '<div class="card">' + pictureHtml(d.img, d.city) +
      '<div class="info"><h3>' + safe(d.city) + ', ' + safe(d.country) + '</h3>' +
      '<span class="tag">' + safe(d.cat) + '</span>' +
      '<p class="small-text">Transport €' + d.transport + ' | Hotel €' + d.hotel +
      '/night | Daily €' + d.daily + '</p>' +
      '<span class="price">€' + totalCost(d) + ' for ' + getDays() + ' days</span>' +
      '</div></div>';
  }

  if (count === 0) {
    html = '<p>No destinations match your filters.</p>';
  }
  $('#destList').innerHTML = html;
}


$('#fCat').addEventListener('input', showDestinations);
$('#fBudget').addEventListener('input', showDestinations);
$('#fDays').addEventListener('input', showDestinations);

function updateAll() {
  fillCategories();
  showHomeCities();
  showDestinations();
}


var currentPlace = null;

function getSocial(id) {
  if (!social[id]) {
    social[id] = { likes: 0, dislikes: 0, comments: [] };
  }
  return social[id];
}

function showGalleryList() {
  $('#galDetail').style.display = 'none';
  $('#galList').style.display = '';
  var html = '';
  for (var i = 0; i < dests.length; i++) {
    var d = dests[i];
    html += '<div class="card" style="cursor:pointer" data-open="' + d.id + '">' +
      pictureHtml(d.img, d.city) +
      '<div class="info"><h3>' + safe(d.city) + '</h3>' +
      '<p class="small-text">Click to open</p></div></div>';
  }
  $('#galList').innerHTML = html;
}

$('#galList').addEventListener('click', function (e) {
  var card = e.target.closest('[data-open]');
  if (card) {
    openPlace(Number(card.dataset.open));
  }
});

function openPlace(id) {
  for (var i = 0; i < dests.length; i++) {
    if (dests[i].id === id) {
      currentPlace = dests[i];
    }
  }
  if (!currentPlace) return;

  $('#galList').style.display = 'none';
  $('#galDetail').style.display = 'block';
  $('#gTitle').textContent = currentPlace.city + ', ' + currentPlace.country;

  var html = '';
  for (var j = 0; j < currentPlace.photos.length; j++) {
    html += pictureHtml(currentPlace.photos[j], currentPlace.city + ' photo ' + (j + 1));
  }
  $('#gImgs').innerHTML = html;

  showLikesAndComments();
}

function showLikesAndComments() {
  var s = getSocial(currentPlace.id);
  $('#likes').textContent = s.likes;
  $('#dislikes').textContent = s.dislikes;

  if (s.comments.length === 0) {
    $('#comments').innerHTML = '<p class="small-text">No comments yet, be the first!</p>';
    return;
  }
  var html = '';
  for (var i = 0; i < s.comments.length; i++) {
    var c = s.comments[i];
    html += '<div class="comment"><b>' + safe(c.user) + '</b> <small>' + safe(c.date) +
      '</small><br>' + safe(c.text) + '</div>';
  }
  $('#comments').innerHTML = html;
}

$('#likeBtn').addEventListener('click', function () {
  getSocial(currentPlace.id).likes++;
  save('social', social);
  showLikesAndComments();
});

$('#dislikeBtn').addEventListener('click', function () {
  getSocial(currentPlace.id).dislikes++;
  save('social', social);
  showLikesAndComments();
});

$('#cmBtn').addEventListener('click', function () {
  var text = $('#cmText').value.trim();
  if (text === '') return;
  getSocial(currentPlace.id).comments.push({
    user: user || 'Guest',
    text: text,
    date: new Date().toLocaleString('en-GB')
  });
  save('social', social);
  $('#cmText').value = '';
  showLikesAndComments();
});

$('#galBack').addEventListener('click', showGalleryList);


function showBlog() {
  var html = '';
  for (var i = 0; i < posts.length; i++) {
    var p = posts[i];
    html += '<div class="box"><h3>' + safe(p.title) + '</h3>' +
      pictureHtml(p.img, p.title, 'blog-pic') +
      '<p>' + safe(p.text) + '</p>';
    if (p.list.length > 0) {
      html += '<ol>';
      for (var j = 0; j < p.list.length; j++) {
        html += '<li>' + safe(p.list[j]) + '</li>';
      }
      html += '</ol>';
    }
    html += '</div>';
  }
  $('#blogList').innerHTML = html;
}


function showSurveyAnswers() {
  var answers = load('survey', []);
  if (answers.length === 0) {
    $('#sResults').textContent = 'No answers yet.';
    return;
  }
  var html = '';
  for (var i = 0; i < answers.length; i++) {
    var a = answers[i];
    html += '<div class="comment"><b>' + safe(a.name) + '</b> (' + safe(a.age) + ') - rating ' +
      safe(a.rate) + '/5<br>Used: ' + safe(a.used.join(', ') || 'nothing') +
      '<br>' + safe(a.text) + '</div>';
  }
  $('#sResults').innerHTML = html;
}

$('#surveyForm').addEventListener('submit', function (e) {
  e.preventDefault();
  var answers = load('survey', []);

  var used = [];
  var boxes = document.querySelectorAll('input[name=used]:checked');
  for (var i = 0; i < boxes.length; i++) {
    used.push(boxes[i].value);
  }

  answers.push({
    name: $('#sName').value,
    email: $('#sEmail').value,
    age: $('#sAge').value,
    rate: document.querySelector('input[name=rate]:checked').value,
    used: used,
    text: $('#sText').value
  });
  save('survey', answers);
  e.target.reset();
  $('#sMsg').textContent = 'Thanks for your answers!';
  showSurveyAnswers();
});


updateAll();
showBlog();
showSurveyAnswers();
