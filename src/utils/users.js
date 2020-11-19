const users = [];

const addUser = ({ id, username, room }) => {
  //Clean data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //Validate data
  if (!username || !room) {
    return {
      error: "Username and Room is required!",
    };
  }

  //Validate existance
  const exist = users.find((user) => {
    return user.username === username && user.room === room;
  });
  if (exist) {
    return {
      error: "Username has been taken!",
    };
  }

  const user = { id, username, room };
  users.push(user);
  return {undefined,user}
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id == id;
  });
  if(index !== -1){
      return user = users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => {
    return user.id == id;
  });
};

const getUsersInRoom = (room) => {
  return users.filter((user) => {
    return user.room == room;
  });
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}