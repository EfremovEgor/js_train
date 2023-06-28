document.getElementById("clear_btn").addEventListener("click", clear);
document.getElementById("add_btn").addEventListener("click", addProduct);
document.getElementById("add_file_btn").addEventListener("click", addFile);
document.getElementById("save_file_btn").addEventListener("click", saveFile);
document.getElementById("id_column").addEventListener("click", sortById);
document.getElementById("cals_column").addEventListener("click", sortByCals);
document
  .getElementById("amount_column")
  .addEventListener("click", sortByAmount);
document.getElementById("cals").addEventListener("keyup", checker);
document.getElementById("amount").addEventListener("keyup", checker);
document.getElementById("id").addEventListener("keyup", checker);
document.getElementById("name").addEventListener("keyup", checker);

addEventListener("load", checker);
let sort_reverse = false;
let sorted_by = "id";
let prev_sorted_by = "";
let Products = [];
function saveFile() {
  let a = document.createElement("a");
  let file = new Blob([JSON.stringify(Products)], { type: "application/json" });
  a.href = URL.createObjectURL(file);
  a.download = "save.json";
  a.click();
}
function addFile() {
  let input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    let file = e.target.files[0];

    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (readerEvent) => {
      let data = readerEvent.target.result;
      data = JSON.parse(data);
      Products = data;
      updateTable(Products);
    };
  };
  input.click();
}
function addProduct() {
  let id = parseInt(document.getElementById("id").value.trim());
  let name_ = document.getElementById("name").value.trim();
  let cals = parseFloat(document.getElementById("cals").value.trim());
  let is_vegetarian = document.getElementById("is_vegetarian").checked;
  let amount = parseInt(document.getElementById("amount").value);
  Products.push({
    id: id,
    name: name_,
    calories: cals,
    is_vegetarian: is_vegetarian,
    amount: amount,
  });
  document.getElementById("product_form").reset();
  sort_by(false);
  updateTable(Products);
}
function remove_element(element_name) {
  elem = document.getElementById(element_name);
  if (elem != null) {
    elem.remove();
  }
}
function checker() {
  check_id_input();
  check_cals_input();
  check_amount_input();
  check_name_input();
  document.getElementById("add_btn").disabled =
    document.getElementById("errors").children.length > 0;
}
function create_and_place_error_span(id, text) {
  const span = document.createElement("span");
  const spanText = document.createTextNode(text);
  span.appendChild(spanText);
  span.id = id;
  remove_element(id);
  document.getElementById("errors").appendChild(span);
}
function check_name_input() {
  let val = document.getElementById("name").value;
  if (val == null || val == "" || val.length <= 3) {
    create_and_place_error_span("name_error", "Неверное название");
  } else {
    remove_element("name_error");
  }
}

function check_amount_input() {
  let val = parseInt(document.getElementById("amount").value);
  if (isNaN(val) || val < 0) {
    create_and_place_error_span("amount_error", "Неверное количество");
  } else {
    remove_element("amount_error");
  }
}

function check_cals_input() {
  let val = parseFloat(document.getElementById("cals").value);
  if (isNaN(val) || val < 0) {
    create_and_place_error_span("cals_error", "Неверная калорийность");
  } else {
    remove_element("cals_error");
  }
}

function check_id_input() {
  let val = parseInt(document.getElementById("id").value);
  if (isNaN(val) || val < 0) {
    create_and_place_error_span("id_error", "Неверный Id");
  } else {
    ids = [];
    for (let product of Products) {
      ids.push(product["id"]);
    }
    if (ids.includes(val)) {
      create_and_place_error_span("id_error", "Id присутствует в таблице");
    } else {
      remove_element("id_error");
    }
  }
}

function clear() {
  Products = [];
  updateTable(Products);
}

function sortById() {
  prev_sorted_by = sorted_by;
  sorted_by = "id";
  sort_by();
}

function sortByCals() {
  prev_sorted_by = sorted_by;
  sorted_by = "calories";
  sort_by();
}

function sortByAmount() {
  prev_sorted_by = sorted_by;
  sorted_by = "amount";
  sort_by();
}

function sort_by(change_sorting = true) {
  if (change_sorting & (sorted_by == prev_sorted_by)) {
    newProduct = newProduct.reverse();
    updateTable(newProduct);
    return;
  }
  function compare(a, b) {
    return a[sorted_by] - b[sorted_by];
  }
  newProduct = Products.sort(compare);
  updateTable(newProduct);
}
function updateTable(newProduct) {
  checker();
  const table = document.getElementById("product_table");
  for (let child of Array.from(
    document.getElementById("product_table").children
  ).slice(1)) {
    child.remove();
  }
  for (let i = 0; i < newProduct.length; i++) {
    const row = document.createElement("tr");
    for (let [_, value] of Object.entries(Products[i])) {
      const cell = document.createElement("td");
      if (typeof value == "boolean") {
        value = value ? "Да" : "Нет";
      }
      const cellText = document.createTextNode(String(value));
      cell.appendChild(cellText);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}
