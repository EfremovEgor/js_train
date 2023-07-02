var timer = false;
var reloadTime = 5000; // ms

function reloadTimer() {
  if (!!timer) clearTimeout(timer);
  timer = setTimeout(function () {
    alert("Вы проиграли");
    top.location.reload();
  }, reloadTime);
}
//функция для установки параметров игры - размеров игрового поля
function settingsGameFunction() {
  //созаем форму для установки параметров игры - размера игрового поля
  //    let formSettingsGame = createSettingsGameForm();
  //    document.body.appendChild(formSettingsGame);
  let buttonNewGame = document.createElement("button");
  buttonNewGame.setAttribute("id", "idButtonNewGame");
  buttonNewGame.textContent = "Начать игру!!!";
  buttonNewGame.classList.add("idButtonNewGame");
  document.body.appendChild(buttonNewGame);

  const defaultBoardSize = 6;
  //  let mainBoardSize;
  //обработчик нажатия на кнопу - Начать игру
  buttonNewGame.addEventListener("click", function () {
    //        formSettingsGame.remove();
    buttonNewGame.remove();
    addTiles();
  });
}

//функция для перемешивания массива Алгоритм Фишера-Йетса (Fisher-Yates)
//реализация - взята с сайта learn.javascript.ru
function myShuffle(arrayToShuffle) {
  for (let index = arrayToShuffle.length - 1; index > 0; --index) {
    let j = Math.floor(Math.random() * (index + 1));
    [arrayToShuffle[index], arrayToShuffle[j]] = [
      arrayToShuffle[j],
      arrayToShuffle[index],
    ];
  }
}

//функция для создания игрового поля
function createBoardGame(size) {
  //mainIndex - переменная, которая используется
  //для создания id для каждой ячейки игрового поля
  let mainIndex = 0;
  let tempBoardGame = document.createElement("table");
  tempBoardGame.setAttribute("border", "1");
  tempBoardGame.setAttribute("id", "boardGameId");

  for (let indexRow = 0; indexRow < size; ++indexRow) {
    let trNew = document.createElement("tr");
    trNew.setAttribute("height", "150px");

    for (let indexCol = 0; indexCol < size; ++indexCol) {
      let tdNew = document.createElement("td");
      tdNew.setAttribute("width", "150px");
      tdNew.setAttribute("id", "number" + mainIndex++);
      tdNew.textContent = "*";
      trNew.appendChild(tdNew);
    }
    tempBoardGame.appendChild(trNew);
  }
  return tempBoardGame;
}
function addTiles() {
  let buttonTileAmount = document.createElement("button");
  buttonTileAmount.setAttribute("id", "idButtonTileAmount");
  buttonTileAmount.textContent = "Подтвердить";
  buttonTileAmount.classList.add("idButtonNewGame");
  document.body.appendChild(buttonTileAmount);

  let inputTileAmount = document.createElement("input");
  inputTileAmount.setAttribute("id", "idInputTileAmount");
  inputTileAmount.classList.add("idInputTileAmount");
  document.body.appendChild(inputTileAmount);

  buttonTileAmount.addEventListener("click", function () {
    buttonTileAmount.remove();
    inputTileAmount.remove();
    createNewGame(parseInt(inputTileAmount.value));
  });
}
//функция для создания новой игры
function createNewGame(size) {
  reloadTimer();
  //на всякий случай очищаем localStorage
  localStorage.clear();
  //console.log(localStorage);

  //массив с числами игры
  let arrayNumber = [];

  //счетчик правильных ответов
  let countRightAnswer = 0;

  //заполняем массив числами
  for (let index = 0; index < size * size; ++index)
    if (index < (size * size) / 2) arrayNumber[index] = index;
    else arrayNumber[index] = index - (size * size) / 2;
  console.log(arrayNumber);

  //перемешиваем массив
  myShuffle(arrayNumber);
  console.log(arrayNumber);

  //создаем игровое поле
  let boardGame = createBoardGame(size);
  document.body.appendChild(boardGame);

  //функция, которая обрабатывает нажатие на карточку игрового поля
  //это сделано в виде отдельной функции для того, чтобы впоследствии можно было
  //сделать удаление обработчика через removeEventListener
  function mainClickFunction(evnt) {
    //проверяем, была ли уже открыта карточка.
    //если открыта, то localStorage не пустой
    if (!localStorage.length) {
      localStorage.setItem("idElem", evnt.target.id);
      localStorage.setItem("numberElem", arrayNumber[evnt.target.id.slice(6)]);
      evnt.target.textContent = `${arrayNumber[evnt.target.id.slice(6)]}`;
      console.log(localStorage);
    }
    //в if делается проверка на повторное нажатие на ту же клетку игрового поля
    else {
      if (evnt.target.id !== localStorage.getItem("idElem")) {
        //очищаем память от предыдущего нажатия
        //localStorage.clear();

        let tempId = localStorage.getItem("idElem");
        let tempNumber = localStorage.getItem("numberElem");
        let newNumber = arrayNumber[evnt.target.id.slice(6)];
        evnt.target.textContent = `${newNumber}`;
        //проверяем, была ли уже открыта такая карточка
        if (parseInt(newNumber) === parseInt(tempNumber)) {
          document.getElementById(evnt.target.id).classList.add("answerOk");
          document.getElementById(tempId).classList.add("answerOk");

          //проверка если открыто все игровое поле
          if (++countRightAnswer == (size * size) / 2) {
            //удаляем обработчик нажатия на кнопку
            boardGame.removeEventListener("click", mainClickFunction);

            //divCounter.textContent = "Поздравляем!!!!";
            alert("Поздравляем!!!!");
            //делаем кнопку  - Играть еще раз
            let buttonNewGame = document.createElement("button");
            buttonNewGame.setAttribute("id", "idButtonNewGame");
            buttonNewGame.textContent = "Сыграть ещё раз";
            buttonNewGame.classList.add("idButtonNewGame");
            let marginLeftButton = ((size / 2) * 150) / 2 - 60;
            buttonNewGame.style.marginLeft = marginLeftButton + "px";
            document.body.appendChild(buttonNewGame);

            //остановка счетчика
            //clearInterval(intervalParam);

            //обработка кнопки - играть еще раз
            buttonNewGame.addEventListener("click", function () {
              //divCounter.remove();
              buttonNewGame.remove();
              boardGame.remove();
              settingsGameFunction();
            });
          }
        }

        //если открыты разные карточки
        else {
          //задержка в 0.5 секунду перед поворотм обеих карточек
          setTimeout(function () {
            document.getElementById(tempId).textContent = "*";
            document.getElementById(evnt.target.id).textContent = "*";
          }, 500);
        }
        localStorage.clear();
      }
    }
  }
  boardGame.addEventListener("click", mainClickFunction);
}
