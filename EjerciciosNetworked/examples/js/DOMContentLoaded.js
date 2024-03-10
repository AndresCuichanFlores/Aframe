

document.addEventListener('DOMContentLoaded', () => {
    console.log("################## DOMContentLoaded -- DOM CARGADO ##################");
    const form = document.querySelector('#form');
    const input = document.querySelector('#input');
    const username = document.querySelector('#username-overlay');
    const log = document.querySelector('.messages');

    // when you want to send a message
    form.addEventListener('submit', (evt) => {
        evt.preventDefault();
        console.log("################## DOMContentLoaded -- SUBIT ##################");

        if (input.value === '') {
            alert('Please enter a message');
            return; 
        } else {
            log.textContent += username.value + ': ' + input.value + '\n';
            document.getElementById('player').setAttribute('player-info', 'message', input.value);
        }

        NAF.connection.broadcastDataGuaranteed('chat', {
            txt: input.value,
            name: username.value
        });

        input.value = '';
        log.scrollTop = log.scrollHeight;
    });

    // when a "chat" type message arrives
    NAF.connection.subscribeToDataChannel('chat', (senderId, dataType, data, targetId) => {
        log.textContent += data.name + ': ' + data.txt + '\n';
        log.scrollTop = log.scrollHeight;
    });
});
