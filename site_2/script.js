// Функция проверяет поле, подаваемое на вход
let validateStrigField = function (fieldName, humanName) {
  // Заводим массив ошибок
  let errors = [];
  let field = $("[name='" + fieldName + "']");

  // Если поле не заполнено, то не принимаем его
  if (field.val() == "" || field.val().length < 3) {
    field.addClass("bad");
    field.removeClass("good");

    errors.push(
      field.val() == ""
        ? "Поле " + humanName + " не заполнено"
        : "Поле " + humanName + " содержит мало символов"
    );
  }
  // В противном случае нам оно подходит
  else {
    field.addClass("good");
    field.removeClass("bad");
  }
  // Возвращаем полученные ошибки
  return errors;
};

// Функция проверяет все поля
let checkFields = function () {
  // Заводим массив ошибок
  let errors = [];

  // Проверяем поле фамилии
  errors = errors.concat(validateStrigField("surname", "Фамилия"));
  // Проверяем поле имени
  errors = errors.concat(validateStrigField("name", "Имя"));
  // Проверяем поле комментариев
  errors = errors.concat(validateStrigField("comment", "Комментарий"));

  let ageField = $("input[name='age']");

  // Проверяем поле возраста на 18 <= age <= 45
  if (
    parseInt(ageField.val().trim()) >= 18 &&
    parseInt(ageField.val().trim()) <= 45
  ) {
    ageField.addClass("good");
    ageField.removeClass("bad");
    console.log("ok");
  } else {
    ageField.addClass("bad");
    ageField.removeClass("good");
    errors.push("Поле Возраст должно быть между 18 и 45");
  }

  // Если не поставлена галочка
  if (!$("#checkbox").is(":checked")) {
    errors.push("Согласитесь отдать нам данные");
  }

  // Выводим ошибки в консоль
  console.log(errors);
  updateErrors(errors);

  // Возвращаем массив ошибок
  return errors;
};

// Функция обновляет ошибки
let updateErrors = function (__errors) {
  $(".error").empty();

  __errors.forEach(function (error) {
    $(".error")
      .add("<p>" + error + "</p>")
      .appendTo($(".error"));
  });
};

// Функция проверяет форму
let validateForm = function () {
  if (checkFields().length === 0) {
    $("#send_btn").addClass("active");
    $("#send_btn").prop("disabled", false);
  } else {
    $("#send_btn").removeClass("");
    $("#send_btn").prop("disabled", true);
  }
};
// Функция перепроверяет форму
let revalidateForm = function () {
  let surname = $("input[name='surname']");

  if (
    surname.hasClass("good") ||
    surname.hasClass("bad") ||
    !$("#checkbox").is(":checked")
  ) {
    validateForm();
  }
};

$("#send_btn").click(function () {
  if (checkFields().length === 0) alert("Форма отправлена!");
  $("#contact_form")[0].reset();
  $(".good").removeClass("good");
  $(".bad").removeClass("bad");
});
$("#rmv").click(function () {
  $("#contact_form")[0].reset();
  $(".good").removeClass("good");
  $(".bad ").removeClass("bad");
});
$("#checkbox").click(function () {
  validateForm();
});
$("input,textarea").on("keyup change", function () {
  revalidateForm();
});
