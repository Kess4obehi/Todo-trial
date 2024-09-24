const list_el = document.getElementById("list");
const create_btn_el = document.getElementById("create");

let todos = [];

create_btn_el.addEventListener('click', createNewTodo);

function createNewTodo () {
  const item = {
    id: new Date().getTime(),
    text: "",
    complete: false,
    startDate: "",
    finishDate: "",
    priority: "low",
    category: "work",
    notes: "",
    reminder: ""
  }

  todos.unshift(item);

  const { item_el, input_el } = createTodoElement(item);

  list_el.prepend(item_el);
  input_el.removeAttribute("disabled");
  input_el.focus();
}

/* HTML structure for a todo item with additional fields */
function createTodoElement(item) {
  const item_el = document.createElement("div");
  item_el.classList.add("item");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = item.complete;

  if (item.complete) {
    item_el.classList.add("complete");
  }

  const input_el = document.createElement("input");
  input_el.type = "text";
  input_el.value = item.text;
  input_el.setAttribute("disabled", "");

  const toggle_details_btn = document.createElement("button");
  toggle_details_btn.classList.add("toggle-details");
  toggle_details_btn.innerText = "Show Details";

  const details_el = document.createElement("div");
  details_el.classList.add("details");

  // Start and Finish dates
  const start_date_el = document.createElement("input");
  start_date_el.type = "date";
  start_date_el.value = item.startDate;
  start_date_el.classList.add("start-date");

  const finish_date_el = document.createElement("input");
  finish_date_el.type = "date";
  finish_date_el.value = item.finishDate;
  finish_date_el.classList.add("finish-date");

  // Priority
  const priority_el = document.createElement("select");
  priority_el.classList.add("priority");
  priority_el.innerHTML = `
    <option value="low" ${item.priority === "low" ? "selected" : ""}>Low</option>
    <option value="medium" ${item.priority === "medium" ? "selected" : ""}>Medium</option>
    <option value="high" ${item.priority === "high" ? "selected" : ""}>High</option>
  `;

  // Category
  const category_el = document.createElement("select");
  category_el.classList.add("category");
  category_el.innerHTML = `
    <option value="work" ${item.category === "work" ? "selected" : ""}>Work</option>
    <option value="personal" ${item.category === "personal" ? "selected" : ""}>Personal</option>
    <option value="home" ${item.category === "home" ? "selected" : ""}>Home</option>
  `;

  // Notes
  const notes_el = document.createElement("textarea");
  notes_el.classList.add("notes");
  notes_el.value = item.notes;
  notes_el.placeholder = "Add detailed notes...";

  // Reminder
  const reminder_el = document.createElement("input");
  reminder_el.type = "datetime-local";
  reminder_el.classList.add("reminder");
  reminder_el.value = item.reminder;

  const actions_el = document.createElement("div");
  actions_el.classList.add("actions");

  const edit_btn_el = document.createElement("button");
  edit_btn_el.classList.add("material-icons");
  edit_btn_el.innerText = "edit";

  const remove_btn_el = document.createElement("button");
  remove_btn_el.classList.add("material-icons", "remove-btn");
  remove_btn_el.innerText = "delete";

  actions_el.append(edit_btn_el);
  actions_el.append(remove_btn_el);

  // Append details section elements
  details_el.append(
    createLabelElement("Start:"), start_date_el,
    createLabelElement("Finish:"), finish_date_el,
    createLabelElement("Priority:"), priority_el,
    createLabelElement("Category:"), category_el,
    createLabelElement("Notes:"), notes_el,
    createLabelElement("Reminder:"), reminder_el
  );

  // Add all elements to the main item
  item_el.append(checkbox, input_el, toggle_details_btn, details_el, actions_el);

  // EVENTS
  checkbox.addEventListener("change", () => {
    item.complete = checkbox.checked;
    item_el.classList.toggle("complete", item.complete);
    Save();
  });

  input_el.addEventListener("input", () => {
    item.text = input_el.value;
  });

  input_el.addEventListener("blur", () => {
    input_el.setAttribute("disabled", "");
    Save();
  });

  edit_btn_el.addEventListener("click", () => {
    input_el.removeAttribute("disabled", "");
    input_el.focus();
  });

  remove_btn_el.addEventListener("click", () => {
    todos = todos.filter(t => t.id != item.id);
    item_el.remove();
    Save();
  });

  toggle_details_btn.addEventListener("click", () => {
    details_el.classList.toggle("show");
    toggle_details_btn.innerText = details_el.classList.contains("show") ? "Hide Details" : "Show Details";
  });

  // Event listeners for new fields
  start_date_el.addEventListener("input", () => {
    item.startDate = start_date_el.value;
    Save();
  });

  finish_date_el.addEventListener("input", () => {
    item.finishDate = finish_date_el.value;
    Save();
  });

  priority_el.addEventListener("change", () => {
    item.priority = priority_el.value;
    Save();
  });

  category_el.addEventListener("change", () => {
    item.category = category_el.value;
    Save();
  });

  notes_el.addEventListener("input", () => {
    item.notes = notes_el.value;
    Save();
  });

  reminder_el.addEventListener("input", () => {
    item.reminder = reminder_el.value;
    Save();
  });

  return { item_el, input_el, edit_btn_el, remove_btn_el };
}

function createLabelElement(text) {
  const label = document.createElement("label");
  label.innerText = text;
  return label;
}

function DisplayTodos() {
  Load();

  for (let i = 0; i < todos.length; i++) {
    const item = todos[i];
    const { item_el } = createTodoElement(item);
    list_el.append(item_el);
  }
}

DisplayTodos();

function Save() {
  const save = JSON.stringify(todos);
  localStorage.setItem("my_todos", save);
}

function Load() {
  const data = localStorage.getItem("my_todos");

  if (data) {
    todos = JSON.parse(data);
  }
}
