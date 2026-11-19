// ===== 1. 화면 요소 가져오기 =====
// HTML에서 id로 표시해 둔 요소들을 찾아서 변수에 담아 둬요.
const todoInput = document.getElementById("todo-input");
const addButton = document.getElementById("add-button");
const todoList = document.getElementById("todo-list");
const emptyMessage = document.getElementById("empty-message");

// localStorage에 저장할 때 쓸 이름(열쇠)이에요.
const STORAGE_KEY = "todos";

// ===== 2. 할 일 데이터 =====
// 할 일 하나는 이런 모양의 객체예요.
//   { id: 1700000000000, text: "우유 사기", done: false }
//   - id   : 각 할 일을 구분하는 고유 번호
//   - text : 할 일 내용
//   - done : 완료했으면 true, 아니면 false
// 페이지가 열릴 때 저장된 목록을 불러와요. 저장된 게 없으면 빈 배열이에요.
let todos = loadTodos();

// ===== 3. 저장하기 / 불러오기 =====

// 현재 할 일 목록을 브라우저(localStorage)에 저장해요.
// localStorage는 글자(문자열)만 저장할 수 있어서 JSON.stringify로 배열을 글자로 바꿔요.
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 브라우저에 저장된 할 일 목록을 꺼내 와요.
// 저장할 때 글자로 바꿨으니, 꺼낼 때는 JSON.parse로 다시 배열로 되돌려요.
function loadTodos() {
  const saved = localStorage.getItem(STORAGE_KEY);

  // 저장된 게 없으면 빈 배열을 돌려줘요.
  if (saved === null) {
    return [];
  }

  // 저장된 내용이 망가져 있으면 오류가 날 수 있어서 try...catch로 감싸요.
  try {
    return JSON.parse(saved);
  } catch (error) {
    return [];
  }
}

// ===== 4. 화면 그리기 =====
// todos 배열의 내용대로 목록을 처음부터 다시 그려요.
// 데이터가 바뀔 때마다 이 함수를 부르면 화면이 항상 데이터와 같아져요.
function renderTodos() {
  // 기존 목록을 모두 지워요.
  todoList.innerHTML = "";

  // 할 일을 하나씩 꺼내서 화면에 한 줄씩 만들어요.
  todos.forEach(function (todo) {
    // <li> : 할 일 한 줄
    const li = document.createElement("li");
    li.className = "todo-item";
    if (todo.done) {
      li.classList.add("done"); // 완료된 항목에는 done 표시를 붙여 취소선이 보이게 해요.
    }

    // <span> : 할 일 글자
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text; // textContent는 입력한 글을 '글자 그대로' 넣어서 안전해요.

    // 완료 버튼 (이미 완료됐으면 '취소'로 보여요)
    const doneButton = document.createElement("button");
    doneButton.className = "done-button";
    doneButton.textContent = todo.done ? "취소" : "완료";
    doneButton.addEventListener("click", function () {
      toggleDone(todo.id);
    });

    // 삭제 버튼
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", function () {
      deleteTodo(todo.id);
    });

    // 만든 요소들을 <li> 안에 넣고, <li>를 목록(<ul>)에 넣어요.
    li.appendChild(span);
    li.appendChild(doneButton);
    li.appendChild(deleteButton);
    todoList.appendChild(li);
  });

  // 할 일이 하나도 없으면 안내 문구를 보여 주고, 있으면 숨겨요.
  emptyMessage.style.display = todos.length === 0 ? "block" : "none";
}

// ===== 5. 기능 함수들 =====

// 새 할 일 추가
function addTodo() {
  // 앞뒤 공백을 없앤 입력값
  const text = todoInput.value.trim();

  // 빈칸이면 추가하지 않고 끝내요.
  if (text === "") {
    alert("할 일을 입력해 주세요!");
    return;
  }

  // 새 할 일 객체를 만들어 배열 끝에 넣어요.
  // Date.now()는 현재 시각을 숫자로 알려 줘서 고유 번호로 쓰기 좋아요.
  todos.push({
    id: Date.now(),
    text: text,
    done: false,
  });

  saveTodos();   // 저장하고
  renderTodos(); // 화면을 다시 그려요.

  // 입력창을 비우고, 바로 다음 할 일을 입력할 수 있게 커서를 둬요.
  todoInput.value = "";
  todoInput.focus();
}

// 완료 상태 바꾸기 (완료 ↔ 미완료)
function toggleDone(id) {
  todos.forEach(function (todo) {
    if (todo.id === id) {
      todo.done = !todo.done; // true면 false로, false면 true로 뒤집어요.
    }
  });

  saveTodos();
  renderTodos();
}

// 할 일 삭제
function deleteTodo(id) {
  // filter는 조건에 맞는 것만 남긴 새 배열을 만들어요.
  // → 지울 id와 '다른' 항목만 남기면, 결국 그 항목만 빠져요.
  todos = todos.filter(function (todo) {
    return todo.id !== id;
  });

  saveTodos();
  renderTodos();
}

// ===== 6. 이벤트 연결 =====

// 추가 버튼을 클릭하면 addTodo 실행
addButton.addEventListener("click", addTodo);

// 입력창에서 Enter 키를 누르면 addTodo 실행
todoInput.addEventListener("keydown", function (event) {
  // event.isComposing : 한글을 조합하는 중이면 true (중복 추가를 막아요)
  if (event.key === "Enter" && !event.isComposing) {
    addTodo();
  }
});

// ===== 7. 시작 =====
// 페이지가 열리면 저장돼 있던 목록을 화면에 그려요.
renderTodos();
