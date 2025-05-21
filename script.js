let isEdit = false;
let currentUser = null;

document.getElementById("formid").addEventListener("submit", function (e) {
  e.preventDefault();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = {
    id: isEdit ? currentUser : Date.now(), 
    idate: document.getElementById("idate").value,
    income_exp: document.getElementById("dropdown").value,
    desc: document.getElementById("desc").value,
    amount: document.getElementById("amount").value
  };

  if (isEdit) {
   
    const index = users.findIndex((u) => u.id === currentUser);
    users[index] = user;
    isEdit = false;
    currentUser = null;
  } else {
    users.push(user); 
  }

  localStorage.setItem("users", JSON.stringify(users));
  document.getElementById("formid").reset();
  displayData();
});


function displayData() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  const radiobtn = document.querySelector('input[name="anyone"]:checked');
  const filterType = radiobtn ? radiobtn.value : "all";

  let filteredUsers = [];

  if (filterType === "all") {
    filteredUsers = users;
  } else {
    filteredUsers = users.filter((user) => user.income_exp.toLowerCase() === filterType);
  }

  filteredUsers.forEach((element, index) => {
    const tr = document.createElement("tr");
    tr.setAttribute("class", "bg-gray-300 font-semibold border-b border-gray-200");
    tr.innerHTML = `
      <td class="px-6 py-4 text-center">${index + 1}</td>
      <td class="px-6 py-4">${element.idate}</td>
      <td class="px-6 py-4">${element.income_exp}</td>
      <td class="px-6 py-4">${element.desc}</td>
      <td class="px-6 py-4">${element.amount}</td>
      <td class="px-6 py-4">
        <button class='bg-emerald-400 border rounded-xl text-xs px-2 w-[50px]' onclick='updateUser(${element.id})'>Edit</button>
        <button class='bg-red-400 border rounded-xl text-xs px-2' onclick='deleteUser(${element.id})'>Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  const totalIncome = users
    .filter((u) => u.income_exp.toLowerCase() === "income")
    .reduce((sum, u) => sum + Number(u.amount), 0);

  const totalExpenses = users
    .filter((u) => u.income_exp.toLowerCase() === "expenses")
    .reduce((sum, u) => sum + Number(u.amount), 0);

  const netBalance = totalIncome - totalExpenses;

  
  document.getElementById("tincome").textContent = `Income: ₹ ${totalIncome}`;
  document.getElementById("texpenses").textContent = `Expenses: ₹ ${totalExpenses}`;
  document.getElementById("netbalance").textContent = `Net Balance: ₹ ${netBalance}`;
}

document.querySelectorAll('input[name="anyone"]').forEach(radio => {
  radio.addEventListener("change", displayData);
});


function updateUser(id) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.id === id);

  
  document.getElementById("idate").value = user.idate;
  document.getElementById("dropdown").value = user.income_exp;
  document.getElementById("desc").value = user.desc;
  document.getElementById("amount").value = user.amount;

  isEdit = true;
  currentUser = id;
}


function deleteUser(id) {
  const isDelete = confirm("Are you sure you want to delete this?");
  if (!isDelete) return;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.filter((user) => user.id !== id);
  localStorage.setItem("users", JSON.stringify(users));
  displayData();
}
displayData();
