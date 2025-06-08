document.addEventListener('DOMContentLoaded', function() {
    const doors = document.querySelectorAll('.door');
    const changeChoiceBtn = document.getElementById('change-choice');
    const keepChoiceBtn = document.getElementById('keep-choice');
    const restartBtn = document.getElementById('restart');
    const messageEl = document.querySelector('.message');
    
    let prizeDoor;
    let selectedDoor = null;
    let openedDoor = null;
    let gameState = 'initial';
    
    function startNewGame() {
        prizeDoor = Math.floor(Math.random() * 3) + 1;
        
        doors.forEach(door => {
            door.classList.remove('selected', 'opened');
            const doorBack = door.querySelector('.door-back');
            doorBack.classList.remove('car', 'goat');
        });
        selectedDoor = null;
        openedDoor = null;
        gameState = 'initial';
        messageEl.textContent = 'Выберите дверь';
        
        changeChoiceBtn.disabled = true;
        keepChoiceBtn.disabled = true;
    }
    
    function hostOpenDoor() {
        const doorsToOpen = Array.from(doors).filter(door => {
            const doorNum = parseInt(door.getAttribute('data-door'));
            return doorNum !== selectedDoor && doorNum !== prizeDoor;
        });
        
        const doorToOpen = doorsToOpen[Math.floor(Math.random() * doorsToOpen.length)];
        const doorNum = parseInt(doorToOpen.getAttribute('data-door'));

        doorToOpen.classList.add('opened');
        const doorBack = doorToOpen.querySelector('.door-back');
        doorBack.classList.add('goat');
        openedDoor = doorNum;
        gameState = 'first-choice';
        messageEl.textContent = 'Хотите изменить выбор?';

        changeChoiceBtn.disabled = false;
        keepChoiceBtn.disabled = false;
    }
    
    function finishGame() {
        doors.forEach(door => {
            const doorNum = parseInt(door.getAttribute('data-door'));
            const doorBack = door.querySelector('.door-back');
            
            if (doorNum === prizeDoor) {
                doorBack.classList.add('car');
            } else if (doorNum !== openedDoor) {
                doorBack.classList.add('goat');
            }
            
            door.classList.add('opened');
        });

        const isWinner = selectedDoor === prizeDoor;
        messageEl.textContent = isWinner 
            ? 'Вы выиграли автомобиль!' 
            : 'Вы проиграли(';
        
        gameState = 'final';
    }

    doors.forEach(door => {
        door.addEventListener('click', function() {
            if (gameState !== 'initial') return;
            
            const doorNum = parseInt(this.getAttribute('data-door'));
            selectedDoor = doorNum;
            
            doors.forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');

            hostOpenDoor();
        });
    });
    
    changeChoiceBtn.addEventListener('click', function() {
        if (gameState !== 'first-choice') return;
        
        const availableDoors = Array.from(doors).filter(door => {
            const doorNum = parseInt(door.getAttribute('data-door'));
            return doorNum !== selectedDoor && doorNum !== openedDoor;
        });
        
        if (availableDoors.length !== 1) return;
        doors.forEach(d => d.classList.remove('selected'));
        availableDoors[0].classList.add('selected');
        selectedDoor = parseInt(availableDoors[0].getAttribute('data-door'));

        finishGame();
    });
    
    keepChoiceBtn.addEventListener('click', function() {
        if (gameState !== 'first-choice') return;
        finishGame();
    });

    restartBtn.addEventListener('click', startNewGame);
    startNewGame();
});