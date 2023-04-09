document.querySelector('[data-btn-search]').addEventListener('click', function() {
    const inputValue = document.querySelector('[data-input]').value;
    
    const xml = new XMLHttpRequest();
    xml.open('Get', `https://api.lyrics.ovh/suggest/${inputValue}`);
    xml.addEventListener('load', function() {
        const first = JSON.parse(xml.responseText);
        const request = first.data;
        append(request);
    });
    xml.send();
});

function append(response) {
    if (document.querySelector('.block')) document.querySelectorAll('.block').forEach(function(item) {item.remove()});

    response.forEach(function(item) {
        const wow = `<div class="block">
                        <div class="names">
                            <img data-img src="${item.artist.picture_big}">
                            <p data-artist>${item.artist.name}</p>
                            <p data-name-song>${item.title}</p>
                        </div>
                        <video style="display: none" class="video" controls name="media">
                            <source src="${item.preview}" type="audio/mpeg">
                        </video>
                        <button class="btn-find" data-add-btn>+</button>
                    </div>`;
        document.querySelector('.response-songs').insertAdjacentHTML('beforeend', wow);
    });
};

let id = 0;
document.querySelector('.response-songs').addEventListener('click', function(event) {
    const key = event.target;
    if (!key.classList.contains('btn-find')) return;
    id++;
    const block = key.closest('.block');
    const wo2 = `<div value="${id}" class="block-list">
                    <div class="names-list">
                        <img data-img-list src="${block.querySelector('img').getAttribute('src')}">
                        <p data-artist-list>${block.querySelector('[data-artist]').textContent}</p>
                        <p data-name-song-list>${block.querySelector('[data-name-song]').textContent}</p>
                        <button class="play-btn">PLAY</button>
                        <video style="display: none" src="${block.querySelector('source').getAttribute('src')}"></video>
                    </div>
                </div>`;
    document.querySelector('.list-songs').insertAdjacentHTML('beforeend', wo2);
});

let vid;
document.querySelector('.list-songs').addEventListener('click', function(event) {
    const key = event.target;
    if (!key.classList.contains('play-btn')) return;
    document.querySelector('.video-list').remove();

    const block = key.closest('.block-list');

    document.querySelectorAll('.block-list').forEach(function(item) {
        item.classList.remove('active');
    });
    block.classList.add('active');

    document.querySelector('.player-tools').setAttribute('value', `${block.getAttribute('value')}`);
    document.querySelector('[data-img-mp3]').setAttribute('src', `${block.querySelector('[data-img-list]').getAttribute('src')}`);
    document.querySelector('[data-mp3-artist]').textContent = block.querySelector('[data-artist-list]').textContent;
    document.querySelector('[data-mp3-song]').textContent = block.querySelector('[data-name-song-list]').textContent;

    const sng = `<video class="video-list" controls name="media">
                    <source data-src-mp3 src="${block.querySelector('video').getAttribute('src')}" type="audio/mpeg">
                </video>`;
    document.querySelector('.song').insertAdjacentHTML('beforeend', sng);
    vid = document.querySelector('.video-list');
});

let counter = 0;
document.querySelector('[data-pause]').onclick = function() {
    counter++; counter %2 === 0 ? vid.pause() : vid.play();
};

document.querySelector('[data-next]').onclick = function() {
    let idMp3 = Number(document.querySelector('.player-tools').getAttribute('value'));
    idMp3++;

    foo(idMp3);
};

document.querySelector('[data-prev]').onclick = function() {
    let idMp3 = Number(document.querySelector('.player-tools').getAttribute('value'));
    idMp3--;
    
    foo(idMp3);
};

function foo(cb) {
    document.querySelectorAll('.block-list').forEach(function(item) {
        const value = Number(item.getAttribute('value'));
        console.log(cb);
        if (cb === value) {
            document.querySelector('.video-list').remove();
            document.querySelectorAll('.block-list').forEach(function(item) {
                item.classList.remove('active');
            });
            item.classList.add('active');
            document.querySelector('.player-tools').setAttribute('value', `${item.getAttribute('value')}`);
            document.querySelector('[data-img-mp3]').setAttribute('src', `${item.querySelector('[data-img-list]').getAttribute('src')}`);
            document.querySelector('[data-mp3-artist]').textContent = item.querySelector('[data-artist-list]').textContent;
            document.querySelector('[data-mp3-song]').textContent = item.querySelector('[data-name-song-list]').textContent;

            const sng = `<video class="video-list" controls name="media">
                            <source data-src-mp3 src="${item.querySelector('video').getAttribute('src')}" type="audio/mpeg">
                        </video>`;
            document.querySelector('.song').insertAdjacentHTML('beforeend', sng);
            vid = document.querySelector('.video-list');
        };
    });
}