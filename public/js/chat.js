const socket = io('http://localhost:3000');


function addInfoUserLogged({ name, avatar }) {
  document.querySelector(".user_logged").innerHTML += `
    <img 
      class="avatar_user_logged" 
      src=${avatar} 
    />
    <strong id="user_logged">${name}</strong>
  `;
}

function addUserList(user) {
  const userList = document.getElementById("users_list");
  userList.innerHTML += `
    <li 
      class="user_name_list" 
      id="user_${user._id}" 
      idUser="${user._id}"
    >
      <img 
        class="nav_avatar" 
        src=${user.avatar}
      />
      ${user.name}
    </li>
  `
}

(function onLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  const avatar = urlParams.get("avatar");
  const email = urlParams.get("email");

  addInfoUserLogged({ avatar, name });

  socket.emit("start", {
    name,
    email,
    avatar
  });

  socket.on("new_users", data => {
    const existsInDiv = document.getElementById(`user_${data._id}`);

    if (!existsInDiv) {
      addUserList(data);
    }

  });

  socket.emit("get_users", (users) => {
    users.map((user) => {
      if (user.email !== email) {
        addUserList(user);
      }
    })
  })
}());